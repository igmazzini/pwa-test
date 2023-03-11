<template>
    <div class="new-money-assigned">
        <div v-if="!showConfirm" class="money-assigned-data">
            <TextField ref="userText" @click="onSelect('user')" :label="'Usuario'" :text="moneyAssignedData.user_name" />           
            <TextField ref="amountText" @click="onInput('amount')" :label="'Monto'" :text="moneyAssignedData.amount" :type="'money'" />
            <TextField ref="motiveText" @click="onInput('motive')" :label="'Motivo'" :text="moneyAssignedData.motive" />
        </div>
        <div v-if="showConfirm" class="confirm-data">
            <strong>Asignado a:</strong><p>{{moneyAssignedData.user_name}}</p>
            <strong>Monto:</strong><p>{{formatAmount(moneyAssignedData.amount)}}</p>
            <strong>Fecha:</strong><p>{{formatDate(transactionDate)}}</p>           
            <strong>Motivo:</strong><p v-if="moneyAssignedData.motive != ''">{{moneyAssignedData.motive}}</p><p v-if="moneyAssignedData.motive == ''">---</p>
            <hr>
            <p class="confirm-question">¿Confirma la asignación?</p>   
            <hr>
        </div>
        <div class="balances">
            <p>Balance disponible: {{ formatAmount(currentUserBalance?.balance) }}</p>    
            <p>Balance de usuario: {{ (currentProfileBalance) ? formatAmount(currentProfileBalance?.balance) : '---'}}</p>   
        </div>
        <div class="actions">
            <button v-if="showConfirm" @click="showConfirm = false" class="cta">Cancelar</button>
            <button @click="onAccept" class="cta">{{lblAceptar}}</button>
        </div>
       
    </div>
</template>

<script>
import { ref, watch, onMounted} from 'vue';
import { useRouter } from 'vue-router';
import { TextField } from '@/modules/shared/components';
import { useMobileUI, useUI, } from "@/modules/shared/composables";
import { useProfiles } from '@/modules/profiles/composables/useProfiles';
import { useMoneyAssigned } from '@/modules/projects/composables/money-assigned/useMoneyAssigned';


export default {
    name:'NewMoneyAssigned',
    components:{
        TextField
    },  
    props:{
        class:{
            default:null
        }
    },
    setup () {

        //PROPERTIES
        const router = useRouter();
        const { formatAmount, formatDate } = useUI();
        const { showUI, hideUI } = useMobileUI();
        const { profiles,  getProfileBalance, currentUserBalance } = useProfiles();   
        const { uploadMoneyAssigned } = useMoneyAssigned();             
        const profileOptions = ref([]);
        const showConfirm = ref(false);
        const lblAceptar = ref('Asignar');
        const transactionDate = ref('');
        const currentProfileBalance =  ref(null);
        

       const moneyAssignedData = ref({
            user:'',
            user_name:'',
            amount:'',
            motive:''

        });


        //REFS
        const userText = ref(null);
        const amountText = ref(null);
        const motiveText = ref(null);


        watch(profiles, ()=>{
            setProfiles();
        });


        //METHOS
        const setProfiles = () =>{
            profileOptions.value = profiles.value.map( ( profile ) =>{
           
                return {
                    label:profile.name,
                    value:profile.user,
                    profileId:profile.profile_id
                }
            });
        }

        const onSelect = (target) => {



            switch (target) {
                case 'user':

                    showUI('select', onSelectAccept, onSelectCancel, { title: 'Usuario', target, options: profileOptions.value });

                    break;               

                default:
                    break;
            }



        }

        const onSelectAccept = ({ option }) => {


            moneyAssignedData.value.user = '';
            moneyAssignedData.value.user_name = '';           

            if(!option) return;             

            moneyAssignedData.value.user_name = option.label;
            moneyAssignedData.value.user = option.value;

            currentProfileBalance.value = getProfileBalance(option.profileId); 

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

                    moneyAssignedData.value.amount = text;
                    break;

                case 'motive':

                    moneyAssignedData.value.motive = text;
                    break;

                default:
                    break;
            }
            hideUI();
        }

        const onInputCancel = () => {

            hideUI();
        }


        const onAccept = async () =>{
            

            let errors = false;

            if(moneyAssignedData.value.user == ''){
                userText.value.showError();
                errors = true;
            }
            if(moneyAssignedData.value.amount == 0){
                amountText.value.showError();
                errors = true;
            }
            
            console.log(moneyAssignedData.value.amount)

            if(moneyAssignedData.value.amount > currentUserBalance.value?.balance){
               
                amountText.value.showError(`Balance insuficiente ( ${formatAmount(currentUserBalance.value?.balance)} )`);
                errors = true;
            }
            if(moneyAssignedData.value.motive == ''){
                motiveText.value.showError();
                errors = true;
            }            
          

            if(!errors){

                if(!showConfirm.value){

                    showConfirm.value = true;

                    lblAceptar.value = 'Confirmar';

                    transactionDate.value = new Date();

                }else{

                    uploadMoneyAssigned(moneyAssignedData.value, onFinishMutation);
                }          
               
            }
                      
        }

        const onFinishMutation = ( result ) =>{
            if( result ){
                router.push({name:'cashflow-page'});    
            }
        }


        onMounted(() => {
            setProfiles();
        })
        

        return {
            //Properties
            moneyAssignedData,
            showConfirm,
            lblAceptar,
            transactionDate,
            currentUserBalance,
            currentProfileBalance,


            //Refs
            userText,
            amountText,
            motiveText,


            //Methods
            formatAmount,
            formatDate,
            onSelect,
            onInput,
            onAccept
        }
    }
}
</script>

<style lang="scss" scoped>
.new-money-assigned {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 20% 10%;
    padding: 5px 5px;


}

.money-assigned-data {
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

    hr:nth-child(9){
        margin-top: 30%;
       
      
    }

    .confirm-question{
        width: 100%;
        grid-column: 1/-1;
        text-align: center;
        margin: 0;
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