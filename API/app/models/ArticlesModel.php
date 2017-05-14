<?php

    //include file with DB connection
    require_once "DB.php";
   
   //Class ArticlesModel 
    class ArticlesModel extends DB {
   
    //Get article with ID specified
    function selectArticle($id, $isAdmin = false){
       
       //Build SQL query
       $sql = 'SELECT art. * , usr.email AS userEmail, CONCAT( usr.first_name,  " ", usr.last_name ) AS userName, cat.name AS category, cat.active as catExist,
               (SELECT COUNT(id) FROM comments comm WHERE comm.article_id = art.id AND comm.deleted = 0) as commCount
                FROM  articles art
                INNER JOIN users usr ON usr.id = art.user_id 
                INNER JOIN category cat ON cat.id = art.category_id';
                
        $sql = $sql . " HAVING art.id = '" . $id . "'";                         //add filter by ID
        
        //if user is not admin add publish=true filter 
        if($isAdmin == false){
            $sql .= ' AND published = 1 ';
        }

        return $this->selectSQL($sql);                                          //execute query and return the result
    }
    
    //Get number of articles stored
    function countArticles($isAdmin = false,$filter){
        
        //Build SQL query
        $sql = "SELECT count(id) as NumOfArticles FROM articles WHERE title LIKE '" . $filter . "'";
       
        //if logged user is not admin add publish=true filter
        if($isAdmin == false){
            $sql .= " AND published = 1";
        }
        
        return $this->selectSQL($sql);                                          //execute query and return result
    }
    
    //Get articles for one page based on page number and pageSize(number of articles/page)
    function selectArticlesPage($pageNum,$pageSize,$filter,$isAdmin = false){
        
        //Build SQL query
        $sql = 'SELECT art. * , usr.email AS userEmail, CONCAT( usr.first_name,  " ", usr.last_name ) AS userName, cat.name AS category, cat.active as catExist,
                (SELECT COUNT(id) FROM comments comm WHERE comm.article_id = art.id AND comm.deleted = 0) as commCount,
                COALESCE(GREATEST(art.creation_date,art.last_modified),art.creation_date,art.last_modified) as sorting 
                FROM  articles art
                INNER JOIN users usr ON usr.id = art.user_id 
                INNER JOIN category cat ON cat.id = art.category_id HAVING art.title LIKE ' . "'" . $filter . "' ";
        
        //add publish=true filter for non-admin users
        if($isAdmin == false){
            $sql .= ' AND published = 1 ';
        }
        
        $sql .= ' ORDER BY sorting DESC';                                       //order articles 
        $sql .= ' LIMIT ' . (($pageNum-1) * $pageSize) . "," . $pageSize;       //set limit for getting current page  
        
        return $this->selectSQL($sql);                                          //execute query and return result
    }
    
    //Insert new article in DB
    function insertItem($item) {
        
        //build SQL query
        $sql = 'INSERT INTO articles (title, content, category_id, user_id, main_image_url, published) VALUES(?, ?, ?, ?, ?,?)';
        
        $stmt = $this->dbh->prepare($sql);                                      //prepare SQL query
        $stmt->execute(array($item['title'],                                    //execute query passing variables 
                            $item['content'], 
                            $item['category_id'], 
                            $item['user_id'],
                            $item['main_image_url'],
                            $item['published']));
        
        return $this->dbh->lastInsertId();                                      //return query  result
    }
    
    //Update article based on ID 
    function updateItem($item) {
        //Build SQL query
        $sql = 'UPDATE articles SET title=?, content=?, category_id=?, main_image_url=?, published=COALESCE(?,published), last_modified=? WHERE id = ?';
        
        $stmt = $this->dbh->prepare($sql);                                      //prepare SQL query
        
        $stmt->execute(array($item['title'],                                    //execute query passing variables
                            $item['content'], 
                            $item['category_id'], 
                            $item['main_image_url'], 
                            $item['published'], 
                            $item['last_modified'], 
                            $item['id']));
       
        return array("rowsAffected"=>$stmt->rowCount());                        //return result
        
    }
    
    //Delete article based on ID
    function deleteItem($id){
        
        //Build SQL query
        $sql = 'DELETE FROM articles WHERE id=?';
        
        $stmt = $this->dbh->prepare($sql);                                      //prepare query
         
        $stmt->execute(array($id));                                             //execute query
        
        return array("rowsAffected"=>$stmt->rowCount());                        //return result
    }
}//End Class

?>