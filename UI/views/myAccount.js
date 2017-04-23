/*global $*/

$(document).ready(onHtmlLoaded);

var loggedUser = new User();
var user = new User();
 if(loggedUser.isLogged === false){
        window.location.href = UI_PAGE + "login.html";
 }
 
    var firstnameText     = undefined;
    var nameText       = undefined;
    var emailText      = undefined;
    var passwordText   = undefined;
    var newpassText = undefined;
    var repassText = undefined;
    var nicknameText   = undefined;
    var ageText        = undefined;
    var selGender         = undefined;
    
function onHtmlLoaded(){
    if(loggedUser.isLogged === false){
        return;
    }
    
    addTopMenu();
    addCommandButtons();
    
    user.getUserData(user.loggedUserId).done(function(response){
        
        if(response.success === true){
            user = new User(response[0]);
            fillUserData();
        }else{
        console.log(response.message);
        }
    });
    
}//END onHtmlLoaded function

//-------------------------------------------------------------------DOM Manipulation-----------------------------------------------------------------------------
//Function for creating top menu 
function addTopMenu(){
    var topMenu = $("#top-menu");
    
    topMenu.append("<button id='logout'>Logout</button>");
    if(loggedUser.isAdmin){
        topMenu.append("<button id='new-article'>New Article</button>");
        
    }
    topMenu.append("<button id='go-to-articles'>Articles</button>");
    topMenu.children().click(topMenuClick);
    
}//END addTopMenu function

//Function to add command buttons on profile section
function addCommandButtons(){
    var profileSect = $('#current-user-data>fieldset');
    var editButton = $('<button id="edit-button">Edit</button>');
    var changePassword = $('<button id="change-password-button">Change Password</button>');
    var deleteButton = $(' <button id="delete-myself-button">Delete Account</button>');
    var manageAccButton = $("<button id='manage-accounts'>Manage Accounts</button>");
   
    editButton.on('click',editUserData);
    changePassword.on('click',changeUserPassword);
    deleteButton.on('click',deleteAccount);
    manageAccButton.on('click',manageAccounts);
    
    profileSect.append(editButton)
               .append(changePassword);
    if(loggedUser.isAdmin === true){
        profileSect.append(manageAccButton);
    }else{
        profileSect.append(deleteButton);
    }
}

//function for creating table with user accounts
function  createManageAccountsSection(){
     $('#existing-accounts').append("<fieldset>" +
            "<legend>Existing Accounts</legend>" +
            "<button id='refresh-button'>Refresh</button>" +
            "<table id='acounts-list'>"+
            "</table>"+
            "</fieldset>");
    $("#refresh-button").on('click',getUsers);
}//END  createManageAccountsSection function

//function for creating table with accounts
function createAccountsTable(usersList){
    var th = $("<tr>'id='header-row'</tr>");
    var table = $('#acounts-list');
    th.append("<th>Firstname</th>")
      .append("<th>Lastname</th>")
      .append("<th>Nickname</th>")
      .append("<th>Gender</th>")
      .append("<th>Age</th>")
      .append("<th>Creation Date</th>")
      .append("<th>Last Modified</th>")
      .append("<th>Last Login</th>")
      .append("<th>Email</th>")
      .append("<th>Role</th>");
     table.empty();
     table.append(th);
     table.attr('border','1');
    for(var i=0; i<usersList.length;i++){
     table.append(newRow(usersList[i]));   
    }
}//END createAccountsTable

