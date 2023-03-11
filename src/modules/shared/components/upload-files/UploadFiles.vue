<script src="./UploadFiles.js"></script>


<template>

    <div class="upload-files-container">
        <SelectMobile ref="selectMobile" v-if="showSelectMobile" :searchBar="false" :title="'Seleccione un tipo de archivo'"  :options="selectMobileOptions" @on-cancel="onSelectMobileCancel" @on-accept="onSelectMobileAccept" />
        <Select  ref="typeSelect" class="upload-files-select"  :selected="selectedOption" @open-select="onOpenSelectMobile" :label="'Tipo'" :options="types" @option-selected="onTypeSelected"/>        
        <UploadButton :disabled="disabledButton" @on-file-selected="onSelectedFile"/>
        <ul v-if="files.length > 0" class="files-container">
            <li v-for="(file, index) in files" :key="index" @click="onFileClick(index)" ><font-awesome-icon icon="fa-regular fa-file" /><p>{{substring(file.type,(mobile) ? 11 : 40)}}</p><p>{{substring(file.name,(mobile) ? 11 : 40)}}</p> <font-awesome-icon @click.stop="onDeleteFile(index)" icon="fa-solid fa-trash" /></li>
        </ul>
        <p class="empty-files" v-if="showError">No hay archivos seleccionados</p>
    </div>  
</template>



<style lang="scss" scoped>

.upload-files-container{
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

.upload-files-select{
    width: 100%;
    z-index: 20;
    margin-bottom: 15px;
}
.files-container{
    background-color: var(--background-grey);
    width: 100%;
    max-height: 150px;
    overflow-x: hidden;
    overflow-y: auto;
    margin-top: 15px;
    font-family: RobotoLight;
    color: var(--light-text-color);
    padding: 5px;

    li{        
        list-style: none;
        display: grid;
        grid-template-columns: 7% 35% 1fr 10%;
        align-items: center;
        justify-items: start;
        padding: 4px;
        padding-right: 15px;
        border-bottom: 1px solid #ccc;
        cursor: pointer;

        p{
            margin: 0;
            padding: 0;
        }

        .fa-file{            
            color: var(--background-color);
            margin: 0;
            padding: 0;
            
        }
        .fa-trash{
            margin-left: auto;
            color: var(--error-color);
        }
    }
}

.empty-files{
    font-family: RobotoLight;
    color: var(--error-color);
    margin-top: 50px;
}

.dark .files-container{
    background-color: var(--dark-background-color);
    color: var(--dark-text-color);
}
</style>