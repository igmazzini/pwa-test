

<script src="./OrdersHistoryView.js"></script>
<template>
  <div v-if="currentProject" class="orders-history">  
   
    <div v-if="!mobile" class="orders-history-breadcrumbs">
      <Breadcrumbs :oBreadcrumbs="breadcrumbs"  />
    </div>
    <OrdersHistory :projectId="currentProject.project_id"/>

  </div>
</template>


<style lang="scss" scoped>
.orders-history{   
    width: 100%;
    height: 100%;   
    display: grid;
    grid-template-rows: 5% 1fr;
}

.orders-history-breadcrumbs{    
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

@media screen and (max-width:1300px){
  .orders-history{  
    grid-template-rows:1fr;
   }
}
</style>