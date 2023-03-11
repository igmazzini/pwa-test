<template>
  <div :class="['app-container', smallMenu && !mobile ? 'app-container-small-menu' : '', darkMode ? 'dark' : '', fullScreen ? 'app-container-fullScreen' : '']">
    <div v-if="openMenu" @click="onMenuBackTap" class="aside-menu-background"></div>
    <div v-if="!hideAside" :class="['app-container-aside', openMenu ? 'app-container-aside--open' : '']">
      <AsideMenu />
    </div>
    <div  :class="['app-container-views', hideAside ? 'app-container-views-login' : '', 'animate__animated  animate__fadeIn animate__faster']">


      <div class="fullscreen-top-bar" v-if="fullScreen"></div>

     

      

      <TopBar v-if="!hideAside" />

      <router-view />

      <Modal/>

      <Loading />


      <Message />


      <ManagerPWA/>
      

    </div>
  </div>

</template>


<script>
import {AsideMenu, TopBar, Loading, Message, Modal, MobileUI, ManagerPWA} from "@/modules/shared/components";
import { useRoute } from "vue-router";
import { ref, watch,  onUnmounted } from "vue";
import { useUI } from '@/modules/shared/composables/useUI';
import { useAppStore } from "./store/appStore";




export default {
  components: {
    AsideMenu,
    TopBar,
    Loading,
    Message,
    Modal,
    MobileUI,
    ManagerPWA

  },
  setup() {

    const route = useRoute();
    const hideAside = ref(true);
    const { mobile, setMobile, smallMenu, darkMode, setOpenMenu, openMenu, deviceType, setOpenKeyboard, fullScreen } = useUI();

    const appStore = useAppStore();

    console.log(`${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`);


    
   

    
   

    if (document.documentElement.clientWidth < 1300) {
      setMobile(true);
    } else {
      setMobile(false);
    }

    watch(() => route.path, () => {
      if (route.name == "login-page") {
        hideAside.value = true;
      } else {
        hideAside.value = false;
       
      }

    }
    );   



    const onMenuBackTap = () => {

      setOpenMenu(!openMenu)

    };  

    const onFocus = ( e ) => {

      if (e.target.nodeName == 'INPUT') {

        if (deviceType.value == 'iOs') {
          setOpenKeyboard(true)
        }
      }
    }

    const onBlur = ( e ) => {

      if (e.target.nodeName == 'INPUT') {
        if (deviceType.value == 'iOs') {
          setOpenKeyboard(false)
        }
      }
    }

    const onResize = () =>{

      console.log(`${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`)


      if (document.documentElement.clientWidth < 1300) {
        setMobile(true);
        appStore.setMobile(true);
      } else {
        setMobile(false);
        appStore.setMobile(false);
      }

      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }

    const checkNetwork = () =>{

      if(window.navigator.onLine){

        appStore.setOnline(true);

      }else{

        appStore.setOnline(false);
        
      }
    }

    checkNetwork();


    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);  
    
    window.addEventListener("resize",onResize);

    window.addEventListener('online',  checkNetwork );
    window.addEventListener('offline', checkNetwork );

    document.addEventListener("blur", onBlur, true);

    document.addEventListener("focus", onFocus, true);





    onUnmounted(() => {

      window.removeEventListener("resize",onResize);

      document.removeEventListener("blur", onBlur, true);

      document.removeEventListener("focus", onFocus, true);

      window.removeEventListener('online', checkNetwork);
      window.removeEventListener('offline', checkNetwork);

    })





    return {
      mobile,
      fullScreen,
      openMenu,
      smallMenu,
      darkMode,
      hideAside,
      onMenuBackTap,
    };
  },
};
</script>
<style lang="scss">
.viewer-toolbar>ul>li {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  cursor: pointer;
  float: left;
  height: 45px !important;
  overflow: hidden;
  -webkit-transition: background-color 0.15s;
  transition: background-color 0.15s;
  width: 45px !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewer-title,
.viewer-toolbar>ul>li:nth-child(5),
.viewer-toolbar>ul>li:nth-child(6),
.viewer-toolbar>ul>li:nth-child(7) {
  display: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms, transform 300ms;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;

  transform: translateX(-100%);
}



.dp__menu {
  font-family: RobotoLight !important;
  font-size: 1.4em !important;

}

.dp__today {
  border: 1px solid var(--button-active-color-light) !important;
}

.dp__range_end,
.dp__range_start,
.dp__active_date {
  background-color: var(--background-color) !important;
}

.dp__overlay_cell_active {

  background-color: var(--background-color) !important;

}

.dp__calendar_header {

  font-weight: normal;
}
</style>
