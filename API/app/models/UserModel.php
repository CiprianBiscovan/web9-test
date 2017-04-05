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
    
    //Update last login or last modified columns
    function updateDateColumns($id, $date){
        
        //Start building query string
        $sql = "UPDATE users SET ";
        
        //check which column needs to be updated and build appropriate query
        if(isset($date['last_login'])){
            $sql .= "last_login = '". $date['last_login'] . "'" ;
        }elseif(isset($date['last_modified'])){
            $sql .= "last_modified = '" . $date['last_modified'] . "'";
        }
        
        //filter user by id
        $sql .= " WHERE id = $id";
        
        //execute query
        $stmt = $this->dbh->prepare($sql);
        $stmt->execute();
    } //END Update last_login/last_modified dates
    
}// END UserModel Class

?>