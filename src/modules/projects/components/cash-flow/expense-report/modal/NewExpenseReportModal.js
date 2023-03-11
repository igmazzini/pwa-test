import { defineComponent, onMounted, ref } from 'vue';

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import Input from '@/modules/shared/components/input/Input.vue';
import Select from '@/modules/shared/components/select/Select.vue';
import UploadFilesList from '@/modules/shared/components/upload-files-list/UploadFilesList.vue';
import {SelectProduct, SelectCategory,SelectProvider} from '@/modules/products/components';
import { useUI, useModal } from "@/modules/shared/composables";

import { useProfiles } from '@/modules/profiles/composables';



export default defineComponent ({
    name:'NewExpeseReportModal',
    components:{
        Input,
        Select,       
        UploadFilesList,
        Datepicker,       
        SelectProduct,
        SelectCategory,
        SelectProvider
      
    },
    props:{
       payLoad:{
        default:null
       }   
    },
    emits:[
        'on-cancel',
        'on-accept'
    ],    
    setup(props,context){

        
       
        const { darkMode, substring, formatAmount} = useUI();     
        const { showConfirmation, hideConfirmation, showSecondModal, hideSecondModal } = useModal();  
        const { currentUserBalance } = useProfiles();

        const categorySelect = ref(null);       
        const itemsSelect = ref(null);
        const payDateSelect = ref(null);
        const amountInput = ref(null);       
        const datePicker = ref(null);  

        const invoiceTypeSelect = ref(null);       
        const invoiceProviderSelect = ref(null);       
        const providerNameInput = ref(null);       
        const cuitInput = ref(null);       
        const notTaxInput = ref(null);       
        const taxInput = ref(null);       
        const iva21Input = ref(null);       
        const iva10Input = ref(null);       
        const percepIvaInput = ref(null);       
        const percepIIBBInput = ref(null);       
        const totalInputIva = ref(null);       
        const totalInput = ref(null);       
         
       
        const categoriesOptions = ref([]);
        const itemsOptions = ref([]);
       
       
        const title = ref('Nueva rendición');
        const acceptButtonLabel = ref('Cargar rendición');      
        
        const uploadFilesListRef = ref(null);      
        const customDay = ref('');   
        const today = ref('');
        const yesterday = ref('');
        const selectedDate = ref('');        
           
        const newProvider = ref(false);        
        const expenseReportData = ref({
            amount: '',
            order_id: '',
            category_id: '',
            category_code: '',
            product_id: '',
            motive: '',
            date_created: '',              
            files:[]
        });

        const invoiceData = ref({
            type:'',
            provider_name:'',
            provider_id:'',           
            provider_data:'',
            no_tax:'',
            tax:'',
            iva21:'',
            iva10:'',
            percepIva:'',
            percepIIBB:'',
            cae:'',
            total:'',
            place_name:'',
            contact_name:'',
            contact_address:'',
            contact_email:'',
            contact_phone:'',
            
        });  

        const confirmationInfo = ref({
            title:'Presupuesto de usuario excedido',
            text:'Se generara una solicitud de efectivo por la diferencia, ¿Confirma esta rendición?',
            info:'El monto de la rendición excede el presupuesto del usuario',
            type:'warning'
        });  

        const invoiceOptions = ref([
            {label:'Factura A', value:'A'},
            {label:'Factura B', value:'B'},
            {label:'Factura C', value:'C'},
            {label:'Sin Factura', value:'no-invoice'},
        ]);
      
        
        
        const onCategorySelected = ( option ) =>{
            
           expenseReportData.value.category_id = ''; 
           
           if(!option) return;

           expenseReportData.value.category_id = option.value;

           expenseReportData.value.category_code = option.code;

           itemsSelect.value.filterByCategory(option.code);

       

           
        }
        

        const onItemSelected = ( option ) =>{

            expenseReportData.value.product_id = '';
            
            if(!option) return;

            expenseReportData.value.product_id = option.value;
           
        }       
  
        const onDateSelected = ( date ) =>{

      
            switch (date) {
      
              case 'today':
      
                expenseReportData.value.date_created = new Date().toISOString();
                customDay.value = '';
      
                break;
      
              case 'yesterday':{
      
                const today = new Date();
                expenseReportData.value.date_created = new Date(today.setDate(today.getDate() - 1)).toISOString();
                customDay.value = '';
      
               
              
              }
               break;
              case 'customDate':
                
                datePicker.value.openMenu();
                break;
      
              default:
                break;
            }     
      
            selectedDate.value = date;
      
        }

        const onCustomDateSelected = (date) =>{

            customDay.value = `${date.getDate()}/${date.getMonth()}`;           
          
            expenseReportData.value.date_created = date.toISOString();

           
        }   
        
        const onInvoiceTypeSelected = ( option ) =>{          
           
            invoiceData.value.type = '';
            if(!option) return;   


            invoiceData.value.type = option.value;   
            
          
          
        }

        const onProviderSelected = ( option ) =>{          
           
            
            if(!option) return;   
           
            if(option.value == 'new'){
               
                showSecondModal('LazyProvider', onNewProviderAccept, onNewProviderCancel);

            }else{
                newProvider.value = false;
                invoiceData.value.provider_name = option.label;
                invoiceData.value.provider_id = option.value;
            }
            
        }

        const onNewProviderAccept = ( data ) =>{            

            invoiceData.value.provider_data = data;

            invoiceData.value.provider_name = invoiceData.value.provider_data.company_name;

            newProvider.value = true;
           

            hideSecondModal();

        } 

        const onNewProviderCancel = (  ) =>{
     
            newProvider.value = false;

            hideSecondModal();

        } 


        const setDates = () =>{

            const now = new Date(); 
      
            today.value = `${now.getDate()}/${now.getMonth()+1}`;
      
            if(now.getDate() == 1){      
      
              const y = new Date(now.getFullYear(), now.getMonth()-2, 0).getDate();
      
              yesterday.value = `${y}/${now.getMonth()}`;
      
            }else{
      
               yesterday.value = `${now.getDate() - 1}/${now.getMonth()+1}`;
            }
      
           
            selectedDate.value = 'today';
      
            expenseReportData.value.date_created = now.toISOString();
            
          }
        
       

        const onCancel = () =>{
            context.emit('on-cancel');
        }


        const checkBalance = () =>{   
            
          

            if(currentUserBalance.value?.balance < expenseReportData.value.amount){
                
               
                showConfirmation(onModalConfirmAccept, onModalConfirmCancel, confirmationInfo.value);

            }else{
                
               
                onAccept();
            }
        }


        const onModalConfirmAccept = () =>{

            hideConfirmation();
            onAccept();
        }


        const onModalConfirmCancel = () =>{

            hideConfirmation();
            onCancel();
        }


        const onAccept = () =>{
            
            
            let errors = false;          
                  

           
            if(expenseReportData.value.category_id == ''){
                categorySelect.value.checkError();
                errors = true;
            }

            if(expenseReportData.value.product_id == ''){
                itemsSelect.value.checkError();
                errors = true;
            }
          
            
            if(expenseReportData.value.amount == ''){
                amountInput.value.checkError();
                errors = true;
            }

            const files = uploadFilesListRef.value.files.filter( file => (file.file != null || file.storage_url != ''));

            if(files){
                expenseReportData.value.files = expenseReportData.value.files.concat(files);
                expenseReportData.value.files = [...new Set([...expenseReportData.value.files,...files])]; 
            }

            if(invoiceData.value.type == ''){
                invoiceTypeSelect.value.checkError();
                errors = true;
            }

            if(invoiceData.value.type != 'no-invoice' && invoiceData.value.provider_name == ''){
                invoiceProviderSelect.value.checkError();
                errors = true;
            }

            if(newProvider.value){
                if(invoiceData.value.provider_data.company_name == ''){
                   
                    providerNameInput.value.checkError();
                    errors = true;
                }
                if(invoiceData.value.provider_data.cuit == ''){
                   
                    cuitInput.value.checkError();
                    errors = true;
                }
            }

         

            /* if(invoiceData.value.total == ''){
                if(invoiceData.value.type != 'A'){
                    totalInput.value.checkError();
                }else{
                    totalInputIva.value.checkError();
                }
               
                
                errors = true;
            } */
             
            expenseReportData.value.invoice = invoiceData.value;

            if(!errors){                       

                context.emit('on-accept',expenseReportData.value);
            }

            

            
            
        }

        


        onMounted(()=>{

            setDates();        

           
        });

        return{
            //Properties
            darkMode,           
            categorySelect,
            payDateSelect,           
            itemsSelect,
            amountInput,
            uploadFilesListRef,           
            categoriesOptions,
            itemsOptions,          
            expenseReportData,          
            title,
            acceptButtonLabel,
            customDay,
            yesterday,
            today,
            selectedDate,
            datePicker,
            confirmationInfo,
          
            invoiceOptions,           
            invoiceData,
            newProvider,
            invoiceTypeSelect, 
            invoiceProviderSelect,       
            providerNameInput,
            cuitInput,
            notTaxInput,
            taxInput,
            iva21Input,
            iva10Input,
            percepIvaInput,
            percepIIBBInput,
            totalInputIva,
            totalInput,
           
            //Methods
            onCategorySelected,
            onInvoiceTypeSelected,
            onItemSelected,    
            checkBalance,     
            onCancel,
            onAccept,
            onDateSelected,     
            onCustomDateSelected,      
            substring,
            formatAmount,
            onModalConfirmAccept,
            onModalConfirmCancel,
            onProviderSelected,
        }
    }

});