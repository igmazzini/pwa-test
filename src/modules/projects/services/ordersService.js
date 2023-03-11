import preproApi from '@/api/preproApi';
import { uploadFiles } from '@/services/filesServices';

export const sleep = (time = 2000) => {
  return new Promise(resolve => {
      setTimeout(() => {
          resolve(true);
      }, time);
  })
} 


export const getByProject = async (projectId) => {

    try {

      //await sleep();
  
      const resp = await preproApi.get(`/orders-by-project/${projectId}/`);    
      
      const { data } = resp;   
      
  
      if(data.ok){        
     
        return {ok:true,data:data.data}; 
  
      }else{      
  
        return {ok:false,error:data.data};
  
      }
      
    } catch (error) {
  
      console.error("Error getting orders: ", error);
  
      if(error.response.status == 401){
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }
      return {ok:false,error:'Falló la carga de ordenes'};
      
    }
}

export const getOrderDetailByCategories = async ( projectId ) => {  

    try {      
  
      const resp = await preproApi.get(`/orders-details-by-categories?project_id=${projectId}`);
  
      const { data } = resp;
  
  
      if(data.ok){
        return {ok:true,data:data.data};
      }else{
        return {ok:false,error:data.data};
      }
          
      
      
    } catch (error) {   
  
      if(error?.response?.status == 401){
  
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }
  
      return {ok:false,error:'Falló la carga de detalles de ordenes'};
      
    }
  }

export const upload = async ( orderParams ) => {

    try {    
    
  
      const refs = await uploadFiles(orderParams.files,orderParams.project_id, 'orders');    
     
  
      let filesToUpload = [];
  
      orderParams.files.forEach((file,index) => {
         const uploadFile = {
            storage_url:refs[index].downloadUrl,
            file_name:file.file_name,
            file_id:file.file_id,
            storage_type_id:file.storage_type_id,
         }
  
         filesToUpload.push(uploadFile);
      }); 
      
     
      orderParams.files = filesToUpload;
  
      const resp= await preproApi.post('/orders/create/',orderParams);   
  
      const { data } = resp;   
  
      if(data.ok){        
     
        return {ok:true,data:data.data}; 
  
      }else{      
  
        return {ok:false,error:data.data};
  
      }
     
  
    } catch (error) {
  
      console.error("Error adding order: ", error);
  
      if(error?.response?.status == 401){
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }
      
      return {ok:false,error:'No se pudo cargar la orden'};
    }
}
  
export const update = async ( orderParams ) => {
  
    try {    
     
  
      const refs = await uploadFiles(orderParams.files,orderParams.project_id,'orders');
      
      let filesToUpload = []; 
        
  
      orderParams.files.forEach((file) => {
  
  
        const ref = refs.find( r => r.file_id == file.file_id);
  
        if(ref){        
  
          if(ref){
              const uploadFile = {
                storage_url: ref.downloadUrl,
                file_name:file.file_name,
                file_id:file.file_id,
                storage_type_id:file.storage_type_id,
              }
  
              filesToUpload.push(uploadFile);     
          }
  
        
  
        }else{
  
          filesToUpload.push(file);
        }
        
      });   
  
  
      const params = {
       /*  company_id:orderParams.company_id,
        category_id:orderParams.category_id,
        project_id:orderParams.project_id,
        cost_center_id:orderParams.project_id,
        currency_id:orderParams.currency_id,
        order_name:orderParams.order_name,
        date_payment:orderParams.date_payment,
        motive:orderParams.motive,
        amount:orderParams.amount,
        products:orderParams.products, */
        files:filesToUpload,
       /*  status:orderParams.status, */
  
      } 
  
  
      const resp = await preproApi.put(`/orders/update/${orderParams.order_id}/`,params);   
     
      const { data } = resp;   
  
      if(data.ok){        
     
        return {ok:true,data:data.data}; 
  
      }else{      
  
        return {ok:false,error:data.data};
  
      }
     
     
  
    } catch (error) {
  
      console.error("Error updating order: ", error);
  
      if(error?.response?.status == 401){
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }
      
      return {ok:false,error:'No se pudo actualizar la orden'};
    }
}
  
export const pay = async ( orderParams ) => {
  
   
   console.log(orderParams)
  
    try {    
     
      
      
  
      const refs = await uploadFiles(orderParams.files,orderParams.project_id,'orders');
      let filesToUpload = []; 
        
  
      orderParams.files.forEach((file) => {
  
  
        const ref = refs.find( r => r.file_id == file.file_id);
  
        if(ref){        
  
          if(ref){
              const uploadFile = {
                storage_url: ref.downloadUrl,
                file_name:file.file_name,
                file_id:file.file_id,
                storage_type_id:file.storage_type_id,
              }
  
              filesToUpload.push(uploadFile);     
          }
  
        
  
        }else{
  
          filesToUpload.push(file);
        }
        
      });   
  
  
      const params = {
     
        payment_id:orderParams.payment_id,     
        files:filesToUpload,
      
  
      } 
  
      
      const resp = await preproApi.post(`/orders/pay/${orderParams.order_id}/`,params);   
     
      const { data } = resp;   
  
      if(data.ok){        
     
        return {ok:true,data:data.data}; 
  
  
      }else{
        
  
        return {ok:false,error:data.data};
      }
     
  
    } catch (error) {
  
      console.error("Error updating order: ", error);
  
      if(error?.response?.status == 401){
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }
      
      return {ok:false,error:'No se pudo pagar la orden'};
    }
}
  
export const approve = async ( orderId ) => {
  
    try {      
  
  
      const resp = await preproApi.post(`/orders/approve/${orderId}/`);   
     
      const { data } = resp;   
  
      if(data.ok){        
     
        return {ok:true,data:data.data}; 
  
  
      }else{
        
  
        return {ok:false,error:data.data};
      } 
  
    } catch (error) {
  
      console.error("Error deleting order: ", error);
  
      if(error?.response?.status == 401){
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }
      
      return {ok:false, error:'No se pudo aprobar la orden'};
    }
}
  
export const annulate = async ( orderId ) => {
  
    try {      
  
  
      const resp = await preproApi.post(`/orders/annulate/${orderId}/`);   
     
      const { data } = resp;   
  
      if(data.ok){        
     
        return {ok:true,data:data.data}; 
  
  
      }else{
        
  
        return {ok:false,error:data.data};
      } 
  
  
     
  
    } catch (error) {
  
      console.error("Error annulating order: ", error);
  
      if(error?.response?.status == 401){
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }
      
      return {ok:false, error:'No se pudo anular la orden'};
    }
}