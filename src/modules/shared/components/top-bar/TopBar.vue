<template>
  <div class="top-bar">
    <ConnectionBar/>
    <font-awesome-icon class="open-menu-icon" @click="onOpenMenu" icon="fa-solid fa-bars"  v-if="mobile"/>
    <p class="top-bar--title" @click="callTitleCallBack" >{{ pageTitle}}</p>
    
    <div class="top-bar--search" v-if="!mobile">
      <TopSearchBar v-show="showSearchTopBar"/>
    </div>
    <div v-if="!mobile" class="top-bar--account">
      <UserAccount/>
    </div>
    <font-awesome-icon icon="fa-solid fa-chevron-left" @click="onArrowBack"  v-if="mobile"/>
  </div>   
</template>

<script>
import { useRouter } from 'vue-router';
import { useUI } from '@/modules/shared/composables/useUI';
import {  TopSearchBar, ConnectionBar  } from '@/modules/shared/components';
import UserAccount from '@/modules/shared/components/user-account/UserAccount.vue';



export default {
    name:'TopBar',
    components:{
      UserAccount,
      TopSearchBar,
      ConnectionBar
     
    },
    setup(){       

      
        const router = useRouter();
        const { mobile, pageTitle, showSearchTopBar,   openMenu, setOpenMenu, setArrowCallback, backArrow, callTitleCallBack } = useUI();
 
        const onOpenMenu = () => {           
            setOpenMenu(!openMenu.value);
        }
        const goBack = () => {
          
             router.go(-1);
        }

       setArrowCallback(goBack);

       
        const onArrowBack = () =>{
           backArrow();
        }
        return{
            mobile,
            openMenu,
            pageTitle,
            showSearchTopBar,
            onOpenMenu,
            onArrowBack,
            goBack,
            callTitleCallBack

        }
    }

}
</script>

<style lang="scss" scoped>
@import "./topbar.scss";

</style>