import preproApi from '@/api/preproApi';

export const getByProject = async ( projectId ) => {
    try {      
        
       
        const resp = await  preproApi.get(`/money-assigned-by-project/${projectId}`);    

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
        console.error("Error getting cash deliverys: ", error);
  
        return {ok:false, error:'Falló la carga de asignaciones de efectivo'};
    }
}

export const upload = async ( cashData ) => {
    try {      
        
        const params  = {
            user        :   cashData.user,
            project_id  :   cashData.project_id,
            amount      :   cashData.amount,
            motive      :   cashData.motive,
        }        

        const resp = await  preproApi.post('/money_assigned/create/',params);    

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
        console.error("Error assign cash: ", error);
  
        return {ok:false, error:'Falló la asignación de efectivo'};
    }
}