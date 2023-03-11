<template>

    <div class="modal-layout">
        <div class="modal-title">
            <p>Asignación de efectivo</p>
        </div>
        <div v-show="!showConfirm" class="modal-form animate__animated animate__fadeInLeft animate__faster">
            <Select ref="selectProfileRef" :label="'Usuario'" :options="profileOptions" @option-selected="onProfileSelected"/> 
            <Input ref="amountInputRef" v-model="requestData.amount" :label="'Monto'" :type="'money'"/>          
            <Input ref="motiveInputRef" v-model="requestData.motive" :label="'Motivo'" />    
           
                
        </div>
        <div v-show="showConfirm" class="confirm-modal-form animate__animated animate__fadeInRight animate__faster">
            <div class="confirm-modal-form-row"><p>Asignando efectivo a:</p><p>{{selectedUserName}}</p></div>
            <div class="confirm-modal-form-row"><p>Monto:</p><p>{{formatAmount(requestData.amount)}}</p></div>
            <div class="confirm-modal-form-row"><p>Fecha:</p><p>{{formatDate(transactionDate)}}</p></div>            
            <div class="confirm-modal-form-row"><p>Motivo:</p><p v-if="requestData.motive != ''">{{requestData.motive}}</p><p v-if="requestData.motive == ''">---</p></div>            
            <p class="confirm-question">¿Confirma la asignación?</p>
        </div>
        <div class="modal-actions">
            <div v-show="!showConfirm"  class="modal-balances">
                <p>Balance disponible: {{ formatAmount(currentUserBalance?.balance) }}</p>    
                <p>Balance de usuario: {{ (currentProfileBalance) ? formatAmount(currentProfileBalance?.balance) : '---'}}</p>   
            </div>
            <button @click="onCancel" class="modal-actions--cancel">Cancelar</button>
            <button @click="onAccept" class="modal-actions--accept">{{lblAceptar}}</button>
        </div>
    </div>

  
</template>

<script>
import { watch, ref } from 'vue';

import {Input,Select} from '@/modules/shared/components';
import { useProfiles } from '@/modules/profiles/composables/useProfiles';
import { useUI } from '@/modules/shared/composables/useUI';




export default {
    name:'NewMoneyAssignedModal',
    components:{
        Input,
        Select,       
    },
    props:{
       payLoad:{
        default:null
       }   
    },
    emits:[
        'on-cancel',
        'on-accept'
    ],
    setup(props,context){

        const { formatAmount, formatDate } = useUI();
        const { profiles,  getProfileBalance, currentUserBalance, userProfile } = useProfiles();                
        const profileOptions = ref([]);
        const selectProfileRef = ref(null);
        const amountInputRef = ref(null);
        const motiveInputRef = ref(null);
        const showConfirm = ref(false);
        const lblAceptar = ref('Asignar');
        const selectedUserName = ref('');
        const transactionDate = ref('');
        const currentProfileBalance =  ref(null);
        
        const requestData = ref({
            user:'',
            amount:0,
            motive:''

        });  

       
        

        profileOptions.value = profiles.value.filter(p => p.user != userProfile.value.user ).map( ( profile ) =>{
           
            return {
                label:profile.name,
                value:profile.user,
                profileId:profile.profile_id
            }
           
        });



        watch(profiles, ()=>{

            profileOptions.value = profiles.value.filter(p => p.user != userProfile.value.user ).map( ( profile ) =>{
           
                return {
                    label:profile.name,
                    value:profile.user,
                    profileId:profile.profile_id
                }
            });

        });

        const onProfileSelected = ( option ) =>{

            requestData.value.user = '';
            selectedUserName.value = '';
            
            if(!option) return;   
            
            selectedUserName.value = option.label;

            requestData.value.user = option.value;
           
            currentProfileBalance.value = getProfileBalance(option.profileId); 

            
        }
       

        const onCancel = () =>{

            if(showConfirm.value){

                showConfirm.value = false;

                lblAceptar.value = 'Asignar';

            }else{

                context.emit('on-cancel');
                
            }   
            
        }

        const onAccept = async () =>{
            

            let errors = false;

            if(requestData.value.user == ''){
                selectProfileRef.value.checkError();
                errors = true;
            }
            if(requestData.value.amount == 0){
                amountInputRef.value.checkError();
                errors = true;
            }
           

            if(requestData.value.amount > currentUserBalance.value?.balance){
                amountInputRef.value.showError(`Balance insuficiente ( ${formatAmount(currentUserBalance.value?.balance)} )`);
                errors = true;
            }
            if(requestData.value.motive == ''){
                motiveInputRef.value.checkError();
                errors = true;
            }
            

            if(!errors){

                if(!showConfirm.value){

                    showConfirm.value = true;

                    lblAceptar.value = 'Confirmar';

                    transactionDate.value = new Date();

                }else{

                    context.emit('on-accept',requestData.value); 
                }          
               
            }
                      
        }



        return{
            profileOptions, 
            selectProfileRef,
            amountInputRef,  
            motiveInputRef,                  
            currentProfileBalance,      
            currentUserBalance,    
            onProfileSelected, 
            transactionDate,
            selectedUserName,
            requestData,   
            lblAceptar,  
            showConfirm,
            formatAmount,
            formatDate,
            onCancel,
            onAccept
        }
    }

}
</script>

<style lang="scss" scoped>
@import "./new-money-assigned-modal.scss";
</style>