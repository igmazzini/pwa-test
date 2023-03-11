<template>
 
  <div v-if="currentProject" class="project-detail">

    <div v-if="!mobile" class="project-detail-breadcrumbs">
       <Breadcrumbs :oBreadcrumbs="breadcrumbs"/> 
    </div>
    <div class="project-detail-info">
      <template v-if="!mobile">
        <ProjectInfo :project="currentProject"/>
        <Budget  :title="'Presupuesto inicial'" :budgetType="'initial'"/>
        <Budget :title="'Actual'" :budgetType="'used'"/>
        <Budget :title="(currentProjectBudget?.available_balance > 0) ? 'Disponible' : 'Diferencia'" :budgetType="'available'"/>
        <div class="project-tabs" >
        <TabNav :tabs="['Bandeja de entrada','Ordenes','Efectivo en circulación']" @on-selected-tab="setTab"  >
          
          <Inbox  :projectId="currentProject.project_id"  v-if="(currentTab == 0)" :class="['animate__animated animate__slideInRight']" />
          
          <OrdersTab  :projectId="currentProject.project_id"  v-if="(currentTab == 1)" :class="['animate__animated',(previousTab == 2) ? 'animate__slideInRight' : 'animate__slideInLeft']" @add-new-order="onAddNewOrder"  @search-orders="onSearchOrders" @search-by-category="onSearchByCategory"/>
                
          <CashTab  v-if="(currentTab == 2)" :class="['animate__animated animate__slideInLeft']" @add-money-ordered="onAddMoneyOrdered" @add-money-assigned="onAddMoneyAssigned" @add-expense-report="onAddExpenseReport" @search-request="onSearchRequests"/> 
            
        </TabNav>
        </div>
      
        
        <ProjectStatistics/>
      </template>
      <template v-if="mobile">
        <div @click="onCashFlow" class="project-detail-info-button">
          <font-awesome-icon icon="fa-solid fa-hand-holding-dollar" />
          <p>Efectivo</p>
        </div>
        <div @click="onOrders" class="project-detail-info-button">
          <font-awesome-icon icon="fa-solid fa-list-check" />
          <p>Ordenes</p>
        </div>
       
      </template>
    </div>
  </div>
</template>

<script>
import { ref} from 'vue';
import { useRouter } from 'vue-router';

import ProjectInfo from '@/modules/projects/components/project/info/ProjectInfo.vue';
import Budget from '@/modules/projects/components/project/budget/Budget.vue';
import OrdersTab from '@/modules/projects/components/orders/orders-tab/OrdersTab.vue';
import CashTab from '@/modules/projects/components/cash-flow/cash-tab/CashTab.vue';
import ProjectStatistics from '@/modules/projects/components/project/statistics/ProjectStatistics.vue';
import {Breadcrumbs, TabNav} from '@/modules/shared/components';
import Inbox from '@/modules/projects/components/Inbox/Inbox.vue';
import { useUI, useModal } from '@/modules/shared/composables'; 
import { useOrders, useProject, useMoneyOrdered, useMoneyAssigned, useExpenseReports }  from '@/modules/projects/composables';





export default {
  name: "ProjectDetailsView",
  components:{
    ProjectInfo,
    Budget,
    OrdersTab,
    CashTab,
    ProjectStatistics,
    Breadcrumbs,   
    TabNav,
    Inbox
    
  },
 
  setup() {

   
    const router = useRouter();   
    const { mobile, setTitle } = useUI();
    const { showModal, hideModal} = useModal();
    const { currentProject, currentProjectBudget} = useProject();
    const { uploadMoneyOrdered } = useMoneyOrdered(currentProject.value?.project_id);
    const { uploadMoneyAssigned } = useMoneyAssigned(currentProject.value?.project_id);    
    const { uploadExpenseReport } = useExpenseReports(currentProject.value?.project_id);    
    const {  uploadOrder  } = useOrders(currentProject.value?.project_id);

   
    
    const currentTab  = ref(0);
    const previousTab  = ref(0);
    const breadcrumbs = ref([]);
   
    
   

    if(!currentProject.value){
      router.replace({ name: "projects-page"});
      return;
    }
    
   

    router.replace({query: {p:currentProject.value?.project_id}});

   

    breadcrumbs.value = [
      {label:'Proyectos',url:'projects-page'},
      {label:currentProject.value.project_name,url:'project'},      
    ];

    
   
    setTitle(currentProject.value.project_name)

   
    const onFinishMutation = ( result ) =>{

      if( result ){

        hideModal();
       
      }
    }
    

    const onOrdersTap = () =>{
       router.push({name:'orders-page'})    
    };

   
    
    const onNewOrderAccept = async ( orderData ) => {    

      uploadOrder(orderData, onFinishMutation);   

     

    }

    const onNewOrderCancel = () => {
      hideModal();      
    }
    
    const onNewMoneyAssignedAccept = async ( data ) => {   

     
      uploadMoneyAssigned(data, onFinishMutation);
      
     
      
    }
    const onNewMoneyAssignedCancel = () => {
      hideModal();
     
    }

    const onNewMoneyOrderedAccept = async ( data ) => {   

     
      uploadMoneyOrdered(data, onFinishMutation);
      
     
      
    }
   
    const onNewMoneyOrderedCancel = () => {
     
      hideModal();
    }

    const onNewExpenseReportAccept = async ( data ) => {         
     
     
      uploadExpenseReport(data, onFinishMutation);



    }
    const onNewExpenseReportCancel = async (  ) => {   


      hideModal();

    }
   
    const onAddNewOrder = () =>{

      showModal('NewOrder', onNewOrderAccept, onNewOrderCancel);
     
    }
    const onAddMoneyAssigned = () =>{

     
      showModal('MoneyAssigned', onNewMoneyAssignedAccept,onNewMoneyAssignedCancel);
      
    }
    const onAddMoneyOrdered = () =>{

      showModal('MoneyOrdered',onNewMoneyOrderedAccept,onNewMoneyOrderedCancel);
     
    }
    const onAddExpenseReport = () =>{

      showModal('ExpenseReport', onNewExpenseReportAccept, onNewExpenseReportCancel);
      
    }

    const onSearchOrders = () =>{       

      router.push({name: 'orders-history-page'});

    }
    const onSearchByCategory = ( category) =>{  

      router.push({name: 'orders-history-page', params: { category }});

    }
    const onSearchRequests = () =>{

      router.push({name: 'cashflow-history-page'});
      
    }


    const setTab =  ( {currentIndex, previousIndex} ) =>{     

      previousTab.value = previousIndex;
      currentTab.value = currentIndex;
      
    }
  


    const onCashFlow = () =>{
      router.push({name:'cashflow-page'})
    }
    const onOrders = () =>{
      router.push({name:'orders-page'})
    }

   
     

    return{
      router,
      mobile,   
      breadcrumbs,      

      
      currentProject,
      currentProjectBudget,
      currentTab,
      previousTab,
      onOrdersTap,     
      onAddNewOrder,
      onSearchOrders,
      onSearchByCategory,
      onAddMoneyOrdered,  
      onAddMoneyAssigned,
      onAddExpenseReport,
      onSearchRequests,
      onNewOrderAccept,
      onNewOrderCancel,
      onNewMoneyAssignedAccept,
      onNewMoneyAssignedCancel,
      onNewMoneyOrderedAccept,
      onNewMoneyOrderedCancel,
      onNewExpenseReportAccept,
      onNewExpenseReportCancel,
      setTab,
      onCashFlow,
      onOrders
    
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./project-details.scss";

</style>