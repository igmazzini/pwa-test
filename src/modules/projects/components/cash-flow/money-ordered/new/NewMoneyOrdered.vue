<template>
    <div class="new-money-ordered">
        <div v-if="!showConfirm" class="money-ordered-data">
            <TextField ref="categoryText" @click="onSelect('category')" :label="'Rubro'" :text="moneyOrderedData.category" />
            <TextField ref="itemText" @click="onSelect('item')" :label="'Item'" :text="moneyOrderedData.product" />
            <TextField ref="amountText" @click="onInput('amount')" :label="'Monto'" :text="moneyOrderedData.amount" :type="'money'"  />
            <TextField ref="motiveText" @click="onInput('motive')" :label="'Motivo'" :text="moneyOrderedData.motive" />
        </div>
        <div v-if="showConfirm" class="confirm-data animate__animated animate__fadeInRight animate__faster">
                
                <strong>Solicitado por:</strong><p>{{ userProfile.name }}</p>
                <strong>Rubro:</strong><p> {{ moneyOrderedData.category }}</p>
                <strong>Item:</strong> <p>{{ moneyOrderedData.product }}</p>
                <strong>Monto:</strong> <p>{{ formatAmount(moneyOrderedData.amount) }}</p>
                <strong>Motivo:</strong><p> {{ moneyOrderedData.motive }}</p>
                <strong>Fecha:</strong> <p>{{ formatDate(transactionDate) }}</p>   
                <hr>
                <p class="confirm-question">¿Confirma la solicitud?</p>     
                <hr>   
            </div>
        <div class="balances">    
            <p>Balance disponible: {{ formatAmount(currentProjectBudget.available_balance) }} </p>                        
            <p>Balance de usuario: {{ formatAmount(currentUserBalance?.balance) }}</p>
        </div>
        <div class="actions">
            <button v-if="!showConfirm" @click="checkBalance" class="cta">Cargar solicitud</button>
            <button v-if="showConfirm" @click="showConfirm = false" class="cta">Cancelar</button>
            <button v-if="showConfirm" @click="onLoad" class="cta">Confirmar</button>
        </div>
    </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { TextField } from '@/modules/shared/components';
import { useMobileUI, useUI, useModal } from "@/modules/shared/composables";
import { useProfiles } from '@/modules/profiles/composables/useProfiles';
import { useProject } from '@/modules/projects/composables';
import { useCategories, useProducts } from '@/modules/products/composables';
import { useMoneyOrdered } from '@/modules/projects/composables';

