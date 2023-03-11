<script src="./UploadFilesList.js"></script>
<template>
    <Transition  >
      <Teleport to="body" :disabled="!mobile">
      <ConfirmationModal @on-accept="onConfirmDelete" :text="'¿Eliminar archivo?'" :info="deleteFileName" :title="'Eliminar archivo'" :type="'delete'"  @on-cancel="onCancelDelete"  v-if="showConfirmModal"/>
      </Teleport>
    </Transition> 
   <ul v-if="files.length > 0" class="files-container">
       <input 
    
        ref="uploadInput"
        v-on:change="handleFileUpload"
        type="file"
        accept="image/*,.pdf"    
        class="upload-input"     
        >
        <li v-for="(file, index) in files" :key="index" @click="onFileClick(index)" ><font-awesome-icon icon="fa-regular fa-file" /><p>{{substring(file.type,(mobile) ? 11 : 15)}}</p><p v-if="file.file_name == ''">Sin archivo</p><p v-if="file.file_name != ''">{{substring(file.file_name,(mobile) ? 11 : 20)}}</p> <span v-if="(file.file != null || file.storage_url != '')" :class="!file.canDelete ? 'not-delete' : ''" @click.stop="onDeleteFile(index)"><font-awesome-icon  icon="fa-solid fa-trash" /></span><span v-if="(file.file == null && file.storage_url == '')"  @click.stop="onUploadFileClick(index)"><font-awesome-icon   icon="fa-regular fa-folder-open" /></span></li>
   </ul>
</template>
<style lang="scss" scoped>
    @import "./upload-files-list.scss";
</style>