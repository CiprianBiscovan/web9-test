<?php
    
    //include comments model
    require "app/models/CommentsModel.php"; 
    
    //Comments Class
    class Comments{
        
        //Coments properties
        private $comments;
        private $isLogged;
        private $isAdmin;
        
        //Comments class constructor
        function __construct(){
            
            $this->comments = new CommentsModel();                              //save comments model object
            
            // check if user is logged
            if(isset($_SESSION['isLogged']) && $_SESSION['isLogged'] === true){
                $this->isLogged = true;
            }else{
               $this->isLogged = false; 
            }
            
            //check if logged user is admin
            $this->isAdmin = (isset($_SESSION['isLogged']) && isset($_SESSION['role']) && $_SESSION['isLogged'] == true && strtolower($_SESSION['role']) == 'admin' ) ? true : false;
        }
        
        //get all comments
        function getAll(){
            return $this->comments->selectAll();
        }
        
        //create comment method
        function createItem(){
            
            //check if somebody is logged
            if($this->isLogged === false){
                return array("success"=>false,"message"=>"You must be logged in to be able to post comments.");
            }
            
            //check if associated article id was provided
            if(isset($_POST['article_id']) && !empty(trim($_POST['article_id']))){
                
                //check if required fields were provided
                if(!empty($_POST['title']) && !empty($_POST['content'])){
                    
                    //assign as owner current logged user ID
                    $_POST['user_id'] = $_SESSION['userId'];
                    
                    $dbResult = $this->comments->insertItem($_POST);            //Call insertItem method to save comment intu DB
                    
                    //Proccess response from DB
                    if($dbResult > 0){
                        return array("success"=>true,"message"=>"Comment succesfully added!");
                    }else{
                        return array("success"=>false,"message"=>"Error while adding comment!");
                    }
                }else{
                    return array("success"=>false,"message"=>"All fields are required!");
                }
            }else{
                return array("success"=>false,"message"=>"Comment could not be added");
            }
            
        }//END insertItem function
        
        //get comments associated with article
        function getCommentsForArticle(){
            
            //check if associated article ID was provided
            if(isset($_GET["article_id"]) && !empty($_GET["article_id"])){
                
                //check if current page and pagesize were provided
                if(isset($_GET["page"],$_GET["pageSize"]) && !empty($_GET["page"]) && !empty($_GET["pageSize"])){
                    
                    //get articles from current page
                    return $this->comments->getCommentsForArtID($_GET['article_id'],$_GET['page'],$_GET['pageSize']);
                }else{
                    return array('success'=>false,'message'=>"Page could not be determined!");
                }
            }
            else{
                return array('success'=>false,'message'=>"Article could not be identified!");
            }
            
        }//END getCommentsForArticle method
        
        //get number of comemnts
         function commentsCount(){
            
            //check if associated article ID was provided 
            if(!empty($_GET["article_id"])){
                
                //get comments number from DB and return it tu UI
                $dbResult =  $this->comments->countComments($_GET["article_id"]);
                return $dbResult;
            }
            else{
                array('success'=>false,'message'=>"Article could not be identified!");
            }
            
        }//END commentsCount method
        
        //get comment for editing
        function getComment(){
            
            //check if someone is logged in
            if(!isset($_SESSION['isLogged']) || $_SESSION['isLogged'] === false){
                return array("success"=>false,"message"=>"Only logged users can edit comments");
            }
           
            //check if comment ID was provided           
            if(isset($_GET["id"]) && !empty($_GET["id"])){
                
                //get comment from database and return it to UI
                return $this->comments->getComment($_GET["id"]);
            }
            else{
                return array('success'=>false,'message'=>"Comment could not be identified!");
            }
            
        }//END getComment method
        
        
        //delete comment method
        function deleteItem(){

            global $REQUEST;
            
            //check if somebody is logged in            
            if($this->isLogged === false){
                return array("success"=>false,"message"=>"You must be logged in to delete comments");
            }
            
            //check if logged user is admin
            if($this->isAdmin === false){
                
                //check if logged user on server is the same with logged user in cookies
                if(isset($REQUEST['userId']) && isset($_SESSION['userId'])){
                    if($REQUEST['userId'] !== $_SESSION['userId']){
                        return array("success"=>false,"message"=>"You cand delete only you`re own comments");
                    }
                }else{
                       return array("success"=>false,"message"=>"User unknown");
                }
            }
            
            //check if target comment id is provided
            if(isset($REQUEST['id'])){
                
                //get current date
                date_default_timezone_set("Europe/Bucharest");
                
                //call delete comment method
                $DbResult = $this->comments->deleteItem($REQUEST['id'],date("Y-m-d H:i:s"));
                
                //proccess response from DB
                if($DbResult['rowsAffected'] === 1){
                     return array("success"=>true,"message"=>"Comment deleted successfully");
                }else if($DbResult['rowsAffected'] === 0){
                    return array("success"=>false,"message"=>"Error deleting comment.No comment deleted!","error"=>$DbResult['error']);
                }else{
                    return array("success"=>false,"message"=>"Something very bad happend. Probably more than 1 comment was deleted!");
                }
            }else{
                 return array("success"=>false,"message"=>"Comment could not be deleted.Missing required field ID!");
            }
            
        }//END deleteItem method 
     
        // update comment function     
        function updateItem(){
            
            global $REQUEST;
            
            //check if someone is logged in
            if($this->isLogged === false){
                return array("success"=>false,"message"=>"You must be logged in to modify comments");
            }
            //check if logged user is admin
            if($this->isAdmin === false){
            
                //check if logged user in server is the same with logged user in cookies
                if(isset($REQUEST['userId']) && isset($_SESSION['userId'])){
                    if($REQUEST['userId'] !== $_SESSION['userId']){
                        return array("success"=>false,"message"=>"You cand modify only you`re own comments");
                    }
                }else{
                       return array("success"=>false,"message"=>"User unknown.Only logged users can modify comments!");
                }
            }
            
            //check if target comment ID was provided
            if(isset($REQUEST['id']) && !empty(trim($REQUEST['id']))){
                
                //check if required fields were provided 
                if(isset($REQUEST['title']) && isset($REQUEST['content'])){
                    
                    //get current date
                    date_default_timezone_set("Europe/Bucharest");
                    $REQUEST['last_modified'] = date("Y-m-d H:i:s");
                    
                    $DbResult = $this->comments->updateItem($REQUEST);          //call updateItem method to update comment in database
                    
                    //proccess response from DB 
                    if($DbResult['rowsAffected'] === 1){
                        return array("success"=>true,"message"=>"Comment updated successfully!");
                    }else if($DbResult['rowsAffected'] === 0){
                        return array("success"=>false,"message"=>"Error updating comment.No comment was updated!","error"=>$DbResult['error'] );
                    }else{
                        return array("success"=>false,"message"=>"Something very bad happend. Probably more than 1 comment was updated!");
                    }
                }else{
                    return array("success"=>false,"message"=>"All fields are required!");
                }
            }else{
                 return array("success"=>false,"message"=>"Comment could not be updated.Missing required field ID!");
            }
        } //END UpdateItem method
    }
    //END class
?>