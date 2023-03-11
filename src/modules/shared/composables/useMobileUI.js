import { ref } from 'vue';

const showDatePicker = ref(false);
const showSelect = ref(false);
const showInput = ref(false);

const selectParams = ref({
    title:'',
    target:'',
    showAddNew:false,
    searchTarget:'',
    type:'text',
    options:[]
});
const inputParams = ref({
    title:'',
    target:'',
    type:'',
    inputType:'text',
    placeholder:''
});

const onAccept = ref(null);
const onCancel = ref(null);

export const useMobileUI = () =>{ 

    
    const showUI = (target = '', acceptCallBack, cancelCallBack, params ) =>{

        if( target == '') return;

        onAccept.value = acceptCallBack;
        onCancel.value = cancelCallBack;

        switch (target) {
            case 'select':

                selectParams.value = params;

                showSelect.value = true;
                
                break;

            case 'input':

                inputParams.value = params;

                showInput.value = true;
                
                break;

            case 'date-picker':               

                showDatePicker.value = true;
                
                break;
        
            default:
                break;
        }
       

    }

    const hideUI = () =>{

        showSelect.value = false;
        showInput.value = false;
        showDatePicker.value = false;

        onAccept.value = null;
        onCancel.value = null;
        selectParams.value ={ title:'',target:'',showAddNew:false,searchTarget:'', type:'text', options:[]};
        inputParams.value ={ title:'',target:'', placeHolder:'',type:'',inputType:'text'};      

    }
    

    return{

        //Properties
        showDatePicker,
        showSelect,
        showInput,
        selectParams,
        inputParams,

        //Methods
        onAccept,
        onCancel,
        showUI,
        hideUI
    }

 }
