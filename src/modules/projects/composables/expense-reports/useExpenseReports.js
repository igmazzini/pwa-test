import { storeToRefs } from "pinia";
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";

import { getByProjectAndUser, getDetailByDates,  upload, update   } from '@/modules/projects/services/expenseReportsService';
import { useQuery, useQueryClient, useMutation } from '@tanstack/vue-query';
import { useExpenseReportsStore } from "@/modules/projects/store/expenseReports";
import { useMoneyOrderedStore } from "@/modules/projects/store/moneyOrdered";
import { useProfilesStore } from "@/modules/profiles/store/profiles";
import { useProvidersStore } from "@/modules/products/store/providers";
import { useProject } from '@/modules/projects/composables/projects/useProject';
import { useUI } from '@/modules/shared/composables';
import { useProfiles } from '@/modules/profiles/composables/useProfiles';
import { useAuth } from '@/modules/auth/composables/useAuth';


export const useExpenseReports = ( projectId = '') => {

    /// PROPERTIES ///

    const router = useRouter();
    const route = useRoute();   

    const { clear } = useAuth();

    const store = useExpenseReportsStore();
    const profilesStore = useProfilesStore();
    const moneyOrderedStore = useMoneyOrderedStore();
    const providersStore = useProvidersStore();

    const queryClient = useQueryClient();
    const { showMessage, showLoading, substring, sortByDate } = useUI();
    const { userProfile } = useProfiles(); 
    const { currentProject } = useProject();

    const { expenseReports: storeExpenseReports, currentExpenseReport:storeCurrentExpenseReport, expenseReportsDetailByDates:storeExpenseReportsDetailByDates, searchResults:storeSearchResults } = storeToRefs(store);
    const enabledExpenseReportsQuery = ref(false);
    const enabledExpenseReportsDetailQuery = ref(false);
    const cacheQueryKey = ref('-');
    const finishQueryCallBack = ref(null);
    const detailsParams = ref('');


    if (projectId != '') {
       
        cacheQueryKey.value = substring(projectId,10);
       
        enabledExpenseReportsQuery.value = true;
        enabledExpenseReportsDetailQuery.value = true;
       

    }


    /// GETTERS ///

    const expenseReports = computed(() => sortByDate(storeExpenseReports.value,'date_created', false));
    const currentExpenseReport = computed(() => storeCurrentExpenseReport.value);
    const expenseReportsDetailByDates = computed(() => storeExpenseReportsDetailByDates.value);
    const expenseReportsResults = computed(() => storeSearchResults.value);


    /// MUTATIONS ///

    const uploadExpenseReportMutation = useMutation(
        upload,
        {
            onMutate:() => {  
                      
                showLoading(true, 'Cargando rendición...');
            },

            onSettled:() => {
               
                showLoading(false);
            },
            onSuccess: (data) => {
               

                if (data) {

                    if (data.ok) {

                        store.setExpenseReports(data.data.expense_reports);

                        moneyOrderedStore.setMoneyOrdered(data.data.money_ordered)

                        profilesStore.setCurrentProfile(data.data.user_profile);

                        profilesStore.setProfiles(data.data.profiles);                        

                        providersStore.setProviders(data.data.companies);

                        updateCache();   
                        
                        showMessage('Rendición cargada', 'success');

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

    const updateExpenseReportMutation = useMutation(
        update,
        {
            onMutate:() => {  
                      
                showLoading(true, 'Actualizando rendición...');
            },
            onSuccess: (data) => {
                

                if (data) {

                    if (data.ok) {

                        store.setExpenseReports(data.data);

                        updateCache();                    

                        showMessage('Rendición actualizada', 'success');

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

    const expenseReportQuery = useQuery(
        (cacheQueryKey.value != '-') ? ['expense-reports', { cacheQueryKey }] : ['expense-reports', '-'],
        () => getByProjectAndUser(currentProject.value?.project_id,userProfile.value?.user),
        {
            enabled: enabledExpenseReportsQuery,            
        }
    );

    const expenseReportDetailByDatesQuery = useQuery(
        (cacheQueryKey.value != '-') ? ['expense-detail-by-dates', { cacheQueryKey }] : ['expense-detail-by-dates', '-'],       
        () => getDetailByDates(detailsParams.value),
        {
            enabled: enabledExpenseReportsDetailQuery
        }

    );

   

    /// METHODS ///

    const setCurrentExpenseReport = ( val ) =>{
        store.setCurrentExpenseReport( val );
    }

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
            queryKey: ['expense-reports'],
            exact: false
        });
        queryClient.invalidateQueries({
            queryKey: ['providers'],
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
            ['expense-reports'],
            {
                exact: false
            }
        );  
      
    };

    const uploadExpenseReport = ( expenseReport , callBack ) =>{

        finishQueryCallBack.value = callBack;

        expenseReport.project_id = currentProject.value.project_id;

        expenseReport.user_id = userProfile.value.user;        

        uploadExpenseReportMutation.mutate( expenseReport );
    };

    const updateExpenseReport  = ( expenseReport, callBack ) =>{
        
        finishQueryCallBack.value = callBack;

        updateExpenseReportMutation.mutate( expenseReport );
    };

    const getExpenseReportsDetailByDates = ( dates, callBack) =>{

        finishQueryCallBack.value = callBack;

        detailsParams.value = dates;

        detailsParams.value.project_id = currentProject.value.project_id;       

        enabledExpenseReportsDetailQuery.value = true;
    }

    const searchExpenseReports = ( query ) =>{        

        if(query.length ==  0 ) {
            clearSearchResults();
            return;
        }

        let results = [];

        let byCode = storeExpenseReports.value.filter( r  =>{
            const {   product  } = r;           
            const {  product_code } = product;

            if((String(product_code).toLowerCase().includes(String(query).toLowerCase()))){
                return r;
            }
        });

        let byProductNameStart = storeExpenseReports.value.filter( r  =>{
            const {  product  } = r;           
            const {  product_name } = product;            
            if((String(product_name).toLowerCase().substring(0,3).includes(String(query).toLowerCase()))){
                return r;
            }
        });

        let byProductName = storeExpenseReports.value.filter( r  =>{
            const {  product  } = r;           
            const {  product_name } = product;            
            if((String(product_name).toLowerCase().includes(String(query).toLowerCase()))){
                return r;
            }
        });


        let byCategoryNameStart = storeExpenseReports.value.filter( r  =>{
            const {  product  } = r;     
            const { category } = product;      
            const {  category_name } = category;            
            if((String(category_name).toLowerCase().substring(0,3).includes(String(query).toLowerCase()))){
                return r;
            }
        });

        let byCategoryName = storeExpenseReports.value.filter( r  =>{
            const {  product  } = r;     
            const { category } = product;      
            const {  category_name } = category;             
            if((String(category_name).toLowerCase().includes(String(query).toLowerCase()))){
                return r;
            }
        });
   

        results = results.concat(byCode);
        results = [...new Set([...results,...byCode])];  

        results = results.concat(byProductNameStart);
        results = [...new Set([...results,...byProductNameStart])];

        results = results.concat(byProductName);
        results = [...new Set([...results,...byProductName])];

        results = results.concat(byCategoryNameStart);
        results = [...new Set([...results,...byCategoryNameStart])];

        results = results.concat(byCategoryName);
        results = [...new Set([...results,...byCategoryName])];
       
       
        store.setSearchResults(results);
        
    }

    const clearSearchResults = () =>{
        store.setSearchResults([]);
    }


     /// WATCHES ///

     watch(currentProject, () => {
        
        if (currentProject.value) {
            cacheQueryKey.value = substring(currentProject.value.project_id,10);
            enabledExpenseReportsQuery.value = true;            

        }
    });

   watch(expenseReportQuery.data, () => {

     

        if (expenseReportQuery.data.value) {

            if (expenseReportQuery.data.value.ok) {

                //console.log('Setting expense reports from query')               

                store.setExpenseReports(expenseReportQuery.data.value.data);  
                
                queryClient.removeQueries({
                    queryKey: ['expense-reports','-'],
                    exact: true
                });

            } else {

                console.log('useExpenseReports error ' + expenseReportQuery.data.value.error);
                showMessage(expenseReportQuery.data.value.error, 'error');

                if (expenseReportQuery.data.value.status == '401') {

                    onUnauthorizeRedirect()
                }
            }

            

        }

        enabledExpenseReportsQuery.value = false;
    },{ immediate:true});

    watch(expenseReportDetailByDatesQuery.data, () => {

       

        if (expenseReportDetailByDatesQuery.data.value) {
            

            const { ok, data } = expenseReportDetailByDatesQuery.data.value;          

            if (ok) {
             
                store.setExpenseReportsDetailByDates(data.data);    
                
                queryClient.removeQueries({
                    queryKey: ['expense-detail-by-dates','-'],
                    exact: true
                });
                
                callFinishCallBack( true );

            } else {

                console.log('useExpenseReports error ' + expenseReportDetailByDatesQuery.data.value.error);

                showMessage(expenseReportDetailByDatesQuery.data.value.error, 'error');

                callFinishCallBack( false );

                if (expenseReportDetailByDatesQuery.data.value.status == '401') {

                    onUnauthorizeRedirect()
                }
            }

           

        }

        enabledExpenseReportsDetailQuery.value = false;
    },{ immediate:true});
  


    return {
        //Properties
        expenseReportQuery,
        expenseReportDetailByDatesQuery,

        //Getters
        expenseReports,
        currentExpenseReport,
        expenseReportsDetailByDates,
        expenseReportsResults,

        //Methods
        uploadExpenseReport,
        updateExpenseReport,      
        getExpenseReportsDetailByDates, 
        searchExpenseReports,
        clearSearchResults,
        setCurrentExpenseReport
       
    }
};

