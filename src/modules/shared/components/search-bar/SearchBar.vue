<script src="./Search.js"></script>
<template>
  <div class="search-container">
    <font-awesome-icon class="search-icon" icon="fa-solid fa-magnifying-glass" />   
    <font-awesome-icon v-show="searchText != ''" @click.stop="onClear" class="close-icon" icon="fa-solid fa-xmark" />
    <input v-on:keyup.enter="onSearch" placeholder="Buscar" ref="searchInput" v-model="searchText" @click="onSearchInputClick" @blur="onSearchInputBlur" :class="['search-input', (showMenu)? 'search-input-menu-open' : '']" type="text">
    <div @click="onSearchTap" class="search-mobile-click"></div>
    <div v-show="showMenu" :class="['search-menu',(searchFilters.length == 0) ? 'not-filters' : '']">
        <div v-show="searchFilters.length > 0" class="search-filters">
            <span v-for="filter of searchFilters" :key="filter" @click="onFilterClick(filter)" :class="['filter',(currentFilter == filter) ? 'active-filter' : '']">{{filter}}</span>
        </div>
        <div :class="['search-sugestions']">
            <template v-if="showHistory">
                <div v-for="(history,index) of searchHistory" :key="index" @click="onHistoryClick(history)" class="sugestion"><font-awesome-icon class="sugestion-icon" icon="fa-solid fa-clock-rotate-left" /><p>{{history}}</p><font-awesome-icon @click.stop="onHistoryDelete(index)" class="sugestion-close-icon" icon="fa-solid fa-xmark" /></div>
            </template>
            <template v-if="!showHistory">
                <OrderResults v-if="target == 'orders'" @on-select-result="onSelectOrderResult"/>               
                <ExpenseReportResults v-if="target == 'cashYields'" @on-select-result="onSelectCashYieldResult"/>               
                <MoneyOrderedResults v-if="target == 'cashRequests'" @on-select-result="onSelectCashRequestResult"/>               
                <MoneyAssignedResults v-if="target == 'cashDeliverys'" @on-select-result="onSelectCashDeliveryResult"/>               
            </template>
        </div>
    </div>
   
  </div>
</template>



<style lang="scss" scoped>

  @import "./search.scss";


</style>


