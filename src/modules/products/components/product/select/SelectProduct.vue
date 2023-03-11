<template>
    <Select ref="selectProductRef" :label="props.label" :options="options"  @option-selected="onProductSelected" />
</template>

<script setup>
import {ref, watch } from 'vue';
import {Select} from '@/modules/shared/components';
import { useUI } from '@/modules/shared/composables';
import { useProducts } from '@/modules/products/composables/useProducts';

// eslint-disable-next-line no-undef
const props = defineProps({
    label:{ type: String,default:'Item'}
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['selected']);

const { sortAlphabetically } =  useUI();
const { products, getProductsByCode } = useProducts();
const options = ref([]);
const selectProductRef = ref(null);

const setProducts = () =>{
   
    options.value  = products.value.map( ( product ) => {
        return {
            label:`${product.product_code} ${product.product_name}`,
            value:product.product_id,            
            code:product.product_code,            
        }
    }); 

    options.value = sortAlphabetically(options.value,'code'); 
    
}

watch(products,() => {
    setProducts();
});


const onProductSelected = ( option ) =>{
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
    selectProductRef.value.checkError();
}

const filterByCategory = ( code ) =>{

    options.value  = getProductsByCode(code).map( ( product ) => {
        return {
            label:`${product.product_code} ${product.product_name}`,
            value:product.product_id,
            code:product.product_code
        }
    });
}

// eslint-disable-next-line no-undef
defineExpose({
    addOption,
    checkError,
    filterByCategory
    
});

setProducts();

</script>

<style lang="scss" scoped>

</style>