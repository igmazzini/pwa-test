import { defineComponent, onMounted, ref, watch } from 'vue';
import ConfirmationModal from '@/modules/shared/components/confirmation-modal/ConfirmationModal.vue';
import { useUI } from '@/modules/shared/composables/useUI';
import { useStorages } from '@/modules/projects/composables';
import { substring } from '@/helpers/utils';
import { v4 as uuidv4 } from 'uuid';


export default defineComponent ({
    name:'UploadFilesList',
    components:{
        ConfirmationModal
    },
    props:{
        previousFiles:{
            type:Array,            
        },
        canDeletePrevious:{
            type:Boolean,
            default:false
        },
        expenseReport:{
            type:Boolean,
            default:false
        },
        nameFileWidth:{
            type:Number,
            default:5
        }
    },
    setup(props){

        const { mobile, openFile } = useUI();
        const { storageTypes, expenseReportStorageTypes } = useStorages();
        const files = ref([]);       
        const uploadInput = ref(null);
        const showConfirmModal = ref(false);
        const deleteFileName = ref('');
        let currentFileIndex = -1;
        let deletedFiles = [];



        watch( () => props.previousFiles, () =>{
            if(props.previousFiles){              
               

                files.value.forEach( file => {
                    
                    const previousFile =  props.previousFiles.find( (pf) => pf.type?.storage_type_id === file.storage_type_id);

                    //console.log(props.previousFiles)
                  
                    if(previousFile){
                        file.type               = previousFile.type.type_name;
                        file.storage_type_id    = previousFile.type.storage_type_id;
                        file.file_name          = previousFile.file_name;
                        file.file_id            = previousFile.file_id;
                        file.storage_url        = previousFile.storage_url;
                        file.storage_id         = previousFile.storage_id;
                        file.canDelete          = props.canDeletePrevious;
                    }                    
                    
                });          
                
               
              
                
            }
        })  


        watch(storageTypes,  ()=>{

           setFiles();
        });

        

        const setFiles = () =>{

            files.value = [];

            deletedFiles = [];

            if(props.expenseReport){
                
                expenseReportStorageTypes.value.map( ( fileType ) => {

                    const file = {
                        type:fileType.type_name,               
                        storage_type_id:fileType.storage_type_id,               
                        file_name:'',
                        file_id:'',
                        storage_url:'',
                        storage_id:'',
                        file:null,
                        canDelete:true
                    }
        
                    files.value.push(file);
                    
                });

            }else{

                storageTypes.value.map( ( fileType ) => {

                    const file = {
                        type:fileType.type_name,               
                        storage_type_id:fileType.storage_type_id,               
                        file_name:'',
                        file_id:'',
                        storage_url:'',
                        storage_id:'',
                        file:null,
                        canDelete:true
                    }
        
                    files.value.push(file);
                    
                });

            }

          
        }

        const handleFileUpload = async () => {
           

            const data = uploadInput.value.files[0];           

            if(data){

                files.value[currentFileIndex].file = data;
                files.value[currentFileIndex].file_name = data.name;
                if(files.value[currentFileIndex].file_id == ''){
                    files.value[currentFileIndex].file_id = uuidv4();
                }
                               

            }          

           
        }      

        const onFileClick = (index) =>{          


            
            const file = files.value[index];    
            
            
            if(file.file || file.storage_url){
                openFile(file);
            }else{
                onUploadFileClick(index); 
            }
        
           
        }

        const onUploadFileClick = (index) =>{   
           
           
            
            currentFileIndex = index;  
            
            uploadInput.value.click();
           
        }

        const onDeleteFile = ( index ) =>{         

            

            if(files.value[index].canDelete){
               

                currentFileIndex = index;

                deleteFileName.value = files.value[currentFileIndex].file_name;                

                showConfirmModal.value = true;  

            }

                   
           
        }
        
        const onConfirmDelete = () =>{

            const deleteFile = {...files.value[currentFileIndex]};

            deletedFiles.push(deleteFile);

            files.value[currentFileIndex].file = null;
            files.value[currentFileIndex].storage_url = '';
            files.value[currentFileIndex].file_name = '';
            currentFileIndex = -1;           
            showConfirmModal.value = false;
        }

        const onCancelDelete = () =>{
            showConfirmModal.value = false;
        }

        const clearFiles = () =>{
            setFiles();    
        }


      


        onMounted( async () =>{           
            
            setFiles();

            if(props.previousFiles){
               

                files.value.forEach( file => {
                    
                    const previousFile =  props.previousFiles.find( (pf) => pf.type?.storage_type_id === file.storage_type_id);                  

                    if(previousFile){
                        file.type               = previousFile.type.type_name;
                        file.storage_type_id    = previousFile.type.storage_type_id;
                        file.file_name          = previousFile.file_name;
                        file.file_id            = previousFile.file_id;
                        file.storage_url        = previousFile.storage_url;
                        file.storage_id         = previousFile.storage_id;
                        file.canDelete          = props.canDeletePrevious;
                    }                    
                    
                });               
          
            }
        });

        
        return{
            files,
            deletedFiles,
            substring,
            mobile,
            uploadInput,
            showConfirmModal,
            deleteFileName,
            onFileClick,
            onDeleteFile,
            onUploadFileClick,
            handleFileUpload,
            clearFiles,
            onConfirmDelete,
            onCancelDelete,
        }
    }
});