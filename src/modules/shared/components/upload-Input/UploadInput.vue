<template>
  <div class="input-container">
    <p :class="['input-label', labelActive ? 'input-label-active' : '']">{{label}}</p>
    <p class="upload-placeholder"  @click="onUploadFile">{{inputValue}}</p>
    <input 
    
    ref="uploadInput"
    v-on:change="handleFileUpload"
    type="file"
    accept=".pdf, .jpg, .png, .jpeg"    
    class="upload-input"     
    >
    <font-awesome-icon @click="onUploadFile" class="input-clear-icon" icon="fa-solid fa-arrow-up-from-bracket" />
  </div>
</template>

<script>
import { ref ,toRef, watch } from 'vue';
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
        selectedFile:{
            type:Object,
        },
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

.dark .input-container {
    background-color: var(--dark-background-color);
}

.dark .input-container .input-label,
.dark .input-container .custom-input,
.dark .input-container .input-clear-icon{
    color: var(--dark-text-color);
}

.dark .input-container .upload-placeholder{
    color: var(--dark-placeholder-color);
}

</style>