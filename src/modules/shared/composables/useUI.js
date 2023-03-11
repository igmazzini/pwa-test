import { computed, onMounted, ref } from "vue";

import {  format } from '@/helpers/utils';
import "viewerjs/dist/viewer.css";
import { api as viewerApi } from "v-viewer";
import { useAppStore } from "@/store/appStore";


const fullScreen = ref(false);

export const useUI = () =>{

   
    const appStore = useAppStore();
    let toolTipTimeOut = -1;
   

    const setFullScreen = ( val ) =>{
        fullScreen.value = val;
        appStore.setFullScreen(val);
        
    }


    const showLoading = ( show, loadingMeesage ) =>{
        appStore.setLoading(show, loadingMeesage);
    }   

    const showMessage = (msg, type) =>{

        appStore.setMessage(true, msg, type)
    }
    const setTitle = ( title ) =>{

       
        appStore.setPageTitle(title)     
    }


    const setTitleCallBack = ( callBack ) =>{
        appStore.setTitleCallBack(callBack);
    } 
    
    const callTitleCallBack = (  ) =>{

        appStore.callTitleCallBack();
    } 

    const setArrowCallback = ( callBack ) =>{

        
        appStore.setBackArrowCallback(callBack)
    }

    const backArrow = ( params ) =>{

        
        appStore.callBackArrowCallback( params );
    }

    const setOpenMenu = (open) =>{

      
        appStore.setOpenMenu(open);
    }

    const setSmallMenu = ( val ) =>{
       
        appStore.setSmallMenu( val );
    }

    const setDarkMode = ( val ) =>{

       
        appStore.setDarkMode( val );
       
    }

    const setMobile = (val) =>{

        
        appStore.setMobile(val);
       
    }

    const setOpenKeyboard = (val) =>{

       
        appStore.setOpenKeyboard(val);
       
    }

    const setShowSearchTopBar = ( val ) => {

       
        appStore.setShowSearchTopBar(val);
    }

    const getMobileOperatingSystem = () => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            
            
            appStore.setDeviceType("Windows Phone");
            return;
        }
    
        if (/android/i.test(userAgent)) {
           
            
            appStore.setDeviceType("Android");
            return;
        }
    
        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
           
            
            appStore.setDeviceType("iOs");
            return;
        }    
        
        
        appStore.setDeviceType("");
    }

    const setCurrency = ( val ) =>{
        appStore.setCurrency(val)
    }

    const formatAmount = (amount) =>{      
        
        return  format(amount,{prefix:`${appStore.currency} `});
    }

    const formatDate = (date, time = false) => {

        const formatDate = new Date(date);

        if (time) {
            const time = `${formatDate.getHours()}:${formatDate.getMinutes()}`
            return `${formatDate.getDate()}/${formatDate.getMonth() + 1}/${formatDate.getFullYear()} - ${time} hs`;
        } else {
            return `${formatDate.getDate()}/${formatDate.getMonth() + 1}/${formatDate.getFullYear()}`;
        }


    }

    const openFile = ( file,showViewerCallBack = null,  hideViewerCallBack = null ) =>{

        if(file.storage_url){

            if(file.file_name.includes('pdf')){  

                openPDF(file.storage_url);

            }else{
                
                showImageViewer(file.storage_url, file.file_name,showViewerCallBack,hideViewerCallBack);
            }
           

        }else{     
            
            const { type } = file.file;               

            if(type.includes('pdf')){

                const url = URL.createObjectURL(file.file)
                openPDF(url);

            }else{
                if (FileReader) {
                    const fr = new FileReader();
                    fr.onload = function () {    
                        
                        showImageViewer(fr.result, file.file_name,showViewerCallBack, hideViewerCallBack);
                    }
                    fr.readAsDataURL(file.file);
                }
            }

           
        }
    }

    const showImageViewer = (src, name,showViewerCallBack,hideViewerCallBack) =>{
        viewerApi({
        options: {   
        inline:false,  
        title:false,
        hidden:()=>{
            if(hideViewerCallBack){
                hideViewerCallBack();
            }
          },                   
        toolbar: {
        
            zoomIn:true,
            zoomOut:true,
            rotateRight:true,
            reset:true,
            oneToOne: false,
            rotateLeft:false,                    
            flipHorizontal:false,
            flipVertical:false,
        
            
        },
        navbar:false,
        url: 'data-source',
        initialViewIndex: 0,
        },
        images: [{
            'data-source': src,
            'src': src,
            'alt': name,
        }],
    });   

    if(showViewerCallBack){
        showViewerCallBack();
    }
    
}

    const openPDF = (url) =>{

        const a = document.createElement('A');
        const filePath = url;           
        a.href = filePath;
        a.target = '_blank';
        //a.download = filePath.substr(filePath.lastIndexOf('/') + 1);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    const copyToClipboard = async ( text,toolTipText = '', target,offSetX = 0, offSetY = 0  ) =>{

        if(!navigator.clipboard){

            console.error('Copy to clipboard is not suport by this browser');

        }else{          

            await navigator.clipboard.writeText(text);  

            clearTimeout(toolTipTimeOut);

            if(target){

                if(toolTipText != ''){
                    showTooltip(toolTipText, target,offSetX, offSetY);
                }
                
                toolTipTimeOut = setTimeout(()=>{
                    removeTooltip();               
                }, 1500);
            }
        }      

        
       
    }

    const showTooltip = ( text, target, offSetX = 0, offSetY = 0 ) =>{
        

        if(document.getElementById('custom-tool-tip')){
            document.getElementById('custom-tool-tip').remove()
        }


        const toolTip = document.createElement('span');      

        toolTip.id = 'custom-tool-tip';

       
        toolTip.classList.add('custom-tooltip');      
        
        if(appStore.darkMode) {
            toolTip.classList.add('dark-custom-tooltip');
        }
              
     
        toolTip.innerHTML = text;
       
        document.body.appendChild(toolTip);       

        let x = target.getBoundingClientRect().left - toolTip.clientWidth * 0.450 + offSetX,
        y = target.getBoundingClientRect().top - toolTip.clientHeight * 1.2 + offSetY;

        toolTip.style.top = y + 'px';
        toolTip.style.left = x + 'px';

      
    } 

    const removeTooltip = () =>{
        if(document.getElementById('custom-tool-tip')){
            document.getElementById('custom-tool-tip').remove()
        }

    }

    const validateCUIT = ( cuit ) =>{

        cuit = cuit.replaceAll('-','');

        if (cuit.length !== 11) {
            return false;
          }
        
          let acumulado = 0;
          let digitos = cuit.split('');
          let digito = parseInt(digitos.pop());
        
          for (let i = 0; i < digitos.length; i++) {
            acumulado += digitos[9 - i] * (2 + (i % 6));
          }
        
          let verif = 11 - (acumulado % 11);
          if (verif === 11) {
            verif = 0;
          } else if (verif === 10) {
            verif = 9;
          }
        
          return digito === verif;
    } 

    const _isLengthOk = (cbu) => {
        return (cbu && cbu.length == 22);
    };

    const  _isValidAccount = (acc) => {
        if (!acc || acc.length !== 14) {
            return false;
        }
    
        const sum = acc[0] * 3 + acc[1] * 9 + acc[2] * 7 + acc[3] * 1 + acc[4] * 3 + acc[5] * 9 + acc[6] * 7 + acc[7] * 1 + acc[8] * 3 + acc[9] * 9 + acc[10] * 7 + acc[11] * 1 + acc[12] * 3;
        const diff = (10 - (sum % 10)) % 10; // the result of this should be only 1 digit
        const checksum = acc[13];
    
        return diff == checksum;
    };

    const _isValidBankCode = (code)  => {
        if (!code || code.length !== 8) {
            return false;
        }
        const bank = code.substr(0, 3);
        const checksumOne = code[3];
        const branch = code.substr(4, 3);
        const checksumTwo = code[7];
    
        const sum = bank[0] * 7 + bank[1] * 1 + bank[2] * 3 + checksumOne * 9 + branch[0] * 7 + branch[1] * 1 + branch[2] * 3;
        const diff = (10 - (sum % 10)) % 10; // the result of this should be only 1 digit
    
        return diff == checksumTwo;
    };

    const validateCBU = ( cbu ) =>{

        if(!cbu) return false;

        cbu = cbu.replaceAll('-','');

        if (!cbu || !cbu.substr) return false;
        const bankCode = cbu.substr(0, 8);
        const accountCode = cbu.substr(8, 14);
        return _isLengthOk(cbu) && _isValidBankCode(bankCode) && _isValidAccount(accountCode);
    } 
    
    const isOnlyNumbers =  (str)  => {
        if (!str) return false;
        const isNumberRegex = /^\d+$/;
        return isNumberRegex.test(str);
    };

    const isValidDNI =  (dni) => {
        if (!dni) return false;
        const dniString = dni.toString();
        return dniString.length >= 7 && dniString.length <= 8 && isOnlyNumbers(dniString);
    };

    const validateEmail = ( email ) =>{
        if (!email || email.length === 0) return false;
        const emailRegex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        return emailRegex.test(email);
    }


    const sortByDate = ( target, dateField = '',ascending = true ) =>{
        return target.sort((a,b)=>{

            const dateA = (dateField != '') ? new Date(a[dateField]).getTime() : new Date(a.date).getTime(); // ignore upper and lowercase
            const dateB = (dateField != '') ? new Date(b[dateField]).getTime() : new Date(b.date).getTime(); // ignore upper and lowercase
            
            if(ascending){
                // sort in an ascending order
                if (dateA > dateB) {
                    return 1;
                }else{
                    return -1
                }
            }else{

                 // sort in an ascending order
                 if (dateB > dateA) {
                    return 1;
                }else{
                    return -1
                }

            }
           
         
       })

     
    }

    const sortAlphabetically = (target, field) => {
        return target.sort((a, b) => {

            const nameA = a[field].toLowerCase(); // ignore upper and lowercase
            const nameB = b[field].toLowerCase(); // ignore upper and lowercase

            // sort in an ascending order
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        })


    }

    const substring = (text = '', limit = 30) => {

        if (text.length > limit) {
    
            return `${text.substring(0, limit)}...`;
    
        } else {
    
            return text;
        }
    }


    const getStatus = ( status ) =>{
         
        let out = '';

        switch (status) {
          case 'PENDING':
            out = 'Pendiente';
            break;
          case 'APPROVED':
            out = 'Aprobada';
            break;
          case 'PAID':
            out = 'Pagada';
            break;
          case 'CANCELLED':
            out = 'Anulada';
            break;
        
          default:

            out = 'Sin estado'
            break;
        }

        return out;
    }
   
    
    onMounted( ()=>{
        getMobileOperatingSystem();
    });

    return{
        fullScreen,
        online:computed( () => appStore.online),
        version: computed( ()=> appStore.version ),
        mobile: computed( ()=> appStore.mobile ),       
        darkMode: computed( ()=> appStore.darkMode ),
        smallMenu: computed( ()=> appStore.smallMenu ),
        openMenu: computed( ()=> appStore.openMenu ),
        openKeyboard: computed( ()=> appStore.openKeyboard ),
        deviceType: computed( ()=> appStore.deviceType ),
        loading: computed( ()=> appStore.loading ),
        loadingMessage: computed( ()=> appStore.loadingMessage ),
        showSearchTopBar: computed( ()=> appStore.showSearchTopBar ),
        pageTitle: computed( ()=> appStore.pageTitle ),
        currency: computed( ()=> appStore.currency ),
        showingMessage: computed( ()=> appStore.showMessage ),
        messageText: computed( ()=> appStore.messageText ),
        messageType: computed( ()=> appStore.messageType ),
        backArrow,
        setTitle,
        setArrowCallback,
        setOpenMenu,
        setShowSearchTopBar,
        setSmallMenu,
        setDarkMode,
        setMobile,
        setOpenKeyboard,
        formatAmount,
        formatDate,
        openFile,
        copyToClipboard,
        validateCUIT,
        validateCBU,
        isValidDNI,
        validateEmail,
        showTooltip,
        removeTooltip,
        sortByDate,
        substring,       
        setFullScreen,
        showMessage,
        showLoading,
        setCurrency,
        getStatus,
        sortAlphabetically,
        setTitleCallBack,
        callTitleCallBack,
    }
}