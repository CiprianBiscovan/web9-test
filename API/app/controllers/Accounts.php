<?php

//Import needed file
require "app/models/UserModel.php";

// Accounts class
class Accounts {
    
    //Acounts properties
    private $userModel; 
    private $currentDate;
    
    //Accounts Class Constructor
    function __construct(){
        $this->userModel = new UserModel();                                     //create UserModel object and assign it to userModel property
        date_default_timezone_set("Europe/Bucharest");                          //set default timezone
        $this->currentDate = date("Y-m-d H:i:s");                               // initialize currentDate property with current date and time
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
            
            if(!filter_var($suppliedEmail,FILTER_VALIDATE_EMAIL)){
                return array("isLogged"=>FALSE,'message'=>"Email not valid!");
            }
            
            //check password
            if(empty($suppliedPass)){
                  return array("isLogged"=>FALSE,'message'=>"Empty password!");
            }
            if(strlen($suppliedPass) < 3){
                  return array("isLogged"=>FALSE,'message'=>"Password too short!");
            }
            
            $pass = crypt($_POST["pass"], PASS_SALT);                           //crypt supplied password
            
            $user = $this->userModel->authUser($_POST["email"],$pass);          //Authenticate user
           
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
    
    //Create account Method
    function createAccount(){
    
        //check if required fields were received from UI
        if(!isset($_POST['first_name'],$_POST['last_name'],$_POST['email'],$_POST['pass'],$_POST['repass']) || 
           empty($_POST['first_name']) || empty($_POST['last_name']) || empty($_POST['email']) || 
           empty($_POST['pass']) || empty($_POST['repass'])){
        
            return array("success"=>false,"message"=>"Missing required fileds!");
        }
    
        //validate email address
        if(!filter_var($_POST['email'],FILTER_VALIDATE_EMAIL)){
            return array("success"=>false,"message"=>"Email not valid!");
        }
    
        //check password
        if(strlen($_POST['pass']) < 3){
            return array("success"=>false,"message"=>"Password too short!");
        }
    
        //compare pass and repass
        if($_POST['pass'] !== $_POST['repass']){
            return array("success"=>false,"message"=>"Passwords don`t match!");
        }
    
        //check nickname and set it to null if it was not provided
        if(!isset($_POST['nick_name']) || empty(trim($_POST['nick_name'])) || strlen($_POST['nick_name']) !== strlen(trim($_POST['nick_name'])) ){
            $_POST['nick_name'] = null;
        }
    
        //check age and set it to null if not provided
        if(!isset($_POST['age']) || empty($_POST['age']) || !filter_var($_POST['age'],FILTER_VALIDATE_INT,array("options"=>array("min_range"=>1,"max_range"=>150)))){
            $_POST['age'] = null;
        }
    
        //check age and set it to null if not provided
        if(!isset($_POST['gender']) || empty($_POST['gender'])){
            $_POST['gender'] = null;
        }
         $_POST['pass'] = crypt($_POST["pass"], PASS_SALT);                         //crypt supplied password
    
        $dbResult = $this->userModel->createItem($_POST);                           //call createItem function to create account in DB
    
        //proccess DB response
        if($dbResult['rowsAffected'] == 1){
            return array("success"=>true,"message"=>"Account created!");
        }else  if($dbResult['rowsAffected'] == 0){
            return array("success"=>false,"message"=>"Account could not be created!","responseText"=>$dbResult['error']);
        }else{
            return array("success"=>false,"message"=>"Something very bad happend.Probably more than 1 account was deleted!");
        }
    
    }//END createAccount
  
    //Update user Method  
    function updateUser(){
      
        global $REQUEST;
    
        //check if somebody is logged in
        if(!isset($_SESSION['isLogged']) || $_SESSION['isLogged'] === false ) {
            return array("success"=>false,"message"=>"Nobody is Logged In");
        }
    
         //check if logged user on server is the same as logged user in coockies
        if(!isset($REQUEST['id'],$_SESSION['userId']) || empty($REQUEST['id']) || empty($_SESSION['userId']) || $REQUEST['id'] !== $_SESSION['userId'] ){
            return array("success"=>false,"message"=>"Logged User cannot be determined!");
        }
    
        //check if required fields were provided
        if(!isset($REQUEST['first_name'],$REQUEST['last_name'],$REQUEST['email']) || empty($REQUEST['first_name']) || empty($REQUEST['last_name']) || empty($REQUEST['email'])){
            return array("success"=>false,"message"=>"Missing required fields!");
        }
    
        //validate email address
        if(!filter_var($REQUEST['email'],FILTER_VALIDATE_EMAIL)){
            return array("success"=>false,"message"=>"Email not valid!");
        }
    
        //check nickname and set it to  null if it was not provided
        if(!isset($REQUEST['nick_name']) || empty($REQUEST['nick_name'])){
            $REQUEST['nick_name'] = null;
        }
    
        //check age and set it to  null if is not valid
        if(!isset($REQUEST['age']) || empty($REQUEST['age']) || !filter_var($REQUEST['age'],FILTER_VALIDATE_INT,array("options"=>array("min_range"=>1,"max_range"=>150)))){
            $REQUEST['age'] = null;
        }
        
        //check gender and set it to  null if it was not provided
        if(!isset($REQUEST['gender']) || empty($REQUEST['gender'])){
            $REQUEST['gender'] = null;
        }
    
     
        $REQUEST['last-modified'] = $this->currentDate;                             //create last-modified field and assign current date to it
      
        $dbResult = $this->userModel->updateItem($REQUEST);                         //call update function which provide DB access
   
        //porcess DB response   
        if($dbResult['rowsAffected'] == 1){
             return array("success"=>true,"message"=>"Account updated successfully!");
        }else if($dbResult['rowsAffected'] == 0){
             return array("success"=>false,"message"=>"Account could not be updated!","error"=>$dbResult['error']);
        }else{
             return array("success"=>false,"message"=>"Something very bad happend.Probably more than 1 user was updated!");
        }
    
    }//END updateUser

    //Change password Method 
    function changePassword(){
      
        global $REQUEST;
    
        //check if someone is lgged in
        if(!isset($_SESSION['isLogged']) || $_SESSION['isLogged'] === false ) {
            return array("success"=>false,"message"=>"Nobody is Logged In");
        }
    
        //check if logged user on server is the same as logged user in coockies
        if(!isset($REQUEST['id'],$_SESSION['userId']) || empty($REQUEST['id']) || empty($_SESSION['userId']) || $REQUEST['id'] !== $_SESSION['userId'] ){
            return array("success"=>false,"message"=>"Logged User cannot be determined!");
        }
    
        //check if required fields are received from UI
        if(!isset($REQUEST['pass'],$REQUEST['newpass'],$REQUEST['repass']) || empty($REQUEST['pass']) || 
           empty($REQUEST['newpass']) || empty($REQUEST['repass']) ){
        
            return array("success"=>false,"message"=>"Missing required fileds!");
        }
    
        //validate password
        if(strlen($REQUEST['pass']) < 3){
            return array("success"=>false,"message"=>"Current password too short!");
        }
        if(strlen($REQUEST['newpass']) < 3){
            return array("success"=>false,"message"=>"New password too short!");
        }
        if($REQUEST['newpass'] !== $REQUEST['repass']){
            return array("success"=>false,"message"=>"Passwords mismatch!");
        }
    
    
        $REQUEST['newpass'] = crypt($REQUEST["newpass"], PASS_SALT);                //crypt supplied new password
        $REQUEST['pass'] = crypt($REQUEST["pass"], PASS_SALT);                      //crypt supplied current password
        $REQUEST['last_modified'] = $this->currentDate;                             //create last-modified field and assign current date to it
        $dbResult = $this->userModel->updatePassword($REQUEST);                     //call update password function which provides access to DB
    
        //Proccess DB response
        if($dbResult['rowsAffected'] == 1){
             return array("success"=>true,"message"=>"Password changed successfully!");
        }else if($dbResult['rowsAffected'] == 0){
             return array("success"=>false,"message"=>"Password could not be changed!","error"=>$dbResult['error']);
        }else{
            return array("success"=>false,"message"=>"Something very bad happend.Probably more than 1 passwords changed!");
        }
    
    }//END changePassword

    //Change user role method
    function changeRole(){
      
        global $REQUEST;
    
        //check if anybody is logged in
        if(!isset($_SESSION['isLogged']) || $_SESSION['isLogged'] === false ) {
            return array("success"=>false,"message"=>"Nobody is Logged In");
        }
    
        //check if logged user on server is the same as logged user in coockies
        if(!isset($REQUEST['id'],$_SESSION['userId'],$_SESSION['role']) || empty($REQUEST['id']) || 
            empty($_SESSION['userId']) || $REQUEST['id'] !== $_SESSION['userId'] ){
                return array("success"=>false,"message"=>"Logged User cannot be determined!");
        }
    
        //check if logged user is admin
        if($_SESSION['role'] !== 'admin'){
            return array("success"=>false,"message"=>"Only admin can change roles!");
        }
    
        //check if all required fields was provided from UI
        if(!isset($REQUEST['targetUserId'],$REQUEST['role']) || empty($REQUEST['targetUserId']) || empty($REQUEST['role'])){
            return array("success"=>false,"message"=>"Missing required fileds!");
        }
    
        //check new role
        if($REQUEST['role'] !== 'admin' && $REQUEST['role'] !== 'user' ){
            return array("success"=>false,"message"=>"New role is not valid!");
        }
    
        $REQUEST['last_modified'] = $this->currentDate;                             //create last-modified field and assign current date to it
        $dbResult = $this->userModel->updateRole($REQUEST);                         //call update role method which provides access to DB
    
        //process DB response
        if($dbResult['rowsAffected'] == 1){
             return array("success"=>true,"message"=>"Role changed successfully!");
        }else if($dbResult['rowsAffected'] == 0){
             return array("success"=>false,"message"=>"Role could not be changed!","error"=>$dbResult['error']);
        }else{
             return array("success"=>false,"message"=>"Something bad happend.Probably more than 1 Role changed!");
        }
    
    }//END updateUser

    //Get user method
    function getUser(){
    
        //check if anybody is logged in
        if(!isset($_SESSION['isLogged']) || $_SESSION['isLogged'] === false ){
            return array("success"=>false,"message"=>"Nobody is logged In!");
        }
    
        //check if logged user on server is the same as logged user in coockies
        if(!isset($_GET['id'],$_SESSION['userId']) || empty($_GET['id']) || empty($_SESSION['userId']) || $_GET['id'] !== $_SESSION['userId']){
            return array("success"=>false,"message"=>"Logged user could not be determined !");
        }
    
        $dbResult = $this->userModel->getUser($_SESSION['userId']);                 //call getUser method which get user from database
    
        //check data and send it to UI
        if($dbResult){
            return array("success"=>true,$dbResult);
        }else{
            return array("success"=>false,"message"=>"User not found");
        }
    
    }//END getUser function

    //get all users from DB
    function getAll(){
    
        //check if somebody is logged in
        if(!isset($_SESSION['isLogged']) || $_SESSION['isLogged'] === false ){
            return array("success"=>false,"message"=>"Nobody is logged In!");
        }
    
        //check if logged user on server is the same as logged user from coockies
        if(!isset($_GET['id'],$_SESSION['userId']) || empty($_GET['id']) || empty($_SESSION['userId']) || $_GET['id'] !== $_SESSION['userId']){
            return array("success"=>false,"message"=>"Logged user could not be determined !");
        }
    
        //check if logged user is admin
        if($_SESSION['isLogged'] === true && isset($_SESSION['role']) && $_SESSION['role'] === 'admin'){
        
            $dbResult = $this->userModel->selectAll();                              //call selectAll method which get users from DB
        
            //check data and send it to UI 
            if($dbResult){
                return array("success"=>true,$dbResult);
            }else{
                return array("success"=>false,"message"=>"Users not found");
            }
        }else{
            return array("success"=>false,"message"=>"Only admin can access all users accounts!");
        }
    
    }//END getUser function

    //delete uswer method
    function deleteUser(){
    
        global $REQUEST;
     
        //check if user is logged in 
        if(!isset($_SESSION['isLogged'],$_SESSION['role'],$_SESSION['userId']) || $_SESSION['isLogged'] === false ){
            return array("success"=>false,"message"=>"You have to be logged in to delete your account!");
        }
    
        //check if required fields were sent from UI
        if(!isset($REQUEST['id'],$_SESSION['userId']) || empty($REQUEST['id']) || empty($_SESSION['userId'])){
            return array("success"=>false,"message"=>"Missing user ID !");
        }
     
         //check if admin tries to delete his own account - risk of loosing controll of site 
        if($REQUEST['id'] === $_SESSION['userId'] &&  $_SESSION['role'] === 'admin' && $_SESSION['isLogged'] === true){
            return array("success"=>false,"message"=>"Admin cannot delete it`s own account");
        }
    
        //check logged user consistency and if admin is logged in
        if($REQUEST['id'] === $_SESSION['userId'] || $_SESSION['role'] === 'admin' && $_SESSION['isLogged'] === true){
        
            $dbResult = $this->userModel->deleteItem($REQUEST['id']);               //call deleteItem method which delete user from DB
        
            //Proccess response from DB
            if($dbResult['rowsAffected'] == 1){
                return array("success"=>true,"message"=>"User deleted successfully");
            }else if($dbResult['rowsAffected'] == 0){
                return array("success"=>false,"message"=>"User not found","error"=>$dbResult['error']);
            }else{
                 return array("success"=>false,"message"=>"Something very abd happend.Probably more than 1 user deleted!");
            }
        
        }else{
            return array("success"=>false,"message"=>"Only Administrator can delete other people accounts!");
        }
    
    
    }//END deleteUser function

    
} //END ACCOUNTS Class  


?>