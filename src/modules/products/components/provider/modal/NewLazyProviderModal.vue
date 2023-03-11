<template>
  <div class="modal-layout">
        <div class="modal-title">
            <p>{{title}}</p>
        </div>
        <div class="modal-form">    
            

            <Input ref="nameInput" :label="'Razón social'" :forceValue="providerData.company_name"  v-model="providerData.company_name" />           
            <Input ref="cuitInput" :label="'CUIT'" :forceValue="providerData.cuit" v-model="providerData.cuit" />
                      
            <Input ref="streetInput" :label="'Calle'" :forceValue="providerData.street" v-model="providerData.street" />
            <Input ref="streetNumberInput" :label="'Número'" :type="'number'" :forceValue="providerData.street_number" v-model="providerData.street_number" />            
            <Input ref="localityInput" :label="'Localidad'" :forceValue="providerData.locality" v-model="providerData.locality" />
            <Input ref="cpInput" :label="'CP'" :forceValue="providerData.cp" v-model="providerData.cp" />
           
            <Select ref="stateSelect" :label="'Provincia'" :options="states"  @option-selected="onStateSelected" />
            <Select ref="countrySelect" :label="'País'" :options="countrys"  @option-selected="onCountrySelected" />
           
          
           
        </div>
        <div class="modal-actions">
            <button @click="onCancel" class="modal-actions--cancel">Cancelar</button>
            <button @click="onAccept" class="modal-actions--accept">{{acceptButtonLabel}}</button>
        </div>
        
    </div>
  
</template>

<script>

import { onMounted, ref } from 'vue';
import {Input, Select} from '@/modules/shared/components';
import { useUI } from '@/modules/shared/composables';

export default {
    name:'NewLazyProviderModal',
    components:{
        Input,   
        Select,        
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

        
        const {  validateCUIT } = useUI()
        const title = ref('Nuevo proveedor');
        const acceptButtonLabel = ref('Cargar proveedor');
      
        const cuitInput = ref(null);
        const nameInput = ref(null);
        const streetInput = ref(null);
        const streetNumberInput = ref(null);
        const localityInput = ref(null);
        const cpInput = ref(null);
        const stateSelect = ref(null);
        const countrySelect = ref(null);

        const providerData = ref({
            company_name:'',
            cuit:'',
            street:'',
            street_number:'',
            locality:'',
            cp:'',
            state:'',
            country:'',

        });  
        
        
        const countrys = ref([
            {label:'Argentina', value:'Argentina'}
        ]);

        const states = ref([
            {label:'Buenos Aires', value:'Buenos Aires'},
            {label:'CABA', value:'CABA'},
            {label:'Catamarca', value:'Catamarca'},
            {label:'Chaco', value:'Chaco'},
            {label:'Chubut', value:'Chubut'},
            {label:'Córdoba', value:'Córdoba'},
            {label:'Corrientes', value:'Corrientes'},
            {label:'Entre Ríos', value:'Entre Ríos'},
            {label:'Formosa', value:'Formosa'},
            {label:'Jujuy', value:'Jujuy'},
            {label:'La Pampa', value:'La Pampa'},
            {label:'La Rioja', value:'La Rioja'},
            {label:'Mendoza', value:'Mendoza'},
            {label:'Misiones', value:'Misiones'},
            {label:'Neuquén', value:'Neuquén'},
            {label:'Río Negro', value:'Río Negro'},
            {label:'Salta', value:'Salta'},
            {label:'San Juan', value:'San Juan'},
            {label:'San Luis', value:'San Luis'},
            {label:'Santa Cruz', value:'Santa Cruz'},
            {label:'Santa Fe', value:'Santa Fe'},
            {label:'Santiago del Estero', value:'Santiago del Estero'},
            {label:'Tierra del Fuego', value:'Tierra del Fuego'},
            {label:'Tucumán', value:'Tucumán'},
        ]);


        const onCountrySelected = ( option ) =>{

            providerData.value.country = '';

            if(!option) return;

            providerData.value.country = option.value;

        }   

        const onStateSelected = ( option ) =>{

            providerData.value.state = '';

            if(!option) return;

            providerData.value.state = option.value;

        }   
              

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

            if(providerData.value.street == ''){
                streetInput.value.checkError();
                errors = true;
            }  
            if(providerData.value.street_number == ''){
                streetNumberInput.value.checkError();
                errors = true;
            }          

            if(providerData.value.cp == ''){
                cpInput.value.checkError();
                errors = true;
            }
        
            
            if(providerData.value.locality == ''){
                localityInput.value.checkError();
                errors = true;
            } 

            if(providerData.value.state == ''){
                stateSelect.value.checkError();
                errors = true;
            }
            if(providerData.value.country == ''){
                countrySelect.value.checkError();
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
                providerData.value.street = updateProvider.extra_data?.street;
                providerData.value.street_number = updateProvider.extra_data?.street_number;
                providerData.value.locality = updateProvider.extra_data?.locality;
                providerData.value.cep = updateProvider.extra_data?.cp;
                providerData.value.state = updateProvider.extra_data?.state;
                providerData.value.country = updateProvider.country;

                
            }
        });

        return{
            title,
            acceptButtonLabel,
            cuitInput,  
            nameInput,    
            streetInput,    
            streetNumberInput,  
            localityInput, 
            cpInput,
            stateSelect,
            countrySelect,
            providerData,   
            countrys, 
            states,   


            //Methods
            onCountrySelected,  
            onStateSelected,          
            onCancel,
            onAccept
        }
    }

}
</script>

<style lang="scss" scoped>
@import "./new-provider-modal.scss";

.modal-layout{
    
    
    grid-template-rows: 11% 1fr 9%;  
}

.modal-form{
    margin-top: 15px;
}
</style>