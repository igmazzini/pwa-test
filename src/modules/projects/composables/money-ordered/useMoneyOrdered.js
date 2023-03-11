import { storeToRefs } from "pinia";
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";

import { getByProject, upload, update, pay, approve, annulate } from '@/modules/projects/services/moneyOrderedService';
import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query';
import { useMoneyOrderedStore } from "@/modules/projects/store/moneyOrdered";
import { useProjectsStore } from '@/modules/projects/store/projects';
import { useProfilesStore } from "@/modules/profiles/store/profiles";
import { useProject } from '@/modules/projects/composables/projects/useProject';
import { useUI } from '@/modules/shared/composables';
import { useAuth } from '@/modules/auth/composables/useAuth';

export const useMoneyOrdered = (projectId = '') => {

    /// PROPERTIES ///

    const router = useRouter();
    const route = useRoute();

    const { clear } = useAuth();

    const store = useMoneyOrderedStore();
    const projectsStore = useProjectsStore();
    const profilesStore = useProfilesStore();

    const queryClient = useQueryClient();
    const { showMessage, showLoading, getStatus, formatDate, substring } = useUI();
    const { currentProject } = useProject();

    const { moneyOrdered: storeMoneyOrdered, currentMoneyOrdered:storeCurrentMoneyOrdered, searchResults: storeSearchResults } = storeToRefs(store);
    const enabledOrdereMoneyQuery = ref(false);
    const cacheQueryKey = ref('-');
    const finishQueryCallBack = ref(null);


    if (projectId != '') {

        cacheQueryKey.value = substring(projectId, 10);
        enabledOrdereMoneyQuery.value = true;

    }


    /// GETTERS ///

    const moneyOrdered = computed(() => storeMoneyOrdered.value);
    const currentMoneyOrdered = computed(() => storeCurrentMoneyOrdered.value);
    const inboxMoneyOrdered = computed(() => storeMoneyOrdered.value.filter( mo => mo.status.toLowerCase() == 'pending'));
    const moneyOrderedResults = computed(() => storeSearchResults.value);


    /// MUTATIONS ///

    const uploadMoneyOrderedMutation = useMutation(
        upload,
        {
            onMutate: () => {

                showLoading(true, 'Cargando solicitud...');
            },

            onSettled: () => {

                showLoading(false);
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setMoneyOrdered(data.data.money_ordered);

                        projectsStore.setCurrentProjectBudget(data.data.budget);

                        profilesStore.setCurrentProfile(data.data.user_profile);

                        profilesStore.setProfiles(data.data.profiles);
                       

                        updateCache();

                        showMessage('Solicitud cargada', 'success');

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

    const updateMoneyOrderedMutation = useMutation(
        update,
        {
            onMutate: () => {

                showLoading(true, 'Actualizando solicitud...');
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setMoneyOrdered(data.data);

                        updateCache();

                        showMessage('Solicitud actualizada', 'success');

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

    const approveMoneyOrderedMutation = useMutation(
        approve,
        {
            onMutate: () => {
                showLoading(true, 'Aprobando solicitud...');
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setMoneyOrdered(data.data);

                        updateCache();

                        showMessage('Solicitud aprobada', 'success');

                        callFinishCallBack(true);

                    } else {

                        console.log('Error ' + data.error);

                        showMessage(data.error, 'error');

                        callFinishCallBack(true);

                        if (data.status == '401') {

                            onUnauthorizeRedirect()
                        }
                    }

                }

            },
            onSettled: () => {
                console.log('onSettle');
                showLoading(false);
            },

            onError: (error) => {

                showMessage(error.toString(), 'error');

                callFinishCallBack(true);

                showLoading(false);
            },

        }
    );

    const payMoneyOrderedMutation = useMutation(
        pay,
        {
            onMutate: () => {
                showLoading(true, 'Pagando solicitud...');
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setMoneyOrdered(data.data.money_ordered);

                        projectsStore.setCurrentProjectBudget(data.data.budget);

                        profilesStore.setCurrentProfile(data.data.user_profile);

                        profilesStore.setProfiles(data.data.profiles);

                        updateCache();

                        showMessage('Solicitud pagada', 'success');

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

    const annulateMoneyOrderedMutation = useMutation(
        annulate,
        {
            onMutate: () => {
                showLoading(true, 'Anulando solicitud...');
            },
            onSuccess: (data) => {

                if (data) {

                    if (data.ok) {

                        store.setMoneyOrdered(data.data.money_ordered);

                        projectsStore.setCurrentProjectBudget(data.data.budget);

                        profilesStore.setCurrentProfile(data.data.user_profile);

                        profilesStore.setProfiles(data.data.profiles);

                        updateCache();

                        showMessage('Solicitud anulada', 'success');

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
            },

        }
    );


    /// QUERYS ///

    const moneyOrderedQuery = useQuery(
        (cacheQueryKey.value != '-') ? ['money-ordered', { cacheQueryKey }] : ['money-ordered', '-'],        
        () => getByProject(currentProject.value?.project_id),
        {
            enabled: enabledOrdereMoneyQuery
        }
    );



    /// METHODS ///

    const setCurrentMoneyOrdered = ( val ) =>{

        store.setCurrentMoneyOrdered(val);

    }

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
            queryKey: ['money-ordered'],
            exact: false
        });

        queryClient.invalidateQueries({
            queryKey: ['user-profile'],
            exact: false
        });

        queryClient.invalidateQueries({
            queryKey: ['profiles'],
            exact: false
        });

        queryClient.invalidateQueries({
            queryKey: ['project-budget'],
            exact: false
        });


        queryClient.refetchQueries(
            ['money-ordered'],
            {
                exact: false
            }
        );
       
    };

    const uploadMoneyOrdered = (moneyOrdered, callBack) => {

        finishQueryCallBack.value = callBack;

        moneyOrdered.project_id = currentProject.value.project_id;

        uploadMoneyOrderedMutation.mutate(moneyOrdered);
    };

    const updateMoneyOrdered = (moneyOrdered, callBack) => {

        finishQueryCallBack.value = callBack;

        updateMoneyOrderedMutation.mutate(moneyOrdered);
    };

    const approveMoneyOrdered = (id, callBack) => {

        finishQueryCallBack.value = callBack;

        approveMoneyOrderedMutation.mutate(id);
    };

    const payMoneyOrdered = (moneyOrderedId, callBack) => {

        finishQueryCallBack.value = callBack;

        payMoneyOrderedMutation.mutate(moneyOrderedId);
    };

    const annulateMoneyOrdered = (id, callBack) => {

        finishQueryCallBack.value = callBack;

        annulateMoneyOrderedMutation.mutate(id);

        callFinishCallBack();
    };

    const searchMoneyOrdered = (query) => {

        if (query.length == 0) {
            clearSearchResults();
            return;
        }

        let results = [];

        let byName = storeMoneyOrdered.value.filter(r => {
            const { profile } = r;
            if ((String(profile.name).toLowerCase().includes(String(query).toLowerCase()))) {
                return r;
            }
        });

        let byProductNameStart = storeMoneyOrdered.value.filter(r => {
            const { product } = r;
            if ((String(product.product_name).toLowerCase().substring(0, 3).includes(String(query).toLowerCase()))) {
                return r;
            }
        });

        let byProductName = storeMoneyOrdered.value.filter(r => {
            const { product } = r;
            if ((String(product.product_name).toLowerCase().includes(String(query).toLowerCase()))) {
                return r;
            }
        });


        let byDate = storeMoneyOrdered.value.filter(r => {

            if ((String(formatDate(r.date_created)).toLowerCase().includes(String(query).toLowerCase()))) {
                return r;
            }
        });

        let byState = storeMoneyOrdered.value.filter(r => {

            if ((String(getStatus(r.status)).toLowerCase().includes(String(query).toLowerCase()))) {
                return r;
            }
        });


        results = results.concat(byName);
        results = [...new Set([...results, ...byName])];

        results = results.concat(byProductNameStart);
        results = [...new Set([...results, ...byProductNameStart])];

        results = results.concat(byProductName);
        results = [...new Set([...results, ...byProductName])];

        results = results.concat(byDate);
        results = [...new Set([...results, ...byDate])];

        results = results.concat(byState);
        results = [...new Set([...results, ...byState])];

       
        store.setSearchResults(results);

    }

    const clearSearchResults = () => {
        store.setSearchResults([]);
    }


    /// WATCHES ///

    watch(currentProject, () => {
        if (currentProject.value) {
            cacheQueryKey.value = substring(currentProject.value.project_id, 10);
            enabledOrdereMoneyQuery.value = true;

        }
    });

    watch(moneyOrderedQuery.data, () => {

        if (moneyOrderedQuery.data.value) {

            if (moneyOrderedQuery.data.value.ok) {

                //console.log('Setting money ordered from query')

                store.setMoneyOrdered(moneyOrderedQuery.data.value.data);

                queryClient.removeQueries({
                    queryKey: ['money-ordered','-'],
                    exact: true
                });

            } else {

                console.log('useMoneyOrdered error ' + moneyOrderedQuery.data.value.error);
                showMessage(moneyOrderedQuery.data.value.error, 'error');

                if (moneyOrderedQuery.data.value.status == '401') {

                    onUnauthorizeRedirect();
                }
            }

            enabledOrdereMoneyQuery.value = false;

        }
    }, { immediate: true });




    return {
        //Properties
        moneyOrderedQuery,

        //Getters
        moneyOrdered,
        currentMoneyOrdered,
        moneyOrderedResults,
        inboxMoneyOrdered,

        //Methods
        uploadMoneyOrdered,
        updateMoneyOrdered,
        approveMoneyOrdered,
        payMoneyOrdered,
        annulateMoneyOrdered,
        searchMoneyOrdered,
        clearSearchResults,
        setCurrentMoneyOrdered
    }
};

