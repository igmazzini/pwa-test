import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePaymentStore = defineStore('paymentStore', () =>{

    const paymentTypes = ref([]);

    const setPaymentTypes = ( val ) =>{
        paymentTypes.value = val;
    }


    return{
        //Properties
        paymentTypes,

        //Getters


        //Actions
        setPaymentTypes

    }

});