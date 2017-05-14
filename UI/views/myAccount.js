/*global $*/
/*global User logout*/
/*global UI_PAGE HOME_PAGE*/
/*global popUp setError resetError*/

//always check if HTML is loaded before doing anything
//HTML operations on view
$(document).ready(onHtmlLoaded);

//global variables
var loggedUser        = new User();                                             //get loggedIn user
var user              = new User();                                             //New User object

//initialize user inputs
var firstnameText     = undefined;
var nameText          = undefined;
var emailText         = undefined;
var passwordText      = undefined;
var newpassText       = undefined;
var repassText        = undefined;
var nicknameText      = undefined;
var ageText           = undefined;
var selGender         = undefined;

//if no user is logged in redirect to login page  
if(loggedUser.isLogged === false){
    window.location.href = UI_PAGE + "login.html";
}

//Function executed after document is fully loaded 
function onHtmlLoaded(){
    
    //if nobody is logged stop script execution
    if(loggedUser.isLogged === false){
        return;
    }
    
    //atatch click event to cancel button on any window
    $(".cancel-button").on('click',closeWindow);
    
    //add top menu
    addTopMenu();
    
    //add command buttons
    addCommandButtons();
    
    //get user data from the server
    user.getUserData(user.loggedUserId).done(function(response){
        
        //check server response
        if(response.success === true){
            
            user = new User(response[0]);
            fillUserData();                                                     //display user data
            
        }else{
            popUp("error",response.message);                                    //show error message
        }
    }); //get user data completed
    
}//END onHtmlLoaded function

//-------------------------------------------------------------------DOM Manipulation-----------------------------------------------------------------------------

//Create top menu 
function addTopMenu(){
    
    //get existing containers
    var topMenu       = $("#top-menu");
    var btnsContainer = $("#buttons-wrapper");
    
    //add buttons 
    btnsContainer.append("<button id='home' class='yellow'><span><i class='fa fa-home'></i></span>Home</button>");
    btnsContainer.append("<button id='go-to-articles' class='blue'><span><i class='fa fa-list-ul'></i></span>Articles</button>");
    btnsContainer.append("<button id='logout' class='red'><span><i class='fa fa-power-off'></i></span>Logout</button>");
   
    //Attach click events on top menu buttons   
    topMenu.children().find('button').click(topMenuClick);
    
}//END addTopMenu function

//Add command buttons on profile section
function addCommandButtons(){
    
    //get command buttons container
    var profileSect     = $('#buttons-container');
    
    //create command buttons elements
    var editButton      = $('<input type="submit" id="edit-button" class="purple" value="Edit" />');
    var changePassword  = $('<input type="submit" id="change-password-button" class="orange" value="Change Password"/>');
    var deleteButton    = $(' <input type="submit" id="delete-myself-button" identify="delete-myself-button" class= "red" value="Delete Account" />');
    var manageAccButton = $('<input type="submit" id="manage-accounts" class = "yellow" value="Manage Accounts" />');
   
    //Attach click events on buttons
    editButton.on('click',editUserData);
    changePassword.on('click',changeUserPassword);
    deleteButton.on('click',deleteAccount);
    manageAccButton.on('click',manageAccounts);
    
    //Place buttons created before into container
    profileSect.append(editButton)
               .append(changePassword);
    
    // Place buttons depending on user role 
    //If admin - add manage accounts button
    //if user - add delete account button
    if(loggedUser.isAdmin === true){
        profileSect.append(manageAccButton);
    }else{
        profileSect.append(deleteButton);
    }
}//END addCommandButtons function

//Create section for existing user accounts
function createManageAccountsSection(){
    
    var existinAccSection = $('#existing-accounts');                            //get container
    existinAccSection.empty();                                                  //clear container of old content
    
    //create existing accounts section
    existinAccSection.append("<h2>Existing Accounts:</h2>" +
                             "<input type='submit' id='refresh-button' class='green' value='Refresh'/>" +
                             "<input type='submit' id='cancel-mngacc-button' class='cancel-button red' value='Close'/>" +
                             "<table id='acounts-list'>"+
                             "</table>"
                            );
    
    //Attach click events to buttons                        
    $("#refresh-button").on('click',getUsers);
    $(".cancel-button").on('click',closeWindow);

    
}//END  createManageAccountsSection function

