<template>
   <div class="group-history">  
   
    <div class="group-history-breadcrumbs">
       <Breadcrumbs/> 
    </div>
    <div :class="['group-history-list',(groups.lenght == 0) ? 'group-history-list-not-group' : '']" >
        <p v-if="groups.lenght == 0" class="empty-group">No hay categorias</p>
        <CategoryGroupItem v-for="group of groups" :group="group" :key="group" @on-delete="onGroupDelete" @on-edit="onGroupEdit"/>      
    </div>
    <div class="group-history-actions">
      <button @click="onNewGroup" class="cta-button"><font-awesome-icon icon="fa-solid fa-plus" /> <p>Nueva categoria</p></button>
    </div>
   </div>
</template>

<script>


import {  ref } from 'vue';
import {Breadcrumbs} from '@/modules/shared/components';
import { CategoryGroupItem} from '@/modules/products/components';
import { useCategoriesGroups } from '@/modules/products/composables';
import { useUI, useModal } from '@/modules/shared/composables';


export default {
    name:'CategoryGroupView',
    components:{
        Breadcrumbs,
        CategoryGroupItem,       
    },
    setup(){

        
        const { setTitle } = useUI();  
        const { showModal, hideModal, showConfirmation, hideConfirmation } = useModal();
        const { groups, uploadCategoryGroup, updateCategoryGroup, deleteCategoryGroup} = useCategoriesGroups();    
        
      
       
        const updateGroupRef = ref(null);   
        const deleteGroupRef = ref(null);   
       
        const deleteGroupInfo = ref({
            title:'Anular categoria',
            text:'¿Desea anular esta categoria?',
            info:'',
            type:'delete'

        });      
        
        setTitle('Categorias');    


        const onFinishMutation = ( result ) =>{

            if(result){

                hideModal();
                hideConfirmation();
                updateGroupRef.value = null;    
            }
        }


        const onNewGroup = () =>{
            showModal('CategoryGroup',onNewGroupAccept,onNewGroupCancel, null);
        }

        const onNewGroupAccept = async ( groupData, update ) => {      

          
          

            if(!update){

                uploadCategoryGroup(groupData, onFinishMutation);

            }else{

                groupData.group_id = updateGroupRef.value.group_id;                
                
                updateCategoryGroup(groupData, onFinishMutation);

               
            }  
           
           

        }


        const onNewGroupCancel = () =>{
           
            updateGroupRef.value = null;
            hideModal();
        }

        const onGroupEdit = ( id ) =>{
            
            updateGroupRef.value = groups.value.find( (group)=> group.group_id == id);

            showModal('CategoryGroup',onNewGroupAccept,onNewGroupCancel,  updateGroupRef.value);
        }
        const onGroupDelete = async ( id ) =>{

            deleteGroupRef.value = groups.value.find( (group)=> group.group_id == id);        

            deleteGroupInfo.value.info = `${deleteGroupRef.value.group_name}`;

            showConfirmation(onConfirmDelete,onCancelDelete,deleteGroupInfo.value);

        }

        const onConfirmDelete = async () =>{

            deleteCategoryGroup(deleteGroupRef.value.group_id, onFinishMutation); 
          
        }
        const onCancelDelete = () =>{
            hideConfirmation();
        }


       


        return{
            groups,            
            updateGroupRef,
          
            onNewGroup,          
            onGroupEdit,
            onGroupDelete,
         
        }
    }

}
</script>

<style lang="scss" scoped>
@import "./category-groups-view.scss";
</style>