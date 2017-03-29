<?php
require_once "DB.php";

class CommentsModel extends DB{
    
    
    function selectAll(){
        
        $sql = "SELECT * FROM comments";
        return $this->selectSQL($sql); 
    }
    
    function insertComment($comm){
        
         $sql = "INSERT INTO comments (title,content,article_id,user_id) VALUES(?,?,?,?)";
         $stmt = $this->dbh->prepare($sql);
         $stmt->execute(array( $comm["title"], $comm["content"], $comm["article_id"],$comm["user_id"] ));
           
         return $this->dbh->lastInsertId();
    }
    function getCommentsForArtID($artId){
        $sql = 'SELECT * FROM comments WHERE article_id = ?';
         $stmt = $this->dbh->prepare($sql);
         $stmt->execute(array($artId));
         
         return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
     function deleteItem($id){
        $sql = 'delete from comments where id=?';
        $stmt = $this->dbh->prepare($sql);
        $stmt->execute(array($id));
        
        return $stmt->rowCount();    
    }
}

?>