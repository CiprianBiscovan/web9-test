/* global $ URL_PHP*/
/* global popUp */

//Login CLASS
function User(options){
    
    //create and initialize user attributes  when object it is created
    if(options){
        this.id         = options.id;
        this.firstname  = options.first_name;
        this.lastname   = options.last_name;
        this.email      = options.email;
        this.pass       = options.pass;
        this.gender     = options.gender;
        this.age        = options.age;
        this.nickname   = options.nick_name;
        this.role       = options.role;
        this.lastLogin  = options.last_login || 'Unknown';
        this.dateCreate = options.creation_date || 'Unknown';
        this.dateModif  = options.last_modified || 'Never';
    }
    
	this.isLogged = false;
    
    //check if user is logged In
	if($.cookie("loggedIn")){
		this.isLogged        = true;
		var loggedUser       = JSON.parse($.cookie("loggedIn"));
		this.loggedUserId    = loggedUser.id;
		this.loggedUserName  = loggedUser.name;
		this.loggedUserEmail = loggedUser.email;
		this.loggedUserRole  = loggedUser.role.toUpperCase();
	
		if(loggedUser.role.toLowerCase() === 'admin'){
		    this.isAdmin = true;
		}else{
		    this.isAdmin = false;
		}
	}
	
	this.userList = [];                                                         //Users list
	
}//END User class

//SignIn method
User.prototype.login = function(){
    
    var that = this;                                                            //save login instance, (it will change after receiving data from server)
    
    //Configure request for the server
    var config = {
        
           url: URL_PHP + "login",                                              //PHP API path
        method: "POST",                                                         //Req. method to be used
      dataType: "json",                                                         //Expected response data type
          data: {                                                               //Data for PHP API
                email: this.email,
                 pass: this.pass
          },
        
        //function to be executed in case of req. succeded
        success: function(response){
            
            if(response){
                
                //proccess logged user data
                that.isLogged = response.isLogged || false;
                
                if(response.isLogged === true){
                    that.name = response.name.trim() || response.email.trim() || "anonymus";
                    that.id = response.ID.trim();
                    that.role = response.role.trim();
                }
            }else{
                popUp("error",response.message);
            }
        },
        
        //function to be executed in case of req. fails
        error: function(xhr,status,error){
            popUp("error","Authentication request failed!",xhr.responseText);
        },
        
        //function to be executed when req. is completed
        complete: function(){
           // not used
        }
        
    }; //END Ajax configuration
    
    //signIn method will return the jqXHR object returned by
    //the ajax request
   return $.ajax(config);
   
};//END Login method

//Logout method
User.prototype.logout = function(){
    
    var that = this;                                                            //save current object
    
    //prepare and send request to the server
    return $.ajax({
           url: URL_PHP + "logout",                                             //PHP API path 
        method: "POST",                                                         //Req. method to be used
        
        //function to execute in case of req. succeded
        success: function(response){
            that.success = response.success || false;
            that.message = response.message || "";
        },
        
        //function to execute in case of req. fails
        error: function(xhr,status,error){
            popUp("error","Logout request failed!",xhr.responseText);
        },
        
        //function to execute when req. is completed
        completed: function(){
            //not needed so far
        }
    });
    
}; // END logout method

//Signup Method
User.prototype.signUp = function(user){
    
    //AJAX configuration object
    var config={
        
           url: URL_PHP + "signup",                                             //PHP API path
        method: "POST",                                                         //Eeq. method to be used
          data:{                                                                //Data for PHP API
            first_name: user.firstname,
             last_name: user.name,
                 email: user.email,
                  pass: user.password,
                repass: user.repassword,
             nick_name: user.nickname,
                   age: user.age,
                gender: user.gender
        }
    };
    
    return $.ajax(config);                                                      //send data to the server and return the response
    
};//END signUp function

//UpdateMethod
User.prototype.update = function(userData){
    
    //AJAX req. configuration object
    var config={
        
           url: URL_PHP + "users/update",                                       //PHP API path
        method: "PUT",                                                          //Req. method to be used
          data:{                                                                //data for PHP API
                    id: userData.id,
            first_name: userData.firstname,
             last_name: userData.name,
                 email: userData.email,
             nick_name: userData.nickname,
                   age: userData.age,
                gender: userData.gender
        }
    };
    
    return $.ajax(config); //send data to the server and return the response
    
};//END update function

 //changePassword method
User.prototype.changePassword = function(newPasswords){
    
    //AJAX configuration object
    var config={
           url: URL_PHP + "users/changePassword",                               //PHP API path
        method: "PUT",                                                          //Req. method to be used
          data:{                                                                //Data for PHP API
                 id: this.loggedUserId,
               pass: newPasswords.pass,
            newpass: newPasswords.newpass,
             repass: newPasswords.repass,
        }
    };
    
    return $.ajax(config);                                                      //send data to the server and return the response
    
};//END update function

 //changeRole method
User.prototype.changeRole = function(newRole,markedUserId){
    
    //Ajax configuration object
    var config={
           url: URL_PHP + "users/changeRole",                                   //PHP API path
        method: "PUT",                                                          //Req. method to be used
          data:{                                                                //Data for PHP API
                        id: this.loggedUserId,
              targetUserId: markedUserId,
                      role: newRole
        },
        
         //function to be executed in case of request failure
        error: function(response){
            popUp("error","Oops! Request to change role!",response.responseText);
        }
        
    };
    
    return $.ajax(config);                                                      //send data to the server and return the response
    
};//END changeRole function

//Get all users method
User.prototype.getAll= function(){
    
    var that = this;                                                            //save current User instance
    
    //AJAX configuration object
    var config = {
           url: URL_PHP + "users",                                              //PHP API path
        method: 'GET',                                                          //Req. method to be used
          data:{                                                                //Data for PHP API
              id: this.loggedUserId
          },
        
        //Method executed if request succedded
        success: function(response){
            
            if(response.success === true){
               
               //create user list  
               for(var i=0;i<response[0].length;i++){
                   var user = new User(response[0][i]);
                   that.userList.push(user);
               }
               
            }
            else{
                popUp("error",response.message);
            }
            
        },
        
        //function to be executed in case of request failure
        error: function(response){
            popUp("error","Oops! Request for users failed!",response.responseText);
        }
    };
    
    return $.ajax(config);                                                      //send data to the server and return the result
    
};//END getUserData function

//Get user data method
User.prototype.getUserData = function(userId){
    
    //AJAX configuration object
    var config = {
        
           url: URL_PHP + "users/getUser",                                      //PHP API path
        method: 'GET',                                                          //Req. method to be used
          data:{                                                                //Data for PHP API
             id: userId
          },
        
        //function to be executed in case of request failure
        error: function(response){
            popUp("error","Oops! Request for user data failed!");
        }
    };
    
    return $.ajax(config); //send data to the server and return the result
    
};//END getUserData function

//Delete user method
User.prototype.delete = function(userId){
    
    //AJAX configuration object
    var config = {
        
           url: URL_PHP + "users/delete",                                       //PHP API path
        method: 'DELETE',                                                       //Req. method to be used
          data:{                                                                //Data for PHP API
              id: userId
          },
        
        //function to be executed in case of request failure
        error: function(response){
            popUp("error","Oops! Request to delete user failed!",response.responseText);
        }
    };
    
    return $.ajax(config);                                                      //send data to the server and return the result
    
};//END getUserData function