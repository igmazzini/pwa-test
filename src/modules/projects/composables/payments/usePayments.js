import { storeToRefs } from "pinia";
import { computed, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";


import { getPaymentTypes  } from '@/modules/projects/services/paymentService';
import { useQuery } from '@tanstack/vue-query';
import { usePaymentStore } from "@/modules/projects/store/payments";
import { useUI } from '@/modules/shared/composables';
import { useAuth } from '@/modules/auth/composables/useAuth';

export const usePayments = () =>{


     /// PROPERTIES ///

     const router = useRouter();
     const route = useRoute();
     const store = usePaymentStore();

     const { clear } = useAuth();
     const { showMessage} = useUI(); 
     const { paymentTypes: storePaymentTypes} = storeToRefs(store);



      /// GETTERS ///

    const paymentTypes = computed(() => storePaymentTypes.value);
    


    /// QUERYS ///

    const paymentTypesQuery = useQuery(
        ['payment-types'],
        getPaymentTypes,

    );


    //METHODS
    const onUnauthorizeRedirect = () => {

        if (route.name != 'login-page') {
            clear();
            router.replace({ name: "login-page" });
        }
    }


    /// WATCHERS ///
    watch(paymentTypesQuery.data, () => {

        if (paymentTypesQuery.data.value) {

            if (paymentTypesQuery.data.value.ok) {

                //console.log('Setting storages from query')

                store.setPaymentTypes(paymentTypesQuery.data.value.data);

            } else {

                console.log('usePayment error ' + paymentTypesQuery.data.value.error);
                showMessage(paymentTypesQuery.data.value.error, 'error');

                if (paymentTypesQuery.data.value.status == '401') {

                    onUnauthorizeRedirect();
                }

            }



        }
    },{ immediate:true});



   

    return {

        //Properties
        paymentTypesQuery,

        ///Getters
        paymentTypes,
      
    }
       
}