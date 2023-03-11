<template>
<div class="orders">
    <div class="orders-actions">      
        <div class="orders-info">
            <div class="list-table">
                <div class="list-table-head list-table-row">
                    <span class="list-table-item">Estado</span>
                    <span class="list-table-item">Cant.</span>
                </div>
                <div class="list-table-body">
                    <div class="list-table-row">
                        <span class="list-table-item" >Pendientes</span>
                        <span class="list-table-item" >{{pendingOrders}}</span>
                    
                    </div>
                    <div class="list-table-row">
                        <span class="list-table-item">Pagadas</span>
                        <span class="list-table-item">{{paidOrders}}</span>
                    </div>          
                </div>
            </div>
            <table v-if="false">
                <thead>
                    <tr>
                        <td>Estado</td>
                        <td>Cant.</td>                       
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Pendientes</td>
                        <td>{{pendingOrders}}</td>                       
                    </tr>                                     
                    <tr>
                        <td>Pagadas</td>
                        <td>{{paidOrders}}</td>                       
                    </tr>
                </tbody>
            </table>
            <div class="orders-info--actions">
                <button @click="onAddNew" class="add-order-button"><font-awesome-icon class="order-button--icon" icon="fa-solid fa-plus" />Agregar</button>
                <button @click="onSearch" class="search-order-button"><font-awesome-icon class="order-button--icon"  icon="fa-solid fa-magnifying-glass" />Buscar</button>
            </div>
        </div>
    </div>
    <div class="orders-categories">
        <div  class="list-table">
            <div class="list-table-head list-table-row">
                <span class="list-table-item">Rubro</span>
                <span class="list-table-item">Pendientes</span>
                <span class="list-table-item">Pagadas</span>
            </div>
            <div class="list-table-body">
                <template v-if="!ordersDetailByCategoryQuery.isLoading.value">
                    <div class="list-table-row" @click="onCategory(category)" v-for="category of ordersDetails" :key="category" >
                        <span class="list-table-item">{{category.category_code}} - {{substring(category.category_name)}}</span>
                        <span class="list-table-item">{{formatAmount(category.pending)}}</span>
                        <span class="list-table-item">{{formatAmount(category.paid)}}</span>
                    </div>
                </template>
                <template v-if="ordersDetailByCategoryQuery.isLoading.value">
                    <div v-for="i in 3" :key="i" class="list-table-row" >
                        <span class="list-table-item"><AnimatedPlaceholder :width="'150px'" :height="'25px'" :border-radius="'5px'" /></span>
                        <span class="list-table-item"><AnimatedPlaceholder :width="'150px'" :height="'25px'" :border-radius="'5px'" /></span>
                        <span class="list-table-item"><AnimatedPlaceholder :width="'150px'" :height="'25px'" :border-radius="'5px'" /></span>
                     </div>                
                </template>
               
               
                
            </div>
        </div>       
       
    </div>
  
</div>
  
</template>

<script>

import { ref, watch, onMounted } from 'vue';

import { useUI } from '@/modules/shared/composables/useUI';
import { useOrders }  from '@/modules/projects/composables/orders/useOrders';
import { useCategories } from  '@/modules/products/composables';
import {AnimatedPlaceholder} from '@/modules/shared/components';

export default {
    name: "Orders",
    emits: [
        "add-new-order",
        "search-orders",
        "search-by-category",
    ],
    props: {
        projectId: {
            type: String,
            required: true
        }
    },
    setup(props, context) {
        const { formatAmount, substring } = useUI();
        const { pendingOrders, approveOrders, paidOrders, ordersDetailByCategories,ordersDetailByCategoryQuery} = useOrders(props.projectId);
        const { categories } = useCategories();
        const ordersDetails = ref([]);
        
        watch(ordersDetailByCategories, () => {
            setOrdersDetails();
        });
        const setOrdersDetails = () => {
            ordersDetails.value = [];
            categories.value.forEach(category => {
                const categoryDetail = {
                    category_name: category.category_name,
                    category_code: category.category_code,
                    approved: 0,
                    pending: 0,
                    paid: 0,
                };
                if (ordersDetailByCategories.value.approved) {
                    ordersDetailByCategories.value.approved.forEach(d => {
                        const categoryId = category.category_id.replaceAll("-", "");
                        if (d[0] == categoryId) {
                            categoryDetail.approved = d[2];
                        }
                    });
                }
                if (ordersDetailByCategories.value.pending) {
                    ordersDetailByCategories.value.pending.forEach(d => {
                        const categoryId = category.category_id.replaceAll("-", "");
                        if (d[0] == categoryId) {
                            categoryDetail.pending = d[2];
                        }
                    });
                }
                if (ordersDetailByCategories.value.paid) {
                    ordersDetailByCategories.value.paid.forEach(d => {
                        const categoryId = category.category_id.replaceAll("-", "");
                        if (d[0] == categoryId) {
                            categoryDetail.paid = d[2];
                        }
                    });
                }
                ordersDetails.value.push(categoryDetail);
            });
           
        };
        const onAddNew = () => {
            context.emit("add-new-order");
        };
        const onSearch = () => {
            context.emit("search-orders");
        };
        const onCategory = (category) => {
            context.emit("search-by-category", category.category_name);
        };
        onMounted(() => {
            setOrdersDetails();
        });
        return {
            ordersDetails,
            ordersDetailByCategoryQuery,
            pendingOrders,
            approveOrders,
            paidOrders,
            formatAmount,
            substring,
            onAddNew,
            onSearch,
            onCategory
        };
    },
    components: { AnimatedPlaceholder }
}
</script>

<style lang="scss" scoped>
@import "./orders-tab.scss";

</style>