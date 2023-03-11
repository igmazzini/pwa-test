import { storeToRefs } from "pinia";
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";

import { getByProject, upload, } from '@/modules/projects/services/moneyAssignedService';
import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query';
import { useMoneyAssignedStore } from "@/modules/projects/store/moneyAssigned";
import { useProfilesStore } from "@/modules/profiles/store/profiles";
import { useProject } from '@/modules/projects/composables/projects/useProject';
import { useUI } from '@/modules/shared/composables';
import { useAuth } from '@/modules/auth/composables/useAuth';




export const useMoneyAssigned = (projectId = '') => {


    /// PROPERTIES ///

    const router = useRouter();
    const route = useRoute();

    const { clear } = useAuth();

    const store = useMoneyAssignedStore();
    const profilesStore = useProfilesStore();

    const queryClient = useQueryClient();
    const { showMessage, showLoading, formatDate, substring } = useUI();
    const { currentProject } = useProject();

    const { moneyAssigned: storeMoneyAssigned, currentMoneyAssigned:storeCurrentMoneyAssigned, searchResults: storeSearchResults } = storeToRefs(store);
    const enabledMoneyAssignedQuery = ref(false);
    const cacheQueryKey = ref('-');
    const finishQueryCallBack = ref(null);

    if (projectId != '') {

        cacheQueryKey.value = substring(projectId, 10);
        enabledMoneyAssignedQuery.value = true;

    }

    /// GETTERS ///

    const moneyAssigned = computed(() => storeMoneyAssigned.value);
    const currentMoneyAssigned = computed(() => storeCurrentMoneyAssigned.value);
    const moneyAssignedResults = computed(() => storeSearchResults.value);


    /// MUTATIONS ///

    const uploadMoneyAssignedMutation = useMutation(
        upload,
        {
            onMutate: () => {

                showLoading(true, 'Cargando asignación...');
            },

            onSettled: () => {

                showLoading(false);
            },
            onSuccess: (data) => {


                if (data) {

                    if (data.ok) {

                        store.setMoneyAssigned(data.data.money_assigned);

                        profilesStore.setCurrentProfile(data.data.user_profile);

                        profilesStore.setProfiles(data.data.profiles);


                        updateCache();

                        showMessage('Asignación cargada', 'success');

                        callFinishCallBack(true);



                    } else {

                        console.log('Error ', data.error);

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


    /// QUERYS ///

    const moneyAssignedQuery = useQuery(
        (cacheQueryKey.value != '-') ? ['money-assigned', { cacheQueryKey }] : ['money-assigned', '-'],       
        () => getByProject(currentProject.value?.project_id),
        {
            enabled: enabledMoneyAssignedQuery
        }
    );



    /// METHODS ///

    const setCurrentMoneyAssigned = ( val ) =>{

        store.setCurrentMoneyAssigned(val);
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
            queryKey: ['money-assigned'],
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

      


        queryClient.refetchQueries(
            ['money-assigned'],
            {
                exact: false
            }
        );
       
    };

    const uploadMoneyAssigned = (moneyAssigned, callBack) => {

        finishQueryCallBack.value = callBack;

        moneyAssigned.project_id = currentProject.value.project_id;

        uploadMoneyAssignedMutation.mutate(moneyAssigned);
    };

    const searchMoneyAssigned = (query) => {

        if (query.length == 0) {
            clearSearchResults();
            return;
        }

        let results = [];

        let assignedName = storeMoneyAssigned.value.filter(r => {
            const { assigned_to_profile } = r;
            if ((String(assigned_to_profile.name).toLowerCase().includes(String(query).toLowerCase()))) {
                return r;
            }
        });
        let assignedByName = storeMoneyAssigned.value.filter(r => {
            const { assigned_by_profile } = r;
            if ((String(assigned_by_profile.name).toLowerCase().includes(String(query).toLowerCase()))) {
                return r;
            }
        });

        let byMotive = storeMoneyAssigned.value.filter(r => {
            const { extra_data } = r;
            if ((String(extra_data?.motive).toLowerCase().includes(String(query).toLowerCase()))) {
                return r;
            }
        });


        let byDate = storeMoneyAssigned.value.filter(r => {

            if ((String(formatDate(r.date_created)).toLowerCase().includes(String(query).toLowerCase()))) {
                return r;
            }
        });




        results = results.concat(assignedName);
        results = [...new Set([...results, ...assignedName])];

        results = results.concat(assignedByName);
        results = [...new Set([...results, ...assignedByName])];

        results = results.concat(byMotive);
        results = [...new Set([...results, ...byMotive])];

        results = results.concat(byDate);
        results = [...new Set([...results, ...byDate])];


        store.setSearchResults(results);

    }

    const clearSearchResults = () => {
        store.setSearchResults([]);
    }


    /// WATCHES ///

    watch(currentProject, () => {
        if (currentProject.value) {
            cacheQueryKey.value = substring(currentProject.value.project_id, 10);
            enabledMoneyAssignedQuery.value = true;

        }
    });

    watch(moneyAssignedQuery.data, () => {

        if (moneyAssignedQuery.data.value) {

            if (moneyAssignedQuery.data.value.ok) {

                //console.log('Setting assigned money from query')

                store.setMoneyAssigned(moneyAssignedQuery.data.value.data);

                queryClient.removeQueries({
                    queryKey: ['money-assigned','-'],
                    exact: true
                });

            } else {

                console.log('useMoneyAssigned error ' + moneyAssignedQuery.data.value.error);
                showMessage(moneyAssignedQuery.data.value.error, 'error');

                if (moneyAssignedQuery.data.value.status == '401') {

                    onUnauthorizeRedirect()
                }
            }

            enabledMoneyAssignedQuery.value = false;

        }
    }, { immediate: true });



    return {
        //Properties
        moneyAssignedQuery,

        //Getters
        moneyAssigned,
        currentMoneyAssigned,
        moneyAssignedResults,

        //Methods
        uploadMoneyAssigned,
        searchMoneyAssigned,
        clearSearchResults,
        setCurrentMoneyAssigned

    }


}