<template>
   <div class="bank-data">                      
        <TextField :label="'Banco'" :text="'ICBC'" />
        <TextField :label="'Tipo de cuenta'" :text="'Corriente'" />                       
        <TextField :label="'CBU'" :text="company?.extra_data?.cbu" :withCopy="true"/>                       
        <TextField :label="'Alias'" :text="'pago.banco.mp'" :withCopy="true"/>                       
        <TextField :label="'Moneda'" :text="currency" />                   
    </div>
</template>

<script>
import {TextField} from '@/modules/shared/components';
export default {
    name:'BankData',
    components:{
        TextField
    },
    props:{
        company:{
            type:Object,
            require:true
        },
        currency:{
            type:String,
        }
    }
}
</script>

<style lang="scss" scoped>
.bank-data{
    display: grid;
    grid-template-columns: repeat(2,1fr);
    width: 100%;      
    gap: 10px;     
    
   

    .text-field-container{
        height: 50px;
    }
}

</style>

