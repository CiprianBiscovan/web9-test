<?php

//import required file for connecting to DB
require_once "DB.php";

//UserModel class
class UserModel extends DB{
    
    //User authentication method
    function authUser($email,$pass){
        
        //select user with email and password supplied from UI
        $sql = "SELECT first_name,last_name,email,id,role FROM users WHERE email = ? AND password=? ";
        
        $stmt = $this->dbh->prepare($sql);                                      //prepare SQL query
        $stmt->execute(array($email,$pass));                                    //execute SQL query passing variables
        
        return $stmt->fetch(PDO::FETCH_ASSOC);                                  //return result
            
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
        
        //call stored procedure for creating account 
        $sql = "CALL createAccount(?,?,?,?,?,?,?)";
        
        $stmt = $this->dbh->prepare($sql);                                      //prepare SQL query  
         
        $stmt->execute(array($item['first_name'],                               //execute query passing variables
                             $item['last_name'],
                             $item['email'],
                             $item['pass'],
                             $item['nick_name'],
                             $item['age'],
                             $item['gender']));
        
        //return result                     
        return array("rowsAffected"=>$stmt->rowCount(),"error"=>$stmt->errorInfo());
        
    }//END createItem function
    
    //get user method
    function getUser($id){
        
        //Build SQL query
        $sql = "SELECT id,first_name,last_name,email,gender,age,role,nick_name,last_login,creation_date,last_modified FROM users WHERE id = ?";
        
        $stmt = $this->dbh->prepare($sql);                                      //prepare SQL query
        $stmt->execute(array($id));                                             //execute query passing variable
        
        return $stmt->fetch(PDO::FETCH_ASSOC);                                  //return result
        
    }//END getUser function
    
    //select all users
    function selectALl(){
        
        //Build SQL query
        $sql = "SELECT id,first_name,last_name,email,gender,age,role,nick_name,last_login,creation_date,last_modified FROM users";
        
        $stmt = $this->dbh->prepare($sql);                                      //prepare SQL query
        $stmt->execute();                                                       //execute query
        return $stmt->fetchAll(PDO::FETCH_ASSOC);                               //return result
        
    }//END getAll function
    
    //update user info
    function updateItem($item){
        
        //Build SQL query
        $sql = "UPDATE users SET first_name=?, last_name=?, email=?, nick_name=?,age=?,gender=?, last_modified=? WHERE id=?";
        
        $stmt = $this->dbh->prepare($sql);                                      //prepare query 
        $stmt->execute(array($item['first_name'],                               //execute query passing variables
                             $item['last_name'],
                             $item['email'],
                             $item['nick_name'],
                             $item['age'],
                             $item['gender'],
                             $item['last-modified'],
                             $item['id']
                             ));
        //return result                     
        return array("rowsAffected"=>$stmt->rowCount(),"error"=>$stmt->errorInfo());
    
        
    }//END updteItem method
    
    //update password method
    function updatePassword($item){
        
        //Build SQL query
        $sql = "UPDATE users SET password=?, last_modified=? WHERE id=? AND password=?";
        
        $stmt = $this->dbh->prepare($sql);                                      //prepare SQL query
        $stmt->execute(array($item['newpass'],                                  //execute SQL query
                             $item['last_modified'],
                             $item['id'],
                             $item['pass']
                             ));
        //return result                   
        return array("rowsAffected"=>$stmt->rowCount(),"error"=>$stmt->errorInfo());
    
    }//END upate password function
    
    //update role method
    function updateRole($item){
        
        //Build SQL query
        $sql = "UPDATE users SET role=?, last_modified=? WHERE id=?";
        
        $stmt = $this->dbh->prepare($sql);                                      //prepare sql query
        $stmt->execute(array($item['role'],                                     //execute sql query passing variables
                             $item['last_modified'],
                             $item['targetUserId'],
                             ));
        //return result                   
        return array("rowsAffected"=>$stmt->rowCount(),"error"=>$stmt->errorInfo());
    
        
    }//END updateRole method
    
    //delete item method
    function deleteItem($item){
        
        //Build SQL query
        $sql = "DELETE FROM users WHERE id=?";
        
        $stmt = $this->dbh->prepare($sql);                                      //prepare SQL query
        $stmt->execute(array($item));                                           //execute query
        
        //return result            
        return array("rowsAffected"=>$stmt->rowCount(),"error"=>$stmt->errorInfo());
    
        
    }//END delete item
    
}// END UserModel Class

?>