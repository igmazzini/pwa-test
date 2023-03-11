<template>
<div class="project-statistics">
    <div class="project-statistics--title">
        <p>Estadisticas</p>
        <a href="">Ver todas</a>
    </div>
    <div class="project-statistics--info">
        <CategoriesChart/>
       
    </div>
</div>
  
</template>

<script>

import CategoriesChart from '@/modules/projects/components/project/categories-chart/CategoriesChart.vue';

export default {

    components:{
        CategoriesChart
    }

}
</script>

<style lang="scss" scoped>
@import "./project-statistics.scss";
</style>