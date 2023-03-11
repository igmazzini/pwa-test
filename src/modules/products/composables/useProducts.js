


import { storeToRefs } from "pinia";
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";

import { getProducts, upload, update, annulate } from '@/modules/products/services/productsService';
import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query';
import { useProductsStore } from "@/modules/products/store/products";
import { useUI } from '@/modules/shared/composables';
import { useAuth } from '@/modules/auth/composables/useAuth';


export const useProducts = () => {

    /// PROPERTIES ///

    const router = useRouter();
    const route = useRoute();

    const { clear } = useAuth();

    const store = useProductsStore();

    const queryClient = useQueryClient();
    const { showMessage, showLoading } = useUI();

    const { products: storeProducts } = storeToRefs(store);
    const finishQueryCallBack = ref(null);


    /// GETTERS ///

    const products = computed(() => storeProducts.value);


    /// MUTATIONS ///

    const uploadProductMutation = useMutation(
        upload,
        {
            onMutate: () => {

                showLoading(true, 'Cargando item...');
            },

            onSettled: () => {

                showLoading(false);
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setProducts(data.data);

                        updateCache();

                        showMessage('Item cargado', 'success');

                        callFinishCallBack(true);



                    } else {

                        console.log('Error ' + data.error);

                        showMessage(data.error, 'error');

                        callFinishCallBack(false);

                        if (data.status == '401') {

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

    const updateProductMutation = useMutation(
        update,
        {
            onMutate: () => {

                showLoading(true, 'Actualizando item...');
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setProducts(data.data);

                        updateCache();

                        showMessage('Item actualizado', 'success');

                        callFinishCallBack(true);

                    } else {

                        console.log('Error ' + data.error);

                        showMessage(data.error, 'error');

                        callFinishCallBack(false);

                        if (data.status == '401') {

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

    const deleteProductMutation = useMutation(
        annulate,
        {
            onMutate: () => {

                showLoading(true, 'Eliminando item...');
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setProducts(data.data);

                        updateCache();

                        showMessage('Item eliminado', 'success');

                        callFinishCallBack(true);

                    } else {

                        console.log('Error ' + data.error);

                        showMessage(data.error, 'error');

                        callFinishCallBack(false);

                        if (data.status == '401') {

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

    const productsQuery = useQuery(
        ['products'],
        getProducts,
        {
            staleTime: 1000 * 60 * 60,//una hora
        }

    );


    /// METHODS  ///

    const onUnauthorizeRedirect = () => {

        if (route.name != 'login-page') {
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
            queryKey: ['products'],
            exact: false
        });


        queryClient.refetchQueries(
            ['products'],
            {
                exact: false
            }
        );
    };

    const getProductsByCode = (code) => {

        return storeProducts.value.filter(product => String(product.product_code).includes(code))

    }

    const getProductsByCategory = (categoryId) => {

        return storeProducts.value.filter(product => product.category?.category_id == categoryId)

    }

    const uploadProduct = async (productData, callBack) => {

        finishQueryCallBack.value = callBack;

        uploadProductMutation.mutate(productData);


    }

    const updateProduct = async (productData, callBack) => {

        finishQueryCallBack.value = callBack;

        updateProductMutation.mutate(productData);

    }

    const deleteProduct = async (productId, callBack) => {

        finishQueryCallBack.value = callBack;

        deleteProductMutation.mutate(productId);
    }


    /// WATCHERS ///
    watch(productsQuery.data, () => {

        if (productsQuery.data.value) {

            if (productsQuery.data.value.ok) {

                //console.log('Setting products from query')

                store.setProducts(productsQuery.data.value.data);

            } else {

                console.log('useProducts error ' + productsQuery.data.value.error);
                showMessage(productsQuery.data.value.error, 'error');

                if (productsQuery.data.value.status == '401') {

                    onUnauthorizeRedirect()
                }
            }



        }
    }, { immediate: true });

    watch(productsQuery.isInitialLoading, () => {



        if (productsQuery.isInitialLoading.value) {

            showLoading(true, 'Cargando productos...');


        } else {

            showLoading(false);
        }
    });


    return {

        //Properties
        productsQuery,

        //Getters
        products,

        //Methos   

        getProductsByCode,
        getProductsByCategory,
        uploadProduct,
        updateProduct,
        deleteProduct

    }

};