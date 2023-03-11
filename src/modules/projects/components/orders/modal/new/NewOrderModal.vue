<script src="./NewOrderModal.js"></script>
<template>


        <div class="modal-layout">
            <div class="modal-title">
                <p>{{ title }}</p>
            </div>
            <div class="modal-form animate__animated animate__fadeIn animate__faster">

                <SelectProvider ref="providerSelect" class="modal-form--select" @selected="onProviderSelected" />
                <SelectCategory ref="categorySelect" class="modal-form--select" @selected="onCategorySelected" />
                <SelectProduct ref="itemsSelect" class="modal-form--select"  @selected="onItemSelected" />
                <Input ref="amountInput" :label="'Monto'" v-model="orderData.amount" :type="'money'" />
                <div class="pay-date-containter">
                    <Datepicker class="pay-date-picker" :minDate="new Date()" autoApply ref="payDatePicker"
                        :dark="darkMode" @update:modelValue="onDateSelected" :enableTimePicker="false" locale="esp" />
                    <Select :selected="datePickerSelectedOption" ref="payDateSelect" class="modal-form--select"
                        :label="'Plazo de pago'" :options="payDates" @option-selected="onPayDateSelected" />
                </div>

                <Input v-model="orderData.motive" :label="'Motivo'" />

            </div>

            <div class="files">
                <UploadFilesList ref="uploadFilesListRef" />
            </div>


            <div class="modal-actions">
                <button @click="onCancel" class="modal-actions--cancel">Cancelar</button>
                <button @click="onAccept" class="modal-actions--accept">{{ acceptButtonLabel }}</button>
            </div>
        </div>



</template>



<style lang="scss" scoped>
@import "./new-order-modal.scss";

</style>