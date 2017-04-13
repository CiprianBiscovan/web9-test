<?php
require_once "DB.php";

class CommentsModel extends DB{
    
    
    function selectAll(){
        
        // $sql = "SELECT * FROM comments";
        $sql = 'SELECT comm . * , usr.nick_name AS nickname, CONCAT( usr.first_name,  " ", usr.last_name ) AS userName
                FROM comments comm
                INNER JOIN users usr ON comm.user_id = usr.id';
        return $this->selectSQL($sql); 
    }
    
    function insertItem($comm){
        
         $sql = "INSERT INTO comments (title,content,article_id,user_id) VALUES(?,?,?,?)";
         $stmt = $this->dbh->prepare($sql);
         $stmt->execute(array( $comm["title"], $comm["content"], $comm["article_id"],$comm["user_id"] ));
           
         return $this->dbh->lastInsertId();
    }
    function getCommentsForArtID($artId){
        //$sql = 'SELECT * FROM comments WHERE article_id = ?';
         $sql = 'SELECT comm . * , usr.nick_name AS nickname, CONCAT( usr.first_name,  " ", usr.last_name ) AS userName
                FROM comments comm
                INNER JOIN users usr ON comm.user_id = usr.id
                HAVING comm.article_id = ? AND comm.deleted = 0';
         $stmt = $this->dbh->prepare($sql);
         $stmt->execute(array($artId));
         
         return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
      function getComment($commId){
        //$sql = 'SELECT * FROM comments WHERE article_id = ?';
         $sql = 'SELECT comm . * , usr.nick_name AS nickname, CONCAT( usr.first_name,  " ", usr.last_name ) AS userName
                FROM comments comm
                INNER JOIN users usr ON comm.user_id = usr.id
                HAVING comm.id = ? AND comm.deleted = 0';
         $stmt = $this->dbh->prepare($sql);
         $stmt->execute(array($commId));
         
         return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
     function deleteItem($id,$dateModif){
        $sql = 'UPDATE comments SET deleted = 1, last_modified = ? where id = ?';
        $stmt = $this->dbh->prepare($sql);
        $stmt->execute(array($dateModif,$id));
        return array('rowsAffected'=>$stmt->rowCount(),'error'=>$stmt->errorInfo()[1]);    
    }
    
     function updateItem($item){
        $sql = 'UPDATE comments SET title = ?, content = ?, last_modified = ? where id = ?';
        $stmt = $this->dbh->prepare($sql);
        $stmt->execute(array($item['title'],
                              $item['content'],
                              $item['last_modified'],
                              $item['id']));
        return array('rowsAffected'=>$stmt->rowCount(),'error'=>$stmt->errorInfo()[1]);    
    }
}

?>