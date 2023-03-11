<script src="./PayOrderModal.js"></script>
<template>
    <div class="modal"> 
        <div class="modal-layout">
            <div class="modal-title">
                <p>{{title}}</p>
            </div>
            <div  class="modal-form animate__animated animate__fadeIn animate__faster">
                <div class="provider-data">
                    <p>Información de proveedor</p>
                    <TextField :label="'Razon social'" :text="currentOrder?.company?.company_name" :withCopy="true"/>
                    <TextField :label="'CUIT'" :text="currentOrder?.company?.extra_data?.cuil" :withCopy="true"/>
                    <TextField :label="'Fecha de pago'" :text="formatDate(currentOrder?.date_payment)"/>  
                    <TextField :label="'Importe'" :text="formatAmount(currentOrder?.amount)" :withCopy="true"/>                   
                      
                </div>
                <div class="provider-contact-data">
                   
                     <p>Información de contacto</p>
                     <TextField :label="'Nombre'" :text="'Santiago Gonzales'" :withCopy="true"/>
                     <TextField :label="'Email'" :text="currentOrder?.company?.extra_data?.email" :withCopy="true" />
                     <TextField :label="'Cargo'" :text="'Gerente de ventas'"/>                    
                     <TextField :label="'Telefono'" :text="currentOrder?.company?.extra_data?.phone" :withCopy="true"/>                    
                    
                </div>
                <div class="pay-data">                    
                    <SelectPayment ref="paymentTypeRef" :label="'Forma de pago'" @option-selected="onPayTypeSelected"/>
                    <keep-alive>
                    <component :is="currentPayComponent"  v-bind="currentPayComponentProperties"></component>
                    </keep-alive>
                   
                </div>
                <div class="proof-data">
                    <p>Comprobantes</p>
                    <div class="proof-container">
                        <UploadFilesList ref="uploadFilesListRef" :previousFiles="currentOrder?.storages"/>
                    </div>
                </div>
            </div>
            <div class="modal-actions">
                <p class="last-updated">Ultima actualización: {{formatDate(currentOrder?.log?.date, true)}} por {{currentOrder?.log?.by.name}}</p>
                <button @click="onCancel" class="modal-actions--cancel">Cancelar</button>
                <button @click="onAccept" class="modal-actions--accept">Pagar</button>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    @import "./pay-order-modal.scss";

    .modal-container{
        z-index: 30;
    }
</style>