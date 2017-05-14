<?php
//import required file for connecting to DB
require_once "DB.php";

//Messages class
class Messages extends DB{
    
    //save message method
    function saveMessage($item){
        
        //Build SQL query
        $sql = "INSERT INTO messages (name, email, phone, subject, message) VALUES (?,?,?,?,?) ";
        
        $stmt = $this->dbh->prepare($sql);                                      //prepare SQL query
        $stmt->execute(array($item['name'],                                     //execute query passing variables
                             $item['email'],
                             $item['phone'],
                             $item['subject'],
                             $item['message']
                       ));
        
        //return result               
        return array("rowsAffected"=>$stmt->rowCount(),"error"=>$stmt->errorInfo()); 
        
    }
    
}//END class
?>