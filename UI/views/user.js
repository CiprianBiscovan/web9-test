/*global $ UI_PAGE Login*/

//Wait for page to be fully loaded
$(document).ready(onHtmlLoaded);

//Function executed after page loads
function onHtmlLoaded(){
    
    var loginBtn  = $("#login_btn");   //get Login button reference
    var logoutBtn = $("#logout_btn");  //get Logout button reference
    var errEmail  = $("#error-email"); //get container for email error
    var errPass   = $("#error-pass");  //get container for password error
    var loginModel; 
    
    //check if user is already logged in
    if($.cookie("loggedIn")){
        var userLogged = $("#user-logged");
        var userInfo = JSON.parse($.cookie("loggedIn"));
        userLogged.html("<strong>" + userInfo.role.toUpperCase() + ": " +userInfo.name + "</strong>" );
    }
    
   //Subscription to click event on Login button 
    loginBtn.on("click",function(){
        
        //get user inputs
        var suppliedEmail    = $("[name='user_email']").val(); 
        var suppliedPassword = $("[name='user_password']").val();
        
        //Validate email address introduced
        if(suppliedEmail.length === 0){
            errEmail.html("Email can`t be empty!");
            errEmail.toggleClass("hidden");
            return;
        }else if(!isValidEmail(suppliedEmail)){
                errEmail.html("Email is not valid!");
                errEmail.toggleClass("hidden");
                return;
            }  
        
        //validate password introduced
        if(suppliedPassword.length === 0){
            errPass.html("Password can`t be empty!");
            errPass.toggleClass("hidden");
            return;
        }
        else if(suppliedPassword.length < 3 ){
            errPass.html("Password too short! (Should be at least 3 characters long)");
            errPass.toggleClass("hidden");
            return;
        }
        
        // at this point all error messages must be hidden
        errEmail.addClass("hidden");
        errEmail.html("*");
        errPass.addClass("hidden");
        errPass.html("*");
        
        //prepare user data to be sent to the server for authentication
        loginModel = new User({
            email:suppliedEmail,
            pass:suppliedPassword
        });
          
        var loginReq = loginModel.login(); //send data to the server
          
        // get server message in case of success
        loginReq.done(redirectUserToArticlesPage);
          
        }); //END LogIn Subscription
        
        //Subscription to click event on logout button
        logoutBtn.on("click",function(){
            
            if(!$.cookie("loggedIn")){
                alert("You are not logged in!");
                return;
            }
            
            var logoutModel = new User();
            
            var logoutReq = logoutModel.logout(); //send data to server
            
            logoutReq.done(function(){
                
                if(logoutModel.success){
                    $.removeCookie("loggedIn");
                    
                    if(!$.cookie("loggedIn")){
                        alert("You successfully LogOut!");
                    }
                    
                    window.location.href = UI_PAGE + "login.html";
                    
                }else{
                    
                    alert(logoutModel.message);
                }
            });
            
       });//END LogOut Subscription
        
        
        // Processing user data if successfull authentication
        function redirectUserToArticlesPage(){
            
            if(loginModel.isLogged){
                
                //store user info in a temporary cookie to avoid traffic to server
                var userInfo = {
                    name: loginModel.name.trim(),
                    id: loginModel.id.trim(),
                    role: loginModel.role.trim()
                };
                $.cookie("loggedIn",JSON.stringify(userInfo));
                
                //redirect user to articles page
                window.location.href = UI_PAGE + "articles.html";//"https://web9-ciprianbiscovan.c9users.io/Blog/UI/pages/articles.html";
            }
            else{
                
                alert("Login failed");
            }
        }//END RedirectUser... function
        
        //Validate user email
        function isValidEmail(email){
            
            const regEx =/^[a-z]{1}(?!.*(\.\.|\.@))[a-z0-9!#$%&*+/=?_{|}~.-]{0,63}@(?=.{0,253}$)([a-z0-9]\.|[a-z0-9][a-z0-9-]{0,63}[a-z0-9]\.)+[a-z0-9]{1,63}$/gmi;
            return email.match(regEx);
            
        }//END isValidEmail function
        
}//END OnHtmlLoaded function