import { storeToRefs } from "pinia";
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";

import { getCategories, upload, update, annulate } from '@/modules/products/services/categoriesService';
import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query';
import { useCategoriesStore } from "@/modules/products/store/categories";
import { useUI } from '@/modules/shared/composables';
import { useAuth } from '@/modules/auth/composables/useAuth';


export const useCategories = () => {


    /// PROPERTIES ///

    const router = useRouter();
    const route = useRoute();

    const { clear } = useAuth();

    const store = useCategoriesStore();

    const queryClient = useQueryClient();
    const { showMessage, showLoading } = useUI();

    const { categories: storeCategories } = storeToRefs(store);
    const finishQueryCallBack = ref(null);


    /// GETTERS ///

    const categories = computed(() => storeCategories.value);


    /// MUTATIONS ///

    const uploadCategoryMutation = useMutation(
        upload,
        {
            onMutate: () => {

                showLoading(true, 'Cargando rubro...');
            },

            onSettled: () => {

                showLoading(false);
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setCategories(data.data);

                        updateCache();

                        showMessage('Rubro cargado', 'success');

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

    const updateCategoryMutation = useMutation(
        update,
        {
            onMutate: () => {

                showLoading(true, 'Actualizando rubro...');
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setCategories(data.data);

                        updateCache();

                        showMessage('Rubro actualizado', 'success');

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

    const deleteCategoryMutation = useMutation(
        annulate,
        {
            onMutate: () => {

                showLoading(true, 'Eliminando rubro...');
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setCategories(data.data);

                        updateCache();

                        showMessage('Rubro eliminado', 'success');

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

    const categoriesQuery = useQuery(
        ['categories'],
        getCategories,
        {
            staleTime: 1000 * 60 * 60,//una hora
        }

    );







    /// METHODS ///  

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
            queryKey: ['categories'],
            exact: false
        });


        queryClient.refetchQueries(
            ['categories'],
            {
                exact: false
            }
        );
    };

    const uploadCategory = async (categoryData, callBack) => {

        finishQueryCallBack.value = callBack;

        uploadCategoryMutation.mutate(categoryData);

    }

    const updateCategory = async (categoryData, callBack) => {

        finishQueryCallBack.value = callBack;


        updateCategoryMutation.mutate(categoryData);
    }

    const deleteCategory = async (categoryId, callBack) => {

        finishQueryCallBack.value = callBack;

        deleteCategoryMutation.mutate(categoryId);


    }


    /// WATCHERS ///
    watch(categoriesQuery.data, () => {

        if (categoriesQuery.data.value) {

            if (categoriesQuery.data.value.ok) {

                ///console.log('Setting categories from query')

                store.setCategories(categoriesQuery.data.value.data);

            } else {

                console.log('useCategories error ' + categoriesQuery.data.value.error);
                showMessage(categoriesQuery.data.value.error, 'error');

                if (categoriesQuery.data.value.status == '401') {

                    onUnauthorizeRedirect()
                }
            }



        }
    }, { immediate: true });


    watch(categoriesQuery.isInitialLoading, () => {



        if (categoriesQuery.isInitialLoading.value) {

            showLoading(true, 'Cargando rubros...');


        } else {

            showLoading(false);
        }
    });

    return {

        //Properties
        categoriesQuery,


        //Getters
        categories,



        //Methods
        uploadCategory,
        updateCategory,
        deleteCategory

    }
}