<template>

    <div class="modal-layout">
        <div class="modal-title">
            <p>Nuevo proyecto</p>
        </div>
        <div class="modal-form">            
            <Input ref="inputName" v-model="project.project_name" :label="'Nombre del proyecto'" />            
            <Input ref="inputBudget" v-model="project.budget" :label="'Presupuesto'" :type="'money'"/>     
            <Select ref="codeFormatSelect" :label="'Formato de codigo'" :options="codeOptions"  @option-selected="onCodeFormatSelected" />
            <ProjectCodeInput ref="inputCode" :label="'Codigo'" :codeOption="project.project_code_option" :serie="payLoad" @update-text="onCodeTextUpdate" />      
            <DatePicker v-model="project.date_initial" :autoApply="true"  ref="initialDatePicker" :label="'Inicio de proyecto'" />
            <DatePicker v-model="project.date_final" :autoApply="true" :minDate="project.date_initial" ref="finalDatePicker" :label="'Finalización de proyecto'" />           
            <DatePicker v-model="project.shooting_days" :minDate="project.date_initial"  :maxDate="project.date_final" ref="shootingDatesPicker" :label="'Dias de rodaje'" :multiDates="true"   />           
            <Select ref="agreementSelect" :label="'Imprevisto'" :options="agreementOptions"  @option-selected="onAgreementSelected" />
            <Input ref="inputAgreement" v-model="project.agreement_value" :label="'Valor de imprevisto'" :type="agreementValueType"/>       
            
        </div>
        <div class="modal-actions">
            <button @click="onCancel" class="modal-actions--cancel">Cancelar</button>
            <button @click="onAccept" class="modal-actions--accept">Crear proyecto</button>
        </div>
    </div>


  
</template>

<script>

import { ref } from 'vue';
import {Input, DatePicker, Select} from '@/modules/shared/components';
import ProjectCodeInput from '@/modules/projects/components/project/code-input/ProjectCodeInput.vue';




export default {
    name:'NewProjectModal',
    components:{
        Input,        
        DatePicker,
        Select,
        ProjectCodeInput 
    },
    props:{
        payLoad:{
            default:null
        }
    },
    emits:[
        'on-cancel',
        'on-accept'
    ],
    setup(props,context){   

      
        const inputName = ref(null);
        const inputBudget = ref(null);
        const inputCode = ref(null);
        const initialDatePicker = ref(null);
        const finalDatePicker = ref(null);
        const shootingDatesPicker = ref(null);
        const codeFormatSelect = ref(null);
        const agreementSelect = ref(null);
        const inputAgreement = ref(null);
        const agreementValueType = ref('Number');
        const codeOptions = ref([
            {label:'Texto - [ Numeró de serie ] - Texto', value:0},
            {label:'Texto - [ Numeró de serie ]', value:1},
            {label:'[ Numeró de serie ] - Texto', value:2},
        ]);
        const agreementOptions = ref([
            {label:'Porcentaje', value:'%'},
            {label:'Valor', value:'value'},
            {label:'Sin limite', value:'unlimited'},
            
        ]);
        const currentCodeOption = ref(0);      
      

        const project = ref({
            project_name:'',
            budget:'',
            date_initial:'',
            date_final:'',
            agreement_type:'',
            agreement_value:'',
            project_code_option:-1,
            first_text_project_code:'',
            second_text_project_code:'',
            shooting_days:[]
        });     
        
        const onCodeTextUpdate = ( firstText, secondText ) =>{
           
            project.value.first_text_project_code = firstText;
            project.value.second_text_project_code = secondText;            
        }

        const onCodeFormatSelected = ( option ) =>{

            inputCode.value.clear();

            if(!option) {
                project.value.project_code_option = '';
                return;
            }

            inputCode.value.onFocus();

            project.value.project_code_option = option.value;

           
        }

        const onAgreementSelected = ( option ) =>{
            if(!option) {
                project.value.agreement_type = 0;
                return;
            }

            inputAgreement.value.onClear();

            project.value.agreement_type = option.value;

            if(project.value.agreement_type == 'value'){
                agreementValueType.value = 'money';
            }else{
                agreementValueType.value = 'number';
            }

            if(project.value.agreement_type == 'unlimited'){
                inputAgreement.value.setBlock(true);
            }else{
                inputAgreement.value.setBlock(false);
            }
        }
       

        const onCancel = () =>{
            context.emit('on-cancel');
        }

        const onAccept = () =>{     
        
            

            let errors = false;

            

            if(project.value.project_name.length == 0){
                inputName.value.checkError();
                errors = true;
            }
            if(project.value.budget.length == 0){
                inputBudget.value.checkError();
                errors = true;
            }
            if(project.value.date_initial.length == 0){
                initialDatePicker.value.checkError();
                errors = true;
            }
            if(project.value.date_final.length == 0){
                finalDatePicker.value.checkError();
                errors = true;
            }
            if(project.value.project_code_option == -1){

                codeFormatSelect.value.checkError();
                errors = true;
            }

            if(project.value.first_text_project_code.length == 0){
                errors = true;
                inputCode.value.showError();
            }

            if(project.value.project_code_option == 0){

                if(project.value.first_text_project_code.length == 0 || project.value.second_text_project_code.length == 0){
                    errors = true;
                    inputCode.value.showError();
                }
               
            }
            if(project.value.project_code_option == 1 || project.value.project_code_option == 2){

                if(project.value.first_text_project_code.length == 0){
                    errors = true;
                    inputCode.value.showError();
                }
               
            }

            if(project.value.agreement_type.length == 0){

                agreementSelect.value.checkError();
                errors = true;                  
               
            }

            if(project.value.agreement_type != 'unlimited' && project.value.agreement_value.length == 0){               

                inputAgreement.value.checkError();
                errors = true;                  
               
            }

            if(project.value.agreement_type == '%'){     
                
                if(project.value.agreement_value == 0 || project.value.agreement_value < 0){
                    inputAgreement.value.showError('El valor de porcentaje debe ser mayor a 0');
                    errors = true;                  
                }

                if(project.value.agreement_value > 100){
                    inputAgreement.value.showError('El valor de porcentaje no puede ser mayor a 100');
                    errors = true;                  
                }

               
               
            }

            if(project.value.shooting_days.length == 0){
                shootingDatesPicker.value.checkError();
                errors = true;
            }

           
           
            
            if(!errors){   
                project.value.shooting_days = project.value.shooting_days.map( date => date.toISOString());
                project.value.first_text_project_code = project.value.first_text_project_code.toUpperCase();
                project.value.second_text_project_code = project.value.second_text_project_code.toUpperCase();
                context.emit('on-accept',project.value);
            }
           
        }

      

        return{      
            
            //Properties
            inputName,
            inputBudget,            
            initialDatePicker,  
            inputCode,
            finalDatePicker,  
            shootingDatesPicker,
            codeFormatSelect,
            agreementSelect,
            inputAgreement,
            project,            
            codeOptions,
            currentCodeOption,
            agreementOptions,
            agreementValueType,
            
            
            //Methods
            onCancel,
            onAccept,
            onCodeTextUpdate,
            onCodeFormatSelected,
            onAgreementSelected
           
        }
    }

}
</script>

<style lang="scss" scoped>
@import "./new-project-modal.scss";



</style>