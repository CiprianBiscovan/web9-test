/*global $ */

//Wait for page to be fully loaded
$(document).ready(onHtmlLoaded);

//Function executed after page loads
function onHtmlLoaded(){
    
    var loginBtn = $("#login_btn"); //get Login button reference
    var logoutBtn = $("#logout_btn"); //get Logout button reference
    var loginModel; 
    
    //check if user is already logged in
    if($.cookie("loggedIn")){
        
        var userLogged = $("#user-logged");
        var userInfo = JSON.parse($.cookie("loggedIn"));
       // userLogged.html("Welcome: <strong>" + userInfo.name + " [" +userInfo.role+ "] " + "</strong>" );
        userLogged.html("<strong>" + userInfo.role.toUpperCase() + ": " +userInfo.name + "</strong>" );
       
    }
    
   //Subscription to click event on Login button 
    loginBtn.on("click",function(){
        
        //get user inputs
        var suppliedEmail = $("[name='user_email']").val().trim(); 
        var suppliedPassword = $("[name='user_password']").val().trim();
        
        //Validate email address introduced
        if(suppliedEmail.length === 0){
            console.log("empty email");
            return;
        }else if(!isValidEmail(suppliedEmail)){
                console.log("email not valid");
                return;
            }  
        
        //validate password introduced
        if(suppliedPassword.length === 0){
            console.log("empty password");
            return;
        }
        else if(suppliedPassword.length < 3 ){
            console.log("Password too short");
            return;
        }
        
        //prepare user data to be sent to the server for authentication
        loginModel = new Login({
            email:suppliedEmail,
            pass:suppliedPassword
        });
          
        var loginReq = loginModel.signIn(); //send data to the server
          
        // get server message in case of success
        loginReq.done(redirectUserToArticlesPage);
          
        }); //END LogIn Subscription
        
        //Subscription to click event on logout button
        logoutBtn.on("click",function(){
            console.log("Loging out...");
           loginModel = new Login({email:"",pass:""});
           var logoutReq = loginModel.signOut(); //send data to server
           
           logoutReq.done(function(){
               if(loginModel.success){
                   $.removeCookie("loggedIn");
                   if(!$.cookie("loggedIn")){
                       alert("You successfully LogOut!");
                   }
                   window.location.href = UI_PAGE + "login.html";
               }
           });
       });//END LogOut Subscription
        
        
        // Processing user data if successfull authentication
        function redirectUserToArticlesPage(){
            
            if(loginModel.isLogged){
                
                //store user info in a temporary cookie to avoid traffic to server
                var userInfo = {
                    name: loginModel.name,
                    id: loginModel.id,
                    role: loginModel.role
                };
                $.cookie("loggedIn",JSON.stringify(userInfo));
                
                //redirect user to articles page
                window.location.href = UI_PAGE + "articles.html";//"https://web9-ciprianbiscovan.c9users.io/Blog/UI/pages/articles.html";
            }
            else{
                
                alert("Login failed");
            }
        }
        
        //Validate user email
        function isValidEmail(email){
            const regEx =/^[a-z]{1}(?!.*(\.\.|\.@))[a-z0-9!#$%&*+/=?_{|}~.-]{0,63}@(?=.{0,253}$)([a-z0-9]\.|[a-z0-9][a-z0-9-]{0,63}[a-z0-9]\.)+[a-z0-9]{1,63}$/gmi;
            return email.match(regEx);
        }
}