import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMoneyOrderedStore = defineStore('moneyOrdered', () =>{

    const moneyOrdered = ref([]);
    const currentMoneyOrdered = ref(null);
    const searchResults = ref([]);


    const setMoneyOrdered = ( val ) =>{
        moneyOrdered.value = val;
    }

    const setCurrentMoneyOrdered = ( val ) =>{
        currentMoneyOrdered.value = val;
    }

    const setSearchResults = ( val ) =>{
        searchResults.value = val;
    }


    return{
        //Properties
        moneyOrdered,
        searchResults,
        currentMoneyOrdered,

        //Getters


        //Actions
        setMoneyOrdered,
        setSearchResults,
        setCurrentMoneyOrdered

    }

});