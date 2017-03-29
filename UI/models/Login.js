/* global $*/

//Login CLASS
function Login(options){
    this.email = options.email;
    this.pass = options.pass;
}

//SignIn method
Login.prototype.signIn = function(){
    
    var that = this; //save login instance, (it will change after receiving data from server)
    
    //COnfigure request for the server
    var config = {
        
        url: URL_PHP + "login",
        method: "POST",
        data: {
        email:this.email,
        pass: this.pass
        },
        dataType: "json",
        success: function(response){
            
            if(response){
           
                that.isLogged = response.isLogged || false;
                that.name = response.name.trim() || response.email.trim() || "anonymus";
                that.id = response.ID.trim();
                that.role = response.role.trim();
            }
        },
        error: function(xhr,status,error){
            alert("Oops!Something is wrong at LogIn" + error);
        },
        complete: function(){
            console.log("The request is complete!");
        }
    }; 
    
    //signIn method will return the jqXHR object returned by
    //the ajax request
   return $.ajax(config);
   
};//END SignIn method

//SignOut methd
Login.prototype.signOut = function(){
    that = this;
    return $.ajax({
        url: URL_PHP + "logout",
        method: "POST", 
        success: function(response){
            that.success = response.success || false;
        },
        error: function(xhr,status,error){
            alert("Oops!Something is wrong at LogOut" + error);
        },
        completed: function(){
            //not needed so far
        }
    });
}; // END SignOut method

