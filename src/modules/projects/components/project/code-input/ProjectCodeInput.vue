<template>
    <div class="code-input-container"  @click="onFocus">
    <div :class="['code-input',(!labelActive) ? 'code-input-inactive' : ''] ">   
        <p :class="['input-label', (labelActive) ? 'input-label-active' : 'input-label-inactive']">{{props.label}}</p>
        <div class="code-format-0" v-if="props.codeOption == 0 && labelActive">
            <input ref='input' @input="updateText"   v-model="firstText"  type="text"><span>{{ props.serie }}</span><input ref='input' @input="updateText"  v-model="secondText"  type="text">
        </div>
        <div class="code-format-1" v-if="props.codeOption == 1 && labelActive">
            <input ref='input' @input="updateText"  v-model="firstText"  type="text"><span>{{ props.serie }}</span>
        </div>
        <div class="code-format-2" v-if="props.codeOption == 2 && labelActive">
            <span>{{ props.serie }}</span><input ref='input' @input="updateText"   v-model="firstText"  type="text">
        </div>
    </div>
    
       
    <p :class="['input-error', showingError ? 'input-error-active' : '']">{{ errorText }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// eslint-disable-next-line no-undef
const props = defineProps({
codeOption: Number,
serie:Number,
label:String
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['update-text'])

const firstText = ref();
const secondText = ref();
const labelActive = ref(false) 
const showingError = ref(false);
const errorText = ref('Requerido')


const onFocus = () =>{
    labelActive.value = true;
}

const updateText  = () =>{ 

   

    if(props.codeOption == 0){
        if(firstText.value.length > 0 && secondText.value.length > 0 ){
            showingError.value = false;
        }else{
            showingError.value = true;
        }
    }else{
        if(firstText.value.length > 0 ){
            showingError.value = false;
        } else{
            showingError.value = true;
        }
    }

  

    
    emit('update-text',firstText.value,secondText.value);
}

const showError = (error) =>{
   
    if(error){
        errorText.value = error;
    }
   
    showingError.value = true;
}

const clear = () =>{  
   

    firstText.value = '';

    secondText.value = '';

    emit('update-text',firstText.value,secondText.value);
}

// eslint-disable-next-line no-undef
defineExpose({
    showError,
    clear,
    onFocus
});

</script>

<style lang="scss" scoped>

.code-input-container{
 width: 100%;
}
.code-input{
    width: 100%;
    height: 65px;
    font-size: 1em;
    color: var(--ligth-text-color);
    font-family: RobotoLight;
    background-color: var(--background-grey);   
    position: relative;   
    border-bottom: 2px solid var(--background-color);
    transition: all var(--animation-duration) var(--animation-type);
    display: grid;
    grid-template-rows: 23% 1fr;
}

.code-input-inactive{
    grid-template-rows: 1fr;
    align-items: center;
}

.code-format-0,
.code-format-1,
.code-format-2{
    width: 100%;
    height: 100%;
    margin: 0;
    display: grid;
    grid-template-columns: 1fr 10% 1fr;
    align-items:center;    
    gap: 3px;
    padding: 8px 8px 4px 8px;
    transition: all var(--animation-duration) var(--animation-type);
}

.code-format-1{
    grid-template-columns: 1fr 10%;
}
.code-format-2{
    grid-template-columns: 10% 1fr;
}

span,
input{
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
    font-size: inherit;
    color: inherit;
    font-family: inherit;
    margin: 0;
    padding-left: 10px;
    border-radius: 5px;
    background-color: var(--light-background-color);
    transition: all var(--animation-duration) var(--animation-type);
    text-transform: uppercase;
   
}

span{
   display: flex;
   align-items: center;
   justify-content: center;
   pointer-events: none;
   padding: 0;
    
   
}

.input-label{
    margin: 0;
    padding: 0;
    opacity: 0;
    padding-left: 8px;
    padding-top: 2px;
   
    color: var(--success-color);
    font-family: RobotoLight;
    font-size: 0.9em;
    transition: all var(--animation-duration) var(--animation-type);
}

.input-label-active{
    opacity: 1;
}

.input-label-inactive{
    opacity: 1;
    color: var( --light-placeholder-color);
    font-size: inherit;   
    margin-top: auto;
    margin-bottom: 5px;
    margin-left: 10px;
}

.input-error{
    margin: 0;
    padding: 2px;
    opacity: 0;
    font-family: RobotoLight;
    font-size: 0.9em;
    color: var(--error-color);
    transition: all var(--animation-duration) var(--animation-type);
}

.input-error-active{
    opacity: 1;
}



.dark .code-input {
    background-color: var(--dark-background-color);
    color: var(--dark-text-color);
}

.dark span,
.dark input{
    background-color: var(--light-placeholder-color);
}

.dark .input-label{
    color: var(--dark-placeholder-color);
}
.dark .custom-input,
.dark .input-label-active,
.dark.input-clear-icon{
    color: var(--dark-text-color);
}

</style>