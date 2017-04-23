<?php

require "app/models/CategoriesModel.php";
require_once "app/configs/config.php";

//Class Categories
class Categories{
    
      private $isAdmin;
      private $categoriesModel;
    //Class Categories constructor
    function __construct() {
        
        $this->categoriesModel = new CategoriesModel();  
        $this->isAdmin = (isset($_SESSION['isLogged']) && isset($_SESSION['role']) && $_SESSION['isLogged'] == true && strtolower($_SESSION['role']) == 'admin' ) ? true : false;
        
        
   }//End Constructor
   
   //method to get all categories
   function getAll(){
        return $this->categoriesModel->selectAll();
   }//End getAll method
   
   //method for adding new category
   function createItem(){
       
       
       if($this->isAdmin){
           
        if(isset($_POST['name']) && !empty(trim($_POST['name']))){
            
           $dbResult = $this->categoriesModel->insertItem(trim($_POST['name']));
           
           if($dbResult['lastInsertedID'] > 0){
              return array("success"=>true,"lastInsertedID"=>$dbResult['lastInsertedID'],"message"=>"Category successfully added!");               
           }
           else if($dbResult['error'] == DB_DUPLICATE_ENTRY){
               
               date_default_timezone_set("Europe/Bucharest");
               $update = date("Y-m-d H:i:s");
               $dbResult = $this->categoriesModel->reactivateCategory(trim($_POST['name']),$update);
               if($dbResult['rowsAffected'] === 1){
                    return array("success"=>true,"message"=>"Category successfully added!");
               }else{
                    return array("success"=>false,"message"=>"Category could not be added!");
               }
           }
            
        }else{
            return array("success" => false, "message" => "Category name is required."); 
        }
           
        }else{
           
           http_response_code(401);
           return array("success" => false, "message" => "Unauthorized. You have to be logged to create categories.");
        }
   }//END createItem function
   
   function deleteItem(){
       
       global $REQUEST;
        date_default_timezone_set("Europe/Bucharest");
        $update = date("Y-m-d H:i:s");
       
        if($this->isAdmin){
            
            if(isset($REQUEST['id']) && !empty(trim($REQUEST['id']))){
                
                $dbResult = $this->categoriesModel->deleteItem(trim($REQUEST['id']),$update);
                if($dbResult['rowsAffected'] == 1){
                    return array("success"=>true,"message"=>"Category deleted"); 
                }
                else{
                    return array("success"=>false,"message"=>"Error deleting selected category");
                }
            }else{
                return array("success" => false, "message" => "Category name is required."); 
            }
        }else{
           http_response_code(401);
           return array("success" => false, "message" => "Unauthorized. You have to be logged to create categories.");
        }
   }
    
}//END Categories Class

?>