//Create table with existing accounts
function createAccountsTable(usersList){
    
    var th    = $("<tr>'id='header-row'</tr>");                                 //create table header element
    var table = $('#acounts-list');                                             //get table element
    
    th.append("<th>Firstname</th>")                                             //Fill tabel header data
      .append("<th>Lastname</th>")
      .append("<th>Nickname</th>")
      .append("<th>Gender</th>")
      .append("<th>Age</th>")
      .append("<th>Creation Date</th>")
      .append("<th>Last Modified</th>")
      .append("<th>Last Login</th>")
      .append("<th>Email</th>")
      .append("<th>Role</th>")
      .append("<th colspan='2'></th>");
      
    table.empty();                                                              //clear table old content
    table.append(th);                                                           //add new header
    table.attr('border','1');                                                   //set table border
    
    // Iterate accounts list and add each account to table 
    for(var i=0; i<usersList.length;i++){
        
        table.append(newRow(usersList[i]));
    }
    
}//END createAccountsTable fucntion

//Create new row for each account
function newRow(user){
    
    var gender          = (user.gender == 'M') ? "Male" : (user.gender == 'F') ? 'Female' : '-'; 
    var chgRoleBtnText  = (user.role.toLowerCase() === 'admin') ? 'Demote' : (user.role.toLowerCase() === 'user') ? 'Promote' : '-';
    var chgRoleBtn      = $('<input type="submit" class="blue row-button" value="' + chgRoleBtnText + '"/>');
    var deleteBtn       = $('<input type="submit" identify="delete-others-button"  class="red row-button" value="Delete"/>');
    var promoteCell     = $("<td class='button-container'></td>");
    var deleteCell      = $("<td class='button-container'></td>");
    
    chgRoleBtn.on('click',changeRole);                                          //Attach click event to changRole button
    deleteBtn.on('click',deleteAccount);                                        //Attach click event to delete Account button
    
    var row = $("<tr userID='" + user.id + "'></tr>");                          //Create table row element
    
    //Fill user data 
    row.append("<td userdata='firstname'>" + user.firstname || '-' + "</td>")
       .append("<td userdata='lastname'>" + user.lastname || '-' + "</td>")
       .append("<td userdata='nickname'>" + user.nickname || '-' + "</td>")
       .append("<td userdata='gender'>" + gender + "</td>")
       .append("<td userdata='age'>" + user.age || '-' + "</td>")
       .append("<td userdata='creation-date'>" + user.dateCreate || '-' + "</td>")
       .append("<td userdata='last-modified'>" + user.dateModif || '-' + "</td>")
       .append("<td userdata='last-login'>" + user.lastLogin || '-' + "</td>")
       .append("<td userdata='email'>" + user.email || '-' + "</td>")
       .append("<td userdata='role'>" + user.role || '-' + "</td>")
       .append(promoteCell)
       .append(deleteCell);
    
    //Add promote and delete buttons for other users
    //Add message for own account
    if(user.id !== user.loggedUserId){
        promoteCell.append(chgRoleBtn);
        deleteCell.append(deleteBtn);
    }else{
        promoteCell.append("<h3> &#8592;This is you!</h3>");
    }
           
    return row;
    
}//END newRow function

//-------------------------------------------------------------------/DOM Manipulation-----------------------------------------------------------------------------
//----------------------------------------------------------------------Events handlers----------------------------------------------------------------------------

//Fill user data in profile section
function fillUserData(){
    
    var roleIcon = '';
    var lastLogin;
    var creationDate;
    var modifiedDate;
    
    //Options for date formatting
    var options = { /*weekday: 'long',*/ year: 'numeric', month: 'long', day: 'numeric',hour:'numeric',minute:'numeric' };
     
	//Determin role icon to use based on logged user role
	if (user.loggedUserRole === 'ADMIN'){
		roleIcon = "&#9812;";
	}else{
		roleIcon = "&#9817;";
	}
   
   //format dates
   if( isNaN(Date.parse(user.lastLogin ))){
        lastLogin = "Unknown";
   }else{
        lastLogin = new Date(user.lastLogin).toLocaleString('en-GB', options); //format date
   }
    if( isNaN(Date.parse(user.dateCreate))){
        creationDate = "Unknown";
   }else{
        creationDate = new Date(user.dateCreate).toLocaleString('en-GB', options); //format date
   }
   if( isNaN(Date.parse(user.dateModif))){
        modifiedDate = "Never";
   }else{
        modifiedDate = new Date(user.dateModif).toLocaleString('en-GB', options); //format date
   }
   
   //display user data	
   $('#name').html((user.firstname || '-') + " " + (user.lastname || '-'));
   $('#nickname').html(user.nickname || '-');
   $('#loggin-date').html( lastLogin );
   $('#role').html(user.role + roleIcon || '-');
   $('#email').html(user.email || '-');
   $('#age').html(user.age || '-');
   $('#gender').html(user.gender == 'M'?'Male':user.gender=='F'?'Female':'-');
   $('#created').html("Created: " + creationDate);
   $('#modified').html("Modified: " + modifiedDate);

}//END fillUserData function

