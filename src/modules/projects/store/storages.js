import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useStorageStore = defineStore('storageStore', () =>{

    const storageTypes = ref([]);

    const setStorageTypes = ( val ) =>{
        storageTypes.value = val;
    }


    return{
        //Properties
        storageTypes,

        //Getters


        //Actions
        setStorageTypes

    }

});