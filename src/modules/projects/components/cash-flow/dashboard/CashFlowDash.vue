
<template>
  <div class="cashflow-container">
    <div class="cashflow-totals">
      <div class="cashflow-totals-item">
        <p>Solicitado</p>
        <p>{{ formatAmount(currentUserBalance?.amount_in) }}</p>
      </div>
      <div class="cashflow-totals-item">
        <p>Rendido</p>
        <p>{{ formatAmount(currentUserBalance?.amount_out) }}</p>
      </div>
      <div class="cashflow-totals-item">
        <p>Por rendir</p>
        <p>{{ formatAmount(currentUserBalance?.balance) }}</p>
      </div>

    </div>
    <div class="cashflow-chart">
      <div class="cashflow-chart-dates">
        <p @click="onSelectDate('week')" :class="[(dateSelected == 'week') ? 'selected' : '']">Semana</p>
        <p @click="onSelectDate('month')" :class="[(dateSelected == 'month') ? 'selected' : '']">Mes</p>
      </div>
      <p>{{ getCurrentDates() }}</p>
      <div class="cashflow-chart-container">
        <p class="empty" v-if="emptyCashYields && !expenseReportDetailByDatesQuery.isFetching.value">Sin rendiciones en este periodo</p>
        <p v-else-if="total != ''">{{ formatAmount(total) }}</p>
        

        <Doughnut v-if="!expenseReportDetailByDatesQuery.isFetching.value" :chart-options="chartOptions" :chart-data="chartData" :width="275" :height="225" />
        <AnimatedPlaceholder v-if="expenseReportDetailByDatesQuery.isFetching.value" :width="'225px'" :height="'225px'" :border-radius="'225px'"/>

        <button  @click="onSearch" class="cta-button cta-search"><font-awesome-icon class="search-icon"
            icon="fa-solid fa-magnifying-glass" />
        </button>
        <button @click="onAddNew"
          :class="['cta-button']"><font-awesome-icon
            icon="fa-solid fa-plus" />
        </button>
      </div>
    </div>
    <div class="cashflow-list-container">
      <div class="cashflow-list">
        <div @click="onCategoryClick(cashYield)" v-for="(cashYield, index) of cashYields" :key="index"
          class="cashflow-list-item">
          <span :style="getItemColor(cashYield)"></span>
          <p>{{ cashYield.group }}</p>
          <p>{{ getItemPercent(cashYield) }}%</p>
          <p>{{ formatAmount(cashYield.subtotal) }}</p>
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

