 
import preproApi from '@/api/preproApi';

export const getCategories = async () => {

    try {
  
      const { data } = await  preproApi.get('/categories');      
         
  
      return {ok:true, data};
      
    } catch (error) {
  
      console.error("Error getting categories: ", error);
  
      if(error.response.status == 401){
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }
     
  
      return {ok:false, error:'Falló la carga de rubros'};
    }
  }  

  
  export const upload = async ( category ) => {
  
    try {  
      
      const params = {
        category_name:category.category_name,     
        category_code:category.category_code,           
        group_id:category.group_id,           
        status:category.status,           
      }
         
      const { data } = await  preproApi.post('/categories/',params);    
     
  
      return {ok:true, data};   
    
  
    } catch (error) {
  
      console.error("Error adding category: ", error);
  
      if(error?.response?.status == 401){
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }
      
  
      return {ok:false, error:'No se pudo cargar el rubro'};
    }
  }
  
  export const update = async (category)  => {
   
  
    try {
      
      const params = {
        category_name:category.category_name,     
        category_code:category.category_code,    
        group_id:category.group_id,  
        status:category.status,         
      }
         
      const { data } = await  preproApi.put(`/categories/${category.category_id}/`,params);    
     
  
      return {ok:true,data};   
  
    } catch (error) {
  
      console.error("Error updating category: ", error);
  
      if(error.response.status == 401){
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }
  
      
      return {ok:false, error:'No se pudo actualizar el rubro'};
  
    }
   
  }
  
  export const annulate = async (categoryId) => {
  
    try {
  
      const { data } = await preproApi.delete(`/categories/${categoryId}/`); 
  
      return {ok:true, data }
  
    } catch (error) {
  
      console.error("Error deleting category: ", error);
  
      if(error.response.status == 401){
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }
     
  
      return {ok:false, error:'No se pudo anular el rubro'};
    }
    
  }