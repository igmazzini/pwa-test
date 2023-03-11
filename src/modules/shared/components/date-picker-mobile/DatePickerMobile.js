import {  defineComponent, ref } from "vue";
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useUI } from "@/modules/shared/composables/useUI";

export default defineComponent({
    name:'DatePickerMobile',   
    components:{
        Datepicker
    },
    emits:[
        'on-accept',
        'on-cancel',
    ], 
    setup(props, context){

        const dateSelected = ref('')
        const { darkMode } = useUI();
      
        const onDateSelected = (modelData) =>{
           
            dateSelected.value = modelData;
        }

      
        const onCancel = () =>{
          
            context.emit('on-cancel');
        }
        const onAccept = () =>{
                
            context.emit('on-accept',dateSelected.value); 
        }



      
       
        return{
            darkMode,
            dateSelected,
            onDateSelected,
            onCancel,
            onAccept,
          
        }
    }
});