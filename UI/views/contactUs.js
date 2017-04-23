/*global $*/

$(document).ready(onHtmlLoaded);

    var nameText = undefined;
    var emailText = undefined;
    var phoneText = undefined;
    var subjectText = undefined;
    var messageText = undefined;

function onHtmlLoaded(){
    
    var submitBtn = $('#submit');
    submitBtn.on('click',contactUs);
    
}//END onHtmlLoaded
    
function contactUs(){
    nameText = $('input[name="name"]').val().trim();
    emailText = $('input[name="email"]').val().trim();
    phoneText = $('input[name="phone"]').val().trim();
    subjectText = $('input[name="subject"]').val().trim();
    messageText = $('textarea[name="message"]').val().trim();
    
    if(validInputs()){
        console.log("sending message");
        var message = {
            name:nameText,
            email:emailText,
            phone:phoneText,
            subject:subjectText,
            content:messageText
        };
        
        var contact = new Contact();
        contact.sendMessage(message).done(function(response){
         
            if(response.success === true){
                console.log("Your message was sent! We will get back to you as soon as possible. Meanwhile you can enjoy some beautifull articles on this blog.Thanks!")
            }else{
                console.log("Error sending your message. Please try again later. Meanwhile you can enjoy some beautifull articles on this blog.Thanks!");
            }
            
        });
    }
}//END contacUs

function validInputs(){
    var validInputs = true;
    
    if(nameText.length === 0){
        $('#error-name').html("*Please type your name");
        validInputs = false;
    }else if(nameText.length > 70){
        $('#error-name').html("*Name too long!");
        validInputs = false;
    }else{
        $('#error-name').html("*");
    }
    if(emailText.length === 0){
        $('#error-email').html("*Please type your E-mail");
        validInputs = false;
    }else if(!isValidEmail(emailText)){
       $('#error-email').html("*E-mail address not valid!");
       validInputs = false;
    }else if(emailText.length > 70){
          $('#error-email').html("*E-mail address too long!");
          validInputs = false;
    }else{
         $('#error-email').html("*");
    }
    if(phoneText.length > 0){
        if(!isValidPhone(phoneText)){
            $('#error-phone').html("*Phone number is not valid!");
            validInputs = false;
        }
        else{
            $('#error-phone').html("*");
        }
    }else{
            $('#error-phone').html("*");
    }
    if(subjectText.length === 0){
        $('#error-subject').html("*Please type a Subject");
        validInputs = false;
    }else if(subjectText.length > 70){
        $('#error-subject').html("*Subject too long");
        validInputs = false;
    }else{
        $('#error-subject').html("*");
    }
    if(messageText.length === 0){
        $('#error-message').html("*Please type a Message");
        validInputs = false;
    }else{
        $('#error-message').html("*");
    }
    
    return validInputs;
}
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