<?php
    require "app/models/ArticlesModel.php";
    
      class Articles {
        private $articlesModel;
        private $isAdmin;
        
        function __construct() {
            $this->articlesModel = new ArticlesModel();    
            $this->isAdmin = (isset($_SESSION['isLogged']) && isset($_SESSION['role']) && $_SESSION['isLogged'] == true && strtolower($_SESSION['role']) == 'admin' ) ? true : false;
        }
        
        function getAll() {
            if(isset($_SESSION['isLogged']) && isset($_SESSION['role']) && $_SESSION['isLogged'] == true && strtolower($_SESSION['role']) == 'admin' ){
                return $this->articlesModel->selectAll();
            }else{
                return $this->articlesModel->selectPublished();
            }
            
        }
        
        function getArticle(){
            if(isset($_GET['articleId'])){
                return $this->articlesModel->selectArticle($_GET['articleId']);
            }
            else{
                return "No ID received!";
            }
        }
        function count(){
            
          //  $isAdmin = $this->isAdminLogged();
            
            return $this->articlesModel->countArticles($this->isAdmin);
        }
        
        function getArticlesForPage(){
            
            if(isset($_GET['pageNum']) && isset($_GET['pageSize'])){
                if($_GET['pageNum']>=0 && $_GET['pageSize'] >=0 ) {
                    
                     return $this->articlesModel->selectArticlesPage($_GET['pageNum'],$_GET['pageSize'],$this->isAdmin);
                }else{
                     return "Page number and/or number of articles per page invalid!";
                }
            }else{
                return "No page number and/or number of articles per page provided!";
            }
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
        
        private function isAdminLogged(){
            if(isset($_SESSION['isLogged']) && isset($_SESSION['role']) && $_SESSION['isLogged'] == true && strtolower($_SESSION['role']) == 'admin' ) return true;
            else return false;
        }
    }

?>