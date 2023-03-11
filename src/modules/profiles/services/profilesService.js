import preproApi from '@/api/preproApi';


export const getProfiles = async () => {
    try {       
       
        const resp = await  preproApi.get('/profiles');  
        
        const { data } = resp;       
    
        if(data.ok){

            return {ok:true,data:data.data}; 

        }else{

            return {ok:false, error:resp.data.data};
        }
        
    } catch (error) {
  
        if(error.response.status == 401){
          return {ok:false,error:'Token vencido', status:error?.response?.status};
        }
        
        console.error("Error getting profiles: ", error);
  
        return {ok:false, error:'Falló la carga de perfiles'};
    }
}

const sleep = ( delay  = 2000 ) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, delay);
    })
}

export const getUserProfile = async ( ) => {
    try {     
        
        await sleep(0);

        const resp = await  preproApi.get('/user-profile');     
        
        const { data } = resp;
    
        if(data.ok){

            return {ok:true,data:data.data}; 

        }else{

            return {ok:false, error:resp.data.data};
        }
        
    } catch (error) {
  
        if(error.response.status == 401){
          return {ok:false,error:'Token vencido', status:error?.response?.status};
        }
        console.error("Error getting user profile: ", error);
  
        return {ok:false, error:'Falló la carga del perfil de usuario'};
    }
}

export const update = async ( profile ) => {
    try {    

        if(profile.date_birth == '' || String(profile.date_birth).length == 0){
            profile.date_birth = null;
        }      
       

        const resp = await  preproApi.put(`/profiles/${profile.user}/`,profile);    


        const { data }  = resp;
        
        if(data.ok){

            return {ok:true, data:data.data};

        }else{

            return {ok:false, error:data.data};
        }
    
       
        
    } catch (error) {
  
        if(error.response.status == 401){
          return {ok:false,error:'Token vencido', status:error?.response?.status};
        }
        console.error("Error updating profile: ", error);
  
        return {ok:false, error:'Falló la actualizacíon del perfil'};
    }
}
