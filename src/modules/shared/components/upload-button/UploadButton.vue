<template>
  <div class="button-container">   
    <button :class="[(disabled) ? 'disabled' : '']" @click="onUploadFile"  ><font-awesome-icon icon="fa-regular fa-folder-open" /><p>Seleccionar archivo</p></button>
    <input 
    
    ref="uploadInput"
    v-on:change="handleFileUpload"
    type="file"
    accept="image/*,.pdf"    
    class="upload-input"     
    >
    
  </div>
</template>

<script>
import { ref ,toRef, watch } from 'vue';
export default {

    props:{  
       
        disabled: {
            type: Boolean,
            default: false,
        },
    },

    emits:[
        'on-file-selected'
    ],

    setup(props,context){

       
        const labelActive = ref(false);
        
        const uploadInput = ref(null);      

        const labelRef= toRef(props, 'label');
        const inputValue = ref('');

        inputValue.value = labelRef.value;

        watch(() =>  props.selectedFile,()=>{
            
                     
          inputValue.value = props.selectedFile.file_name;       

           if(inputValue.value.length > 30){          
                inputValue.value = `${inputValue.value.substring(0,30)}...`; 
           }
          
        });


      

        const  onUploadFile = () => {
           
            uploadInput.value.click();
            inputValue.value = labelRef.value;
            labelActive.value = false;
        };

        const handleFileUpload = async () => {
           

            const data = uploadInput.value.files[0];           

            if(data){

                labelActive.value = true;

                inputValue.value = data.name;

                if(inputValue.value.length > 30){
                    inputValue.value = `${inputValue.value.substring(0,30)}...`; 
                }

                context.emit('on-file-selected',data);
            }

           
        }      

       

        return{           
            labelActive,
            inputValue,
            uploadInput,
            onUploadFile,
            handleFileUpload,
           
        }
    }

}
</script>

<style lang="scss" scoped>

.button-container{   
    width: 100%;    
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1em; 
}

button{
    background-color: var(--light-background-color);
    border:1px solid var(--background-color);
    border-radius: 16px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content:center;
    font-family: RobotoLight;
    color: var(--light-text-color);
    padding: 10px;
    font-size: 1.1em;

    p{
        margin: 0;
        padding: 0;
        
    }

    .fa-folder-open{
        font-size: 1.2em;
        color: var(--background-color);
        margin-right: 15px;
    }

}

button:hover{
     background-color: var(--button-active-color-light);
}

.dark button {
    color: var(--dark-text-color);
    background-color: var(--dark-background-color);
}

.dark button:hover{
     background-color: var(--button-active-color-dark);
     color: var(--light-text-color);
}

.disabled{
    color: var(--light-secondary-text-color);
    background-color:  rgba(0, 0, 0, 0.2);
    pointer-events: none;
}

.dark .disabled{
    background-color:  rgba(130, 124, 124, 0.2);
    color: var(--dark-secondary-text-color) !important;
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

.upload-placeholder{
    width: 100%;
    padding: 0;
    margin: 0;
    padding-left: 15px;
    padding-right: 30px;
    padding-top: 3px;
    font-family: RobotoLight;
    color: var(--light-placeholder-color);
    cursor: pointer;
}


.upload-input{
    position: absolute;
    visibility: hidden;
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

.input-clear-icon{
    font-size: 1.2em;
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
    transition: all var(--animation-duration) var(--animation-type);
}

.dark .button-container {
    background-color: var(--dark-background-color);
}

.dark .button-container .input-label,
.dark .button-container .custom-input,
.dark .button-container .input-clear-icon{
    color: var(--dark-text-color);
}

.dark .button-container .upload-placeholder{
    color: var(--dark-placeholder-color);
}

</style>