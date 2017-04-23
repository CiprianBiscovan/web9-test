/* global $ URL_PHP*/

//Login CLASS
function User(options){
    if(options){
        this.id = options.id;
        this.firstname = options.first_name;
        this.lastname = options.last_name;
        this.email = options.email;
        this.pass = options.pass;
        this.gender = options.gender;
        this.age = options.age;
        this.nickname = options.nick_name;
        this.role = options.role;
        this.lastLogin = options.last_login || 'Unknown';
        this.dateCreate = options.creation_date || 'Unknown';
        this.dateModif = options.last_modified || 'Never';
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
	
	this.userList = [];
	
}//END User class

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

//logout method
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
    
}; // END logout method

//Signup Method
User.prototype.signUp = function(user){
    
    var config={
        url: URL_PHP + "signup",
        method: "POST",
        data:{
            first_name:user.firstname,
            last_name: user.name,
            email: user.email,
            pass: user.password,
            repass: user.repassword,
            nick_name: user.nickname,
            age: user.age,
            gender: user.gender
        }
    };
    
    return $.ajax(config); //send data tu the server and return the response
    
};//END signUp function

    //UpdateMethod
User.prototype.update = function(userData){
    
    var config={
        url: URL_PHP + "users/update",
        method: "PUT",
        data:{
            id:userData.id,
            first_name:userData.firstname,
            last_name: userData.name,
            email:userData.email,
            nick_name: userData.nickname,
            age: userData.age,
            gender: userData.gender
        }
    };
    
    return $.ajax(config); //send data tu the server and return the response
    
};//END update function

 //changePassword method
User.prototype.changePassword = function(newPasswords){
    
    var config={
        url: URL_PHP + "users/changePassword",
        method: "PUT",
        data:{
            id:this.loggedUserId,
            pass:newPasswords.pass,
            newpass:newPasswords.newpass,
            repass:newPasswords.repass,
        }
    };
    
    return $.ajax(config); //send data tu the server and return the response
    
};//END update function

 //changeRole method
User.prototype.changeRole = function(newRole,markedUserId){
    
    var config={
        url: URL_PHP + "users/changeRole",
        method: "PUT",
        data:{
            id:this.loggedUserId,
            targetUserId:markedUserId,
            role:newRole
        }
    };
    
    return $.ajax(config); //send data tu the server and return the response
    
};//END changeRole function

User.prototype.getAll= function(){
    
    var that = this; //save current User instance
    
    var config = {
        url: URL_PHP + "users",
        method: 'GET',
        data:{
            id: this.loggedUserId
        },
        
        success: function(response){
            if(response.success === true){
               
               for(var i=0;i<response[0].length;i++){
                   var user = new User(response[0][i]);
                   that.userList.push(user);
               }
               
            }
            else{
                console.log(response.message);
            }
            
        },
        
        //function to be executed in case of request failure
        error: function(response){
            console.log(response);
            console.log("Oops! error getting user");
        }
    };
    
    return $.ajax(config); //send data to the server and return the result
    
};//END getUserData function

User.prototype.getUserData = function(userId){
    
    var config = {
        url: URL_PHP + "users/getUser",
        method: 'GET',
        data:{
            id: userId
        },
        
        //function to be executed in case of request failure
        error: function(response){
            console.log(response);
            console.log("Oops! error getting user");
        }
    };
    
    return $.ajax(config); //send data to the server and return the result
    
};//END getUserData function

User.prototype.delete = function(userId){
    
    var config = {
        url: URL_PHP + "users/delete",
        method: 'DELETE',
        data:{
            id: userId
        },
        
        //function to be executed in case of request failure
        error: function(response){
            console.log(response);
            console.log("Oops! error deleting user");
        }
    };
    
    return $.ajax(config); //send data to the server and return the result
    
};//END getUserData function