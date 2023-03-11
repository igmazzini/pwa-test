import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useExpenseReportsStore = defineStore('expenseReports', () =>{

    const expenseReports = ref([]);
    const currentExpenseReport = ref(null);
    const expenseReportsDetailByDates = ref([]);
    const searchResults = ref([]);


    const setExpenseReports = ( val ) =>{
        expenseReports.value = val;
    }

    const setCurrentExpenseReport = ( val ) =>{
        currentExpenseReport.value = val;
    }

    const setExpenseReportsDetailByDates = ( val ) =>{
        expenseReportsDetailByDates.value = val;
    }

    const setSearchResults = ( val ) =>{
        searchResults.value = val;
    }


    return{
        //Properties
        expenseReports,
        currentExpenseReport,
        expenseReportsDetailByDates,
        searchResults,

        //Getters


        //Actions
        setExpenseReports,
        setCurrentExpenseReport,
        setExpenseReportsDetailByDates,
        setSearchResults

    }

});