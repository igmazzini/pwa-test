<template>
    <Select ref="selectCategoryRef" :label="props.label" :options="options"  @option-selected="onCategorySelected" />
</template>

<script setup>
import {ref, watch } from 'vue';
import {Select} from '@/modules/shared/components';
import { useUI } from '@/modules/shared/composables';
import { useCategories } from '@/modules/products/composables';


// eslint-disable-next-line no-undef
const props = defineProps({
    label:{ type: String,default:'Rubro'}
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['selected']);

const { sortAlphabetically } =  useUI();
const { categories } = useCategories();
const options = ref([]);
const selectCategoryRef = ref(null);

const setCategories = () =>{
   
    options.value  = categories.value.map( ( category ) => {
        return {
            label:`${category.category_code} - ${category.category_name}`,
            value:category.category_id,
            code:category.category_code
        }
    }); 
  

    options.value = sortAlphabetically(options.value,'code');   
    
}

watch(categories,() => {
    setCategories();
});


const onCategorySelected = ( option ) =>{
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
    selectCategoryRef.value.checkError();
}


// eslint-disable-next-line no-undef
defineExpose({
    addOption,
    checkError,   
    
});

setCategories();

</script>

<style lang="scss" scoped>

</style>