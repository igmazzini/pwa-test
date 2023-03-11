import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProfilesStore = defineStore('profilesStore', () =>{
  
    const profiles = ref([]);
    const roles = ref(['Jefe','Runner']);
    const currentProfile = ref(null);


    const setProfiles = ( val ) =>{
        
        profiles.value = val;
    }

    const setRoles = ( val ) =>{

        roles.value = val;
    }
    const setCurrentProfile = ( val ) =>{

        currentProfile.value = val;
    }

    return{
        //Properties
        profiles,
        currentProfile,
        roles,

        //Getters


        //Actions
        setProfiles,
        setRoles,
        setCurrentProfile

    }

});