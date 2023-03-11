 
import preproApi from '@/api/preproApi';

export const getCategoriesGroup = async () => {

  try {

    const { data } = await  preproApi.get('/category-group');     
    

    return {ok:true, data};
    
  } catch (error) {

    if(error.response.status == 401){
      return {ok:false,error:'Token vencido', status:error?.response?.status};
    }
    console.error("Error getting category groups: ", error);

    return {ok:false, error:'Falló la carga de categorias'};
  }
}

export const upload = async ( group ) => {

  try {  
    
    const params = {                  
      group_name:group.group_name,                  
      status:group.status,           
    }
       
    const { data } = await  preproApi.post('/category-group/',params);    
   

    return {ok:true,data};   
  

  } catch (error) {

    console.error("Error adding category group: ", error);

    if(error?.response?.status == 401){
      return {ok:false,error:'Token vencido', status:error?.response?.status};
    }   

    return {ok:false, error:'No se pudo agregar la categoria'};
  }
}

export const update = async (group)  => {
 
  
  try {
    
  
       
    const { data } = await  preproApi.put(`/category-group/${group.group_id}/`,group);    
   

    return {ok:true,data};   

  } catch (error) {

    console.error("Error updating group: ", error);

    if(error.response.status == 401){
      return {ok:false,error:'Token vencido', status:error?.response?.status};
    }   

    return {ok:false, error:'No se pudo actualizar la categoria'};

  }
 
}

export const annulate = async (groupId) => {

  try {

   const {data} = await preproApi.delete(`/category-group/${groupId}/`); 

   return {ok:true, data};

  } catch (error) {

    console.error("Error deleting group: ", error);

    if(error.response.status == 401){
      return {ok:false,error:'Token vencido', status:error?.response?.status};
    }
    

    return {ok:false, error:'No se pudo anular la categoria'};
  }
  
}