function newRow(user){
    var gender = (user.gender == 'M') ? "Male" : (user.gender == 'F') ? 'Female' : '-'; 
    var chgRoleBtnText  = (user.role.toLowerCase() === 'admin') ? 'Demote' : (user.role.toLowerCase() === 'user') ? 'Promote' : '-';
    var chgRoleBtn = $('<button>' + chgRoleBtnText + '</button>');
    var deleteBtn = $('<button id="delete-others-button">Delete</button>');
    
    chgRoleBtn.on('click',changeRole);
    deleteBtn.on('click',deleteAccount);
    var row = $("<tr userID='" + user.id + "'></tr>");
        row.append("<td userdata='firstname'>" + user.firstname || '-' + "</td>")
           .append("<td userdata='lastname'>" + user.lastname || '-' + "</td>")
           .append("<td userdata='nickname'>" + user.nickname || '-' + "</td>")
           .append("<td userdata='gender'>" + gender + "</td>")
           .append("<td userdata='age'>" + user.age || '-' + "</td>")
           .append("<td userdata='creation-date'>" + user.dateCreate || '-' + "</td>")
           .append("<td userdata='last-modified'>" + user.dateModif || '-' + "</td>")
           .append("<td userdata='last-login'>" + user.lastLogin || '-' + "</td>")
           .append("<td userdata='email'>" + user.email || '-' + "</td>")
           .append("<td userdata='role'>" + user.role || '-' + "</td>");
    if(user.id !== user.loggedUserId){
        row.append(chgRoleBtn)
           .append(deleteBtn);
    }else{
        row.append("<h3>!This is you</h3>");
    }
           
    return row;
}//END newRow function

//-------------------------------------------------------------------/DOM Manipulation-----------------------------------------------------------------------------
//----------------------------------------------------------------------Events handlers----------------------------------------------------------------------------
function fillUserData(){

   $('#name').html((user.firstname || '-') + " " + (user.lastname || '-'));
   $('#nickname').html(user.nickname || '-');
   $('#loggin-date').html("Logged In: " + user.lastLogin);
   $('#role').html(user.role || '-');
   $('#email').html(user.email || '-');
   $('#age').html(user.age || '-');
   $('#gender').html(user.gender == 'M'?'Male':user.gender=='F'?'Female':'-');
   $('#created').html("Created: " + user.dateCreate);
   $('#modified').html("Modified: " + user.dateModif);
}

function editUserData(){
   $("input[name='firstname']").val(user.firstname);
   $("input[name='name']").val(user.lastname);
   $("input[name='email']").val(user.email);
   $("input[name='nickname']").val(user.nickname);
   $("input[name='age']").val(user.age);
   $("input[type='radio'][value='" + user.gender + "']").prop("checked",true);
   $("#update-button").on("click",updateUserData);
 
}
function changeUserPassword(){
   $('#update-password-button').on('click',updateUserPassword);
}
function deleteAccount(){
    
    var markedId = undefined;
    var target = this;
    
    if(this.id ==='delete-others-button'){
        
    var clickedBtn = $(this);
    var parentRow = clickedBtn.parent('tr');
    markedId = parentRow.attr('userID');
    }else if(this.id ==='delete-myself-button'){
        markedId = loggedUser.loggedUserId;
    }
    
    if(markedId){
        var user = new User();
        user.delete(markedId).done(function(response){
            console.log(response.message);
            if(response.success === true){
                if(target.id ==='delete-others-button'){
                    getUsers();
                }else{
                    window.location.href = UI_PAGE + "logout.html";
                }
            }
        });
    }else{
        console.log("Failed to ge User ID!");
    }
}
function updateUserData(){
   firstnameText = $("input[name='firstname']").val().trim();
   nameText = $("input[name='name']").val().trim();
   emailText = $("input[name='email']").val().trim();
   nicknameText = $("input[name='nickname']").val().trim();
   ageText = $("input[name='age']").val().trim();
   selGender = $("input[type='radio']:checked").val();
   
    if(validInputs()){
        
        var user = new User();
        var newUserData={
            id: loggedUser.loggedUserId,
            firstname: firstnameText,
            name: nameText,
            email: emailText,
            nickname: nicknameText,
            age: ageText,
            gender: selGender
            
        };
        
        user.update(newUserData).done(function(response){
            
            if(response.success === true){
                window.location.reload();
            }
            else{
                console.log(response.message);
            }
        });
    }
}//END updateUserData

function updateUserPassword(){
   passwordText = $("input[name='password']").val();
   newpassText = $("input[name='newpassword']").val();
   repassText = $("input[name='repassword']").val();
    
    if(validPasswords()){
        console.log("Change credentials..");
        var user = new User();
        var newPassword={
            pass: passwordText,
            newpass: newpassText,
            repass: repassText,
        };
        
        user.changePassword(newPassword).done(function(response){
            
            if(response.success === true){
                 console.log(response.message);
                window.location.reload();
            }
            else{
                console.log(response.message);
            }
        });
    }
    
}//END updateUserPassword