//Edit user button click event handler 
function editUserData(){
   
   //fill inputs with current user data 
   $("input[name='firstname']").val(user.firstname);
   $("input[name='name']").val(user.lastname);
   $("input[name='email']").val(user.email);
   $("input[name='nickname']").val(user.nickname);
   $("input[name='age']").val(user.age);
   $("input[type='radio'][value='" + user.gender + "']").prop("checked",true);
   $("#update-button").on("click",updateUserData);
   
   //dispaly edit user data section
   $("#edit-background").removeClass("no-display");
}

//Change user password click event handler
function changeUserPassword(){
    
   $('#update-password-button').on('click',updateUserPassword);
   $('#changepass-background').removeClass('no-display');
   
}//END changeUserPassword function

//Delete account click event handler
function deleteAccount(){
    
    var markedId = undefined;                                                   //Init. target user variable
    
    //get clicked delete button
    var clickedBtn = $(this);
    var identifier = clickedBtn.attr('identify');
   
    //Get target user ID 
    if(identifier ==='delete-others-button'){
        var parentRow = clickedBtn.parents('tr');
        markedId = parentRow.attr('userid');
        
    }else if(identifier ==='delete-myself-button'){
        markedId = loggedUser.loggedUserId;
    }
    
    //If target id was obtained request user deletion
    if(markedId){

        var user = new User();                                                  //New User object
        
        user.delete(markedId).done(function(response){                          // delete user request
        
            if(response.success === true){
                popUp("success",response.message);
                if(identifier ==='delete-others-button'){                       //if delete other user account - refresh tabel
                    getUsers();
                }else{
                    setTimeout(function(){logout()},1000);                      //if delete own account - logout 
                }
            }
        }); //delete user completed 
        
    }else{
        popUp("error","Failed to get target user ID!");
    }
}//END delete user

//Update user data button click event handler
function updateUserData(){
    
    //get user input
   firstnameText = $("input[name='firstname']").val().trim();
   nameText      = $("input[name='name']").val().trim();
   emailText     = $("input[name='email']").val().trim();
   nicknameText  = $("input[name='nickname']").val().trim();
   ageText       = $("input[name='age']").val().trim();
   selGender     = $("input[type='radio']:checked").val();
    
    // check if inputs are valid   
    if(validInputs()){
        
        resetError($('#inputs-in-error'));                                 
        
        var user = new User();                                                  //new User object
        
        var newUserData={                                                       // user object with updated profile
            id: loggedUser.loggedUserId,
            firstname: firstnameText,
            name: nameText,
            email: emailText,
            nickname: nicknameText,
            age: ageText,
            gender: selGender
            
        };
        
        user.update(newUserData).done(function(response){                       //update user reqest
            
            if(response.success === true){
                popUp("success",response.message);
                window.location.reload();
            }
            else{
                popUp("error",response.message);
            }
        }); //update user completed
        
    }else{
        setError($('#inputs-in-error'),"You have errors on your inputs!");
    }
    
}//END updateUserData

//Update password button click event handler
function updateUserPassword(){
    
   //get password inputs    
   passwordText = $("input[name='password']").val();
   newpassText  = $("input[name='newpassword']").val();
   repassText   = $("input[name='repassword']").val();
    
    //check if inputs are valid
    if(validPasswords()){
        
        resetError($('#changepass-inputs-in-error'));
        
        var user = new User();                                                  //New User object
        
        var newPassword={                                                       //Password object with new data
            pass: passwordText,
            newpass: newpassText,
            repass: repassText,
        };
        
        user.changePassword(newPassword).done(function(response){               //change password request
            
            if(response.success === true){
                 popUp("success",response.message);
                 window.location.reload();
            }else{
                popUp("error",response.message);
            }
        }); //change password completed
    
    }else{
        setError($('#changepass-inputs-in-error'),"You have errors on your inputs!");
    }
    
}//END updateUserPassword

//top menu click event handler
function topMenuClick(){
  
   var clicked = $(this);                                                       //get clicked element
   
   //determin clicked button
   switch (clicked.attr('id')){
       case 'logout':
           logout();
       break;
       case 'home':
           window.location.href = HOME_PAGE;
       break;
       case 'go-to-articles':
           window.location.href = UI_PAGE + "articles.html";
       break;
   }
   
}//END topMenuCLick() function

