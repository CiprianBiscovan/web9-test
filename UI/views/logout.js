/*global $ */
/*global UI_PAGE User */
/*global popUp*/

//Logout current user and redirect to Login page
function logout(){    
    
    //check if any user is logged in
    if(!$.cookie("loggedIn")){
        
        window.location.href = UI_PAGE + "login.html";                          //redirect to Login page if nobody is logged in
           
    }else{
        
        doLogout();                                                             //Logout user
    }
    
    //Logout function        
    function doLogout(){
            
        var logoutModel = new User();                                           //new User object
            
        var logoutReq = logoutModel.logout();                                   //send request to server
        
        //Proccess logout request response     
        logoutReq.done(function(){
            
            //Check if logout operation was successfull    
            if(logoutModel.success){
                    
                $.removeCookie("loggedIn",{path:"/"});                          //remove coockie
                
                //if coockie was successfully 
                //removed show success pop-up and redirect user to login page    
                if(!$.cookie("loggedIn")){
                    
                    popUp("success","You successfully LogOut!");
                    setTimeout(function() {window.location.href = UI_PAGE + "login.html"}, 1000);
                }
                    
            }else{
                popUp("error",logoutModel.message);
            }
        }); //Logout request completed
    
    }//end doLogout function
            
}//End logout function