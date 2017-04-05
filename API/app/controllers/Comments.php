<?php

    require "app/models/CommentsModel.php"; 
    
    class Comments{
        
        private $comments;
        
        function __construct(){
            $this->comments = new CommentsModel();
        }
        
        function getAll(){
            
            return $this->comments->selectAll();
        }
        
        function createComment(){
            
            if(!empty($_POST['title']) && !empty($_POST['content'])){
            return $this->comments->insertComment($_POST);
            }
            else{
                return "All fields are required!";
            }
            
        }
        
        function getCommentsForArticle(){
            
            if(!empty($_GET["article_id"])){
                
                return $this->comments->getCommentsForArtID($_GET["article_id"]);
            }
            else{
                return "You must specify and article ID!";
            }
        }
        
        function deleteItem(){
            parse_str(file_get_contents("php://input"),$DELETE);
            return $this->comments->deleteItem($DELETE['id']);
        }
    }

?>