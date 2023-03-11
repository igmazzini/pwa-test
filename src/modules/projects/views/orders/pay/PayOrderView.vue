<template>
    <div class="pay-order">
        <div class="pay-order-title">
            <p>{{ currentOrder?.order_code }}</p>
        </div>
        <div v-if="!showNext" class="pay-order-data">
            <div class="data-container">
                <p>Información de proveedor</p>
                <TextField :label="'Razon social'" :text="currentOrder?.company?.company_name" :withCopy="true" />
                <TextField :label="'CUIT'" :text="currentOrder?.company?.extra_data?.cuil" :withCopy="true" />
                <TextField :label="'Fecha de pago'" :text="formatDate(currentOrder?.date_payment)" />
                <TextField :label="'Importe'" :text="formatAmount(currentOrder?.amount)" :withCopy="true" />
            </div>
            <div class="data-container">
                <p>Información de contacto</p>
                <TextField :label="'Nombre'" :text="'Santiago Gonzales'" :withCopy="true" />
                <TextField :label="'Email'" :text="currentOrder?.company?.extra_data?.email" :withCopy="true" />
                <TextField :label="'Cargo'" :text="'Gerente de ventas'" />
                <TextField :label="'Telefono'" :text="currentOrder?.company?.extra_data?.phone" :withCopy="true" />
            </div>
        </div>
        <div v-if="showNext" class="pay-order-data">
            <div class="data-container payment-data">
                
                <TextField  ref="paymentTypeRef" @click="onSelect('payment')" :label="'Forma de pago'" :text="paymentType" :withCopy="true" />
                <keep-alive>
                    <component :is="currentPayComponent" v-bind="currentPayComponentProperties"></component>
                </keep-alive>
            </div>
            <div class="data-container">
                <p>Comprobantes</p>
                <div class="files">
                    <UploadFilesList ref="uploadFilesListRef" :previousFiles="currentOrder?.storages"/>
                </div>
            </div>
        </div>
        <div class="actions">
            <button v-if="!showNext" @click="showNext = true" class="cta">Siguiente</button>
            <button v-if="showNext" @click="showNext = false" class="cta">Volver</button>
            <button v-if="showNext" @click="onPay" class="cta">Pagar</button>
        </div>
    </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { useRouter  } from 'vue-router';
import { TextField, UploadFilesList } from '@/modules/shared/components';
import BankData from '@/modules/projects/components/orders/modal/pay/BankData.vue';
import PayData from '@/modules/projects/components/orders/modal/pay/PayData.vue';
import { useUI, useMobileUI, useModal } from '@/modules/shared/composables';
import { useOrders, usePayments } from '@/modules/projects/composables';



export default {
    name: 'PayOrderView',
    components: {
        TextField,
        BankData,
        PayData,
        UploadFilesList,
       
    },
    setup() {


        //PROPERTIES
        const router = useRouter();
        const { formatAmount, formatDate, currency, setArrowCallback } = useUI();
        const { showConfirmation, hideConfirmation} = useModal();
        const { showUI, hideUI } = useMobileUI();
        const { currentOrder, payOrder } = useOrders();
        const { paymentTypes } = usePayments();
        const showNext = ref(false)
        const paymentId = ref('');
        const currentPayComponent = ref('PayData');
        const currentPayComponentProperties = ref({ message: 'Adjunte el comprobante de pago' });
        const paymentOptions = ref([]);
        const paymentType = ref('');
        const confirmationInfo = ref({
            title:'Orden sin comprobante',
            text:'¿Confirma el pago?',
            info:'Esta orden no tiene comprobante de pago',
            type:'warning'
        })


        //REFS
        const paymentTypeRef = ref(null);
        const uploadFilesListRef = ref(null);


        watch(paymentTypes, ()=>{
            setPaymentTypes();
        });





        //METHODS


        const goBack = () => {
            router.go(-1);
        }

        const setPaymentTypes = () =>{

            paymentOptions.value = paymentTypes.value.map( payment =>{
                return {
                    label:payment.payment_name,
                    value:payment.payment_type_id
                }
            } );
        }


        const onSelect = ( target ) =>{
            
            showUI('select',onSelectAccept,onSelectCancel,{title:'Forma de pago',target,options:paymentOptions.value} );
        }

        const onSelectAccept = ({  option }) => {

            paymentId.value = '';
            paymentType.value = '';

            if (!option) return;

            paymentId.value = option.value;
            paymentType.value = option.label;

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
                    currentPayComponentProperties.value = { company: currentOrder.value.company, currency: currency.value };
                    currentPayComponent.value = 'BankData';
                    break;

                default:
                    break;
            }

            hideUI();

        }

        const onSelectCancel = () =>{
            hideUI();
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


            return hasProof

          
        }


        const onPay = () =>{

            let error = false;

            if( paymentId.value == '' ){
                paymentTypeRef.value.showError();
                error = true;
            }

           
            if(!error){

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
                    onPayOrder();
                }

               
              
              
            }
        }

        const onConfirm = () =>{
            hideConfirmation();
            onPayOrder();
        }
        const onCancelConfirm = () =>{
            hideConfirmation();
        }

        const onPayOrder = () =>{
           

            let orderFiles = [];                

            uploadFilesListRef.value.files.forEach( file => {
                if(file.file || file.storage_url != ''){
                    orderFiles.push(file);
                }
            }); 

            currentOrder.value.files = orderFiles;
            currentOrder.value.payment_id = paymentId.value;

            payOrder(currentOrder.value, onFinishMutation);
        }


        const onFinishMutation = ( result ) =>{
            if(result){
                router.replace({name:'orders-history-page'});
            }
        }

        onMounted(() => {
            setPaymentTypes();
            setArrowCallback(goBack);
        })


        return {
            //Properties
            currentOrder,
            showNext,
            currentPayComponent,
            currentPayComponentProperties,
            paymentType,

            //REFS
            paymentTypeRef,
            uploadFilesListRef,


            //Methods
            formatAmount,
            formatDate,
            onSelect,
            onPay
        }
    }

}
</script>

<style lang="scss" scoped>
.pay-order {
    width: 100%;
    height: 100%;
    padding: 10px;
    display: grid;
    grid-template-rows: 3% 1fr 10%;
    font-size: 1.4em;
}

.pay-order-title {
    p {
        font-size: 1.1em;
        font-family: RobotoLight;
        color: var(--light-text-color);
        transition: all var(--animation-duration) var(--animation-type);
    }
}

.pay-order-data {
    width: 100%;
    height: 100%;
   
}

.data-container {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-top: 5%;
   

    p {
        grid-column: 1/-1;
        font-size: 1.1em;
        font-family: RobotoLight;
        margin: 0;
        color: var(--light-text-color);
        transition: all var(--animation-duration) var(--animation-type);
    }


}

.payment-data{
    .text-field,
    .pay-data-message,
    .bank-data{
        grid-column: 1/-1;
    }
}


.files{
    grid-column: 1/-1;
    height: 100px;
    border: 1px solid #ccc;
    border-radius: 16px;
    padding: 5px;
}

.actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.cta {
    background-color: var(--background-color);
    border: none;
    padding: 8px 20px;
    border-radius: 10px;
    color: var(--dark-text-color);
    margin-left: 15px;
    font-size: 1.2em;
    transition: all var(--animation-duration) var(--animation-type);

}


.cta:active {
    background-color: var(--button-active-color-light);
}
</style>