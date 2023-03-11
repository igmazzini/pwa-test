<template>
  <div class="user-account">
    <div v-if="!mobile" class="user-account-notifications">
        <font-awesome-icon icon="fa-solid fa-bell" />
        <font-awesome-icon icon="fa-solid fa-envelope" />
    </div>
    <div class="user-account--info">
        <img class="user-account-avatar" :src="userProfile?.photo_url" referrerpolicy="no-referrer" alt="">
        <div class="user-account-info">
            <p>{{substring(userProfile?.name,40)}}</p>
            <p>{{substring(userProfile?.email,40)}}</p>
        </div>
    </div>

  </div>
</template>

<script>


import { useUI } from '@/modules/shared/composables';
import { useProfiles } from '@/modules/profiles/composables';
export default {

    name:'UserAccount',
    setup(){
         
       
        const { userProfile } = useProfiles();       
        const { mobile, substring } = useUI();

        return{
            userProfile,
            mobile,
            substring
        }
    }

}
</script>


<style lang="scss" scoped>
@import "./user-account.scss";

</style>