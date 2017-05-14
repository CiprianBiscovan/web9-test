<?php

//Import messages model
require "app/models/Messages.php";

//ContactUs class
class ContactUs{

 //class property
 private $message; 
    
    //Account Class Constructor
    function __construct(){
        $this->message = new Messages();                                        //create Messages object
    }

    //send message to admin
    function sendMessage(){
        
        //check if all required fields were received from UI    
        if(!isset($_POST['name'],$_POST['email'],$_POST['subject'],$_POST['message']) ||
           empty($_POST['name']) || empty($_POST['email']) || empty($_POST['subject']) || empty($_POST['message'])){
            return array("success"=>false,"message"=>"Missing require fields!");
        }
        
        //validate email address
        if(filter_var($_POST['email'],FILTER_VALIDATE_EMAIL) === false){
              return array("success"=>false,"message"=>"E-mail address not valid!");
        }
        
        //validate phone number if it is provided
        if(isset($_POST['phone']) && strlen($_POST['phone']) > 0  && !isValidPhone($_POST['phone'])){ //&& !($_POST['phone'] == 0 )
             return array("success"=>false,"message"=>"Phone number is not valid!");
        }
        
        //if no phone number is provided set it as null
        if(strlen($_POST['phone']) == 0 ){
            $_POST['phone'] = NULL;
        }
        
        //check name to be shorter than 70 characters (maximum allowed by mail() function) 
        if(strlen($_POST['name']) > 70){
            return array("success"=>false,"message"=>"Name too long!");
        }
        
        //check email to be shorter than 70 characters (maximum allowed by mail() function)
        if(strlen($_POST['email']) > 70){
            return array("success"=>false,"message"=>"Email too long!");
        }
        
        //check subject to be shorter than 70 characters (maximum allowed by mail() function)
        if(strlen($_POST['subject']) > 70){
            return array("success"=>false,"message"=>"Subject too long!");
        }
        
        //configure e-mail message to be sent
        $to = "ciprian.biscovan@yahoo.com\r\n";
        $subject = $_POST['subject'];
        $content = "USER`s DETAILS:\n" .
                   "Name: " .$_POST['name'] . "\n" .  
                   "EMAIL: " .$_POST['email'] . "\n" . 
                   "Phone: " .$_POST['phone'] . "\n\n" . 
                   "USER`s MESSAGE:\n" .
                   wordwrap($_POST['message'],70);                              //no lines with more that 70 character are allowed 
        $headers = "From: " . $_POST['email'] . "\r\n";
    
        $success = mail($to,$subject,$content,$headers);                        //send email
        
        //Save message to database because mail ports are closed in C9
        $dbResult = $this->message->saveMessage($_POST);
        
        //Proccess response from DB
        if($dbResult['rowsAffected'] === 1){
            return array("success"=>true,"message"=>"Message sent successfully!");
        }else{
            return array("success"=>false,"message"=>"Error sending message! Message not sent","error"=>$dbResult['error']);
        }
        
    }//END sendMessage method
    
}//end ContactUs Class

//Validate User phone number
function isValidPhone($phone){
    $phonePattern = '/^[0-9+]{0,3}\d{10}$/mi';
    return preg_match($phonePattern,$phone);
}//END isValidPhone
?>