<template>
  <div v-if="product" class="product-item" >
    <div class="product-item--info">
             
        <p class="product-name">{{product.product_code }} {{ product.product_name }} </p>       
        <p >Rubro: <span>{{ product.category?.category_name }}</span></p>
        <p >Grupo: <span>{{ product.category_group?.group_name }}</span></p>
      
      
    </div>
    <div class="product-item--action">
      <button @click="onEdit" class="product-item--action---button">
          <font-awesome-icon  icon="fa-solid fa-pencil" />
      </button>
      <button @click="onDelete" class="product-item--action---button">
        
          <font-awesome-icon icon="fa-solid fa-ban" />
      </button>
      
      
    </div>   
  </div>
</template>

<script>



export default {
  name:'ProductItem',
  emits:[
    'on-edit',
    'on-delete',
  ],
  props:{
    product:{
      type:Object,
      default: ()=>{
        
        return {
          
          product_name:'product name',
          category_group:{
            category_group_name:'Sarasa'
          },
          category:{
            category_name:'Sarasa'
          },
          date_created: '00/00/00',        
          
        }
      }
    }
  },
  setup(props,context){ 

   

    const onEdit = () =>{
      context.emit('on-edit',props.product.product_id);
    }
    const onDelete = () =>{
      context.emit('on-delete',props.product.product_id);
    }

    return{
     
      onEdit,
      onDelete,
     
    }
  }

}
</script>

<style lang="scss" scoped>

 .product-item{
    width: 95%;
    height: 120px;
    background-color: var(--light-background-color);
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    display: grid;
    grid-template-columns: 1fr 10%;
    padding:15px;
    margin-bottom: 20px;
    transition: all var(--animation-duration) var(--animation-type);
 }

 .product-item--info{
    display: grid;   
    grid-template-rows: 1fr 15%;
    align-items: center;   
    transition: all var(--animation-duration) var(--animation-type);

    p{   
      margin: 0;
      padding: 0;
      font-family: RobotoLight;
      color: var(--light-subtitle-color);
      font-size: 1em;
      transition: all var(--animation-duration) var(--animation-type);
      margin-bottom: 10px;
    }

    .product-name{
      font-size: 1.3em;
      margin-bottom: 0px;
      color: var(--light-text-color);
    }

   

    .product-date{
      
      font-size: 0.9em;      
    }   
 }



 .product-item--action{
    display: flex;
    align-items: center;
    justify-content: space-around;
 }

 .product-item--action---button{

    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    outline: none;
    width: 60px;
    height: 60px;
    border-radius: 60px;
    background-color: transparent;
    color: var(--light-text-color);
    font-size: 1.3em;
    transition: all var(--animation-duration) var(--animation-type); 
 }

 .product-item--action---button:hover{
  background-color: var(--button-active-color-light);
 }

 .dark .product-item{
   background-color: var(--dark-background-color);
   border: 1px solid rgba(247, 243, 243, 0.2);
 }

 .dark  .product-item--action---button{
    color: var(--dark-text-color);
 }

  .dark .product-item--info p{
    color: var(--dark-subtitle-color);
  }
  .dark .product-item--info .product-name{
    color: var(--dark-text-color);
  }

 .dark .product-item--action---button:hover{
   
    color: var(--light-text-color);
 }

</style>