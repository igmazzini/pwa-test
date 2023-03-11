<template>
  
    <ul v-if="moneyOrderedResults?.length > 0">
        <li @click="onResultTap(moneyOrdered)" class="result-item" v-for="moneyOrdered in moneyOrderedResults" :key="moneyOrdered.money_ordered_id">
               
                <p>{{ moneyOrdered?.money_ordered_code }}</p>               
                <p>{{ moneyOrdered?.profile.name }}</p>               
                <p v-if="!mobile">{{moneyOrdered.product?.product_code}} {{substring(moneyOrdered.product?.product_name)}}</p>                                    
                <p>{{formatAmount(moneyOrdered.amount)}}</p> 
                <p>{{getStatus(moneyOrdered.status)}}</p> 
        </li>
    </ul>

    <p v-if="moneyOrderedResults?.length == 0">No hay resultados</p>
  
</template>

<script>
import { onUnmounted } from 'vue';
import { useMoneyOrdered } from '@/modules/projects/composables';
import { useUI } from '@/modules/shared/composables';

export default {
    name:'MoneyOrderedResults',
    emits:['on-select-result'],
    setup(props, context){

        const { moneyOrderedResults, clearSearchResults } = useMoneyOrdered();       
        const { formatAmount, getStatus, mobile, substring } = useUI()
       

        const onResultTap = ( moneyOrdered ) =>{
            context.emit('on-select-result', moneyOrdered);
        }

        


        onUnmounted( ()=>{
            clearSearchResults();
        })

        
        return{
            mobile,
            moneyOrderedResults,            
            substring,
            formatAmount,           
            getStatus,
            onResultTap
        }
    }

}
</script>

<style lang="scss" scoped>


p{
    font-family: RobotoLight;
   
    text-align: center;
    margin-top: 25%;
}

ul{
    padding: 0;
}


.result-item{
    width: 100%;
    height: 50px;
    min-height: 50px;
    background-color: var(--light-background-color);   
    display: grid;   
    grid-template-columns: 10% 20% 1fr 15% 10%;
    margin: 5px 0;
    padding-left: 10px;
    padding-right: 10px;
    align-items: center;
    justify-items: left;
    font-size: 1em;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
   

    p{
        margin: 0;
        font-family: RobotoLight;
    }

    p:last-child{
        margin-left: auto;
    }
}

.dark .result-item{
    background-color: var(--dark-background-color);
    color: var(--dark-text-color);
}

@media screen and (max-width: 1300px){
    .result-item{         
        grid-template-columns: 15% 1fr 30% 20%;
    }
}
</style>
