import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('authStore', () =>{ 

    const status = ref('authenticating');// 'authenticated','not-authenticated', 'authenticating'
    const user = ref({name:'',photoUrl:'',email:''});
    const idToken = ref(null);
    const refreshToken = ref(null);


    const setStatus = ( val ) =>{
        status.value = val;
    }

    const setUser = ( val ) =>{
        user.value = val;
    }

    const setToken = ( val ) =>{
        idToken.value = val;
    }

    const setRefreshToken = ( val ) =>{
        refreshToken.value = val;
    }

    const clearAuth = () =>{

        status.value = 'not-authenticated';
        user.value = null;
        idToken.value = null;
        refreshToken.value = null;
    }


    return{
        //Properties
        status,
        user,
        idToken,
        refreshToken,

        //Getters


        //Actions
        setStatus,
        setUser,
        setToken,
        setRefreshToken,
        clearAuth


    }

});