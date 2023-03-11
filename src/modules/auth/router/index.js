import LoginLayout from '@/modules/auth/layout/LoginLayout.vue'
import LoginView from '@/modules/auth/views/LoginView.vue'

export default{
    name:'login',
    component: LoginLayout,  
    children:[
        {
          path: '/',
          name:'login-page',
          component: LoginView
        },
        
      ]
}