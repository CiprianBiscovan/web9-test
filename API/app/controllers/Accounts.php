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
            
            //Get user input received from Javascript
            $suppliedEmail = $_POST["email"];
            $suppliedPass = $_POST["pass"];
            
            //check email
            if(empty($suppliedEmail)){
                   return array("isLogged"=>FALSE,'message'=>"Empty email!"); 
            }
            if(!isValidEmail($suppliedEmail)){
                return array("isLogged"=>FALSE,'message'=>"Email not valid!");
            }
            
            //check password
            if(empty($suppliedPass)){
                  return array("isLogged"=>FALSE,'message'=>"Empty password!");
            }
            if(strlen($suppliedPass) < 3){
                  return array("isLogged"=>FALSE,'message'=>"Password too short!");
            }
            
            $pass = crypt($_POST["pass"], PASS_SALT); //crypt supplied password
            
            $user = $this->userModel->authUser($_POST["email"],$pass); //Authenticate user
           
            //if email/password pair is returned from DB the user is authenticated and loggedIn 
            if(is_array($user) and count($user) > 0){
                
                //update last login time
                date_default_timezone_set("Europe/Bucharest");
                $this->userModel->updateDateColumns($user['id'],array('last_login'=>date("Y-m-d H:i:s")));
                
                //prepare and send data to UI
                $_SESSION['isLogged'] = true;
                $_SESSION['Name'] = trim($user['first_name']) . " " . trim($user['last_name']);
                $_SESSION['userId'] = trim($user['id']);
                $_SESSION['role'] = trim($user['role']);
                return array("isLogged"=>$_SESSION['isLogged'], "message"=>"Logged in", "name"=>$_SESSION['Name'], "ID"=>$_SESSION['userId'],"email"=>trim($user['email']),"role"=>trim($user['role']));
                
            }
            //If no email/password pair is found, user is not authenticated
            else{
                return array("isLogged"=>FALSE,'message'=>"Invalid credentials!");
            }
        }
        //If no data is received from UI 
        else{
                return array("isLogged"=>FALSE,'message'=>"Empty credentials");
        }
        
    }//End LOGIN method
    
    //Logout method
    function logout(){
        
        //Check if any user is logged in
        if(!isset($_SESSION['isLogged']) || $_SESSION['isLogged'] == false){
            return array("success"=>TRUE,"message"=>"Nobody is logged In!");
        }
        
        //unset everything and destroy session
        unset($_SESSION['isLogged']);
        unset($_SESSION['Name']);
        unset($_SESSION['userId']);
        unset($_SESSION['role']);
        session_destroy();
        
        return array("success"=>TRUE);
        
    }//END Logout method
    
} //END ACCOUNTS Class  

    //Function to validate email using regex
    function isValidEmail($email){
        $regEx = '/^[a-z]{1}(?!.*(\.\.|\.@))[a-z0-9!#$%&*+\/=?_{|}~.-]{0,63}@(?=.{0,253}$)([a-z0-9]\.|[a-z0-9][a-z0-9-]{0,63}[a-z0-9]\.)+[a-z0-9]{1,63}$/mi';
        return preg_match($regEx,$email);
    }//END isValidEmail fuction
?>