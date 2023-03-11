

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */

import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { faDiagramProject } from '@fortawesome/free-solid-svg-icons'
import { faListUl } from '@fortawesome/free-solid-svg-icons'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { faBan } from '@fortawesome/free-solid-svg-icons'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { faListCheck } from '@fortawesome/free-solid-svg-icons'
import { faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { faExpand} from '@fortawesome/free-solid-svg-icons'
import { faCompress } from '@fortawesome/free-solid-svg-icons'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faImage } from '@fortawesome/free-regular-svg-icons'
import { faFilePdf } from '@fortawesome/free-regular-svg-icons'
import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons'
import { faFile } from '@fortawesome/free-regular-svg-icons'
import { faCopy } from '@fortawesome/free-regular-svg-icons'




/* add icons to the library */
library.add(faHouse)
library.add(faDiagramProject)
library.add(faListUl)
library.add(faChartLine)
library.add(faGear)
library.add(faCircleQuestion)
library.add(faArrowRightFromBracket)
library.add(faGoogle)
library.add(faBars)
library.add(faEllipsisVertical)
library.add(faMagnifyingGlass)
library.add(faBell)
library.add(faEnvelope)
library.add(faBookmark)
library.add(faArrowDown)
library.add(faPlus)
library.add(faCircleXmark)
library.add(faCaretDown)
library.add(faArrowUpFromBracket)
library.add(faPencil)
library.add(faTrash)
library.add(faImage)
library.add(faClockRotateLeft)
library.add(faXmark)
library.add(faBan)
library.add(faFilePdf)
library.add(faCalendar)
library.add(faChevronLeft)
library.add(faHandHoldingDollar)
library.add(faFolderOpen)
library.add(faFile)
library.add(faCopy)
library.add(faCircleExclamation)
library.add(faListCheck)
library.add(faExpand)
library.add(faCompress)
library.add(faCircleInfo)
library.add(faUser)

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/css/normalize.css'
import './assets/css/animate.min.css'
import './assets/css/app.scss'
import './assets/fontawesome/css/all.min.css'
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';


const pinia = createPinia();
const app = createApp(App)


app.use(pinia);
app.use(router);


VueQueryPlugin.install(app,{
    queryClientConfig:{
        defaultOptions:{
            cacheTime:1000 * 60,// un minuto
        }
    }
});

app.component('font-awesome-icon', FontAwesomeIcon);



app.mount('#app')
