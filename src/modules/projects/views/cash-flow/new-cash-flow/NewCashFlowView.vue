
<template>
    <div class="new-cash-flow">
        <div v-if="!mobile" class="new-cash-flow-breadcrumbs">
            <Breadcrumbs :oBreadcrumbs="breadcrumbs" />
        </div>

        <TabNav :tabs="['Rendiciones', 'Solicitudes', 'Asignaciones']" @on-selected-tab="setTab" :selected="currentTab">

            <NewExpenseReport v-if="currentTab == 0" :class="['animate__animated animate__slideInRight']" />
            <NewMoneyOrdered v-if="currentTab == 1" :class="['animate__animated animate__slideInRight']" />
            <NewMoneyAssigned v-if="currentTab == 2" :class="['animate__animated animate__slideInRight']" />
        </TabNav>


    </div>
</template>

<script>

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Breadcrumbs, TabNav } from "@/modules/shared/components";
import { NewExpenseReport } from '@/modules/projects/components/cash-flow/expense-report';
import { NewMoneyOrdered } from '@/modules/projects/components/cash-flow/money-ordered';
import { NewMoneyAssigned } from '@/modules/projects/components/cash-flow/money-assigned';
import { useUI } from '@/modules/shared/composables';
import { useProject } from '@/modules/projects/composables';


export default {
    name: 'NewCashFlowView',
    components: {
        Breadcrumbs,
        TabNav,
        NewExpenseReport,
        NewMoneyOrdered,
        NewMoneyAssigned


    },
    setup() {

        const router = useRouter();

        const { setTitle, mobile } = useUI();
        const { currentProject } = useProject();

        const breadcrumbs = ref([]);
        const currentTab = ref(0);
        const previousTab = ref(0);

        if (currentProject.value == null) {
            router.replace({ name: "projects-page" });
            return;
        }




        breadcrumbs.value = [
            { label: 'Proyectos', url: 'projects-page' },
            { label: currentProject.value.project_name, url: 'project-page' },
            { label: 'Efectivo en circulación', url: 'new-cashflow-page' }
        ];


        setTitle(currentProject.value.project_name);



        const setTab = ({ currentIndex, previousIndex }) => {

            previousTab.value = previousIndex;
            currentTab.value = currentIndex;

        }

        return{
            mobile,
            currentTab,
            breadcrumbs,

            //Methos
            setTab
        }
    }
}



</script>

<style lang="scss" scoped>
.new-cash-flow {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 5% 1fr;

}

.tab-nav-container {
    font-size: 1em;
    grid-template-rows: 7% 1fr !important;
}

.new-cash-flow-breadcrumbs {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}


.new-cash-flow-actions {

    display: flex;
    align-items: center;
    justify-content: flex-end;

}

.cta-button {
    background-color: var(--background-color);
    border: none;
    padding: 15px 30px;
    border-radius: 16px;
    color: var(--dark-text-color);
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.230);
    font-size: 1.8em;
    display: flex;
    align-items: center;
    justify-content: center;

    p {
        margin: 0;
        margin-left: 15px;
        padding: 0;
        display: inline;
        font-size: 0.8em;
    }
}

.cta-button:active {
    background-color: var(--button-active-color-light);
}

.cta-button:active {
    color: var(--light-text-color);
}

@media screen and (max-width:1300px) {
    .new-cash-flow {
        font-size: 1.4em;
        grid-template-rows: 1fr;
    }

    .tab-nav-container {
        grid-template-rows: 6% 1fr !important;
    }
}
</style>