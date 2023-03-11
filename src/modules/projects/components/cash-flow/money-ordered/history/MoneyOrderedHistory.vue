<template>
    <div  class="cash-request-history-container">
       
     

        <div v-if="(mobile) ? !showDetail : true"
            class="cash-request-list-container animate__animated animate__fadeInLeft animate__faster">
            <MoneyOrderedList/>
        </div>
        <div v-if="showDetail"  class="cash-request-detail-container animate__animated animate__fadeInRight animate__faster">
           
            <MoneyOrderedDetail   @on-cancel="onMoneyOrderedCancel"  @on-approve="onMoneyOrderedApprove" @on-pay="onMoneyOrderedPay"/>
        </div>

        <div v-if="!mobile" class="history-actions">
            <button @click="onNewMoneyOrdered" class="cta-button">
                <font-awesome-icon icon="fa-solid fa-plus" />
                <p>Nueva solicitud</p>
            </button>
        </div>


    </div>
</template>

<script>

import { ref, watch } from 'vue';
import {MoneyOrderedList, MoneyOrderedDetail}  from '@/modules/projects/components/cash-flow/money-ordered';
import { useUI, useModal } from '@/modules/shared/composables';
import { useRouter,useRoute } from 'vue-router';
import { useMoneyOrdered } from '@/modules/projects/composables';

export default {
    name: 'MoneyOrderedHistory',
    components: {
        MoneyOrderedList,
        MoneyOrderedDetail,
       
       

    },   
    setup() {

       
        const router = useRouter();
        const route = useRoute();
        const { setArrowCallback, mobile, formatAmount } = useUI();     
        const { showModal, hideModal, showConfirmation, hideConfirmation } = useModal();  
        const {moneyOrdered, currentMoneyOrdered, setCurrentMoneyOrdered, uploadMoneyOrdered, updateMoneyOrdered, payMoneyOrdered, approveMoneyOrdered, annulateMoneyOrdered } = useMoneyOrdered();
        const showDetail = ref(false);
       
           
        const currentMoneyOrderedInfo = ref({
            title:'Aprobar solicitud',
            text:'¿Aprobar solicitud?',
            info:'Sarasa'
        }); 
        
      


        if (!mobile.value) {
            showDetail.value = true;
        }     
        
        
        if (route.params && route.params.type == 'sc' && route.params.id != '') {

            setCurrentMoneyOrdered(moneyOrdered.value.find(mo => mo.money_ordered_id === route.params.id));

            route.params.type = '';

            route.params.id = '';

        } else {

            setCurrentMoneyOrdered(null);
        }


        watch(currentMoneyOrdered, (val) => {
            if (val) {

                setArrowCallback(() => {

                    setCurrentMoneyOrdered(null);

                    setArrowCallback(goBack);


                });



                if (mobile.value) {
                    showDetail.value = true;
                }

            } else {

                setArrowCallback(goBack);


                if (mobile.value) {
                    showDetail.value = false;
                }
            }
        });


        const onMutationFinish = ( result ) =>{

            if( result ){

               hideModal();
               hideConfirmation();          
              
              
               setCurrentMoneyOrdered(moneyOrdered.value.find(mo => mo.money_ordered_id === currentMoneyOrdered.value.money_ordered_id));
               
            }
        }


        const goBack = () => {
            router.go(-1);
        }
      
        const onMoneyOrderedUpdate = async (   ) => {


           updateMoneyOrdered(currentMoneyOrdered.value, onMutationFinish);           

        }


        const onNewMoneyOrdered = () =>{
           
            showModal('MoneyOrdered',onNewMoneyOrderedAccept,onNewMoneyOrderedCancel );
        }

        const onNewMoneyOrderedAccept = async ( data ) =>{
           
            uploadMoneyOrdered(data, onMutationFinish);      
           
        }
        
        const onNewMoneyOrderedCancel = (  ) =>{
            
            hideModal();
        }

        const onMoneyOrderedApprove = (  ) =>{

            
           
            currentMoneyOrderedInfo.value = {
                title:'Aprobacíon de solicitud',
                info:`${currentMoneyOrdered.value.profile.name} solicita efectivo por ${ formatAmount(currentMoneyOrdered.value.amount)}`,
                text:'¿Desea aprobar esta solicitud?',
                action:'approve'
            }
            showConfirmation(onConfirmAccept, onConfirmCancel, currentMoneyOrderedInfo.value);
        }

        const onMoneyOrderedCancel = (  ) =>{

            
           
            currentMoneyOrderedInfo.value = {
                title:'Cancelación de solicitud',
                info:`${currentMoneyOrdered.value.profile.name} solicita efectivo por ${ formatAmount(currentMoneyOrdered.value.amount)}`,
                text:'¿Desea cancelar esta solicitud?',
                action:'cancel',
                type:'warning'
            }
            showConfirmation(onConfirmAccept, onConfirmCancel, currentMoneyOrderedInfo.value);
        }


        const onMoneyOrderedPay = (  ) =>{

         
            currentMoneyOrderedInfo.value = {
                title:'Pago de solicitud',
                info:`Pago de ${ formatAmount(currentMoneyOrdered.value.amount)} a ${currentMoneyOrdered.value.profile.name}`,
                text:'¿Desea pagar esta solicitud?',
                action:'pay',
                type:'info'
            };
           
           
            showConfirmation(onConfirmAccept, onConfirmCancel, currentMoneyOrderedInfo.value);
        }

        const onConfirmAccept = async () =>{

           
            switch (currentMoneyOrderedInfo.value.action) {
                case 'approve':
                    
                    approveMoneyOrdered(currentMoneyOrdered.value.money_ordered_id, onMutationFinish);

                    break;
                case 'pay':

                    payMoneyOrdered(currentMoneyOrdered.value.money_ordered_id, onMutationFinish);

                    break;
                case 'cancel':

                    annulateMoneyOrdered(currentMoneyOrdered.value.money_ordered_id, onMutationFinish);

                    break;
            
                default:
                    hideConfirmation();
                    break;
            }

           
        }


        const onConfirmCancel = () =>{
            hideConfirmation();
        }

        return {
            //Properties
            currentMoneyOrdered,
            mobile,
            showDetail,
           
           
            currentMoneyOrderedInfo,

            //Methods           
            onMoneyOrderedUpdate,
            onNewMoneyOrdered,
            onNewMoneyOrderedAccept,
            onNewMoneyOrderedCancel,
            onMoneyOrderedApprove,
            onMoneyOrderedCancel,
            onMoneyOrderedPay,
            onConfirmAccept,
            onConfirmCancel
        }
    }
}
</script>

