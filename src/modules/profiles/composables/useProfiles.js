import { storeToRefs } from "pinia";
import { computed, ref, watch } from 'vue';
import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query';
import { useRoute, useRouter } from "vue-router";

import { getProfiles, getUserProfile, update } from '@/modules/profiles/services/profilesService'
import { useProfilesStore } from "@/modules/profiles/store/profiles";
import { useProject } from "@/modules/projects/composables/projects/useProject";
import { useUI } from '@/modules/shared/composables';
import { useAuth } from '@/modules/auth/composables/useAuth';

export const useProfiles = () => {

    /// PROPERTIES ///   

    const router = useRouter();
    const route = useRoute();

    const { clear } = useAuth();

    const store = useProfilesStore();    
    const queryClient = useQueryClient();
    const { currentProject } = useProject();
    const { showMessage, showLoading } = useUI();

    const { profiles: storeProfiles, roles: storeRoles, currentProfile: storeCurrentProfile } = storeToRefs(store);
    const finishQueryCallBack = ref(null);
   


   

   
   

    /// GETTERS ///

    const userProfile = computed(() => storeCurrentProfile.value);
    const profiles = computed(() => storeProfiles.value);
    const roles = computed(() => storeRoles.value);


    const currentUserBalance = computed(() =>{


        if(!currentProject.value || !storeCurrentProfile.value.balances || storeCurrentProfile.value.balances.length == 0 ) return 0;    
        
        const userBalance = storeCurrentProfile.value.balances.find( balance => balance.project_id == currentProject.value.project_id);

        return (userBalance) ? userBalance : 0
    });


    const profilesWithBalance = computed( () => {
        return storeProfiles.value.filter( (p) =>{

            const balance = p.balances.find( b => b.project_id == currentProject.value.project_id);

            if(balance){
                return true;
            }
        })
    });


    const profilesCashFlowByProject = computed( () =>{

        let balances = []
        let totalMoneyAssigned = 0;
        let totalExpenseReports = 0;
        let totalToExpenseReports = 0;


        storeProfiles.value.forEach( (p) =>{

            const balance = p.balances.find( b => b.project_id == currentProject.value.project_id);

            if(balance && balance.balance > 0){
                balances.push(balance);
            }
        });     


        balances.forEach( b =>{            
            totalMoneyAssigned += b.amount_in;
            totalToExpenseReports += b.balance; 
            totalExpenseReports += b.amount_out; 
           
        });


        return {totalMoneyAssigned,totalExpenseReports, totalToExpenseReports};

    });


    /// MUTATIONS ///
    const updateProfileMutation = useMutation(
        update,
        {
            onMutate:() => {  
                      
                showLoading(true, 'Actualizando perfil...');
            },
            onSuccess: (data) => {
                

                if (data) {

                    if (data.ok) {

                        store.setCurrentProfile(data.data);

                        updateCache();                    

                        showMessage('Perfil actualizado', 'success');

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

            onSettled:()=>{
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

    const profilesQuery = useQuery(
        ['profiles'],
        getProfiles,          
        {
            staleTime: 1000 * 60,//un minuto,           
        }     

    );

    const userProfileQuery = useQuery(
        ['user-profile'],
        getUserProfile,  
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

    const callFinishCallBack = ( val ) =>{

        if(finishQueryCallBack.value){

            finishQueryCallBack.value( val );
        }
    }

    const updateCache = () => {

        queryClient.invalidateQueries({
            queryKey: ['profiles'],
            exact: false
        });
      

        queryClient.refetchQueries(
            ['user-profile'],
            {
                exact: false
            }
        );  
    };

    const getProfileBalance = ( profileId ) => {      

        if (storeProfiles.value.length == 0) return null;

        const balances = storeProfiles.value.find(p => p.profile_id == profileId).balances;

       
        if (balances.length == 0) return null;

        return balances.find(b => b.project_id == currentProject.value.project_id);
    }

    const updateProfile = ( profile, callBack ) =>{

        finishQueryCallBack.value = callBack;

        updateProfileMutation.mutate( profile );
    }
    

    /// WATCHES ///     

    watch(profilesQuery.data, () => {
       

        if (profilesQuery.data.value) {

            if (profilesQuery.data.value.ok) {               

                store.setProfiles(profilesQuery.data.value.data);

            } else {               

                showMessage(profilesQuery.data.value.error, 'error');

                if(profilesQuery.data.value.status == '401'){
                           
                    onUnauthorizeRedirect();
                }
            }

            

        }
    },{ immediate:true});


    watch(userProfileQuery.data, () => {      

        if (userProfileQuery.data.value) {

            if (userProfileQuery.data.value.ok) {                

                store.setCurrentProfile(userProfileQuery.data.value.data);

            } else {

                console.log('useProfiles error ' + userProfileQuery.data.value.error);

                showMessage(userProfileQuery.data.value.error, 'error');

                if(userProfileQuery.data.value.status == '401'){
                           
                    onUnauthorizeRedirect()
                }
            }

           

        }
    },{ immediate:true});

    watch(profilesQuery.isInitialLoading, () => {     
        
        

        if (profilesQuery.isInitialLoading.value) {

            showLoading(true, 'Cargando perfiles...');   
            
            
        }else{

            showLoading(false);
        }
    });

   watch(userProfileQuery.isInitialLoading, () => {     
        
        

        if (userProfileQuery.isInitialLoading.value) {

            showLoading(true, 'Cargando perfil de usuario...');   
            
            
        }else{

            showLoading(false);
        }
    });
  

    return {

        //Properties
        profilesQuery,
        userProfileQuery,

        //Getters
        userProfile,
        profiles,
        roles,
        currentUserBalance,
        profilesWithBalance,
        profilesCashFlowByProject,


        //Actions
        getProfileBalance,
        updateProfile,
       
    }
};

