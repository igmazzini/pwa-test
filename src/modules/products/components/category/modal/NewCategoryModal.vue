<template>

    <div class="modal-layout">
        <div class="modal-title">
            <p>{{title}}</p>
        </div>
        <div class="modal-form">    

            <SelectCategoryGroup ref="categoryGroupSelect"  class="modal-form--select" :label="'Categoria'"  @selected="onCategoryGroupSelected"/>            
           
            <Input ref="categoryNameInput" :label="'Nombre'" :forceValue="categoryData.category_name" v-model="categoryData.category_name" />
            <Input ref="categoryCodeInput" :label="'Codigo'" :forceValue="categoryData.category_code" v-model="categoryData.category_code" />
           
           
        </div>
        <div class="modal-actions">
            <button @click="onCancel" class="modal-actions--cancel">Cancelar</button>
            <button @click="onAccept" class="modal-actions--accept">{{acceptButtonLabel}}</button>
        </div>
    </div>


  
</template>

<script>
import { onMounted, ref } from 'vue';


import { Input} from '@/modules/shared/components';

import SelectCategoryGroup from '@/modules/products/components/category-group/select/SelectCategoryGroup.vue';

export default {
    name:'NewCategoryModal',
    components:{
        Input,
        SelectCategoryGroup,       
    },
    emits:[
        'on-cancel',
        'on-accept'
    ],
    props:{
        payLoad:{
            
            default:null
        }
    },
    setup(props,context){       
       

      
       
        const categoryGroupSelect = ref(null);
        
        const categoryNameInput = ref(null);

        const categoryCodeInput = ref(null);

        const selectedOption = ref(null);
       
        const categoryGroups = ref([]);

        const title = ref('Nuevo rubro');

        const acceptButtonLabel = ref('Cargar rubro');
       
        const categoryData = ref({            
            group_id:'',
            category_name:'',               
            category_code:''       
        });  

         

       
        const onCategoryGroupSelected = ( option ) =>{
            
           categoryData.value.group_id = ''; 
           
           if(!option) return;

           categoryData.value.group_id = option.value;
            
           
                 
           
        }
       

        const onCancel = () =>{
            context.emit('on-cancel');
        }

        const onAccept = () =>{

            let errors = false;

            if(categoryData.value.category_name == ''){
                categoryNameInput.value.checkError();
                errors = true;
            }
            if(categoryData.value.category_code == ''){
                categoryCodeInput.value.checkError();
                errors = true;
            }

            if(categoryData.value.group_id == ''){
                categoryGroupSelect.value.checkError();
                errors = true;
            }      
           

            if(!errors){


              let update = false;
              
              if(props.payLoad ){
                update = true;
              }

              context.emit('on-accept',categoryData.value,update);
            }
            
        }


        onMounted( async ()=>{           

            if(props.payLoad){

                title.value = 'Actualizar rubro';

                acceptButtonLabel.value = 'Actualizar';

                const updateCategory = props.payLoad;              

                categoryData.value.category_name = updateCategory.category_name;
                categoryData.value.group_id = updateCategory.category_group.group_id;                
                categoryData.value.category_code = updateCategory.category_code;

                selectedOption.value = {label:updateCategory.category_group.group_name,value:updateCategory.category_group.group_id};
            }
        });

        return{
            title,
            acceptButtonLabel,
            selectedOption,
            categoryGroupSelect,           
            categoryNameInput,    
            categoryCodeInput,       
            categoryGroups,           
            categoryData,  
            onCategoryGroupSelected,            
            onCancel,
            onAccept
        }
    }

}
</script>

<style lang="scss" scoped>
@import "./new-category-modal.scss";
</style>