<script src='./SearchMobile.js'></script>

<template>
 <div class="search-mobile-container">
        <div class="search-mobile-bar">
         <font-awesome-icon icon="fa-solid fa-chevron-left" @click="onCancel"/>  
         <p>{{title}}</p>
        </div>
        <div class="search-mobile-input">
            <font-awesome-icon class="search-icon" icon="fa-solid fa-magnifying-glass" /> 
            <input ref="searchInput" v-model="searchText"  placeholder="Buscar..." type="text" inputmode="text">
        </div>
        
        <div :class="['search-mobile-list',(openKeyboard) ? 'open-keyboard' : '']">
          <ExpenseReportResults v-if="target === 'cashYields'" @on-select-result="onSelectResult"/>
          <OrderResults v-if="target === 'orders'" @on-select-result="onSelectResult"/>    
          <MoneyOrderedResults v-if="target == 'cashRequests'" @on-select-result="onSelectResult"/>               
          <MoneyAssignedResults v-if="target == 'cashDeliverys'" @on-select-result="onSelectResult"/>        
        </div> 
       
    </div>
  
</template>


<style lang="scss" scoped >
  @import "./search-mobile.scss";
</style>