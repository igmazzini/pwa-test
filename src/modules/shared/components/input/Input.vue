<template>
  <div class="custom-input-container">
    <div :class="['input-container',showingError ? 'input-container-empty' : '', block ? 'disabled' : '']">
        <p :class="['input-label', labelActive ? 'input-label-active' : '']">{{label}}</p>
        <input ref='input' @input="updateValue" @focus="onFocus"  :value="formatValue" :disabled="disabled" class="custom-input" :type="type" :inputmode="type" :placeholder="label">
        <font-awesome-icon @click="onClear" class="input-clear-icon" icon="fa-solid fa-circle-xmark" />
    </div>
    <p :class="['input-error', showingError ? 'input-error-active' : '']">{{ errorText }}</p>
  </div>
</template>

<script>
import { onMounted, ref, watch} from 'vue';
import { useUI } from '@/modules/shared/composables/useUI'; 
import { format, unformat, setCursorPosition, setCursor} from '@/helpers/utils';
export default {

    props:{
        label: {
            type: String,
            default: 'Label',
        },
        type: {
            type: String,
            default: 'text',
        },
        disabled: {
            type: Boolean,
            default: false,
        },   
        forceValue:{
           default:''
        },    
        modelValue: {
            default:''
        }
    },

    setup(props,context){

       
        const labelActive = ref(false);
        const inputValue = ref('');
        const errorText = ref('Requerido');
        const input = ref(null);
        const formatValue = ref('');
        const checkingError = ref(false);
        const showingError = ref(false);
        const { mobile, currency } = useUI();
        const block = ref(false);


        
        watch(()=> props.forceValue, ()=>{
            
            if(props.type == 'money'){

                formatValue.value  = format(props.forceValue,{prefix:`${currency.value} `});   

            }else{

                formatValue.value = props.forceValue;
            }   

            if(checkingError.value || showingError.value){
                showingError.value = false;   
                errorText.value = 'Requerido';    
            }  

            setTimeout(() => {
               
                if(input.value && input.value.value != ''){
                    labelActive.value = true;
                }
                
            }, 100);
            
        })
      

        const onClear = () => {
            input.value.value = '';
            formatValue.value = '';
            labelActive.value = false; 
            errorText.value = 'Requerido';   

            if(checkingError.value || showingError.value){
                showingError.value = false;       
            }  
                    
            context.emit('update:modelValue', input.value.value);
        }


        const checkError = () => {        
            

            checkingError.value = true; 

            if(input.value.value == ''){
                showingError.value = true;
            }else if(props.type.toLowerCase() == 'number' && input.value.value == 0) {
                showingError.value = true;
            }
        }

        const showError = ( error ) => {   
            
            errorText.value = error;

            showingError.value = true;           
        }

        const updateValue = (event) => {
           

            if(props.type == 'money'){

                setCursorPosition(event.target);
          
                formatValue.value = unformat(event.target.value);

                formatValue.value  = format(formatValue.value,{prefix:`${currency.value} `});      
                
                context.emit('update:modelValue',unformat(event.target.value));

              
            }else{

                formatValue.value = event.target.value;

                context.emit('update:modelValue',formatValue.value);
            }         
           

            

            if(event.target.value != ''){
                labelActive.value = true;
                if(checkingError.value ){
                    showingError.value = false;   
                    errorText.value = 'Requerido';    
                }                        
            }else{
                labelActive.value = false;
                if(checkingError.value){
                    showingError.value = true;       
                } 
            }
        }

        const onFocus = (event) =>{
            if(props.type == 'money'){
                setCursor(event.target, (event.target.value.length - String(currency.value).length))
            }
            
            if(mobile.value){
                
                context.emit('on-focus');
            }
             
        }


        const setBlock = ( val ) =>{
            block.value = val;
        }

       
      

        onMounted( () => {             
           

            if(props.forceValue){

                if(props.type == 'money'){

                    formatValue.value  = format(props.forceValue,{prefix:`${currency.value} `});   

                }else{

                    formatValue.value = props.forceValue;
                }    
                
            }

            setTimeout(() => {
               
                if(input.value && input.value.value != ''){
                    labelActive.value = true;
                }
                
            }, 100);
        });

        

       

        return{       
            input,    
            checkError,
            errorText,
            showingError,
            labelActive,
            inputValue,
            onClear,
            updateValue,
            onFocus,         
            formatValue,
            setBlock,
            showError,
            block
           
        }
    }

}
</script>

<style lang="scss" scoped>

.custom-input-container{
    width: 100%;
    
}

.input-container{
    height: 55px;
    width: 100%;
    background-color: var(--background-grey);   
    position: relative;
    display: grid;
    grid-template-rows: 40% 1fr;
    font-size: 1em;
    border-bottom: 2px solid var(--background-color);
    transition: all var(--animation-duration) var(--animation-type);
   
}

.input-container-empty {
    border-bottom: 2px solid var(--error-color);
}

.input-label{
    margin: 0;
    padding: 0;
    opacity: 0;
    padding-left: 15px;
    padding-top: 5px;
    color: var(--success-color);
    font-family: RobotoLight;
    font-size: 0.9em;
    transition: all var(--animation-duration) var(--animation-type);
}

.input-label-active{
    opacity: 1;
}


.custom-input{
    width: 100%;
    padding: 0;
    padding-right: 30px;
    padding-left: 15px;
    font-size: 1em;
    font-family: RobotoLight;
    background-color: transparent;
    border: none;
    transition: all var(--animation-duration) var(--animation-type);
   
   
}
.custom-input:active,
.custom-input:focus,
.custom-input:focus-visible{
    border: none;
    outline: none;
}

/* Chrome, Safari, Edge, Opera */
.custom-input::-webkit-outer-spin-button,
.custom-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
/* .custom-input[type=number] {
  -moz-appearance: textfield;
} */

.input-clear-icon{
    font-size: 1.2em;
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
    transition: all var(--animation-duration) var(--animation-type);
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

.disabled{
    pointer-events: none;
    background-color: rgba(0, 0, 0, 0.1) !important;  
}

.dark .disabled{
   
    background-color: rgba(240, 234, 234, 0.1) !important;    
}

.dark .input-container {
    background-color: var(--dark-background-color);
}

.dark .input-container .input-label,
.dark .input-container .custom-input,
.dark .input-container .input-clear-icon{
    color: var(--dark-text-color);
}

@media screen and (max-width:900px) {
    .input-container{
        height: 45px;
        background-color: var(--light-background-color);
    }  
    

    .custom-input{
        font-size: 0.9em;
    }

    .input-label{
       
        font-size: 0.8em;
    }
    
}

@media screen and (max-height:750px) {
    .input-container{
        height: 45px;    
    }  
}

</style>