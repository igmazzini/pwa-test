<template>
    <Select ref="selectCategoryGroupRef" :label="props.label" :options="options"  @option-selected="onCategoryGroupSelected" />
</template>

<script setup>
import {ref, watch } from 'vue';
import {Select} from '@/modules/shared/components';
import { useUI } from '@/modules/shared/composables';
import { useCategoriesGroups } from '@/modules/products/composables';


// eslint-disable-next-line no-undef
const props = defineProps({
    label:{ type: String,default:'Categoria'}
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['selected']);

const { sortAlphabetically } =  useUI();
const { groups } = useCategoriesGroups();
const options = ref([]);
const selectCategoryGroupRef = ref(null);

const setCategoryGroups = () =>{
   
    options.value  = groups.value.map( ( group ) => {
        return {
            label:group.group_name,
            value:group.group_id,            
        }
    }); 
  

    options.value = sortAlphabetically(options.value,'label');   
    
}

watch(groups,() => {
    setCategoryGroups();
});


const onCategoryGroupSelected = ( option ) =>{
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
    selectCategoryGroupRef.value.checkError();
}


// eslint-disable-next-line no-undef
defineExpose({
    addOption,
    checkError,   
    
});

setCategoryGroups();

</script>

<style lang="scss" scoped>

</style>