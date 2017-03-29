<?php
    require "app/models/ArticlesModel.php";
 
    // class Articles{

    //     function getAll(){
    //         $articlesModel = new ArticlesModel();
    //         return $articlesModel->selectAll();
    //     }
        
    //     function createItem(){
           
    //         if(!empty($_POST['title']) && !empty($_POST['content'])){
    //             $articlesModel = new ArticlesModel();
    //             return $articlesModel->insertItem($_POST);
    //         }
    //         else{
    //             return "All fields are required!";
    //         }
    //   }
    
    // }
    
      class Articles {
        private $articlesModel;
        
        function __construct() {
            $this->articlesModel = new ArticlesModel();    
        }
        
        function getAll() {
            return $this->articlesModel->selectAll();
        }
        
        function createItem() {
            //return $_SESSION["isLogged"];
           
              if (!isset($_SESSION["isLogged"]) || $_SESSION["isLogged"] !== TRUE) {
                http_response_code(401);
                return array("error"=>"Unauthorized. You have to be logged.");
            }
            
            if (!empty($_POST['title']) && !empty($_POST['content'])) {

                $_POST['main_image_url'] = '';
                if (isset($_FILES['main_image_url'])) {
                    $file = $_FILES['main_image_url'];
                    move_uploaded_file($file["tmp_name"], "uploads/" . $file["name"]);
                    $_POST['main_image_url'] = $file["name"];
                }
               
                return $this->articlesModel->insertItem($_POST);
            } else {
                return "All fields are required";
            }
        }
        
        function editItem() {
            global $REQUEST;
            return $this->articlesModel->updateItem($REQUEST);
        }
        
        function deleteItem(){
            global $REQUEST;
            return $this->articlesModel->deleteItem($REQUEST['id']);
        }
    }

?>