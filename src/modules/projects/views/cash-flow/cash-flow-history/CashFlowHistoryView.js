import { defineComponent,  ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {Breadcrumbs,TabNav} from "@/modules/shared/components";
import ExpenseReportHistory from '@/modules/projects/components/cash-flow/expense-report/history/ExpenseReportHistory.vue';
import MoneyOrderedHistory from '@/modules/projects/components/cash-flow/money-ordered/history/MoneyOrderedHistory.vue';
import MoneyAssignedHistory from '@/modules/projects/components/cash-flow/money-assigned/history/MoneyAssignedHistory.vue';
import { useUI } from '@/modules/shared/composables';
import { useProject } from '@/modules/projects/composables';





export default defineComponent({
    name:'CashFlowHistoryView',
    components:{         
        Breadcrumbs,
        TabNav,
        ExpenseReportHistory,
        MoneyOrderedHistory,
        MoneyAssignedHistory   
   
    },
    setup(){

        const router = useRouter();     
        const route = useRoute();   
       
        const { setTitle, mobile } = useUI();
        const { currentProject } = useProject();    
             
        const breadcrumbs = ref([]);
        const currentTab = ref(0);
        const previousTab = ref(0);        


        if(currentProject.value == null){
            router.replace({ name: "projects-page"});
            return;
        }     

       
        
        if(route.params && route.params.type != ''){
            
            
           switch (route.params.type) {
            case 'ef':
                currentTab.value = 0;
                break;
            case 'sc':
                currentTab.value = 1;    
                break;
            case 'as':
                currentTab.value = 2;
                break;
           
            default:
                break;
           }

           
         } 
       

        breadcrumbs.value = [
            {label:'Proyectos',url:'projects-page'},
            {label:currentProject.value.project_name,url:'project-page'},
            {label:'Efectivo en circulación',url:'cashflow-history-page'}
          ]; 

    
        setTitle(currentProject.value.project_name); 



        const setTab =  ( {currentIndex, previousIndex} ) =>{     

            previousTab.value = previousIndex;
            currentTab.value = currentIndex;
        
        }


        return {
          
            currentProject,
            mobile,         
            breadcrumbs,
            previousTab,
            currentTab,       
        
            setTab
        }
    }

});