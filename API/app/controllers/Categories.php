<?php

//include categories model and config file
require "app/models/CategoriesModel.php";
require_once "app/configs/config.php";

//Class Categories
class Categories{
    
    //Categories properties
    private $isAdmin;
    private $categoriesModel;
   
    //Class Categories constructor
    function __construct() {
        
        $this->categoriesModel = new CategoriesModel();                         //Create Category obj. and assign it to categoriesModel property 
        
        //check if logged user is admin
        $this->isAdmin = (isset($_SESSION['isLogged']) && isset($_SESSION['role']) && $_SESSION['isLogged'] == true && 
                          strtolower($_SESSION['role']) == 'admin' ) ? true : false;
        
        
   }//End Constructor
   
   //method to get all categories
   function getAll(){
        return $this->categoriesModel->selectAll();
   }//End getAll method
   
   //method for adding new category
   function createItem(){
       
       //check if logged user is admin
       if($this->isAdmin){
        
        //check if category name was provided   
        if(isset($_POST['name']) && !empty(trim($_POST['name']))){
            
           //call insertItem to save category into DB 
           $dbResult = $this->categoriesModel->insertItem(trim($_POST['name']));
           
           //Proccess response from DB
           if($dbResult['lastInsertedID'] > 0){
              return array("success"=>true,"lastInsertedID"=>$dbResult['lastInsertedID'],"message"=>"Category successfully added!");               
           }
           
           //if category already exist - reactivate it
           else if($dbResult['error'] == DB_DUPLICATE_ENTRY){
               
               //set default timezone and get current time
               date_default_timezone_set("Europe/Bucharest");
               $update = date("Y-m-d H:i:s");
               
               //call reactivateCategory to update active field in DB
               $dbResult = $this->categoriesModel->reactivateCategory(trim($_POST['name']),$update);
               
               //proccess results from DB
               if($dbResult['rowsAffected'] === 1){
                    return array("success"=>true,"message"=>"Category successfully added!");
               }else{
                    return array("success"=>false,"message"=>"Error adding category.No category was added!");
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
   
   //delete category method
   function deleteItem(){
       
       global $REQUEST;
       
       //set default timezone and get current time
        date_default_timezone_set("Europe/Bucharest");
        $update = date("Y-m-d H:i:s");
       
        // check if logged user is admin
        if($this->isAdmin){
            
            //check if target category id was provided 
            if(isset($REQUEST['id']) && !empty(trim($REQUEST['id']))){
                
                //inactivate category
                $dbResult = $this->categoriesModel->deleteItem(trim($REQUEST['id']),$update);
                
                //proccess response from DB
                if($dbResult['rowsAffected'] == 1){
                    return array("success"=>true,"message"=>"Category deleted"); 
                }
                else if($dbResult['rowsAffected'] == 1){
                    return array("success"=>false,"message"=>"Error deleting selected category.No category deleted","error"=>$dbResult['error']);
                }else{
                    return array("success"=>false,"message"=>"Something very abd happend.Probably more than 1 category was deleted!");
                }
            }else{
                return array("success" => false, "message" => "Category name is required."); 
            }
        }else{
           http_response_code(401);
           return array("success" => false, "message" => "Unauthorized. You have to be logged to create categories.");
        }
   }//END deleteItem method
    
}//END Categories Class

?>
