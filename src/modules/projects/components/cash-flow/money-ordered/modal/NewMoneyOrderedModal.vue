<template> 

        <div class="modal-layout">
            <div class="modal-title">
                <p>Solicitud de efectivo</p>
            </div>
            <div v-show="!showConfirm" class="modal-form animate__animated animate__fadeInLeft animate__faster">
                <SelectCategory ref="selectCategoryRef"  @selected="onCategorySelected" />
                <SelectProduct ref="selectProductRef"  @selected="onProductSelected" />
                <Input ref="amountInputRef" v-model="requestData.amount" :label="'Monto'" :type="'money'" />
                <Input ref="motiveInputRef" v-model="requestData.motive" :label="'Motivo'" />
            </div>
            <div v-show="showConfirm" class="confirm-modal-form animate__animated animate__fadeInRight animate__faster">
                <p><strong>Solicitado por:</strong> {{ userProfile.name }}</p>
                <p><strong>Rubro:</strong> {{ requestData.category }}</p>
                <p><strong>Item:</strong> {{ requestData.product }}</p>
                <p><strong>Monto:</strong> {{ formatAmount(requestData.amount) }}</p>
                <p><strong>Motivo:</strong> {{ requestData.motive }}</p>
                <p><strong>Fecha:</strong> {{ formatDate(transactionDate) }}</p>

           
            </div>
           
            <div class="modal-actions">
                <div class="modal-balances">    
                    <p>Balance disponible: {{ formatAmount(currentProjectBudget.available_balance) }} </p>                        
                    <p>Balance de usuario: {{ formatAmount(currentUserBalance?.balance) }}</p>
                </div>
               
                <button @click="onCancel" class="modal-actions--cancel">Cancelar</button>
                <button @click="checkBalance" class="modal-actions--accept">{{ lblAceptar }}</button>
            </div>
        </div>


</template>

<script>
import { ref } from 'vue';

import {Input } from '@/modules/shared/components';
import {SelectProduct, SelectCategory} from '@/modules/products/components';
import { useProfiles } from '@/modules/profiles/composables/useProfiles';
import { useUI, useModal } from '@/modules/shared/composables';
import { useProject } from '@/modules/projects/composables';



export default {
    name: 'NewMoneyOrderedModal',
    components: {
        Input,
        SelectProduct,
        SelectCategory,
       
    },
    props:{
       payLoad:{
        default:null
       }   
    },
    emits: [
        'on-cancel',
        'on-accept'
    ],
    setup(props, context) {

        const { formatAmount, formatDate, } = useUI();
        const { showConfirmation, hideConfirmation } = useModal();
        const { userProfile, currentUserBalance } = useProfiles();       
        const { currentProjectBudget } = useProject(); 
        const profileOptions = ref([]);     
        const selectCategoryRef = ref(null);
        const selectProductRef = ref(null);
        const amountInputRef = ref(null);
        const motiveInputRef = ref(null);
        const showConfirm = ref(false);       
        const lblAceptar = ref('Solicitar');
        const transactionDate = ref('');
        const requestData = ref({
            user: '',
            amount: 0,
            category: '',
            category_id: '',
            category_code: '',
            product: '',
            product_id: '',
            motive: ''

        });
        const confirmationInfo = ref({
            title:'Presupuesto excedido',
            text:'¿Confirma la solicitud?',
            info:'El monto de la solicitud excede el presupuesto del proyecto',
            type:'warning'
        });





      

        const onCategorySelected = (option) => {

            requestData.value.category = '';
            requestData.value.category_id = '';

            if (!option) return;

            requestData.value.category = option.label;
            requestData.value.category_id = option.value;
            requestData.value.category_code = option.code;

           

            selectProductRef.value.filterByCategory(option.code);



        }
        const onProductSelected = (option) => {


            requestData.value.product = '';
            requestData.value.product_id = '';

            if (!option) return;

            requestData.value.product = option.label;
            requestData.value.product_id = option.value;

        }

        const checkBalance = () =>{

            

            if (!showConfirm.value &&  !currentProjectBudget.value.has_agreement  && requestData.value.amount > currentProjectBudget.value.available_balance_with_agreement ) {
                console.log('Presupuesto excecido confirmar la solicitud')  
                confirmationInfo.value = {
                    title:'Presupuesto excedido',
                    text:'¿Confirma la solicitud?',
                    info:'El monto de la solicitud excede el presupuesto del proyecto',
                    type:'warning'
                };
               
                showConfirmation(onModalConfirmAccept,onModalConfirmCancel, confirmationInfo.value);

            }else if(!showConfirm.value &&   currentProjectBudget.value.has_agreement  &&  requestData.value.amount > currentProjectBudget.value.available_balance_with_agreement){
                console.log('Presupuesto excecido no se puede general la solicitud')    
                confirmationInfo.value = {
                    title:'Presupuesto excedido',
                    text:'No se puede generar esta solicitud',
                    info:'El monto de la solicitud excede el presupuesto del proyecto',
                    type:'warning'
                };

                showConfirmation(onModalConfirmAccept,onModalConfirmCancel, confirmationInfo.value);
            }else{
                onAccept();
            }

        }

        const onModalConfirmAccept = () =>{


            hideConfirmation();

            if(!currentProjectBudget.value.has_agreement){
              

                showConfirm.value = true;

                lblAceptar.value = 'Confirmar';

                transactionDate.value = new Date();
            }

           
            
        }
        const onModalConfirmCancel = () =>{
           hideConfirmation();
        }


        const onCancel = () => {

            if (showConfirm.value) {

                showConfirm.value = false;

                lblAceptar.value = 'Asignar';

            } else {

                context.emit('on-cancel');

            }

        }

        const onAccept = async () => {


            let errors = false;          

            if (requestData.value.amount == 0) {
                amountInputRef.value.checkError();
                errors = true;
            }           

            if (requestData.value.category == '') {
                selectCategoryRef.value.checkError();
                errors = true;
            }
            if (requestData.value.product == '') {
                selectProductRef.value.checkError();
                errors = true;
            }
           
            if (requestData.value.motive == '') {
                motiveInputRef.value.checkError();
                errors = true;
            }


            if (!errors) {

                if (!showConfirm.value) {

                    showConfirm.value = true;

                    lblAceptar.value = 'Confirmar';

                    transactionDate.value = new Date();

                } else {

                    context.emit('on-accept', requestData.value);
                }

            }

        }


     

        return {
            profileOptions,
            userProfile,           
            selectCategoryRef,
            selectProductRef,
            amountInputRef,
            motiveInputRef,
            currentProjectBudget,
            currentUserBalance,
            transactionDate,           
            requestData,
            lblAceptar,
            showConfirm,          
            confirmationInfo,



            checkBalance,
            onCategorySelected,
            onProductSelected,           
            formatAmount,
            formatDate,
            onCancel,
            onAccept,
            onModalConfirmAccept,
            onModalConfirmCancel
          
        }
    }

}
</script>

<style lang="scss" scoped>


@import "./new-money-ordered-modal.scss";

.modal-container{
        z-index: 30;
    }
</style>