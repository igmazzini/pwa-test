import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('appStore', () =>{



    const version = ref('1.2.4');
    
    const online = ref(true);
    const mobile = ref(false);    
    const darkMode = ref(false);
    const currency = ref('$');
    const showMessage = ref(false);
    const openMenu = ref(false);
    const smallMenu = ref(false);
    const loading = ref(false);
    const showSearchTopBar = ref(false);
    const fullScreen = ref(false);
    const openKeyboard = ref(false);
    const backArrowCallback = ref(null);
    const loadingMessage = ref('Cargando');
    const messageText = ref('Todo bien');
    const messageType = ref('success');
    const pageTitle = ref('Titulo');
    const titleCallBack = ref(null);
    const deviceType = ref('');
    
    
    

   
    const setOnline = ( val ) =>{
        online.value = val;
    }

    const setBackArrowCallback = ( val ) =>{
        backArrowCallback.value = val;
    }

    const setShowSearchTopBar = ( val ) =>{
        showSearchTopBar.value = val;
    }

    const setSmallMenu = ( val ) =>{
        smallMenu.value = val;
    }

    const setOpenMenu = ( val ) =>{
        openMenu.value = val;
    }

    const setMobile = ( val ) =>{
        mobile.value = val;
    }

    const setDarkMode = ( val ) =>{
        darkMode.value = val;
    }

    const setLoading = ( val, msg ) =>{
        loading.value = val;
        loadingMessage.value = msg
    }

    const setMessage = ( val, msg, type ) =>{
        showMessage.value = val;
        messageText.value = msg;
        messageType.value = type;

        setTimeout(()=>{
            showMessage.value = false;
            messageText.value = '';
            messageType.value = 'success';
        },2500);
    }

    const setPageTitle = ( val ) =>{
        pageTitle.value = val;  
    } 

    const setTitleCallBack = ( val ) =>{
        titleCallBack.value = val;  
    }  
    const callTitleCallBack = (  ) =>{

        if(titleCallBack.value){
            titleCallBack.value();
        }
       
    }  

    const setDeviceType = ( val ) =>{
        deviceType.value = val;  
    }     
    const setOpenKeyboard = ( val ) =>{
        openKeyboard.value = val;  
    }     
    const setCurrency = ( val ) =>{
        currency.value = val;  
    }  
    
    const setFullScreen = ( val ) =>{
        fullScreen.value = val; 
    }

    const callBackArrowCallback = ( params ) => {
      
        if( backArrowCallback.value ){

            (params) ? backArrowCallback.value(params) :  backArrowCallback.value( );           
          
        }
    }


    return{
        //Properties
        mobile,
        loading,
        darkMode,
        openMenu,
        smallMenu,
        messageText,
        messageType,
        showMessage,
        pageTitle,      
        loadingMessage,
        showSearchTopBar,
        backArrowCallback,
        deviceType,
        openKeyboard,
        version,
        fullScreen,
        currency,
        online,

        //Getters
       

        //Actions
        setOnline,
        setMobile,
        setLoading,
        setMessage,
        setDarkMode,
        setOpenMenu,
        setSmallMenu,
        setPageTitle,
        setTitleCallBack,
        callTitleCallBack,
        setShowSearchTopBar,
        setBackArrowCallback,
        setDeviceType,
        setOpenKeyboard,
        setCurrency,
        setFullScreen,
        callBackArrowCallback,

    }

});