<template>
 
   <TabNav :tabs="['Efectivo']" @on-selected-tab="setTab" :selected="0" >
    
                
            <template v-if="!addNewRequest">


                <CashFlowDash  :withOrder="false" @on-add-new="onNewCashflow"  v-if="selectedTab == 0" />
                    
                <CashFlowDash  :withOrder="true" @on-add-new="onNewCashflow"  v-if="selectedTab == 1" />
            
                
                    
            </template>
            
           
        

    </TabNav>
  
</template>

<script>

import {  ref } from 'vue';
import { useRouter } from 'vue-router';

import {TabNav} from '@/modules/shared/components';
import CashFlowDash from '@/modules/projects/components/cash-flow/dashboard/CashFlowDash.vue';
import { useUI } from '@/modules/shared/composables'; 
import { useProject } from '@/modules/projects/composables';


export default {
    name:'CashFlowView',
    components:{
        TabNav,
        CashFlowDash,
      
        
    },
    setup(){

        
       
        const router = useRouter();
        const { currentProject } = useProject();
        const {  setTitle, setArrowCallback ,substring} = useUI();
       
        const selectedTab = ref(0);       
        const addNewRequest = ref(false);
      

        if(currentProject.value == null){
            router.replace({ name: "projects-page"});
            return;
        }       

        
        setTitle(`Rendiciones - ${substring(currentProject.value.project_name,15)}`);       


      

        const setTab =  ( tab ) =>{            
            selectedTab.value = tab;
        }

        const goBack = () =>{
            router.go(-1);
        }

        const onNewCashflow  = () =>{
           

            setArrowCallback(()=>{               

                setArrowCallback(goBack);
            });

            router.push({ name: "new-cashflow-page"});
           
        }   
        
        const onNewRequestAdded = () =>{
            
            addNewRequest.value = false;            
           
            setArrowCallback(()=>{     
                setArrowCallback(goBack);
            })

           
        }

      

      

        return{
            selectedTab,           
            addNewRequest,           
            setTab,
            onNewCashflow,
            onNewRequestAdded,
         
            
           
        }
    }

}
</script>

<style lang="scss" scoped>
.tab-nav-container{
    font-size: 1.2em;
}
</style>