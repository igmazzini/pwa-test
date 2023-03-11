import ProjectLayout from '@/modules/projects/layout/ProjectLayout.vue'
import ProjectsView from '@/modules/projects/views/projects/ProjectsView.vue'
import ProjectDetailsView from '@/modules/projects/views/projects/project-details/ProjectDetailsView.vue'
import OrdersView from '@/modules/projects/views/orders/panel/OrdersView.vue'
import OrdersHistoryView from '@/modules/projects/views/orders/orders-history/OrdersHistoryView.vue'
import NewOrderView from '@/modules/projects/views/orders/new/NewOrderView.vue'
import PayOrderView from '@/modules/projects/views/orders/pay/PayOrderView.vue'
import CashFlowView from '@/modules/projects/views/cash-flow/panel/CashFlowView.vue'
import CashFlowHistoryView from '@/modules/projects/views/cash-flow/cash-flow-history/CashFlowHistoryView.vue'
import NewCashFlowView from '@/modules/projects/views/cash-flow/new-cash-flow/NewCashFlowView.vue'

export default{
    name:'projects',
    component: ProjectLayout,  
    redirect:{name:'projects-page'},   
    children:[
      {
        path: '',
        name:'projects-page',
        meta: {
          breadcrumbs: [
            {
              label:'Escritorio',
              url:'dashboard-page'
            },
            {
              label:'Proyectos',
              url:'projects-page'
            },
          
          ]
        },
        component: ProjectsView
        },
        {
          path: 'project',
          name:'project-page',
          meta: {
            breadcrumbs: [
              {
                label:'Proyectos',
                url:'projects-page'
              },
              {
                label:'Proyecto',
                url:'project'
              }
            ]
          },
          component: ProjectDetailsView
        },     
                   
        {
          path: 'orders/*',
          name:'orders-page',
          meta: {
            breadcrumbs: [
                          
            
              {
                label:'Ordenes',
                url:'orders-page'
              }
            ]
          },
          component: OrdersView
        },      
        {
          path: 'orders-history/*',
          name:'orders-history-page',
          meta: {
            breadcrumbs: [
                          
            
              {
                label:'Ordenes',
                url:'orders-history-page'
              }
            ]
          },
          component: OrdersHistoryView
        },      
        {
          path: 'new-order/*',
          name:'new-order-page',
          meta: {
            breadcrumbs: [
                          
            
              {
                label:'Nueva orden',
                url:'new-order-page'
              }
            ]
          },
          component: NewOrderView
        },      
        {
          path: 'pay-order/*',
          name:'pay-order-page',
          meta: {
            breadcrumbs: [
                          
            
              {
                label:'Pagar orden',
                url:'pay-order-page'
              }
            ]
          },
          component: PayOrderView
        },      
           
        {
          path: 'cashflow',
          name:'cashflow-page',
          component: CashFlowView
        }, 
        {
          path: 'cashflow-history/*',
          name:'cashflow-history-page',
          component: CashFlowHistoryView
        }, 
        {
          path: 'new-cashflow/*',
          name:'new-cashflow-page',
          component: NewCashFlowView
        }, 
           
           
        
      ]
}