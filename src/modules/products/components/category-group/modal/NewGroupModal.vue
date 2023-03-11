<template>

    <div class="modal-layout">
        <div class="modal-title">
            <p>{{title}}</p>
        </div>
        <div class="modal-form">            
           
            <Input ref="groupNameInput" :label="'Nombre'" :forceValue="groupData.group_name" v-model="groupData.group_name" />
                      
        </div>
        <div class="modal-actions">
            <button @click="onCancel" class="modal-actions--cancel">Cancelar</button>
            <button @click="onAccept" class="modal-actions--accept">{{acceptButtonLabel}}</button>
        </div>
    </div>


  
</template>

<script>
import { onMounted, ref } from 'vue';

import {Input} from '@/modules/shared/components';

export default {
    name:'NewGroupModal',
    components:{
        Input,       
    },
    emits:[
        'on-cancel',
        'on-accept'
    ],
    props:{
        payLoad:{
          
            default:null
        }
    },
    setup(props,context){
        
      
        const groupNameInput = ref(null);      

        const title = ref('Nueva categoria');

        const acceptButtonLabel = ref('Cargar categoria');

        const groupData = ref({              
            group_name:'',               
            group_id:'',               
            status:'',               
        });  

         

       

        const onCancel = () =>{
            context.emit('on-cancel');
        }

        const onAccept = () =>{

            let errors = false;

            if(groupData.value.group_name == ''){
                groupNameInput.value.checkError();
                errors = true;
            }

            if(!errors){

               let update = false;
              
              if(props.payLoad ){
                update = true;
              }

              context.emit('on-accept',groupData.value,update);
            }
            
        }

        onMounted( ()=>{
            if(props.payLoad){

                title.value = 'Actualizar categoria';

                acceptButtonLabel.value = 'Actualizar';

                const updateGroup = props.payLoad;              

                groupData.value.group_id = updateGroup.group_id;         
                groupData.value.group_name = updateGroup.group_name;              
                groupData.value.status = updateGroup.status;              
                    

                
            }
        });
      

        return{         
            title,
            acceptButtonLabel,    
            groupNameInput,            
            groupData,          
            onCancel,
            onAccept
        }
    }

}
</script>

<style lang="scss" scoped>
@import "./new-group-modal.scss";
</style>