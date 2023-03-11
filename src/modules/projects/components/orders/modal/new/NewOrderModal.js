import { defineComponent, onMounted, ref } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import Input from '@/modules/shared/components/input/Input.vue';
import Select from '@/modules/shared/components/select/Select.vue';
import UploadFilesList from '@/modules/shared/components/upload-files-list/UploadFilesList.vue';

import SelectProduct from '@/modules/products/components/product/select/SelectProduct.vue';
import SelectCategory from '@/modules/products/components/category/select/SelectCategory.vue';
import SelectProvider from '@/modules/products/components/provider/select/SelectProvider.vue';
import { substring,  calculateDaysBetweenDates,calculateFutureDate } from '@/helpers/utils';
import { useUI, useModal } from "@/modules/shared/composables";
import { useProject } from "@/modules/projects/composables";



export default defineComponent ({
    name:'NewOrderModal',
    components:{
        Input,
        Select,       
        SelectProduct,
        SelectCategory,
        SelectProvider,
        UploadFilesList,
        Datepicker,
       
    },
    emits:[
        'on-cancel',
        'on-accept'
    ],
    props:{
        payLoad:{
         default:null
        }   
     },
    setup(props,context){

        
       
        const { darkMode, formatDate, formatAmount } = useUI();   
        const { showConfirmation, hideConfirmation } = useModal();   
        const { currentProjectBudget }  = useProject(); 

        const providerSelect = ref(null);
        const categorySelect = ref(null);       
        const itemsSelect = ref(null);
        const payDateSelect = ref(null);
        const amountInput = ref(null);      
     
        const payDates = ref([]);
      
        const title = ref('Nueva orden de compra');
        const acceptButtonLabel = ref('Cargar orden');
      
        const datePickerSelectedOption = ref(null);       
        const payDatePicker = ref(null);
        const uploadFilesListRef = ref(null);  
   
        const orderData = ref({
           
            company_id:'',
            category_id:'',
            category_code:'',
            currency_id:'',
            cost_center_id:'',
            motive:'',
            amount:0,
            date_payment:'',
            files:[],
            products:[],
        });

        const confirmationInfo = ref({
            title:'Presupuesto excedido',
            text:'¿Confirma la orden?',
            info:'El monto de la orden excede el presupuesto del proyecto',
            type:'warning'
        })
       
      
 


        const setSelectsOptions = () =>{       
    
    
            payDates.value = [
                {label:'Fecha exacta', value:'custom'},
                {label:`15 días (${formatDate(new Date(calculateFutureDate(15)))})`, value:new Date(calculateFutureDate(15))},
                {label:`30 días (${formatDate(new Date(calculateFutureDate(30)))})`, value:new Date(calculateFutureDate(30))},
                {label:`60 días (${formatDate(new Date(calculateFutureDate(60)))})`, value:new Date(calculateFutureDate(60))},
                {label:`90 días (${formatDate(new Date(calculateFutureDate(90)))})`, value:new Date(calculateFutureDate(90))},
                {label:`120 días (${formatDate(new Date(calculateFutureDate(120)))})`, value:new Date(calculateFutureDate(120))},               
            ];
        }


       


        const onProviderSelected = ( option ) =>{

            orderData.value.company_id = '';
            
            if(!option) return;

            orderData.value.company_id = option.value;
        }
        const onCategorySelected = ( option ) =>{
            
           orderData.value.category_id = ''; 
           
           if(!option) return;

           orderData.value.category_id = option.value;

           orderData.value.currency_id = option.value;//TODO: cambiar

           orderData.value.cost_center_id = option.value;//TODO: cambiar

           orderData.value.category_code = option.code;

           itemsSelect.value.filterByCategory(option.code);

           
        }
        const onItemSelected = ( option ) =>{
            
            if(!option) return;

            orderData.value.products.push({product_id:option.value});
           
        }
        const onPayDateSelected = ( option ) =>{
            
            if(!option) return;

            if(option.value == 'custom'){
                payDatePicker.value.openMenu();
            }else{
                
                orderData.value.date_payment = option.value.toISOString();
            }
            
           
        }

        const onDateSelected = (date) =>{

            const days = calculateDaysBetweenDates(date.toISOString())
           
            const selectedDate =  {
                label:`${days} ${(days> 1) ? 'días' : 'día'} (${formatDate(date.toISOString())})`,
                value:days
            }
            orderData.value.date_payment = date.toISOString();
            payDates.value.push(selectedDate);
            datePickerSelectedOption.value = selectedDate;
            setTimeout(() => {
                payDates.value.pop();
            }, 250);
           
        }       

 
        
       

        const onCancel = () =>{
            context.emit('on-cancel');
        }

        const onAccept = () =>{
            

          
            if(!currentProjectBudget.value.has_agreement  && orderData.value.amount > currentProjectBudget.value.available_balance_with_agreement ){
                
               
                showConfirmation(onConfirmAccept,onConfirmCancel, confirmationInfo.value);
               
            }else{
                uploadOrder()
            }

            
        }

        const uploadOrder = () =>{


            
            let errors = false;

            //console.log(currentProjectBudget.value.has_agreement)

            if(currentProjectBudget.value.has_agreement && orderData.value.amount > currentProjectBudget.value.available_balance_with_agreement){                
                amountInput.value.showError(`Balance insuficiente ( ${formatAmount(currentProjectBudget.value.available_balance_with_agreement)} )`);
                errors = true;
            }           

          

            if(orderData.value.company_id == ''){
                providerSelect.value.checkError();
                errors = true;
            }

            if(orderData.value.category_id == ''){
                categorySelect.value.checkError();
                errors = true;
            }

            if(orderData.value.products.length == 0){
                itemsSelect.value.checkError();
                errors = true;
            }
            if(orderData.value.date_payment.length == 0){
                payDateSelect.value.checkError();
                errors = true;
            }
            
            
            if(orderData.value.amount == ''){
                amountInput.value.checkError();
                errors = true;
            }

            const files = uploadFilesListRef.value.files.filter( file => (file.file != null || file.storage_url != ''));

            if(files){
                orderData.value.files = orderData.value.files.concat(files);
                orderData.value.files = [...new Set([...orderData.value.files,...files])]; 
            }
            

            if(!errors){

                let update = false;
                
                if(props.updateOrder ){

                    update = true;
                }            

                context.emit('on-accept',orderData.value,update);
            }      

        }


        const onConfirmAccept = () =>{

           

            uploadOrder();

            hideConfirmation();

           
            
        }
        const onConfirmCancel = () =>{

            
            hideConfirmation();
        }

        


        onMounted(()=>{

            setSelectsOptions();

            if(props.payLoad){

                title.value = 'Actualizar orden';

                acceptButtonLabel.value = 'Actualizar';             

                const updateOrder = props.payLoad;              

                orderData.value.company_id = updateOrder.company.company_id;
                orderData.value.category_id = updateOrder.category.category_id;                
                orderData.value.motive = updateOrder.extra_data?.motive;
                orderData.value.amount = updateOrder.amount;              
                orderData.value.products = updateOrder.products;              
               
              
            }
        });

        return{
            darkMode,
            providerSelect,
            categorySelect,
            payDateSelect,           
            itemsSelect,
            amountInput,
            uploadFilesListRef,  
            payDates,
            orderData,           
            datePickerSelectedOption,           
            title,
            acceptButtonLabel,
            payDatePicker,
            confirmationInfo,
           
            onProviderSelected,
            onCategorySelected,
            onItemSelected,
            onPayDateSelected,
            onConfirmAccept,
            onConfirmCancel,
            onCancel,
            onAccept,
            onDateSelected,
            substring
        }
    }

});