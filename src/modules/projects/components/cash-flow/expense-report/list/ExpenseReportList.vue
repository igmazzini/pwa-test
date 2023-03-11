<template>
    <div class="list-container">
        <Teleport v-if="showMobileSearch" to=".page-layout">
            <SearchMobile :target="'cashYields'" @on-accept="onSearchMobileResult" @on-cancel="onSearchMobileCancel" />
        </Teleport>
        <div class="list-container-search">
            <SearchBar ref="search" @on-search-tap="onSearchTap" @on-search="onSearchResult"
                :filters="['Credito', 'Debito']" :filterTarget="'transaction_type'" :target="'cashYields'" />
        </div>

        <div v-if="mobile" class="mobile-list-container">
            <div class="mobile-list">
                <div class="mobile-list-row" @click="setCurrentExpenseReport(expenseReport)"
                    v-for="expenseReport in searchResults" :key="expenseReport.expense_report_id">
                    <p>
                        {{ expenseReport?.product?.product_code }}
                        {{ substring(expenseReport?.product.product_name, 27) }}
                    </p>

                    <p>{{ formatAmount(expenseReport?.amount) }}</p>
                </div>

            </div>
        </div>

        <div :class="['table-container', (searchResults.length === 0) ? 'table-empty' : '']" v-if="!mobile">
            <p v-if="searchResults.length === 0">No hay rendiciones en este proyecto</p>
            <div v-if="searchResults.length > 0" class="list-table">
                <div class="list-table-head list-table-row ">
                    <span class="list-table-item"><input class="form-check-input" @change="onCheckAll" type="checkbox" value="" name="check-all" /></span>
                    <span class="list-table-item">Codigo</span>
                    <span class="list-table-item">Item</span>
                    <span class="list-table-item">Rubro</span>
                    <span class="list-table-item">Fecha</span>
                    <span class="list-table-item">Monto</span>

                </div>
                <div class="list-table-body">
                    <div class="list-table-row" @click="setCurrentExpenseReport(expenseReport)"  v-for="expenseReport in searchResults" :key="expenseReport.expense_report_id"
                        :class="(expenseReport.expense_report_id == currentExpenseReport?.expense_report_id) ? 'list-table-row-active' : ''">
                        <span class="list-table-item"> <input class="form-check-input" @change="onCheck(expenseReport)"  type="checkbox" value="" name="expense-check" /></span>
                        <span class="list-table-item">{{ expenseReport?.expense_report_code }}</span>
                        <span class="list-table-item">{{ expenseReport?.product?.product_code }} {{
                            substring(expenseReport?.product?.product_name, 20) }}</span>
                        <span class="list-table-item">{{ substring(expenseReport?.product?.category?.category_name, 20)
                        }}</span>
                        <span class="list-table-item">{{ formatDate(expenseReport?.date_created, true) }}</span>
                        <span class="list-table-item">{{ formatAmount(expenseReport?.amount) }}</span>
                    </div>


                </div>
            </div>

        </div>
        <div v-if="!mobile" class="list-container-total">
            <p>Total: {{ formatAmount(totalAmountSelected) }}</p>
        </div>

    </div>
</template>

