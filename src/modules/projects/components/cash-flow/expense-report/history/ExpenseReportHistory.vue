<template>
    <div class="cash-yield-history-container">
    

        <div v-if="(mobile) ? !showDetail : true" class="cash-yield-list-container animate__animated animate__fadeInLeft animate__faster">
            <ExpenseReportList/>
            
        </div>
        <div v-if="showDetail"
            class="cash-yield-detail-container animate__animated animate__fadeInRight animate__faster">

            <ExpenseReportDetail @on-update="onExpenseReportUpdate"/>
        </div>

        <div v-if="!mobile" class="history-actions">
            <button @click="onNewExpenseReport" class="cta-button">
                <font-awesome-icon icon="fa-solid fa-plus" />
                <p>Nueva rendición</p>
            </button>
        </div>

        
    </div>
</template>

<script>
import {ExpenseReportList, ExpenseReportDetail}  from '@/modules/projects/components/cash-flow/expense-report';
import { ref, watch } from 'vue';
import { useUI, useModal } from '@/modules/shared/composables';
import { useRouter } from 'vue-router';
import { useExpenseReports } from '@/modules/projects/composables';

export default {
    name: 'ExpenseReportHistory',
    components: {
        ExpenseReportList,
        ExpenseReportDetail,    

    },
   
    setup(  ) {


       

        const router = useRouter();
        const { setArrowCallback, mobile } = useUI();   
        const { showModal, hideModal } = useModal();    
        const { uploadExpenseReport, updateExpenseReport, currentExpenseReport, setCurrentExpenseReport } = useExpenseReports();
        const showDetail = ref(false);
        

        if (!mobile.value) {
            showDetail.value = true;
        }



        watch(currentExpenseReport, (val) => {
            if (val) {

                setArrowCallback(() => {

                    setCurrentExpenseReport(null);

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

            if(result){
                hideModal();
            }
        }

        const goBack = () => {
            router.go(-1);
        }

       

        const onExpenseReportUpdate = async () => {


            updateExpenseReport(currentExpenseReport.value,onMutationFinish);           

        }

        const onNewExpenseReport = () =>{
           
            showModal('ExpenseReport', onNewExpenseReportAccept, onNewExpenseReportCancel);
        }
        const onNewExpenseReportAccept = async ( data ) =>{

            uploadExpenseReport( data, onMutationFinish );           
            
        }
        const onNewExpenseReportCancel = () =>{
           hideModal();
        }

        return {
            //Properties
            currentExpenseReport,
            mobile,
            showDetail,
           

            //Methods          
            onExpenseReportUpdate,
            onNewExpenseReport,
        
        }
    }
}
</script>

<style lang="scss" scoped>
.cash-yield-history-container {
    position: relative;
    display: grid;
    height: 100%;
    gap: 20px;
    grid-template-columns: 60% 40%;
    grid-template-rows: 1fr 10%;
    padding: 15px;


}



.cash-yield-list-container,
.cash-yield-detail-container {

    width: 100%;
    height: 100%;
    transition: all var(--animation-duration) var(--animation-type);

}


.cash-yield-detail-container {
  
    background-color: var(--light-background-color);
    border-radius: 16px;
    height: 100%;
   
   
}


.dark .cash-yield-detail-container {
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

    .cash-yield-history-container {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
    } 

    .cash-yield-list-container,
    .cash-yield-detail-container {
        position: absolute;
        background-color: var(--background-grey);
    }  

    .dark .cash-yield-list-container,
    .dark .cash-yield-detail-container {
        background-color: black;
    }

}
</style>