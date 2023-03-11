<script src="./DatePickerMobile.js"></script>

<template>
    <div class="datepicker-mobile-container">
        <div class="datepicker-mobile-bar">
            <font-awesome-icon icon="fa-solid fa-chevron-left" @click="onCancel"/>  
            <p>Seleccione una fecha</p>
        </div>
        <div class="datepicker-mobile">            
            <Datepicker inline autoApply :dark="darkMode" @update:modelValue="onDateSelected" :enableTimePicker="false" locale="esp"/>
        </div>
        <div class="datepicker-mobile-actions">
            <button :class="[(dateSelected === '') ? 'disabled' : '']" @click="onAccept">Aceptar</button> 
        </div>
    </div>
  
</template>


<style lang="sass" scoped>
    
    @import "./date-picker-mobile.scss"
</style>