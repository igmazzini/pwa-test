<template>
   <div class="categories-history">  
   
    <div class="categories-history-breadcrumbs">
       <Breadcrumbs/> 
    </div>
    <div :class="['categories-history-list',(categories.lenght == 0) ? 'categories-history-list-not-categories' : '']" >
        <p v-if="categories.lenght == 0" class="empty-categories">No hay rubros</p>
        <CategoryItem v-for="category of categories" :category="category" :key="category" @on-delete="onCategoryDelete" @on-edit="onCategoryEdit"/>      
    </div>
    <div class="categories-history-actions">
      <button @click="onNewCategory" class="cta-button"><font-awesome-icon icon="fa-solid fa-plus" /> <p>Nuevo rubro</p></button>
    </div>
   </div>
</template>

<script>
import { ref } from 'vue';
import {Breadcrumbs } from '@/modules/shared/components';
import {CategoryItem} from '@/modules/products/components';
import { useCategories } from '@/modules/products/composables';
import { useUI, useModal } from '@/modules/shared/composables';




export default {
    name:'CategoriesView',
    components:{
        Breadcrumbs,
        CategoryItem,       
    },
    setup(){

        
        const { setTitle } = useUI();  
        const { showModal, hideModal, showConfirmation, hideConfirmation } = useModal();
        const { categories,  uploadCategory, updateCategory, deleteCategory} = useCategories();   
       
       
       
        const updateCategoryRef = ref(null);   
        const deleteCategoryRef = ref(null);   
        const deleteCategoryInfo = ref({
            title:'Anular rubro',
            text:'¿Desea anular este rubro?',
            info:'',
            type:'delete'

        }); 
        
        
        setTitle('Rubros');    


        const onFinishMutation = ( result ) =>{

            if(result){
                updateCategoryRef.value = null; 
                hideModal();
                hideConfirmation();
            }
        }


        const onNewCategory = () =>{
          
            showModal('Category',onNewCategoryAccept,onNewCategoryCancel, null );
        }

        const onNewCategoryAccept = async ( categoryData, update ) => {      

                      
           
            
            if(!update){
                
                uploadCategory(categoryData, onFinishMutation);               

            }else{

                categoryData.category_id = updateCategoryRef.value.category_id; 
                
                updateCategory(categoryData, onFinishMutation);

               
            }           

           

        }


        const onNewCategoryCancel = () =>{
          
            updateCategoryRef.value = null;
            hideModal();
        }

        const onCategoryEdit = ( id ) =>{
            
            updateCategoryRef.value = categories.value.find( (cat)=> cat.category_id == id);

            showModal('Category',onNewCategoryAccept,onNewCategoryCancel, updateCategoryRef.value  );
        }
        const onCategoryDelete = async ( id ) =>{

            deleteCategoryRef.value = categories.value.find( (cat)=> cat.category_id == id);          

            deleteCategoryInfo.value.info = `${deleteCategoryRef.value.category_name}`;

            showConfirmation(onConfirmDelete,onCancelDelete, deleteCategoryInfo.value);

          

        }

        const onConfirmDelete = async () =>{           

            deleteCategory(deleteCategoryRef.value.category_id,onFinishMutation);           
        }
        const onCancelDelete = () =>{
           hideConfirmation()
        }


       

        return{
            categories,         
          
            updateCategoryRef,            
            onNewCategory,          
            onCategoryEdit,
            onCategoryDelete,
            
        }
    }

}
</script>

<style lang="scss" scoped>
@import "./categories-view.scss";
</style>