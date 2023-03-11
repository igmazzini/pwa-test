import preproApi from '@/api/preproApi';



export const getStorageTypes = async (  ) => {

  try {    

    const {data} = await preproApi.get('/types-storage');   
   
    return {ok:true,data};
   

  } catch (error) {

    console.error("Error getTypesStorage: ", error);

    if(error?.response?.status == 401){
      return {ok:false,error:'Token vencido', status:error?.response?.status};
    }

    return {ok:false,error:'Falló la carga de storages'};
   
  }
}