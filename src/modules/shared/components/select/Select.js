import { defineComponent,  onMounted, ref, watch } from 'vue';
import { useUI } from '@/modules/shared/composables/useUI'
export default defineComponent({
    name:'SelectComponent',
    emits:[
        'option-selected',
        'open-select',       
    ],
    props:{
        options:{
            type:Array,
            required:true
        },
        selected:{
            type:Object,
            default:null
        },
        label:{
            type:String,
            default:'Label'
        },
        ignoreMobile:{
            type:Boolean,
            default:false
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
        }      
    },    
    setup(props,context){

     
        const { mobile } = useUI();    
        const inputText = ref('');
        const options = ref([]);
        const filterOptions = ref([]);
        const showOptions = ref(false);
        const emptyResults = ref(false);
        const labelActive = ref(false);
        const selectedOption = ref(null);
        const checkingError = ref(false);
        const showError = ref(false);
        const block = ref(false);
       

        watch(inputText,()=>{
            filter();
            
        });

        watch(() =>  props.options,()=>{

          
           options.value = props.options;          
           inputText.value = '';
           filterOptions.value = options.value;

          
          
        });

        watch(() =>  props.selected,()=>{    

          
            
            if(!props.selected){
                selectedOption.value = null;               
                inputText.value = '';
                return;
            }
                 
                     
           const sption = options.value.find( opt =>  opt.value == props.selected.value);     
                    
           if(sption){
                selectedOption.value = sption;
                inputText.value = selectedOption.value.label;

                if(checkingError.value){
                    showError.value = false;       
                 } 
                
           }         
          
        });

        const filter = () =>{
            if(inputText.value.length == 0 || selectedOption.value != null){
                filterOptions.value = options.value;
                emptyResults.value = false; 
            }else{

                filterOptions.value = options.value;
                let filters = [];
               
               
                filterOptions.value.forEach((opt) => {
                  
                    
                    
                    if(props.searchTarget != ''){

                        if(String(opt.label).toLowerCase().search(inputText.value.toLowerCase()) > -1 || String(opt[props.searchTarget]).toLowerCase().search(inputText.value.toLowerCase()) > -1){
                            filters.push(opt)
                        } 
                    }else{

                        if(String(opt.label).toLowerCase().search(inputText.value.toLowerCase()) > -1){
                            filters.push(opt)
                        } 
                    }
                });         

                filterOptions.value = filters;

                

                if(filterOptions.value.length === 0){

                    if(props.showAddNew){
                      
                        filterOptions.value = [{label:props.addNewLabel, value:'new'}];

                    }else{
                        emptyResults.value = true; 
                    }
                       

                }else{

                   emptyResults.value = false; 
                }
            }
           

           
        }

        const onFocus = () => {               
            
            
            if(mobile.value == false && props.ignoreMobile == false){

                selectedOption.value = null;
                showOptions.value = true;              
            }
           
            
        };

        const onBlur = () => {          
            setTimeout(() => {
                if(selectedOption.value === null){
                    showOptions.value = false;                       
                    inputText.value = '';  
                    if(checkingError.value){
                        showError.value = true;       
                    } 
                    context.emit('option-selected',selectedOption.value ); 
                }
                
            }, 150);
          
            
        };

        const checkError = () => {          

            checkingError.value = true; 

            if(inputText.value == ''){
                showError.value = true;
            } 
        }

        const setBlock = (val) => {         

            block.value = val;          
           
        }

        const clear = () =>{

            selectedOption.value = null;
            
            inputText.value = '';
        }

        const onOption = (option) => {            
            
           
            selectedOption.value = option;
            inputText.value = option.label;
            showOptions.value = false;
            if(checkingError.value){
               showError.value = false;       
            }  
            context.emit('option-selected',selectedOption.value );
           
        };

        const onClick = () =>{
           
            context.emit('open-select');
        }

        onMounted(()=>{
          
           if(props.options){
               options.value = props.options; 
               filterOptions.value = options.value;

               if(props.selected){
                    const sption = options.value.find( opt =>  opt.value == props.selected.value);           
                        
                    console.log(sption)
                                
                    if(sption){
                            selectedOption.value = sption;
                            inputText.value = selectedOption.value.label;
                            
                    }  
                }
                        
                            
                
           }else{
               emptyResults.value = true;
           }

           
        });    

      


        return {
            mobile,
            labelActive,
            inputText,
            filterOptions,
            showOptions,
            emptyResults,
            onFocus,
            onBlur,
            onClick,
            onOption,
            checkError,
            showError,
            setBlock,
            clear,
            block
        }
    }

})