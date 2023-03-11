<template>
<div class="requests">
    <div class="requests-actions">
        <div class="requests-info">
            <div class="list-table" >
            <div class="list-table-head list-table-row">
                    <span class="list-table-item">Efectivo</span>
                    <span class="list-table-item">Cant.</span>                   
            </div>
            <div class="list-table-body">
                <div class="list-table-row">
                    <span class="list-table-item">Asignado</span>
                    <span class="list-table-item">{{formatAmount(profilesCashFlowByProject.totalMoneyAssigned)}}</span>                   
                </div>
                <div class="list-table-row">
                    <span class="list-table-item">Rendido</span>
                    <span class="list-table-item">{{formatAmount(profilesCashFlowByProject.totalExpenseReports)}}</span>                   
                </div>
                <div class="list-table-row">
                    <span class="list-table-item">Por rendir</span>
                    <span class="list-table-item">{{formatAmount(profilesCashFlowByProject.totalToExpenseReports)}}</span>                   
                </div>
            </div>
        </div>      
        <div class="requests-info--actions">
            <button @click="onNewMoneyOrdered" class="add-request-button"><font-awesome-icon class="request-button--icon" icon="fa-solid fa-plus" />Solicitar</button>
            <button @click="onNewMoneyAssigned" class="add-request-button"><font-awesome-icon class="request-button--icon"  icon="fa-solid fa-plus" />Asignar</button>
            <button @click="onNewExpenseReport" class="add-request-button"><font-awesome-icon class="request-button--icon"  icon="fa-solid fa-plus" />Rendir</button>
            <button @click="onSearch" class="search-request-button"><font-awesome-icon class="request-button--icon"  icon="fa-solid fa-magnifying-glass" />Buscar</button>
        </div>
    </div>
    </div>
    <div class="requests-category-groups">
        <div class="list-table" v-if="profilesWithBalance.length != 0">
            <div class="list-table-head list-table-row">
                    <span class="list-table-item">Usuario</span>
                    <span class="list-table-item">Recibido</span>
                    <span class="list-table-item">Rendido</span>
                    <span class="list-table-item">Por rendir</span>
            </div>
            <div class="list-table-body">
                <div class="list-table-row" v-for="profile of profilesWithBalance" :key="profile.profile_id">
                    <span class="list-table-item">{{substring(profile?.name)}}</span>
                    <span class="list-table-item">{{formatAmount(getProfileBalance(profile?.profile_id)?.amount_in)}}</span>
                    <span class="list-table-item">{{formatAmount(getProfileBalance(profile?.profile_id)?.amount_out)}}</span>
                    <span class="list-table-item">{{formatAmount(getProfileBalance(profile?.profile_id)?.balance)}}</span>
                </div>
            </div>
        </div>
     
        <p v-if="profilesWithBalance.length == 0" class="empty-profiles">No hay asignaciones de efectivo en este proyecto</p>
       
    </div>
    
   
</div>
  
</template>

<script>


import { useProfiles } from '@/modules/profiles/composables/useProfiles';
import { useUI } from '@/modules/shared/composables/useUI';
export default {
    name:'CashTab',
    emits:[
        'add-money-ordered',
        'add-money-assigned',
        'add-expense-report',
        'search-request',
    ],
    setup(props, context){

       
        const { profilesWithBalance,profilesCashFlowByProject,  getProfileBalance, profilesFlowCash, profilesCashToRender} = useProfiles();        
        const { formatAmount, substring } = useUI();       
     
        const onNewMoneyOrdered = () =>{
            context.emit('add-money-ordered');
        }
        const onNewMoneyAssigned = () =>{
            context.emit('add-money-assigned');
        }
        const onNewExpenseReport = () =>{
            context.emit('add-expense-report');
        }
        const onSearch = () =>{
            context.emit('search-request');
        }

       

        return {
            profilesWithBalance,
            getProfileBalance,       
            profilesFlowCash,
            profilesCashToRender,   
            profilesCashFlowByProject,  
            substring,
            formatAmount,
            onNewMoneyOrdered,
            onNewMoneyAssigned,
            onNewExpenseReport,
            onSearch
        }
    }

}
</script>

<style lang="scss" scoped>
@import "./cash-tab.scss";
</style>