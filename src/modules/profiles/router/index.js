import ProfileLayout from '@/modules/profiles/layout/ProfileLayout.vue'
import UserProfileView from '@/modules/profiles/views/user-profile/UserProfileView.vue'

export default{
    name:'/profile',
    component: ProfileLayout,       
    children:[
        {
          path: '',
          name:'profile-page',
          meta: {
            breadcrumbs: [
              {
                label:'Escritorio',
                url:'dashboard-page'
              },
              {
                label:'Cuenta',
                url:'profile-page'
              },
            
            ]
          },
          component: UserProfileView
        },
        
      
      ]
}