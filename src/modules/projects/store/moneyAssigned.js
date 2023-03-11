import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMoneyAssignedStore = defineStore('moneyAssigned', () =>{

    const moneyAssigned = ref([]);
    const currentMoneyAssigned = ref(null);
    const searchResults = ref([]);


    const setMoneyAssigned = ( val ) =>{
        moneyAssigned.value = val;
    }

    const setCurrentMoneyAssigned = ( val ) =>{
        currentMoneyAssigned.value = val;
    }


    const setSearchResults = ( val ) =>{
        searchResults.value = val;
    }


    return{
        //Properties
        moneyAssigned,
        searchResults,
        currentMoneyAssigned,


        //Getters


        //Actions
        setMoneyAssigned,
        setCurrentMoneyAssigned,
        setSearchResults
    }

});