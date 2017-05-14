/*global $ */
/*global UI_PAGE */
/*global User */
/*global setError resetError */


//always check if HTML is loaded before doing anything
//HTML operations on view
$(document).ready(onHtmlLoaded);

//global variable
 var loginModel; 

//Function executed after document is fully loaded
function onHtmlLoaded(){
    
    var loginBtn   = $("#login_btn");                                           //get Login button reference
    var errEmail   = $("#error-email");                                         //get container for email error
    var errPass    = $("#error-pass");                                          //get container for password error
    var userLogged = $("#user-logged");                                         //get logged user container
    var nav        = $("nav");                                                  //get navigation element
    var user = new User();                                                      //New User object
    var roleIcon = '';                                                          //Init. role icon variable
    
    //Add top menu
    addTopMenu();
    
    // Determin icon to use based on logged user role
    if(user.isLogged == true){
        if (user.loggedUserRole === 'ADMIN'){
            roleIcon = "&#9812;";
        }else{
	    	roleIcon = "&#9817;";
	    }
	    userLogged.html("<h3 id='username'><span>"+ roleIcon + "</span> " + user.loggedUserName + "</h3>");
    }else{
        userLogged.html("<h3 id='username'> </h3>");
    }
  
    // Attach click events to Login/SignUp options  
    nav.children().find('a').on('click',optionChanged);
  
   //Attach and handle click event on Login button 
    loginBtn.on("click",function(){
        
        //get user inputs
        var suppliedEmail    = $("[name='user_email']").val(); 
        var suppliedPassword = $("[name='user_password']").val();
        
        //Validate email address introduced
        if(suppliedEmail.length === 0){
            setError(errEmail,"E-mail cannot be empty!");
            return;
        }else if(!isValidEmail(suppliedEmail)){
            setError(errEmail,"E-mail is not valid!");
            return;
        }else{
            resetError(errEmail);
        }  
        
        //validate password introduced
        if(suppliedPassword.length === 0){
            setError(errPass,"Password cannot be empty!");
            return;
        }
        else if(suppliedPassword.length < 3 ){
            setError(errPass,"Password too short! (Min.3 characters)");
            return;
        }else{
            resetError(errPass);
        }
        
        
        //prepare user data to be sent to the server for authentication
        loginModel = new User({
            email:suppliedEmail,
            pass:suppliedPassword
        });
    
        //send data to the server      
        var loginReq = loginModel.login();                                          
          
        // get server message in case of success
        loginReq.done(redirectUserToArticlesPage);
          
    }); //END Login button click event handler
        
}//END onHtmlLoaded function

//Create top menu 
function addTopMenu(){
    
    //get existing top menu containers
    var topMenu = $("#top-menu");
    var btnsContainer = $("#buttons-wrapper");
    
    //Add top menu buttons
    btnsContainer.append("<button id='home' class='yellow'><span><i class='fa fa-home'></i></span>Home</button>");
    btnsContainer.append("<button id='go-to-articles' class='blue'><span><i class='fa fa-list-ul'></i></span>Articles</button>");
    
    //Attach click events to buttons
    topMenu.children().find('button').click(topMenuClick);
    
}//END addTopMenu function

// Top menu click event handler
function topMenuClick(){
  
   var clicked = $(this);                                                       //get clicked element
   
   //Determine clicked button
   switch (clicked.attr('id')){
        case 'home':
            window.location.href = HOME_PAGE;
        break;
        case 'go-to-articles':
            window.location.href = UI_PAGE + "articles.html";
        break;
   }
   
}//END topMenuCLick() function

// Processing user data if successfull authentication
function redirectUserToArticlesPage(response){
    
    if(loginModel.isLogged){
                
        //store user info in a temporary cookie to avoid traffic to server
        var userInfo = {
            name: loginModel.name.trim(),
            email: loginModel.email.trim(),
            id: loginModel.id.trim(),
            role: loginModel.role.trim()
        };
        
        $.cookie("loggedIn",JSON.stringify(userInfo),{path:'/'});
                
        //redirect user to articles page
        window.location.href = UI_PAGE + "articles.html";
    
    }else{
        popUp("error","Login failed!",response.message);
    }
    
}//END redirectUserToArticlesPage function
        
//Login/Signup option changed event handler
function optionChanged(ev){
    
    ev.preventDefault();                                                        //Stop <a> html element from reloading the page when clicked
    
    //Get options and sections
    var optLogin = $("#opt-login");
    var optSignup = $("#opt-signup");
    var sectLogin = $("#login");
    var sectSignup = $("#sign-up");
    
    //Get user option        
    switch(this.id){
        
        //If Login option is selected - hide Signup and show Login section
        case 'opt-login':
            optLogin.addClass("active");
            optSignup.removeClass("active");
            sectLogin.removeClass("no-display");
            sectSignup.addClass("no-display");
        break;
        
        //If Signup option is selected - hide login and show SignUp section            
        case 'opt-signup':
            optLogin.removeClass("active");
            optSignup.addClass("active");
            sectLogin.addClass("no-display");
            sectSignup.removeClass("no-display");
        break;
    }
            
}//END optionChanged fucntion

//Validate user email
function isValidEmail(email){
    
    const regEx =/^[a-z]{1}(?!.*(\.\.|\.@))[a-z0-9!#$%&*+/=?_{|}~.-]{0,63}@(?=.{0,253}$)([a-z0-9]\.|[a-z0-9][a-z0-9-]{0,63}[a-z0-9]\.)+[a-z0-9]{1,63}$/gmi;
    return email.match(regEx);
    
}//END isValidEmail function