<?php
    require_once "DB.php";
   
   //Class ArticlesModel 
    class ArticlesModel extends DB {
    
    //Get all Articles from dataabse    
    function selectAll($isAdmin = false) {
        // $sql = 'SELECT * FROM articles'; 
        $sql = 'SELECT art. * , usr.email AS userEmail, CONCAT( usr.first_name,  " ", usr.last_name ) AS userName, cat.name AS category,
                (SELECT COUNT(id) FROM comments comm WHERE comm.article_id = art.id AND comm.deleted = 0) as commCount,
                COALESCE(GREATEST(art.creation_date,art.last_modified),art.creation_date,art.last_modified) as sorting 
                FROM  articles art
                INNER JOIN users usr ON usr.id = art.user_id 
                INNER JOIN category cat ON cat.id = art.category_id';
        if($isAdmin == false){
            $sql .= ' WHERE published = 1 ';
        }
        $sql .= ' ORDER BY sorting DESC';
        
        return $this->selectSQL($sql);
    }//END selectAll()
    
    // //Get all published Articles from dataabse    
    // function selectPublished() {
    //     $sql = 'SELECT art. * , usr.email AS userEmail, CONCAT( usr.first_name,  " ", usr.last_name ) AS userName, cat.name AS category,
    //             (SELECT COUNT(id) FROM comments comm WHERE comm.article_id = art.id ) as commCount
    //             FROM  articles art
    //             INNER JOIN users usr ON usr.id = art.user_id 
    //             INNER JOIN category cat ON cat.id = art.category_id
    //             HAVING published = 1';
    //     return $this->selectSQL($sql);
    // }//END selectPublished()
    
    //Get article with ID specified
    function selectArticle($id, $isAdmin = false){
       // $sql = "SELECT * FROM articles WHERE id = '" . $id . "'";
       
       $sql = 'SELECT art. * , usr.email AS userEmail, CONCAT( usr.first_name,  " ", usr.last_name ) AS userName, cat.name AS category,
               (SELECT COUNT(id) FROM comments comm WHERE comm.article_id = art.id AND comm.deleted = 0) as commCount
                FROM  articles art
                INNER JOIN users usr ON usr.id = art.user_id 
                INNER JOIN category cat ON cat.id = art.category_id';
        $sql = $sql . " HAVING art.id = '" . $id . "'";
        if($isAdmin == false){
            $sql .= ' AND published = 1 ';
        }
        // return $sql;
        return $this->selectSQL($sql);
    }
    
    //Get number of articles stored
    function countArticles($isAdmin = false){
        $sql = "SELECT count(id) as NumOfArticles FROM articles";
        if($isAdmin == false){
            $sql .= " WHERE published = 1";
        }
        return $this->selectSQL($sql);
    }
    
    //Get articles for one page based on page number and pageSize(number of articles/page)
    function selectArticlesPage($pageNum,$pageSize,$isAdmin = false){
        $sql = 'SELECT art. * , usr.email AS userEmail, CONCAT( usr.first_name,  " ", usr.last_name ) AS userName, cat.name AS category,
                (SELECT COUNT(id) FROM comments comm WHERE comm.article_id = art.id AND comm.deleted = 0) as commCount,
                COALESCE(GREATEST(art.creation_date,art.last_modified),art.creation_date,art.last_modified) as sorting 
                FROM  articles art
                INNER JOIN users usr ON usr.id = art.user_id 
                INNER JOIN category cat ON cat.id = art.category_id';
        if($isAdmin == false){
            $sql .= ' HAVING published = 1 ';
        }
        $sql .= ' ORDER BY sorting DESC';
        $sql .= ' LIMIT ' . (($pageNum-1) * $pageSize) . "," . $pageSize;
        
        //return $sql;
        return $this->selectSQL($sql);
    }
    
    //Insert new article in DB
    function insertItem($item) {
        $sql = 'INSERT INTO articles (title, content, category_id, user_id, main_image_url, published) VALUES(?, ?, ?, ?, ?,?)';

        $stmt = $this->dbh->prepare($sql);
        $stmt->execute(array($item['title'], 
                            $item['content'], 
                            $item['category_id'], 
                            $item['user_id'],
                            $item['main_image_url'],
                            $item['published']));
        
        return $this->dbh->lastInsertId();
    }
    
    //Update article based on ID 
    function updateItem($item) {
        $sql = 'UPDATE articles SET title=?, content=?, category_id=?, main_image_url=?, published=COALESCE(?,published), last_modified=? WHERE id = ?';
       //main_image_url=COALESCE(?,main_image_url)
        $stmt = $this->dbh->prepare($sql);
        
        $stmt->execute(array($item['title'], 
                            $item['content'], 
                            $item['category_id'], 
                            $item['main_image_url'], 
                            $item['published'], 
                            $item['last_modified'], 
                            $item['id']));
       
        return array("rowsAffected"=>$stmt->rowCount());    
        
    }
    
    //Delete article based on ID
    function deleteItem($id){
        $sql = 'DELETE FROM articles WHERE id=?';
        $stmt = $this->dbh->prepare($sql);
        $stmt->execute(array($id));
        
        return array("rowsAffected"=>$stmt->rowCount());    
    }
}//End Class
?>