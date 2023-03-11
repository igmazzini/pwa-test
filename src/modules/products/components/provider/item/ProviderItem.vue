<template>
  <div v-if="provider" class="provider-item" >
    <div class="provider-item--info">
             
        <p class="provider-name">{{ provider.company_name }}</p>  
        
        <p class="provider-info">Telefono: {{ provider.extra_data.phone }}</p>   
        <p class="provider-info">Email: {{ provider.extra_data.email }}</p>   
        <p class="provider-info">Dirección: {{ provider.extra_data.address }}</p>
            
           
         
      
    </div>
    <div class="provider-item--action">
      <button @click="onEdit" class="provider-item--action---button">
          <font-awesome-icon  icon="fa-solid fa-pencil" />
      </button>
      <button @click="onDelete" class="provider-item--action---button">
          <font-awesome-icon icon="fa-solid fa-ban" />
      </button>
      
      
    </div>   
  </div>
</template>

<script>


export default {
  name:'ProviderItem',
  emits:[
    'on-edit',
    'on-delete',
  ],
  props:{
    provider:{
      type:Object,
      default: ()=>{
        
        return {
          company_name:'provider name',
          extra_data:{
            cuil:'Sarasa',
            cbu:'Sarasa',
            ibb:'Sarasa',
            email:'Sarasa',
            phone:'Sarasa',
            address:'Sarasa',
          },         
          date_created: '00/00/00',        
          
        }
      }
    }
  },
  setup(props, context){

    const onEdit = () =>{
      context.emit('on-edit',props.provider.company_id);
    }
    const onDelete = () =>{
      context.emit('on-delete',props.provider.company_id);
    }
    
    return{
      onEdit,
      onDelete,     
    }
  }

}
</script>

<style lang="scss" scoped>

 .provider-item{

    width: 95%;   
    background-color: var(--light-background-color);
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    display: grid;
    grid-template-columns: 1fr 10%;
    padding:15px;
    margin-bottom: 20px;
    transition: all var(--animation-duration) var(--animation-type);
 }

 .provider-item--info{
    display: grid;   
    grid-template-rows: 1fr 25%;
    align-items: center;
   
    transition: all var(--animation-duration) var(--animation-type);

    p{
      margin: 0;
      padding: 0;
      font-family: RobotoLight;
      font-size: 1em;     
      transition: all var(--animation-duration) var(--animation-type);
      
    }

    .provider-name{
        font-size: 1.3em;
        color: var(--light-text-color);
        margin-bottom: 0;
    }

    .provider-info{
      font-size: 1em;   
         
      color: var(--ligth-subtitle-color);
    }

    .provider-date{
      color: var(--ligth-subtitle-color);
      font-size: 0.9em;
    }   
 }



 .provider-item--action{
    display: flex;
    align-items: center;
    justify-content: space-around;
 }

 .provider-item--action---button{

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

 .provider-item--action---button:hover{
  background-color: var(--button-active-color-light);
 }

 .dark .provider-item{
   background-color: var(--dark-background-color);
   border: 1px solid rgba(247, 243, 243, 0.2);
 }
 
 .dark  .provider-item--action---button{
    color: var(--dark-text-color);
 }
 .dark .provider-item--info .provider-name{
  color: var(--dark-text-color);
 }

.dark .provider-item--info .provider-info{
  color: var(--dark-subtitle-color);
}

.dark .provider-item--action---button:hover{
  
  color: var(--light-text-color);
}

</style>