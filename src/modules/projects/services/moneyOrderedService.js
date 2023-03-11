import preproApi from '@/api/preproApi';

/* export const sleep = (time = 2000) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, time);
    })
  }  */

export const getByProject = async ( projectId ) => {
    try {      
        
        //await sleep(3000);     

        const resp = await  preproApi.get(`/money-ordered-by-project/${projectId}`);    

        const { data } = resp;  

        if(data.ok){

            return {ok:true, data:data.data};

        }else{

            return {ok:false, error:data.data};
        }
    
       
        
    } catch (error) {
  
        if(error.response.status == 401){
          return {ok:false,error:'Token vencido', status:error?.response?.status};
        }
        console.error("Error getting cash requests: ", error);
  
        return {ok:false, error:'Falló la carga de solicitudes de efectivo'};
    }
}

export const upload = async ( cashData ) => {
    try {           
              

        const resp = await  preproApi.post('/money_ordered/create/',cashData);    

        const { data } = resp;        
        
        if(data.ok){

            return {ok:true, data:data.data};

        }else{

            return {ok:false, error:data.data};
        }
    
       
        
    } catch (error) {
  
        if(error.response.status == 401){
          return {ok:false,error:'Token vencido', status:error?.response?.status};
        }
        console.error("Error sending request cash: ", error);
  
        return {ok:false, error:'Falló el envio de la solicitud'};
    }
}

export const update = async ( cashData ) => {
    try {           
              

        //const resp = await  preproApi.post('/money_ordered/create/',cashData);    

        //const { data } = resp;    

        console.log('Update money ordered not implement ',cashData)
        
        const data = { ok: false, data:'Update not implement'}
        
        if(data.ok){

            return {ok:true, data:data.data};

        }else{

            return {ok:false, error:data.data};
        }
    
       
        
    } catch (error) {
  
        if(error.response.status == 401){
          return {ok:false,error:'Token vencido', status:error?.response?.status};
        }
        console.error("Error sending request cash: ", error);
  
        return {ok:false, error:'Falló la actualización de la solicitud'};
    }
}

export const approve = async ( id ) => {
    try {          
               

        const resp = await  preproApi.post(`/money_ordered/approve/${id}/`);    

        const { data } = resp;        
        
        if(data.ok){

            return {ok:true, data:data.data};

        }else{

            return {ok:false, error:data.data};
        }
    
       
        
    } catch (error) {
  
        if(error.response.status == 401){
          return {ok:false,error:'Token vencido', status:error?.response?.status};
        }
        console.error("Error approve request cash: ", error);
  
        return {ok:false, error:'Falló la aprobación de la solicitud'};
    }
}

export const pay = async ( id ) => {
    try {          
        
       

        const resp = await  preproApi.post(`/money_ordered/pay/${id}/`);    

        const { data } = resp;        
        
        if(data.ok){

            return {ok:true, data:data.data};

        }else{

            return {ok:false, error:data.data};
        }
    
       
        
    } catch (error) {
  
        if(error.response.status == 401){
          return {ok:false,error:'Token vencido', status:error?.response?.status};
        }
        console.error("Error pay request cash: ", error);
  
        return {ok:false, error:'Falló el pago de la solicitud'};
    }
}

export const annulate = async ( id ) => {
    try {          
        
       

        const resp = await  preproApi.post(`/money_ordered/annulate/${id}/`);    

        const { data } = resp;        
        
        if(data.ok){

            return {ok:true, data:data.data};

        }else{

            return {ok:false, error:data.data};
        }
    
       
        
    } catch (error) {
  
        if(error.response.status == 401){
          return {ok:false,error:'Token vencido', status:error?.response?.status};
        }
        console.error("Error annulate money ordered: ", error);
  
        return {ok:false, error:'Falló la anulación de la solicitud'};
    }
}