<script src="./Select.js"></script>
<template>
  <div class="custom-select-container">
    <div :class="['select-container', showError ? 'select-container-empty' : '', (block) ? 'disabled' : '']">
      <p :class="['select-label', (inputText.length > 0) ? 'select-label-active' : '']">{{ label }}</p>
      <input autocomplete="off" :disabled="block" :class="['form-control', 'select-container--input']"
        :placeholder="label" v-model="inputText" type="text" @focus="onFocus" @blur="onBlur">
      <font-awesome-icon :class="['select-icon', (showOptions) ? 'select-icon-open' : '']"
        icon="fa-solid fa-caret-down" />
      <div v-show="showOptions && !emptyResults && filterOptions.length > 0" class="select-container--options">
        <span @click.stop="onOption(option)" class="select-container--option" v-for="option of filterOptions"
          :key="option">{{ option.label }}</span>
        <!-- <span class="select-container--option empty-option" v-if="emptyResults">---</span> -->
      </div>
      <div @click="onClick" v-if="mobile && !ignoreMobile" class="mobile-click-layer"></div>
    </div>
    <p :class="['select-error', showError ? 'select-error-active' : '']">Requerido</p>
  </div>
</template>



<style lang="scss" scoped>
@import "./select.scss";
</style>
