<template>

<div class="page-layout">
  <router-view /> 
</div>
   
</template>

<script>




import { useRouter } from "vue-router";
import { useUI  } from "@/modules/shared/composables";
import { ref } from 'vue';
export default {
  name: "HomeLayout", 
  setup() {
   
    const router = useRouter();
   
    const { setTitle } = useUI()
    const menu = ref(null);
    const action = ref(true);

    setTitle("Projectos");

   
   

  
    return {
     
      router,    
      menu,
      action,     
      onAction(){      
        action.value = !action.value;
      },
    
      goToProjects() {
        router.push({ name: "projects-page" });
      },
      goToProducts() {
        router.push({ name: "products-page" });
      },     
      openMenu(){
        menu.value.classList.toggle("side-menu-open");
      },
      goBack(){
         router.go(-1);
      }
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./home.scss";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms, transform 300ms;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;

  transform: translateX(100%);
}
</style>