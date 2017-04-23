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
    
    function createItem($item){
        
        $sql = "CALL createAccount(?,?,?,?,?,?,?)";
        $stmt = $this->dbh->prepare($sql);
        $stmt->execute(array($item['first_name'],
                             $item['last_name'],
                             $item['email'],
                             $item['pass'],
                             $item['nick_name'],
                             $item['age'],
                             $item['gender']));
        return array("rowsAffected"=>$stmt->rowCount(),"error"=>$stmt->errorInfo());
        
    }//END createItem function
    
    function getUser($id){
        $sql = "SELECT id,first_name,last_name,email,gender,age,role,nick_name,last_login,creation_date,last_modified FROM users WHERE id = ?";
        $stmt = $this->dbh->prepare($sql);
        $stmt->execute(array($id));
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }//END getUser fucntion
    
    function selectALl(){
        $sql = "SELECT id,first_name,last_name,email,gender,age,role,nick_name,last_login,creation_date,last_modified FROM users";
        $stmt = $this->dbh->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }//END getAll function
    
    function updateItem($item){
        $sql = "UPDATE users SET first_name=?, last_name=?, email=?, nick_name=?,age=?,gender=?, last_modified=? WHERE id=?";
        $stmt = $this->dbh->prepare($sql);
         $stmt->execute(array($item['first_name'],
                             $item['last_name'],
                             $item['email'],
                             $item['nick_name'],
                             $item['age'],
                             $item['gender'],
                             $item['last-modified'],
                             $item['id']
                             ));
        return array("rowsAffected"=>$stmt->rowCount(),"error"=>$stmt->errorInfo());
    }
    
     function updatePassword($item){
        $sql = "UPDATE users SET password=?, last_modified=? WHERE id=? AND password=?";
        $stmt = $this->dbh->prepare($sql);
         $stmt->execute(array($item['newpass'],
                             $item['last_modified'],
                             $item['id'],
                             $item['pass']
                             ));
                           
        return array("rowsAffected"=>$stmt->rowCount(),"error"=>$stmt->errorInfo());
    }
    
     function updateRole($item){
        $sql = "UPDATE users SET role=?, last_modified=? WHERE id=?";
        $stmt = $this->dbh->prepare($sql);
         $stmt->execute(array($item['role'],
                             $item['last_modified'],
                             $item['targetUserId'],
                             ));
                           
        return array("rowsAffected"=>$stmt->rowCount(),"error"=>$stmt->errorInfo());
    }
    
      function deleteItem($item){
        $sql = "DELETE FROM users WHERE id=?";
        $stmt = $this->dbh->prepare($sql);
        $stmt->execute(array($item));
                    
        return array("rowsAffected"=>$stmt->rowCount(),"error"=>$stmt->errorInfo());
    }
    
}// END UserModel Class

?>