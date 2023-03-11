
<template>
    <div  class="expense-report-detail-container">
        <div v-if="currentExpenseReport" class="expense-report-detail--title">
            <p >Rendición: {{ currentExpenseReport?.expense_report_code }}</p>
            <p >Estado: <span :class="currentExpenseReport?.status.toLowerCase()">{{
                getStatus(currentExpenseReport?.status)
            }}</span></p>
        </div>
        <div v-if="currentExpenseReport && !showInvoice" class="data-container">
            <div  class="expense-report-detail animate__animated animate__fadeInLeft animate__faster">
                <div class="expense-report-detail-data">
                    <TextField :label="'Fecha'" :text="formatDate(currentExpenseReport.date_created)" :withCopy="false"/>      
                    <TextField :label="'Monto'" :text="formatAmount(currentExpenseReport.amount)" :withCopy="false"/>                 
                    <TextField :label="'Rubro'" :text="currentExpenseReport.product?.category?.category_name" :withCopy="false"/>
                    <TextField :label="'Item'" :text="currentExpenseReport.product.product_name" :withCopy="false"/>           
                    <TextField :label="'Factura'" :text="(currentExpenseReport.extra_data?.invoice?.type == 'no-invoice') ? 'Sin Factura' : currentExpenseReport.extra_data?.invoice?.type" :withCopy="false"/>           
                    <TextField :label="'Motivo'" :text="currentExpenseReport.extra_data?.reason" :withCopy="false"/>

                    <a @click="showInvoice = true" class="invoice-detail">{{(currentExpenseReport.extra_data?.invoice?.type == 'no-invoice') ? 'Detalle' : 'Detalle de factura'}}</a>
                    <div class="expense-report-detail-files">
                        <UploadFilesList ref="uploadFilesListRef" :expense-report="true"   :previousFiles="currentExpenseReport.transaction.storages" :canDeletePrevious="true"/>
                    </div>
                </div>
                <div class="expense-report-detail-actions">        
                    <button class="cta-button" @click="onUpdate">Guardar</button>     
                
                </div>
                
            </div>
        </div>
        <div v-if="currentExpenseReport && showInvoice" class="data-container">
            <div  class="expense-report-invoice animate__animated animate__fadeInRight animate__faster">
                <div class="invoice-data">
                    <TextField :label="'Tipo'" :text="(currentExpenseReport.extra_data?.invoice?.type == 'no-invoice') ? 'Sin factura'  :'Factura '+currentExpenseReport.extra_data?.invoice?.type" :withCopy="false"/>      
                    <TextField v-if="currentExpenseReport.extra_data?.invoice?.type != 'no-invoice'" :label="'Razón social'" :text="currentExpenseReport.extra_data?.invoice?.provider_name" :withCopy="false"/>  
                    <template v-if="!mobile" >
                        <Input v-if="currentExpenseReport.extra_data?.invoice?.type == 'A'"  ref="inputNoTax" :label="'No gravado'" :forceValue="currentExpenseReport.extra_data?.invoice?.no_tax"  v-model="invoiceData.no_tax" :type="'money'" />             
                        <Input v-if="currentExpenseReport.extra_data?.invoice?.type == 'A'"  ref="inputTax" :label="'Gravado'" :forceValue="currentExpenseReport.extra_data?.invoice?.tax"  v-model="invoiceData.tax" :type="'money'" />             
                        <Input v-if="currentExpenseReport.extra_data?.invoice?.type == 'A'"  ref="inputIva21" :label="'Iva 21%'" :forceValue="currentExpenseReport.extra_data?.invoice?.iva21"  v-model="invoiceData.iva21" :type="'money'" />             
                        <Input v-if="currentExpenseReport.extra_data?.invoice?.type == 'A'"  ref="inputIva10" :label="'Iva 10.5%'" :forceValue="currentExpenseReport.extra_data?.invoice?.iva10"  v-model="invoiceData.iva10" :type="'money'" />             
                        <Input v-if="currentExpenseReport.extra_data?.invoice?.type == 'A'"  ref="inputPercepIva" :label="'Percepción Iva'" :forceValue="currentExpenseReport.extra_data?.invoice?.percepIva"  v-model="invoiceData.percepIva"  :type="'money'"/>             
                        <Input v-if="currentExpenseReport.extra_data?.invoice?.type == 'A'"  ref="inputPercepIIBB" :label="'Percepción IIBB'" :forceValue="currentExpenseReport.extra_data?.invoice?.percepIIBB"  v-model="invoiceData.percepIIBB" :type="'money'" />             
                        <Input v-if="currentExpenseReport.extra_data?.invoice?.type == 'A'"  ref="inputCAE" :label="'CAE'" :forceValue="currentExpenseReport.extra_data?.invoice?.cae"  v-model="invoiceData.cae" :type="'money'" />             
                        <Input v-if="currentExpenseReport.extra_data?.invoice?.type == 'A'"  ref="inputTotalIva" :label="'Total + Iva'" :forceValue="currentExpenseReport.extra_data?.invoice?.total"  v-model="invoiceData.total" :type="'money'" />             
                        <Input v-if="currentExpenseReport.extra_data?.invoice?.type == 'no-invoice'"  ref="inputPlaceName" :label="'Establecimiento'" :forceValue="currentExpenseReport.extra_data?.invoice?.place_name"  v-model="invoiceData.place_name" :type="'text'" />             
                        <Input v-if="currentExpenseReport.extra_data?.invoice?.type == 'no-invoice'"  ref="inputContactName" :label="'Nombre y Apellido'" :forceValue="currentExpenseReport.extra_data?.invoice?.contact_name"  v-model="invoiceData.contact_name" :type="'text'" />             
                        <Input v-if="currentExpenseReport.extra_data?.invoice?.type == 'no-invoice'"  ref="inputContactAddress" :label="'Dirección'" :forceValue="currentExpenseReport.extra_data?.invoice?.contact_address"  v-model="invoiceData.contact_address" :type="'text'" />             
                        <Input v-if="currentExpenseReport.extra_data?.invoice?.type == 'no-invoice'"  ref="inputContactEmail" :label="'Email'" :forceValue="currentExpenseReport.extra_data?.invoice?.contact_email"  v-model="invoiceData.contact_email" :type="'text'" />             
                        <Input v-if="currentExpenseReport.extra_data?.invoice?.type == 'no-invoice'"  ref="inputContactPhone" :label="'Telefono'" :forceValue="currentExpenseReport.extra_data?.invoice?.contact_phone"  v-model="invoiceData.contact_phone" :type="'text'" />             
                        <Input v-if="currentExpenseReport.extra_data?.invoice?.type != 'A'"  ref="inputTotal" :label="'Total'" :forceValue="currentExpenseReport.extra_data?.invoice?.total"  v-model="invoiceData.total" :type="'money'" />             
                    </template>  
                    <template v-if="mobile">
                        <TextField v-if="currentExpenseReport.extra_data?.invoice?.type == 'A'" :label="'No gravado'" @click="onInput('no-tax')" :text="currentExpenseReport.extra_data?.invoice?.no_tax" :withCopy="false" :type="'money'" />
                        <TextField v-if="currentExpenseReport.extra_data?.invoice?.type == 'A'" :label="'Gravado'" @click="onInput('tax')" :text="currentExpenseReport.extra_data?.invoice?.tax" :withCopy="false" :type="'money'" />
                        <TextField v-if="currentExpenseReport.extra_data?.invoice?.type == 'A'" :label="'Iva 21%'" @click="onInput('iva21')" :text="currentExpenseReport.extra_data?.invoice?.iva21" :withCopy="false" :type="'money'" />
                        <TextField v-if="currentExpenseReport.extra_data?.invoice?.type == 'A'" :label="'Iva 10.5%'" @click="onInput('iva10')" :text="currentExpenseReport.extra_data?.invoice?.iva10" :withCopy="false" :type="'money'" />
                        <TextField v-if="currentExpenseReport.extra_data?.invoice?.type == 'A'" :label="'Percepción Iva'" @click="onInput('percepIva')" :text="currentExpenseReport.extra_data?.invoice?.percepIva" :withCopy="false" :type="'money'" />
                        <TextField v-if="currentExpenseReport.extra_data?.invoice?.type == 'A'" :label="'Percepción IIBB'" @click="onInput('percepIIBB')" :text="currentExpenseReport.extra_data?.invoice?.percepIIBB" :withCopy="false" :type="'money'" />
                        <TextField v-if="currentExpenseReport.extra_data?.invoice?.type == 'A'" :label="'CAE'" @click="onInput('cae')" :text="currentExpenseReport.extra_data?.invoice?.cae" :withCopy="false" :type="'money'" />
                        <TextField v-if="currentExpenseReport.extra_data?.invoice?.type == 'A'" :label="'Total + Iva'" @click="onInput('total')" :text="currentExpenseReport.extra_data?.invoice?.total" :withCopy="false" :type="'money'" />
                        <TextField v-if="currentExpenseReport.extra_data?.invoice?.type == 'no-invoice'" :label="'Establecimiento'" @click="onInput('place')" :text="currentExpenseReport.extra_data?.invoice?.place_name" :withCopy="false" :type="'text'" />
                        <TextField v-if="currentExpenseReport.extra_data?.invoice?.type == 'no-invoice'" :label="'Nombre y Apellido'" @click="onInput('contact-name')" :text="currentExpenseReport.extra_data?.invoice?.contact_name" :withCopy="false" :type="'text'" />
                        <TextField v-if="currentExpenseReport.extra_data?.invoice?.type == 'no-invoice'" :label="'Dirección'" @click="onInput('contact-address')" :text="currentExpenseReport.extra_data?.invoice?.contact_address" :withCopy="false" :type="'text'" />
                        <TextField v-if="currentExpenseReport.extra_data?.invoice?.type == 'no-invoice'" :label="'Email'" @click="onInput('contact-email')" :text="currentExpenseReport.extra_data?.invoice?.contact_email" :withCopy="false" :type="'text'" />
                        <TextField v-if="currentExpenseReport.extra_data?.invoice?.type == 'no-invoice'" :label="'Telefono'" @click="onInput('contact-phone')" :text="currentExpenseReport.extra_data?.invoice?.contact_phone" :withCopy="false" :type="'text'" />
                        <TextField v-if="currentExpenseReport.extra_data?.invoice?.type != 'A'" :label="'Total'" @click="onInput('total')" :text="currentExpenseReport.extra_data?.invoice?.total" :withCopy="false" :type="'money'" />
                    </template>
                </div>
            
                <div class="expense-report-detail-actions">        
                    <button class="cta-button" @click="showInvoice = false">Volver</button>     
                    <button class="cta-button" @click="onUpdate">Guardar</button>     
                
                </div>           
            </div>
        </div>
        <p v-if="currentExpenseReport && currentExpenseReport.log" class="last-updated">Ultima actualización: {{formatDate(currentExpenseReport.log?.date, true)}} por {{currentExpenseReport.log?.by.name}}</p>
    </div>
   
