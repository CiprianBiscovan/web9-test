<?php

   // include model file
    require "app/models/ArticlesModel.php";
    
      class Articles {
          
        //   Articles properties
        private $articlesModel;
        private $isAdmin;
        
        //Articles class constructor
        function __construct() {
            $this->articlesModel = new ArticlesModel();                         //create new model object and assign it to articlesModel property
            
            //check if admin is logged
            $this->isAdmin = (isset($_SESSION['isLogged']) && isset($_SESSION['role']) && $_SESSION['isLogged'] == true && 
                              strtolower($_SESSION['role']) == 'admin' ) ? true : false;
        }
        
        //Get article by ID
        function getArticle(){
            
            //check if articleId is received from UI
            if(isset($_GET['articleId'])){
                
                 //get article by id and return it to UI
                return $this->articlesModel->selectArticle($_GET['articleId'],$this->isAdmin);
            }
            else{
                return array("success" => false,"message"=>"No ID received!");
            }
        }//END getArticle method
        
        //Get number of articles from DB
        function count(){
           
           //check if filter is applied in UI
            if(isset($_GET['filter']) && !is_null($_GET['filter']) && !empty($_GET['filter'])){
                $_GET['filter'] = '%' . $_GET['filter'] . '%';
            }else{
                $_GET['filter'] = '%';
            }
            
            //get articles count and return it tu UI           
            return $this->articlesModel->countArticles($this->isAdmin,$_GET['filter']); 
        }
        
        //get articles for one page method
        function getArticlesForPage(){
            
            //cehck if filter is applied in UI 
            if(isset($_GET['filter']) && !is_null($_GET['filter']) && !empty($_GET['filter'])){
                $_GET['filter'] = '%' . $_GET['filter'] . '%';
            }else{
                $_GET['filter'] = '%';
            }
            
            //check if page number and page size was provided
            if(isset($_GET['pageNum']) && isset($_GET['pageSize'])){
                
                if($_GET['pageNum']>=0 && $_GET['pageSize'] >=0 ) {
                    
                    //get articles for specified page and return them to UI
                     return $this->articlesModel->selectArticlesPage($_GET['pageNum'],$_GET['pageSize'],$_GET['filter'],$this->isAdmin);
                }else{
                     return array("success"=>false,"message"=>"Page number and/or page size invalid!");
                }
                
            }else{
                return array("success"=>false,"message"=>"No page number and/or page size provided!");
            }
        }//END getArticlesForPage method
        
        //Create new article method
        function createItem() {
           
            // if no user is logged -> return error code 401
            if ($this->isAdmin === false ) {
                http_response_code(401);
                return array("success" => false, "message" => "Unauthorized. You have to be logged to create articles.");
            }
            
            //check if required fields were sent from UI
            if (!empty($_POST['title']) && !empty($_POST['content'])) {
                
                $_POST['main_image_url'] = '';                                  //initialize variable for image name
                $warning='';                                                    // initialize warning message 
                
                // save uploaded image if it exists and if it is not already saved
                if (isset($_FILES['main_image_url'])) {
                    
                    $file = $_FILES['main_image_url'];                          //get uploaded file
                    
                    //check if file is indeed an image
                    if(isset($file['type']) && preg_match('/^image\/.*/mi',$file['type'])){
                        
                        //save image
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
            
            //check if category is set or return error
            if(!isset($_POST['category_id']) || empty($_POST['category_id']) || $_POST['category_id'] == "null"){
                return array("success"=>false,"message"=>"Category not selected!");
            }
            
            //Get logged user id
            $_POST['user_id'] = $_SESSION["userId"];
            
                $lastInsertedID = $this->articlesModel->insertItem($_POST);     //call insertItem to save article into DB
                
                //proccess response from DB
                return ($lastInsertedID === '0') ? array("success"=>false,"message"=>"Failed to insert article into DB","warning"=>$warning): 
                                                 array("success"=>true,"lastInsertedID"=>$lastInsertedID,"warning"=>$warning);
                
            } else {
                return array("success"=>false,"message"=>"Title and content fields are required!");
            }
        }//END createItem method
        
        //edit item method
        function editItem() {
           
            // if no user is logged -> return error code 401
            if ($this->isAdmin === false ) {
                http_response_code(401);
                return array("success" => false, "message" => "Unauthorized. Only Administrator is allowed to edit articles.");
            }
            
            //check if required fields were sentr from UI
            if (!empty(trim($_POST['title'])) && !empty(trim($_POST['content']))) {
                
                //get article from DB
                $article = $this->articlesModel->selectArticle($_POST['id'],true);
                $image = '';
                
                //if image was not sent from UI get existing image from DB
                if(empty($_POST['main_image_url']) || $_POST['main_image_url'] == 'null'){
                    
                    $_POST['main_image_url'] = null;
                    
                    if($article && count($article) > 0){
                         if(isset($article[0]['main_image_url']) && $article[0]['main_image_url']){
                             
                             //get current image from DB
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
                    
                    //get uploaded file
                    $file = $_FILES['main_image_url'];
                    
                    //check if file is indeed an image and save it as new image for article
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
            
                //check if category is set
                if(!isset($_POST['category_id']) || empty($_POST['category_id']) || $_POST['category_id'] == 'null'){
                    return array("success"=>false,"message"=>"Category not selected!");
                }
            
                //get current date for last modified field
                date_default_timezone_set("Europe/Bucharest");
                $_POST['last_modified'] = date("Y-m-d H:i:s");
            
                $DbResult = $this->articlesModel->updateItem($_POST);               //call updateItem function which update article in DB
           
               //Proccess response from DB
                if($DbResult['rowsAffected'] == 1){
                    
                    // Delete old picture
                    if(!empty($image) && file_exists("uploads/" . $image)){
                            unlink("uploads/" . $image);
                    } 
                    
                    return array("success"=>true,"message"=>"Article update successfully");
            
                }else if($DbResult['rowsAffected'] === 0){
                    return array("success"=>false,"message"=>"Failed to update article into DB","error"=>$warning);
                }else{
                    return array("success"=>false,"message"=>"Something very bad happend.Probably more articles were updated!");
                }
                
            }else {
                return array("success"=>false,"message"=>"Title and content fields are required!");
            }
        }//end updateItem function
        
        //delete article method
        function deleteItem(){
            
            global $REQUEST;
            
            //check if logged user is admin
            if($this->isAdmin === false){
                http_response_code(401);
                return array("success" => false, "message" => "Unauthorized. Only Administrator can delete articles.");
            }
            
            //check if taregt id was provided from UI
            if(isset($REQUEST['id']) && !empty(trim($REQUEST['id']))){
                
                //get associated image name so it could be deleted from server
                $article = $this->articlesModel->selectArticle($REQUEST['id'],true);
                $image = '';
                if($article && count($article) > 0){
                    if(isset($article[0]['main_image_url']) && $article[0]['main_image_url']){
                        $image = $article[0]['main_image_url'];
                    }
                }
                
                $dbResult = $this->articlesModel->deleteItem($REQUEST['id']);    //call deleteItem function which deletes article from DB
                
                //proccess response from DB
                if($dbResult['rowsAffected'] == 1){
                   
                    if(!empty($image) && file_exists("uploads/" . $image)){
                        unlink("uploads/" . $image);
                    } 
                    
                    return array("success" => true, "message" => "Article successfully deleted!"); 
                }else if($dbResult['rowsAffected'] === 0){
                    return array("success" => false, "message" => "Article could not be deleted!"); 
                }else{
                    return array("success" => false, "message" => "Something very bad happend.Probably more than one article was deleted!"); 
                }
                
            }else{
               return array("success" => false, "message" => "Could not get article that must be deleted"); 
            }
           
        }//END deleteItem method
        
    }//END class

?>