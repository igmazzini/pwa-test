<template>
    <div class="money-ordered-detail-container">
        <div v-if="currentMoneyOrdered" class="money-ordered--title">
            <p  >Solicitud: {{ currentMoneyOrdered?.money_ordered_code }}</p>
            <p  class="status">Estado: <span :class="currentMoneyOrdered?.status.toLowerCase()">{{
                getStatus(currentMoneyOrdered?.status)
            }}</span></p>
        </div>
        <div v-if="currentMoneyOrdered" class="money-ordered">
            

            <TextField :label="'Fecha'" :text="formatDate(currentMoneyOrdered?.date_created)" :withCopy="false" />
            <TextField :label="'Monto'" :text="formatAmount(currentMoneyOrdered?.amount)" :withCopy="false" />
            <TextField :label="'Solicitante'" :text="currentMoneyOrdered?.profile.name" :withCopy="false" />
            <TextField :label="'Item'" :text="currentMoneyOrdered?.product.product_name" :withCopy="false" />      
            <TextField :label="'Motivo'" :text="currentMoneyOrdered?.extra_data?.reason" :withCopy="false" />
            <TextField v-if="mobile" :label="'Estado'" :text="getStatus(currentMoneyOrdered?.status)" :withCopy="false" />

            <div class="money-ordered-detail-actions">
                <button v-if="currentMoneyOrdered?.status.toLowerCase() != 'paid'"  class="cta-button" @click="onCancel">{{ lblCancel }}</button>
                <button v-if="currentMoneyOrdered?.status.toLowerCase() == 'pending'" class="cta-button btn-pay" @click="onPay">{{ lblPay }}</button>
            </div>
           <!--  <p class="last-update">Ultima modificación: {{ formatDate(currentMoneyOrdered?.date_lastupdate) }} {{
            (currentMoneyOrdered?.last_update_user) ? `por ${currentMoneyOrdered?.last_update_user.name}` : '' }}</p> -->
        </div>

     
        <p v-if="currentMoneyOrdered && currentMoneyOrdered.log" class="last-updated">Ultima actualización: {{formatDate(currentMoneyOrdered.log?.date, true)}} por {{currentMoneyOrdered.log?.by.name}}</p>
    </div>
</template>

<script>
import { ref } from 'vue';
import {TextField} from '@/modules/shared/components';
import { useUI } from '@/modules/shared/composables/useUI';
import { useMoneyOrdered } from '@/modules/projects/composables';

export default {
    name: "MoneyOrderedDetail",
    components: {
        TextField,
    },
       emits: [
        'on-approve',
        'on-pay',
    ],

    setup(props, context) {

        const { formatAmount, formatDate, mobile, getStatus } = useUI();    
        const { currentMoneyOrdered } = useMoneyOrdered()   
        const lblCancel = ref('Cancelar');
        const lblPay = ref('Pagar');

       

        const onApprove = () => {

            context.emit('on-approve');            

        }
        const onCancel = () => {

            context.emit('on-cancel');            

        }
        const onPay = () => {          

            context.emit('on-pay');

        }

      

        return {
            //Properties
            lblCancel,
            lblPay,
            mobile,
            currentMoneyOrdered,


            //Methods
            onApprove,
            onCancel,
            onPay,
            formatAmount,
            formatDate,
            getStatus
        }
    }
}
</script>

<style lang="scss" scoped>
.money-ordered-detail-container {

    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow: hidden;
    padding: 10px;
    position: relative;
    font-family: RobotoLight;
    color: var(--light-text-color);





}


.money-ordered--title{
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

.dark .money-ordered--title p {
    color: var(--dark-text-color);
}

.not-request {
    margin: 0;
    padding: 0;
    font-size: 1.5em;
    transition: all var(--animation-duration) var(--animation-type);
}

.money-ordered {

    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;


    .text-field-container {

        margin-bottom: 15px;

    }
}



.dark .money-ordered-detail {
    color: var(--dark-text-color);
}





.last-update {
    margin: 0;
    padding: 0;
    margin-top: 30px;
    margin-left: auto;
    font-size: 1em;
    font-family: RobotoLight;
    color: inherit;
    transition: all var(--animation-duration) var(--animation-type);

}

.dark .money-ordered-detail-container .text-field-container {
    background-color: var(--dark-background-color);
}


.money-ordered-detail-actions {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: auto;


}

.cta-button {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    color: var(--dark-text-color);
    background-color: var(--background-color);
    font-size: 1.3em;
    border: none;
    outline: none;
    padding: 8px 15px;
   

}

.btn-pay {
    
    margin-left: 15px;
}

.cta-button:active {
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


@media screen and (max-width:1300px) {
    .money-ordered-detail-container .text-field-container {
        background-color: var(--light-background-color);
    }

    .money-ordered-detail-actions {

        justify-content: flex-end;
    }

    .cta-button {
        padding: 5px 15px;
    }

    .money-ordered--title{
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: flex-start;
       
       
        
        p,
        p:last-child
        {
            font-size: 1em;
        }
    }  


    .last-updated{
        padding-top: 10px;
    }


}
</style>