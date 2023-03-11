<script src="./NewExpenseReportModal.js"></script>
<template>
  

        <div class="modal-layout">
            <div class="modal-title">
                <p>{{title}}</p>
            </div>
            <div class="modal-form">
                <div class="expense-general-data">

                    <Input ref="amountInput" :label="'Importe'" v-model="expenseReportData.amount" :type="'money'" />
                   
                    <SelectCategory ref="categorySelect" class="modal-form--select" :label="'Rubro'"  @selected="onCategorySelected" />
                    
                    <SelectProduct ref="itemsSelect" class="modal-form--select" :label="'Item'"   @selected="onItemSelected" />

                    <Input v-model="expenseReportData.motive" :label="'Motivo'" />

                    <div class="dates-files-container">
                        <div class="new-cash-yield-dates">
                        <button @click="onDateSelected('yesterday')"
                            :class="['new-cash-yield-dates-item', (selectedDate == 'yesterday') ? 'item-selected' : '']">
                            <p>{{yesterday}}</p>
                            <p>Ayer</p>
                        </button>
                        <button @click="onDateSelected('today')"
                            :class="['new-cash-yield-dates-item', (selectedDate == 'today') ? 'item-selected' : '']">
                            <p>{{today}}</p>
                            <p>Hoy</p>
                        </button>
                        
                        <button @click="onDateSelected('customDate')"  :class="['new-cash-yield-dates-item','pay-date-containter', (selectedDate == 'customDate') ? 'item-selected' : '']">
                            <Datepicker ref="datePicker" class="date-picker"    autoApply :dark="darkMode" @update:modelValue="onCustomDateSelected" :enableTimePicker="false" locale="esp"/>
                            <font-awesome-icon  icon="fa-regular fa-calendar" v-if="customDay == ''" />
                            <p v-if="customDay != ''">{{customDay}}</p>
                            
                        </button>
                    
                    </div>
                    <div class="files">
                        <UploadFilesList ref="uploadFilesListRef" :nameFileWidth="10" :expense-report="true" />
                    </div>
                    </div>
                   
                </div>
                <div class="expense-by-type-data">
                    <p>Factura</p>
                    <Select ref="invoiceTypeSelect" class="modal-form--select" :label="'Tipo'" :options="invoiceOptions"  @option-selected="onInvoiceTypeSelected" />
                    
                    <SelectProvider v-if="invoiceData.type != 'no-invoice'" :showAddNew="true" ref="invoiceProviderSelect"  class="modal-form--select" :label="'Razón social / CUIT'"   @selected="onProviderSelected" />
                    <div v-if="invoiceData.type != ''"  class="data-type-a">                       
                        <Input v-if="newProvider"  ref="providerNameInput" :label="'Razón social'" :forceValue="invoiceData.provider_data.company_name" />
                        <Input v-if="newProvider" ref="cuitInput" :label="'CUIT'" :forceValue="invoiceData.provider_data.cuit" />
                        <Input v-if="newProvider" ref="cuitInput" :label="'Dirección'" :forceValue="`${invoiceData.provider_data.street} ${invoiceData.provider_data.street_number} - ${invoiceData.provider_data.locality}` " />
                        <Input v-if="invoiceData.type == 'A'" ref="notTaxInput" :label="'No gravado'"  v-model="invoiceData.no_tax" :type="'money'"/>
                        <Input v-if="invoiceData.type == 'A'" ref="taxInput" :label="'Gravado'"  v-model="invoiceData.tax" :type="'money'"/>
                        <Input v-if="invoiceData.type == 'A'" ref="iva21Input"   :label="'Iva 21%'"  :type="'money'" v-model="invoiceData.iva21" />
                        <Input v-if="invoiceData.type == 'A'" ref="iva10Input"  :type="'money'" :label="'Iva 10.5%'" v-model="invoiceData.iva10" />
                        <Input v-if="invoiceData.type == 'A'" ref="percepIvaInput" :label="'Percepción Iva'" v-model="invoiceData.percepIva" :type="'money'"  />
                        <Input v-if="invoiceData.type == 'A'" ref="percepIIBBInput" :label="'Percepción IIBB'" v-model="invoiceData.percepIIBB" :type="'money'"  />
                        <Input v-if="invoiceData.type == 'A'" ref="caeInput" :label="'CAE'" v-model="invoiceData.cae" :type="'money'"  />
                        <Input v-if="invoiceData.type == 'A'" ref="totalInputIva" :label="'Total + Iva'"  v-model="invoiceData.total"  :type="'money'" />
                        <Input v-if="invoiceData.type == 'no-invoice'" ref="placeNameInput" :label="'Establecimiento'"  v-model="invoiceData.place_name"  :type="'text'" />
                        <Input v-if="invoiceData.type == 'no-invoice'" ref="contactNameInput" :label="'Nombre y Apellido'"  v-model="invoiceData.contact_name"  :type="'text'" />
                        <Input v-if="invoiceData.type == 'no-invoice'" ref="contactEmailInput" :label="'Email'"  v-model="invoiceData.contact_email"  :type="'text'" />
                        <Input v-if="invoiceData.type == 'no-invoice'" ref="contactAddressInput" :label="'Dirección'"  v-model="invoiceData.contact_address"  :type="'text'" />
                        <Input v-if="invoiceData.type == 'no-invoice'" ref="contactPhoneInput" :label="'Telefono'"  v-model="invoiceData.contact_phone"  :type="'text'" />
                        <Input v-if="invoiceData.type != 'A'" ref="totalInput" :label="'Total'"  v-model="invoiceData.total"  :type="'money'" />
                        
                    </div>
                   
                   
                    
                </div>


            </div>

           


            <div class="modal-actions">
                <button @click="onCancel" class="modal-actions--cancel">Cancelar</button>
                <button @click="checkBalance" class="modal-actions--accept">{{acceptButtonLabel}}</button>
            </div>
        </div>

   

</template>



<style lang="scss" scoped>
@import "./new-expense-report-modal.scss";
.modal-container{
        z-index: 30;
    }
</style>