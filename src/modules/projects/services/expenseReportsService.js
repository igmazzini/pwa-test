import preproApi from '@/api/preproApi';
import { uploadFiles } from '@/services/filesServices';

export const sleep = (time = 2000) => {
  return new Promise(resolve => {
      setTimeout(() => {
          resolve(true);
      }, time);
  })
}

export const upload = async ( requestParams ) => {

   

    try {  
    
      
      if(requestParams.files && requestParams.files.length > 0){

        const refs = await uploadFiles(requestParams.files,requestParams.project_id,'transactions');
  
        let filesToUpload = [];
    
        requestParams.files.forEach((file,index) => {
          const uploadFile = {
              storage_url:refs[index].downloadUrl,
              file_name:file.file_name,
              file_id:file.file_id,
              storage_type_id:file.storage_type_id,
          }
    
          filesToUpload.push(uploadFile);
        });    
      
      
    
    
        requestParams.files = filesToUpload;

      }    
  
  
  
      const resp = await preproApi.post('expense_report/create/',requestParams);
  
      const { data } = resp;   
      
  
      if(data?.ok){     
     
        return {ok:true,data:data.data}; 
  
      }else{      
  
        return {ok:false,error:data.data};
      }
      
      
      
      
     
  
    } catch (error) {
  
      console.error("Error adding request: ", error);
  
      if(error?.response?.status == 401){
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }
      
      return {ok:false,error:'Falló la carga de rendición'}; 
    } 

}
  
export const update = async ( requestParams ) => {
  
  
    try {  

      const params = {    
       
        files:[],
        invoice:requestParams.extra_data.invoice
  
      }  
      
      if(requestParams.files && requestParams.files.length > 0){
        const refs = await uploadFiles(requestParams.files,requestParams.project_id,'transactions');
        let filesToUpload = []; 
          
    
        requestParams.files.forEach((file) => {
    
    
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

        params.files = filesToUpload;
    
      }     
     
     
  
       
      const resp = await preproApi.put(`/expense_report/update/${requestParams.expense_report_id}/`,params);   
  
      const { data } = resp;   
  
      if(data.ok){        
     
        return {ok:true,data:data.data}; 
  
      }else{      
  
        return {ok:false,error:data.data};
  
      }
      
     
  
    } catch (error) {
  
      console.error("Error adding request: ", error);
        
      if(error?.response?.status == 401){
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }
  
     
  
      return {ok:false,error:'No se pudo actualizar la rendición'}; 
      
    } 

}
  
export const getByProjectAndUser = async ( projectId, userId ) => {
  
    try {          
  
     
      const resp = await preproApi.get(`/expense-report-by-project-user/${projectId}/${userId}`);
          
      const { data } = resp;   
  
      if(data.ok){        
     
        return {ok:true,data:data.data}; 
  
      }else{      
  
        return {ok:false,error:data.data};
  
      }
      
    } catch (error) {
  
      console.error("Error getRquests: ", error);
      if(error?.response?.status == 401){
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }
      return {ok:false,error:'Falló la carga rendiciones'}; 
    }

}
  
export const getDetailByDates= async ( requestParams ) => {  
  
    try {      
           
  
      const {data} = await preproApi.get(`/expense-report-detail-by-group?project_id=${requestParams.project_id}&start_date=${requestParams.startDate}&end_date=${requestParams.endDate}`);
          
      return {ok:true,data};
      
    } catch (error) {   
  
      if(error?.response?.status == 401){
  
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }
  
      return {ok:false,error:'Falló la carga de detalles de rendiciones'};
      
    }

}