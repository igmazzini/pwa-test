<template>
   <div class="providers-history">      
    <div class="providers-history-breadcrumbs">
       <Breadcrumbs/> 
    </div>
    <div :class="['providers-history-list',(providers.lenght == 0) ? 'providers-history-list-not-providers' : '']" >
        <p v-if="providers.lenght == 0" class="empty-providers">No hay proveedores</p>
        <ProviderItem v-for="provider of providers" :provider="provider" :key="provider" @on-delete="onProviderDelete" @on-edit="onProviderEdit"/>      
    </div>
    <div class="providers-history-actions">
      <button @click="onNewProvider" class="cta-button"><font-awesome-icon icon="fa-solid fa-plus" /> <p>Nuevo proveedor</p></button>
    </div>
   </div>
</template>

<script>
import { ref } from 'vue';
import {Breadcrumbs } from '@/modules/shared/components';
import {ProviderItem } from '@/modules/products/components';
import { useProviders } from '@/modules/products/composables';
import { useUI, useModal } from '@/modules/shared/composables';


export default {
    name:'ProvidersView',
    components:{
        Breadcrumbs,
        ProviderItem,
      
    },
    setup(){

       
        const { setTitle } = useUI();
        const { showModal, hideModal, showConfirmation, hideConfirmation } = useModal();
        const { providers, uploadProvider ,updateProvider, deleteProvider } = useProviders();    
       
       
        const updateProviderRef = ref(null);   
        const deleteProviderRef = ref(null);   
      

        const deleteProviderInfo = ref({
            title:'Anular proveedor',
            text:'¿Desea anular este proveedor?',
            info:'',
            type:'delete'

        });  
       
        setTitle('Proveedores');


        const onFinishMutation = ( result ) =>{

            if( result ){

                hideModal();
                hideConfirmation();
                updateProvider.value = null;
            }

        }   

        const onNewProvider = () =>{
           showModal('Provider',onNewProviderAccept,onNewProviderCancel, null);
        }

        const onNewProviderAccept = async ( providerData, update ) => {    

          

           

            if(!update){

               uploadProvider(providerData, onFinishMutation);

            }else{

                providerData.company_id = updateProviderRef.value.company_id; 
                
                updateProvider(providerData, onFinishMutation);

               
            }             
           
           
        }


        const onNewProviderCancel = () =>{
            hideModal();
            updateProviderRef.value = null;   
        }


        const onProviderEdit = ( id ) =>{
            
            updateProviderRef.value = providers.value.find( (prod)=> prod.company_id == id);

            showModal('Provider',onNewProviderAccept,onNewProviderCancel, updateProviderRef.value);
        }
        const onProviderDelete = async ( id ) =>{

            deleteProviderRef.value = providers.value.find( (prod)=> prod.company_id == id);           

            deleteProviderInfo.value.info = `${deleteProviderRef.value.company_name}`;

            showConfirmation(onConfirmDelete,onCancelDelete, deleteProviderInfo.value);

        }

        const onConfirmDelete = async () =>{           

            deleteProvider(deleteProviderRef.value.company_id, onFinishMutation);          
           
        }
        const onCancelDelete = () =>{
            hideConfirmation();
        }





        return{
            providers,      
            updateProviderRef,
           
            onNewProvider,          
            onProviderEdit,
            onProviderDelete,
           
        }
    }

}
</script>

<style lang="scss" scoped>
@import "./providers-view.scss";
</style>