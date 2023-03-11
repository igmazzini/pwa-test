import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useOrdersStore = defineStore('ordersStore', () =>{

    const orders = ref([]);
    const currentOrder = ref(null);
    const ordersDetailByCategories = ref([]);
    const searchResults = ref([]);


    const setOrders = ( val ) =>{
        orders.value = val;
    }

    const setCurrentOrder = ( val ) =>{      

        currentOrder.value = val;
    }

    const setOrdersDetailByCategories = ( val ) =>{
        ordersDetailByCategories.value = val;
    }

    const setSearchResults = ( val ) =>{
        searchResults.value = val;
    }


    return{
        //Properties
        orders,
        ordersDetailByCategories,
        searchResults,
        currentOrder,

        //Getters


        //Actions
        setOrders,
        setCurrentOrder,
        setOrdersDetailByCategories,
        setSearchResults

    }

});