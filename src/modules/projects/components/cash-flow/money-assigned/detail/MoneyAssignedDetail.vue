<template>
    <div class="money-assigned-detail-container">
        <div v-if="currentMoneyAssigned"  class="money-assigned--title">
            <p >Asignación: {{ currentMoneyAssigned?.money_assigned_code }}</p>
            <p class="status">Estado: <span :class="currentMoneyAssigned?.status.toLowerCase()">{{
                getStatus(currentMoneyAssigned?.status)
            }}</span></p>
        </div>
        <div v-if="currentMoneyAssigned" class="money-assigned-detail">
            <TextField :label="'Fecha'" :text="formatDate(currentMoneyAssigned?.date_created)" :withCopy="false"/>
            <TextField :label="'Monto'" :text="formatAmount(currentMoneyAssigned?.amount)" :withCopy="false"/>
            <TextField :label="'Asignado a'" :text="currentMoneyAssigned?.assigned_to_profile.name" :withCopy="false"/>
            <TextField :label="'Asignado por'" :text="currentMoneyAssigned?.assigned_by_profile.name" :withCopy="false"/>
            <TextField v-if="currentMoneyAssigned?.product" :label="'Item'" :text="currentMoneyAssigned?.product.product_name" :withCopy="false"/>       
            <TextField :label="'Motivo'" :text="currentMoneyAssigned?.extra_data?.reason" :withCopy="false"/>


        </div>

   
    <p v-if="currentMoneyAssigned && currentMoneyAssigned.log" class="last-updated">Ultima actualización: {{formatDate(currentMoneyAssigned.log?.date, true)}} por {{currentMoneyAssigned.log?.by.name}}</p>
    </div>
</template>

<script>
import {TextField} from '@/modules/shared/components';
import { useUI } from '@/modules/shared/composables/useUI';
import { useMoneyAssigned } from '@/modules/projects/composables';

export default {
    name: "MoneyAssignedDetail",
    components:{
        TextField,       
    },   
    emits:[
        'on-update'
    ],
    
    setup () {
        
        const { formatAmount, formatDate, getStatus} = useUI();  
        const {currentMoneyAssigned } = useMoneyAssigned();  

      

      

        return {
           

            //Methods          
            formatAmount,
            formatDate,
            getStatus,
            currentMoneyAssigned
          
        }
    }
}
</script>

<style lang="scss" scoped>

.money-assigned-detail-container{

    width: 100%;  
    height: 100%;    
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;     
    overflow: hidden;   
    padding: 10px;       
    padding-top: 30px;
    position: relative;
    font-family: RobotoLight;
    color: var(--light-text-color) ;
    
    
  /*   p{
        margin: 0;
        padding: 0;
        font-size: 1.5em;
        transition: all var(--animation-duration) var(--animation-type);
        
    } */

   
}

.money-assigned--title{
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: flex-start;
    padding: 10px 0;
   

    p{
        color: var(--light-text-color);
        font-family: RobotoLight;
        font-size: 1.4em;
        transition: all var(--animation-duration) var(--animation-type);
        margin: 0;
    }


    p:nth-child(2){
        margin-left: auto;
        margin-right: 5px;
       
    }

    p:last-child{
        font-size: 1.250em;
    } 
   
}

.dark .request-detail--title p {
    color: var(--dark-text-color);
}

.dark .money-assigned-detail{
    color: var(--dark-text-color);
}

.money-assigned-detail{

    width: 100%; 
    height: 100%;     
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;    
    .text-field-container{
        
        margin-bottom: 15px;
        
    }
}

.dark .money-assigned-detail .text-field-container{
    background-color: var(--dark-background-color);
}


.money-assigned-detail-actions{
    width: 100%;   
    display: flex;
    align-items: center;
    justify-content: flex-start;   
    margin-top: 16%; 
}

.cta-button{
    display: flex;
    align-items: center;
    justify-content: center;      
    border-radius: 16px;      
    color:var(--dark-text-color);
    background-color: var(--background-color);
    font-size: 1.3em;
    border: none;
    outline: none;    
    padding: 8px 15px;
    margin-top: 20px;
}

.btn-pay{
    background-color: var(--warning-color);
}

.cta-button:active{
    background-color: var(--button-active-color-light);
}

.last-updated{
    margin: 0;
    margin-left: auto;
    margin-top: auto;
    margin-bottom: 5px;
    margin-right: 5px;
    padding: 0;
    font-family: RobotoLight;
    color: var(--ligth-subtitle-color);
    font-size: 0.850em;
   
}


@media screen and (max-width:1300px){

    .money-assigned-detail{
        padding-top: 0;
    }
    .money-assigned-detail .text-field-container {
        background-color: var(--light-background-color);
    }

    .money-assigned-detail-actions{

        justify-content: flex-end;  
    }

    .cta-button{
        padding: 20px 40px;
    }

    .money-assigned--title{   
       
       
        
        p,
        p:last-child
        {
            font-size: 1em;
        }
    }  
   
    
}

</style>