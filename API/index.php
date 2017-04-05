<?php


session_start();

//Import needed files
require "app/configs/config.php";
require "app/configs/routes.php";
    
//Define part of path to be removed from url 
const BLOG = '/Blog/API';

   //in case of redirection to this page
   if (!empty($_SERVER['REDIRECT_URL'])) {
    
        $url = $_SERVER['REDIRECT_URL'];   //save requested url
        $page = str_replace(BLOG,'',$url); // strip requested url of directory path to obtain the needed file
      
        //Check if there is any route to the requested file
        if (array_key_exists($page, $routes)) {
            
            $class = $routes[$page]["class"]; // Get class (e.g. "Articles")
            $method = $routes[$page]["method"]; // Get method from that class (e.g. "getAll")
            
            //decode JSON data sent from UI
            //Get request method GET/POST/PUT/DELETE
            $methodReq = $_SERVER["REQUEST_METHOD"];
            
            switch($methodReq){
                
                case "POST":
                    
                    $content = file_get_contents("php://input");
                    $data = json_decode($content, true);
        
                    if ($data) {
                        $_POST = $data;
                    }
                    break;
                
                case "PUT":
                case "DELETE":
                    
                    $content = file_get_contents("php://input");
                    $data = json_decode($content, true);
                    
                    if($data){
                        $REQUEST = $data;
                    }else{
                        parse_str($content,$REQUEST);
                    }
                    break;
            }
            
            //import required controller, create object of that class and call require method
            require "app/controllers/" . $class . ".php";
            $controller = new $class();
            $response = $controller->$method();
            
            //Create JSON response and send it to UI
            header("Content-Type: application/json");
            echo json_encode($response);
            
        } 
        //If required page doesn`t exist respond with 404 Page not found
        else {
            http_response_code(404);
            echo "Page not found.";        
        }
        
    } 
    //If page is accessed directly without redirection respond with 403 Access Denied
    else {
        http_response_code(403);
        echo "Access Forbidden.";
    }
?>