<style lang="scss" scoped>

.cash-request-history-container {
    position: relative;
    display: grid;
    height: 100%;
    gap: 20px;
    grid-template-columns: 60% 40%;
    grid-template-rows: 1fr 10%;
    padding: 15px;


}




.cash-request-list-container,
.cash-request-detail-container {

    width: 100%;
    height: 100%;
    transition: all var(--animation-duration) var(--animation-type);

}


.cash-request-detail-container {
   
    background-color: var(--light-background-color);
    border-radius: 16px;
    height: 100%;
  

}


.dark .cash-request-detail-container{
    background-color: var(--dark-background-color);
}


.history-actions {

    grid-column: 1/-1;
    grid-row: 2/-1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 6px;

}

.cta-button {
    background-color: var(--background-color);
    border: none;
    padding: 15px 30px;
    border-radius: 16px;
    color: var(--dark-text-color);
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.230);
    font-size: 1.8em;
    display: flex;
    align-items: center;
    justify-content: center;

    p {
        margin: 0;
        margin-left: 15px;
        padding: 0;
        display: inline;
        font-size: 0.8em;
    }
}

.cta-button:active {
    background-color: var(--button-active-color-light);
}

.cta-button:active {
    color: var(--light-text-color);
}


@media screen and (max-width: 1300px) {

    .cash-request-history-container {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
    } 
  

    .cash-request-list-container,
    .cash-request-detail-container {
        position: absolute;
        background-color: var(--background-grey);
    }

  

    .dark .cash-request-list-container,
    .dark .cash-request-detail-container{
        background-color: black;
    }


}
</style>