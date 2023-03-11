import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useHomeStore = defineStore('homeStore', () =>{
  
    const movementHistory = ref([]);  


    const setMovementHistory = ( val ) =>{
        
        movementHistory.value = val;
    }

  
    return{
        //Properties
        movementHistory,

        //Getters


        //Actions
        setMovementHistory,
       
    }

});