<template>
  <div class="history">
    <div class="history-title">
      <p>Historial de movimientos</p>
      <a href="">Ver todos</a>
    </div>
    <div :class="['history-list',(movementHistory.length == 0) ? 'empty-list' : '']">
      <p v-if="movementHistory.length == 0">No hay movimientos</p>
      <div  v-if="movementHistory.length > 0"  class="list-table">
        <div class="list-table-head list-table-row">
          <span class="list-table-item">Proyecto</span>
          <span class="list-table-item">Usuario</span>
          <span class="list-table-item">Tipo</span>
          <span class="list-table-item">Fecha</span>
          <span class="list-table-item">Estado</span>
          <span class="list-table-item">Monto</span>
        </div>
        <div class="list-table-body">
        <template v-if="!movementHistoryQuery.isLoading.value">
          <div v-for="movement of movementHistory" :key="movement"  class="list-table-row">
            <span class="list-table-item">{{ movement.project }}</span>
            <span class="list-table-item">{{ movement.user }}</span>
            <span class="list-table-item">{{ getMovementType(movement.type) }}</span>
            <span class="list-table-item">{{ formatDate(movement.date,true) }}</span>
            <span :class="['list-table-item',movement.status.toLowerCase()]">{{ getStatus(movement.status) }}</span>
            <span class="list-table-item">{{ formatAmount(movement.amount) }}</span>
          </div>
        </template>
        <template v-if="movementHistoryQuery.isLoading.value">
          <div v-for="i in 3" :key="i" class="list-table-row" >
            <span class="list-table-item"><AnimatedPlaceholder :width="'120px'" :height="'18px'" :border-radius="'5px'" /></span>
            <span class="list-table-item"><AnimatedPlaceholder :width="'120px'" :height="'18px'" :border-radius="'5px'" /></span>
            <span class="list-table-item"><AnimatedPlaceholder :width="'80px'" :height="'18px'" :border-radius="'5px'" /></span>
            <span class="list-table-item"><AnimatedPlaceholder :width="'80px'" :height="'18px'" :border-radius="'5px'" /></span>
            <span class="list-table-item"><AnimatedPlaceholder :width="'80px'" :height="'18px'" :border-radius="'5px'" /></span>
            <span class="list-table-item"><AnimatedPlaceholder :width="'80px'" :height="'18px'" :border-radius="'5px'" /></span>
          </div> 
        </template>
          
        </div>
      </div>
     
    </div>
  </div>
</template>

<script setup>
import {AnimatedPlaceholder} from '@/modules/shared/components';
import { useHome }  from '@/modules/home/composables';
import { useUI }  from '@/modules/shared/composables';

const { movementHistory, movementHistoryQuery, getMovementType } = useHome();
const { formatDate, getStatus, formatAmount  } = useUI();
</script>

<style lang="scss" scoped>
@import "./movement-history.scss";
</style>