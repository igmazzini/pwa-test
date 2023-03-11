<template>
  <div v-if="loading" class="loading-container">
      <p class="loading-container--text">{{ loadingMessage }}</p>      
      <div id="html-spinner"></div>
   </div>
</template>

<script>

import { useUI } from '@/modules/shared/composables/useUI';
export default {
    name:'Loading',
    setup(){
        
        const { loading, loadingMessage } = useUI();

        return{
            loading,
            loadingMessage
        }
    }

}
</script>

<style lang="scss" scoped>
.loading-container{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--background-grey);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 100;

  transition: all var(--animation-duration) var(--animation-type);
}





.loading-container--text {
  margin: 0;
  font-size: 2rem;
  font-family: RobotoLight;
  transition: all var(--animation-duration) var(--animation-type);

}

.dark .loading-container {
  background-color: black;
  color: var(--dark-text-color);
}



.loading-container--icon {
  margin-top: 20px;
  width: 50px;
  height: auto;

}

#html-spinner{
  width:50px;
  height:50px;
  border:4px solid var(--button-active-color-light);
  border-top:4px solid var(--background-color);
  border-radius:50%;
  margin-top: 10px;
  
}

#html-spinner{
  -webkit-transition-property: -webkit-transform;
  transition-duration: 1.2s;
  -webkit-transition-duration: 1.2s;
  -webkit-animation-name: rotate;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-timing-function: linear;
  
  -moz-transition-property: -moz-transform;
  -moz-animation-name: rotate; 
  -moz-animation-duration: 1.2s; 
  -moz-animation-iteration-count: infinite;
  -moz-animation-timing-function: linear;
  
  transition-property: transform;
  animation-name: rotate; 
  animation-duration: 1.2s; 
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@-webkit-keyframes rotate {
    from {-webkit-transform: rotate(0deg);}
    to {-webkit-transform: rotate(360deg);}
}

@-moz-keyframes rotate {
    from {-moz-transform: rotate(0deg);}
    to {-moz-transform: rotate(360deg);}
}

@keyframes rotate {
    from {transform: rotate(0deg);}
    to {transform: rotate(360deg);}
}
</style>