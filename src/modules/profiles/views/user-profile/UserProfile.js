import Breadcrumbs from "@/modules/shared/components/breadcrumbs/Breadcrumbs.vue";
import Input from "@/modules/shared/components/input/Input.vue";
import TextField from "@/modules/shared/components/text-field/TextField.vue";
import DatePicker from "@/modules/shared/components/date-picker/DatePicker.vue";
import TabNav from "@/modules/shared/components/tab-nav/TabNav.vue";
import InputMobile from '@/modules/shared/components/input-mobile/InputMobile.vue';
import DatePickerMobile from '@/modules/shared/components/date-picker-mobile/DatePickerMobile.vue';
import { useProfiles } from "@/modules/profiles/composables/useProfiles";
import { useUI } from "@/modules/shared/composables";
import {defineComponent, onMounted, ref } from "vue";
export default defineComponent({
  name: "UserProfile",
  components: {
    Breadcrumbs,
    Input,
    TextField,
    DatePicker,
    TabNav,
    InputMobile,
    DatePickerMobile
    
  },
  setup() {
    const { mobile, setTitle } = useUI();
    const { userProfile,  updateProfile } = useProfiles();
    const selectedTab = ref(0);    
    const updateData = ref(false);
    const profileData = ref({...userProfile.value});
    const showInputMobile = ref(false);
    const showDatePickerMobile = ref(false);
    const currentInputMobileType = ref('');
    const currentInputMobileTarget = ref('');
    const currentInputMobilePlaceholder = ref('');
    const currentInputMobileTitle = ref('');

    const inputName = ref(null);
    const inputLastName = ref(null);
    const inputDocumentType = ref(null);
    const inputDocument = ref(null);
    const inputPhone = ref(null);
    const inputCountry = ref(null);
    const inputAddress = ref(null);
    const inputLocality = ref(null);
    const inputState = ref(null);
    const inputPostalCode = ref(null);
    const inputBirthday = ref(null);
    const inputCuil = ref(null);
    const inputSocialWork = ref(null);
    const inputFoodRestriction = ref(null);
    const inputAffiliate = ref(null);
    

    setTitle("Perfil de usuario");
    


   

    const setTab = ({currentIndex} ) => {
      selectedTab.value = currentIndex;
     
      setTimeout(() => {
        allowModify(updateData.value);
      }, 100);
     
    };    

    const onChangeData =  () =>{     

        updateData.value = true;
        
        allowModify(updateData.value);
     
    }
    const onCancel =  () =>{     

        updateData.value = false;

        profileData.value = {...userProfile.value};
        
        allowModify(updateData.value);
     
    }


    const allowModify = ( allow ) =>{

        inputName.value?.setBlock(!allow);
        inputLastName.value?.setBlock(!allow);
        inputDocumentType.value?.setBlock(!allow);
        inputDocument.value?.setBlock(!allow);
        inputState.value?.setBlock(!allow);
        inputCountry.value?.setBlock(!allow);
        inputLocality.value?.setBlock(!allow);
        inputPostalCode.value?.setBlock(!allow);
        inputSocialWork.value?.setBlock(!allow);
        inputAddress.value?.setBlock(!allow);
        inputBirthday.value?.setBlock(!allow);
        inputFoodRestriction.value?.setBlock(!allow);
        inputCuil.value?.setBlock(!allow);
        inputPhone.value?.setBlock(!allow);
        inputAddress.value?.setBlock(!allow);
        inputAffiliate.value?.setBlock(!allow);
    }


    const onUpdate =  async () =>{     

      let errors = false;

      if(profileData.value.name.length == 0){
        inputName.value.checkError();
        errors = true;
      }

      if(!errors){

        const resp = await updateProfile(profileData.value);

        if(resp.ok){

            updateData.value = false;
        
            allowModify(updateData.value);
        }
      }

      
     
    }

    const onInputMobileAccept = ( {target , text} ) =>{    
     
      switch (target) {

        case 'name':
          profileData.value.name = text;
          break;

        case 'lastName':
          profileData.value.last_name = text;
          break;

        case 'documentType':
          profileData.value.document_type = text;
          break;

        case 'document':
          profileData.value.document = text;
          break;
      
        case 'phone':
          profileData.value.phone = text;
          break;
      
        case 'country':
          profileData.value.contry = text;
          break;
      
        case 'address':
          profileData.value.address = text;
          break;
      
        case 'locality':
          profileData.value.locality = text;
          break;
      
        case 'state':
          profileData.value.state = text;
          break;
      
        case 'cp':
          profileData.value.postal_code = text;
          break;

        case 'cuil':
          profileData.value.cuil = text;
          break;
      
        case 'socialWork':
          profileData.value.social_work = text;
          break;

        case 'foodRestriction':
          profileData.value.food_restriction = text;
          break;
      
        default:
          break;
      }
      showInputMobile.value = false;
    }
    const onInputMobileCancel = () =>{
      showInputMobile.value = false;
    }

    const onNameInputFocus = () =>{
      showInputMobile.value = true;
      currentInputMobileType.value = 'text';
      currentInputMobileTarget.value = 'name'; 
      currentInputMobilePlaceholder.value = 'Nombre'; 
      currentInputMobileTitle.value = 'Nombre'; 
    }
    
    const onLastNameInputFocus = () =>{
      showInputMobile.value = true;
      currentInputMobileType.value = 'text';
      currentInputMobileTarget.value = 'lastName'; 
      currentInputMobilePlaceholder.value = 'Apellido'; 
      currentInputMobileTitle.value = 'Apellido'; 
    }

    const onDocumentTypeInputFocus = () =>{
      showInputMobile.value = true;
      currentInputMobileType.value = 'text';
      currentInputMobileTarget.value = 'documentType'; 
      currentInputMobilePlaceholder.value = 'Tipo de documento'; 
      currentInputMobileTitle.value = 'Tipo de documento'; 
    }

    const onDocumentInputFocus = () =>{
      showInputMobile.value = true;
      currentInputMobileType.value = 'text';
      currentInputMobileTarget.value = 'document'; 
      currentInputMobilePlaceholder.value = 'Número de documento'; 
      currentInputMobileTitle.value = 'Número de documento'; 
    }

    const onPhoneInputFocus = () =>{
      showInputMobile.value = true;
      currentInputMobileType.value = 'text';
      currentInputMobileTarget.value = 'phone'; 
      currentInputMobilePlaceholder.value = 'Número de de telefono'; 
      currentInputMobileTitle.value = 'Número de telefono'; 
    }

    const onCountryInputFocus = () =>{
      showInputMobile.value = true;
      currentInputMobileType.value = 'text';
      currentInputMobileTarget.value = 'country'; 
      currentInputMobilePlaceholder.value = 'País'; 
      currentInputMobileTitle.value = 'País'; 
    }

    const onAddressInputFocus = () =>{
      showInputMobile.value = true;
      currentInputMobileType.value = 'text';
      currentInputMobileTarget.value = 'address'; 
      currentInputMobilePlaceholder.value = 'Direccíon'; 
      currentInputMobileTitle.value = 'Direccíon'; 
    }

    const onLocalityInputFocus = () =>{
      showInputMobile.value = true;
      currentInputMobileType.value = 'text';
      currentInputMobileTarget.value = 'locality'; 
      currentInputMobilePlaceholder.value = 'Localidad'; 
      currentInputMobileTitle.value = 'Localidad'; 
    }

    const onStateInputFocus = () =>{
      showInputMobile.value = true;
      currentInputMobileType.value = 'text';
      currentInputMobileTarget.value = 'state'; 
      currentInputMobilePlaceholder.value = 'Provincia'; 
      currentInputMobileTitle.value = 'Provincia'; 
    }

    const onPostalCodeInputFocus = () =>{
      showInputMobile.value = true;
      currentInputMobileType.value = 'text';
      currentInputMobileTarget.value = 'cp'; 
      currentInputMobilePlaceholder.value = 'Codigo postal'; 
      currentInputMobileTitle.value = 'Codigo postal'; 
    }

    const onCuilInputFocus = () =>{
      showInputMobile.value = true;
      currentInputMobileType.value = 'text';
      currentInputMobileTarget.value = 'cuil'; 
      currentInputMobilePlaceholder.value = 'CUIL'; 
      currentInputMobileTitle.value = 'CUIL'; 
    }

    const onSocialWorkInputFocus = () =>{
      showInputMobile.value = true;
      currentInputMobileType.value = 'text';
      currentInputMobileTarget.value = 'socialWork'; 
      currentInputMobilePlaceholder.value = 'Obra social'; 
      currentInputMobileTitle.value = 'Obra social'; 
    }

    const onFoodRestrictionInputFocus = () =>{
      showInputMobile.value = true;
      currentInputMobileType.value = 'text';
      currentInputMobileTarget.value = 'foodRestriction'; 
      currentInputMobilePlaceholder.value = 'Restriccíon alimentaria'; 
      currentInputMobileTitle.value = 'Restriccíon alimentaria'; 
    }

    const onBirthdayFocus = () =>{
      showDatePickerMobile.value = true;
    }

    const onMobilePickerAccept = (modelData) =>{
     
     
      if(modelData){

        profileData.value.date_birth = modelData.toISOString();

      }       
      
      showDatePickerMobile.value = false;
     
    }
    const onMobilePickerCancel = () =>{     
     
      showDatePickerMobile.value = false;
     
    }
    

    onMounted( async()=>{
       
      profileData.value = {...userProfile.value};

      allowModify(false);


     

      
    });

    return {
      mobile,   
      showInputMobile,  
      showDatePickerMobile,
      currentInputMobileType,
      currentInputMobileTarget,
      currentInputMobilePlaceholder,
      currentInputMobileTitle,
      inputName,
      inputLastName,
      inputDocumentType,
      inputDocument,
      inputPhone,
      inputCountry,
      inputAddress,
      inputLocality,
      inputState,
      inputPostalCode,
      inputBirthday,
      inputSocialWork,
      inputCuil,
      inputFoodRestriction,
      inputAffiliate,     
      updateData,     
      profileData,
      onUpdate,
      selectedTab,
      setTab,
      onChangeData,
      onCancel,
      onInputMobileAccept,
      onInputMobileCancel,
      onNameInputFocus,
      onLastNameInputFocus,
      onDocumentTypeInputFocus,
      onDocumentInputFocus,
      onPhoneInputFocus,
      onCountryInputFocus,
      onAddressInputFocus,
      onLocalityInputFocus,
      onStateInputFocus,
      onPostalCodeInputFocus,
      onCuilInputFocus,
      onSocialWorkInputFocus,
      onFoodRestrictionInputFocus,
      onMobilePickerAccept,
      onMobilePickerCancel,
      onBirthdayFocus
    };
  },
});