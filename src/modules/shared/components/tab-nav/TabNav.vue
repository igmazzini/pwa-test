<template>
    <div class="tab-nav-container">
        <ul class="nav nav-tabs">
            <li v-for="(tab, index) of tabs" :key="tab" class="nav-item">
                <a @click="setTab(index)" :class="['nav-link', (currentTabIndex === index) ? 'active' : '']">
                    {{ tab }}
                </a>
            </li>
        </ul>
        <div class="tab">
            <slot></slot>
        </div>

    </div>
</template>

<script>
import { ref,onMounted } from 'vue';

export default {
    name: 'TabNav',
    props: {
        tabs: {
            type: Array,
        },
        selected: {
            type: Number,
            default:-1
        },
    },
    emits: [
        'on-selected-tab'
    ],
    setup(props, context) {

        const currentTabIndex = ref(0);

        const setTab = (index) => {

            context.emit('on-selected-tab', { currentIndex: index, previousIndex: currentTabIndex.value });
            currentTabIndex.value = index;
        }

        onMounted(() => {
            if(props.selected && props.selected != -1){
                currentTabIndex.value = props.selected
            }
        })

        return {
            setTab,
            currentTabIndex
        }
    }

}
</script>


<style lang="scss" scoped>
.tab-nav-container {
    width: 100%;
    height: 100%;
    display: grid;
    overflow: hidden;
    grid-template-rows: 12% 1fr;
    font-size: inherit;


}

a {
    cursor: pointer;
}

.nav-tabs {

    align-items: flex-end;
    //border-bottom: 1px solid #dee2e6;
    border-bottom: 1px solid var(--button-active-color-light);

}

.nav-link {
    color: var(--light-secondary-text-color) !important;
    font-family: RobotoLight !important; 
}

.nav-link.active {
    color: var(--background-color) !important;
    color: var(--light-text-color) !important;
    background-color: var(--button-active-color-light) !important;
    border-color: var(--button-active-color-light) !important;

}

.nav-tabs .nav-link:hover,
.nav-tabs .nav-link:focus {
    //border-color: #e9ecef #e9ecef #dee2e6;
    border-color: var(--button-active-color-light) !important;
    isolation: isolate !important;
}

.tab {
    /* overflow: hidden; */
    height: 100%;
    width: 100%;


}

.dark .nav-link {
    color: var(--dark-secondary-text-color) !important;
}

.dark .nav-link.active {
    background-color: var(--dark-background-color) !important;
    color: var(--dark-text-color) !important;
}

@media screen and (max-width:900px) {
    .tab-nav-container {       
        grid-template-rows: 6% 1fr;
    }
}
</style>