import { storeToRefs } from "pinia";
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";

import { getProviders, upload, update, annulate } from '@/modules/products/services/providersService';
import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query';
import { useProvidersStore } from "@/modules/products/store/providers";
import { useUI } from '@/modules/shared/composables';
import { useAuth } from '@/modules/auth/composables/useAuth';

export const useProviders = () => {

    /// PROPERTIES ///

    const router = useRouter();
    const route = useRoute();

    const store = useProvidersStore();

    const { clear } = useAuth();

    const queryClient = useQueryClient();
    const { showMessage, showLoading } = useUI();

    const { providers: storeProviders } = storeToRefs(store);
    const finishQueryCallBack = ref(null);


    /// GETTERS ///

    const providers = computed(() => storeProviders.value);



    /// MUTATIONS ///

    const uploadProviderMutation = useMutation(
        upload,
        {
            onMutate: () => {

                showLoading(true, 'Cargando proveedor...');
            },

            onSettled: () => {

                showLoading(false);
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setProviders(data.data);

                        updateCache();

                        showMessage('Proveedor cargado', 'success');

                        callFinishCallBack(true);



                    } else {

                        console.log('Error ' + data.error);

                        showMessage(data.error, 'error');

                        callFinishCallBack(false);

                        if(data.status == '401'){
                           
                            onUnauthorizeRedirect()
                        }

                    }

                }

            },

            onError: (error) => {

                showMessage(error.toString(), 'error');

                callFinishCallBack(false);

                showLoading(false);
            },

        }
    );

    const updateProviderMutation = useMutation(
        update,
        {
            onMutate: () => {

                showLoading(true, 'Actualizando proveedor...');
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setProviders(data.data);

                        updateCache();

                        showMessage('Proveedor actualizado', 'success');

                        callFinishCallBack(true);

                    } else {

                        console.log('Error ' + data.error);

                        showMessage(data.error, 'error');

                        callFinishCallBack(false);

                        if(data.status == '401'){
                           
                            onUnauthorizeRedirect()
                        }
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

    const deleteProviderMutation = useMutation(
        annulate,
        {
            onMutate: () => {

                showLoading(true, 'Eliminando proveedor...');
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setProviders(data.data);

                        updateCache();

                        showMessage('Proveedor eliminado', 'success');

                        callFinishCallBack(true);

                    } else {

                        console.log('Error ' + data.error);

                        showMessage(data.error, 'error');

                        callFinishCallBack(false);

                        if(data.status == '401'){
                           
                            onUnauthorizeRedirect()
                        }
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


    /// QUERYS ///

    const providersQuery = useQuery(
        ['providers'],
        getProviders,
        {
            staleTime: 1000 * 60 * 60,//una hora
        }  

    );


    

    /// METHODS ///  

    const onUnauthorizeRedirect =  () =>{      

        if(route.name != 'login-page'){

            clear();
            router.replace({ name: "login-page" });
        }
    }


    const callFinishCallBack = (val) => {

        if (finishQueryCallBack.value) {

            finishQueryCallBack.value(val);
        }
    }

    const updateCache = () => {

        queryClient.invalidateQueries({
            queryKey: ['providers'],
            exact: false
        });


        queryClient.refetchQueries(
            ['providers'],
            {
                exact: false
            }
        );
    };


    const uploadProvider = async (providerData, callBack) => {

        finishQueryCallBack.value = callBack;


        const provider = {
            company_name: providerData.company_name,
            cuit: providerData.cuit,
            cbu: providerData.cbu,
           /*  iibb: providerData.iibb, */
            email: providerData.email,
            phone: providerData.phone,
            address: providerData.address,
            status: "ENABLED",
        };


        uploadProviderMutation.mutate(provider);

    }

    const updateProvider = async (providerData, callBack) => {

        finishQueryCallBack.value = callBack;

        const provider = {
            company_id: providerData.company_id,
            company_name: providerData.company_name,
            cuit: providerData.cuit,
            cbu: providerData.cbu,
            iibb: providerData.iibb,
            email: providerData.email,
            phone: providerData.phone,
            address: providerData.address,
            status: providerData.status,
        };

        updateProviderMutation.mutate(provider);


    }

    const deleteProvider = async (providerId, callBack) => {


        finishQueryCallBack.value = callBack;


        deleteProviderMutation.mutate(providerId);
    }


    /// WATCHERS ///
    watch(providersQuery.data, () => {

        if (providersQuery.data.value) {

            if (providersQuery.data.value.ok) {

                //console.log('Setting providers from query',providersQuery.data.value.data)

                store.setProviders(providersQuery.data.value.data);

            } else {

                console.log('useProviders error ' + providersQuery.data.value.error);
                showMessage(providersQuery.data.value.error, 'error');

                if (providersQuery.data.value.status == '401') {

                    onUnauthorizeRedirect()
                }
            }



        }
    },{ immediate:true});


    watch(providersQuery.isInitialLoading, () => {     
        
        

        if (providersQuery.isInitialLoading.value) {

            showLoading(true, 'Cargando proveedores...');   
            
            
        }else{

            showLoading(false);
        }
    });


    return {

        //Properties
        providersQuery,

        //Getters
        providers,

        //Methods        
        uploadProvider,
        updateProvider,
        deleteProvider
    }
};