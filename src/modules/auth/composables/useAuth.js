

import { checkAutentication, googleSignUp, googleLogOut } from '@/modules/auth/services/authServices';

import { useMutation, useQueryClient } from '@tanstack/vue-query';

import { storeToRefs } from "pinia";
import { computed, ref } from 'vue'
import { useAuthStore } from '@/modules/auth/store/auth';
import { useUI } from '@/modules/shared/composables';



export const useAuth = () => {

    
    const store = useAuthStore();

    const queryClient = useQueryClient();

    const { status,user:storeUser, }  = storeToRefs(store);
    const { showMessage, showLoading } = useUI();
    const finishQueryCallBack = ref(null);



    /// GETTERS ///

    const authStatus = computed(() => status.value )

    const user = computed(() => storeUser.value )

    /// MUTATIONS ///

    const loginGoogleMutation = useMutation(
        googleSignUp,
        {
            onMutate: () => {

                showLoading(true, 'Iniciando sesión...');
            },           
            onSuccess: (data) => {

                if (data.ok) {

                    const { user, idToken } = data.data;      
                    
                    //console.log('Succes login ',idToken)
                    
                    localStorage.setItem('token', idToken);                    

                    store.setUser(user);
                    store.setToken(idToken);

                    callFinishCallBack(true);

                }else{

                    store.setUser(null);
                    store.setRefreshToken(null);
                    store.setToken(null);
                    store.setStatus('not-authenticated');


                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');

                    showMessage(data.error, 'error');

                    callFinishCallBack(true);

                }



            },

            onError: (error) => {

                showMessage(error.toString(), 'error');

                callFinishCallBack(false);

                //showLoading(false);
            },

        }
    );

    const logOutGoogleMutation = useMutation(
        googleLogOut,
        {
            onMutate: () => {

                showLoading(true, 'Cerrando sesión...');
            },

            onSettled: () => {

                clear();

                callFinishCallBack(true);

                showLoading(false);
            },


        }
    );

    const checkAuthStatusMutation = useMutation(
        checkAutentication,
        {

            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        const { user, idToken, refreshToken } = data.data;

                        if (refreshToken) {

                            localStorage.setItem('refreshToken', refreshToken);

                            store.setRefreshToken(refreshToken);
                        }


                        if (idToken) {

                            localStorage.setItem('token', idToken);

                            store.setToken(idToken);
                        }

                        store.setUser(user);

                        store.setStatus('authenticated');

                        callFinishCallBack(true);

                    } else {

                        console.log('Error ' + data.error);

                        showMessage(data.error, 'error');

                        callFinishCallBack(false);
                    }

                }

            },

            onSettled: () => {
                showLoading(false);
            },
            onError: (error) => {
                showMessage(error.toString(), 'error');

                callFinishCallBack(false);

                showLoading(false);
            },

        }
    );

   

    /// METHODS ///

    const callFinishCallBack = (val) => {

        if (finishQueryCallBack.value) {

            finishQueryCallBack.value(val);
        }
    }

    const loginWithGoogle = (callBack) => {

        finishQueryCallBack.value = callBack;    
        
        clear();

        loginGoogleMutation.mutate();
    };

    const logOutGoogle = (callBack) => {

        finishQueryCallBack.value = callBack;

        logOutGoogleMutation.mutate();
    };


    const checkAuthStatus = () => {

        checkAuthStatusMutation.mutate();

    }


    const clear = () =>{

        store?.clearAuth();

        queryClient?.clear();

        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }



    return {
       
        loginWithGoogle,
        logOutGoogle,
        checkAuthStatus,
        clear,
        authStatus,
        user


    }

}

