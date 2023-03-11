import { computed, watch  } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { getMovementHistory } from '@/modules/home/services/homeService';
import { useHomeStore } from "@/modules/home/store/home";
import { useQuery } from "@tanstack/vue-query";
import { useAppStore } from "@/store/appStore";
import { useAuth } from '@/modules/auth/composables/useAuth';


export const useHome = () => {

    /// PROPERTIES ///

    const router = useRouter();
    const route = useRoute();
    const { clear } = useAuth();
    const store = useHomeStore();
    const appStore = useAppStore();
    const { movementHistory:storeMovementHistory } = storeToRefs( store );


    /// GETTERS ///
    const movementHistory = computed(() => storeMovementHistory.value );

    /// QUERYS ///
    const movementHistoryQuery = useQuery(
        ['movement-history'],
        getMovementHistory,
        {
            cacheTime:0
        }
       
    );


    // METHODS //

    const getMovementType = ( type ) =>{

        switch (type.toLowerCase()) {
            case 'moneyassigned':
                
                return 'Asignación de efect.';
            case 'moneyordered':
                
                return 'Solicitud de efect.';
            case 'orders':
                
                return 'Orden de compra';
            case 'expensereports':
                
                return 'Rendición de efect.';
               
        
            default:
                return 'No definido';
               
        }
    }

    const onUnauthorizeRedirect = () => {

        if (route.name != 'login-page') {
            clear();
            router.replace({ name: "login-page" });
        }
    }

    /// WATCHES ///   
    watch(movementHistoryQuery.data, () => {
        if (movementHistoryQuery.data.value) {

            if (movementHistoryQuery.data.value.ok) {

                store.setMovementHistory(movementHistoryQuery.data.value.data);        

            } else {

                appStore.setMessage(true, movementHistoryQuery.data.value.error, 'error');

                if (movementHistoryQuery.data.value.status == '401') {

                    onUnauthorizeRedirect()
                }

                
            }     
        

        }
    });





    return{
        
        //Properties
        movementHistoryQuery,


        //Getters
        movementHistory,

        //Methods
        getMovementType

    }

}