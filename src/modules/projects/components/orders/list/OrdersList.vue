<template>
    <div class="list-container">
        <Teleport v-if="showMobileSearch" to=".page-layout">
            <SearchMobile  :target="'orders'" @on-accept="onSearchMobileResult"
                @on-cancel="onSearchMobileCancel" />
        </Teleport>
        <div class="list-container-search">
            <SearchBar class="animate__animated animate__fadeInRight animate__faster" ref="search"
                @on-search-tap="onSearchTap" @on-search="onSearchResult" 
                :filterTarget="'transaction_type'" :target="'orders'" />
        </div>

        <div v-if="mobile" class="mobile-list-container">
            <div class="mobile-list">
                <div class="mobile-list-row" @click="onOrderSelected(order)" v-for="order in searchResults" :key="order">
                    <p>{{ order.order_code }}</p>
                    <p> 
                        {{ substring(order.category.category_name,20) }}                
                    </p>

                    <p>{{ formatAmount(order.amount) }}</p>
                </div>              
            </div>            
        </div>
       
        <div :class="['table-container',(searchResults.length === 0) ? 'table-empty' : '']" v-if="!mobile">
            <p v-if="searchResults.length === 0">No hay ordenes en este proyecto</p>
            <div  v-if="searchResults.length > 0" class="list-table">
                <div class="list-table-head list-table-row">
                    <span class="list-table-item"><input class="form-check-input" @change="onCheckAll()" type="checkbox" value="" name="check-all" ></span>
                    <span class="list-table-item">Codigo</span>
                    <span class="list-table-item">Proveedor</span>
                    <span class="list-table-item">Rubro</span>
                    <span class="list-table-item">Fecha</span>
                    <span class="list-table-item">Estado</span>
                    <span class="list-table-item">Monto</span>
                </div>
                <div class="list-table-body">
                    <div class="list-table-row"  :class="(currentOrder?.order_id == order.order_id) ? 'list-table-row-active' : ''" v-for="order of searchResults"  :key="order.order_id" @click="onOrderSelected(order)" >
                        <span class="list-table-item"><input name="order-check" class="form-check-input" @change="onCheck(order)" type="checkbox" value="" ></span>
                        <span class="list-table-item">{{ order.order_code }}</span>
                        <span class="list-table-item">{{ substring(order.company.company_name) }}</span>
                        <span class="list-table-item">{{ substring(order.category.category_name,15) }}</span>
                        <span class="list-table-item">{{ formatDate(order.date_created, true) }}</span>
                        <span class="list-table-item" :class="order.status.toLowerCase()">{{ getStatus(order.status) }}</span>
                        <span class="list-table-item" >{{ formatAmount(order.amount) }}<font-awesome-icon v-if="!hasFileProof(order) && order.status.toLowerCase() == 'paid'" @mouseover="onWarningOver" @mouseout="onWarningOut" icon="fa-solid fa-circle-exclamation" /></span>
                    </div>
                  
                    
                </div>
            </div>
           
        </div>
        <div v-if="!mobile" class="list-container-total">           
            <p>Pendientes: {{pendingOrders}}</p>
            <p>Pagadas: {{paidOrders}}</p>
            <p>Anuladas: {{annulateOrders}}</p>   
            <p>Total: {{ formatAmount(totalAmountSelected) }}</p>
        </div>
    </div>
</template>

<script>

import { ref, watch } from "vue";
import {SearchBar, SearchMobile} from "@/modules/shared/components";
import { useUI } from "@/modules/shared/composables";
import { useOrders } from "@/modules/projects/composables";

export default {
    name: "OrderList",
    components: {
        SearchBar,
        SearchMobile,
    },   
   
    setup() {

        const { mobile, substring, formatAmount, formatDate, showTooltip, removeTooltip, getStatus  } = useUI();
        const { orders, currentOrder, setCurrentOrder, hasFileProof,  pendingOrders,paidOrders, annulateOrders  } = useOrders();
      
        const showMobileSearch = ref(false);
        const searchResults = ref([]);        
        const totalAmountSelected = ref(0);    
       
        searchResults.value = orders.value;


        watch(orders,()=>{
            setCurrentOrder(null);
            searchResults.value = sortOrders(orders.value);
        });

        const onSearchTap = () => {
            showMobileSearch.value = true;
        };

        const onSearchMobileResult = (result) => {

            const order = orders.value.find(
                (cy) => cy.transaction_id == result.transaction_id
            );     
            
            showMobileSearch.value = false;

            onOrderSelected(order);   

           
        };

        const onSearchMobileCancel = () => {
            showMobileSearch.value = false;
        };

        const sortOrders = (target) => {
            return target.sort((a,b)=>{

            const nameA = a.category_code; // ignore upper and lowercase
            const nameB = b.category_code; // ignore upper and lowercase

            // sort in an ascending order
            if (nameA < nameB) {
            return -1;
            }
            if (nameA > nameB) {
            return 1;
            }

            // names must be equal
            return 0;
            })
        };

        const onSearchResult = (results, filters, resultSelected) => {
           
            if (results.length > 0 || filters) {
                
                searchResults.value = sortOrders(results);

                if(resultSelected){

                    setCurrentOrder(resultSelected);
                }

                
            } else {

                searchResults.value = sortOrders(orders.value);

                setCurrentOrder(null);
               
            }
        };

        const onOrderSelected = ( order ) => {                 

            setCurrentOrder(order);
           
        };

        const onCheck = (order) =>{      
           

            if(event.target.checked){
                totalAmountSelected.value += Number(order.amount);
            }else{
               
                totalAmountSelected.value -= Number(order.amount);

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

            const checkboxes = document.getElementsByName('order-check');

            for (let i = 0; i <checkboxes.length; i++) {

                checkboxes[i].checked = event.target.checked;
                
            }       
            
            if(event.target.checked){               

                orders.value.forEach(order => {
                    totalAmountSelected.value += Number(order.amount);
                });
            }else{
                totalAmountSelected.value = 0;
            }
        }

        const onWarningOver = (event) => {

            showTooltip('Sin comprobante', event.target);
        }

        const onWarningOut = () => {

             removeTooltip();
        }
        


    
        return {
            //Properties
           
            mobile,
            showMobileSearch,
            searchResults,
            currentOrder,
            totalAmountSelected,
            pendingOrders,            
            annulateOrders,
            paidOrders,

            //Methods
            onSearchTap,
            onSearchMobileResult,
            onSearchMobileCancel,
            onSearchResult,
            onOrderSelected,
            onCheck,
            onCheckAll,
            getStatus,
            hasFileProof,           
            substring,
            formatAmount,
            formatDate,
            onWarningOver, 
            onWarningOut,
           
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
    grid-template-columns: 18% 1fr 25%;       
}



.table-container{
    background-color: var(--light-background-color);
    transition: all var(--animation-duration) var(--animation-type);
    border-radius: 16px;
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
    grid-template-columns: 7% 10% 16% 1fr 20% 12% 16%;
} 

.fa-circle-exclamation{
  font-size: 1.3em;
}

.list-table-item{
  position: relative;
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
    justify-content: space-around;
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
       grid-template-rows: 55px 1fr;
       font-size: 1.5em;
    }   
  
}
@media screen and (max-height:750px) {
    .list-container{
     
        grid-template-rows: 12% 1fr;
        
        
    }
  
}

</style>
