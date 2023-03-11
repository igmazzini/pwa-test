<template>
  <div class="card-data">
    <TextField :label="'Tarjeta'" :text="'Mastecard'" />
    <TextField :label="'Numero de tarjeta'" :text="'452-659-4598-3263'" />
    <TextField :label="'Fecha de vencimiento'" :text="'3/26'" />
  </div>
</template>

<script>
import {TextField} from '@/modules/shared/components';
export default {
    name:'CardData',
    components:{
        TextField
    },
}
</script>

<style lang="scss" scoped>

.card-data{
    display: grid;
    grid-template-columns: repeat(2,1fr);
    width: 100%;      
    gap: 10px;     
    
   

    .text-field-container{
        height: 50px;
    }
}

</style>