<?php

//Import needed file
require "app/models/UserModel.php";

// Accounts class
class Accounts {
    
    private $userModel; 
    private $currentDate;
    
    //Account Class Constructor
    function __construct(){
        $this->userModel = new UserModel(); //create UserModel object
        date_default_timezone_set("Europe/Bucharest");
        $this->currentDate = date("Y-m-d H:i:s");
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
            // if(!isValidEmail($suppliedEmail)){
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
    
    function createAccount(){
    
    if(!isset($_POST['first_name'],$_POST['last_name'],$_POST['email'],$_POST['pass'],$_POST['repass']) || 
    empty($_POST['first_name']) || empty($_POST['last_name']) || empty($_POST['email']) || 
    empty($_POST['pass']) || empty($_POST['repass'])){
        return array("success"=>false,"message"=>"Missing required fileds!");
    }
    
    if(!filter_var($_POST['email'],FILTER_VALIDATE_EMAIL)){
        return array("success"=>false,"message"=>"Email not valid!");
    }
  
    if(strlen($_POST['pass']) < 3){
        return array("success"=>false,"message"=>"Password too short!");
    }
    if($_POST['pass'] !== $_POST['repass']){
        return array("success"=>false,"message"=>"Passwords don`t match!");
    }
    if(!isset($_POST['nick_name']) || empty($_POST['nick_name'])){
        $_POST['nick_name'] = null;
    }
    if(!isset($_POST['age']) || empty($_POST['age']) || !filter_var($_POST['age'],FILTER_VALIDATE_INT,array("options"=>array("min_range"=>1,"max_range"=>150)))){
        $_POST['age'] = null;
    }
    if(!isset($_POST['gender']) || empty($_POST['gender'])){
        $_POST['gender'] = null;
    }
     $_POST['pass'] = crypt($_POST["pass"], PASS_SALT); //crypt supplied password
    
    $dbResult = $this->userModel->createItem($_POST);
    
    if($dbResult['rowsAffected'] == 1){
         return array("success"=>true,"message"=>"Account created!");
    }else{
         return array("success"=>false,"message"=>"Account could not be created!");
    }
    
}//END createAccount

  function updateUser(){
      
    global $REQUEST;
    
    if(!isset($_SESSION['isLogged']) || $_SESSION['isLogged'] === false ) {
        return array("success"=>false,"message"=>"Nobody is Logged In");
    }
    
    if(!isset($REQUEST['id'],$_SESSION['userId']) || empty($REQUEST['id']) || empty($_SESSION['userId']) || $REQUEST['id'] !== $_SESSION['userId'] ){
        return array("success"=>false,"message"=>"Logged User cannot be determined!");
    }
    
    if(!isset($REQUEST['first_name'],$REQUEST['last_name'],$REQUEST['email']) || empty($REQUEST['first_name']) || empty($REQUEST['last_name']) || empty($REQUEST['email'])){
        return array("success"=>false,"message"=>"Missing required fileds!");
    }
     if(!filter_var($REQUEST['email'],FILTER_VALIDATE_EMAIL)){
        return array("success"=>false,"message"=>"Email not valid!");
    }
    if(!isset($REQUEST['nick_name']) || empty($REQUEST['nick_name'])){
        $REQUEST['nick_name'] = null;
    }
    if(!isset($REQUEST['age']) || empty($REQUEST['age']) || !filter_var($REQUEST['age'],FILTER_VALIDATE_INT,array("options"=>array("min_range"=>1,"max_range"=>150)))){
        $REQUEST['age'] = null;
    }
    if(!isset($REQUEST['gender']) || empty($REQUEST['gender'])){
        $REQUEST['gender'] = null;
    }
    $REQUEST['last-modified'] = $this->currentDate;
    $dbResult = $this->userModel->updateItem($REQUEST);
   
    if($dbResult['rowsAffected'] == 1){
         return array("success"=>true,"message"=>"Account updated successfully!");
    }else{
         return array("success"=>false,"message"=>"Account could not be updated!");
    }
    
}//END updateUser

function changePassword(){
      
    global $REQUEST;
    
    if(!isset($_SESSION['isLogged']) || $_SESSION['isLogged'] === false ) {
        return array("success"=>false,"message"=>"Nobody is Logged In");
    }
    
    if(!isset($REQUEST['id'],$_SESSION['userId']) || empty($REQUEST['id']) || empty($_SESSION['userId']) || $REQUEST['id'] !== $_SESSION['userId'] ){
        return array("success"=>false,"message"=>"Logged User cannot be determined!");
    }
    
    if(!isset($REQUEST['pass'],$REQUEST['newpass'],$REQUEST['repass']) || empty($REQUEST['pass']) || empty($REQUEST['newpass']) || empty($REQUEST['repass']) ){
        return array("success"=>false,"message"=>"Missing required fileds!");
    }
     if(strlen($REQUEST['pass']) < 3){
       return array("success"=>false,"message"=>"Current password too short!");
    }
    if(strlen($REQUEST['newpass']) < 3){
       return array("success"=>false,"message"=>"New password too short!");
    }
    if($REQUEST['newpass'] !== $REQUEST['repass']){
       return array("success"=>false,"message"=>"Passwords mismatch!");
    }
    $REQUEST['newpass'] = crypt($REQUEST["newpass"], PASS_SALT); //crypt supplied new password
    $REQUEST['pass'] = crypt($REQUEST["pass"], PASS_SALT); //crypt supplied current password
    $REQUEST['last_modified'] = $this->currentDate;
    $dbResult = $this->userModel->updatePassword($REQUEST);
    
    if($dbResult['rowsAffected'] == 1){
         return array("success"=>true,"message"=>"Password changed successfully!");
    }else{
         return array("success"=>false,"message"=>"Password could not be changed!");
    }
    
}//END changePassword

function changeRole(){
      
    global $REQUEST;
    
    if(!isset($_SESSION['isLogged']) || $_SESSION['isLogged'] === false ) {
        return array("success"=>false,"message"=>"Nobody is Logged In");
    }
    
    if(!isset($REQUEST['id'],$_SESSION['userId'],$_SESSION['role']) || empty($REQUEST['id']) || empty($_SESSION['userId']) || $REQUEST['id'] !== $_SESSION['userId'] ){
        return array("success"=>false,"message"=>"Logged User cannot be determined!");
    }
    if($_SESSION['role'] !== 'admin'){
        return array("success"=>false,"message"=>"Only admin can change roles!");
    }
    if(!isset($REQUEST['targetUserId'],$REQUEST['role']) || empty($REQUEST['targetUserId']) || empty($REQUEST['role'])){
        return array("success"=>false,"message"=>"Missing required fileds!");
    }
    
    if($REQUEST['role'] !== 'admin' && $REQUEST['role'] !== 'user' ){
       return array("success"=>false,"message"=>"New role is not valid!");
    }
    
    $REQUEST['last_modified'] = $this->currentDate;
    $dbResult = $this->userModel->updateRole($REQUEST);
    
    if($dbResult['rowsAffected'] == 1){
         return array("success"=>true,"message"=>"role changed successfully!");
    }else{
         return array("success"=>false,"message"=>"role could not be changed!");
    }
    
}//END updateUser


function getUser(){
    
    if(!isset($_SESSION['isLogged']) || $_SESSION['isLogged'] === false ){
        return array("success"=>false,"message"=>"Nobody is logged In!");
    }
    if(!isset($_GET['id'],$_SESSION['userId']) || empty($_GET['id']) || empty($_SESSION['userId']) || $_GET['id'] !== $_SESSION['userId']){
        return array("success"=>false,"message"=>"Logged user could not be determined !");
    }
    
    $dbResult = $this->userModel->getUser($_SESSION['userId']);
    
    if($dbResult){
        return array("success"=>true,$dbResult);
    }else{
        return array("success"=>false,"message"=>"User not found");
    }
    
    
}//END getUser function

function getAll(){
    
    if(!isset($_SESSION['isLogged']) || $_SESSION['isLogged'] === false ){
        return array("success"=>false,"message"=>"Nobody is logged In!");
    }
    if(!isset($_GET['id'],$_SESSION['userId']) || empty($_GET['id']) || empty($_SESSION['userId']) || $_GET['id'] !== $_SESSION['userId']){
        return array("success"=>false,"message"=>"Logged user could not be determined !");
    }
    
    if($_SESSION['isLogged'] === true && isset($_SESSION['role']) && $_SESSION['role'] === 'admin'){
        
        $dbResult = $this->userModel->selectAll();
        
        if($dbResult){
            return array("success"=>true,$dbResult);
        }else{
            return array("success"=>false,"message"=>"Users not found");
        }
    }else{
        return array("success"=>false,"message"=>"Only admin can access all users accounts!");
    }
    
    
}//END getUser function

function deleteUser(){
     global $REQUEST;
    if(!isset($_SESSION['isLogged'],$_SESSION['role'],$_SESSION['userId']) || $_SESSION['isLogged'] === false ){
        return array("success"=>false,"message"=>"You have to be logged in to delete your account!");
    }
    if(!isset($REQUEST['id'],$_SESSION['userId']) || empty($REQUEST['id']) || empty($_SESSION['userId'])){
        return array("success"=>false,"message"=>"Missing user ID !");
    }
     
    if($REQUEST['id'] === $_SESSION['userId'] &&  $_SESSION['role'] === 'admin' && $_SESSION['isLogged'] === true){
        return array("success"=>false,"message"=>"Admin cannot delete it`s own account");
    }
    
    if($REQUEST['id'] === $_SESSION['userId'] || $_SESSION['role'] === 'admin' && $_SESSION['isLogged'] === true){
        
        $dbResult = $this->userModel->deleteItem($REQUEST['id']);
        
        if($dbResult['rowsAffected'] == 1){
            return array("success"=>true,"message"=>"User deleted successfully");
        }else{
            return array("success"=>false,"message"=>"User not found");
        }
        
    }else{
        return array("success"=>false,"message"=>"Only Administrator can delete other people accounts!");
    }
    
    
}//END deleteUser function

    
} //END ACCOUNTS Class  


?>