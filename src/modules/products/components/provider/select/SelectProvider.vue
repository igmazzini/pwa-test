<template>
    <Select ref="selectProviderRef" :label="props.label" :showAddNew="props.showAddNew" :addNewLabel="props.addNewLabel" :searchTarget="props.searchTarget" :options="options"  @option-selected="onProviderSelected" />
</template>

<script setup>
import {ref, watch } from 'vue';
import {Select} from '@/modules/shared/components';
import { useUI } from '@/modules/shared/composables';
import { useProviders } from '@/modules/products/composables/useProviders';

// eslint-disable-next-line no-undef
const props = defineProps({
    label:{ type: String,default:'Proveedores'},
    showAddNew:{ type: Boolean,default:false},
    addNewLabel:{ type: String,default:'Nuevo proveedor'},
    searchTarget:{ type: String,default:'code'},
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['selected']);

const { sortAlphabetically } =  useUI();
const { providers } = useProviders();
const options = ref([]);
const selectProviderRef = ref(null);

const setProviders = () =>{
   
    options.value  = providers.value.map( ( provider ) => {
        return {
            label:provider.company_name,
            value:provider.company_id,            
            code:provider.extra_data?.cuit,            
        }
    }); 

    options.value = sortAlphabetically(options.value,'label'); 
    
}

watch(providers,() => {
    setProviders();
});


const onProviderSelected = ( option ) =>{
    emit('selected', option)
}

const addOption = ( option, first = true ) =>{
    if(first){
        options.value = [option, ...options.value];
    }else{
        options.value = [...options.value,option];
    }
   
} 


const checkError = () =>{
    selectProviderRef.value.checkError();
}



// eslint-disable-next-line no-undef
defineExpose({
    addOption,
    checkError
    
});

setProviders();

</script>

<style lang="scss" scoped>

</style>