<script src="./UserProfile.js"></script>
<template>
  <DatePickerMobile v-if="showDatePickerMobile" @on-accept="onMobilePickerAccept" @on-cancel="onMobilePickerCancel"/>
  <InputMobile ref="inputMobile" v-if="showInputMobile" :title="currentInputMobileTitle" :type="currentInputMobileType"  :target="currentInputMobileTarget" :placeholder="currentInputMobilePlaceholder"  @on-cancel="onInputMobileCancel" @on-accept="onInputMobileAccept" />
  <div class="profile">
    <div v-if="!mobile" class="profile-breadcrumbs">
      <Breadcrumbs />
    </div>
    <div class="profile-data"  v-if="profileData">
      <div class="profile-data-general">
        <div class="photo-name">
          <img
          class="profile-data-avatar"
          :src="profileData?.photo_url"
          referrerpolicy="no-referrer"
          alt="User photo"
        />
        <p class="name">{{ profileData?.name }} {{ profileData?.last_name }}</p>
        </div>
        
        
        <p class="email"><font-awesome-icon icon="fa-solid fa-envelope" />{{ profileData?.email }}</p>
        <p class="role"><font-awesome-icon icon="fa-solid fa-user" />{{ profileData?.role }}</p>
      </div>
      <TabNav
        class="profile-data-tabs"
        :tabs="['Información personal', 'Información laboral']"
        @on-selected-tab="setTab"
       
       
      >
       
          <div
            v-if="selectedTab == 0"
            class="profile-data-personal"
          >
            <Input ref="inputName" @on-focus="onNameInputFocus" :forceValue="profileData?.name" v-model="profileData.name" :label="'Nombre'" />
            <Input ref="inputLastName" @on-focus="onLastNameInputFocus" :forceValue="profileData?.last_name"  v-model="profileData.last_name" :label="'Apellido'" />
            <Input ref="inputDocumentType" @on-focus="onDocumentTypeInputFocus" :forceValue="profileData?.document_type"  v-model="profileData.document_type"  :label="'Tipo de documento'"/>
            <Input ref="inputDocument"  @on-focus="onDocumentInputFocus" :forceValue="profileData?.document" v-model="profileData.document" :label="'Documento'" />
            <Input ref="inputPhone" @on-focus="onPhoneInputFocus" :forceValue="profileData?.phone"  v-model="profileData.phone" :label="'Telefono'" />
            <Input ref="inputCountry" @on-focus="onCountryInputFocus" :forceValue="profileData?.country" v-model="profileData.country" :label="'Pais'" />
            <Input ref="inputAddress" @on-focus="onAddressInputFocus" :forceValue="profileData?.address" v-model="profileData.address" :label="'Dirección'" />
            <Input ref="inputLocality" @on-focus="onLocalityInputFocus" :forceValue="profileData?.locality" v-model="profileData.locality" :label="'Localidad'" />
            <Input ref="inputState" @on-focus="onStateInputFocus" :forceValue="profileData?.state" v-model="profileData.state" :label="'Provincia'" />
            <Input ref="inputPostalCode" @on-focus="onPostalCodeInputFocus" :forceValue="profileData?.postal_code" v-model="profileData.postal_code" :label="'Codigo postal'"/>
            <TextField  :text="profileData?.email" :label="'Email'"  />
            
            <DatePicker
              ref="inputBirthday"
              @on-focus="onBirthdayFocus"
              :forceValue="profileData?.date_birth"
              v-model="profileData.date_birth"
              :label="'Fecha de nacimiento'"
            />
          </div>
       
       
          <div
            v-if="selectedTab == 1"
            class="profile-data-work"
          >
           
            <TextField  :text="profileData?.role" :label="'Rol'"  />
            <Input ref="inputCuil" @on-focus="onCuilInputFocus" :forceValue="profileData.cuil" v-model="profileData.cuil" :label="'CUIL'" />
            <Input
              ref="inputSocialWork"
              @on-focus="onSocialWorkInputFocus" 
              :forceValue="profileData.social_work"
              v-model="profileData.social_work"
              :label="'Obra social'"
            />
            <Input
              ref="inputFoodRestriction"
              @on-focus="onFoodRestrictionInputFocus" 
              :forceValue="profileData.food_restriction"
               v-model="profileData.food_restriction"
              :label="'Restriccíon alimentaria'"
            />
            <Input ref="inputAffiliate" @on-focus="onPhoneInputFocus" :forceValue="profileData.affiliate"   v-model="profileData.affiliate" :label="'Afiliado/a'" />
          </div>
       
      </TabNav>
    </div>
    <div  class="profile-actions">
      <button v-if="!updateData" @click="onChangeData" class="cta-button "><p>Modificar datos</p></button>
      <button v-if="updateData" @click="onCancel" class="cta-button cta-cancel"><p>Cancelar</p></button>
      <button v-if="updateData" @click="onUpdate" class="cta-button cta-update"><p>Guardar cambios</p></button>
    </div>
  </div>
</template>


<style lang="scss" scoped>
@import "./user-profile.scss";
</style>