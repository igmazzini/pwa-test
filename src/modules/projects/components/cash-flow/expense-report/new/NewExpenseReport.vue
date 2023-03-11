<template>  
   
    <div class="new-expense-report">

        <div v-if="!showInvoiceData && !showNewProvider" class="expense-report-data">

            <TextField ref="amountText" @click="onInput('amount')" :label="'Importe'" :text="expenseReportData.amount" :type="'money'"  />
            <TextField ref="categoryText"  @click="onSelect('category')" :label="'Rubro'" :text="expenseReportData.category_name" />
            <TextField ref="itemText"   @click="onSelect('item')" :label="'Item'" :text="expenseReportData.product_name" />
            <TextField   @click="onInput('motive')" :text="expenseReportData.motive" :label="'Motivo'" />


            <div class="expense-report-dates">
                <button @click="onDateSelected('yesterday')"
                    :class="['expense-report-dates-item', (selectedDate == 'yesterday') ? 'item-selected' : '']">
                    <p>{{ yesterday }}</p>
                    <p>Ayer</p>
                </button>
                <button @click="onDateSelected('today')"
                    :class="['expense-report-dates-item', (selectedDate == 'today') ? 'item-selected' : '']">
                    <p>{{ today }}</p>
                    <p>Hoy</p>
                </button>

                <button @click="onDateSelected('customDate')"
                    :class="['expense-report-dates-item', 'pay-date-containter', (selectedDate == 'customDate') ? 'item-selected' : '']">
                    <font-awesome-icon icon="fa-regular fa-calendar" v-if="customDay == ''" /> <p v-if="customDay != ''">{{ customDay }}</p>
                </button>

            </div>

            <div class="expense-report-files">
                <UploadFilesList ref="uploadFilesListRef" :nameFileWidth="10" :expense-report="true" />
            </div>

        </div>
        <div v-if="showInvoiceData && !showNewProvider" class="invoice-data">
            <TextField ref="invoiceTypeText" @click="onSelect('invoice-type')" :label="'Tipo'" :text="(invoiceData.type == 'no-invoice') ? 'Sin factura' :invoiceData.type" />
            <TextField v-if="invoiceData.type != 'no-invoice'" ref="invoiceProviderText" @click="onSelect('provider')" :label="'Razón social / CUIT'" :text="invoiceData.provider_name" />

            <div v-if="invoiceData.type != ''" class="invoice-data-values"> 

                <TextField v-if="newProvider"  :label="'CUIT'" :text="invoiceData.provider_data.cuit" />
                <TextField v-if="newProvider"  :label="'Dirección'" :text="`${invoiceData.provider_data.street} ${invoiceData.provider_data.street_number}`" />
                <TextField ref="invoiceNoTaxText" v-if="invoiceData.type == 'A'" @click="onInput('no-tax')" :label="'No gravado'" :text="invoiceData.no_tax" :type="'money'"  />
                <TextField ref="invoiceTaxText" v-if="invoiceData.type == 'A'" @click="onInput('tax')" :label="'Gravado'" :text="invoiceData.tax" :type="'money'"  />            
                <TextField ref="invoiceIva21Text" v-if="invoiceData.type == 'A'" @click="onInput('iva21')" :label="'Iva 21%'" :text="invoiceData.iva21" :type="'money'" />
                <TextField ref="invoiceIva10Text" v-if="invoiceData.type == 'A'" @click="onInput('iva10')" :label="'Iva 10.5%'" :text="invoiceData.iva10"  :type="'money'" />
                <TextField ref="invoicePercepIvaText" v-if="invoiceData.type == 'A'" @click="onInput('percepIva')" :label="'Percepción IVA'" :text="invoiceData.percepIva"  :type="'money'" />
                <TextField ref="invoicePercepIIBBText" v-if="invoiceData.type == 'A'" @click="onInput('percepIIBB')" :label="'Percepción IIBB'" :text="invoiceData.percepIIBB" :type="'money'"  />
                <TextField ref="invoiceCaeText" v-if="invoiceData.type == 'A'" @click="onInput('cae')" :label="'CAE'" :text="invoiceData.cae" :type="'money'"  />
                <TextField ref="invoiceTotalText" v-if="invoiceData.type == 'A'" @click="onInput('total')" :label="'Total + Iva'" :text="invoiceData.total" :type="'money'"  />
                <TextField v-if="invoiceData.type == 'no-invoice'" :label="'Establecimiento'" @click="onInput('place')" :text="invoiceData.place_name" :withCopy="false" :type="'text'" />
                <TextField v-if="invoiceData.type == 'no-invoice'" :label="'Nombre y Apellido'" @click="onInput('contact-name')" :text="invoiceData.contact_name" :withCopy="false" :type="'text'" />
                <TextField v-if="invoiceData.type == 'no-invoice'" :label="'Dirección'" @click="onInput('contact-address')" :text="invoiceData.contact_address" :withCopy="false" :type="'text'" />
                <TextField v-if="invoiceData.type == 'no-invoice'" :label="'Email'" @click="onInput('contact-email')" :text="invoiceData.contact_email" :withCopy="false" :type="'text'" />
                <TextField v-if="invoiceData.type == 'no-invoice'" :label="'Telefono'" @click="onInput('contact-phone')" :text="invoiceData.contact_phone" :withCopy="false" :type="'text'" />
                <TextField ref="invoiceTotalText" v-if="invoiceData.type != 'A'" @click="onInput('total')" :label="'Total'" :text="invoiceData.total" :type="'money'"  />

            </div>   

        </div>

        <div v-if="showNewProvider" class="provider-data">
            <p>Nuevo proveedor</p>
            <div class="provider-data-values">
                <TextField ref="newProviderNameText" @click="onInput('provider-name')" :label="'Razón social'" :text="providerData.company_name" />
                <TextField ref="newProviderCuitText" @click="onInput('cuit')" :label="'CUIT'" :text="providerData.cuit" />
                <TextField ref="newProviderStreetText" @click="onInput('street')" :label="'Calle'" :text="providerData.street" />
                <TextField ref="newProviderStreetNumberText" @click="onInput('street-number')" :label="'Número de calle'" :text="providerData.street_number" />
                <TextField ref="newProviderLocalityText" @click="onInput('locality')" :label="'Localidad'" :text="providerData.locality" />
                <TextField ref="newProviderCepText" @click="onInput('cep')" :label="'Codigo postal'" :text="providerData.cep" />
                <TextField ref="newProviderStateText" @click="onSelect('state')" :label="'Provincia'" :text="providerData.state" />
                <TextField ref="newProviderCountryText" @click="onSelect('country')" :label="'País'" :text="providerData.country" />
            </div>
        </div>
        <div class="actions">
            <button v-if="showInvoiceData && !showNewProvider" @click="showInvoiceData = false" class="cta">Volver</button>
            <button v-if="!showInvoiceData" @click="onNext"  class="cta">{{lblNext}}</button>
            <button v-if="showNewProvider" @click="onNewProviderCancel"  class="cta">Cancelar</button>
            <button v-if="showNewProvider" @click="onNewProviderAccept"  class="cta">Aceptar</button>
            <button v-if="!showNewProvider && showInvoiceData || invoiceDataLoaded" @click="checkBalance" class="cta">Cargar rendición</button>
        </div>

    </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { TextField, UploadFilesList } from '@/modules/shared/components';

