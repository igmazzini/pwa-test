<template>
    <DatePickerMobile v-if="showDatePicker" @on-accept="onAccept" @on-cancel="onCancel" />
    <SelectMobile  v-if="showSelect" :title="selectParams.title" :type="selectParams.type" :showAddNew="selectParams.showAddNew" :addNewLabel="selectParams.addNewLabel" :searchTarget="selectParams.searchTarget"  :target="selectParams.target" :options="selectParams.options" @on-cancel="onCancel"   @on-accept="onAccept" />
    <InputMobile v-if="showInput" :inputType="inputParams.inputType" :title="inputParams.title" :type="inputParams.type" :target="inputParams.target" :placeholder="inputParams.placeholder" @on-cancel="onCancel" @on-accept="onAccept" />
</template>

<script>

import {  SelectMobile, DatePickerMobile, InputMobile } from '@/modules/shared/components';
import { useMobileUI } from '@/modules/shared/composables';

export default {
    name:'MobileUI',
    components:{
        SelectMobile,
        DatePickerMobile,
        InputMobile
    },
    setup () {
        const { showSelect, selectParams,  showInput, inputParams, showDatePicker, onAccept, onCancel} = useMobileUI();
        return {
            showSelect,
            selectParams,

            showInput,
            inputParams,

            showDatePicker,

            onAccept,
            onCancel
        }
    }
}
</script>

<style lang="scss" scoped>

</style>