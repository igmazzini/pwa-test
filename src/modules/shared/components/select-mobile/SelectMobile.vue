<script src="./SelectMobile.js"></script>

<template>
    <div class="select-mobile-container">
        <div class="select-mobile-bar">
         <font-awesome-icon icon="fa-solid fa-chevron-left" @click="onCancel"/>  
         <p>{{title}}</p>
        </div>
        <div v-if="searchBar" class="select-mobile-input">
            <input ref="inputRef" v-model="inputText" placeholder="Buscar..." :type="type">
        </div>
        <div :class="['select-mobile-list',(openKeyboard) ? 'open-keyboard' : '']">
            <ul>
                <li :class="[(currentOption.value == option.value) ? 'option-selected' : '']" v-for="(option, index) of selectOptions" :key="index" @click="onOptionTab(option)" ><span :class="[(currentOption.value == option.value) ? 'selected' : '']"></span>{{substring(option.label)}}</li>              
                
            </ul>
           
        </div>
        <div class="select-mobile-actions">
           <button :class="[(currentOption.value === '') ? 'disabled' : '']" @click="onAccept">Aceptar</button> 
        </div>
    </div>
  
</template>


<style lang="sass" scoped>
    @import "./select-mobile.scss"
</style>