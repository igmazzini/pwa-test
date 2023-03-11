import {  defineComponent, ref ,onMounted} from "vue";
import { format, unformat}  from '@/helpers/utils';
import { useUI } from '@/modules/shared/composables/useUI';

export default defineComponent({
    name:'InputMobile',  
    props:{
        type:{
            type:String,
            default:'text'
        },     
        inputType:{
            type:String,
            default:'text'
        },     
        placeholder:{
            type:String,
            default:''
        },
        title:{
            type:String,
            default:''
        },
        target:{
            type:String,
            default:''
        }
    },
    emits:[
        'on-accept',
        'on-cancel',
    ], 
    setup(props, context){

        const { currency } = useUI();    
        const inputText = ref('');        
        const inputRef = ref(null);          
        const hasError = ref(false);  
        const formatValue = ref('');
        const showText = ref(false);  




        const updateValue = (event) => {         

            

            if(props.type == 'money'){

                //setCursorPosition(event.target);
          
                formatValue.value = unformat(event.target.value);              

                inputText.value = formatValue.value;

                formatValue.value  = format(formatValue.value,{prefix:`${currency.value} `});

            }else{

                formatValue.value = event.target.value;
                inputText.value = formatValue.value;
            }
            

            
        }

       /*  const onFocus = (event) =>{
            if(props.type == 'numeric'){
                setCursor(event.target, (event.target.value.length - String('$').length))
            }        
             
        } */

        const getButtonStatus = () =>{
            if(props.type == 'money'){

                if(inputText.value > 0){

                    return true;     

                }else{

                    return false;
                }

            }else{

                if(inputText.value.length > 0){
                    return true;     
                }else{
                    return false;
                }
            }
        }


        const onCancel = () =>{
          
            context.emit('on-cancel');
        }
        const onAccept = () =>{
            let text =    inputText.value;
            if(props.type == 'money'){
                text = unformat(formatValue.value);
               
            }

            context.emit('on-accept', { target:props.target, text }); 
        }
        

       

        onMounted( () =>{
           
            inputRef.value.focus();          
        });

     
       
        return{
          
            inputText,
            formatValue,
            inputRef,
            hasError,
            showText, 
            getButtonStatus,
            updateValue,           
            onCancel,
            onAccept,   
                  
        }
    }
});