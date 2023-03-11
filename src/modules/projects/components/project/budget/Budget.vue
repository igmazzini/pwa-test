<template>
    <div class="budget" >
        <div class="budget-title">
            <p>{{ title }}</p>
        </div>
        <div :class="['budget-info',((currentProjectBudget?.available_balance  * 100 / currentProjectBudget?.initial_balance) < 10 && budgetType === 'available') ? 'yellow-back' : '',((currentProjectBudget?.available_balance  * 100 / currentProjectBudget?.initial_balance) < 0 && budgetType === 'available') ? 'red-back' : '',]">
            <p v-if="budgetType === 'initial'">{{ formatAmount(currentProjectBudget?.initial_balance) }}</p>
            <p v-if="budgetType === 'used'">{{ formatAmount(currentProjectBudget?.used_balance) }}</p><div v-if="budgetType === 'used' && currentProjectBudget?.used_balance > 0" @mouseover="onInfoOver" @mouseout="onInfoOut" class="info-container"><font-awesome-icon   icon="fa-solid fa-circle-info" /></div>
            <p v-if="budgetType === 'available'">{{ formatAmount(currentProjectBudget?.available_balance) }}</p>
        </div>
    </div>

</template>

<script>

import { useUI } from '@/modules/shared/composables/useUI';
import { useProject } from '@/modules/projects/composables';

export default {
    name: 'Budget',
    props: {
        title: {
            type: String,
            default: 'Label',
        },
        budgetType: {
            type: String,

        },
    },
    setup() {

        const { formatAmount, showTooltip, removeTooltip } = useUI();
        const { currentProjectBudget } = useProject();   
       

        const onInfoOver = () =>{
            const info = `Pagado: ${formatAmount(currentProjectBudget.value?.executed_balance)} - Pendiente ${formatAmount(currentProjectBudget.value?.pending_balance)}` 
            showTooltip(info, event.target,-8);
        }
        const onInfoOut = () =>{
            removeTooltip();
        }

        return {
            formatAmount,
            currentProjectBudget,
            onInfoOver,
            onInfoOut
           
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./budget.scss";
</style>