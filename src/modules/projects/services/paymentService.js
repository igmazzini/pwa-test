import preproApi from '@/api/preproApi';



export const getPaymentTypes = async (  ) => {

  try {    

    const {data} = await preproApi.get('/types-payment');   
   
    return {ok:true,data};
   

  } catch (error) {

    console.error("Error getPaymentTypes: ", error);

    if(error?.response?.status == 401){
      return {ok:false,error:'Token vencido', status:error?.response?.status};
    }

    return {ok:false,error:'Falló la carga de tipos de pagos'};
   
  }
}