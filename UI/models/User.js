/* global $ URL_PHP*/

//Login CLASS
function User(options){
    if(options){
        this.email = options.email;
        this.pass = options.pass;
    }
    
	this.isLogged = false;
	
    //check if user is logged In
	if($.cookie("loggedIn")){
		this.isLogged = true;
		var loggedUser = JSON.parse($.cookie("loggedIn"));
		this.loggedUserId = loggedUser.id;
		this.loggedUserName = loggedUser.name;
		this.loggedUserRole = loggedUser.role.toUpperCase();
		if(loggedUser.role.toLowerCase() === 'admin'){
		    this.isAdmin = true;
		}else{
		    this.isAdmin = false;
		}
	}
}

//SignIn method
User.prototype.login = function(){
    
    var that = this; //save login instance, (it will change after receiving data from server)
    
    //Configure request for the server
    var config = {
        url: URL_PHP + "login",
        method: "POST",
        data: {
        email:this.email,
        pass: this.pass
        },
        dataType: "json",
        
        //functio to be executed in case of req. succeded
        success: function(response){
            
            if(response){
                that.isLogged = response.isLogged || false;
                if(response.isLogged === true){
                    that.name = response.name.trim() || response.email.trim() || "anonymus";
                    that.id = response.ID.trim();
                    that.role = response.role.trim();
                }
                else {
                    alert(response.message);
                }
            }
        },
        
        //function to be executed in case of req. fails
        error: function(xhr,status,error){
            alert("Oops!Something is wrong at LogIn" + error);
        },
        
        //function to be executed when req. is completed
        complete: function(){
           // console.log("The request is complete!");
        }
        
    }; //END Ajax configuration
    
    //signIn method will return the jqXHR object returned by
    //the ajax request
   return $.ajax(config);
   
};//END SignIn method

//SignOut method
User.prototype.logout = function(){
    
    var that = this; //save current object
    
    //prepare and send request to the server
    return $.ajax({
        url: URL_PHP + "logout", 
        method: "POST", 
        
        //function to execute in case of req. succeded
        success: function(response){
            that.success = response.success || false;
            that.message = response.message || "";
        },
        
        //function to execute in case of req. fails
        error: function(xhr,status,error){
            alert("Oops!Something is wrong at LogOut" + error);
        },
        
        //function to execute when req. is completed
        completed: function(){
            //not needed so far
        }
    });
    
}; // END SignOut method

