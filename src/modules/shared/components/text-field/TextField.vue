<template>
    <div class="text-field">
        <div ref="textFieldContainer"  :class="['text-field-container', block ? 'disabled' : '']">
            <p class="text-field-label">{{label}}</p>
            <p v-if="!bigText" class="text-field-content">{{(type == 'money') ? formatAmount(text) : text}}</p>
            <textarea  class="text-area-content" v-if="bigText" v-model="text" />        
            <span v-if="withCopy" class="copy" @click="onCopyText"><font-awesome-icon icon="fa-regular fa-copy" /></span>          
        </div>
        <p :class="['text-field-error',(showingError) ? 'text-field-error-active' : '']">{{ error }}</p>
    </div>   
    
</template>

<script src="./TextField.js"></script>

<style lang="scss" scoped>

.text-field{
   
    width: 100%;
 
}
.text-field-container{
    grid-row: 1;
    height: 55px;
    width: 100%;
    background-color: var(--background-grey);   
    position: relative;
    display: grid;
    grid-template-rows: 40% 1fr;
    align-items: center;
    font-size: 1em;
    border-bottom: 2px solid var(--background-color);
    transition: all var(--animation-duration) var(--animation-type);
    font-family: RobotoLight;
    overflow: hidden;
}
.text-field-label{
    margin: 0;
    padding: 0;   
    padding-left: 15px;
    padding-top: 6px;
    color: var(--success-color);    
    font-size: 0.9em;
    transition: all var(--animation-duration) var(--animation-type);
}

.text-field-error{
    grid-row: 2;
    margin: 0;
    padding: 0;   
    padding-top: 3px;
    color: var(--error-color);    
    font-size: 0.8em;
    font-family: RobotoLight;
    opacity: 0;
    transition: all var(--animation-duration) var(--animation-type);

}

.text-field-error-active{
    opacity: 1;
}

.text-field-content{
    margin: 0;
    padding: 0;
    padding-left: 15px;   
    color: var(--light-text-color);    
    user-select: text;
    -webkit-user-select:text;
    -moz-user-select: text;
    transition: all var(--animation-duration) var(--animation-type);
}


.text-area-content{
    margin: 0;
    padding: 0;
    border: none;
    background-color: transparent;
    height: 40px;
    padding-left: 15px;
    padding-bottom: 5px;
    outline: none;   
    color: var(--light-text-color);   
    line-height: 1.2em; 
    transition: all var(--animation-duration) var(--animation-type);
}

.text-area-content::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.text-area-content::-webkit-scrollbar-track {
  background-color: var(--button-active-color-light);
  border-bottom-right-radius: inherit;
}
.text-area-content::-webkit-scrollbar-thumb {
  background-color: var(--background-color);
}
.text-area-content:-webkit-scrollbar-thumb:hover {
  background-color: var(--background-color);
}


.copy{
    position: absolute;
    right: 10px;
   
}

.copy::before{ 
    content: "";
    background-color: var(--button-active-color-light);  
    opacity: 0; 
    border-radius: 100px;
    width: 35px;
    height: 35px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    transition: all var(--animation-duration) var(--animation-type);
    visibility: hidden;
    
}


.copy:active::before{
    visibility: visible;
    opacity: 0.5; 
}

.fa-copy{
   
    color: var(--success-color); 
    cursor: pointer;
}

.disabled{
    pointer-events: none;
    background-color: rgba(0, 0, 0, 0.1) !important;  
}

.dark .text-field-container{
    background-color: var(--dark-background-color);
}

.dark .text-field-label,

.dark .text-area-content,
.dark .text-field-content{
    color: var(--dark-text-color);
}

@media screen and (max-width:900px){
      .text-field-container{
        height: 45px;
        background-color: var(--light-background-color);
      }  
}

@media screen and (max-height:750px) {
    .text-field-container{
        height: 45px;    
    }  
}
</style>