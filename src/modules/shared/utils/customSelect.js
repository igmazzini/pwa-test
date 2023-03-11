

export function initializeSelect(input, inputList) {

   
    const inpt = document.querySelector(input);
    const inptList = document.querySelector(inputList);   
    inpt.addEventListener('focus', () => {
        inptList.style.height = 'auto';
        inptList.style.opacity = '1';
       
        if(inptList.getBoundingClientRect().height < 15){
            inptList.style.opacity = '0';
        }else{
            inptList.style.opacity = '1';
        }
      
    });
    inpt.addEventListener('blur', () => {
        
        setTimeout(() => {
            inptList.style.opacity = '0';
            inptList.style.height = '0';

        }, 150);

    });

}


const onClickItemList = () => {
       
    event.target.inpt.value = event.target.innerText;
    event.target.inpt.setAttribute('code', event.target.title);
   
    if (event.target.onInputSet) {
        event.target.onInputSet(event.target.inpt);
    }     
   
}

const onInput = () => {

    
   
    event.target.optionsList.forEach(element => {
       

        if ( String(element.innerText).toLowerCase().search(event.target.value.toLowerCase()) > -1) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
          
        }

    });

    

    if(event.target.inptList.getBoundingClientRect().height < 15){
        event.target.inptList.style.opacity = '0';
        event.target.inptList.style.pointerEvents = "none";
    }else{
        event.target.inptList.style.opacity = '1';
        event.target.inptList.style.pointerEvents = "auto";
    }
}


export function removeOptionsListener(input,inputList) {

  
    const inpt = document.querySelector(input);
    inpt.removeEventListener('input',onInput);
    const optionsList = document.querySelectorAll(inputList + ' span');
    optionsList.forEach(element => {
        
        element.removeEventListener('click', onClickItemList);
    });


}
export function addOptionsListener(input, inputList, onInputSet) {


   

    const inpt = document.querySelector(input);   
    const inptList = document.querySelector(inputList);   
    const optionsList = document.querySelectorAll(inputList + ' span');

   

    optionsList.forEach(element => {
        
        element.inpt = inpt;
        element.inptList = inptList;
        element.onInputSet = onInputSet;
        element.addEventListener('click', onClickItemList);
       
       
       
    });

    inpt.optionsList = optionsList;
    inpt.inptList = inptList;

    inpt.addEventListener('input',onInput);

}



