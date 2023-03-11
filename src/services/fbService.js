import { db, auth, storage } from '@/api/firebaseApi';
import { ref, uploadBytes, getDownloadURL , deleteObject } from "firebase/storage";
import { collection,doc ,addDoc,query,where, getDocs,getDoc, updateDoc,  serverTimestamp } from "firebase/firestore";

/* #######################  PROJECTS SERVICE #################################### */

export const getProjects = async () => {

  //const userId = localStorage.getItem('userId');

  //if(!userId){
    //return;
  //}
 
  try {
    ///const q = query(collection(db, "projects"), where("userId", "==", userId));
    //const querySnapshot = await getDocs(q);
    const querySnapshot = await getDocs(collection(db, "projects"));
    
    let projects = [];
    querySnapshot.forEach((doc) => {
     
      let project = doc.data();
      project.id = doc.id;
      projects.push(project);
    })

    return projects;
    
  } catch (error) {
    console.error("Error getting projects: ", error);
  }
}

export const addProject = async ( params ) => {
 

  try {     
    
    const projectRef = await addDoc(collection(db, "projects"), {
      name: params.name,
      budget:params.budgetAmount,      
      userId: auth.currentUser.uid,     
      created: serverTimestamp(),    
      updated: serverTimestamp()
    });

    let newProject = await getDoc(projectRef);
    newProject = newProject.data();
    newProject.id = projectRef.id;
    

    return newProject;

  } catch (e) {
    console.error("Error adding project: ", e);
  }
}



/* #######################  END PROJECTS SERVICE #################################### */




/* #######################  ORDERS SERVICE #################################### */

export const uploadFile = async (file) => {

  // 1. Referencia al espacio en el bucket donde estará el archivo    
  const imageRef = ref(storage, `images/order-${file.name}`);

  // 2 Subir el archivo   
  await uploadBytes(imageRef, file).then((snapshot) => {
    console.log('Uploaded an array! ' + snapshot.fullPath);
   
  });

  imageRef.downloadUrl = await getDownloadURL(ref(storage, `images/order-${file.name}`));
  // 3. Retornar la referencia  
  return imageRef;
}

export const getFile = async () => {
 
  const url = await getDownloadURL(ref(storage, `images/order-${auth.currentUser.uid}`))
 
  return url;
}


export const uploadOrder = async ( orderParams ) => {

  try {  
    
   
    let fileRef;

    if(orderParams.file == 'no-file'){
      fileRef =  {downloadUrl:'no-url', name:'no-file'};
    }else{
      fileRef =  await uploadFile(orderParams.file);
    }   

    
    const orderRef = await addDoc(collection(db, "orders"), {
      provider: orderParams.provider,
      orderCode:orderParams.orderCode,
      rubro: orderParams.rubro,
      rubroCode: orderParams.rubroCode,
      item: orderParams.item,
      itemCode: orderParams.itemCode,
      motive: orderParams.motive,
      amount: orderParams.amount,
      state: orderParams.state,
      isPdf: orderParams.isPdf,      
      downloadUrl: fileRef.downloadUrl,
      fileName:fileRef.name,
      userId: auth.currentUser.uid,     
      projectId: orderParams.projectId,     
      created: serverTimestamp(),    
      updated: serverTimestamp()
    });

    let newOrder = await getDoc(orderRef);
    newOrder = newOrder.data();
    newOrder.id = orderRef.id;
    

    return newOrder;

  } catch (e) {
    console.error("Error adding order: ", e);
  }
}


export const updateOrder = async (order)  => {

 

  const orderRef =  doc(db,'orders',order.id);

  if(order.file){


    if(order.fileName != 'no-file'){
      const deleteRef = ref(storage, `images/${order.fileName}`);
      await deleteObject(deleteRef);
    }   

    const fileRef =  await uploadFile(order.file);
    order.downloadUrl = fileRef.downloadUrl;
    order.fileName = fileRef.name;
  }else if(order.fileDeleted){

    const deleteRef = ref(storage, `images/${order.fileName}`);
    await deleteObject(deleteRef);

    order.downloadUrl = 'no-url';
    order.fileName = 'no-file';

  }

  await updateDoc(orderRef, {
      provider: order.provider,
      rubro: order.rubro,      
      orderCode:order.orderCode,
      rubroCode: order.rubroCode,
      item: order.item,
      itemCode: order.itemCode,
      motive: order.motive,
      amount: order.amount,
      state: order.state,
      isPdf: order.isPdf,      
      downloadUrl: order.downloadUrl,
      fileName: order.fileName,
      userId: auth.currentUser.uid,
      created: order.created,     
      updated: serverTimestamp()
  })
 

  return orderRef;
}


export const getdOrders = async (projectId) => {

  try {

    const q = query(collection(db, "orders"), where("projectId", "==", projectId));
    const querySnapshot = await getDocs(q);
    
    let orders = [];
    querySnapshot.forEach((doc) => {
     
      let order = doc.data();
      order.id = doc.id;
      orders.push(order);
    })

    return orders;
    
  } catch (error) {
    console.error("Error getting orders: ", error);
  }
}

/* #######################  END ORDERS SERVICE #################################### */




