<?php

//ContactUs class
class ContactUs{


function sendMessage(){
    
    if(!isset($_POST['name'],$_POST['email'],$_POST['subject'],$_POST['message']) ||
    empty($_POST['name']) || empty($_POST['email']) || empty($_POST['subject']) || empty($_POST['message'])){
        return array("success"=>false,"message"=>"Missing require fields!");
    }
    
    if(filter_var($_POST['email'],FILTER_VALIDATE_EMAIL) === false){
          return array("success"=>false,"message"=>"E-mail address not valid!");
    }
  
    if(isset($_POST['phone']) && (!empty($_POST['phone']) || $_POST['phone'] == 0 ) && !isValidPhone($_POST['phone'])){
         return array("success"=>false,"message"=>"Phone number is not valid!");
    }
    if(strlen($_POST['name']) > 70){
        return array("success"=>false,"message"=>"Name too long!");
    }
    if(strlen($_POST['email']) > 70){
        return array("success"=>false,"message"=>"Email too long!");
    }
     if(strlen($_POST['subject']) > 70){
        return array("success"=>false,"message"=>"Subject too long!");
    }
    $to = "ciprian.biscovan@yahoo.com\r\n";
    $subject = $_POST['subject'];
    $content = "USER`s DETAILS:\n" .
              "Name: " .$_POST['name'] . "\n" .  
              "EMAIL: " .$_POST['email'] . "\n" . 
              "Phone: " .$_POST['phone'] . "\n\n" . 
              "USER`s MESSAGE:\n" .
              wordwrap($_POST['message'],70);       //no lines with more that 70 character are allowed 
    $headers = "From: " . $_POST['email'] . "\r\n";
     
    $success = mail($to,$subject,$content,$headers);
    if($success){
        return array("success"=>true,"message"=>"Message sent successfully!");
    }else{
        return array("success"=>false,"message"=>"Error sending message! Message not sent");
    }
}
    
}//end ContactUs Class

    //Validate User phone number
        function isValidPhone($phone){
           $phonePattern = '/^[0-9+]{0,3}\d{10}$/mi';
           return preg_match($phonePattern,$phone);
        }//END isValidPhone

?>