import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUI } from '@/modules/shared/composables';
import { useExpenseReports } from '@/modules/projects/composables';
import { useProfiles } from '@/modules/profiles/composables';
import {AnimatedPlaceholder} from '@/modules/shared/components';


ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);
export default ({
  name: "CashFlowDash",
  components: {
    Doughnut,
    AnimatedPlaceholder
  },
  props: {
    data: {
      type: Object,
      require: true
    },
    withOrder: {
      type: Boolean,
      default: true
    }
  },
  emits: [
    'on-add-new',
  ],
  setup(props, context) {


    const router = useRouter();
    const dateSelected = ref('week');
    const { formatAmount, darkMode, online } = useUI();
    const { expenseReportsDetailByDates, getExpenseReportsDetailByDates, expenseReportDetailByDatesQuery } = useExpenseReports();
    const { currentUserBalance } = useProfiles();
    const labelsColor = darkMode.value ? "#ffffffcc" : "#000000b3";
    const total = ref('');
    const cashYields = ref([]);
    const emptyCashYields = ref(false);
    let startDate = '';
    let endDate = '';
    const chartData = ref({
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1,

        }
      ]

    });



    const chartOptions = ref({
      plugins: {
        htmlLegend: {
          // ID of the container to put the legend in
          containerID: "legend-container",
        },
        legend: {
          position: "right",
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
            },
          },
        },
      },
      responsive: false,
      maintainAspectRatio: false,
    });



    watch(
      () => darkMode,
      async (newQuestion, oldQuestion) => {
        if (newQuestion != oldQuestion) {
          if (darkMode) {
            chartOptions.value.plugins.legend.labels.color = "#ffffffcc";
          } else {
            chartOptions.value.plugins.legend.labels.color = "#000000b3";
          }
        }
      }
    );

    watch(
      () => props.data,
      async (newQuestion, oldQuestion) => {
        if (newQuestion != oldQuestion) {
          initChart();
        }
      }
    );

    watch(expenseReportsDetailByDates,() => {

        
        setChartData()
      }
    );
  




    const getCurrentDates = () => {

      const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      const now = new Date();
      let firstDay;
      let lastDay;
      let firstDayMonth;
      let lastDayMonth;

      if (dateSelected.value == 'week') {


        let first = now.getDate() - now.getDay(); // First day is the day of the month - the day of the week

        if (now.getDate() < 6) {

          const yesterday = new Date(now.getFullYear(), now.getMonth(), 0)

          //Dias del mes anterior
          const monthDays = yesterday.getDate();

          first = monthDays;

          firstDay = new Date(yesterday.setDate(first));

        } else {

          firstDay = new Date(now.setDate(first));
        }

        const last = first + 6; // last day is the first day + 6

        lastDay = new Date(now.setDate(last));

        firstDayMonth = (firstDay.getMonth() > 0) ? months[firstDay.getMonth() - 1] : months[firstDay.getMonth()];

        lastDayMonth = (lastDay.getMonth() > 0) ? months[lastDay.getMonth() - 1] : months[lastDay.getMonth()];





      } else {


        firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);


        firstDayMonth = months[firstDay.getMonth()];
        lastDayMonth = months[lastDay.getMonth()];

      }



      startDate = firstDay.toISOString();
      endDate = lastDay.toISOString();



      return `${firstDay.getDate()} ${firstDayMonth} - ${lastDay.getDate()} ${lastDayMonth}`;

    }

    const onSelectDate = (date) => {

      dateSelected.value = date;

      getCurrentDates()

      getChatData(props.withOrder);

    }




    const getItemPercent = (request) => {

      return (request.subtotal * 100 / total.value).toFixed(1)
    }
    const getItemColor = (request) => {

      return `background-color: ${request.color};`;
    }

    const onSearch = () => {
      
      router.push({ name: "cashflow-history-page" });
    }

    const onAddNew = () => {
      context.emit('on-add-new');
    }

    const onCategoryClick = (request) => {

      router.push({ name: "cashflow-history-page", params: { group: request.group } });

    }

    const initChart = (data) => {

      chartData.value.labels = [];
      chartData.value.datasets[0].data = [];
      chartData.value.datasets[0].backgroundColor = [];
      chartData.value.datasets[0].borderColor = [];

      data.expense_reports.forEach((req, index) => {

        const color = getColor(index)
        chartData.value.labels.push(req.group);
        chartData.value.datasets[0].data.push(req.subtotal);
        chartData.value.datasets[0].backgroundColor.push(color);

        //chartData.value.datasets[0].borderColor.push(color);
        chartData.value.datasets[0].borderColor.push('rgba(245, 245, 245, 0.50)');
        req.color = color;
      });



    }


    const onFinishMutation = (result) => {
      if (result) {

        setChartData();


      }
    }


    const setChartData = () => {
      const data = expenseReportsDetailByDates.value;


      total.value = data.total;

      cashYields.value = data.expense_reports;

      if (cashYields.value.length == 0) {
        emptyCashYields.value = true;
      } else {
        emptyCashYields.value = false;
      }

      initChart(data);
    }



    const getChatData = async (withOrder) => {

      const params = {
        startDate,
        endDate,
        withOrder
      }

      getExpenseReportsDetailByDates(params, onFinishMutation);

    };


    onMounted(() => {

      getCurrentDates();

      getChatData(props.withOrder);


    });



    return {

      total,
      online,
      cashYields,
      emptyCashYields,
      chartData,
      chartOptions,
      dateSelected,
      formatAmount,
      currentUserBalance,
      expenseReportDetailByDatesQuery,



      onSelectDate,
      getItemPercent,
      getItemColor,
      getCurrentDates,
      onAddNew,
      onSearch,
      onCategoryClick
    };
  },
});
</script>

<style lang="scss" scoped>
@import "./cashflow-dash.scss";
</style>