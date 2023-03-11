import { storeToRefs } from "pinia";
import { computed, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";


import { getStorageTypes  } from '@/modules/projects/services/storageService';
import { useQuery } from '@tanstack/vue-query';
import { useStorageStore } from "@/modules/projects/store/storages";
import { useUI } from '@/modules/shared/composables';
import { useAuth } from '@/modules/auth/composables/useAuth';

export const useStorages = () =>{


     /// PROPERTIES ///
     const router = useRouter();
     const route = useRoute();

     const store = useStorageStore();
     

  
     const { showMessage} = useUI(); 
     const { clear } = useAuth();
     const { storageTypes: storeStorageTypes} = storeToRefs(store);



      /// GETTERS ///

    const storageTypes = computed(() => storeStorageTypes.value);
    const expenseReportStorageTypes = computed(() => storeStorageTypes.value.filter( st => st.type_name.toLowerCase() == 'factura' || st.type_name.toLowerCase() == 'comprobante'));


    /// QUERYS ///

    const storageTypesQuery = useQuery(
        ['storage-types'],
        getStorageTypes,

    );

    //METHODS
    const onUnauthorizeRedirect = () => {

        if (route.name != 'login-page') {
            clear();
            router.replace({ name: "login-page" });
        }
    }


    /// WATCHERS ///
    watch(storageTypesQuery.data, () => {

        if (storageTypesQuery.data.value) {

            if (storageTypesQuery.data.value.ok) {

                //console.log('Setting storages from query')

                store.setStorageTypes(storageTypesQuery.data.value.data);

            } else {

                console.log('useStorages error ' + storageTypesQuery.data.value.error);

                showMessage(storageTypesQuery.data.value.error, 'error');

                if (storageTypesQuery.data.value.status == '401') {

                    onUnauthorizeRedirect();
                }
            }



        }
    },{ immediate:true});



   

    return {

        //Properties
        storageTypesQuery,

        ///Getters
        storageTypes,
        expenseReportStorageTypes
    }
       
}