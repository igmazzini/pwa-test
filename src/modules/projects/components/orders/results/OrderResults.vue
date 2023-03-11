<template>
  
    <ul v-if="ordersSearchResults?.length > 0">
        <li @click="onResultTap(order)" class="result-item" v-for="order in ordersSearchResults" :key="order">               
                
                <p>{{order?.order_code}}</p>
                <p>{{substring(order?.company?.company_name,15)}}</p>      
                <p>{{substring(order?.category?.category_name,30)}}</p>                   
                <p>{{order?.status}}</p> 
                <p>{{formatAmount(order?.amount)}}</p> 
        </li>
    </ul>

    <p v-if="ordersSearchResults?.length === 0" class="emptyResults">No hay resultados para esta busqueda</p>
  
</template>

<script>
import { onUnmounted } from 'vue';
import { useOrders } from '@/modules/projects/composables/orders/useOrders';
import { useUI } from '@/modules/shared/composables/useUI';



export default {
    name:'RequestResults',
    emits:['on-select-result'],
    setup(props, context){

        const { ordersSearchResults, clearSearchResults } = useOrders();
        const { formatAmount, substring } = useUI();

        const onResultTap = ( order ) =>{
            context.emit('on-select-result', order);
        }


        onUnmounted( ()=>{
            clearSearchResults();
        })

        
        return{
            ordersSearchResults,
            substring,
            formatAmount,
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

.emptyResults{
    font-family: RobotoLight;
    color: var(--light-text-color);
    width: 100%;
    margin: 0;
    padding: 15px;
    transition: all var(--animation-duration) var(--animation-type);
}


.result-item{
    width: 100%;
    height: 50px;
    min-height: 50px;
    background-color: var(--light-background-color);      
    transition: all var(--animation-duration) var(--animation-type);
    display: grid;   
    grid-template-columns: 10% 1fr 40% 10% 20%;
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

.dark p{
   
    color: var(--dark-text-color);
  
}


</style>
