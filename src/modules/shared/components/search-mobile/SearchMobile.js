import {  defineComponent, onMounted, ref,watch } from "vue";
import { useUI } from '@/modules/shared/composables/useUI';
import { useOrders, useExpenseReports, useMoneyOrdered, useMoneyAssigned } from  '@/modules/projects/composables';
import ExpenseReportResults from '@/modules/projects/components/cash-flow/expense-report/results/ExpenseReportResults.vue';
import MoneyOrderedResults from '@/modules/projects/components/cash-flow/money-ordered/results/MoneyOrderedResults.vue';
import MoneyAssignedResults from '@/modules/projects/components/cash-flow/money-assigned/results/MoneyAssignedResults.vue';
import OrderResults from '@/modules/projects/components/orders/results/OrderResults.vue';
import {  substring } from '@/helpers/utils';

export default defineComponent({
    name:'SearchMobile',
    emits:[
        'on-cancel',
        'on-accept',
    ],
    props:{
        title:{
            type:String,
            default:''
            
        },
        target:{
            type:String,
            required:true
        },      
      
    },
    components:{
        ExpenseReportResults,
        OrderResults,
        MoneyOrderedResults,
        MoneyAssignedResults

    },
    setup(props, context){

        const { openKeyboard }   = useUI();
        const { searchExpenseReports } = useExpenseReports();
        const { searchMoneyOrdered } = useMoneyOrdered();
        const { searchMoneyAssigned } = useMoneyAssigned();
        const { searchOrders }  = useOrders();
        const debounceTimeout    = ref();       
        const searchInput        = ref(null);     
        const searchText = ref('');  
       

         const onInput = (event) =>{
            

            if(debounceTimeout.value) clearTimeout(debounceTimeout.value);

            debounceTimeout.value =  setTimeout(() => {
                
                onSearch(event.target.value.trim());

            }, 300); 
         }

        watch(searchText,()=>{
            onSearch(searchText.value);
        } );

      
        const onSearch = ( searchText ) =>{            

            switch (props.target) {
                case 'orders':
                    searchOrders( searchText );
                    break;
                case 'cashYields':
                    searchExpenseReports( searchText );
                    break;
                case 'cashRequests':
                    searchMoneyOrdered( searchText );
                    break;
                case 'cashDeliverys':
                    searchMoneyAssigned( searchText );
                    break;
            
                default:
                    break;
            }
            
           
           
        }

        const onSelectResult = ( result ) =>{        

            context.emit('on-accept',result);

        }

     

        const onCancel = () =>{
          
            context.emit('on-cancel');
        }


        onMounted(()=>{
          
            searchInput.value.focus();
           
        });

        return{          
            searchText,
            searchInput,
            openKeyboard,            
            onInput,
            onCancel,
            substring,
            onSelectResult
        }
    }
});