<script src="./OrderDetail.js"></script>
<template>
   <div :class="['order-detail']">
    
    <div v-if="currentOrder" class="order-detail--title">
        <p v-show="currentOrder">{{title}}</p>
        <p v-show="currentOrder">Estado: <span  :class="currentOrder.status.toLowerCase()" >{{getStatus(currentOrder.status)}}</span></p>
    </div>
    <div :class="['order-detail--data',(!currentOrder) ? 'not-order' : '']">
        <p v-if="!currentOrder">Seleccione una orden</p>
        <div v-if="currentOrder" class="order-detail--data---form">
                <TextField :label="'Plazo de pago'" :text="formatDate(currentOrder.date_payment)" :withCopy="false"/>
                <TextField :label="'Monto'" :text="formatAmount(currentOrder.amount)" :withCopy="false"/>
                <TextField :label="'Proveedor'" :text="currentOrder.company?.company_name" :withCopy="false"/>
                <TextField :label="'Rubro'" :text="currentOrder.category?.category_name" :withCopy="false"/>
                <TextField :label="'Item'" :text="currentOrder.products[0]?.product_name" :withCopy="false"/>               
                
                <TextField :label="'Motivo'" :text="currentOrder.extra_data?.reason" :withCopy="false"/>
              
                <div class="files">
                    <UploadFilesList :previousFiles="currentOrder.storages" :canDeletePrevious="true" ref="uploadFilesListRef"/>
                </div>                
             
        </div>
       

        
        <div v-if="currentOrder" class="order-detail--data---actions">
            <button v-if="currentOrder.status.toLowerCase() == 'pending'" @click="onAnnularOrder" class="cta-delete">{{annulateButtonLabel}}</button>
            <button @click="onUpdateOrder" class="cta-update" >Actualizar</button>
            <button v-if="currentOrder.status.toLowerCase() == 'pending'" @click="onPayOrder" class="cta-pay" >{{payButtonLabel}}</button>
            <!-- <button v-if="order.status == 'PENDING'" @click="onApprovedOrder" class="cta-approved" >{{approvedButtonLabel}}</button> -->
           
        </div>
       
    </div>
    <p v-if="currentOrder && currentOrder.log &&  !mobile" class="last-updated">Ultima actualización: {{formatDate(currentOrder.log.date, true)}} por {{currentOrder.log.by.name}}</p>
   </div> 
</template>



<style lang="scss" scoped>
@import "./order-detail.scss";
</style>