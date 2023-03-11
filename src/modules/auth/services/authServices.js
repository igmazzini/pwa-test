
import { auth } from '@/api/firebaseApi';
import { GoogleAuthProvider, signInWithPopup,signOut  } from "firebase/auth";
import authApi from '@/api/authApi';



export const googleSignUp = async () =>{
    try {

        const provider = new GoogleAuthProvider();

        const { user } = await signInWithPopup(auth,provider);   


        const idToken = await user.getIdToken()

        const { displayName, email, photoUrl} = user;

    
        const luser = {
            name: displayName,
            email,
            photoUrl
        }

        return {ok:true,data:{ user:luser, idToken }};    
          
        
    } catch (error) {

        return {ok:false,error: error?.response?.data?.error?.message }
    }  
}

export const googleLogOut = async () =>{

    try {

        await signOut(auth);    

        return {ok:true};
        
    } catch (error) {

        return {ok:false,error};
    }
   
}


export const checkAutentication = async () =>{
    
    try {

        const idToken  = localStorage.getItem('token')
    

        if( !idToken ) {
           
            return { ok: false, message: 'No hay token' }
        }
        
        const { data } = await authApi.post(':lookup', { idToken })
        //console.log(data)
        const { displayName, email, photoUrl} = data.users[0]

       
        const user = {
            name: displayName,
            email,
            photoUrl
        }     


        console.log('checkAutentication ok ')

        return { ok: true, data:{ user, idToken } }

    } catch (error) {
      
        console.log('checkAutentication false ')
        return { ok: false, error: error?.response?.data?.error?.message };
    }
}