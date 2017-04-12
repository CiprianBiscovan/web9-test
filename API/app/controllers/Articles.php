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
           // if(isset($_SESSION['isLogged']) && isset($_SESSION['role']) && $_SESSION['isLogged'] == true && strtolower($_SESSION['role']) == 'admin' ){
                return $this->articlesModel->selectAll($this->isAdmin);
           // }else{
           //     return $this->articlesModel->selectPublished();
          //  }
        }
        
        function getArticle(){
            if(isset($_GET['articleId'])){
                return $this->articlesModel->selectArticle($_GET['articleId'],$this->isAdmin);
            }
            else{
                return "No ID received!";
            }
        }
        function count(){
            
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
        
        //Function for creation of new article
        function createItem() {
           
            // if no user is logged -> return error code 401
            if ($this->isAdmin === false ) {
                http_response_code(401);
                return array("success" => false, "message" => "Unauthorized. You have to be logged to create articles.");
            }
            
            if (!empty($_POST['title']) && !empty($_POST['content'])) {
                
                $_POST['main_image_url'] = '';
                $warning='';
                // save uploaded image if it exists and if it is not already saved
                if (isset($_FILES['main_image_url'])) {
                    
                    $file = $_FILES['main_image_url'];
                    
                    //check if file is indeed an image
                    if(isset($file['type']) && preg_match('/^image\/.*/mi',$file['type'])){
                        $fileName = pathinfo($file["name"])['filename'];
                        $fileExtension = pathinfo($file["name"])['extension'];
                        $newFileName = $fileName . $_SESSION["userId"] . strtotime('now') . "." . $fileExtension;
                        move_uploaded_file($file["tmp_name"], "uploads/" . $newFileName);
                        $_POST['main_image_url'] = $newFileName;
                    }
                    else{
                         $warning = "Sent file is not an image!";
                    }
                }
                
            //check if published field exists and is valid or replace it with default value 0
            if(!isset($_POST['published']) || ($_POST['published'] !== '0' && $_POST['published'] !== '1')){
                $_POST['published'] = '0';
            }
            //check if category is set or set it to default value 1 if false
            if(!isset($_POST['category_id']) || empty($_POST['category_id'])){
                $_POST['category_id'] = '1';
            }
            //Get logged user id
            $_POST['user_id'] = $_SESSION["userId"];
            
                $lastInsertedID = $this->articlesModel->insertItem($_POST);
                return ($lastInsertedID === '0') ? array("success"=>false,"message"=>"Failed to insert article into DB","warning"=>$warning): 
                                                 array("success"=>true,"lastInsertedID"=>$lastInsertedID,"warning"=>$warning);
                
            } else {
                return array("success"=>false,"message"=>"Title and content fields are required!");
            }
        }
        
        function editItem() {
            
            // if no user is logged -> return error code 401
            if ($this->isAdmin === false ) {
                http_response_code(401);
                return array("success" => false, "message" => "Unauthorized. Only Administrator is allowed to edit articles.");
            }
            
            if (!empty(trim($_POST['title'])) && !empty(trim($_POST['content']))) {
                
                $article = $this->articlesModel->selectArticle($_POST['id'],true);
                $image = '';
              
                if(empty($_POST['main_image_url']) || $_POST['main_image_url'] == 'null'){
                    $_POST['main_image_url'] = null;
                    if($article && count($article) > 0){
                         if(isset($article[0]['main_image_url']) && $article[0]['main_image_url']){
                             $image = $article[0]['main_image_url'];
                         }
                    }
                }
                
                $warning='';
                
                // save uploaded image if it exists and if it is not already saved
                if (isset($_FILES['main_image_url'])) {
                    if($article && count($article) > 0){
                         if(isset($article[0]['main_image_url']) && $article[0]['main_image_url']){
                             $image = $article[0]['main_image_url'];
                         }
                    }
                    $file = $_FILES['main_image_url'];
                    
                    //check if file is indeed an image
                    if(isset($file['type']) && preg_match('/^image\/.*/mi',$file['type'])){
                        $fileName = pathinfo($file["name"])['filename'];
                        $fileExtension = pathinfo($file["name"])['extension'];
                        $newFileName = $fileName . $_SESSION["userId"] . strtotime('now') . "." . $fileExtension;
                        move_uploaded_file($file["tmp_name"], "uploads/" . $newFileName);
                        $_POST['main_image_url'] = $newFileName;
                    }
                    else{
                         $warning = "Sent file is not an image!";
                    }
                }
                
            // //check if published field exists and is valid or replace it with default value 0
            // if(!isset($_POST['published']) || ($_POST['published'] !== '0' && $_POST['published'] !== '1')){
            //     $_POST['published'] = '0';
            // }
            //check if category is set or set it to default value 1 if false
            if(!isset($_POST['category_id']) || empty($_POST['category_id'])){
                $_POST['category_id'] = '1';
            }
            
            //get current date
            date_default_timezone_set("Europe/Bucharest");
            $_POST['last_modified'] = date("Y-m-d H:i:s");
            
            $DbResult = $this->articlesModel->updateItem($_POST);
           
            if($DbResult['rowsAffected'] == 1){
                
                // Delete old picture
                 if(!empty($image) && file_exists("uploads/" . $image)){
                        unlink("uploads/" . $image);
                    } 
                return array("success"=>true,"message"=>"Article update successfully");
            
            }else{
                return array("success"=>false,"message"=>"Failed to update article into DB","warning"=>$warning);
            }
            
            } else {
                return array("success"=>false,"message"=>"Title and content fields are required!");
            }
        }
        
        function deleteItem(){
            global $REQUEST;
           
            if($this->isAdmin === false){
                http_response_code(401);
                return array("success" => false, "message" => "Unauthorized. Only Administrator can delete articles.");
            }
            
            if(isset($REQUEST['id']) && !empty(trim($REQUEST['id']))){
                
                //get associated image name so it could be deleted from server
                $article = $this->articlesModel->selectArticle($REQUEST['id'],true);
                $image = '';
                if($article && count($article) > 0){
                    if(isset($article[0]['main_image_url']) && $article[0]['main_image_url']){
                        $image = $article[0]['main_image_url'];
                    }
                }
                
                $dbResult = $this->articlesModel->deleteItem($REQUEST['id']);
                
                if($dbResult['rowsAffected'] == 1){
                   
                    if(!empty($image) && file_exists("uploads/" . $image)){
                        unlink("uploads/" . $image);
                    } 
                    
                    return array("success" => true, "message" => "Article successfully deleted!"); 
                }else{
                    return array("success" => false, "message" => "Article could not be deleted!"); 
                }
                
            }else{
               return array("success" => false, "message" => "Could not get article that must be deleted"); 
            }
           
        }
        
        // private function isAdminLogged(){
        //     if(isset($_SESSION['isLogged']) && isset($_SESSION['role']) && $_SESSION['isLogged'] == true && strtolower($_SESSION['role']) == 'admin' ) return true;
        //     else return false;
        // }
    }

?>