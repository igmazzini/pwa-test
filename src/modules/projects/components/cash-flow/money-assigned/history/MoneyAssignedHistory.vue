<template>
    <div class="money-assigned-history-container">       

        <div v-if="(mobile) ? !showDetail : true"
            class="money-assigned-list-container animate__animated animate__fadeInLeft animate__faster">
            <MoneyAssignedList @on-money-assigned-selected="onMoneyAssignedSelected" />
        </div>
        <div v-if="showDetail"  class="money-assigned-detail-container animate__animated animate__fadeInRight animate__faster">
           
            <MoneyAssignedDetail/>
        </div>

        <div v-if="!mobile" class="history-actions">
            <button @click="onNewMoneyAssigned" class="cta-button">
                <font-awesome-icon icon="fa-solid fa-plus" />
                <p>Nueva asignación</p>
            </button>
        </div>


    </div>
</template>

<script>

import { ref, watch } from 'vue';
import {MoneyAssignedList, MoneyAssignedDetail}  from '@/modules/projects/components/cash-flow/money-assigned';
import { useUI, useModal } from '@/modules/shared/composables';
import { useRouter } from 'vue-router';
import { useMoneyAssigned } from '@/modules/projects/composables/money-assigned/useMoneyAssigned';

export default {
    name: 'MoneyAssignedHistory',
    components: {
        MoneyAssignedList,
        MoneyAssignedDetail,     

    },
   
    setup(  ) {


        const router = useRouter();
        const { setArrowCallback, mobile } = useUI();   
        const { showModal, hideModal } = useModal();     
        const { uploadMoneyAssigned, setCurrentMoneyAssigned, currentMoneyAssigned } = useMoneyAssigned();
        const showDetail = ref(false);
      
       


        if (!mobile.value) {
            showDetail.value = true;
        }



        watch(currentMoneyAssigned, (val) => {
            if (val) {

                setArrowCallback(() => {

                    setCurrentMoneyAssigned(null);

                    setArrowCallback(goBack);

                });



                if (mobile.value) {
                    showDetail.value = true;
                }

            } else {

                setArrowCallback(goBack);


                if (mobile.value) {
                    showDetail.value = false;
                }
            }
        });

        const onMutationFinish = ( result ) =>{

            if( result ){
               
                hideModal();

            }
        }

        const goBack = () => {
            router.go(-1);
        }

        const onMoneyAssignedSelected = ( moneyAssigned ) => {

            currentMoneyAssigned.value = moneyAssigned;


        }

        const onNewMoneyAssigned = () =>{           

           
            showModal('MoneyAssigned', onNewMoneyAssignedAccept,onNewMoneyAssignedCancel);
        }


        const onNewMoneyAssignedAccept = async( data ) =>{

            uploadMoneyAssigned( data, onMutationFinish );      
           
        }
        const onNewMoneyAssignedCancel = () =>{
           hideModal();
        }

        return {
            //Properties
            currentMoneyAssigned,
            mobile,
            showDetail,
          

            //Methods
           
            onMoneyAssignedSelected,           
            onNewMoneyAssigned,
            onNewMoneyAssignedAccept,
            onNewMoneyAssignedCancel
        }
    }
}
</script>

<style lang="scss" scoped>
.money-assigned-history-container {
    position: relative;
    display: grid;
    height: 100%;
    gap: 20px;
    grid-template-columns: 60% 40%;
    grid-template-rows: 1fr 10%;
    padding: 15px;


}




.money-assigned-list-container,
.money-assigned-detail-container {

    width: 100%;
    height: 100%;
    transition: all var(--animation-duration) var(--animation-type);

}


.money-assigned-detail-container {
   
    background-color: var(--light-background-color);
    border-radius: 16px;
    height: 100%;
    transition: all var(--animation-duration) var(--animation-type);
   
}

.dark .money-assigned-detail-container {
    background-color: var(--dark-background-color);
}


.history-actions {

    grid-column: 1/-1;
    grid-row: 2/-1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 6px;

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


@media screen and (max-width: 1300px) {

    .money-assigned-history-container {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
    }

    .money-assigned-list-container,
    .money-assigned-detail-container {
        position: absolute;
        background-color: var(--background-grey);
    }

  

    .dark .money-assigned-list-container,
    .dark .money-assigned-detail-container {
        background-color: black;
    }

}
</style>