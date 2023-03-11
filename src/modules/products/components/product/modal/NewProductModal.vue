<template>

    <div class="modal-layout">
        <div class="modal-title">
            <p>{{title}}</p>
        </div>
        <div class="modal-form">    

            <SelectCategory ref="categorySelect" class="modal-form--select" :label="'Rubro'"  @selected="onCategorySelected"/>            
           
            <Input ref="productNameInput" :label="'Nombre'" :forceValue="productData.product_name" v-model="productData.product_name" />
           
           
        </div>
        <div class="modal-actions">
            <button @click="onCancel" class="modal-actions--cancel">Cancelar</button>
            <button @click="onAccept" class="modal-actions--accept">{{acceptButtonLabel}}</button>
        </div>
    </div>


  
</template>

<script>
import { onMounted, ref } from 'vue';

import {Input } from '@/modules/shared/components';
import {SelectCategory} from '@/modules/products/components';



export default {
    name:'NewProductModal',
    components:{
        Input,
        SelectCategory,       
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

       
       
        const categorySelect = ref(null);

        const selectedOption = ref(null);
        
        const productNameInput = ref(null);
       
        const categoriesOptions = ref([]);

        const title = ref('Nuevo item');

        const acceptButtonLabel = ref('Cargar producto');
       
        const productData = ref({            
            category_id:'',
            product_name:'',   
            category_code:'',   
           
        });     
        

       
        const onCategorySelected = ( option ) =>{
            
           productData.value.category_id = ''; 
           
           if(!option) return;

           productData.value.category_id = option.value;            
           
          
           productData.value.category_code = option.code;           
                 
           
        }
       

        const onCancel = () =>{
            context.emit('on-cancel');
        }

        const onAccept = () =>{

            let errors = false;

            if(productData.value.product_name == ''){
                productNameInput.value.checkError();
                errors = true;
            }

            if(productData.value.category_id == ''){
                categorySelect.value.checkError();
                errors = true;
            }      
           

            if(!errors){

              let update = false;
              
              if(props.payLoad ){
                update = true;
              }

              context.emit('on-accept',productData.value,update);
            }
            
        }

        onMounted( async ()=>{          

           
           
            if(props.payLoad){

                title.value = 'Actualizar producto';

                acceptButtonLabel.value = 'Actualizar';

                const updateProduct = props.payLoad;                      
              

                productData.value.product_name = updateProduct.product_name;
                productData.value.category_id = updateProduct.category?.category_id;
                productData.value.product_code = updateProduct.product_code;
               

                selectedOption.value = {label:updateProduct.category?.category_name,value:updateProduct.category?.category_id};
            }
        });

        return{
            title,
            acceptButtonLabel,
            categorySelect,   
            selectedOption,        
            productNameInput,           
            categoriesOptions,           
            productData,          
            onCategorySelected,            
            onCancel,
            onAccept
        }
    }

}
</script>

<style lang="scss" scoped>
@import "./new-product-modal.scss";
</style>