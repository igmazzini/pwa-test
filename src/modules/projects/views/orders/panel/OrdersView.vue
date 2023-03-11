<template>
    <div class="orders-container">
       <!--  <div class="orders-totals">
            <div class="orders-totals-item">
                <p>Pendientes</p>
                <p>{{ pendingOrders }}</p>
            </div>
            <div class="orders-totals-item">
                <p>Pagadas</p>
                <p>{{ paidOrders }}</p>
            </div>
            
        </div> -->
        <div class="orders-chart">
            <div class="orders-chart--actions">
                <span @click="currentTarget = 'pending'" :class="['chart-cta',(currentTarget == 'pending') ? 'chart-cta-active' : '']">Pendientes: <span>{{ pendingOrders }}</span></span>
                <span @click="currentTarget = 'paid'"  :class="['chart-cta',(currentTarget == 'paid') ? 'chart-cta-active' : '']">Pagadas: <span>{{ paidOrders }}</span></span>
            </div>
            <div  class="orders-chart-container">
                <p v-if="!empty" class="orders-chart-container-total">{{ formatAmount(total) }}</p>
                <p v-if="currentTarget == 'pending' && empty && !ordersDetailByCategoryQuery.isLoading.value" class="empty">Sin ordenes pendientes</p>
                <p v-if="currentTarget == 'paid' && empty && !ordersDetailByCategoryQuery.isLoading.value" class="empty" >Sin ordenes pagadas</p>
                <Doughnut v-if="!ordersDetailByCategoryQuery.isLoading.value && !empty" :chart-options="chartOptions" :chart-data="chartData" :width="275" :height="225" />
                <AnimatedPlaceholder v-if="ordersDetailByCategoryQuery.isLoading.value" :width="'225px'" :height="'225px'" :border-radius="'225px'"/>
            </div>
           
            <button  @click="onSearch" class="cta-button cta-search"><font-awesome-icon class="search-icon"
            icon="fa-solid fa-magnifying-glass" />
            </button>
            <button @click="onAddNew"
            :class="['cta-button']"><font-awesome-icon
                icon="fa-solid fa-plus" />
            </button>
                
        </div>
        <div class="orders-list-container">
            <div class="orders-list">
                <div class="orders-list-item" v-for="order of ordersDetailByCategories[currentTarget]" :key="order" >
                    <span :style="getItemColor(order)" ></span>
                    <p>{{substring(order[1],25)}}</p>
                    <p>{{ (order[2]  * 100 / total).toFixed()}}%</p>
                    <p>{{formatAmount(order[2])}}</p>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { Doughnut } from "vue-chartjs";
import { getColor } from '@/helpers/utils.js';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  BarElement,
  LinearScale,
  ArcElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);
import {ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUI } from '@/modules/shared/composables';
import { useOrders, useProject }  from '@/modules/projects/composables';
import {AnimatedPlaceholder} from '@/modules/shared/components';


export default {
    name: "OrdersView",
    components: {
        Doughnut,
        AnimatedPlaceholder
    },
    setup () {

        const router = useRouter();
        const { formatAmount, darkMode, substring } = useUI();
        const { currentProject } = useProject();
        const { pendingOrders, paidOrders, ordersDetailByCategories,ordersDetailByCategoryQuery} = useOrders(currentProject.value?.project_id);
       
        const labelsColor = darkMode.value ? "#ffffffcc" : "#000000b3";
        const total = ref(0);    
        const currentTarget = ref('pending'); 
        const empty = ref(true);
       

        const chartData = ref({
            labels: [],
            datasets: [
                {
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,

                },             
               
            ]

        });

        const chartOptions = ref({
            plugins: {
                htmlLegend: {
                // ID of the container to put the legend in
                containerID: "legend-container",
                },
                legend: {
                position: "bottom",
                display: false,
                labels: {
                    padding: 15,
                    color: labelsColor,
                    generateLabels(chart) {
                    let labels = [];
                    for (let i = 0; i < chart.data.labels.length; i++) {
                        labels.push({
                        text: `${chart.data.datasets[0].data[i]}% ${chart.data.labels[i]}`,
                        fillStyle: chart.data.datasets[0].backgroundColor[i],
                        });
                    }

                    return labels;
                    }
                },
                },
            },
            responsive: false,
            maintainAspectRatio: false,
        });

        watch( () => darkMode,  () => {        
            if (darkMode) {
                chartOptions.value.plugins.legend.labels.color = "#ffffffcc";
            } else {
                chartOptions.value.plugins.legend.labels.color = "#000000b3";
            }            
            
        });

        watch(ordersDetailByCategories,() => {
            setChartData();
        });
        watch(currentTarget,() => {
            setChartData();

        });

        //METHODS


      
        const setChartData = (  ) => {          

           

            if (ordersDetailByCategories.value[currentTarget.value]) {

                if(ordersDetailByCategories.value[currentTarget.value].length == 0){
                    empty.value = true;     
                }else{
                    empty.value = false;
                }

                chartData.value.labels = [];
                chartData.value.datasets[0].data = [];
                chartData.value.datasets[0].backgroundColor = [];
                chartData.value.datasets[0].borderColor = [];

                total.value = 0;

                ordersDetailByCategories.value[currentTarget.value].forEach((d) =>{
                    total.value += d[2]
                })             

                ordersDetailByCategories.value[currentTarget.value].forEach((d, index) => {

                  
                    const color = getColor(index)
                    chartData.value.labels.push(`${d[1]}`);
                    chartData.value.datasets[0].data.push( (d[2]  * 100 / total.value).toFixed());
                    chartData.value.datasets[0].backgroundColor.push(color);

                    //chartData.value.datasets[0].borderColor.push(color);
                    chartData.value.datasets[0].borderColor.push('rgba(245, 245, 245, 0.50)');
                    d.color = color;
                    
                });


                
            }
           
        }

        const getItemColor = (order) => {

            return `background-color: ${order.color};`;
        }

        const onSearch = () =>{
            router.push({name:'orders-history-page'});
        }
        const onAddNew = () =>{
            router.push({name:'new-order-page'});
        }


        onMounted(() => {
            
         
            setChartData();
        })    

        return {
            //Properties
            ordersDetailByCategoryQuery,
            ordersDetailByCategories,
            chartOptions,
            chartData,
            pendingOrders,
            paidOrders,
            currentTarget,
            total,
            empty,

            //Methods
            formatAmount,
            substring,
            getItemColor,
            onSearch,
            onAddNew
           
        }
    }
}
</script>

