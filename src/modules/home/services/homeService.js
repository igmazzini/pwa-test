import preproApi from '@/api/preproApi';

export const getMovementHistory = async () => {
    try {       
       
        const resp = await  preproApi.get('/movement-history');  
        
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
        
        console.error("Error getting movement hisotry: ", error);
  
        return {ok:false, error:'Falló la carga del historial de movimientos'};
    }
}