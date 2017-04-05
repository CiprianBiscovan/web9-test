<?php
    require_once "DB.php";
    
    // class ArticlesModel extends DB {
      
    //   function selectAll(){
           
    //     $sql = 'SELECT * FROM articles';
        
    //     return $this->selectSQL($sql); 
       
    //   }
       
    //   function insertItem($item){
           
    //       $sql = "INSERT INTO articles (title,content,category_id,user_id) VALUES(?,?,?,?)";
    //       $stmt = $this->dbh->prepare($sql);
    //       $stmt->execute(array( $item["title"], $item["content"], $item["category_id"],$item["user_id"] ));
           
    //       return $stmt->rowCount();
    //   }
    // }
   
   //Class ArticlesModel 
    class ArticlesModel extends DB {
    
    //Get all Articles from dataabse    
    function selectAll() {
        // $sql = 'SELECT * FROM articles'; 
        $sql = 'SELECT art. * , usr.email AS userEmail, CONCAT( usr.first_name,  " ", usr.last_name ) AS userName, cat.name AS category,
                (SELECT COUNT(id) FROM comments comm WHERE comm.article_id = art.id ) as commCount
                FROM  articles art
                INNER JOIN users usr ON usr.id = art.user_id 
                INNER JOIN category cat ON cat.id = art.category_id';
        return $this->selectSQL($sql);
    }//END selectAll()
    
    //Get all published Articles from dataabse    
    function selectPublished() {
        $sql = 'SELECT art. * , usr.email AS userEmail, CONCAT( usr.first_name,  " ", usr.last_name ) AS userName, cat.name AS category,
                (SELECT COUNT(id) FROM comments comm WHERE comm.article_id = art.id ) as commCount
                FROM  articles art
                INNER JOIN users usr ON usr.id = art.user_id 
                INNER JOIN category cat ON cat.id = art.category_id
                HAVING published = 1';
        return $this->selectSQL($sql);
    }//END selectPublished()
    
    //Get article with ID specified
    function selectArticle($id){
       // $sql = "SELECT * FROM articles WHERE id = '" . $id . "'";
       
       $sql = 'SELECT art. * , usr.email AS userEmail, CONCAT( usr.first_name,  " ", usr.last_name ) AS userName, cat.name AS category,
               (SELECT COUNT(id) FROM comments comm WHERE comm.article_id = art.id ) as commCount
                FROM  articles art
                INNER JOIN users usr ON usr.id = art.user_id 
                INNER JOIN category cat ON cat.id = art.category_id';
         $sql = $sql . " HAVING art.id = '" . $id . "'";
        
        return $this->selectSQL($sql);
    }
    
    //Get number of articles stored
    function countArticles(){
        $sql = "SELECT count(id) as NumOfArticles FROM articles";
        return $this->selectSQL($sql);
    }
    
    //Get articles for one page based on page number and pageSize(number of articles/page)
    function selectArticlesPage($pageNum,$pageSize){
        $sql = "SELECT * FROM articles LIMIT " . (($pageNum-1) * $pageSize) . "," . $pageSize;
        
        //return $sql;
        return $this->selectSQL($sql);
    }
    
    //Insert new article in DB
    function insertItem($item) {
        $sql = 'INSERT INTO articles (title, content, category_id, user_id, main_image_url) VALUES(?, ?, ?, ?, ?)';

        $stmt = $this->dbh->prepare($sql);
        $stmt->execute(array($item['title'], 
                            $item['content'], 
                            $item['category_id'], 
                            $item['user_id'],
                            $item['main_image_url']));
        
        return $this->dbh->lastInsertId();
    }
    
    //Update article based on ID 
    function updateItem($item) {
        $sql = 'UPDATE articles SET title=?, content=?, category_id=? WHERE id = ?';
    
        $stmt = $this->dbh->prepare($sql);
        $stmt->execute(array($item['title'], 
                            $item['content'], 
                            $item['category_id'], 
                            $item['id']));
        
        return $stmt->rowCount();    
    }
    
    //Delete article based on ID
    function deleteItem($id){
        $sql = 'DELETE FROM articles WHERE id=?';
        $stmt = $this->dbh->prepare($sql);
        $stmt->execute(array($id));
        
        return $stmt->rowCount();    
    }
}//End Class
?>