<template>
  <div cl class="toggle-wrapper">
    <label class="toggle">
      <input 
        type="checkbox" 
        :checked="(darkMode) ? 'checked' : false" 
        @change="onModeChange"
      />
      <span class="toggler round"></span>
    </label>
  </div>
</template>

<script>

import { useUI } from '@/modules/shared/composables/useUI';
export default {
  name:'ToggleThemeMode', 
  setup(){
  
    const { darkMode, setDarkMode } = useUI();


    const onModeChange = () =>{
      
      setDarkMode( !darkMode.value);
      
    
    }

    return{   
      darkMode,  
      onModeChange
    }
  }
  
}
</script>

<style>
.toggle {
  position: relative;
  display: inline-block;
  width: 55px;
  height: 30px;
}
.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggler {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--light-background-color);
  border: 1px solid var(--background-color);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}



.toggler:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background: var(--background-color);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .toggler {
  background: var(--background-color);
}
.dark input:checked + .toggler {
   background: var(--dark-background-color);
}

input:checked + .toggler::before {
   background: var(--light-background-color);
}


input:focus + toggler {
  box-shadow: 0 0 2px var(--background-color);
}

input:checked + .toggler:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.toggler.round {
  border-radius: 30px;
}
.toggler.round:before {
  border-radius: 50%;
}
</style>
