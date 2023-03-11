<template>
   
    <Transition >
        <div v-if="showCurrentModal"  class="modal">           
            <component :is="currentModal" @on-accept="onAccept" @on-cancel="onCancel" :payLoad="modalParams" />
        </div>
    </Transition>

    <Transition >
        <div v-if="showSecond"  class="modal second-background">           
            <component :is="secondModal" @on-accept="onSecondModalAccept" @on-cancel="onSecondModalCancel" :payLoad="secondModalParams" />
        </div>
    </Transition>

    <Transition>
        <div v-if="showConfirm"  :class="['modal', showCurrentModal ? 'second-background' : '']">      
            <ConfirmationModal  @on-accept="onConfirmAccept" @on-cancel="onConfirmCancel" :title="confirmParams.title" :info="confirmParams.info" :text="confirmParams.text" :type="confirmParams.type"/>
        </div>
    </Transition>
</template>

<script>

import {NewOrderModal,PayOrderModal} from '@/modules/projects/components/orders';
import { NewExpenseReportModal } from '@/modules/projects/components/cash-flow/expense-report';
import { NewMoneyAssignedModal } from '@/modules/projects/components/cash-flow/money-assigned';
import { NewMoneyOrderedModal } from '@/modules/projects/components/cash-flow/money-ordered';
import { NewProductModal,NewCategoryModal, NewGroupModal, NewProviderModal, NewLazyProviderModal } from '@/modules/products/components';
import  NewProjectModal  from '@/modules/projects/components/project/modal/NewProjectModal.vue';
import {ConfirmationModal} from '@/modules/shared/components';
import { useModal } from '@/modules/shared/composables/useModal';

export default {
    components:{
        NewOrderModal,
        PayOrderModal,
        ConfirmationModal,
        NewExpenseReportModal,
        NewMoneyAssignedModal,
        NewMoneyOrderedModal,
        NewProjectModal,
        NewProductModal,
        NewCategoryModal,
        NewGroupModal,
        NewProviderModal,
        NewLazyProviderModal
        
    },
    setup () {

        const { 
            showCurrentModal,
            currentModal,
            secondModal,           
            showConfirm,
            showSecond,
            modalParams,
            secondModalParams,
            confirmParams,
            onConfirmAccept,
            onConfirmCancel,
            onAccept,
            onCancel,           
           
            onSecondModalAccept,
            onSecondModalCancel,
           

        } = useModal();


        return {

            //Properties
            showCurrentModal,           
            currentModal,
            secondModal,
            modalParams,
            showConfirm,
            confirmParams,
            secondModalParams,          
            showSecond,

            //Methods
            onAccept,
            onCancel,
            onConfirmAccept,
            onConfirmCancel,
            onSecondModalAccept,
            onSecondModalCancel,
            

        }
    }
}
</script>

<style lang="scss" scoped>

.modal{
    background-color: rgba(0, 0, 0, 0.200);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;    
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    font-size: 1em;
    transition: all var(--animation-duration) var(--animation-type);
}

.second-background{
    background-color: rgba(0, 0, 0, 0.1);
}

.dark .modal{
    background-color: rgba(243, 237, 237, 0.3);
}

.dark .second-background{
    background-color: rgba(243, 237, 237, 0.1);
}


</style>