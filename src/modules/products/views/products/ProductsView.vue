<template>
   <div class="products-history">    

    <div class="products-history-breadcrumbs">
       <Breadcrumbs/> 
    </div>
    <div :class="['products-history-list',(products.lenght == 0) ? 'products-history-list-not-products' : '']" >
        <p v-if="products.lenght == 0" class="empty-products">No hay productos</p>
        <ProductItem v-for="product of products" :product="product" :key="product" @on-delete="onProductDelete" @on-edit="onProductEdit"/>      
    </div>
    <div class="products-history-actions">
      <button @click="onNewProduct" class="cta-button"><font-awesome-icon icon="fa-solid fa-plus" /> <p>Nuevo producto</p></button>
    </div>
   </div>
</template>

<script>
import { ref } from 'vue';
import {Breadcrumbs, } from '@/modules/shared/components';
import {ProductItem, } from '@/modules/products/components';
import { useProducts } from '@/modules/products/composables';
import { useUI, useModal} from '@/modules/shared/composables';




export default {
    name:'ProductsView',
    components:{
        Breadcrumbs,
        ProductItem,
     
    },
    setup(){

       
           
        const { setTitle } = useUI();
        const { showModal, hideModal, showConfirmation, hideConfirmation} = useModal();
        const { products, uploadProduct ,updateProduct, deleteProduct } = useProducts();         
      
        const updateProductRef = ref(null);   
        const deleteProductRef = ref(null);   
        const deleteProductInfo = ref(
            {
                title:'Anular producto',
                text:'¿Desea anular este producto?',
                info:'',
                type:'delete'

            });   


       
        setTitle('Items');  


        const onFinishMutation = ( result ) =>{

            if(result){

                updateProductRef.value = null;            

                hideModal();
                hideConfirmation();
            }
        }

        const onNewProduct = () =>{
           
            showModal('Product',onNewProductAccept, onNewProductCancel, null);
        }

        const onNewProductAccept = async ( productData, update ) => {      
            
           

            if(!update){

                uploadProduct(productData, onFinishMutation);

            }else{                

                productData.product_id = updateProductRef.value.product_id; 
                
               updateProduct(productData, onFinishMutation );               
            }       
          
            
           

        }


        const onNewProductCancel = () =>{

            updateProductRef.value = null;
            hideModal();
        }

        const onProductEdit = ( id ) =>{
            
            updateProductRef.value = products.value.find( (prod)=> prod.product_id == id);

            showModal('Product',onNewProductAccept, onNewProductCancel, updateProductRef.value);
        }
        const onProductDelete = async ( id ) =>{

            deleteProductRef.value = products.value.find( (prod)=> prod.product_id == id);           

            deleteProductInfo.value.info = `${deleteProductRef.value.product_name}`;

            showConfirmation(onConfirmDelete, onCancelDelete,deleteProductInfo.value );

          

        }

        const onConfirmDelete = async () =>{             

            deleteProduct(deleteProductRef.value.product_id,onFinishMutation);       

        }
        const onCancelDelete = () =>{
            hideConfirmation();
        }
      


        return{
            products,
            updateProductRef,
                
         
            onNewProduct,
         
            onProductEdit,
            onProductDelete,
            
        }
    }

}
</script>

<style lang="scss" scoped>
@import "./products-view.scss";
</style>