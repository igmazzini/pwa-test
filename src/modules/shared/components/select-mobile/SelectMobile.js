import {  defineComponent, onMounted, ref, toRefs, watch } from "vue";
import { useUI } from '@/modules/shared/composables/useUI';

export default defineComponent({
    name:'SelectMobile',  
    props:{
        options:{
            type:Array,
            required:true
        },
        target:{
            type:String,
            default:''
        },
        title:{
            type:String,
            default:''
        },
        searchBar:{
            type:Boolean,
            default:true
        },
        showAddNew:{
            type:Boolean,
            default:false
        },
        addNewLabel:{
            type:String,
            default:'Agregar nuevo'
        },      
        searchTarget:{
            type:String,
            default:''
        },
        type:{
            default:'text'
        } 
    },
    emits:[
        'on-accept',
        'on-cancel',
    ], 
    setup(props, context){

        const { openKeyboard, substring } = useUI();        
        const currentOption = ref({label:'',value:''});        
        const inputText = ref('');        
        const inputRef = ref(null);   
        const selectOptions =  ref([]);
       

        selectOptions.value = toRefs(props.options); 
        
        watch(inputText, () => {            
            searchItem();
        });


        const searchItem = () =>{            
            

            if(inputText.value == '' || currentOption.value.label === inputText.value){
                selectOptions.value = props.options;
                return;

            }    
            
            selectOptions.value = props.options;

            let result = [];

            selectOptions.value.forEach( opt => {

                if(props.searchTarget != ''){                   


                    if( String(opt.label).toLowerCase().includes(inputText.value.toLowerCase()) || String(opt[props.searchTarget]).toLowerCase().includes(inputText.value.toLowerCase()) ){

                      
                        result.push(opt);
    
                    }
                }else{

                    if( String(opt.label).toLowerCase().includes(inputText.value.toLowerCase()) ){

                        result.push(opt);
    
                    }
                }

                

            });

            if(result.length > 0 ){
                currentOption.value = {label:'',value:''};
                selectOptions.value = result;

            }else{
               

                if(props.showAddNew){

                    selectOptions.value = [{label:props.addNewLabel,value:'new'}];

                }else{

                    selectOptions.value = props.options;
                }

               
               
            }         

           
            
        }

        const onCancel = () =>{
          
            context.emit('on-cancel');
        }
        const onAccept = () =>{
                
            context.emit('on-accept', { target:props.target, option:currentOption.value }); 
        }

        const onOptionTab = (option) =>{           
                      
            currentOption.value = option;                
            
        }

        onMounted( () =>{

            selectOptions.value = props.options; 

            

        });
       
        return{
            openKeyboard,
            currentOption,
            selectOptions,
            inputText,
            inputRef,
            onCancel,
            onAccept,
            onOptionTab,
            substring
        }
    }
});