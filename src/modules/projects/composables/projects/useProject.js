import { computed, watch, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { getProjectBudget } from '@/modules/projects/services/projectsService';
import { useProjectsStore } from "@/modules/projects/store/projects";
import { useQuery } from "@tanstack/vue-query";
import { useAppStore } from "@/store/appStore";
import { useUI } from '@/modules/shared/composables';
import { useAuth } from '@/modules/auth/composables/useAuth';

export const useProject = () => {

  /// PROPERTIES ///

  const router = useRouter();
  const route = useRoute();
  const { clear } = useAuth();
  const { showMessage  } = useUI();

  const store = useProjectsStore();
  const appStore = useAppStore();
  const enableBudgetQuery = ref(false);

  const { currentProject:storeCurrentProject ,currentProjectBudget:storeCurrentProjectBudget} = storeToRefs( store );


  /// GETTERS ///

  const currentProject = computed(() => storeCurrentProject.value );
  const currentProjectBudget = computed(() => storeCurrentProjectBudget.value);
  const currentProjectBalance = computed(() => (!currentProject.value) ?  0 : currentProject.value.balance);
 



  /// QUERYS ///
  const budgetQuery = useQuery(
    ['project-budget'],
    () => getProjectBudget(currentProject.value?.project_id),
    {
      enabled: enableBudgetQuery
    }
  );



  /// METHODS ///
  const setCurrentProject = (project) => {

    store.setCurrentProject(project);

    enableBudgetQuery.value = true;

  }

  const onUnauthorizeRedirect = () => {

    if (route.name != 'login-page') {
        clear();
        router.replace({ name: "login-page" });
    }
}

  const getProjectStatus = (status) => {

    switch (status.toLowerCase()) {
      case 'preprod':

        return 'Pre Producción';

      case 'shooting':

        return 'En rodaje';

      case 'postprod':

        return 'Pos Producción';

      case 'closing':

        return 'Cerrado';


      default:
        break;
    }
  }

  /// WATCHES ///   
  watch(budgetQuery.data, () => {
    if (budgetQuery.data.value) {

      if (budgetQuery.data.value.ok) {

        store.setCurrentProjectBudget(budgetQuery.data.value.data);

       

      } else {

        appStore.setMessage(true, budgetQuery.data.value.error, 'error');

        showMessage(budgetQuery.data.value.error, 'error');

        if (budgetQuery.data.value.status == '401') {

            onUnauthorizeRedirect();
        }

        
      }

      enableBudgetQuery.value = false;  
     

    }
  });




  return {
    //Properties

    //Getters
    currentProject,
    currentProjectBudget,
    currentProjectBalance,
   

    //Methods
    setCurrentProject,
    getProjectStatus,

  }
};

