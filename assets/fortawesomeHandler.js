/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faChevronLeft, faMobileScreenButton, faGear, faArrowLeftLong, faArrowRightLong, faUserPen, faCircleXmark, faClock, faBook, faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons'

/* add icons to the library */
library.add(faChevronLeft, faMobileScreenButton, faGear, faArrowLeftLong, faArrowRightLong, faUserPen, faCircleXmark, faClock, faBook, faCircleQuestion, faCircleLeft)

export default FontAwesomeIcon;