export default {
    name: 'NewMoneyOrdered',
    components: {
        TextField
    },
    props: {
        class: {
            default: null
        }
    },
    setup() {

        const router = useRouter();
        const { showUI, hideUI } = useMobileUI();
        const { formatAmount, formatDate } = useUI();
        const { showConfirmation, hideConfirmation } = useModal();
        const { userProfile, currentUserBalance } = useProfiles();       
        const { currentProjectBudget } = useProject(); 
        const { categories } = useCategories();
        const { products, getProductsByCode } = useProducts();
        const { uploadMoneyOrdered } = useMoneyOrdered();

        const showConfirm = ref(false);
        const transactionDate = ref('');

        const categoriesOptions = ref([]);
        const itemsOptions = ref([]);

        const moneyOrderedData = ref({
            user: '',
            amount: '',
            category: '',
            category_id: '',
            category_code: '',
            product: '',
            product_id: '',
            motive: ''

        });

        const confirmationInfo = ref({
            title:'Presupuesto excedido',
            text:'¿Confirma la solicitud?',
            info:'El monto de la solicitud excede el presupuesto del proyecto',
            type:'warning'
        });


        //REFS 
        const categoryText = ref(null);
        const itemText = ref(null);
        const amountText = ref(null);
        const motiveText = ref(null);


        watch(categories, () => {

            setCategories();
        });

        watch(products, () => {

            setItems();
        });

        //METHODS

        const setCategories = () => {
            categoriesOptions.value = categories.value?.map(cat => {
                return {
                    label: cat.category_name,
                    value: cat.category_id,
                    code: cat.category_code
                }
            });
        }

        const setItems = () => {
            itemsOptions.value = products.value?.map(prod => {
                return {
                    label: prod.product_name,
                    value: prod.product_id,
                    code: prod.product_code
                }
            });
        }

        const onSelect = (target) => {



            switch (target) {
                case 'category':

                    showUI('select', onSelectAccept, onSelectCancel, { title: 'Rubro', target, options: categoriesOptions.value });

                    break;

                case 'item':

                    showUI('select', onSelectAccept, onSelectCancel, { title: 'Items', target, options: itemsOptions.value });

                    break;

                default:
                    break;
            }



        }

        const onSelectAccept = ({ target, option }) => {


            switch (target) {


                case 'category':


                    moneyOrderedData.value.category = option.label;
                    moneyOrderedData.value.category_id = option.value;
                    moneyOrderedData.value.category_code = option.code;

                    moneyOrderedData.value.product = '';
                    moneyOrderedData.value.product_id = '';

                    itemsOptions.value = getProductsByCode(option.code).map((item) => {
                        return {
                            label: `${item.product_code} ${item.product_name}`,
                            value: item.product_id,
                            code: item.product_code
                        }
                    });

                    break;
                case 'item':


                    moneyOrderedData.value.product = option.label;
                    moneyOrderedData.value.product_id = option.value;

                    break;               
                 
                default:
                    break;
            }


            hideUI();
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

                    moneyOrderedData.value.amount = text;
                    break;

                case 'motive':

                    moneyOrderedData.value.motive = text;
                    break;

                default:
                    break;
            }
            hideUI();
        }

        const onInputCancel = () => {

            hideUI();
        }

        const checkBalance = () =>{
            
            console.log(currentProjectBudget.value.has_agreement);
            console.log(currentProjectBudget.value.available_balance_with_agreement);
            console.log(Number(moneyOrderedData.value.amount));
            if (!showConfirm.value &&  !currentProjectBudget.value.has_agreement  && Number(moneyOrderedData.value.amount) > currentProjectBudget.value.available_balance_with_agreement ) {
                console.log('Presupuesto excecido confirmar la solicitud')  
                confirmationInfo.value = {
                    title:'Presupuesto excedido',
                    text:'¿Confirma la solicitud?',
                    info:'El monto de la solicitud excede el presupuesto del proyecto',
                    type:'warning'
                };
            
                showConfirmation(onModalConfirmAccept,onModalConfirmCancel, confirmationInfo.value);

            }else if(!showConfirm.value &&   currentProjectBudget.value.has_agreement  &&  Number(moneyOrderedData.value.amount) > currentProjectBudget.value.available_balance_with_agreement){
                console.log('Presupuesto excecido no se puede general la solicitud')    
                confirmationInfo.value = {
                    title:'Presupuesto excedido',
                    text:'No se puede generar esta solicitud',
                    info:'El monto de la solicitud excede el presupuesto del proyecto',
                    type:'warning'
                };

                showConfirmation(onModalConfirmAccept,onModalConfirmCancel, confirmationInfo.value);
            }else{
                onLoad();
            }

        }

        const onModalConfirmAccept = () =>{


            hideConfirmation();

            if(!currentProjectBudget.value.has_agreement){
            

                showConfirm.value = true;               

                transactionDate.value = new Date();
            }
        }

        const onModalConfirmCancel = () =>{
            hideConfirmation();
        }

        const onLoad = async () => {


            let errors = false;          

            if (moneyOrderedData.value.amount == 0) {
                amountText.value.showError();
                errors = true;
            }           

            if (moneyOrderedData.value.category == '') {
                categoryText.value.showError();
                errors = true;
            }
            if (moneyOrderedData.value.product == '') {
                itemText.value.showError();
                errors = true;
            }

            if (moneyOrderedData.value.motive == '') {
                motiveText.value.showError();
                errors = true;
            }


            if (!errors) {

                if (!showConfirm.value) {

                    showConfirm.value = true;                    

                    transactionDate.value = new Date();

                } else {

                    uploadMoneyOrdered(moneyOrderedData.value,onMutationFinish);
                }

            }

        }

        const onMutationFinish = ( result ) =>{

            if( result ){

                router.push({name:'cashflow-page'});     
            }
        }



        onMounted(() => {

            setCategories();
            setItems();

        });


        return {
            //Properties
            moneyOrderedData,
            currentProjectBudget,
            currentUserBalance,
            userProfile,  
            showConfirm,
            transactionDate,


            //Refs
            amountText,
            categoryText,
            itemText,
            motiveText,


            //Methods
            onSelect,
            onInput,
            checkBalance,
            onLoad,
            formatAmount,
            formatDate
        }
    }
}
</script>

<style lang="scss" scoped>
.new-money-ordered {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 20% 10%;
    padding: 5px 5px;


}

.money-ordered-data {
    grid-row: 1;
    padding-top: 15px;


}

.confirm-data{
    grid-row: 1;
    display: grid;
    width: 100%;
    grid-template-columns: repeat(2,1fr);  
    gap: 5px;
    font-family: RobotoLight;
    font-size: 1.3em;
    
    padding: 20px 0;
    align-content: flex-start;
    justify-content: flex-end;
    margin-bottom: 10px;

    p{
        margin: 0;
        padding: 0;        
        transition: all var(--animation-duration) var(--animation-type);   
        justify-self: flex-end;
    }

    hr{
      
        grid-column: 1/-1;
    }

  

    .confirm-question{
        width: 100%;
        grid-column: 1/-1;
        text-align: center;
        margin: 20px 0;
        padding: 0;
        
       
    } 
}

.balances{
    grid-row: 2;
    color: var(--light-text-color);
    font-family: RobotoLight;
    font-size: 1em;

    p{
        margin: 0;
        padding: 0;
        transition: all var(--animation-duration) var(--animation-type);
    }
}

.actions {
    grid-row: 3;
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