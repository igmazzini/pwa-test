import {  defineComponent, ref ,onMounted, watch} from "vue";
import {  substring } from '@/helpers/utils';
import {  useOrders, useExpenseReports, useMoneyOrdered, useMoneyAssigned } from  '@/modules/projects/composables';
import OrderResults from '@/modules/projects/components/orders/results/OrderResults.vue';
import ExpenseReportResults from '@/modules/projects/components/cash-flow/expense-report/results/ExpenseReportResults.vue';
import MoneyOrderedResults from '@/modules/projects/components/cash-flow/money-ordered/results/MoneyOrderedResults.vue';
import MoneyAssignedResults from '@/modules/projects/components/cash-flow/money-assigned/results/MoneyAssignedResults.vue';

export default defineComponent({
    name:'SearchBar',
    props:{
        target:{
            type:String,
            required: true       
        },      
        filters:{
            type:Array,            
        },
        filterTarget:{
            type:String
        },      
            
       
    },
    emits:[
        'on-search',
        'on-search-tap'
    ],
    components:{
        OrderResults,
        ExpenseReportResults,
        MoneyOrderedResults,
        MoneyAssignedResults
    },
    setup(props, context){


        const { searchOrders, ordersSearchResults } = useOrders();
        const { searchExpenseReports, expenseReportsResults } = useExpenseReports();
        const { searchMoneyOrdered, moneyOrderedResults } = useMoneyOrdered();
        const { searchMoneyAssigned, moneyAssignedResults } = useMoneyAssigned();
        

        const searchInput = ref(null);
        const searchText = ref('');
        const showMenu = ref(false);
        const showHistory = ref(false);
        const forcedSearch = ref(false);
        const searchFilters = ref([]);       
        const searchHistory = ref([]);      
        const activeFilters = ref([]);
        const currentFilter = ref(-1)
      
        if(localStorage.getItem('searchHistory')){
            searchHistory.value = JSON.parse(localStorage.getItem('searchHistory'));
        }else{
            searchHistory.value = [];    
        }         
        

      

        watch( () => props.filters,() =>{

            setFilters();

        } );


        watch(searchText,()=>{

            if(searchText.value.length > 0){
                showHistory.value = false;
            }else{
                showHistory.value = true;
            }
            

            switch (props.target) {
                case 'orders':
                   
                    searchOrders(searchText.value,activeFilters.value,'status');
                   
                    break;

                case 'cashYields':
                   
                    searchExpenseReports(searchText.value);
                   
                    break;
                case 'cashRequests':
                   
                    searchMoneyOrdered(searchText.value);
                   
                    break;
                case 'cashDeliverys':
                   
                    searchMoneyAssigned(searchText.value);
                   
                    break;
            
                default:
                    break;
            }

            onSearch();

  
        });

     

        const setFilters = () =>{

           
            if(props.filters){

                searchFilters.value = props.filters;

            }else{
                
                searchFilters.value = [];
            }
        }


        const onSearchInputClick = () =>{
            
            showMenu.value = true;

            if(searchText.value == '') showHistory.value = true;            

            
        }
        const onSearchInputBlur = () =>{

            setTimeout(() => {
                showMenu.value = false;
               
            }, 150);
           
        }

        const onFilterClick = ( filter ) =>{
           
           if(currentFilter.value == filter){

                currentFilter.value = null;
                activeFilters.value = [];
                onSearch(false, false);


           }else{

                currentFilter.value = filter;
                activeFilters.value = [filter];   

                switch (props.target) {
                    case 'orders':
                       
                        searchOrders(searchText.value,activeFilters.value,'status');
                       
                        break;
    
                    case 'cashYields':
                       
                        searchExpenseReports(searchText.value);
                       
                        break;
                    case 'cashRequests':
                       
                        searchMoneyOrdered(searchText.value);
                       
                        break;
                    case 'cashDeliverys':
                       
                        searchMoneyAssigned(searchText.value);
                       
                        break;
                
                    default:
                        break;
                }
              
                onSearch(false, true);

           }  
          
          

        }

        const onDeleteFilter = ( index ) =>{
            
            activeFilters.value.splice(index,1);

            onClear();

        }

        const onSelectOrderResult = ( order ) =>{

            if(searchHistory.value.indexOf(substring(order.order_name,40)) == -1){

                searchHistory.value = [substring(order.order_name,40),...searchHistory.value.slice(0,4)];

                localStorage.setItem('searchHistory',JSON.stringify(searchHistory.value));  
            }  
            

            onSearch(false,(activeFilters.value.length > 0), order);

        }

        const onSelectCashYieldResult = ( expenseReport ) =>{
            

            if(searchHistory.value.indexOf(substring(expenseReport.product.product_name,40)) == -1){

                searchHistory.value = [substring(expenseReport.product.product_name,40),...searchHistory.value.slice(0,4)];

                localStorage.setItem('searchHistory',JSON.stringify(searchHistory.value));  
            }  

            onSearch(false,(activeFilters.value.length > 0), expenseReport);

        }
        const onSelectCashRequestResult = ( moneyOrdered ) =>{
            

            if(searchHistory.value.indexOf(substring(moneyOrdered.profile.name,40)) == -1){

                searchHistory.value = [substring(moneyOrdered.profile.name,40),...searchHistory.value.slice(0,4)];

                localStorage.setItem('searchHistory',JSON.stringify(searchHistory.value));  
            }  

            onSearch(false,(activeFilters.value.length > 0), moneyOrdered);

        }
        const onSelectCashDeliveryResult = ( moneyAssigned ) =>{
            

            if(searchHistory.value.indexOf(substring(moneyAssigned.assigned_to_profile.name,40)) == -1){

                searchHistory.value = [substring(moneyAssigned.assigned_to_profile.name,40),...searchHistory.value.slice(0,4)];

                localStorage.setItem('searchHistory',JSON.stringify(searchHistory.value));  
            }  

            onSearch(false,(activeFilters.value.length > 0), moneyAssigned);

        }
        
       
        const onHistoryClick = ( history ) =>{
           
            searchText.value = history;        
            
        }
        const onHistoryDelete = ( index ) =>{
           
            searchHistory.value.splice(index,1);
            localStorage.setItem('searchHistory',JSON.stringify(searchHistory.value));
        }


        const onSearch = (saveHistory = true, filters = false, selected = null) =>{
           

            if(saveHistory && searchText.value.length > 0){
                if(searchHistory.value.indexOf(substring(searchText.value,40)) == -1){

                    searchHistory.value = [substring(searchText.value,40),...searchHistory.value.slice(0,4)];

                    localStorage.setItem('searchHistory',JSON.stringify(searchHistory.value));  
                }                 
            }               
           
            
           
            setTimeout(() => {
                
                forcedSearch.value = false;                
                
                switch (props.target) {
                    case 'orders':
                        context.emit('on-search',ordersSearchResults.value,filters,selected);
                        break;
                    case 'cashYields':
                        context.emit('on-search',expenseReportsResults.value,filters,selected);
                        break;
                    case 'cashRequests':
                        context.emit('on-search',moneyOrderedResults.value,filters,selected);
                        break;
                    case 'cashDeliverys':
                        context.emit('on-search',moneyAssignedResults.value,filters,selected);
                        break;
                
                    default:
                        break;
                }
                
            }, 150);
           
        } 


       

        const onClear = () =>{
            searchText.value = '';
            context.emit('on-search',[]);
        }

        const forceSearch = ( query ) =>{
            forcedSearch.value = true;
            searchText.value = query;            
            onSearch(true, true);
            
        }


        const onSearchTap = () =>{
            context.emit('on-search-tap');
        }


        onMounted( () =>{            
            setFilters();           
        });
        

        return{
            searchInput,
            showMenu,
            showHistory,
            searchText,
            searchFilters,         
            searchHistory,
            activeFilters, 
            currentFilter,            
            onSearchInputClick,
            onSearchInputBlur,
            onFilterClick,
            onDeleteFilter,
            onSelectOrderResult,
            onSelectCashYieldResult,
            onSelectCashRequestResult,
            onSelectCashDeliveryResult,
            onHistoryClick,
            onHistoryDelete,
            onSearch,
            onClear,
            forceSearch,
            onSearchTap
            
        }
    }

})