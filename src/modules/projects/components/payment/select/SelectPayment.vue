<template>
    <Select ref="selectPaymentRef" :label="props.label" :options="options"  @option-selected="onPaymentSelected" />
</template>

<script setup>
import {ref, watch } from 'vue';
import {Select} from '@/modules/shared/components';
import { useUI } from '@/modules/shared/composables';
import { usePayments } from '@/modules/projects/composables';

// eslint-disable-next-line no-undef
const props = defineProps({
    label:{ type: String,default:'Formas de pago'}
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['selected']);

const { sortAlphabetically } =  useUI();
const { paymentTypes } = usePayments();
const options = ref([]);
const selectPaymentRef = ref(null);

const setPayments = () =>{
   
    options.value  = paymentTypes.value.map( ( payment ) => {
        return {
            label:payment.payment_name,
            value:payment.payment_type_id,            
        }
    }); 

    options.value = sortAlphabetically(options.value,'label'); 
    
}

watch(paymentTypes,() => {
    setPayments();
});


const onPaymentSelected = ( option ) =>{
    emit('selected', option)
}

const addOption = ( option, first = true ) =>{
    if(first){
        options.value = [option, ...options.value];
    }else{
        options.value = [...options.value,option];
    }
   
} 


const checkError = () =>{
    selectPaymentRef.value.checkError();
}



// eslint-disable-next-line no-undef
defineExpose({
    addOption,
    checkError
    
});

setPayments();

</script>

<style lang="scss" scoped>

</style>