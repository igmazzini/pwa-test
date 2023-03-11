<script src="./CashFlowHistoryView.js"></script>
<template>
  <div class="cashflow-history">
    <div v-if="!mobile" class="cashflow-history-breadcrumbs">
      <Breadcrumbs :oBreadcrumbs="breadcrumbs" />
    </div>
    
    <TabNav :tabs="['Rendiciones', 'Solicitudes', 'Asignaciones']" @on-selected-tab="setTab" :selected="currentTab">

      <ExpenseReportHistory   v-if="currentTab == 0" :class="['animate__animated animate__slideInRight']" />
      <MoneyOrderedHistory  v-if="currentTab == 1" :class="['animate__animated animate__slideInRight']" />
      <MoneyAssignedHistory   v-if="currentTab == 2" :class="['animate__animated animate__slideInRight']" />
    </TabNav>


  </div>

</template>


<style lang="scss" scoped>
@import "./cashflow-history.scss";
</style>