import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCategoriesStore = defineStore('categoriesStore', () =>{

    const categories = ref([]);


    const setCategories = ( val ) =>{
        categories.value = val;
    }


    return{
        //Properties
        categories,


        //Getters


        //Actions
        setCategories,

    }

});