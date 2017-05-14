/*global $*/
/*global Contact*/
/*global UI_PAGE HOME_PAGE*/
/*global popUp setError resetError*/

//always check if HTML is loaded before doing anything
//HTML operations on view
$(document).ready(onHtmlLoaded);
    
    //Global variables
    var loggedUser = new User();                                                //get logged in user
    var nameText = undefined;
    var emailText = undefined;
    var phoneText = undefined;
    var subjectText = undefined;
    var messageText = undefined;

//Function executed after document is fully loaded
function onHtmlLoaded(){
   
    //Get submit button reference
    var submitBtn = $('#submit');                                               
    
    //Add top buttons and links based on user logged in 
    addTopMenu();
    
    //Subscribe to click events
    submitBtn.on('click',contactUs);  
    
    //if  user is logged in fill his data in appropriate input
    if(loggedUser.isLogged === true){
        fillUserData()
    }
    
}//END onHtmlLoaded

//Create top menu function
function addTopMenu(){
    
    //get existing containers for elements
    var topMenu = $("#top-menu");                              
    var btnsContainer = $("#buttons-wrapper");
    
    //add buttons
    btnsContainer.append("<button id='home' class='yellow'><span><i class='fa fa-home'></i></span>Home</button>");
    btnsContainer.append("<button id='go-to-articles' class='blue'><span><i class='fa fa-list-ul'></i></span>Articles</button>");
    
    //Subscribe buttons to click events
    topMenu.children().find('button').click(topMenuClick);
    
}//END addTopMenu function

//fill known info about logged in user
function fillUserData(){
    $('input[name="name"]').val(loggedUser.loggedUserName);
    $('input[name="email"]').val(loggedUser.loggedUserEmail);
}

//Function to add Google Maps
function addMap() {
    
    //Get map container
    var googleMap = document.getElementById("googleMap"); //JQUERY element doesn`t work
    
    //Define map coordinates and display properties
    var location = new google.maps.LatLng(46.748986, 23.600402)
    var mapProp= {
        center:location,
        zoom:13,
    };
    
    //Create map
    var map=new google.maps.Map(googleMap,mapProp);
    
    //Create map marker
    var marker = new google.maps.Marker({
         position: location,
         map: map,
         title: 'Here I am :-) !'
        });       
    
}//END addGoogleMap

//Contact us function
function contactUs(){
    
    //get user inputs
    nameText = $('input[name="name"]').val().trim();
    emailText = $('input[name="email"]').val().trim();
    phoneText = $('input[name="phone"]').val().trim();
    subjectText = $('input[name="subject"]').val().trim();
    messageText = $('textarea[name="message"]').val().trim();
    
    //If inputs are valid create message  send message request
    if(validInputs()){
        resetError($('#inputs-in-error'));
        var message = {
            name:nameText,
            email:emailText,
            phone:phoneText,
            subject:subjectText,
            content:messageText
        };
        
        //Create new contact
        var contact = new Contact();
        
        //send message
        contact.sendMessage(message).done(function(response){
            if(response.success === true){
                popUp("success","Your message was sent! We will get back to you as soon as possible. Meanwhile you can enjoy some beautifull articles on this blog.Thanks!");
            }else{
                popUp("error","Error sending your message. Please try again later. Meanwhile you can enjoy some beautifull articles on this blog.Thanks!",response.message);
            }
            
        }); //End sendMessage function
    }else{
        setError($('#inputs-in-error'),"*You have errors on your inputs!");
    }
    
}//END contacUs

//Validate user inputs
function validInputs(){
    
    //Assume inputs are valid - set flag true
    //Reset flag for each invalid input
    var validInputs = true;
    
    if(nameText.length === 0){
        setError($('#error-name'),"*Please type your name");
        validInputs = false;
    }else if(nameText.length > 70){
        setError($('#error-name'),"*Name too long!");
        validInputs = false;
    }else{
        resetError($('#error-name'));
    }
    
    if(emailText.length === 0){
        setError($('#error-email'),"*Please type your E-mail");
        validInputs = false;
    }else if(!isValidEmail(emailText)){
       setError($('#error-email'),"*E-mail address not valid!");
       validInputs = false;
    }else if(emailText.length > 70){
          setError($('#error-email'),"*E-mail address too long!");
          validInputs = false;
    }else{
         resetError($('#error-email'));
    }
    
    if(phoneText.length > 0){
        if(!isValidPhone(phoneText)){
            setError($('#error-phone'),"*Phone number is not valid!");
            validInputs = false;
        }
        else{
            resetError($('#error-phone'));
        }
    }else{
            resetError($('#error-phone'));
    }
    
    if(subjectText.length === 0){
        setError($('#error-subject'),"*Please type a Subject");
        validInputs = false;
    }else if(subjectText.length > 70){
        setError($('#error-subject'),"*Subject too long");
        validInputs = false;
    }else{
        resetError($('#error-subject'));
    }
    
    if(messageText.length === 0){
       setError($('#error-message'),"*Please type a Message");
        validInputs = false;
    }else{
        resetError($('#error-message'));
    }
    
    return validInputs;
}

//Handle top menu buttons clicks
function topMenuClick(){
  
  //get clickd element
   var clicked = $(this);
   
   //determine clicked button
   switch (clicked.attr('id')){
        case 'home':
            window.location.href = HOME_PAGE;
        break;
        case 'go-to-articles':
            window.location.href = UI_PAGE + "articles.html";
        break;
   }
}//END topMenuCLick() function

//Validate user email
function isValidEmail(email){
    
    const regEx =/^[a-z]{1}(?!.*(\.\.|\.@))[a-z0-9!#$%&*+/=?_{|}~.-]{0,63}@(?=.{0,253}$)([a-z0-9]\.|[a-z0-9][a-z0-9-]{0,63}[a-z0-9]\.)+[a-z0-9]{1,63}$/gmi;
    return email.match(regEx);
            
}//END isValidEmail function
        
//Validate User phone number
function isValidPhone(phone){
    var phonePattern = /^[0-9+]{0,3}\d{10}$/g;
    return phone.match(phonePattern);
}//END isValidPhone