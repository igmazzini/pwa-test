
import { defineComponent, onMounted, ref, watch } from 'vue';
import UploadFilesList from '@/modules/shared/components/upload-files-list/UploadFilesList.vue';
import TextField from '@/modules/shared/components/text-field/TextField.vue';
import { useUI } from '@/modules/shared/composables';
import { useOrders } from '@/modules/projects/composables';




export default defineComponent({
    name:'OrderDetail',   
    components:{  
     
        UploadFilesList,     
        TextField
       
    },
    emits:[
        'on-update',   
        'on-annulate',   
        'on-approved',   
        'on-pay',    
    ],
    props:{
        order:{
            type:Object
        }
    },
    setup(props, context){

      
        const { formatAmount, formatDate, darkMode, mobile, getStatus } = useUI();     
        const { currentOrder } = useOrders(); 
       
        const title = ref('Detalle de orden');     
        const annulateButtonLabel = ref('Anular');
        const payButtonLabel = ref('Pagar');
        const approvedButtonLabel = ref('Aprobar');       
        const uploadFilesListRef = ref(null);        
       
       
        watch( currentOrder , ()=>{
            if(currentOrder.value){   
                
                if(uploadFilesListRef.value){
                    uploadFilesListRef.value.clearFiles();
                }            
                 
                
                title.value = `Orden: ${currentOrder.value.order_code}`;     

               
            }else{
                title.value = `Detalle de orden`;
            }
        });      
      

        const onPayOrder = () =>{


            context.emit('on-pay');           
            
        }


        const onApprovedOrder = () =>{          

            context.emit('on-approved');           
            
        }

        const onUpdateOrder = () =>{           

            const deletedfiles = uploadFilesListRef.value.deletedFiles;

            console.log(deletedfiles);
            const files = uploadFilesListRef.value.files.filter( file => (file.file != null || file.storage_url != ''));

            if(files){             
               

                const order = {...currentOrder.value};

                order.files = files;

                order.deletedFiles = deletedfiles;

                context.emit('on-update',order);
            }  
           
            
        }

        const onAnnularOrder = () =>{

            context.emit('on-annulate');           
            
        }


        onMounted(()=>{

            if(currentOrder.value){         

                title.value = `Orden: ${currentOrder.value.order_code}`;


            }else{

                title.value = `Detalle de orden`;
            }
        });

        return{
            title,
            mobile,
            darkMode,
            payButtonLabel,
            approvedButtonLabel,
            annulateButtonLabel,
            uploadFilesListRef,     
            formatAmount,  
            formatDate,     
            getStatus,
            currentOrder,                    
            onPayOrder,
            onApprovedOrder,
            onUpdateOrder,
            onAnnularOrder,      
           
           
        }
       
    }
});