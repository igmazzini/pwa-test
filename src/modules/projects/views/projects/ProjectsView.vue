<template>
 
  <div class="projects">
   
    <div v-if="!mobile" class="projects-breadcrumbs">
      <Breadcrumbs/>
    </div>
    <div :class="['projects-container',(!projectsQuery.isLoading.value && projects.length == 0) ? 'projects-container-not-projects' : '']">
      <p v-if="(!projectsQuery.isLoading.value && projects.length == 0)" class="empty-proyects">No hay proyectos</p>
      
      <template v-if="!projectsQuery.isLoading.value">
        <ProjectCard v-for="project of projects"  :key="project.project_id" :project="project" @click="onSelectedProject(project)"/> 
      </template>
      
      <template v-if="projectsQuery.isLoading.value">
        <ProjectCardSkeleton v-for="i of 3" :key="i"/>  
      </template>
     
           
    </div> 
    <div v-if="!mobile" class="projects-actions">
      <button @click="onNewProject" class="cta-button"><font-awesome-icon icon="fa-solid fa-plus" /> <p v-if="!mobile">Nuevo proyecto</p></button>
    </div>
  </div>
</template>

<script>



import { useRouter } from "vue-router";


import ProjectCard from '@/modules/home/components/project-card/ProjectCard.vue';
import {Breadcrumbs} from '@/modules/shared/components';

import { useUI, useModal  } from '@/modules/shared/composables'; 
import { useProducts } from '@/modules/products/composables/useProducts';
import { useCategories } from '@/modules/products/composables/useCategories';
import { useProviders } from '@/modules/products/composables/useProviders';
import { useProject } from '@/modules/projects/composables/projects/useProject';
import { useProjects } from '@/modules/projects/composables/projects/useProjects';
import { useProfiles } from '@/modules/profiles/composables';
import ProjectCardSkeleton from "@/modules/home/components/project-card/ProjectCardSkeleton.vue";





export default {
  name: "Projects",
  components: {
  
    ProjectCard,
    Breadcrumbs,
    ProjectCardSkeleton
},
 
  setup() {

      
    const router = useRouter();
    const {  createProject,  projects,projectsQuery , currentSerie} = useProjects();  
    const { setCurrentProject, currentProject } = useProject();  
    const { mobile, setTitle, setTitleCallBack } = useUI();
    const { showModal, hideModal } = useModal();
   
   
 

    setTitleCallBack(null);

    useProducts();
    useCategories();
    useProviders();
    useProfiles();
 
    
    
    setTitle('Proyectos');
     

    const onNewProject  = () => {       
        
        showModal('Project', onNewProjectAccept,onNewProjectCancel,currentSerie.value);
    };

    const onNewProjectCancel = () => {

      hideModal()

    }

    const onFinishMutation = ( result ) =>{
        if(result){
         hideModal();      
        }
    }

    const onNewProjectAccept = async (project) =>  {      
     

      createProject(project, onFinishMutation);    
    
    }   
    
    const goToProject = ( ) =>{

      if(currentProject.value){
        router.push({name: 'project-page', params: { projectName: currentProject.value.project_name }});
      }

    }

    const onSelectedProject =  (project) =>{         
      

      setCurrentProject(project);          
      
      
      setTitleCallBack(goToProject);

      router.push({name: 'project-page', params: { projectName: project.project_name }});
       
    }

    
  

   

    return {
      mobile, 
      projects,     
    
      currentSerie,
      projectsQuery,
      onNewProject,    
      onSelectedProject,
             
    
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./projects.scss";
</style>