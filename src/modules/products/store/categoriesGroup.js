import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCategoriesGroupStore = defineStore('categoriesGroupStore', () =>{

    const categoriesGroup = ref([]);


    const setCategoriesGroup = ( val ) =>{
        categoriesGroup.value = val;
    }


    return{
        //Properties
        categoriesGroup,


        //Getters


        //Actions
        setCategoriesGroup,

    }

});