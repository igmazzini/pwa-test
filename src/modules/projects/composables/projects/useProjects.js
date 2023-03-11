
import { watch, computed, ref } from 'vue';
import { useRoute, useRouter } from "vue-router";

import { storeToRefs } from "pinia";
import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query';
import { getProjects, getProjectsSerie, addProject as uploadProject } from '@/modules/projects/services/projectsService';
import { useProjectsStore } from '@/modules/projects/store/projects';
import { useUI } from '@/modules/shared/composables';
import { useAuth } from '@/modules/auth/composables/useAuth';


export const useProjects = () => {

    /// PROPERTIES ///

    const router = useRouter();
    const route = useRoute();

    const { clear } = useAuth();

    const store = useProjectsStore();
    const queryClient = useQueryClient();
    const { showMessage, showLoading, sortByDate } = useUI();

    const finishQueryCallBack =  ref(null);
    const { serie, projects: storeProjects } = storeToRefs(store);


     /// GETTERS ///

    const projects = computed(() => sortByDate([...storeProjects.value],'date_final')); 

    const currentSerie = computed(() => {


        return (serie.value && serie.value[0]) ? serie.value[0].current_value + 1 : 1;


    });

    /// QUERYS ///
    const projectsQuery = useQuery(
        ['projects'],
        getProjects

    );

    const projectsSerieQuery = useQuery(
        ['projects', 'serie'],
        getProjectsSerie

    );


    /// MUTATIONS ///

    const projectMutation = useMutation(
        uploadProject,
        {
            onMutate:() => {               
                showLoading(true, 'Cargando proyecto...');
            },
            onSettled:() =>{
                showLoading(false);
            },
            onSuccess: (data) => {               

                if (data) {

                    if (data.ok) {

                        store.setProjects(data.data);

                        updateCache();

                        showMessage('Proyecto creado', 'success');


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

    
    /// METHODS ///
    const onUnauthorizeRedirect =  () =>{      

        if(route.name != 'login-page'){
            clear();
            router.replace({ name: "login-page" });
        }
    };


    const callFinishCallBack = ( val ) =>{

        if(finishQueryCallBack.value){

            finishQueryCallBack.value( val );
        }
    };

    const updateCache = () => {

        queryClient.invalidateQueries({
            queryKey: ['projects'],
            exact: false
        });
        queryClient.invalidateQueries({
            queryKey: ['projects', 'serie'],
            exact: false
        });

        queryClient.refetchQueries(
            ['projects'],
            {
                exact: false
            }
        );
        queryClient.refetchQueries(
            ['projects', 'serie'],
            {
                exact: false
            }
        );
    };

    const createProject = (projectParams, callBack) => {

        finishQueryCallBack.value = callBack;

        projectMutation.mutate(projectParams);
    };


    /// WATCHES ///
    watch(projectsQuery.data, () => {

        if (projectsQuery.data.value) {

            if (projectsQuery.data.value.ok) {

                store.setProjects(projectsQuery.data.value.data);

            } else {

                console.log('Error ' + projectsQuery.data.value.error);
                showMessage(projectsQuery.data.value.error, 'error');

                if (projectsQuery.data.value.status == '401') {

                    onUnauthorizeRedirect();
                }
            }

        }

    },{ immediate:true})

    watch(projectsSerieQuery.data, () => {

        if (projectsSerieQuery.data.value) {

            if (projectsSerieQuery.data.value.ok) {

                store.setSerie(projectsSerieQuery.data.value.data);


            } else {

                console.log('Error ' + projectsSerieQuery.data.value.error);
                showMessage(projectsSerieQuery.data.value.error, 'error');
            }

        }

    },{ immediate:true})



    return {

        //Properties
        currentSerie,
        projectsQuery,
        projectsSerieQuery,


        //Getters
        projects,


        //Methods
        createProject,


    }
};

