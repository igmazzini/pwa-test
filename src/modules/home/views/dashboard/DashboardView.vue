<template>
  <div class="dashboard">
    <div class="dashboard-projects">
      <ProjectsList/>
    </div>
    <div class="dashboard-statistics">
      
      <MovementHistory/>
      <Statistics/>
     
    </div> 
  </div>
</template>

<script>



import { useRouter } from "vue-router";
import ProjectsList from '@/modules/home/components/projects-list/ProjectsList.vue';
import MovementHistory from '@/modules/home/components/movement-history/MovementHistory.vue';
import Statistics from '@/modules/home/components/statistics/Statistics.vue';
import { useProducts,useCategories, useProviders } from '@/modules/products/composables';
import { useUI }  from '@/modules/shared/composables';
import { useHome }  from '@/modules/home/composables';


export default {
  name: "Dashboard",  
  components:{
    ProjectsList,
    MovementHistory,
    Statistics
  },
  setup() {
  
    const {  setTitle, setTitleCallBack } = useUI();
    
    const router = useRouter();


    


    useProducts();
    useCategories();
    useProviders();
    useHome();
   

    
    
    setTitle('Escritorio');
   

    setTitleCallBack(null);
   

    

    return {
    
      router,   
    
      onProjects() {
        router.push({ name: "projects-page" });
      },
      onProducts() {
        router.push({ name: "products-page" });
      },
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./dashboard.scss";
</style>