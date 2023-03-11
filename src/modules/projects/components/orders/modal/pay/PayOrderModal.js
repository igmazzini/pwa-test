import { defineComponent, onMounted, ref} from 'vue';

import BankData from './BankData.vue';
import PayData from './PayData.vue';
import UploadFilesList from '@/modules/shared/components/upload-files-list/UploadFilesList.vue';
import TextField from '@/modules/shared/components/text-field/TextField.vue';
import SelectPayment from '@/modules/projects/components/payment/select/SelectPayment.vue';
import { useUI, useModal } from '@/modules/shared/composables';


export default defineComponent ({
    name:'PayOrderModal',
    props:{
        payLoad:{
            default:null,           
        }
    },
    emits:[
        'on-accept',
        'on-cancel'
    ],
    components:{
        UploadFilesList,
        TextField,
        SelectPayment,
        BankData,
        PayData,
      
       
    },
    setup(props,context){


        const { copyToClipboard, currency, formatAmount, formatDate } = useUI();   
        const { showConfirmation, hideConfirmation} = useModal();           
        const title = ref('Pagar orden de compra');
        const cbuTooltip = ref(null);
        const aliasTooltip = ref(null);
        const uploadFilesListRef = ref(null);
        const paymentTypeRef = ref(null);
        const currentOrder = ref(null); 
        const payOptions = ref([]);   
        const currentPayComponent = ref('BankData');
        const currentPayComponentProperties = ref({});
        const payment_id = ref('')
       
     
        const confirmationInfo = ref({
            title:'Orden sin comprobante',
            text:'¿Confirma el pago?',
            info:'Esta orden no tiene comprobante de pago',
            type:'warning'
        })


       
        
        const setPayOptions = () =>{


            const bank = 'ICBC'
            const cbu = String(currentOrder.value.company.extra_data.cbu).substring(String(currentOrder.value.company.extra_data.cbu).length - 7,String(currentOrder.value.company.extra_data.cbu).length)

            const transferLabelOption = `Transferencia bancaria - ${bank} ...${cbu}`

            payOptions.value = [
                {label:'Efectivo',value:'cash'},
                {label:transferLabelOption,value:'bank'},
                {label:'Tarjeta de credito/debito',value:'card'},
                {label:'Cheque',value:'cheque'},
            ];
        }
        
        
        const onCopyText = ( text, target ) =>{

            if( target == 'cbu'){
                copyToClipboard(text, cbuTooltip.value);
            }else{
                copyToClipboard(text, aliasTooltip.value);
            }
           
           
        }

        const checkFileProof = () =>{

            let hasProof = false; 

           

            if(uploadFilesListRef.value.files){
                uploadFilesListRef.value.files.forEach( file =>{
                    if(file.type.toLowerCase() == 'comprobante' && file.file_name != ''){
                        hasProof = true;
                    }
                } )
            }  

            return hasProof;
        }


        const onAccept = () =>{    
            
            if(payment_id.value == ''){

                paymentTypeRef.value.checkError();
                return;
            }
           
            
            if(!checkFileProof()){

                confirmationInfo.value = {
                    title:'Orden sin comprobante',
                    text:'¿Confirma el pago?',
                    info:'Esta orden no tiene comprobante de pago',
                    type:'warning',
                    action:'confirm-pay'
                };
               
                showConfirmation(onConfirm, onCancelConfirm, confirmationInfo.value);

            }else{

                
                
                 context.emit('on-accept',{files:uploadFilesListRef.value.files,payment: payment_id});
            }
            
        }

        const onConfirm = () =>{

            hideConfirmation();

            if(confirmationInfo.value.action == 'confirm-pay'){

                context.emit('on-accept',{files:uploadFilesListRef.value.files,payment: payment_id});
            }
            
        }
        const onCancelConfirm = () =>{
            hideConfirmation();          
        }

        const onCancel = () =>{
            context.emit('on-cancel');
        }


        const onPayTypeSelected = ( option ) =>{

            payment_id.value = '';
          
            if(!option) return;

            payment_id.value = option.value;

            switch (option.label.toLowerCase()) {
                case 'tarjeta de credito/debito':

                    currentPayComponentProperties.value = { message: 'Adjunte el comprobante de pago' };
                    currentPayComponent.value = 'PayData';

                    break;
                case 'efectivo':

                    currentPayComponentProperties.value = { message: 'Adjunte el comprobante de pago' };
                    currentPayComponent.value = 'PayData';

                    break;
                case 'cheque':

                    currentPayComponentProperties.value = { message: 'Adjunte el comprobante de pago' };
                    currentPayComponent.value = 'PayData';

                    break;
                case 'transferencia bancaria':
                    currentPayComponentProperties.value = { company: currentOrder.value.company, currency };
                    currentPayComponent.value = 'BankData';
                    break;
            
                default:
                    break;
            }

        }

        onMounted( ()=>{

            if(props.payLoad){                      
               

                currentOrder.value = props.payLoad;                
    
                title.value  = `Pagar orden de compra ${currentOrder.value.order_code}`;

                setPayOptions();
            }  
        });
        
       

        return{
            currentOrder,
            uploadFilesListRef,     
            paymentTypeRef,
           
            currency,
            title,
            cbuTooltip,
            aliasTooltip,
            formatAmount,
            formatDate,
            payOptions,
            currentPayComponent,
            currentPayComponentProperties,
            onPayTypeSelected,
            onCopyText,
            onAccept,
            onCancel,
            onConfirm,
            onCancelConfirm
        }
    }
});