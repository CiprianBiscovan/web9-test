/*global $*/
/* global User */
/* global setError resetError popUp*/

//always check if HTML is loaded before doing anything
//HTML operations on view
$(document).ready(onHtmlLoaded);
    
    //Global variables for user inputs
    var firstnameText     = undefined;
    var nameText          = undefined;
    var emailText         = undefined;
    var passwordText      = undefined;
    var repasswordText    = undefined;
    var nicknameText      = undefined;
    var ageText           = undefined;
    var selGender         = undefined;

//Function executed after document is fully loaded
function onHtmlLoaded(){
    
   var submit = $('#signup_btn');                                               //get submit button
   
   submit.on('click',signUp);                                                   //attach click event to submit button
    
}//END onHtmlLoaded function

//Function for handling clicks on <Sign Up> button
function signUp(){
    //check if user inputs are valid
    if(validInputs()){
     
        resetError($("#inputs-in-error"));                                     //reset any previous error on inputs
     
        var user = new User();                                                  //new User object
        
        var newUser={                                                           //user object containing user data
            firstname: firstnameText,
            name: nameText,
            email: emailText,
            password: passwordText,
            repassword: repasswordText,
            nickname: nicknameText,
            age: ageText,
            gender: selGender
            
        };
        
        //request to create accont
        user.signUp(newUser).done(function(response){
         
            if(response.success === true){
                popUp("success",response.message);
                window.location.reload();
                
            }else{
                popUp("error",response.message,response.responseText);
            }
        }); //create account request completed
        
    }else{
        setError($("#inputs-in-error"),"You have errors on inputs above!");
    }
    
}//END signUp function

//Validate user inputs
function validInputs(){
   
   var validInputs = true;                                                      //assume there are no errors - set flag to true
                                                                                // any error found set flag to false
   //Get user inputs
   firstnameText   = $("input[name='firstname']").val().trim();
   nameText        = $("input[name='name']").val().trim();
   emailText       = $("input[name='email']").val().trim();
   passwordText    = $("input[name='password']").val();
   repasswordText  = $("input[name='repassword']").val();
   nicknameText    = $("input[name='nickname']").val();
   ageText         = $("input[name='age']").val().trim();
   selGender       = $("input[type='radio']:checked").val();
   
   //validate each input
   if(firstnameText.length === 0 ){
       setError($('#error-signup-firstname'),"*Firstname cannot be empty!");
       validInputs = false;
   }else{
       resetError($('#error-signup-firstname'));
   }
   
   if(nameText.length === 0 ){
       setError( $('#error-signup-name'),"*Name cannot be empty!");
       validInputs = false;
   }else{
       resetError($('#error-signup-name'));
   }
   
   if(emailText.length === 0 ){
       setError( $('#error-signup-email'),"*Email cannot be empty!");
       validInputs = false;
   }else if(!isValidEmail(emailText)){
        setError( $('#error-signup-email'),"*Email is not valid!");
        validInputs = false;
   }else{
       resetError($('#error-signup-email'));
   }
    
   if(passwordText.length === 0 ){
       setError($('#error-signup-password'),"*Password cannot be empty!");
       validInputs = false;
   }else if(passwordText.length < 3){
       setError($('#error-signup-password'),"*Password too short!(Min.3 characters)");
       validInputs = false;
   }else if(passwordText !== repasswordText){
       setError($('#error-signup-password'),"*Passwords don`t match!");
       validInputs = false;
   }else{
       resetError($('#error-signup-password'));
   }
   
   if(nicknameText.length > 0 && nicknameText.length !== nicknameText.trim().length){
       setError($('#error-signup-nickname'),"*Leading/tailing spaces are not allowed!");
       validInputs = false;
   }else{
       resetError($('#error-signup-nickname'));
   }
   
   if(!isValidAge(ageText) && ageText.length > 0){
       setError($('#error-signup-age'),"*Age is not valid!");
       validInputs = false;
   }else if(ageText.length == 1 || ageText > 150){
       setError($('#error-signup-age'),"*Age must be between 10 and 150!");
       validInputs = false;
   }else{
        resetError($('#error-signup-age'));
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