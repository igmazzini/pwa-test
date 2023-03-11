import ProductsLayout from '@/modules/products/layout/ProductsLayout.vue'
import ProductsDashboard from '@/modules/products/views/dashboard/ProductsDashboard.vue'
import ProductsView from '@/modules/products/views/products/ProductsView.vue'
import ProvidersView from '@/modules/products/views/providers/ProvidersView.vue'
import CategoriesView from '@/modules/products/views/categories/CategoriesView.vue'
import CategoryGroupView from '@/modules/products/views/category-group/CategoryGroupView.vue'

export default{
    name:'products',
    component: ProductsLayout,  
    children:[
        {
          path: '',
          name:'products-page',
          meta: {
            breadcrumbs: [
                          
              {
                label:'Escritorio',
                url:'dashboard-page'
              },
              {
                label:'Productos',
                url:'products-page'
              }
            ]
          },
          component: ProductsDashboard
        },
      
        {
          
          path: '',
          name:'products-view',
          meta: {
            breadcrumbs: [
                          
              {
                label:'Productos',
                url:'products-page'
              },
              {
                label:'Items',
                url:'products-view'
              }
            ]
          },
          component: ProductsView
        },
        {
          path: 'providers',
          name:'providers-view',
          meta: {
            breadcrumbs: [
                          
              {
                label:'Productos',
                url:'products-page'
              },
              {
                label:'Proveedores',
                url:'providers-view'
              }
            ]
          },
          component: ProvidersView
        },
        {
          path: 'categories',
          name:'categories-view',
          meta: {
            breadcrumbs: [
                          
              {
                label:'Productos',
                url:'products-page'
              },
              {
                label:'Rubros',
                url:'categories-view'
              }
            ]
          },
          component: CategoriesView
        },        
        {
          path: 'category-groups',
          name:'category-groups-view',
          meta: {
            breadcrumbs: [
                          
              {
                label:'Productos',
                url:'products-page'
              },
              {
                label:'Categorias',
                url:'category-groups-view'
              }
            ]
          },
          component: CategoryGroupView
        },        
          
              
             
        
      ]
}