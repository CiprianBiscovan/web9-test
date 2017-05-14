// Config file 
// Define constant variables for global use in application

const URL_PHP = "https://web9-ciprianbiscovan.c9users.io/Blog/API/";
const UI_PAGE = "https://web9-ciprianbiscovan.c9users.io/Blog/UI/pages/"; 
const HOME_PAGE = "https://web9-ciprianbiscovan.c9users.io/Blog/index.html"; 
const DEFAULT_IMG = "/Blog/Resources/image_comming_soon.png";
const POPUP_TOUT = 5000;

//Local-name rules implemented : https://en.wikipedia.org/wiki/Email_address
const RGX_MAIL_LOCAL_NAME = "^[a-z]{1}(?!.*(\.\.|\.@))[a-z0-9!#$%&*+/=?_{|}~.-]{0,63}@$";   

//Domain name rules implemented : https://en.wikipedia.org/wiki/Hostname
const RGX_MAIL_DOMAIN = "@(?=.{0,253}$)([a-z0-9]\.|[a-z0-9][a-z0-9-]{0,63}[a-z0-9]\.)+[a-z0-9]{1,63}$";

