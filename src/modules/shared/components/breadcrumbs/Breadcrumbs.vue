<template>
    <nav v-if="breadcrumbs && breadcrumbs.length > 0" style="--bs-breadcrumb-divider: '>';" aria-label="breadcrumb">
        <ul class="breadcrumb">
            <li v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item"
                :class="isLast(index) ? 'active' : ''" @click="onSelected(crumb)">
                {{ crumb.label }}
            </li>

        </ul>
    </nav>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
export default {
    name: 'Breadcrumbs',
    props: {
        oBreadcrumbs: {
            type: Array
        }
    },
    setup(props) {

        const router = useRouter();
        const breadcrumbs = ref([]);
        breadcrumbs.value = router.currentRoute.value.meta.breadcrumbs;


        if (props.oBreadcrumbs) {

            breadcrumbs.value = [];

            props.oBreadcrumbs.forEach(bcrumb => {

                /* bcrumb = {url:'', label:''} */

                breadcrumbs.value.push(bcrumb);
            });
        }

        if (!breadcrumbs.value) {
            return;
        }



        const onSelected = (crumb) => {

            router.replace({ name: crumb.url });

        }


        const isLast = (index) => {
            if (breadcrumbs.value.length == 0) {
                return false;
            }
            return index === breadcrumbs.value.length - 1;
        }



        return {

            breadcrumbs,
            isLast,
            onSelected,

        }
    }
}
</script>
<style lang="scss" scoped>
nav {

    padding-left: 0;
}

.breadcrumb{
    margin: 0;
}

li {
    cursor: pointer;
    transition: all var(--animation-duration) var(--animation-type);
}

.dark .breadcrumb {
    color: var(--dark-text-color);
}

.dark .breadcrumb .active::before {
    color: var(--dark-text-color);
}

.dark .breadcrumb .active {
    color: var(--dark-subtitle-color);
    pointer-events: none;
}
</style>