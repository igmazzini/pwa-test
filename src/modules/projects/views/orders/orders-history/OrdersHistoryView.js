import { defineComponent,  onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import Breadcrumbs from "@/modules/shared/components/breadcrumbs/Breadcrumbs.vue";
import OrdersHistory from '@/modules/projects/components/orders/history/OrdersHistory.vue';
import { useProject }  from '@/modules/projects/composables';
import { useUI }  from '@/modules/shared/composables';

export default defineComponent({
  name: "OrdersHistoryView",
  components: {
    Breadcrumbs,   
    OrdersHistory
  },
  setup() {

    const { currentProject } = useProject();
    const { setShowSearchTopBar, mobile } = useUI();

    const router = useRouter();   
    
    const breadcrumbs = ref([]);
  
  
    if (currentProject.value == null) {
      router.replace({ name: "projects-page" });
      return;
    }   

    breadcrumbs.value = [
      {label:'Proyectos',url:'projects-page'},
      {label:currentProject?.value?.project_name,url:'project-page'},
      {label:'Ordenes',url:'orders-history-page'}
    ];    



    onMounted(async () => {    

      setShowSearchTopBar(false);

    });

    onUnmounted(()=>{
      setShowSearchTopBar(true);
    });
   

    return {    
      mobile,
      breadcrumbs,
      currentProject
     
      
    };
  },
});