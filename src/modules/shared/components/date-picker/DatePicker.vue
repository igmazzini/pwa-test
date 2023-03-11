<template>
<div class="custom-datepicker-container">
    <div  :class="['datepicker-container', showError ? 'datepicker-container-error' : '', block ? 'disabled' : '']">   
        <p :class="['datepicker-label',labelActive ? 'datepicker-label-active' : '']">{{label}}</p>        
        <Datepicker input-class-name="dp-custom-input"  :teleportCenter="(teleportCenter) ? true : false" :autoApply="(autoApply) ? true : false" :disabled="block" @cleared="onDatePickerClear" :min-date="minDate" :max-date="maxDate" @internalModelChange="onDatePickerChange" :multiDates="(multiDates) ? true : false" :enableTimePicker="false" hideInputIcon v-model="dateValue"  :locale="'esp'" :format="formatPickerDate" :placeholder="label" :dark="darkMode" :selectText="acceptText" :cancelText="cancelText">
            
            <template #clear-icon="{ clear }">
                <font-awesome-icon @click="clear" class="datepicker-clear-icon" icon="fa-solid fa-circle-xmark" />
            </template>
        </Datepicker>
        <div v-if="mobile" @click.stop="onMobileCover" class="mobile-cover"></div>
    </div>
    <p :class="['date-picker-error', showError ? 'date-picker-error-active' : '']">Requerido</p>
</div>
  
</template>

<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useUI } from '@/modules/shared/composables/useUI';
import { onMounted, ref, watch} from 'vue';

export default {
    name:'DatePicker',
    components:{
        Datepicker 
    },
    props:{
        label: {
            type: String,
            default: 'Label',
        },
        acceptText: {
            type: String,
            default: 'Aceptar',
        },
        cancelText: {
            type: String,
            default: 'Cancelar',
        },
        modelValue: {
            default:''
        },
        multiDates:{
            type:Boolean,
            default:false
        },
        autoApply:{
            type:Boolean,
            default:false
        },
        teleportCenter:{
            type:Boolean,
            default:false
        },
        minDate:{
            type:Object,
            default:null
        },
        maxDate:{
            type:Object,
            default:null
        },
        forceValue:{
            type:String
        },
       
        
        
    },
    emits:[
        'on-focus',
        'update:modelValue'
    ],
    setup(props, context){
       
        const { darkMode, mobile, substring } = useUI();
        const labelActive = ref(false);
        const showError = ref(false);
        const checkingError = ref(false);
        const block = ref(false);
        const dateValue = ref('');
       


        watch( () => props.forceValue, () =>{

            if(props.forceValue){
               
                dateValue.value = new Date(props.forceValue);
            }
        } );
        


        const onDatePickerClear = () =>{

            labelActive.value = false;

            if(checkingError.value){
               showError.value = true;     
            }

        }


        const checkError= () =>{
            
            checkingError.value = true; 

            if(dateValue.value == ''){
                showError.value = true;
            }
        }


        const onDatePickerChange = () => {          
            
            

            if(dateValue.value){

                if(props.multiDates){

                   if(!mobile.value){

                        context.emit('update:modelValue', dateValue.value, true);
                   } 
                    
                    
                   
                }else{

                  if(!mobile.value){

                    context.emit('update:modelValue', dateValue.value.toISOString());
                  }
                    
                }
               
                
                labelActive.value = true;
                if(checkingError.value){
                    showError.value = false;
                }
            }else{

                if(!mobile.value){
                   context.emit('update:modelValue', '');
                }
                labelActive.value = false;
            }   
            
        }


        const formatPickerDate = (date) => {

           
            if(date.length){

                
                return date.map( d => {
                       const day = d.getDate();
                       const month = d.getMonth() + 1;
                       const year = d.getFullYear();

                       return `${day}/${month}/${year}`;
                });

            }else{

                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();

                return `${day}/${month}/${year}`;

            }
            
        }

        const onMobileCover = () =>{            

            context.emit('on-focus');       
            
        }

        const setBlock = ( val ) =>{
            block.value = val;
        }

        onMounted( ()=>{
            
            if(props.forceValue){
               
                dateValue.value = new Date(props.forceValue);
            }
        })

        return{
            darkMode,
            mobile,
            labelActive, 
            dateValue,  
            showError,     
            block,          
            onMobileCover,
            formatPickerDate,   
            onDatePickerClear,
            onDatePickerChange,
            checkError,
            setBlock,substring


        }
    }

}
</script>

<style lang="scss" scoped>

.custom-datepicker-container{
    width: 100%;
}

.datepicker-container{
  position: relative; 
  background-color: var(--background-grey);
  transition: all var(--animation-duration) var(--animation-type);
}

.datepicker-label{
  position: absolute;
  z-index: 10;
  top: 0;
  padding:0;
  margin: 0;
  padding-left: 10px;
  padding-top: 3px; 
  font-family: RobotoLight;
  color: var(--success-color);
  opacity: 0;
  pointer-events: none;
  transition: all var(--animation-duration) var(--animation-type);
}

.datepicker-label-active {
  opacity: 1;
}

.date-picker-error{
    margin: 0;
    padding: 2px;
    color: var(--error-color);
    font-family: RobotoLight;
    font-size: 0.9em;
    opacity: 0;
    transition: all var(--animation-duration) var(--animation-type);
    
}

.date-picker-error-active{
    opacity: 1;
}

.dark .datepicker-container{
    background-color: rgba(0, 0, 0, 0.3);
}

.dark .datepicker-label{
  color: var(--dark-text-color);
}

.disabled{
    pointer-events: none;
    background-color: rgba(0, 0, 0, 0.1) !important;  
}

.mobile-cover{
    width: 100%;
    height: 100%;
    background-color: transparent;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 20;
}


</style>