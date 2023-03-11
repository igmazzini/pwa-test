import preproApi from '@/api/preproApi';


/* PROJECTS */

export const getProjects = async () => {    
   
    try {
     
      const resp = await  preproApi.get('/projects');        
     
      const { data } = resp;   

      if(data.ok){        
     
        return {ok:true,data:data.data}; 
  
      }else{      
  
        return {ok:false,error:data.data};
  
      }
      
    } catch (error) {     
      
      console.error("Error getting projects: ", error);

      if(error.response.status == 401){
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }

      return {ok:false, error:'Falló la carga de proyectos',status:error?.response?.status}; 
     
      
    }
}

export const getProjectBudget = async ( projectId ) => {    
   
    try {    
     
      const resp = await  preproApi.get(`/project-budget-detail/${projectId}`);  

      const {data} = resp.data;      
    
      return {ok:true,data};
      
    } catch (error) {     
      
      console.error("Error getting project budget: ", error);

      if(error.response.status == 401){
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }

      return {ok:false, error:'Falló la carga de presupuesto del proyecto'}; 
     
      
    }
}

export const getProjectsSerie = async ( ) => {    
   
    try {    
     
      const resp = await  preproApi.get(`/serie/by-model/Projects`);  

      const {data} = resp.data;      
    
      return {ok:true,data};
      
    } catch (error) {     
      
      console.error("Error getting project serie: ", error);

      if(error.response.status == 401){
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }

      return {ok:false, error:'Falló la carga de serie de los proyectos'}; 
     
      
    }
}

export const addProject = async ( project ) => {
 

    try {           
     
             
        const resp = await  preproApi.post('/projects/create/',project);    
      
        const { data } = resp;   

        if(data.ok){        
       
          return {ok:true,data:data.data}; 
    
        }else{      
    
          return {ok:false,error:data.data};
    
        }
      
  
    } catch (error) {

      console.error("Error adding project: ", error);

      if(error?.response?.status == 401){
        return {ok:false,error:'Token vencido', status:error?.response?.status};
      }
      
      return {ok:false, error:'Falló la carga del proyecto'}; 
    }
}