/* ########################## CASH FLOW SERVICE ############################ */

/* CASH SURRENDERS */

export const getSurrenders = async (projectId) => {

  try {

    const q = query(collection(db, "surrenders"), where("projectId", "==", projectId));
    const querySnapshot = await getDocs(q);
    
    let surrenders = [];
    querySnapshot.forEach((doc) => {
     
      let surrender = doc.data();
      surrender.id = doc.id;
      surrenders.push(surrender);
    });

    console.log(surrenders)

    return surrenders;
    
  } catch (error) {
    console.error("Error getting surrenders: ", error);
  }
}

export const uploadSurrender = async ( surrenderParams ) => {

  try {  
    
    const surrenderRef = await addDoc(collection(db, "surrenders"), {
      name: surrenderParams.name,
      amount: surrenderParams.amount,
      surrenderType: surrenderParams.surrenderType,
      hasInvoice: surrenderParams.hasInvoice,
      invoiceType: surrenderParams.invoiceType,
      invoiceCode: surrenderParams.invoiceCode,
      invoiceCategory: surrenderParams.invoiceCategory,
      providerName: surrenderParams.providerName,
      providerCUIL:surrenderParams.providerCUIL,
      taxedAmount: surrenderParams.taxedAmount,
      noTaxedAmount: surrenderParams.noTaxedAmount,
      iva21: surrenderParams.iva21,
      iva10: surrenderParams.iva10,
      perceptionIVA: surrenderParams.perceptionIVA,
      perceptionIIBB: surrenderParams.perceptionIIBB,
      other: surrenderParams.other,
      total: surrenderParams.total,  
      userId: auth.currentUser.uid,     
      projectId: surrenderParams.projectId,     
      created: serverTimestamp(),    
      updated: serverTimestamp()
    });

    let newSurrender = await getDoc(surrenderRef);
    newSurrender = newSurrender.data();
    newSurrender.id = surrenderRef.id;
    

    return newSurrender;

  } catch (e) {
    console.error("Error adding surrender: ", e);
  }
}


export const updateSurrender = async (surrender)  => {

  try {
    
    console.log('updateSurrender');
    console.log(surrender.id);
    
    const surrenderRef =  doc(db,'surrenders',surrender.id);
 

    await updateDoc(surrenderRef, {
      name: surrender.name,
      amount: surrender.amount,
      surrenderType: surrender.surrenderType,
      hasInvoice: surrender.hasInvoice,
      invoiceType: surrender.invoiceType,
      invoiceCode: surrender.invoiceCode,
      invoiceCategory: surrender.invoiceCategory,
      providerName: surrender.providerName,
      providerCUIL:surrender.providerCUIL,
      taxedAmount: surrender.taxedAmount,
      noTaxedAmount: surrender.noTaxedAmount,
      iva21: surrender.iva21,
      iva10: surrender.iva10,
      perceptionIVA: surrender.perceptionIVA,
      perceptionIIBB: surrender.perceptionIIBB,
      other: surrender.other,
      total: surrender.total,  
      userId: auth.currentUser.uid,     
      projectId: surrender.projectId,     
      created: surrender.created,    
      updated: serverTimestamp()
    })
 

    return surrenderRef;
    
  } catch (error) {
    console.error("Error updating surrender: ", error);
  }

  
}

/* END CASH SURRENDERS */


/* CASH REQUEST */

export const getCashRequest = async (projectId) => {

  try {

    const q = query(collection(db, "requests"), where("projectId", "==", projectId));
    const querySnapshot = await getDocs(q);
    
    let requests = [];
    querySnapshot.forEach((doc) => {
     
      let request = doc.data();
      request.id = doc.id;
      requests.push(request);
    });

    console.log(requests)

    return requests;
    
  } catch (error) {
    console.error("Error getting cash requests: ", error);
  }
}

export const uploadCashRequest = async ( requestParams ) => {

  try {  
    
    const requestRef = await addDoc(collection(db, "requests"), {
     
      area: requestParams.area,     
      order: requestParams.order,     
      amount: requestParams.amount,     
      category: requestParams.category,     
      item: requestParams.item,     
      motive: requestParams.motive,      
      userId: auth.currentUser.uid,     
      projectId: requestParams.projectId,     
      created: serverTimestamp(),    
      updated: serverTimestamp()
    });

    let newRequest = await getDoc(requestRef);
    newRequest = newRequest.data();
    newRequest.id = requestRef.id;
    

    return newRequest;

  } catch (e) {
    console.error("Error adding request: ", e);
  }
}


export const updateCashRequest = async (request)  => {

  try {
    
  
    console.log(request.id);
    
    const requestRef =  doc(db,'requests',request.id);
 

    await updateDoc(requestRef, {
     
      area: request.area,     
      order: request.order,     
      amount: request.amount,     
      category: request.category,     
      item: request.item,     
      motive: request.motive,      
      userId: auth.currentUser.uid,     
      projectId: request.projectId,     
      created: request.created,    
      updated: serverTimestamp()
    })
 

    return requestRef;
    
  } catch (error) {
    console.error("Error updating request: ", error);
  }

  
}

/* EDN CASH REQUEST */


/* ########################## END CASH FLOW SERVICE ############################ */
