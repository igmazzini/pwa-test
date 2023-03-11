import HomeLayout from '@/modules/home/layout/HomeLayout.vue'
import DashboardView from '@/modules/home/views/dashboard/DashboardView.vue'

export default{
    name:'/home',
    component: HomeLayout,   
    redirect:{name:'dashboard-page'},    
    children:[
        {
          path: '',
          name:'dashboard-page',
          component: DashboardView
        },
        
      
      ]
}