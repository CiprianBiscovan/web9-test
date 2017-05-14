<?php

 //include file with DB connection
 require_once "DB.php";

//class CategoriesModel
class categoriesModel extends DB{
    
    function selectAll(){
        
        
        $sql = "SELECT * FROM category WHERE active = 1";                       //Build SQL query
        return $this->selectSQL($sql);                                          //execute query and return the result
        
    }//END selectAll function
    
    
    function insertItem($categoryName){
        
       $sql = "INSERT INTO category (name) VALUES(?)";                          //Build SQL query
       
       $stmt = $this->dbh->prepare($sql);                                       //prepare SQL query
       $stmt->execute(array($categoryName));                                    //execute query passing variable
       
       //return the result
       return array("lastInsertedID"=>$this->dbh->lastInsertId(),"error"=>$stmt->errorInfo()[1]);
   
    }//END insetItem function
    
    //reactivate previous deleted/inactivated category
    function reactivateCategory($categoryName,$update){
    
       //Build SQL query
       $sql = "UPDATE category SET active = 1, last_modified = ? WHERE name = ?";
       
       $stmt = $this->dbh->prepare($sql);                                       //prepare SQL query
       $stmt->execute(array($update,$categoryName));                            //execute query passing variable
       
       //return the result
       return array("rowsAffected"=>$stmt->rowCount(),"error"=>$stmt->errorInfo()[1]);
       
    }//END insetItem function
    
    //delete/inactivate  category
    function deleteItem($id,$update){
        
         //Build SQL query
        $sql = "UPDATE category SET active = 0, last_modified = ? WHERE id = ?";
        $stmt = $this->dbh->prepare($sql);                                      //prepare SQL query
        $stmt->execute(array($update,$id));                                     //execute query passing variable
        
        //return the result
        return array('rowsAffected'=>$stmt->rowCount());
       
    }// ENDdeleteItem function
    
}//END CategoriesModel Class

?>