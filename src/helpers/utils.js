import defaultOptions from './defaultOptions';

const getColor = (index) => {

    const colors = [
        'rgba(128,0,0,0.2)',
        'rgba(255,0,0,0.2)',
        'rgba(128,0,128,0.2)',
        'rgba(255,0,255,0.2)',
        'rgba(0,128,0,0.2)',
        'rgba(0,255,0,0.2)',
        'rgba(128,128,0,0.2)',
        'rgba(255,255,0,0.2)',
        'rgba(0,0,128,0.2)',
        'rgba(0,0,255,0.2)',
        'rgba(0,128,128,0.2)',
        'rgba(0,255,255,0.2)',
        'rgba(127,255,212,0.2)',
        'rgba(165,42,42,0.2)',
        'rgba(222,184,135,0.2)',
        'rgba(95,158,160,0.2)',
        'rgba(127,255,0,0.2)',
        'rgba(210,105,30,0.2)',
        'rgba(255,127,80,0.2)',
        'rgba(100,149,237,0.2)',
        'rgba(220,20,60,0.2)',
        'rgba(0,255,255,0.2)',
        'rgba(0,0,139,0.2)',
        'rgba(0,139,139,0.2)',
        'rgba(184,134,11,0.2)',
        'rgba(169,169,169,0.2)',
        'rgba(0,100,0,0.2)',
        'rgba(189,183,107,0.2)',
        'rgba(139,0,139,0.2)',
        'rgba(85,107,47,0.2)',
        'rgba(255,140,0,0.2)',
        'rgba(139,0,0,0.2)',
        'rgba(233,150,122,0.2)',
        'rgba(143,188,143,0.2)',
        'rgba(72,61,139,0.2)',
        'rgba(47,79,79,0.2)',
        'rgba(255,20,147,0.2)',
        'rgba(255,215,0,0.2)',
        'rgba(218,165,32,0.2)',
        'rgba(75,0,130,0.2)',
        'rgba(32,178,170,0.2)',
    ];

    

    return colors.reverse()[index];
}

const getRandomColor =  (alpha) =>{

    const color = `#${Math.floor(Math.random() * 0xffffff).toString(16)}`;

    return `${color}${Math.floor(alpha * 255).toString(16).padStart(2, 0)}`;
}


const formatDate = (date, time = false) => {

    const formatDate = new Date(date);

    if (time) {
        const time = `${formatDate.getHours()}:${formatDate.getMinutes()}`
        return `${formatDate.getDate()}/${formatDate.getMonth() + 1}/${formatDate.getFullYear()} - ${time} hs`;
    } else {
        return `${formatDate.getDate()}/${formatDate.getMonth() + 1}/${formatDate.getFullYear()}`;
    }


}


const calculateDaysBetweenDates = (date) =>{
  const now = new Date();
  const futureDate = new Date(date);
  const days = futureDate.getTime() - now.getTime();
  return Math.ceil(days / (1000 * 3600 * 24));
}

const calculateFutureDate = ( days ) =>{

  const now = new Date(); 
  return now.setDate(now.getDate() + Number(days));
}

const substring = (text = '', limit = 30) => {

    if (text.length > limit) {

        return `${text.substring(0, limit)}...`;

    } else {

        return text;
    }
}



const sortArrayByString = (target, property) => {

    target.sort(function(a, b) {

       
        const nameA = a[property].toUpperCase(); // ignore upper and lowercase
        const nameB = b[property].toUpperCase(); // ignore upper and lowercase
          
      // sort in an ascending order
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
     });

     return target;
    
}





const format = (input = 0, opt = defaultOptions) => {
  if(input === null) input = 0
  const mergedOptions = Object.assign({}, defaultOptions, opt)
  if (typeof input === 'number' && !mergedOptions.isInteger) {
    input = input.toFixed(fixed(mergedOptions.precision))
  }
  const negative = isNegative(input, mergedOptions.acceptNegative)  ? '-' : ''
  const numbers = onlyNumbers(input)
  const currency = numbersToCurrency(numbers, mergedOptions.precision)
  const parts = toStr(currency).split('.')
  let integer = parts[0]
  const decimal = parts[1]
  integer = addThousandSeparator(integer, mergedOptions.thousand)
  return negative + mergedOptions.prefix + joinIntegerAndDecimal(integer, decimal, mergedOptions.decimal) + mergedOptions.suffix
}

const unformat = (input = 0, opt = { precision: 2, isInteger: false, acceptNegative: true}) => {
  if(input === null) input = 0
  const mergedOptions = Object.assign({}, defaultOptions, opt)
  let negative = (isNegative(input, mergedOptions.acceptNegative)) ? -1 : 1
  let numbers = onlyNumbers(input)
  let currency = numbersToCurrency(numbers, mergedOptions.precision)
  if(mergedOptions.isInteger) {
    return parseInt(`${isNegative(input, mergedOptions.acceptNegative) ? '-' : ''}${numbers.toString()}`)
  }
  return parseFloat(currency) * negative
}

const setCursor = (el, position) => {
  let setSelectionRange = function () { el.setSelectionRange(position, position) }
  if (el === document.activeElement) {
    setTimeout(setSelectionRange, 1)
  }
}


const setCursorPosition = (el, opt = defaultOptions) => {
  let positionFromEnd = el.value.length - el.selectionEnd
  el.value = format(el.value, opt)
  positionFromEnd = Math.max(positionFromEnd, opt.suffix.length)
  positionFromEnd = el.value.length - positionFromEnd
  positionFromEnd = Math.max(positionFromEnd, opt.prefix.length + 1)
  setCursor(el, positionFromEnd)
}


function onlyNumbers (input) {
  return toStr(input).replace(/\D+/g, '') || '0'
}

// 123 RangeError: toFixed() digits argument must be between 0 and 20 at Number.toFixed
function fixed (precision) {
  return Math.max(0, Math.min(precision, 20))
}

function numbersToCurrency (numbers, precision) {
  let exp = Math.pow(10, precision)
  let float = parseFloat(numbers) / exp
  return float.toFixed(fixed(precision))
}

function addThousandSeparator (integer, separator) {
  return integer.replace(/(\d)(?=(?:\d{3})+\b)/gm, `$1${separator}`)
}

function joinIntegerAndDecimal (integer, decimal, separator) {
  return decimal ? integer + separator + decimal : integer
}

function toStr (value) {
  return value ? value.toString() : ''
}

function isNegative(string, acceptNegative = true) {
  if(!acceptNegative) return false
  if (typeof string != 'string') string = string.toString()
  const forcePositive = string.indexOf('+') >= 0
  const isNegative = (string !== 0 && string.indexOf('-') >= 0 || string[string.length-1] == '-') ? true : false
  return (!forcePositive && isNegative) ? true : false
}


export {
    formatDate,
    calculateDaysBetweenDates,
    calculateFutureDate,
    substring,
    getColor,
    getRandomColor,
    sortArrayByString,
    setCursorPosition,
    setCursor,
    unformat,
    format
}