//manage accounts button click event handler
function manageAccounts(){
     
   createManageAccountsSection();                                               //create manage accounts sections   
   getUsers();                                                                  //get accounts list  
   
   $("#manage-acc-background").removeClass("no-display");                       //display accounts section
   
   $('html, body').animate({                                                    //scroll down to this section
        scrollTop: $("#existing-accounts").offset().top
    }, 2000);
    
}//End manageAccounts function

//change role button click event handler
function changeRole(){
    
    var clickedBtn   = $(this);                                                 //get button clicked
    var parentRow    = clickedBtn.parents('tr');        
    var markedUserId = parentRow.attr('userid');                                //get target user id
    var newRole      = undefined;                                               //init. new role variable
    
    //get change role operation from clicked button text
    if(clickedBtn.val().trim().toLowerCase() === 'demote'){
        newRole = 'user';
    }else if(clickedBtn.val().trim().toLowerCase() === 'promote'){
        newRole = 'admin';
    }
    
    //if target user was determined
    if(markedUserId){
        
        if(newRole === 'admin' || newRole === 'user'){
            
            var user = new User();                                              //new User object
            
            user.changeRole(newRole,markedUserId).done(function(response){      //change role request
            
                if(response.success === true){
                    popUp("success","User was " + clickedBtn.val().trim() +"d to " + newRole.toUpperCase() + " role!");
                    getUsers();
                }else{
                    popUp("error",response.message);
                }
            }); //change role request completed
            
        }else{
             popUp("error","Failed to get user`s new role!");
        }
        
    }else{
        popUp("error","Failed to get target user ID!");
    }
    
}//END change Role

//get accounts list from server
function getUsers(){
    
    var user = new User();                                                      //new User object
    
    user.getAll().done(function(response){                                      //Get accounts request  
        
        if(response.success === true){                                          //if accounts were received successfully create accounts table
            createAccountsTable(user.userList);
        }else{
            popUp("error",response.message);
        }
    }); //accounts list request completed
    
}//END getUser function

//Close pop-up windows
function closeWindow(){
    
    $(this).parents(".window-background").addClass("no-display");
    
}//END closeWindow

//-------------------------------------------------------/Events handlers---------------------------------------------------------------

//validate user inputs
function validInputs(){
    
    var validInputs = true;                                                     //assume all inputs are valid - set flag to true
                                                                                //any invalid inputs set flag to false
    if(firstnameText.length === 0 ){
        setError($('#error-edit-firstname'),"*Firstname cannot be empty");
        validInputs = false;
    }else{
        resetError($('#error-edit-firstname'));
    }
   
    if(nameText.length === 0 ){
        setError($('#error-edit-name'),'*Name cannot be empty');
        validInputs = false;
    }else{
        resetError($('#error-edit-name'));
    }
   
    if(emailText.length === 0 ){
        setError($('#error-edit-email'),'*Email cannot be empty');
        validInputs = false;
    }else if(!isValidEmail(emailText)){
        setError($('#error-edit-email'),'*Email is not valid');
        validInputs = false;
    }else{
        resetError($('#error-edit-email'));
    }
   
    if(!isValidAge(ageText) && ageText.length > 0){
        setError($('#error-edit-age'),'*Age is not valid');
        validInputs = false;
    }else if(ageText.length == 1 || ageText > 150){
        setError($('#error-edit-age'),'*Age must be between 10 and 150!');
        validInputs = false;
    }else{
         resetError($('#error-edit-age'));
    }

   return validInputs;
   
}//END validInputs

//Validate user credentials
function validPasswords(){
    
    var validInputs = true;
     
    if(passwordText.length === 0 ){
        setError($('#error-edit-password'),'*Password cannot be empty');
        validInputs = false;
    }else if(passwordText.length < 3){
        setError($('#error-edit-password'),'*Password too short');
        validInputs = false;
    }else{
         resetError($('#error-edit-password'));
    }
    
    if(newpassText.length === 0 ){
        setError($('#error-edit-newpassword'),'*New password cannot be empty');
        validInputs = false;
    }else if(newpassText.length < 3){
        setError($('#error-edit-newpassword'),'*New password too short');
        validInputs = false;
    }else if(newpassText !== repassText){
        setError($('#error-edit-newpassword'),'*Passwords don`t match');
        setError($('#error-edit-repassword'),'*Passwords don`t match');
        validInputs = false;
    }else{
        resetError($('#error-edit-newpassword'));
        resetError($('#error-edit-repassword'));
    } 
   
   return validInputs;
    
}//END validCredentials

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