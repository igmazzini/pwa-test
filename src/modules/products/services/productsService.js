
import preproApi from '@/api/preproApi'



/* PRODUCTS */

export const getProducts = async () => {

    try {
       
      const { data } = await  preproApi.get('/products');       
  
      return {ok:true,data};
      
    } catch (error) {

      if(error.response.status == 401){
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }
      console.error("Error getting products: ", error);

      return {ok:false, error:'Falló la carga de productos'};
    }
}


export const upload = async ( product ) => {

    try {  

      const params = {
        product_name:product.product_name,
        category_id:product.category_id,
        category_code:product.category_code,        
        status:product.status,
        
      }
     
         
      const { data } = await  preproApi.post('/products/',params);    
      
      
      return {ok:true,data};
  
    } catch (error) {

      console.error("Error adding product: ", error);

      if(error.response.status == 401){
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }
     
      return {ok:false, error:'No se pudo cargar el producto'};
    }
}  

export const update = async (product)  => {
 

    try {
      
      const params = {
        product_name:product.product_name,
        category_id:product.category_id,
        category_code:product.category_code,
        product_code:product.product_code,
        status:product.status,
        
      }     
         
      const { data } = await  preproApi.put(`/products/${product.product_id}/`,params);    
     
  
      return {ok:true, data};
  
    } catch (error) {

      console.error("Error updating product: ", error);

      if(error.response.status == 401){
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }
      

      return {ok:false, error:'No se pudo actualizar el producto'};
  
    }
   
}

export const annulate = async (productId) => {

    try {

      const {data} = await  preproApi.delete(`/products/${productId}/`);  
      
      return {ok:true, data}
  
    } catch (error) {

      console.error("Error deleting product: ", error);

      if(error.response.status == 401){

        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }
      

      return {ok:false, error:'No se pudo anular el producto'};
    }
    
}


  /* CATEGORIES */
 
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

export const getCategoryByCode = async (code) => {

  try {   
    
    const { data } = await  preproApi.get(`/categories/check-code/${code}/`);           
         
    return {ok:true, data}   
  
   
  } catch (error) {

    console.error("Error getCategoryByCode : ", error);

    if(error.response.status == 401){
      return {ok:false,error:'Token vencido', status:error?.response?.status};
    }

    
    return {ok:false, error:'Falló la carga de rubro por codigo'};

  }

}

export const uploadCategory = async ( category ) => {

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

export const updateCategory = async (category)  => {
 

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

export const deleteCategory = async (category) => {

  try {

    const { data } = await preproApi.delete(`/categories/${category.category_id}/`); 

    return {ok:true, data }

  } catch (error) {

    console.error("Error deleting category: ", error);

    if(error.response.status == 401){
      return {ok:false,error:'Token vencido', status:error?.response?.status};
    }
   

    return {ok:false, error:'No se pudo anular el rubro'};
  }
  
}

/* CATEGORY GROUPS */

export const getCategoryGroups = async () => {

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

export const uploadCategoryGroup = async ( group ) => {

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

export const updateCategoryGroup = async (group)  => {
 
  console.log('updateCategoryGroup', group)
  try {
    
    const params = {
      group_name:group.group_name,                  
      status:group.status,           
    }
       
    const { data } = await  preproApi.put(`/category-group/${group.group_id}/`,params);    
   

    return {ok:true,data};   

  } catch (error) {

    console.error("Error updating group: ", error);

    if(error.response.status == 401){
      return {ok:false,error:'Token vencido', status:error?.response?.status};
    }   

    return {ok:false, error:'No se pudo actualizar la categoria'};

  }
 
}

export const deleteCategoryGroup = async (group) => {

  try {

   const {data} = await preproApi.delete(`/category-group/${group.group_id}/`); 

   return {ok:true, data};

  } catch (error) {

    console.error("Error deleting group: ", error);

    if(error.response.status == 401){
      return {ok:false,error:'Token vencido', status:error?.response?.status};
    }
    

    return {ok:false, error:'No se pudo anular la categoria'};
  }
  
}


/* PROVIDERS */

export const getProviders = async () => {

  try {

    const { data } = await  preproApi.get('/providers'); 

    return {ok:true, data};
    
  } catch (error) {

    console.error("Error getting providers: ", error);

    if(error.response.status == 401){
      return {ok:false,error:'Token vencido', status:error?.response?.status};
    }  

    return {ok:false, error:'Falló la carga de proveedores'};
  }
}

export const uploadProvider = async ( provider ) => {

  try {  
       
    
    const params = {
      company_name:provider.company_name,     
      status:provider.status,  
      extra_data:[
        {key:'cuil', value:provider.cuil ? provider.cuil : ''},
        {key:'cbu', value:provider.cbu ? provider.cbu : ''},
        {key:'iibb', value:provider.iibb ? provider.iibb : ''},
        {key:'email', value:provider.email ? provider.email : ''},
        {key:'phone', value:provider.phone ? provider.phone : ''},
        {key:'address', value:provider.address ? provider.address : ''},
        
      ]   
          
    }
       
    const { data } = await  preproApi.post('/providers/',params);    
   

    return {ok:true,data};   

  } catch (error) {

    console.error("Error adding provider: ", error);

    if(error?.response?.status == 401){

      return {ok:false,error:'Token vencido', status:error?.response?.status};
    }
    

    return {ok:false, error:'No se pudo cargar el proveedor'};
  }
}

export const updateProvider = async ( provider )  => {
 

  try {


    const params = {
      company_name:provider.company_name,    
      status:provider.status,  
      extra_data:[
        {key:'cuil', value:provider.cuil ? provider.cuil : ''},
        {key:'cbu', value:provider.cbu ? provider.cbu : ''},
        {key:'iibb', value:provider.iibb ? provider.iibb : ''},
        {key:'email', value:provider.email ? provider.email : ''},
        {key:'phone', value:provider.phone ? provider.phone : ''},
        {key:'address', value:provider.address ? provider.address : ''},
        
      ]             
    }
       
    const { data } = await  preproApi.put(`/providers/${provider.company_id}/`,params);       
    
    
    return {ok:true,data};

  } catch (error) {

    console.error("Error updating provider: ", error);

    if(error.response.status == 401){
      return {ok:false,error:'Token vencido', status:error?.response?.status};
    }    

    return {ok:false, error:'No se pudo actualizar el proveedor'};

  }
 
}

export const deleteProvider = async ( provider ) => {

  try {

    const { data } = await  preproApi.delete(`/providers/${provider.company_id}/`); 

    return {ok:true, data}

  } catch (error) {

    console.error("Error deleting provider: ", error);

    if(error.response.status == 401){
      return {ok:false,error:'Token vencido', status:error?.response?.status};
    }
    
    return {ok:false, error:'No se pudo anular el proveedor'};

  }
  
}