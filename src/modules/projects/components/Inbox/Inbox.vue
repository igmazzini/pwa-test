<script src='./Inbox.js'></script>
<template>
  <div class="inbox-container">
    <p v-if="(!ordersQuery.isLoading.value && !moneyOrderedQuery.isLoading.value && inboxData.length === 0)" class="empty-orders">No hay pendientes</p>
    <div  class="list-table">
    <div class="list-table-head list-table-row ">
       
        <span class="list-table-item">Tipo</span>
        <span class="list-table-item">Codigo</span>
        <span class="list-table-item">Fecha</span>
        <span class="list-table-item">Fecha de pago</span>
        <span class="list-table-item">Estado</span>
        <span class="list-table-item">Importe</span>
    </div>
    <div class="list-table-body">
       <template v-if="!ordersQuery.isLoading.value && !moneyOrderedQuery.isLoading.value">
        <div class="list-table-row" v-for="data of inboxData" :key="data" @click="onItemClick(data)">            
            <span class="list-table-item">{{ data.type }}</span>
            <span class="list-table-item">{{ data.code }}</span>
            <span class="list-table-item">{{ data.formatDate }}</span>
            <span class="list-table-item">{{ data.datePayment }}</span>
            <span class="list-table-item" :class="data.status.toLowerCase()">{{ data.formatStatus }}</span>
            <span class="list-table-item" >{{ data.amount }} <font-awesome-icon v-if="!data.hasProof && data.status.toLowerCase() == 'paid'" @mouseover="onWarningOver" @mouseout="onWarningOut" icon="fa-solid fa-circle-exclamation" /></span>            
        </div>
      </template>
        <template v-if="ordersQuery.isLoading.value || moneyOrderedQuery.isLoading.value">

          <div class="list-table-row" v-for="i of 5" :key="i" >            
            <span class="list-table-item"><AnimatedPlaceholder :width="'80%'" :height="'10px'" :border-radius="'8px'"/></span>
            <span class="list-table-item"><AnimatedPlaceholder :width="'50%'" :height="'10px'" :border-radius="'8px'"/></span>
            <span class="list-table-item"><AnimatedPlaceholder :width="'60%'" :height="'10px'" :border-radius="'8px'"/></span>
            <span class="list-table-item"><AnimatedPlaceholder :width="'60%'" :height="'10px'" :border-radius="'8px'"/></span>
            <span class="list-table-item" ><AnimatedPlaceholder :width="'60%'" :height="'10px'" :border-radius="'8px'"/></span>
            <span class="list-table-item" ><AnimatedPlaceholder :width="'80%'" :height="'10px'" :border-radius="'8px'"/></span>            
          </div>
        </template>
       
       
        
    </div>
  </div>

  
  </div>
</template>
<style lang="scss" scoped>
@import "./inbox.scss";
</style>