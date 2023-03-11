<template>
    <div class="new-order">
        <div class="new-order-data">
            <TextField ref="providerText" @click="onSelect('provider')" :label="'Proveedor'" :text="orderData.provider_name" />
            <TextField ref="categoryText" @click="onSelect('category')" :label="'Rubro'" :text="orderData.category_name" />
            <TextField ref="itemText" @click="onSelect('item')" :label="'Item'" :text="orderData.product_name" />
            <TextField ref="amountText" @click="onInput('amount')" :label="'Monto'" :text="orderData.amount" :type="'money'"  />
            <TextField ref="dateText" @click="onSelect('date')" :label="'Plazo de pago'" :text="orderData.date" />
            <TextField  @click="onInput('motive')" :label="'Motivo'" :text="orderData.motive" />
            <div class="files">
                <UploadFilesList ref="uploadFilesListRef" />
            </div>
        </div>
        <div class="actions">
            <button @click="onAccept" class="cta">Cargar orden</button>
        </div>

    </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {   calculateDaysBetweenDates ,calculateFutureDate } from '@/helpers/utils';
import { TextField, UploadFilesList } from '@/modules/shared/components';
import { useUI, useMobileUI, useModal } from "@/modules/shared/composables";
import { useCategories, useProducts, useProviders} from '@/modules/products/composables';
import { useProject, useOrders } from "@/modules/projects/composables";