</template>

<script>
import { ref, watch  } from "vue";
import {TextField, UploadFilesList, Input} from '@/modules/shared/components';
import { useUI, useMobileUI } from '@/modules/shared/composables';
import { useExpenseReports } from '@/modules/projects/composables';



export default ({
    name: "ExpenseReportDetail",
    components:{
        TextField,
        Input,
        UploadFilesList
    },
    emits:[
        'on-update'
    ],
    setup(props, context){
        
        const { formatAmount, formatDate, getStatus, mobile} = useUI();
        const { showUI, hideUI} = useMobileUI();
        const { currentExpenseReport } = useExpenseReports();
        const showInvoice = ref(false);
        const uploadFilesListRef = ref(null);
        const invoiceData = ref({
            type:'',
            provider_name:'',
            provider_id:'',
            provider_cuit:'',
            no_tax:'',
            tax:'',
            iva21:'',
            iva10:'',
            percepIva:'',
            percepIIBB:'',
            cae:'',
            total:'',
        });


        watch(()=>currentExpenseReport.value,()=>{
           
            showInvoice.value = false;    
            
            invoiceData.value = {...currentExpenseReport.value?.extra_data?.invoice};
            uploadFilesListRef.value?.clearFiles();
        });

        const onUpdate = () =>{           
          
                    

            if(showInvoice.value){

                currentExpenseReport.value.extra_data.invoice = invoiceData.value;

            }else{

                const files = uploadFilesListRef.value.files.filter( file => (file.file != null || file.storage_url != ''));

                if(files){     
                
                    currentExpenseReport.value.files = files;                    
                   
                }    
                
            }

            context.emit('on-update',currentExpenseReport.value);
                   
        }


        const onInput = ( target ) =>{


            switch ( target ) {
                case 'no-tax':
                    showUI('input',onInputAccept, onInputCancel,{title:'No gravado',target,type:'money',inputType:'numeric',placeholder:'Monto'});    
                    break;
                case 'tax':
                    showUI('input',onInputAccept, onInputCancel,{title:'Gravado',target,type:'money',inputType:'numeric',placeholder:'Monto'});    
                    break;
                case 'iva21':
                    showUI('input',onInputAccept, onInputCancel,{title:'Iva 21%',target,type:'money',inputType:'numeric',placeholder:'Monto'});    
                    break;
                case 'iva10':
                    showUI('input',onInputAccept, onInputCancel,{title:'Iva 21.5%',target,type:'money',inputType:'numeric',placeholder:'Monto'});    
                    break;
                case 'percepIva':
                    showUI('input',onInputAccept, onInputCancel,{title:'Percepción IVA',target,type:'money',inputType:'numeric',placeholder:'Monto'});    
                    break;
                case 'percepIIBB':
                    showUI('input',onInputAccept, onInputCancel,{title:'Percepción IIBB',target,type:'money',inputType:'numeric',placeholder:'Monto'});    
                    break;
                case 'cae':
                    showUI('input',onInputAccept, onInputCancel,{title:'CAE',target,type:'money',inputType:'numeric',placeholder:'Monto'});    
                    break;
                case 'place':
                    showUI('input',onInputAccept, onInputCancel,{title:'Establecimiento',target,type:'text',placeholder:''});    
                    break;
                case 'contact-name':
                    showUI('input',onInputAccept, onInputCancel,{title:'Nombre y Apellido',target,type:'text',placeholder:''});    
                    break;
                case 'contact-address':
                    showUI('input',onInputAccept, onInputCancel,{title:'Dirección',target,type:'text',placeholder:''});    
                    break;
                case 'contact-email':
                    showUI('input',onInputAccept, onInputCancel,{title:'Email',target,type:'text',inputType:'email',placeholder:''});    
                    break;
                case 'contact-phone':
                    showUI('input',onInputAccept, onInputCancel,{title:'Telefono',target,type:'text',inputType:'tel',placeholder:''});    
                    break;
                case 'total':
                    showUI('input',onInputAccept, onInputCancel,{title:(currentExpenseReport.value.extra_data.invoice.type == 'A') ? 'Total + IVA' : 'Total',target,type:'money',inputType:'numeric',placeholder:'Monto'});    
                    break;
            
                default:
                    break;
            }
        }


        const onInputAccept = ({target , text}) =>{

            switch (target) {
                case 'no-tax':

                    currentExpenseReport.value.extra_data.invoice.no_tax = text;
                    break;
                case 'tax':

                    currentExpenseReport.value.extra_data.invoice.tax = text;
                    break;
                case 'iva21':

                    currentExpenseReport.value.extra_data.invoice.iva21 = text;
                    break;
                case 'iva10':

                    currentExpenseReport.value.extra_data.invoice.iva10 = text;
                    break;
                case 'percepIva':

                    currentExpenseReport.value.extra_data.invoice.percepIva = text;
                    break;
                case 'percepIIBB':

                    currentExpenseReport.value.extra_data.invoice.percepIIBB = text;
                    break;

                case 'cae':

                    currentExpenseReport.value.extra_data.invoice.cae = text;
                    break;

                case 'place':

                    currentExpenseReport.value.extra_data.invoice.place_name = text;
                    break;

                case 'contact-name':

                    currentExpenseReport.value.extra_data.invoice.contact_name = text;
                    break;

                case 'contact-address':

                    currentExpenseReport.value.extra_data.invoice.contact_address = text;
                    break;

                case 'contact-email':

                    currentExpenseReport.value.extra_data.invoice.contact_email = text;
                    break;

                case 'contact-phone':

                    currentExpenseReport.value.extra_data.invoice.contact_phone = text;
                    break;

                case 'total':

                    currentExpenseReport.value.extra_data.invoice.total = text;
                    break;
            
                default:
                    break;
            }
            
            
            invoiceData.value = currentExpenseReport.value.extra_data.invoice;

            hideUI();
            
        }

        const onInputCancel = () =>{
            hideUI();
        }


        return{
             formatAmount,
             mobile,
             showInvoice,
             invoiceData,
             getStatus,
             formatDate,
             uploadFilesListRef,
             currentExpenseReport,
             onUpdate,
             onInput
        }

    }

});  
</script>

<style lang="scss" scoped>
@import "./expense-report-detail.scss";
</style>