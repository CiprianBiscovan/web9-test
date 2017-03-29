<?php

//Import needed file
require "app/models/UserModel.php";

// Accounts class
class Accounts {
    
    private $userModel; 
    
    //Account Class Constructor
    function __construct(){
        $this->userModel = new UserModel(); //create UserModel object
    }
    
    //Login method
    function login(){
        
        //Check for required data: email and password
        if(!empty($_POST["email"]) && !empty($_POST["pass"])){
            
            $pass = crypt($_POST["pass"], PASS_SALT); //crypt supplied password
        
            $user = $this->userModel->authUser($_POST["email"],$pass); //Authenticate user
           
            //if email/password pair is returned from DB the user is authenticated and loggedIn 
            if(is_array($user) and count($user) > 0){
                
                $_SESSION['isLogged'] = true;
                $_SESSION['Name'] = trim($user['first_name']) . " " . trim($user['last_name']);
                $_SESSION['userId'] = trim($user['id']);
                return array("isLogged"=>$_SESSION['isLogged'], "status"=>"Logged in", "name"=>$_SESSION['Name'], "ID"=>$_SESSION['userId'],"email"=>trim($user['email']),"role"=>trim($user['role']));
                
            }
            //If no email/password pair is found, user is not authenticated and warrned about this situation
            else{
                return array("isLogged"=>FALSE,'status'=>"Invalid credentials!");
            }
        }
        //If no data is send from UI 
        else{
                return array("isLogged"=>FALSE,'status'=>"Empty credentials");
        }
        
    }//End LOGIN method
    
    //Logout method
    function logout(){
        //unset everything and destroy session
        unset($_SESSION['isLogged']);
        unset($_SESSION['Name']);
        unset($_SESSION['userId']);
        session_destroy();
        
        return array("success"=>TRUE);
    }//END Logout method
}
?>