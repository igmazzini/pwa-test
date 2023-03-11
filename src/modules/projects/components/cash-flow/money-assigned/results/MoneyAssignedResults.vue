<template>
  
    <ul v-if="moneyAssignedResults?.length > 0">
        <li @click="onResultTap(moneyAssigned)" class="result-item" v-for="moneyAssigned in moneyAssignedResults" :key="moneyAssigned.money_assigned_id">
               
                <p>{{ moneyAssigned?.money_assigned_code }}</p>               
                <p>{{ moneyAssigned?.assigned_to_profile?.name }}</p>               
                <p>{{ moneyAssigned?.assigned_by_profile?.name }}</p>               
                <p  v-if="!mobile">{{substring(moneyAssigned?.extra_data?.motive,40)}}</p>                                    
                <p>{{formatAmount(moneyAssigned?.amount)}}</p>                 
        </li>
    </ul>

    <p v-if="moneyAssignedResults?.length == 0">No hay resultados</p>
  
</template>

<script>
import { useMoneyAssigned } from '@/modules/projects/composables';
import { onUnmounted } from 'vue';
import { useUI } from '@/modules/shared/composables/useUI';

export default {
    name:'MoneyAssignedResults',
    emits:['on-select-result'],
    setup(props, context){

        const { moneyAssignedResults, clearSearchResults } = useMoneyAssigned();       
        const { formatAmount, substring, mobile} = useUI()
       

        const onResultTap = ( moneyAssigned ) =>{
            context.emit('on-select-result', moneyAssigned);
        }

        


        onUnmounted( ()=>{
            clearSearchResults();
        })

        
        return{
            moneyAssignedResults,    
            mobile,      
            substring,
            formatAmount,           
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
    grid-template-columns: 10% 20% 18% 1fr 18%;
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
        grid-template-columns: 15% 30% 30% 1fr;
    }
}
</style>