//function for handling mouse click on elements from top menu
function topMenuClick(){
  
   var clicked = $(this);
   
   switch (clicked.attr('id')){
       case 'logout':
           window.location.href = UI_PAGE + "logout.html";
       break;
       case 'new-article':
           window.location.href = UI_PAGE + "newArticle.html";
       break;
       case 'go-to-articles':
             window.location.href = UI_PAGE + "articles.html";
       break;
   }
}//END topMenuCLick() function

function manageAccounts(){
   createManageAccountsSection();
   getUsers();
    
}//End manageAccounts function

//change role button click handler
function changeRole(){
    var clickedBtn = $(this);
    var parentRow = clickedBtn.parent('tr');
    var markedUserId = parentRow.attr('userID');
    var newRole = undefined;
    
    if(clickedBtn.text().trim().toLowerCase() === 'demote'){
        newRole = 'user';
    }else if(clickedBtn.text().trim().toLowerCase() === 'promote'){
        newRole = 'admin';
    }
    if(markedUserId){
        if(newRole === 'admin' || newRole === 'user'){
        console.log('Changing role to ' + newRole);
        var user = new User();
        user.changeRole(newRole,markedUserId).done(function(response){
            
            if(response.success === true){
                console.log("User was " + clickedBtn.text().trim() +"d to " + newRole + " role!");
                getUsers();
            }else{
                console.log(response.message);
            }
        });
        }else{
             console.log("Failed to get user new Role!");
        }
        
    }else{
        console.log("Failed to get user ID!");
    }
    
    
}//END change Role

//function for getting users from server
function getUsers(){
    var user = new User();
    user.getAll().done(function(response){
        if(response.success === true){
            createAccountsTable(user.userList);
        }else{
            console.log(response.message);
        }
    });
    
}//END getUser function

//-------------------------------------------------------/Events handlers---------------------------------------------------------------

//function for validationg user inputs
function validInputs(){
    var validInputs = true;
    
   if(firstnameText.length === 0 ){
       $('#error-edit-firstname').html('*Firstname cannot be empty');
       validInputs = false;
   }else{
       $('#error-edit-firstname').html('*');
   }
   if(nameText.length === 0 ){
       $('#error-edit-name').html('*Name cannot be empty');
       validInputs = false;
   }else{
       $('#error-edit-name').html('*');
   }
   if(emailText.length === 0 ){
      $('#error-edit-email').html('*Email cannot be empty');
      validInputs = false;
  }else if(!isValidEmail(emailText)){
        $('#error-edit-email').html('*Email is not valid');
        validInputs = false;
  }else{
      $('#error-edit-email').html('*');
    }
   if(!isValidAge(ageText) && ageText.length > 0){
       $('#error-edit-age').html('*Age is not valid');
       validInputs = false;
   }else if(ageText.length == 1 || ageText > 150){
       $('#error-edit-age').html('*Age must be between 10 and 150!');
       validInputs = false;
   }else{
        $('#error-edit-age').html('*');
   }

   return validInputs;
}//END validInputs

//function for validationg user credentials
function validPasswords(){
    var validInputs = true;
     
   if(passwordText.length === 0 ){
       $('#error-edit-password').html('*Password cannot be empty');
       validInputs = false;
   }else if(passwordText.length < 3){
       $('#error-edit-password').html('*Password too short');
       validInputs = false;
    }else{
         $('#error-edit-password').html('*');
    }
    if(newpassText.length === 0 ){
       $('#error-edit-newpassword').html('*New password cannot be empty');
       validInputs = false;
   }else if(newpassText.length < 3){
       $('#error-edit-newpassword').html('*New password too short');
       validInputs = false;
    }else if(newpassText !== repassText){
       $('#error-edit-newpassword').html('*Passwords don`t match');
       validInputs = false;
    }else{
       $('#error-edit-newpassword').html('*');
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