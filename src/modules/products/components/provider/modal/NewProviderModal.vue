<template>
<div class="modal">
    <div class="modal-layout">
        <div class="modal-title">
            <p>{{title}}</p>
        </div>
        <div class="modal-form">    
            
           
            <Input ref="cuitInput" :label="'CUIT'" :forceValue="providerData.cuit" v-model="providerData.cuit" />
            <Input ref="nameInput" :label="'Razon social'" :forceValue="providerData.company_name"  v-model="providerData.company_name" />
            <Input ref="cbuInput" :label="'CBU'" :forceValue="providerData.cbu"  v-model="providerData.cbu" />
            <!-- <Input ref="iibbInput" :label="'IIBB'"  :forceValue="providerData.iibb" v-model="providerData.iibb" /> -->
            <Input ref="emailInput" :label="'Email'" :forceValue="providerData.email" v-model="providerData.email" />
            <Input ref="phoneInput" :label="'Telefono'" :forceValue="providerData.phone" v-model="providerData.phone" />
            <Input ref="addressInput" :label="'Dirección'" :forceValue="providerData.address" v-model="providerData.address" />
           
           <div class="modal-actions">
                <button @click="onCancel" class="modal-actions--cancel">Cancelar</button>
                <button @click="onAccept" class="modal-actions--accept">{{acceptButtonLabel}}</button>
            </div>
           
        </div>
        
    </div>

</div>
  
</template>

<script>

import { onMounted, ref } from 'vue';
import {Input} from '@/modules/shared/components';
import { useUI } from '@/modules/shared/composables';

export default {
    name:'NewProviderModal',
    components:{
        Input,           
    },
    emits:[
        'on-cancel',
        'on-accept'
    ],
    props:{
        payLoad:{
            type:Object,
            default:null
        }
    },
    setup(props,context){

        
        const { validateCBU, validateCUIT, validateEmail } = useUI()
        const title = ref('Nuevo proveedor');
        const acceptButtonLabel = ref('Cargar proveedor');
      
        const cuitInput = ref(null);
        const nameInput = ref(null);
        const cbuInput = ref(null);
        const iibbInput = ref(null);
        const emailInput = ref(null);
        const phoneInput = ref(null);
        const addressInput = ref(null);

        const providerData = ref({
            company_name:'',
            cuit:'',
            cbu:'',
            iibb:'',
            email:'',
            phone:'',
            address:'',
            status:'',

        });           
              

        const onCancel = () =>{
            context.emit('on-cancel');
        }

        const onAccept = () =>{

            let errors = false;

            if(providerData.value.company_name == ''){
                nameInput.value.checkError();
                errors = true;
            }            

            if(providerData.value.cuit == ''){
                cuitInput.value.checkError();
                errors = true;
            }

         

            if(providerData.value.cuit != '' && !validateCUIT(providerData.value.cuit)){
                cuitInput.value.showError('CUIT invalido');
                errors = true;
            }

            if(providerData.value.cbu == ''){
                cbuInput.value.checkError();
                errors = true;
            }  

            if(providerData.value.cbu != '' && !validateCBU(providerData.value.cbu)){
                cbuInput.value.showError('CBU invalido');
                errors = true;
            }

           /*  if(providerData.value.iibb == ''){
                iibbInput.value.checkError();
                errors = true;
            }    */

            if(providerData.value.email == ''){
                emailInput.value.checkError();
                errors = true;
            }
            if(providerData.value.email != '' && !validateEmail(providerData.value.email)){
                emailInput.value.showError('Email invalido');
                errors = true;
            }
            
            if(providerData.value.phone == ''){
                phoneInput.value.checkError();
                errors = true;
            } 

            if(providerData.value.address == ''){
                addressInput.value.checkError();
                errors = true;
            }
           

            if(!errors){

              let update = false;
              
              if(props.payLoad ){
                update = true;
              }

              context.emit('on-accept',providerData.value,update);
            }
            
        }

        onMounted(()=>{
            if(props.payLoad){

                title.value = 'Actualizar proveedor';

                acceptButtonLabel.value = 'Actualizar';

                const updateProvider = props.payLoad;              

                providerData.value.company_name = updateProvider.company_name;
                providerData.value.cuit = updateProvider.extra_data?.cuit;
                providerData.value.cbu = updateProvider.extra_data?.cbu;
                providerData.value.iibb = updateProvider.extra_data?.iibb;
                providerData.value.email = updateProvider.extra_data?.email;
                providerData.value.phone = updateProvider.extra_data?.phone;
                providerData.value.address = updateProvider.extra_data?.address;
                providerData.value.status = updateProvider.status;

                
            }
        });

        return{
            title,
            acceptButtonLabel,
            cuitInput,  
            nameInput,    
            cbuInput,    
            iibbInput,  
            emailInput, 
            phoneInput,
            addressInput,
            providerData,                   
            onCancel,
            onAccept
        }
    }

}
</script>

<style lang="scss" scoped>
@import "./new-provider-modal.scss";
</style>