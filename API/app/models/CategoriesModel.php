<?php

require_once "DB.php";

//class CategoriesModel
class categoriesModel extends DB{
    
    function selectAll(){
        
        $sql = "SELECT * FROM category WHERE active = 1";
        return $this->selectSQL($sql);
        
    }//END selectAll function
    
    
    function insertItem($categoryName){
       $sql = "INSERT INTO category (name) VALUES(?)";
       
       $stmt = $this->dbh->prepare($sql);
       $stmt->execute(array($categoryName));
       
       return array("lastInsertedID"=>$this->dbh->lastInsertId(),"error"=>$stmt->errorInfo()[1]);
    }//END insetItem function
    
    function deleteItem($id){
        $sql = "UPDATE category SET active = 0 WHERE id = ?";
        $stmt = $this->dbh->prepare($sql);
        $stmt->execute(array($id));
        
        return array('rowsAffected'=>$stmt->rowCount());
       
    }// end deleteItem function
    
}//END CategoriesModel Class

?>