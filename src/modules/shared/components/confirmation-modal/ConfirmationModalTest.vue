<template>
    
    <div class="card modal-container-confirmation">
            
            <div class="modal-container-confirmation--title">
                 <h3 :class="titleClass()">{{modalTitle}}</h3>
            </div>
            <div class="modal-container-confirmation--info">
                <p>{{modalInfo}}</p>
            </div>
            <div class="modal-container-confirmation--subtext">
                 <p>{{modalText}}</p>
            </div>
                                              
                                     
                   
            
            <div class="modal-container-form--controls">

                
                <button class="btn modal-container-form--cancel" @click="onCancel" >Cancelar</button>
                
                <button class="btn modal-container-form--accept" @click="onAccept">{{acceptButtonLabel}}</button>
            </div>
        </div>  
  
</template>

<script>

import { onMounted, ref,  } from 'vue';



export default {
    name:"ConfirmationModal",
    emits:[
        'on-cancel',
        'on-accept',
    ],
    props:[
        'text',    
        'title',    
        'info',    
        'type',        
    ],
    setup(props, context){      
      

       
        const modalTitle = ref('');
        const modalInfo = ref('');
        const modalText = ref('');
        
        const acceptButtonLabel = ref('Aceptar');       

    



        onMounted(()=> {                 
           
            
            if(props.text){

                modalText.value = props.text;               
                
            }else{
                modalText.value = "Generic Text";
            }

            if(props.title){

               modalTitle.value = props.title;  
                
            }else{
               modalTitle.value = 'Confirmación';
            }

            if(props.info){

               modalInfo.value = props.info;  
                
            }else{
               modalInfo.value = 'Información';
            }         
            
           
        });   
        
        
        const titleClass = () => {

            switch (props.type) {
                case 'delete':
                    return 'delete-title';                  
            
                case 'info':
                    return 'info-title';                   
                case 'warning':
                    return 'warning-title';                   
            
                default:
                    return 'info-title';                   
            }
           
        }
       

        return{       
           
            acceptButtonLabel,
            modalTitle,
            modalInfo,
            modalText,
            titleClass,
            onAccept(){                
                context.emit('on-accept');
            },       
            onCancel(){               
                context.emit('on-cancel');                
            }
        }
    }

}
</script>

<style lang="scss" scoped>
@import "@/assets/css/modals.scss";

 

</style>