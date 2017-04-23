 //Logout current user and redirect to Login page
            
            if(!$.cookie("loggedIn")){
               window.location.href = UI_PAGE + "login.html";
               console.log('Nobody is loggedIn!');
               
            }else{
                doLogout();
            }
            
    function doLogout(){
            
            var logoutModel = new User();
            
            var logoutReq = logoutModel.logout(); //send data to server
            
            logoutReq.done(function(){
                
                if(logoutModel.success){
                    $.removeCookie("loggedIn");
                    
                    if(!$.cookie("loggedIn")){
                        console.log("You successfully LogOut!");
                    }
                    
                    window.location.href = UI_PAGE + "login.html";
                    
                }else{
                    
                    console.log(logoutModel.message);
                }
            });
    }
            
      