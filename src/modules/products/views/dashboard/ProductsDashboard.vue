<template>
  <div class="products">
   
    <div class="products-breadcrumbs">
      <Breadcrumbs />
    </div>
    <div class="products-container">
      <div class="product-card">
        <p class="product-card--title">Items</p>
        <div class="product-card--actions">
          <button class="cta-button" @click="onNewProduct">
            <font-awesome-icon
              class="cta-button--icon"
              icon="fa-solid fa-plus"
            />Agregar
          </button>
          <button class="cta-button search-button" @click="goTo('items')">
            <font-awesome-icon
              class="cta-button--icon"
              icon="fa-solid fa-magnifying-glass"
            />Buscar
          </button>
        </div>
      </div>
      <div class="product-card">
        <p class="product-card--title">Rubros</p>
        <div class="product-card--actions">
          <button class="cta-button" @click="onNewCategory">
            <font-awesome-icon
              class="cta-button--icon"
              icon="fa-solid fa-plus"
            />Agregar
          </button>         
          <button class="cta-button search-button" @click="goTo('categories')">
            <font-awesome-icon
              class="cta-button--icon"
              icon="fa-solid fa-magnifying-glass"
            />Buscar
          </button>
        </div>
      </div>
      <div class="product-card">
        <p class="product-card--title">Categorias</p>
        <div class="product-card--actions">
          <button class="cta-button" @click="onNewGroup">
            <font-awesome-icon
              class="cta-button--icon"
              icon="fa-solid fa-plus"
            />Agregar</button>         
          <button class="cta-button search-button" @click="goTo('category-groups')">
            <font-awesome-icon
              class="cta-button--icon"
              icon="fa-solid fa-magnifying-glass"
            />Buscar
          </button>
        </div>
      </div>
      <div class="product-card">
        <p class="product-card--title">Proveedores</p>
        <div class="product-card--actions">
          <button class="cta-button" @click="onNewProvider">
            <font-awesome-icon
              class="cta-button--icon"
              icon="fa-solid fa-plus"
            />Agregar
          </button>
          <button class="cta-button search-button" @click="goTo('providers')">
            <font-awesome-icon
              class="cta-button--icon"
              icon="fa-solid fa-magnifying-glass"
            />Buscar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>



import { useRouter } from "vue-router";
import {Breadcrumbs } from '@/modules/shared/components';

import { useUI, useModal} from '@/modules/shared/composables';
import { useProducts, useCategories,useCategoriesGroups, useProviders  } from '@/modules/products/composables';


export default {
  name: "Products",
  components: {
    Breadcrumbs,
   
  },

  setup() {
   
    const { setTitle,setTitleCallBack} = useUI();
    const { showModal, hideModal } = useModal();
    const { uploadProduct } = useProducts();
    const { uploadCategory } = useCategories();
    const { uploadCategoryGroup } = useCategoriesGroups();
    const { uploadProvider } = useProviders();
    const router = useRouter();

   
    setTitleCallBack(null);
    
    setTitle('Productos');

    const onFinishMutation = ( result ) =>{

      if(result){

        hideModal();

      }
    }

    const onNewProduct = () => {
     
      showModal('Product',onNewProductAccept,onNewProductCancel );
    };

    const onNewProductAccept = async (productData) => {
     
      uploadProduct(productData, onFinishMutation);

     
    };

    const onNewProductCancel = () => {
      hideModal();
    };

    const onNewCategory = () => {
     
      showModal('Category',onNewCategoryAccept,onNewCategoryCancel );
    };

    const onNewCategoryAccept = async (categoryData) => {    

      uploadCategory(categoryData, onFinishMutation);     

      
    };

    const onNewCategoryCancel = () => {
      hideModal();
    };

    const onNewGroup = () => {
      showModal('CategoryGroup',onNewGroupAccept,onNewGroupCancel );
    };

    const onNewGroupAccept = async (groupData) => {
     
      uploadCategoryGroup(groupData, onFinishMutation);     
      
    };

    const onNewGroupCancel = () => {
     hideModal();
    };
    
    const onNewProvider= () => {
      showModal('Provider',onNewProviderAccept,onNewProviderCancel );
      
    };

    const onNewProviderAccept = async (providerData) => {    
     
      uploadProvider(providerData, onFinishMutation);

    
    };

    const onNewProviderCancel = () => {
      hideModal();
    };

    const goTo = (name) => {
        switch (name) {
          case "items":
            router.push({ name: "products-view" });
            break;

          case "providers":
            router.push({ name: "providers-view" });
            break;

          case "categories":
            router.push({ name: "categories-view" });
            break;
          case "category-groups":
            router.push({ name: "category-groups-view" });
            break;

          default:
            break;
        }
      }


  
    return {
      router,
     
     
  
     
      onNewProduct,
    
      onNewCategory,
    
      onNewGroup,
    
      onNewProvider,
    
      goTo
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./products-dashboard.scss";
</style>