<template>
    <div class="list-container">
        <Teleport v-if="showMobileSearch" to=".page-layout">
            <SearchMobile :target="'cashRequests'" @on-accept="onSearchMobileResult" @on-cancel="onSearchMobileCancel" />
        </Teleport>
        <div class="list-container-search">
            <SearchBar class="animate__animated animate__fadeInRight animate__faster" ref="search" @on-search-tap="onSearchTap"
                @on-search="onSearchResult" :filterTarget="'transaction_type'" :target="'cashRequests'" />
        </div>
        <div v-if="mobile" class="mobile-list-container">
            <div class="mobile-list">
                <div class="mobile-list-row" @click="setCurrentMoneyOrdered(moneyOrdered)" v-for="moneyOrdered in searchResults" :key="moneyOrdered">
                    <p>{{ moneyOrdered?.profile.name }}</p>
                    <p> {{ moneyOrdered?.product?.product_code }} {{ substring(moneyOrdered?.product.product_name, 11) }} </p>
                    <p>{{ formatAmount(moneyOrdered?.amount) }}</p>
                </div>
            </div>
        </div>
        <div v-if="!mobile" :class="['table-container', (searchResults.length === 0) ? 'table-empty' : '']">
            <p v-if="searchResults.length === 0">No hay solicitudes en este proyecto</p>
            <div v-if="searchResults.length > 0" class="list-table">
                <div class="list-table-head list-table-row ">
                    <span class="list-table-item"><input class="form-check-input" @change="onCheckAll" type="checkbox" value="" name="check-all" /></span>
                    <span class="list-table-item">Codigo</span>
                    <span class="list-table-item">Solicitante</span>
                    <span class="list-table-item">Item</span>
                    <span class="list-table-item">Fecha</span>
                    <span class="list-table-item">Monto</span>
                    <span class="list-table-item">Estado</span>
                </div>
                <div class="list-table-body">
                    <div class="list-table-row" @click="setCurrentMoneyOrdered(moneyOrdered)" :class="(moneyOrdered.money_ordered_id == currentMoneyOrdered?.money_ordered_id) ? 'list-table-row-active' : ''" v-for="moneyOrdered in searchResults" :key="moneyOrdered.money_ordered_id">
                        <span class="list-table-item"><input class="form-check-input" @change="onCheck(moneyOrdered)"  type="checkbox" value="" name="money-check" /></span>
                        <span class="list-table-item">{{ moneyOrdered?.money_ordered_code }}</span>
                        <span class="list-table-item">{{ moneyOrdered?.profile.name }}</span>
                        <span class="list-table-item">{{ moneyOrdered?.product?.product_code }} {{ substring(moneyOrdered?.product.product_name, 17) }}</span>
                        <span class="list-table-item">{{ formatDate(moneyOrdered?.date_created,true) }}</span>
                        <span class="list-table-item">{{ formatAmount(moneyOrdered?.amount) }}</span>
                        <span class="list-table-item" :class="moneyOrdered?.status.toLowerCase()">{{ getStatus(moneyOrdered?.status) }}</span>
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

import { ref, watch } from "vue";
import {SearchBar, SearchMobile} from "@/modules/shared/components";
import { useUI } from "@/modules/shared/composables/useUI";
import { useMoneyOrdered } from '@/modules/projects/composables/money-ordered/useMoneyOrdered';

export default {
    name: "MoneyOrderedList",
    components: {
        SearchBar,
        SearchMobile,
    },
    setup() {

        

        const { mobile, substring, formatAmount, formatDate, getStatus } = useUI();
        const { moneyOrdered, currentMoneyOrdered, setCurrentMoneyOrdered } = useMoneyOrdered();
        const showMobileSearch = ref(false);
        const searchResults = ref([]);
        const totalAmountSelected = ref(0);


        searchResults.value = moneyOrdered.value;


        watch(moneyOrdered, () => {

            //setCurrentMoneyOrdered(null);
            searchResults.value = sortMoneyOrdered(moneyOrdered.value);

           


        });

        const onSearchTap = () => {
            showMobileSearch.value = true;
        };

        const onSearchMobileResult = (result) => {

            const cashYiled = moneyOrdered.value.find(
                (cy) => cy.transaction_id == result.transaction_id
            );

            showMobileSearch.value = false;

            setCurrentMoneyOrdered(cashYiled);


        };

        const onSearchMobileCancel = () => {
            showMobileSearch.value = false;
        };

        const sortMoneyOrdered = (target) => {
            return target.sort((a, b) => {
                const nameA = a.product?.product_code.toUpperCase(); // ignore upper and lowercase
                const nameB = b.product?.product_code.toUpperCase(); // ignore upper and lowercase

                // sort in an ascending order
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            });
        };

        const onSearchResult = (results, filters, resultSelected) => {
           
            if (results.length > 0 || filters) {


                searchResults.value = sortMoneyOrdered(results);

                if (resultSelected) {

                    setCurrentMoneyOrdered(resultSelected);
                }

                
            } else {
                searchResults.value = sortMoneyOrdered(moneyOrdered.value);

                setCurrentMoneyOrdered(null);
               
            }
        };

        const onCheck = (moneyOrdered) => {


            if (event.target.checked) {
                totalAmountSelected.value += Number(moneyOrdered.amount);
            } else {

                totalAmountSelected.value -= Number(moneyOrdered.amount);

                if (totalAmountSelected.value < 0) {
                    totalAmountSelected.value = 0;
                }

                const checkAll = document.getElementsByName('check-all');               

                if(checkAll[0].checked){
                    checkAll[0].checked = false;
                }
            }

        }

        const onCheckAll = () => {

            const checkboxes = document.getElementsByName('money-check');

            for (let i = 0; i < checkboxes.length; i++) {

                checkboxes[i].checked = event.target.checked;

            }

            if (event.target.checked) {

                moneyOrdered.value.forEach( money => {
                    totalAmountSelected.value += Number(money.amount);
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
            currentMoneyOrdered,
            totalAmountSelected,

            //Methods
            onSearchTap,
            onSearchMobileResult,
            onSearchMobileCancel,
            onSearchResult,
            onCheck,
            onCheckAll,
            setCurrentMoneyOrdered,
            getStatus,
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
    grid-template-columns: 1fr 1fr 25%;
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



/* .list-table{
    height: v-bind(listHeight);
} */
.list-table-row {
    grid-template-columns: 7% 10% 17% 1fr 20% 12% 15%;
}

.list-table-item:nth-child(1) {
    padding-left: 15px;
}

.dark .table-container {
    background-color: var(--dark-background-color);

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
}</style>