export default {
    name: 'NewOrder',
    components: {
        TextField,
        UploadFilesList
    },
    setup() {


        //PROPERTIES
        const router = useRouter();
        const { darkMode, formatDate, formatAmount } = useUI();
        const { showUI, hideUI } = useMobileUI();
        const { showConfirmation, hideConfirmation } = useModal(); 
        const { providers } = useProviders();
        const { categories } = useCategories();
        const { products, getProductsByCode } = useProducts();
        const { currentProjectBudget }  = useProject(); 
        const { uploadOrder } = useOrders();
        const providerOptions = ref([]);
        const categoryOptions = ref([]);
        const itemOptions = ref([]);
        const dateOptions = ref([]);

        const orderData = ref({

            provider_name: '',
            company_id: '',
            category_name: '',
            category_id: '',
            category_code: '',
            currency_id: '',
            cost_center_id: '',
            motive: '',
            amount: '',
            date: '',
            date_payment: '',
            files: [],
            product_name:'',
            product_id:'',
            products:[]
        });

        const confirmationInfo = ref({
            title:'Presupuesto excedido',
            text:'¿Confirma la orden?',
            info:'El monto de la orden excede el presupuesto del proyecto',
            type:'warning'
        })


        //REFS
        const providerText = ref(null);
        const categoryText = ref(null);
        const itemText = ref(null);
        const amountText = ref(null);
        const dateText = ref(null);
        const uploadFilesListRef = ref(null);


        watch(providers, ()=>{
            setProviders();
        });
        watch(categories, ()=>{
            setCategories();
        });
        watch(products, ()=>{
            setItems();
        });
     

        //METHODS 

        const setProviders = () =>{
            providerOptions.value = providers.value?.map( provider =>{
                return {
                    label:provider.company_name,
                    value:provider.company_id
                }
             })   
        }

        const setCategories = () =>{
            categoryOptions.value = categories.value?.map( cat =>{
                return {
                    label:cat.category_name,
                    value:cat.category_id,
                    code:cat.category_code,
                }
             })   
        }

        const setItems = () =>{
            itemOptions.value = products.value?.map( product =>{
                return {
                    label:`${product.product_code} ${product.product_name}`,
                    value:product.product_id,
                    code:product.product_code
                }
             })   
        }

        const setDates = () =>{

            dateOptions.value = [
                {label:'Fecha exacta', value:'custom'},
                {label:`15 días (${formatDate(new Date(calculateFutureDate(15)))})`, value:new Date(calculateFutureDate(15))},
                {label:`30 días (${formatDate(new Date(calculateFutureDate(30)))})`, value:new Date(calculateFutureDate(30))},
                {label:`60 días (${formatDate(new Date(calculateFutureDate(60)))})`, value:new Date(calculateFutureDate(60))},
                {label:`90 días (${formatDate(new Date(calculateFutureDate(90)))})`, value:new Date(calculateFutureDate(90))},
                {label:`120 días (${formatDate(new Date(calculateFutureDate(120)))})`, value:new Date(calculateFutureDate(120))},               
            ];
        }

        const onSelect = (target) => {



            switch (target) {
                case 'provider':

                    showUI('select', onSelectAccept, onSelectCancel, { title: 'Proveedor', target, options: providerOptions.value });

                    break;
                case 'category':

                    showUI('select', onSelectAccept, onSelectCancel, { title: 'Rubro', target, options: categoryOptions.value });

                    break;
                case 'item':

                    showUI('select', onSelectAccept, onSelectCancel, { title: 'Item', target, options: itemOptions.value });

                    break;
                case 'date':

                    showUI('select', onSelectAccept, onSelectCancel, { title: 'Plazo de pago', target, options: dateOptions.value });

                    break;

                default:
                    break;
            }



        }

        const onSelectAccept = ({ target, option }) => {


           

            if (!option) return;

            switch (target) {
                case 'provider':
                    
                    orderData.value.provider_name = option.label;
                    orderData.value.company_id = option.value;    

                    hideUI();

                    break;
                case 'category':

                    orderData.value.category_name = option.label;
                    orderData.value.category_id = option.value;    
                    orderData.value.cost_center_id = option.value;    
                    orderData.value.currency_id = option.value;    
                    orderData.value.category_code = option.code;    

                    orderData.value.product_name = '';
                    orderData.value.product_id = '';
                    orderData.value.products = [];


                    itemOptions.value = getProductsByCode(option.code).map((item) => {
                        return {
                            label: `${item.product_code} ${item.product_name}`,
                            value: item.product_id,
                            code:item.product_code
                        }
                    });

                    hideUI();

                    break;
                case 'item':

                    orderData.value.product_name = option.label;
                    orderData.value.product_id = option.value; 
                    orderData.value.products = [{product_id:option.value}]  

                    hideUI();

                    break;
                case 'date':

                    console.log(option.value )
                    
                    if(option.value == 'custom'){

                        hideUI();
                        showUI('date-picker', onDatePickerAccept, onDatePickerCancel); 
                        
                        
                    }else{
                        orderData.value.date = option.label;  
                        orderData.value.date_payment = option.value;  
                        hideUI();
                    }
                     
                    break;
            
                default:
                    break;
            }
           
        }

        const onSelectCancel = () => {

            hideUI();
        }

        const onInput = (target) => {



            switch (target) {

                case 'amount':


                    showUI('input', onInputAccept, onInputCancel, { title: 'Monto', target, type: 'money',inputType:'numeric', placeholder: 'Monto' });

                    break;
                case 'motive':


                    showUI('input', onInputAccept, onInputCancel, { title: 'Motivo', target, type: 'text', placeholder: 'Motivo' });

                    break;


                default:
                    break;
            }


        }

        const onInputAccept = ({ target, text }) => {

            switch (target) {
                case 'amount':

                    orderData.value.amount = text;
                    break;

                case 'motive':

                    orderData.value.motive = text;
                    break;

                default:
                    break;
            }
            hideUI();
        }

        const onInputCancel = () => {

            hideUI();
        }

        const onDatePickerAccept = ( date ) =>{

            const days = calculateDaysBetweenDates(date.toISOString())
           
         
           orderData.value.date = `${days} ${(days> 1) ? 'días' : 'día'} (${formatDate(date.toISOString())})`;
           orderData.value.date_payment = date.toISOString();

           hideUI();
        
        }

        const onDatePickerCancel = () =>{
            hideUI();
        }

        const onAccept = () =>{

            if(!currentProjectBudget.value?.has_agreement  && orderData.value.amount > currentProjectBudget.value?.available_balance_with_agreement ){
                
               
                showConfirmation(onConfirmAccept,onConfirmCancel, confirmationInfo.value);
               
            }else{
                onLoad()
            }
        }

        const onLoad = () =>{

            let error = false;

            console.log(orderData.value)

            if(currentProjectBudget.value.has_agreement && orderData.value.amount > currentProjectBudget.value.available_balance_with_agreement){                
                amountText.value.showError(`Balance insuficiente ( ${formatAmount(currentProjectBudget.value.available_balance_with_agreement)} )`);
                error = true;
            }           

          

            if(orderData.value.company_id == ''){
                providerText.value.showError();
                error = true;
            }

            if(orderData.value.category_id == ''){
                categoryText.value.showError();
                error = true;
            }

            if(orderData.value.product_id == ''){
                itemText.value.showError();
                error = true;
            }
            if(orderData.value.date_payment.length == 0){
                dateText.value.showError();
                error = true;
            }
            
            
            if(orderData.value.amount == ''){
                amountText.value.showError();
                error = true;
            }

            const files = uploadFilesListRef.value.files.filter( file => (file.file != null || file.storage_url != ''));

            if(files){
                orderData.value.files = orderData.value.files.concat(files);
                orderData.value.files = [...new Set([...orderData.value.files,...files])]; 
            }           


            if(!error){
                uploadOrder(orderData.value, onFinishMutation);
            }
        }

        const onFinishMutation = ( result ) =>{
            if(result){
                router.push({name:'orders-page'});
            }
        }

        const onConfirmAccept = () =>{

            onLoad();

            hideConfirmation();

        }

        const onConfirmCancel = () =>{


            hideConfirmation();
        }


        
        onMounted(() => {
            setProviders();
            setCategories();
            setItems();
            setDates();
        })

        return {
            //Properties
            orderData,
            darkMode,
            formatDate,
            formatAmount,


            //Refs
            providerText,
            categoryText,
            itemText,
            amountText,
            dateText,
            uploadFilesListRef,

            //Methods
            onSelect,
            onInput,
            onAccept
        }
    }
}
</script>

<style lang="scss" scoped>
.new-order {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 10%;
    padding: 5px 10px;
    font-size: 1.4em;


}

.new-order-data {
    grid-row: 1;
    padding-top: 15px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    align-content: flex-start;


}

.files {
    grid-column: 1/-1;
    border: 1px solid #ccc;
    border-radius: 10px;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    font-family: RobotoLight;
}

.actions {
    grid-row: 2;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 1.2em;


}


.cta {

    background-color: var(--background-color);
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    color: var(--dark-text-color);
    margin-left: 15px;
    font-size: inherit;
    font-family: RobotoRegular;
}



.cta:active {
    background-color: var(--button-active-color-light);
}
</style>