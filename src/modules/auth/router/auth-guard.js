
import { useAuthStore } from '@/modules/auth/store/auth';
import { useAppStore } from '@/store/appStore';
import { checkAutentication } from '@/modules/auth/services/authServices'


const isAuthenticatedGuard = async( to, from, next) => {    
   

    const authStore = useAuthStore();   
    const appStore =  useAppStore();

    appStore.setLoading(true,'Cargando...');
  
    const { ok } = await checkAutentication();      
   
    if( ok ) {        
       
        next()
    }
    else{ 

        authStore.setUser(null);

        authStore.setStatus('not-authenticated');

        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        appStore.setMessage(true, 'Token vencido', 'error');

        next({ name: 'login-page'})

        
    }  
    
    appStore.setLoading(false);
} 

export default isAuthenticatedGuard;