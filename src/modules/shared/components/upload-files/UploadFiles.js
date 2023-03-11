import Select from '@/modules/shared/components/select/Select.vue';
import UploadButton from '@/modules/shared/components//upload-button/UploadButton.vue';
import SelectMobile from '@/modules/shared/components/select-mobile/SelectMobile.vue';
import { useUI } from '@/modules/shared/composables/useUI';
import { useStorages } from '@/modules/projects/composables';
import { substring } from '@/helpers/utils';
import {  onMounted, ref, defineComponent } from 'vue';


export default defineComponent ({
    name:'UploadFiles',
    components:{      
        Select,
        UploadButton,
        SelectMobile 
    },
    emits:[        
        'on-file-selected'
    ],  
    setup(props,context){

       
        const { mobile, openFile } = useUI();
        const {storageTypes, getStorageTypes } = useStorages();
        const typeSelect = ref(null);
        const types = ref([]);         
        const files = ref([]);
        const disabledButton = ref(true)
        const showError = ref(false)
        const showSelectMobile = ref(false);
        const selectMobileOptions = ref([]);
        const selectedOption = ref(null);

        let  currentType =  {label:'',id:''};   
        
        types.value = storageTypes.value.map( type => {
            return {
                label:type.type_name,
                value:type.storage_type_id,
            }
        });

        selectMobileOptions.value = types.value;

        const onTypeSelected = ( option ) =>{

          //console.log(option)
         
          if(!option){

            currentType = {label:'',id:''};
            disabledButton.value = true;

          }else{

            currentType.label = option.label;
            currentType.id = option.value;
            disabledButton.value = false;

          }
         
        }

        const onSelectedFile = (data) =>{
            
            const file = {                
                name:data.name,
                type:currentType.label,
                storage_type_id:currentType.id,
                file:data
            }           

            files.value.push(file);

            showError.value = false;

            context.emit('on-file-selected',files.value);
        }


        const clearFiles = () =>{    

            files.value = [];           
            typeSelect.value.clear();

          
        }

       

        const onFileClick = (index) =>{

            const file = files.value[index];              
        
           openFile(file);
        }

       
        
        const onDeleteFile = ( index ) =>{

            files.value.splice(index,1);

            context.emit('on-file-selected',files.value);
        }

        const onOpenSelectMobile = () =>{
             showSelectMobile.value = true;
        }

        const onSelectMobileAccept = ({ option }) =>{
            
            currentType.label = option.label;
            currentType.id = option.value;
            disabledButton.value = false;
            selectedOption.value = option;
            showSelectMobile.value = false;
        }
        const onSelectMobileCancel = () =>{
            selectedOption.value = null;
            showSelectMobile.value = false;
        }

        const checkError = () =>{
           
           if( files.value.length == 0 ){
              showError.value = true;
              return true;
           }else{
              showError.value = false;
              return false;
           }
        }

        onMounted( async ()=>{

            if(types.value.length == 0){

                const resp = await getStorageTypes();

                if(!resp.ok) return;

                types.value = storageTypes.value.map( type => {
                    return {
                        label:type.type_name,
                        value:type.storage_type_id,
                    }
                });

                selectMobileOptions.value = types.value;
            }
           
        });

        

       

        return{
          
            mobile,
            types, 
            selectMobileOptions,
            showSelectMobile,
            files,
            disabledButton,
            showError,
            typeSelect,
            onTypeSelected,   
            onSelectedFile, 
            onFileClick, 
            onDeleteFile,
            substring,
            checkError,
            onOpenSelectMobile,
            onSelectMobileAccept,
            onSelectMobileCancel,
            clearFiles,
            selectedOption
        }

    }    
})