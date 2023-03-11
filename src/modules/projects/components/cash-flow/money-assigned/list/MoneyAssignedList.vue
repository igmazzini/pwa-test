<template>
    <div class="list-container">
        <Teleport v-if="showMobileSearch" to=".page-layout">
            <SearchMobile  :target="'cashDeliverys'" @on-accept="onSearchMobileResult"
                @on-cancel="onSearchMobileCancel" />
        </Teleport>
        <div class="list-container-search">
            <SearchBar class="animate__animated animate__fadeInRight animate__faster" ref="search"
                @on-search-tap="onSearchTap" @on-search="onSearchResult" 
                :filterTarget="'transaction_type'" :target="'cashDeliverys'" />
        </div>
        <div v-if="mobile" class="mobile-list-container">
            <div class="mobile-list">
                <div class="mobile-list-row" @click="setCurrentMoneyAssigned(moneyAssigned)" v-for="moneyAssigned in searchResults" :key="moneyAssigned.money_assigned_id">
                    <p>{{ moneyAssigned?.assigned_to_profile?.name }}</p>

                    <p>{{ formatDate(moneyAssigned?.date_created) }}</p>

                    <p>{{ formatAmount(moneyAssigned?.amount) }}</p>
                </div>         
                   
            </div>
        </div>    
       
        <div ref="tableContainer" :class="['table-container',(searchResults.length === 0) ? 'table-empty' : '']" v-if="!mobile">
            <p v-if="searchResults.length === 0">No hay asignaciones en este proyecto</p>
            <div v-if="searchResults.length > 0" class="list-table">
                <div class="list-table-head list-table-row ">
                    <span class="list-table-item"><input class="form-check-input" @change="onCheckAll" type="checkbox" value="" name="check-all" /></span>
                    <span class="list-table-item">Codigo</span>
                    <span class="list-table-item">Asignado a</span>
                    <span class="list-table-item">Asignado por</span>
                    <span class="list-table-item">Motivo</span>
                    <span class="list-table-item">Fecha</span>
                    <span class="list-table-item">Monto</span>
                   
                    
                </div>
                <div class="list-table-body">
                    <div class="list-table-row"  @click="setCurrentMoneyAssigned(moneyAssigned)" v-for="moneyAssigned in searchResults" :key="moneyAssigned.money_assigned_id" :class="(currentMoneyAssigned?.money_assigned_id === moneyAssigned?.money_assigned_id) ? 'list-table-row-active' : ''"  >
                        <span class="list-table-item"><input class="form-check-input" @change="onCheck(moneyAssigned)" type="checkbox" value="" name="money-check"/></span>
                        <span class="list-table-item">{{ moneyAssigned?.money_assigned_code }}</span>
                        <span class="list-table-item">{{ moneyAssigned?.assigned_to_profile?.name }}</span>
                        <span class="list-table-item">{{ moneyAssigned?.assigned_by_profile?.name }}</span>
                        <span class="list-table-item">{{ substring(moneyAssigned?.extra_data?.motive,50) }}</span>
                        <span class="list-table-item">{{ formatDate(moneyAssigned?.date_created, true) }}</span>
                        <span class="list-table-item">{{ formatAmount(moneyAssigned?.amount) }}</span>                       
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
import {SearchBar,SearchMobile } from "@/modules/shared/components";
import { useUI } from "@/modules/shared/composables/useUI";
import { useMoneyAssigned } from '@/modules/projects/composables';

