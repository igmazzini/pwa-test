<template>

    <div :class="['offline-bar',(!online) ? 'show-offline' : '']" >
        <p>Sin conexion</p>
    </div>
    <div :class="['online-bar',(showOnline) ? 'show-online' : '']" >
        <p>Conectado</p>
    </div>
</template>

<script setup>
import { watch, ref } from 'vue';
import { useUI } from '@/modules/shared/composables'; 

const { online } = useUI();
const showOnline = ref(false);


watch(online,(newValue, oldValue )=>{
   
    if(newValue && !oldValue){
        showOnline.value = true;
    }else{
        showOnline.value = false;
    }
});

</script>

<style lang="scss" scoped>

.offline-bar,
.online-bar{
    width: 100%;
    height: 15px;
    background-color: var(--error-color);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--light-text-color);
    transition: all 500ms var(--animation-type);
    font-family: RobotoRegular;
    font-size: 0.8em;
    position: absolute;
    pointer-events: none;
    top: 0;
    left:0;
    z-index: 20;
    opacity: 0;

    p{
        margin: 0;
        color: inherit;
        font-size: inherit;
        font-family: inherit;
    }
}


.online-bar{
    background-color: var(--success-color);
    color: var(--dark-text-color);
    font-family: RobotoRegular;
}

.show-online{
    animation-name: online;
    animation-duration: 7s;
    
}

@keyframes online {
    0%{
        opacity: 0;
    }
    50%{
        opacity: 1;
    }
    75%{
        opacity: 0;
    }
    100%{
        opacity: 0;
    }
    
}
.show-offline{
    opacity: 1;
}

@media screen and (max-width:1300px) {
    .offline-bar,
    .online-bar{
        height: 12px;
    }
}
</style>