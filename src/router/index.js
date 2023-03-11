import { createRouter, createWebHashHistory } from 'vue-router'
import NotFoundPage from '@/modules/shared/views/NotFoundPage.vue'
import authRouter from '@/modules/auth/router'
import homeRouter from '@/modules/home/router'
import projectRouter from '@/modules/projects/router'
import productsRouter from '@/modules/products/router'
import profilesRouter from '@/modules/profiles/router'
import  isAuthenticatedGuard  from '@/modules/auth/router/auth-guard'

const routes = [
  { 
    path: '/',
    name:'login',
    redirect:{name:'login-page'}   
  },
  {
    path: '/login',      
    ...authRouter,   
  },
  {
    path: '/home',
    beforeEnter:[isAuthenticatedGuard], 
    ...homeRouter,   
  },
  {
    path: '/profiles',    
    beforeEnter:[isAuthenticatedGuard],
    ...profilesRouter,   
  },
  {
    path: '/projects',    
    beforeEnter:[isAuthenticatedGuard],
    ...projectRouter,   
  },
  {
    path: '/products',  
    name:'products-page',  
    beforeEnter:[isAuthenticatedGuard],
    ...productsRouter,   
  },
  { 
    path: '/:pathMatch(.*)*',
    component: NotFoundPage
  
  },
]




const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
