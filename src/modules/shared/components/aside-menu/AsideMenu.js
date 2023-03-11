import { useRouter } from 'vue-router';
import { useAuth } from '@/modules/auth/composables/useAuth';
import { useUI } from '@/modules/shared/composables/useUI';
import ToggleThemeMode  from '@/modules/shared/components/toggle-theme-mode/ToggleThemeMode.vue';
import UserAccount from '@/modules/shared/components/user-account/UserAccount.vue';
import {  defineComponent,onMounted, onUnmounted } from "vue";



export default defineComponent ({
    name:'AsideMenu', 
    components:{
      ToggleThemeMode,
      UserAccount
    },
   
    setup() {

   
    const router = useRouter();  
    const { logOutGoogle } = useAuth();   
    const { mobile, darkMode, smallMenu ,setOpenMenu, setDarkMode, fullScreen,  setSmallMenu, setFullScreen , version } = useUI();
 
   
   
 

    const logOut = async () => {

        logOutGoogle();
      
        if(mobile){
          setOpenMenu(false); 
        }
        
        router.push({ name: "login-page" });
      
    }


    const closeMenu = (delay = 100) => {
     
       setTimeout(() => {
            setOpenMenu(false);  
         }, delay);
    }


    

    const onLogoTap = () => {      
      
       setOpenMenu(false); 
       router.push({ name: "dashboard-page" });
    }

    const onToggleMenu = () =>{
      setSmallMenu(!smallMenu.value)
    }

    const fullScreenChange  = () =>{
      
      if(document.fullscreenElement){
       
        setFullScreen(true);

      }else{
        
        setFullScreen(false);
        
      }
      
    }
    const onToggleScreen = () =>{
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();       
        setFullScreen(true);
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
        
        setFullScreen(false);
      }
    }


    const onChangeMode = () =>{     
      
      setDarkMode(!darkMode.value);

      closeMenu(400);
    }


    onMounted(()=>{
      document.addEventListener('fullscreenchange', fullScreenChange);
    });
    onUnmounted(()=>{
      document.removeEventListener('fullscreenchange', fullScreenChange);
    });




    return{
      version,
      fullScreen,
      darkMode,
      smallMenu,     
      mobile,     
      onLogoTap,
      logOut,
      closeMenu,
      onToggleMenu,
      onToggleScreen,
      onChangeMode
     
    }
  },



});