import { ref,  watch } from "vue";
export default {
    name: "MoneyAssignedList",
    components: {
        SearchBar,
        SearchMobile,
    },
    setup() {

        const { mobile, substring, formatAmount, formatDate} = useUI();       
        const { moneyAssigned, currentMoneyAssigned, setCurrentMoneyAssigned } = useMoneyAssigned();       
        const showMobileSearch = ref(false);
        const searchResults = ref([]);       
        const totalAmountSelected = ref(0);       
        const tableContainer = ref('');

        searchResults.value = moneyAssigned.value;


        setCurrentMoneyAssigned(null);

        watch(moneyAssigned,()=>{
           
            searchResults.value = sortMoneyAssigned(moneyAssigned.value);
        });

        const onSearchTap = () => {
            showMobileSearch.value = true;
        };

        const onSearchMobileResult = (result) => {

            const ma = moneyAssigned.value.find(
                (cy) => cy.transaction_id == result.transaction_id
            );     
            
            showMobileSearch.value = false;

            setCurrentMoneyAssigned(ma);   

           
        };

        const onSearchMobileCancel = () => {
            showMobileSearch.value = false;
        };

        const sortMoneyAssigned = (target) => {

            if (!target) return;

            return target.sort((a, b) => {
                const nameA = a.assigned_to_profile?.name.toUpperCase(); // ignore upper and lowercase
                const nameB = b.assigned_to_profile?.name.toUpperCase(); // ignore upper and lowercase

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

                searchResults.value = sortMoneyAssigned(results);

                if(resultSelected){

                    setCurrentMoneyAssigned(resultSelected);
                }
               
            } else {

                searchResults.value = sortMoneyAssigned(moneyAssigned.value);

                setCurrentMoneyAssigned( null );
            }
        };

      

        const onCheck = (moneyAssigned) =>{      
           

           if(event.target.checked){
               totalAmountSelected.value += Number(moneyAssigned.amount);
           }else{
              
               totalAmountSelected.value -= Number(moneyAssigned.amount);

               if(totalAmountSelected.value < 0){
                   totalAmountSelected.value = 0;
               }

               const checkAll = document.getElementsByName('check-all');               

               if(checkAll[0].checked){
                   checkAll[0].checked = false;
               }
           }
           
       }

       const onCheckAll = () =>{

            const checkboxes = document.getElementsByName('money-check');

            for (let i = 0; i <checkboxes.length; i++) {

                checkboxes[i].checked = event.target.checked;
                
            }       

            if(event.target.checked){               

                moneyAssigned.value.forEach( money => {
                    totalAmountSelected.value += Number(money.amount);
                });
            }else{
                totalAmountSelected.value = 0;
            }
       }
       

        return {
            //Properties
           
            tableContainer,
            mobile,
            showMobileSearch,
            searchResults,
            currentMoneyAssigned,
            totalAmountSelected,

            //Methods
            onSearchTap,
            onSearchMobileResult,
            onSearchMobileCancel,
            onSearchResult,
            setCurrentMoneyAssigned,
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
.list-container{
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 10% 1fr;
  
    
    
}

.list-container-search .search-container {
    z-index: 2;
   
}

.mobile-list-row{
    grid-template-columns: 1fr 1fr 25%;
}


.table-container{
    background-color: var(--light-background-color);
    border-radius: 16px;
    transition: all var(--animation-duration) var(--animation-type);
    position: relative;
   
}

.table-empty{
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: RobotoLight;
    color:var(--light-text-color);
    

    p{
        margin:0;
        font-size: 1.5em;
        color: inherit;
        transition: all var(--animation-duration) var(--animation-type);
    }
    
}

.dark .table-empty {
    color:var(--dark-text-color);
}

 

.list-table-row {
    grid-template-columns: 7% 10% 1fr 1fr 1fr 20% 13%;
} 

.list-table-item:nth-child(1) {
    padding-left: 15px;
}

.dark .table-container{
    background-color: var(--dark-background-color);
}

.list-container-total{
    width: 100%;
    
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 5px;
    border-radius: 16px;
    background-color: var(--light-background-color);
    font-family: RobotoLight;
    color:var(--light-text-color);
    transition: all var(--animation-duration) var(--animation-type);

    p{
        color: inherit;
        margin: 0;
        padding: 10px;
        border-radius: inherit;
        transition: all var(--animation-duration) var(--animation-type);
    }
}

.dark .list-container-total{
    color:var(--dark-text-color);
    background-color: var(--dark-background-color);
}   

@media screen and (max-width:1300px) {
   
    .list-container{
        padding: 5px;
        margin-top: 5px;
        grid-template-rows: 55px 1fr;
    }

    li{
        font-size: 1em;
    }
}

</style>
