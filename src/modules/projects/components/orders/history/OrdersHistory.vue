<template>
    <div  class="orders-history-container">
                  

        <div v-if="(mobile) ? !showDetail : true"
            class="orders-list-container animate__animated animate__fadeInLeft animate__faster">
            <OrdersList />
        </div>
        <div v-if="showDetail"  class="orders-detail-container animate__animated animate__fadeInRight animate__faster">
           
            <OrderDetail  @on-annulate="onOrderDelete" @on-pay="onOrderPay" @on-update="onOrderUpdate" @on-approved="onOrderApprove"/>
        </div>

        <div v-if="!mobile" class="history-actions">
            <button @click="onNewOrder" class="cta-button">
                <font-awesome-icon icon="fa-solid fa-plus" />
                <p>Nueva orden</p>
            </button>
        </div>


    </div>
</template>

<script>

import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {OrdersList, OrderDetail}  from '@/modules/projects/components/orders';
import { useUI, useModal } from '@/modules/shared/composables';
import { useOrders } from '@/modules/projects/composables';

export default {
    name: 'OrdersHistory',
    components: {
        OrdersList,
        OrderDetail,         
      

    },
    props:{
        projectId:{
            type:String,
            required:true 
        }
    },
    setup(props) {

        

        const router = useRouter();
        const route = useRoute();
        const { setArrowCallback, mobile, formatAmount } = useUI();
        const { showModal, hideModal, showConfirmation, hideConfirmation } = useModal();
        const {  updateOrder, uploadOrder , payOrder,approveOrder, annulateOrder , orders, currentOrder, setCurrentOrder } = useOrders( mobile.value ? props.projectId  : '');
       
        const showDetail = ref(false);
      
      
          
           
        const currentOrderInfo = ref({
            title:'Aprobar orden',
            text:'¿Desea aprobar esta orden?',
            info:'Sarasa'
        }); 
        
        


        if (!mobile.value) {
            showDetail.value = true;
        }

        if(route.params && route.params.id != ''){
            
           setCurrentOrder( orders.value.find( o => o.order_id == route.params.id ) );
        }     


        watch(currentOrder, (val) => {
            if (val) {

                

                setArrowCallback(() => {

                    setCurrentOrder(null);

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

        
        const onFinishMutation = ( result ) =>{
           

            if( result ){                           

                hideModal();
                hideConfirmation();  
                
                if(currentOrder.value){
                    setCurrentOrder( orders.value.find( o => o.order_id == currentOrder.value.order_id ) );
                }
               
              
            }

          
        }

        const goBack = () => {
            router.go(-1);
        }

        const onOrderUpdate =  (order) => {

            updateOrder(order, onFinishMutation);
        }

        

        const onNewOrder = () =>{
           
            showModal('NewOrder', onNewOrderAccept, onNewOrderCancel);
        }

        const onNewOrderAccept =  ( data ) =>{
           
            uploadOrder(data, onFinishMutation);
      
           
        }
        const onNewOrderCancel = (  ) =>{
            
            hideModal();
        }

        const onOrderApprove = (  ) =>{

           
           
            currentOrderInfo.value = {
                title:'Aprobar orden',
                info:`${currentOrder.value.order_code} por ${ formatAmount(currentOrder.value.amount)}`,
                text:'¿Desea aprobar esta orden?',
                action:'approve'
            }
           
            showConfirmation(onConfirmAccept, onConfirmCancel, currentOrderInfo.value);
        }


        const onOrderPay = ( ) =>{            
          

            if(mobile.value){

                router.push({name:'pay-order-page'});

            }else{

                showModal('PayOrder',onPayOrderAccept, onPayOrderCancel, currentOrder.value);
            }

            
           
            
        }

        const onOrderDelete = ( ) =>{                

            currentOrderInfo.value = {
                title:'Anular orden',
                text:'¿Desea anular esta orden?',
                info:`Orden: ${currentOrder.value.order_code} por ${ formatAmount(currentOrder.value.amount)}`,
                type:'delete',
                action:'delete'
            }

          

            showConfirmation(onConfirmAccept, onConfirmCancel, currentOrderInfo.value);

        }

        const onPayOrderAccept = ({files, payment  }) =>{   


                let orderFiles = [];                

                files.forEach( file => {
                if(file.file || file.storage_url != ''){
                    orderFiles.push(file);
                }
                });     

                currentOrder.value.files = orderFiles;
                currentOrder.value.payment_id = payment;


                payOrder(currentOrder.value, onFinishMutation);

               

        }

        const onPayOrderCancel = () =>{
            hideModal();
        }

        const onConfirmAccept = () =>{

            
            switch (currentOrderInfo.value.action) {
                case 'approve':
                    approveOrder(currentOrder.value.order_id, onFinishMutation);
                    break;
                case 'delete':
                    annulateOrder(currentOrder.value.order_id, onFinishMutation);    
                    break;             
            
                default:
                    break;
            }
        

           
        }


        const onConfirmCancel = () =>{
            hideConfirmation();
        }


        return {
            //Properties
            currentOrder,
            mobile,
            showDetail,           
           
          
          

            //Methods          
            onOrderUpdate,
            onNewOrder,
            onNewOrderAccept,
            onNewOrderCancel,
            onOrderApprove,
            onOrderDelete,
            onOrderPay,
            onPayOrderAccept,
            onPayOrderCancel,
            onConfirmAccept,
            onConfirmCancel,
        }
    }
}
</script>

<style lang="scss" scoped>

.orders-history-container {
    position: relative;
    display: grid;
    height: 100%;
    gap: 20px;
    grid-template-columns: 55% 45%;
    grid-template-rows: 1fr 10%;
    padding: 15px;


}




.orders-list-container,
.orders-detail-container {

    width: 100%;
    height: 100%;
    transition: all var(--animation-duration) var(--animation-type);

}


.orders-detail-container {
   
    background-color: var(--light-background-color);
    border-radius: 16px;
    height: 100%;
  

}

.dark .orders-detail-container{
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

    .orders-history-container {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        padding: 0;
    } 
  

    .orders-list-container,
    .orders-detail-container {
        position: absolute;
        background-color: var(--background-grey);
    }



    .dark .orders-list-container,
    .dark .orders-detail-container{
        background-color: black;
    }


}
</style>