<template>
<div class="modal">
    
    <div class="modal-layout">
        <div class="modal-title">
            <p>{{title}}</p>
        </div>
        <div class="modal-form">
            <UploadFiles ref="uploadFiles" @on-file-selected="onSelectedFiles" />
        </div>
        <div class="modal-actions">
            <button @click="onCancel" class="modal-actions--cancel">Cancelar</button>
            <button @click="onAccept" class="modal-actions--accept">Cargar</button>
        </div>
    </div>

</div>
  
</template>

<script>
import { ref } from 'vue';
import UploadFiles from '@/modules/shared/components/upload-files/UploadFiles.vue';



export default {
    name:'UploadFilesModal',
    components:{      
       UploadFiles,
       
    },         
    emits:[
        'on-cancel',
        'on-accept'
    ],   
    setup(props, context){        
       
        const title = ref('Cargar archivo'); 
        const uploadFiles = ref(null);               
        let files = []; 
       
      
        const onSelectedFiles = (selectedFiles) =>{     
            
            files = selectedFiles;                
          
        }
       

        const onCancel = () =>{
            context.emit('on-cancel');
        }

        const onAccept = () =>{   
            
            

            if(!uploadFiles.value.checkError()){                
                context.emit('on-accept', files);
            }       
            
        }      


       
        return{
           
               
            title,      
            uploadFiles,   
            onSelectedFiles,          
            onCancel,
            onAccept
        }
    }

}
</script>

<style lang="scss" scoped>
@import "./upload-files-modal.scss";
</style>