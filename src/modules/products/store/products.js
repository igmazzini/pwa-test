import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProductsStore = defineStore('productsStore', () =>{

    const products = ref([]);


    const setProducts = ( val ) =>{
        products.value = val;
    }


    return{
        //Properties
        products,
        //Getters


        //Actions
        setProducts,

    }

});