<template>
  
    <ul v-if="expenseReportsResults?.length > 0">
        <li @click="onResultTap(expenseReport)" class="result-item" v-for="expenseReport in expenseReportsResults" :key="expenseReport.expense_report_id">
                         
            <p>{{expenseReport.expense_report_code}}</p>
            <p>{{expenseReport.product?.product_code}} {{substring(expenseReport.product?.product_name,(mobile) ? 10 : 40)}}</p>                      
            <p>{{formatDate(expenseReport.date_created)}}</p> 
            <p>{{formatAmount(expenseReport.amount)}}</p> 
        </li>
    </ul>

    <p v-if="expenseReportsResults?.length == 0">No hay resultados</p>
  
</template>

<script>
import { useExpenseReports } from '@/modules/projects/composables';
import { onUnmounted } from 'vue';
import { useUI } from '@/modules/shared/composables';

export default {
    name:'ExpenseReportResults',
    emits:['on-select-result'],
    setup(props, context){

        const { expenseReportsResults, clearSearchResults } = useExpenseReports();      
        const { formatAmount, formatDate, mobile,substring } = useUI()
       

        const onResultTap = ( expenseReport ) =>{
            context.emit('on-select-result', expenseReport);
        }

        


        onUnmounted( ()=>{
            clearSearchResults();
        })

        
        return{
            mobile,
            expenseReportsResults,            
            substring,
            formatAmount,
            formatDate,
            onResultTap
        }
    }

}
</script>

<style lang="scss" scoped>

ul{
    padding: 0;
    margin: 0;
    width: 100%;    
    border-radius: inherit;
}


p{
    font-family: RobotoLight;
   
    text-align: center;
    margin-top: 25%;
}


.result-item{
    width: 100%;
    height: 50px;
    min-height: 50px;
    background-color: var(--light-background-color);   
    display: grid;   
    grid-template-columns: 15% 1fr 20% 20%;
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

.result-item:last-child{
    border-bottom: none;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
   
}

.dark .result-item{
    background-color: var(--dark-background-color);
    color: var(--dark-text-color);
}

@media screen  and (max-width: 1300px){

    ul{
        border-radius: none;
    }
    .result-item{
   
        display: grid;   
        grid-template-columns: 15% 1fr 25% 25%;
    }

   
}
</style>