<script>
import { SearchBar, SearchMobile } from '@/modules/shared/components';
import { useUI } from "@/modules/shared/composables/useUI";
import { useExpenseReports } from '@/modules/projects/composables';
import { ref, watch } from "vue";
export default {
    name: "ExpenseReportList",
    components: {
        SearchBar,
        SearchMobile,
    },

    setup() {

        const { mobile, substring, formatAmount, formatDate } = useUI();
        const { expenseReports, currentExpenseReport, setCurrentExpenseReport } = useExpenseReports();


        const showMobileSearch = ref(false);
        const searchResults = ref([]);
        const totalAmountSelected = ref(0);


        searchResults.value = expenseReports.value;

        setCurrentExpenseReport(null);


        watch(expenseReports, () => {
            setCurrentExpenseReport(null);
            searchResults.value = sortExpenseReports(expenseReports.value);
        });

        const onSearchTap = () => {
            showMobileSearch.value = true;
        };

        const onSearchMobileResult = (result) => {



            const cashYiled = expenseReports.value.find(
                (cy) => cy.transaction_id == result.transaction_id
            );

            showMobileSearch.value = false;

            setCurrentExpenseReport(cashYiled);


        };

        const onSearchMobileCancel = () => {
            showMobileSearch.value = false;
        };

        const sortExpenseReports = (target) => {

            return target.sort((a, b) => {

                const dateA = new Date(a.date_created).getTime(); // ignore upper and lowercase
                const dateB = new Date(b.date_created).getTime(); // ignore upper and lowercase

                // sort in an ascending order
                if (dateA < dateB) {
                    return 1;
                } else {
                    return -1
                }

            })
        };

        const onSearchResult = (results, filters, resultSelected) => {

            console.log(results, filters)

            if (results.length > 0 || filters) {

                searchResults.value = sortExpenseReports(results);

                if (resultSelected) {

                    setCurrentExpenseReport(resultSelected);
                }

            } else {
                searchResults.value = sortExpenseReports(expenseReports.value);

                setCurrentExpenseReport(null);

            }
        };


        const onCheck = (expenseReport) => {



            if (event.target.checked) {
                totalAmountSelected.value += Number(expenseReport.amount);
            } else {
                totalAmountSelected.value -= Number(expenseReport.amount);

                if(totalAmountSelected.value < 0){
                   totalAmountSelected.value = 0;
                }

                const checkAll = document.getElementsByName('check-all');               

                if(checkAll[0].checked){
                    checkAll[0].checked = false;
                }
            }


        }

        const onCheckAll = () => {

            const checkboxes = document.getElementsByName('expense-check');

            for (let i = 0; i < checkboxes.length; i++) {

                checkboxes[i].checked = event.target.checked;

            }

            if (event.target.checked) {

                expenseReports.value.forEach( er => {
                    totalAmountSelected.value += Number(er.amount);
                });
            } else {
                totalAmountSelected.value = 0;
            }
        }



        return {
            //Properties

            mobile,
            showMobileSearch,
            searchResults,
            currentExpenseReport,
            totalAmountSelected,

            //Methods
            onSearchTap,
            onSearchMobileResult,
            onSearchMobileCancel,
            onSearchResult,
            setCurrentExpenseReport,
            onCheck,
            onCheckAll,
            substring,
            formatAmount,
            formatDate
        };
    },
};
</script>

<style lang="scss" scoped>
.list-container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 10% 1fr;
}

.list-container-search .search-container {
    z-index: 2;

}

.mobile-list-row {
    grid-template-columns: 1fr 30%;
}


.table-container {
    background-color: var(--light-background-color);
    transition: all var(--animation-duration) var(--animation-type);
    border-radius: 16px;
    position: relative;

}

.table-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: RobotoLight;
    color: var(--light-text-color);

    p {
        margin: 0;
        font-size: 1.5em;
        color: inherit;
        transition: all var(--animation-duration) var(--animation-type);
    }

}

.dark .table-empty {
    color: var(--dark-text-color);
}


.dark .table-container {
    background-color: var(--dark-background-color);
}

/* .list-table{
    height: v-bind(listHeight);
} */
.list-table-row {
    grid-template-columns: 7% 15% 1fr 1fr 20% 15%;
}


.list-table-item:nth-child(1) {
    padding-left: 15px;
}

.list-table-head .list-table-item:nth-child(1) {
    padding-left: 15px;
}

.list-container-total {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 5px;
    border-radius: 16px;
    background-color: var(--light-background-color);
    font-family: RobotoLight;
    color: var(--light-text-color);
    transition: all var(--animation-duration) var(--animation-type);

    p {
        color: inherit;
        margin: 0;
        padding: 10px;
        border-radius: inherit;
        transition: all var(--animation-duration) var(--animation-type);
    }
}

.dark .list-container-total {
    color: var(--dark-text-color);
    background-color: var(--dark-background-color);
}


@media screen and (max-width:1300px) {
    .list-container {
        padding: 5px;
        margin-top: 5px;
        grid-template-rows: 55px 1fr;

    }

    li {
        font-size: 1em;
    }
}
</style>
