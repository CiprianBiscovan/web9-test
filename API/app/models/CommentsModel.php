<?php
//include file with DB connection
require_once "DB.php";

// CommentsModel Class
class CommentsModel extends DB{
    
    //select all comments from DB
    function selectAll(){
        
        //Build SQL query
        $sql = 'SELECT comm . * , usr.nick_name AS nickname, CONCAT( usr.first_name,  " ", usr.last_name ) AS userName
                FROM comments comm
                INNER JOIN users usr ON comm.user_id = usr.id';
        
        return $this->selectSQL($sql);                                          //execute query and return the result
    }//END selectAll method
    
    //insert comment method
    function insertItem($comm){
        
        //Build SQL query
        $sql = "INSERT INTO comments (title,content,article_id,user_id) VALUES(?,?,?,?)";
        
        $stmt = $this->dbh->prepare($sql);                                      //prepare SQL query
        
        $stmt->execute(array( $comm["title"],                                   //execute query passing variables
                              $comm["content"], 
                              $comm["article_id"],
                              $comm["user_id"] ));
           
         return $this->dbh->lastInsertId();                                     //return the result
    }
    
    //get comments for article
    function getCommentsForArtID($artId,$pageNum,$pageSize){
        
        //Build SQL query
        $sql = 'SELECT comm . * , usr.nick_name AS nickname, CONCAT( usr.first_name,  " ", usr.last_name ) AS userName
                FROM comments comm
                INNER JOIN users usr ON comm.user_id = usr.id
                HAVING comm.article_id = ? AND comm.deleted = 0
                ORDER BY creation_date ASC';
         $sql .= ' LIMIT ' . (($pageNum-1) * $pageSize) . "," . $pageSize;      //apply limit to select current page of comments      
         $stmt = $this->dbh->prepare($sql);                                     //prepare query
         $stmt->execute(array($artId));                                         //execute query passing variable
         
         return $stmt->fetchAll(PDO::FETCH_ASSOC);                              // return result
    }
    
    // get number of comments
    function countComments($artId){
        
        //Build SQL query
         $sql = 'SELECT count(id) AS totalComments FROM comments comm WHERE comm.article_id = ? AND comm.deleted = 0';
         
         $stmt = $this->dbh->prepare($sql);                                     //prepare SQL query
         $stmt->execute(array($artId));                                         //execute SQL query
         
         return $stmt->fetchAll(PDO::FETCH_ASSOC);                              //return result

    }//END countComments method
    
    function getComment($commId){
     
         //Build SQL comment
         $sql = 'SELECT comm . * , usr.nick_name AS nickname, CONCAT( usr.first_name,  " ", usr.last_name ) AS userName
                FROM comments comm
                INNER JOIN users usr ON comm.user_id = usr.id
                HAVING comm.id = ? AND comm.deleted = 0';
         
         $stmt = $this->dbh->prepare($sql);                                     //prepare SQL query
         $stmt->execute(array($commId));                                        //execute query passing variable
         
         return $stmt->fetchAll(PDO::FETCH_ASSOC);                              //return result
         
    }//END getComment method
    
    //delete comments method
    function deleteItem($id,$dateModif){
        //Build SQL query
        $sql = 'UPDATE comments SET deleted = 1, last_modified = ? where id = ?';
        
        $stmt = $this->dbh->prepare($sql);                                      //prepare SQL query
        $stmt->execute(array($dateModif,$id));                                  //execute SQL query
        
        //return result
        return array('rowsAffected'=>$stmt->rowCount(),'error'=>$stmt->errorInfo()[1]);    
        
    }//END deleteItem method
    
    //Update comment method
    function updateItem($item){
        
        //Build SQL query
        $sql = 'UPDATE comments SET title = ?, content = ?, last_modified = ? where id = ?';
        
        $stmt = $this->dbh->prepare($sql);                                      //prepare SQL Query
        $stmt->execute(array($item['title'],                                    //execute SQL query passing variables
                              $item['content'],
                              $item['last_modified'],
                              $item['id']));
                              
        //return result
        return array('rowsAffected'=>$stmt->rowCount(),'error'=>$stmt->errorInfo()[1]);    
    
    }//END upateItem method
    
}//END class

?>