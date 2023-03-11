<template>
  <div class="project">
    <div class="project-title">
      <p>Datos del proyecto</p>
    </div>
    <div v-if="currentProject" class="project-info">
      <div class="project-info-row">
        <p>{{ currentProject.project_name }} ({{ currentProject.project_code }})</p>
      </div>
      <div class="project-info-row">
        <p>Estado: {{ getProjectStatus(currentProject.status) }}</p>
      </div>
      <div class="project-info-row">
        <p>Inicio: {{ formatDate(currentProject.date_initial) }}</p>
        <p>Finalización: {{ formatDate(currentProject.date_final) }}</p>
      </div>

      <div class="project-info-row">
        <!-- <p>Inicio {{ formatDate(currentProject.date_initial) }}</p> -->
        <p>{{ project.extra_data?.shooting_days?.length }} días de rodaje</p>
        <Datepicker :dark="darkMode" select-text="" cancel-text="" class="date-picker" locale="esp"
          :enable-time-picker="false" :markers="markers" :allowed-dates="allowedDays">
          <template #trigger>
            <font-awesome-icon icon="fa-regular fa-calendar" />
          </template>
        </Datepicker>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import "@vuepic/vue-datepicker/dist/main.css";
import Datepicker from "@vuepic/vue-datepicker";
import { useProject } from "@/modules/projects/composables/projects/useProject";
import { useUI } from "@/modules/shared/composables/useUI";


export default {
  name: "ProjectInfo",
  props: {
    project: {
      type: Object,
      default: () => {
        return {
          project_name: "Nombre del proyecto",
          date_initial: "00/00/00",
          date_final: "00/00/00",
          budget: 100,
        };
      },
    },
  },
  components: {
    Datepicker,
  },
  setup() {
    const { darkMode, formatDate } = useUI();
    const { currentProject, getProjectStatus } = useProject();
    const allowedDays = ref([]);
    const markers = ref([]);

    onMounted(() => {
      if (currentProject.value) {
        markers.value = currentProject.value.extra_data?.shooting_days.map(
          (d) => {
            return {
              date: new Date(d),
              type: "line",
              color: "#c1dccc",
              tooltip: [{ text: "Rodaje", color: "#c1dccc" }],
            };
          }
        );
        allowedDays.value = currentProject.value.extra_data?.shooting_days.map(
          (d) => {
            return new Date(d);
          }
        );
      }
    });

    return {
      darkMode,
      formatDate,
      currentProject,
      getProjectStatus,
      allowedDays,
      markers,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./project-info.scss";
</style>