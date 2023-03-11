import { storeToRefs } from "pinia";
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";

import { getCategoriesGroup, upload, update, annulate } from '@/modules/products/services/categoriesGroupService';
import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query';
import { useCategoriesGroupStore } from "@/modules/products/store/categoriesGroup";
import { useUI } from '@/modules/shared/composables';
import { useAuth } from '@/modules/auth/composables/useAuth';

export const useCategoriesGroups = () => {

    /// PROPERTIES ///

    const router = useRouter();
    const route = useRoute();

    const { clear } = useAuth();

    const store = useCategoriesGroupStore();

    const queryClient = useQueryClient();
    const { showMessage, showLoading } = useUI();

    const { categoriesGroup: storeCategoriesGroup } = storeToRefs(store);
    const finishQueryCallBack = ref(null);


    /// GETTERS ///

    const groups = computed(() => storeCategoriesGroup.value);


    /// MUTATIONS ///

    const uploadCategoryGroupMutation = useMutation(
        upload,
        {
            onMutate: () => {

                showLoading(true, 'Cargando categoria...');
            },

            onSettled: () => {

                showLoading(false);
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setCategoriesGroup(data.data);

                        updateCache();

                        showMessage('Categoria cargada', 'success');

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

    const updateCategoryGroupMutation = useMutation(
        update,
        {
            onMutate: () => {

                showLoading(true, 'Actualizando categoria...');
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setCategoriesGroup(data.data);

                        updateCache();

                        showMessage('Categoria actualizada', 'success');

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

    const deleteCategoryGroupMutation = useMutation(
        annulate,
        {
            onMutate: () => {

                showLoading(true, 'Eliminando categoria...');
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setCategoriesGroup(data.data);

                        updateCache();

                        showMessage('Categoria eliminada', 'success');

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

    const categoriesGroupQuery = useQuery(
        ['categories-group'],
        getCategoriesGroup,
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
            queryKey: ['categories-group'],
            exact: false
        });


        queryClient.refetchQueries(
            ['categories-group'],
            {
                exact: false
            }
        );
    };



    const uploadCategoryGroup = async (groupData, callBack) => {

        finishQueryCallBack.value = callBack;

        uploadCategoryGroupMutation.mutate(groupData);

    }

    const updateCategoryGroup = async (groupData, callBack) => {


        finishQueryCallBack.value = callBack;

        updateCategoryGroupMutation.mutate(groupData);

    }

    const deleteCategoryGroup = async (groupId, callBack) => {


        finishQueryCallBack.value = callBack;

        deleteCategoryGroupMutation.mutate(groupId);
    }


    /// WATCHERS ///
    watch(categoriesGroupQuery.data, () => {

        if (categoriesGroupQuery.data.value) {

            if (categoriesGroupQuery.data.value.ok) {

                //console.log('Setting categories group from query')

                store.setCategoriesGroup(categoriesGroupQuery.data.value.data);

            } else {

                console.log('useCategoriesGroup error ' + categoriesGroupQuery.data.value.error);
                showMessage(categoriesGroupQuery.data.value.error, 'error');

                if (categoriesGroupQuery.data.value.status == '401') {

                    onUnauthorizeRedirect()
                }

                
            }



        }
    }, { immediate: true });

    watch(categoriesGroupQuery.isInitialLoading, () => {



        if (categoriesGroupQuery.isInitialLoading.value) {

            showLoading(true, 'Cargando categorias...');


        } else {

            showLoading(false);
        }
    });


    return {

        //Properties
        categoriesGroupQuery,

        //Getters
        groups,

        //Methods
        uploadCategoryGroup,
        updateCategoryGroup,
        deleteCategoryGroup
    }
};