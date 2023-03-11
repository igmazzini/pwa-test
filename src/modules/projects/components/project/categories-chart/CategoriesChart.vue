<template>
  <Doughnut
    :chart-options="chartOptions"
    :chart-data="chartData"
    :width="325"
    :height="300"
  
 
  />
  <div id="legend-container"></div>
</template>

<script>
import { Doughnut } from "vue-chartjs";
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
import { watch,ref } from 'vue';
import { useUI  } from "@/modules/shared/composables";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

export default {
  name: "CategoriesChart",
  components: {
    Doughnut,
  },
  setup() {

    const { darkMode } = useUI();

    const chartData = {
        labels: ["Movilidad", "Tefelonia", "Comidas",],
        datasets: [
          {
           
            data: [45,30,25],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
            ],
            borderWidth: 1,
          },
        ],
      }

    const labelsColor = (darkMode.value) ? '#ffffffcc' : '#000000b3';  

 
   /* console.log('--> ',ChartJS.defaults.plugins.legend.labels.generateLabels)
   const test = ChartJS.defaults.plugins.legend.labels.generateLabels; */
   
    
    const chartOptions =  ref({     
        plugins:{
            htmlLegend: {
                // ID of the container to put the legend in
                containerID: 'legend-container',
            },
            legend:{              
                position:'right',
                labels:{
                    padding:15,
                    color:labelsColor,       
                    generateLabels(chart) {                    
                   
                    let labels = [];
                    for (let i = 0; i < chart.data.labels.length; i++) {
                      
                    
                      labels.push({
                        text:`${chart.data.datasets[0].data[i]}% ${chart.data.labels[i]}`,
                        fillStyle: chart.data.datasets[0].backgroundColor[i]
                      });
                      
                    }

                    return  labels;
                    
                    }          
                }
                
            }
        },
        responsive: false,
        maintainAspectRatio: false,
      });

    watch(()=>darkMode, async (newQuestion, oldQuestion) => {

        if(newQuestion != oldQuestion){
            
            if(darkMode.value){
                chartOptions.value.plugins.legend.labels.color = '#ffffffcc';
            }else{
                chartOptions.value.plugins.legend.labels.color = '#000000b3';
            }
        }   
       
    })

    return {
      chartData,
      chartOptions    

    };
  },
};
</script>

<style lang="scss" scoped>

.dark #doughnut-chart{
   
    ul li{
        color: white;
    }
}

</style>