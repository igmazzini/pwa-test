import axios from 'axios'

let apiUrl = 'https://api.prepro.la/api';

if(document.URL.includes('localhost') || document.URL.includes('192.168')){
  apiUrl = 'http://127.0.0.1:8000/api';
}

const preproApi = axios.create({    
    baseURL: apiUrl,
    
})

preproApi.defaults.headers.common['Content-Type'] = `application/json`;

preproApi.interceptors.request.use(req => {   
  
    //console.log('Token Axios ',localStorage.getItem('token'));
   
    req.headers = {
      /* authorization:`Bearer ${localStorage.getItem('token')}`, */
      xtoken:`Bearer ${localStorage.getItem('token')}`
      
    }    
    
    return req;

  })






export default preproApi