<style lang="scss" scoped>
.orders-container{
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows:  1fr 40%;
    padding: 10px;
}

.orders-totals{
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 50px;
    margin: 0 auto;
    padding: 5px;   
    background-color: var(--light-background-color);
    border-radius: 16px;

   
}

.orders-totals-item{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;   
    font-size: 1.4em;
    color: var(--light-text-color);

    p{
        margin: 0;
        padding: 0;
        font-family: RobotoLight;
        transition: all var(--animation-duration) var(--animation-type);
    }

    p:last-child{
        font-weight: bold;
    }

   
    

}


.orders-chart{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    max-height: 400px;
    border-radius: 16px;
    width: 100%;
    background-color: var(--light-background-color);
    position: relative;

}

.orders-chart--actions{
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    padding: 10px;
    
}

.orders-chart-container{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 250px;
    position: relative;
   


    p{
        margin: 0;
        padding: 0;
        position: absolute;        
        display: inline-block;       
        font-size: 1.4em;
        font-family: RobotoLight;        
        transition: all var(--animation-duration) var(--animation-type);


    }
    .empty{
        font-size: 1.6em;
       
    }
       
}

.chart-cta{
    border: none;
    outline: none;
    padding: 3px 10px;  
    font-family: RobotoRegular;
    font-size: 1.4em;
    border-bottom: 2px solid transparent;

    span{
        margin: 0;
        padding: 0;
        font-weight: bold;
    }
    
}


.chart-cta:nth-child(1) span {
    color: var(--warning-color);
}
.chart-cta:nth-child(2) span {
    color: var(--success-color);
}

.chart-cta-active{
    
    border-bottom: 2px solid var(--button-active-color-light);
}


.cta-button{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 45px;
        height: 45px;
        border-radius: 100px;
        position: absolute;
        bottom:10px;
        right:10px;
        color:var(--dark-text-color);
        background-color: var(--background-color);
        font-size: 1.8em;
        border: none;
        outline: none;
    }

     .cta-search{
        font-size: 1.6em;
        left:10px;
     }

    .cta-button:active{
        background-color: var(--button-active-color-light);
    }

    .disabled{
        pointer-events: none;
        background-color: rgba(0, 0, 0, 0.218);
    }

.orders-list-container{
    width: 100%;
    height: 100%;
    position: relative;   
  
   
}

.orders-list{
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: 5px;
    padding-bottom: 10px;
}

.orders-list-item{
    width: 100%;
    height: 50px;
    background-color: var(--light-background-color);
    border-radius: 16px;
    color: var(--light-text-color);
    display: grid;
    grid-template-columns: 5% 1fr 15% 25%;
    align-items: center;
    margin: 0 0 8px 0;
    padding: 5px;
    padding-right: 5px;
    transition: all var(--animation-duration) var(--animation-type);

    p{
        margin: 0;
        padding: 0;
        font-family: RobotoLight;
        font-size: 1.3em;
        display: inline-block;
        transition: all var(--animation-duration) var(--animation-type);
    }

    span{
        height: 10px;
        width: 10px;
        border-radius: 10px;
        background-color: rgba(255, 99, 132, 0.2);
        margin-right: 5px;
        border: 1px solid rgba(245, 245, 245, 0.2);
    }

   
    
}


.dark .orders-totals,

.dark .orders-chart,
.dark .orders-list-item{

    background-color: var(--dark-background-color);
    color: var(--dark-text-color);
}

</style>