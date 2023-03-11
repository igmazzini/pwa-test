import { ref, watch } from 'vue';
import { useRoute } from "vue-router";

const currentModal = ref('');
const showCurrentModal = ref(false);
const modalParams = ref(null);
const onAccept = ref(null);
const onCancel = ref(null);

const secondModal = ref('');
const showSecond = ref(false);
const secondModalParams = ref(null);
const onSecondModalAccept = ref(null);
const onSecondModalCancel = ref(null);


const showConfirm = ref(false);
const confirmParams = ref(null);
const onConfirmAccept = ref(null);
const onConfirmCancel = ref(null);


export const useModal = () =>{  


    const route = useRoute();

    watch(route, ()=>{
       
        if(showConfirm.value){
            hideConfirmation();
        }
        if(showCurrentModal.value){
            hideModal();
        }
        if(showSecond.value){
            hideSecondModal();
        }
    });


    const setModal = ( modal, second = false ) =>{

        let target = '';

        switch (modal) {
            case 'NewOrder':
                target = 'NewOrderModal';   
                break;
            case 'PayOrder':
                target = 'PayOrderModal';   
                break;
            case 'ExpenseReport':
                target  = 'NewExpenseReportModal';   
                break;
            case 'MoneyAssigned':
                target = 'NewMoneyAssignedModal';   
                break;
            case 'MoneyOrdered':
                target = 'NewMoneyOrderedModal';   
                break;
            case 'Project':
                target = 'NewProjectModal';   
                break;
            case 'Product':
                target = 'NewProductModal';   
                break;
            case 'Category':
                target = 'NewCategoryModal';   
                break;
            case 'CategoryGroup':
                target = 'NewGroupModal';   
                break;
            case 'Provider':
                target = 'NewProviderModal';   
                break;
            case 'LazyProvider':                
                target = 'NewLazyProviderModal';                  
                break;
        
            default:
                console.error('Modal not implemented:', modal);
                break;
        }

         
        if(second) {
            secondModal.value = target;
        }else{
            currentModal.value = target;
        }

    } 

    const showModal = (modal = '', acceptCallBack = null, cancelCallBack = null, params = null) => {


       
        if(modal == ' ') return;

        onAccept.value = acceptCallBack;
        onCancel.value = cancelCallBack;
        modalParams.value = params;       
       
        setModal(modal);

        showCurrentModal.value = true;
        
    }


    const hideModal = () =>{

        showCurrentModal.value = false;
        currentModal.value = '';   
        onAccept.value = null;
        onCancel.value = null;
        modalParams.value = null;
    }

    const showSecondModal = (modal = '', acceptCallBack = null, cancelCallBack = null, params = null) => {

       

        if(modal == ' ') return;

        onSecondModalAccept.value = acceptCallBack;
        onSecondModalCancel.value = cancelCallBack;
        secondModalParams.value = params;       
       
        setModal(modal,true);

        showSecond.value = true;
        
    }


    const hideSecondModal = () =>{

        showSecond.value = false;
        secondModal.value = '';   
        onSecondModalAccept.value = null;
        onSecondModalCancel.value = null;
        secondModalParams.value = null;
    }

    const showConfirmation = (acceptCallBack = null, cancelCallBack = null, params = null) =>{

        onConfirmAccept.value = acceptCallBack;
        onConfirmCancel.value = cancelCallBack;
        confirmParams.value = params;
       
        showConfirm.value = true;
    }

    const hideConfirmation = () =>{

        onConfirmAccept.value = null;
        onConfirmCancel.value = null;
        confirmParams.value = null;
       
        showConfirm.value = false;
    }


    return {
        //Properties
        currentModal,
        modalParams,
        confirmParams,
        showCurrentModal,
        showConfirm,

        secondModal,
        secondModalParams,
        showSecond,


        //Methods
        onAccept,
        onCancel,
        onSecondModalAccept,
        onSecondModalCancel,
        onConfirmAccept,
        onConfirmCancel,
        showModal,
        hideModal,
        showSecondModal,
        hideSecondModal,
        showConfirmation,
        hideConfirmation
    }
}