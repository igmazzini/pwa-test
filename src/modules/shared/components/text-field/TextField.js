import { defineComponent, ref, watch } from "vue";
import { useUI } from '@/modules/shared/composables/useUI';



export default defineComponent ({
    name:'TextField',
    props:{
        label:{
            type:String,
            default:'label'
        },
        text:{           
            default:'text'
        },
        withCopy:{
            type:Boolean,
            default:false
        },
        type:{
            type:String,
            default:'text'
        }
    },
    setup(props){

        const { copyToClipboard, formatAmount } = useUI();        
        const textFieldContainer = ref(null);
        const block = ref(false);
        const bigText = ref(false);
        const error = ref('Requerido');
        const showingError = ref(false);



        if(props.text.length > 35){
            bigText.value = true;                
        }else{
            bigText.value = false;               
        }

        watch(()=> props.text,() => {

            console.log('props.text',String(props.text).length,showingError.value)
            
            if(String(props.text).length > 35){
                bigText.value = true;                
            }else{
                bigText.value = false;               
            }

            if(String(props.text).length > 0 && showingError.value){
                showingError.value = false;  
            }
        });

        const setBlock = (val) => {
            block.value = val;
        }
        const showError = (val = '') => {

            if(val != ''){
                error.value = val;
            }

            showingError.value = true;
          
        }
        
        const onCopyText = () =>{
            copyToClipboard(props.text,`${props.label} copiado`,textFieldContainer.value,textFieldContainer.value.clientWidth * 0.5);
        }

       /*  onMounted(() => {
            if(props.text.length > 50){
                textFieldContainer.value.style.height = '100px';
            }
        }); */
        return{           
            textFieldContainer,
            block,
            bigText,
            error,
            showingError,
            onCopyText,
            setBlock,
            showError,
            formatAmount
        }
    }
});