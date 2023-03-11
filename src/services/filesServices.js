import {  storage } from '@/api/firebaseApi'
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";


/* FILES */

export const uploadFile = async (file,projectId,folderName, fileName) => {

   
    // 1. Referencia al espacio en el bucket donde estará el archivo    
    const imageRef = ref(storage, `files/${projectId}/${folderName}/${fileName}`);   
  
    // 2 Subir el archivo   
    await uploadBytes(imageRef, file);
  
    //imageRef.downloadUrl = await getDownloadURL(ref(storage, `files/${projectId}/${folderName}/${fileName}`));
    imageRef.downloadUrl = await getDownloadURL(imageRef);
    // 3. Retornar la referencia  
    return imageRef;
}

export const uploadFiles = async (files,projectId, folderName) =>{

  const uploads = []

  for (let i = 0; i < files.length; i++) {

   if(files[i].file){

      const file = files[i].file;

      const extension = file.type.split('/')[1];

      const fileRef = await uploadFile(file,projectId,folderName,`${files[i].file_id}.${extension}`);    

      const ref = {
        file_id:files[i].file_id,
        downloadUrl:fileRef.downloadUrl
      }

      uploads.push(ref);

   }
  
  } 
 

 return uploads;
}

export const deleteFile = async (fileName) => {

  try {

    const deleteRef = ref(storage, `files/${fileName}`);

    await deleteObject(deleteRef);
    
  } catch (error) {

    console.error('deleteFile error',error);
  }
}

export const getFile = async (fileName) => {
 
    const url = await getDownloadURL(ref(storage, `files/${fileName}`))
   
    return url;
}  