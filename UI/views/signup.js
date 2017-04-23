/*global $*/

$(document).ready(onHtmlLoaded);

    var firstnameText     = undefined;
    var nameText       = undefined;
    var emailText      = undefined;
    var passwordText   = undefined;
    var repasswordText = undefined;
    var nicknameText   = undefined;
    var ageText        = undefined;
    var selGender         = undefined;

function onHtmlLoaded(){
    
   var submit = $('#signup_btn');
   
   submit.on('click',signUp);
    
}//END onHtmlLoaded function

//Function for handling clicks on <Sign Up> button
function signUp(){
    
    if(validInputs()){
        console.log("Signing Up..");
        var user = new User();
        var newUser={
            firstname: firstnameText,
            name: nameText,
            email: emailText,
            password: passwordText,
            repassword: repasswordText,
            nickname: nicknameText,
            age: ageText,
            gender: selGender
            
        };
        
        user.signUp(newUser).done(function(response){
            console.log(response.message);
        });
    }
    
}//END signUp function

//function for validationg user inputs
function validInputs(){
    var validInputs = true;
   firstnameText = $("input[name='firstname']").val().trim();
   nameText = $("input[name='name']").val().trim();
   emailText = $("input[name='email']").val().trim();
   passwordText = $("input[name='password']").val();
   repasswordText = $("input[name='repassword']").val();
   nicknameText = $("input[name='nickname']").val().trim();
   ageText = $("input[name='age']").val().trim();
   selGender = $("input[type='radio']:checked").val();
   
   if(firstnameText.length === 0 ){
       $('#error-signup-firstname').html('*Firstname cannot be empty');
       validInputs = false;
   }else{
       $('#error-signup-firstname').html('*');
   }
   if(nameText.length === 0 ){
       $('#error-signup-name').html('*Name cannot be empty');
       validInputs = false;
   }else{
       $('#error-signup-name').html('*');
   }
   if(emailText.length === 0 ){
       $('#error-signup-email').html('*Email cannot be empty');
       validInputs = false;
   }else if(!isValidEmail(emailText)){
        $('#error-signup-email').html('*Email is not valid');
        validInputs = false;
   }else{
       $('#error-signup-email').html('*');
    }
    
   if(passwordText.length === 0 ){
       $('#error-signup-password').html('*Password cannot be empty');
       validInputs = false;
   }else if(passwordText.length < 3){
       $('#error-signup-password').html('*Password too short');
       validInputs = false;
    }else if(passwordText !== repasswordText){
       $('#error-signup-password').html('*Passwords don`t match');
       validInputs = false;
    }else{
       $('#error-signup-password').html('*');
   }
   if(!isValidAge(ageText) && ageText.length > 0){
       $('#error-signup-age').html('*Age is not valid');
       validInputs = false;
   }else if(ageText.length == 1 || ageText > 150){
       $('#error-signup-age').html('*Age must be between 10 and 150!');
       validInputs = false;
   }else{
        $('#error-signup-age').html('*');
   }

   return validInputs;
}//END validInputs

 //Validate user email
 function isValidEmail(email){
     
     const regEx =/^[a-z]{1}(?!.*(\.\.|\.@))[a-z0-9!#$%&*+/=?_{|}~.-]{0,63}@(?=.{0,253}$)([a-z0-9]\.|[a-z0-9][a-z0-9-]{0,63}[a-z0-9]\.)+[a-z0-9]{1,63}$/gmi;
     return email.match(regEx);
            
 }//END isValidEmail function
 //Validate user email
 function isValidAge(age){
     
     const regEx =/^[^0]\d{0,2}$/gmi;
     return age.match(regEx);
            
 }//END isValidEmail function