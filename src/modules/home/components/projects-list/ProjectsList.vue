<template>
  <div class="projects">
    <div class="projects-title">
        <p>Proyectos activos</p>
        <router-link to="/projects">Ver todos</router-link>
        
    </div>
    <div  :class="['projects-list',(!projectsQuery.isLoading.value && projects.length == 0) ? 'projects-list-not-projects' : '']">
       <p v-if="!projectsQuery.isLoading.value && projects.length == 0" class="empty-proyects">No hay proyectos</p>
       <template v-if="!projectsQuery.isLoading.value">
        <ProjectCard v-for="project of projects"  :key="project" :project="project" @click="onSelectedProject(project)"/> 
       </template>
       <template v-if="projectsQuery.isLoading.value">
        <ProjectCardSkeleton v-for="i of 3"  :key="i" /> 
       </template>
       
       
    </div>
  </div>
</template>

<script>

import { useRouter } from 'vue-router';
import { useProjects,useProject } from '@/modules/projects/composables';
import { useUI } from '@/modules/shared/composables';
import ProjectCard from '@/modules/home/components/project-card/ProjectCard.vue';
import ProjectCardSkeleton from "@/modules/home/components/project-card/ProjectCardSkeleton.vue";


export default {

    components:{
        ProjectCard,
        ProjectCardSkeleton
    },
    setup(){

      const router = useRouter();    
      const { projects, projectsSerieQuery, projectsQuery } = useProjects();   
      const { setCurrentProject, currentProject  } = useProject();   
      const { setTitleCallBack } = useUI();


       const goToProject = ( ) =>{

        if(currentProject.value){
          router.push({name: 'project-page', params: { projectName: currentProject.value.project_name }});
        }

      }
     

      const onSelectedProject =  (project) =>{   
        
        setCurrentProject(project);   
        
        setTitleCallBack(goToProject);

        router.push({name: 'project-page', params: { projectName:project.project_name,from:'Escritorio/dashboard-page'}});

      }

     

      

      return{
        projects,
        projectsQuery,
        projectsSerieQuery,
      
        onSelectedProject
      }
    }

}
</script>

<style lang="scss" scoped>
@import "./projects-list.scss";


</style>