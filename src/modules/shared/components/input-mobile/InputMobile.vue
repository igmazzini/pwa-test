<script src="./InputMobile.js"></script>

<template>
   
    <div class="input-mobile-container">
         <div class="input-mobile-bar">
            <font-awesome-icon icon="fa-solid fa-chevron-left" @click="onCancel"/>  
            <p>{{title}}</p>
        </div>
        <div class="input-mobile">
            <input ref="inputRef" @input="updateValue"  :value="formatValue" :placeholder="placeholder"  type="text" :inputmode="inputType">
            <div class="info-text"><p v-show="showText" :class="[(hasError) ? 'error' : 'info']">Hubo algun error</p></div>
            <button :class="[(getButtonStatus()) ? '' : 'disabled']"  @click="onAccept">Aceptar</button> 
        </div>
       
    </div>
  
</template>


<style lang="sass" scoped>
    @import "./input-mobile.scss"
</style>