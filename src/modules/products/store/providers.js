import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProvidersStore = defineStore('providersStore', () =>{

    const providers = ref([]);


    const setProviders = ( val ) =>{
        providers.value = val;
    }


    return{
        //Properties
        providers,


        //Getters


        //Actions
        setProviders,

    }

});