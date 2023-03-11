<template>
    <div class="projects-list--card">
        
        <div class="projects-list--card---name">
            <div class="project--name-circle"></div>
            <div>
                <p>{{project.project_name}}</p>
                <p class="project-status">{{project.project_code}}</p>
                <p class="project-status">{{getProjectStatus(project.status)}}</p>
            </div>
           
            <font-awesome-icon class="marker" icon="fa-solid fa-bookmark" />
        </div>
        <div class="projects-list--card---info">
            <div class="projects-list--card---info----date">
                <p>Inicio</p>
                <p>{{formatDate(project.date_initial)}}</p>
               
            </div>
            <div class="projects-list--card---info----date">
                <p>Fin</p>
                <p>{{formatDate(project.date_final)}}</p>
            </div>
            <div class="projects-list--card---info----days">
                <p>Dias de rodaje</p>
                <p>{{getShootingDays(project)}}</p>
            </div>
        </div>

    </div>
</template>

<script>

import { formatDate } from '@/helpers/utils';
import { useProject } from '@/modules/projects/composables';

export default {
    name:'ProjectCard',
    props:{
       project: {
            type: Object,
            default: () => {


                return {
                    project_name:'Nombre del proyecto',
                    date_initial:'00/00/00',
                    date_final:'00/00/00',
                    extra_Data:{},
                    budget:100
                    }
            },
       },    
    },
    setup(){

        const { getProjectStatus } = useProject()
      
        const getBudgetPercent = ( budget) =>{
           
            return `${budget.amount_executed * 100 / budget.amount_budget}%`;
        }


        const getShootingDays = ( project ) => {

           
            /* const initialDate = new Date(project.date_initial);
            const finalDate = new Date(project.date_final);          

            let difference = initialDate.getTime() - finalDate.getTime();
              
            let totalDays = Math.ceil(difference / (1000 * 3600 * 24)) * -1; 
              */
            return project.extra_data?.shooting_days?.length;  
            
        }       


        return{
            formatDate,
            getProjectStatus,
            getBudgetPercent,
            getShootingDays
        }
    }

}
</script>

<style lang="scss" scoped>
@import "./project-card.scss";


</style>