import { useUI, useMobileUI, useModal } from "@/modules/shared/composables";
import { useCategories, useProducts, useProviders} from '@/modules/products/composables';
import { useExpenseReports } from '@/modules/projects/composables';
import { useProfiles } from '@/modules/profiles/composables';

export default {
    name: 'NewExpenseReport',
    components: {

        TextField,      
        UploadFilesList
    },
    props:{
        class:{
            default:null
        }
    },
    setup() {

        //PROPERTIES
        const router = useRouter();
        const { darkMode } = useUI();  
        const { showUI, hideUI} = useMobileUI();     
        const { showConfirmation, hideConfirmation, } = useModal(); 
        const { categories } = useCategories();
        const { products, getProductsByCode } = useProducts();
        const { providers } = useProviders();
        const { uploadExpenseReport } = useExpenseReports();
        const { currentUserBalance } = useProfiles();
        const customDay = ref('');
        const today = ref('');
        const yesterday = ref('');
        const selectedDate = ref('');
        const showInvoiceData = ref(false);
        const showNewProvider = ref(false);
        const newProvider = ref(false);
        const invoiceDataLoaded = ref(false);
        const lblNext = ref('Siguiente');

          
       

        const categoriesOptions = ref([]);
        const itemsOptions = ref([]);
        const providersOptions = ref([]);
        const invoiceOptions = ref([]);   
        
        const confirmationInfo = ref({
            title:'Presupuesto de usuario excedido',
            text:'Se generara una solicitud de efectivo por la diferencia, ¿Confirma esta rendición?',
            info:'El monto de la rendición excede el presupuesto del usuario',
            type:'warning'
        });  
      

        const expenseReportData = ref({
            amount: '',
            order_id: '',
            category_name: '',
            category_id: '',
            category_code: '',
            product_name: '',
            product_id: '',
            motive: '',
            date_created: '',
            files: []
        });

        const invoiceData = ref({
            type:'',
            provider_name:'',
            provider_id:'',           
            provider_data:'',
            no_tax:'',
            tax:'',
            iva21:'',
            iva10:'',
            percepIva:'',
            percepIIBB:'',
            cae:'',
            total:'',
            place_name:'',
            contact_name:'',
            contact_address:'',
            contact_email:'',
            contact_phone:'',
        });

        const providerData = ref({
            company_name:'',
            cuit:'',
            street:'',
            street_number:'',
            locality:'',
            cep:'',
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


        watch(invoiceData.value,() => {
            
            if(invoiceData.value.type != '' && invoiceData.value.provider_name != '' && invoiceData.value.total != '' ){
                invoiceDataLoaded.value = true;
                lblNext.value = 'Factura';
            }else{
                invoiceDataLoaded.value = false; 
                lblNext.value = 'Siguiente';
            }
           
        });

      

        //REFS
        const datePicker = ref(null);
        const uploadFilesListRef = ref(null);
        const amountText = ref(null);
        const categoryText = ref(null);
        const itemText = ref(null);

        const invoiceTypeText = ref(null);
        const invoiceProviderText = ref(null);
        const invoiceTotalText = ref(null);

        const newProviderNameText = ref(null);
        const newProviderCuitText = ref(null);
        const newProviderStreetText = ref(null);
        const newProviderLocalityText = ref(null);
        const newProviderStateText = ref(null);
        const newProviderCountryText = ref(null);
      



        watch(categories,()=>{

           setCategories();
        });

        watch(products,()=>{

            setItems();
        });
        watch(providers,()=>{

            setProviders();
        });



        //METHODS

        const setCategories = () =>{
            categoriesOptions.value = categories.value?.map( cat =>{
                return {
                    label:cat.category_name,
                    value:cat.category_id,
                    code:cat.category_code
                }
            });
           
        }

        const setItems = () =>{
            itemsOptions.value = products.value?.map( prod =>{
                return {
                    label:prod.product_name,
                    value:prod.product_id,
                    code:prod.product_code
                }
            });
        }

        const setProviders = () =>{

            providersOptions.value = providers.value?.map( pro =>{
                return {
                    label:pro.company_name,
                    value:pro.company_id,
                    code:pro.extra_data?.cuit,
                    
                }
            });

            
        }

        const setInvoiceTypes = () =>{

            invoiceOptions.value = [
                {label:'Factura A',value:'A'},
                {label:'Factura B',value:'B'},
                {label:'Factura C',value:'C'},
                {label:'Sin Factura',value:'no-invoice'},
            ];
        }

        const setDates = () =>{

            const now = new Date(); 

            today.value = `${now.getDate()}/${now.getMonth()+1}`;

            if(now.getDate() == 1){      

                const y = new Date(now.getFullYear(), now.getMonth()-2, 0).getDate();

                yesterday.value = `${y}/${now.getMonth()}`;

            }else{

                yesterday.value = `${now.getDate() - 1}/${now.getMonth()+1}`;

            }


            expenseReportData.value.date_created = now.toISOString();

            selectedDate.value = 'today';

        }

        
        const onSelect = ( target ) =>{

           

            switch (target) {
                case 'category':                   

                    showUI('select',onSelectAccept,onSelectCancel,{title:'Rubro',target,options:categoriesOptions.value});

                    break;

                case 'item':
                   
                    showUI('select',onSelectAccept,onSelectCancel,{title:'Items',target,options:itemsOptions.value});

                    break;

                case 'invoice-type':      

                   
                    showUI('select',onSelectAccept,onSelectCancel,{title:'Tipo',target,options:invoiceOptions.value});

                    break;  

                case 'provider':      

                   
                    showUI('select',onSelectAccept,onSelectCancel,{title:'Razón social/ CUIT',target,showAddNew:true,searchTarget:'code',addNewLabel:'Nuevo proveedor',options:providersOptions.value});

                    break; 

                case 'state':      

                  
                    showUI('select',onSelectAccept,onSelectCancel,{title:'Provincia',target,options:states.value});

                    break;    

                case 'country':      
                   
                    showUI('select',onSelectAccept,onSelectCancel,{title:'País',target,options:countrys.value});

                    break;    
            
                default:
                    break;
            }

          
            
        }

        const onSelectAccept = ({ target, option }) => {

            
            switch (target) {

               
                case 'category':

                   
                    expenseReportData.value.category_name = option.label;
                    expenseReportData.value.category_id = option.value;
                    expenseReportData.value.category_code = option.code;

                    expenseReportData.value.product_name = '';
                    expenseReportData.value.product_id = '';

                    itemsOptions.value = getProductsByCode(option.code).map((item) => {
                        return {
                            label: `${item.product_code} ${item.product_name}`,
                            value: item.product_id,
                            code:item.product_code
                        }
                    });

                    break;
                case 'item':

                    
                    expenseReportData.value.product_name = option.label;
                    expenseReportData.value.product_id = option.value;

                    break;
                case 'provider':

                    if(option.value != 'new'){
                        invoiceData.value.provider_name = option.label;
                        invoiceData.value.provider_id = option.value;
                        showNewProvider.value = false;
                        newProvider.value = false;
                    }else{
                        invoiceData.value.provider_name = '';
                        showNewProvider.value = true;                       
                    }                   
                  

                    break;
                case 'invoice-type':

                    invoiceData.value.type = option.value;                 
                  

                    break;
                case 'state':

                    providerData.value.state = option.value;                 
                  

                    break;

                case 'country':

                    providerData.value.country = option.value;                 
                  

                    break;

                default:
                    break;
            }

           
            hideUI();
        }

        const onSelectCancel = () =>{
           
            hideUI();
        }

        const onInput = ( target ) =>{

            

            switch (target) {

                case 'amount':               
                  

                    showUI('input',onInputAccept,onInputCancel,{title:'Monto',target,type:'money',inputType:'numeric',placeholder:'Monto'});
                    
                    break;
                case 'motive':
                
                   
                    showUI('input',onInputAccept,onInputCancel,{title:'Motivo',target,type:'text',placeholder:'Motivo'});
                    
                    break;

                case 'no-tax':
                  
                    showUI('input',onInputAccept,onInputCancel,{title:'No gravado',target,type:'money',inputType:'numeric',placeholder:'Monto'});
                    
                    break;

                case 'tax':

                   
                    showUI('input',onInputAccept,onInputCancel,{title:'Gravado',target,type:'money',inputType:'numeric',placeholder:'Monto'});
                    
                    break;

                case 'iva21':

                 
                    showUI('input',onInputAccept,onInputCancel,{title:'Iva 21%',target,type:'money',inputType:'numeric',placeholder:'Monto'});
                    
                    break;

                case 'iva10':

                   
                    showUI('input',onInputAccept,onInputCancel,{title:'Iva 10.5%',target,type:'money',inputType:'numeric',placeholder:'Monto'});
                    
                    break;

                case 'percepIva':

                 
                    showUI('input',onInputAccept,onInputCancel,{title:'Percepción IVA',target,type:'money',inputType:'numeric',placeholder:'Monto'});
                    
                    break;

                case 'percepIIBB':

                    showUI('input',onInputAccept,onInputCancel,{title:'Percepción IIBB',target,type:'money',inputType:'numeric',placeholder:'Monto'});
                    
                    break;

                case 'cae':

                    showUI('input',onInputAccept,onInputCancel,{title:'CAE',target,type:'money',inputType:'numeric',placeholder:'Monto'});
                    
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

                    showUI('input',onInputAccept,onInputCancel,{title:(invoiceData.value.type == 'A') ? 'Total + IVA' : 'Total',target,type:'money',inputType:'number',placeholder:'Monto'});
                    
                    break;
            
                case 'provider-name':
                  
                    showUI('input',onInputAccept,onInputCancel,{title:'Razón social',target,type:'text',placeholder:'Razón social'});
                    
                    break;
                case 'cuit':

                
                    showUI('input',onInputAccept,onInputCancel,{title:'CUIT',target,type:'text',placeholder:'CUIT'});
                    
                    break;
                case 'street':

                
                    showUI('input',onInputAccept,onInputCancel,{title:'Calle',target,type:'text',placeholder:'Calle'});
                    
                    break;
                case 'street-number':
                   
                    showUI('input',onInputAccept,onInputCancel,{title:'Número',target,type:'number',inputType:'number',placeholder:'Número'});
                    
                    break;
                case 'locality':
                   
                    showUI('input',onInputAccept,onInputCancel,{title:'Localidad',target,type:'text',placeholder:'Localidad'});
                    
                    break;
                case 'cep':

             
                    showUI('input',onInputAccept,onInputCancel,{title:'Codigo postal',target,type:'number',placeholder:'Codigo postal'});
                    
                    break;
            

                default:
                    break;
            }

           
        }


        const onInputAccept = ({target , text}) =>{

            switch (target) {
                case 'amount':

                    expenseReportData.value.amount = text;          
                    break;

                case 'motive':

                    expenseReportData.value.motive = text;              
                    break;

                case 'no-tax':

                    invoiceData.value.no_tax = text;   
                    break;

                case 'tax':

                    invoiceData.value.tax = text;      
                    break;

                case 'iva21':

                    invoiceData.value.iva21 = text;      
                    break;

                case 'iva10':

                    invoiceData.value.iva10 = text;      
                    break;

                case 'percepIva':

                    invoiceData.value.percepIva = text;      
                    break;

                case 'percepIIBB':

                    invoiceData.value.percepIIBB = text;      
                    break;

                case 'cae':

                    invoiceData.value.cae = text;      
                    break;

                case 'place':

                    invoiceData.value.place_name = text;
                    break;

                case 'contact-name':

                    invoiceData.value.contact_name = text;
                    break;

                case 'contact-address':

                    invoiceData.value.contact_address = text;
                    break;

                case 'contact-email':

                    invoiceData.value.contact_email = text;
                    break;

                case 'contact-phone':

                    invoiceData.value.contact_phone = text;
                    break;    

                case 'total':

                    invoiceData.value.total = text;      
                    break;
                case 'provider-name':

                    providerData.value.company_name = text;      
                    break;

                case 'cuit':

                    providerData.value.cuit = text;      
                    break;

                case 'street':

                    providerData.value.street = text;      
                    break;

                case 'street-number':

                    providerData.value.street_number = text;      
                    break;

                case 'locality':

                    providerData.value.locality = text;      
                    break;

                case 'cep':

                    providerData.value.cep = text;      
                    break;
            
                default:
                break;
            }
           hideUI();
        }

        const onInputCancel = () =>{

            hideUI();
        }

        const onDateSelected = (date) => {


            switch (date) {

                case 'today':

                    expenseReportData.value.date_created = new Date().toISOString();
                    customDay.value = '';

                    break;

                case 'yesterday': {

                    const today = new Date();
                    expenseReportData.value.date_created = new Date(today.setDate(today.getDate() - 1)).toISOString();
                    customDay.value = '';



                }
                    break;
                case 'customDate':
                   
                    showUI('date-picker',onDatePickerAccept,onDatePickerCancel );

                    break;

                default:
                    break;
            }

            selectedDate.value = date;

        }

        const onDatePickerAccept = (modelData) =>{
     
     
            if(modelData){

                customDay.value = `${modelData.getDate()}/${modelData.getMonth()}`;

            }else{

                customDay.value = '';
            }  
            
            expenseReportData.value.date_created = modelData.toISOString();

            hideUI();
            
        }

        const onDatePickerCancel = () =>{     
            
            hideUI();
            
        }

        const onNext = () =>{
         
            let error = false;

            if(expenseReportData.value.amount == ''){
                amountText.value.showError();
                error = true;
            }
            if(expenseReportData.value.category_id == ''){
                categoryText.value.showError();
                error = true;
            }
            if(expenseReportData.value.product_id == ''){
                itemText.value.showError();
                error = true;
            }

            if(!error){
                showInvoiceData.value = true;
            }
        }


        const checkBalance = () =>{   
            
          

            if(currentUserBalance.value?.balance < expenseReportData.value.amount){
                
               
                showConfirmation(onConfirmAccept, onConfirmCancel, confirmationInfo.value);

            }else{
                
              
                onLoad();
            }
        }

        const onConfirmAccept = () =>{
           
            hideConfirmation();
            onLoad();
        }

        const onConfirmCancel = () =>{
           
            hideConfirmation();            
        }


        const onLoad = () =>{

            let error =  false;

            if(invoiceData.value.type == ''){
                invoiceTypeText.value.showError();
                error = true;
            }
            if(invoiceData.value.type != 'no-invoice' && invoiceData.value.provider_name == ''){
                invoiceProviderText.value.showError();
                error = true;
            }
            if(invoiceData.value.total == ''){
                invoiceTotalText.value?.showError();
                error = true;
            }

            


            if(!error){
                console.log('Load');
                expenseReportData.value.invoice = invoiceData.value;

                uploadExpenseReport( expenseReportData.value, onMutationFinish );   
            }
        }

        const onMutationFinish = ( result ) =>{
            if(result){
                router.push({name:'cashflow-page'});
            }
        }

        const onNewProviderAccept = ( data ) =>{
            console.log('onNewProviderAccept', data);

            let error = false;

            if(providerData.value.company_name == ''){
                newProviderNameText.value.showError();
                error = true;
            }
            if(providerData.value.cuit == ''){
                newProviderCuitText.value.showError();
                error = true;
            }
            if(providerData.value.street == ''){
                newProviderStreetText.value.showError();
                error = true;
            }
            if(providerData.value.locality == ''){
                newProviderLocalityText.value.showError();
                error = true;
            }
            if(providerData.value.state == ''){
                newProviderStateText.value.showError();
                error = true;
            }
            if(providerData.value.country == ''){
                newProviderCountryText.value.showError();
                error = true;
            }

            if(!error){
               
                invoiceData.value.provider_name = providerData.value.company_name;
                invoiceData.value.provider_data = providerData.value;
                showNewProvider.value = false;
                newProvider.value = true;
            }
           
        }

        const onNewProviderCancel = ( ) =>{
            console.log('onNewProviderCancel');
            newProvider.value = false;
            showNewProvider.value = false;
            invoiceData.value.provider_name = '';
           
        }
     

        onMounted(()=>{
            setCategories();
            setItems();
            setProviders();
            setInvoiceTypes();
            setDates();
        });

        return {
            //Properties
            darkMode,
            expenseReportData,
            invoiceData,
            providerData,
            showInvoiceData,
            showNewProvider,
            newProvider,
            invoiceDataLoaded,
            lblNext,


            today,
            yesterday,
            customDay,
            selectedDate,
           
        
            //Refs
            amountText,
            categoryText,
            itemText,
            datePicker,
            uploadFilesListRef,

            invoiceTypeText,
            invoiceProviderText,
            invoiceTotalText,

            newProviderNameText,
            newProviderCuitText,
            newProviderStreetText,
            newProviderLocalityText,
            newProviderStateText,
            newProviderCountryText,
           


            //Methods
            onInput,
            onSelect,          
            onSelectAccept,
            onSelectCancel,    
            onInputAccept,
            onInputCancel,       
            onDateSelected,
            onDatePickerAccept,
            onDatePickerCancel,
            onNewProviderAccept,
            onNewProviderCancel,
            onNext,
            onLoad,
            checkBalance
        }
    }
}
</script>

<style lang="scss" scoped>
.new-expense-report {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 10%;
    padding: 5px 5px;

   
}

.expense-report-data {
    grid-row: 1;
    padding-top: 15px;

    .text-field:deep(.text-field-container){
        background-color: var(--light-background-color);
        
    }

}

.expense-report-files {
    border: 1px solid #ccc;
    border-radius: 10px;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    font-family: RobotoLight;
}

.expense-report-dates {


    grid-row: 1;
    width: 100%;
    padding: 0;
    margin: 5% 0;
    display: flex;
    align-items: center;
    position: relative;
    justify-content: space-around;




}

.expense-report-dates-item {
    margin: 0 5px;
    padding: 5px 5px;
    background-color: var(--light-background-color);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content:center;
    text-align: center;
    width: 25%; 
    height: 60px;
    color: var(--light-text-color);
    border: none;
    outline: none;
    font-size: 1.8em;

    p {
        margin: 0;
        padding: 0;
        font-size: 0.7em;
        font-family: RobotoLight;
    }


    p:last-child {
        margin-top: -6px;
    }
}

.item-selected {
    background-color: var(--button-active-color-light);
}

.item-disabled {
    pointer-events: none;
    background-color: rgba(0, 0, 0, 0.1) !important;
}

.item-selected.item-disabled {

    background-color: rgba(0, 0, 0, 0.3) !important;

}

.expense-report-item:last-child {
    p {
        margin: 0;
    }
}

.dark .expense-report-dates-item {
    background-color: var(--dark-background-color);
    color: var(--dark-text-color);
}

.dark .item-selected {
    background-color: var(--button-active-color-dark);
    color: var(--light-text-color);
}


.invoice-data{
    padding-top: 15px;
    grid-row: 1;
    display: grid;
    grid-template-columns: 30% 1fr;
    grid-template-rows: 12% 1fr;
    align-content: flex-start;
    align-items: flex-start;
    gap: 10px;

    .text-field:deep(.text-field-container){
        background-color: var(--light-background-color);
       
    }
}
.invoice-data-values{
    grid-row: 2;
    grid-column: 1/-1;
    display: grid;
    grid-template-columns: repeat(2,1fr);  
    gap: 10px;
}

.provider-data{
    grid-row: 1;
    grid-column: 1/-1;   
    display: grid;
    grid-template-rows: 6% 1fr;
    padding-top: 15px;
   
    p{
        grid-row: 1;
        font-size: inherit;
        color: inherit;
        font-family: RobotoLight;
        margin: 0;
        border-bottom: 1px solid #ccc;
    }
   
}

.provider-data-values{
    grid-row: 2;
    display: grid;
    grid-template-columns: repeat(2,1fr);
    align-content: flex-start;
    gap: 10px;
    padding-top: 15px;
    .text-field:deep(.text-field-container){
        background-color: var(--light-background-color);
       
    }
}

.actions {
    grid-row: 2;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 1.2em;
   
   
}


.cta{

    background-color: var(--background-color);
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    color: var(--dark-text-color);
    margin-left: 15px;
    font-size: inherit;
    font-family: RobotoRegular;
}



.cta:active{
    background-color: var(--button-active-color-light);
}


</style>