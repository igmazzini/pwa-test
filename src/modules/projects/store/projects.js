import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProjectsStore = defineStore('projectsStore', () =>{

    const projects = ref([]);
    const currentProject = ref(null);
    const currentProjectBudget = ref(null);
    const serie = ref(0);

    

    const setProjects = ( val ) =>{
        projects.value = val;
    }

    const setCurrentProject = ( val ) =>{
        currentProject.value = val;        
    }

    const setCurrentProjectBudget = ( val ) =>{
        currentProjectBudget.value = val;
    }

    const setSerie = ( val ) =>{
        serie.value = val;
    }


    return{
        //Properties
        projects,
        serie,
        currentProject,
        currentProjectBudget,

        //Getters


        //Actions
        setProjects,
        setCurrentProject,
        setCurrentProjectBudget,
        setSerie

    }

});