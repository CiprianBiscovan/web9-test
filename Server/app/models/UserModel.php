<?php

//import required file for connecting to DB
require_once "DB.php";

//UserModel class
class UserModel extends DB{
    
    //User authentication method
    function authUser($email,$pass){
        
        //select user with email and password supplied from UI
        $sql = "SELECT first_name,last_name,email,id,role FROM users WHERE email = ? AND password=? ";
        $stmt = $this->dbh->prepare($sql);
        $stmt->execute(array($email,$pass));
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
            
    }//END User authentication method
}

?>