<?php
    $routes['/articles'] = array("class"=>"Articles", "method"=>"getAll");
    $routes['/articles/page'] = array("class"=>"Articles", "method"=>"getArticlesForPage");
    $routes['/articles/add'] = array("class"=>"Articles", "method"=>"createItem");
    $routes['/articles/edit'] = array("class"=>"Articles", "method"=>"editItem");
    $routes['/articles/delete'] = array("class"=>"Articles", "method"=>"deleteItem");
    $routes['/articles/count'] = array("class"=>"Articles", "method"=>"count");
    
    $routes['/article'] = array("class"=>"Articles", "method"=>"getArticle");
   
    $routes['/comments'] = array("class"=>"Comments", "method"=>"getAll");
    $routes['/comments/forArticle'] = array("class"=>"Comments", "method"=>"getCommentsForArticle");
    $routes['/comments/add'] = array("class"=>"Comments", "method"=>"createItem");
    $routes['/comments/delete'] = array("class"=>"Comments", "method"=>"deleteItem");
    $routes['/comments/edit'] = array("class"=>"Comments", "method"=>"updateItem");
    $routes['/comments/count'] = array("class"=>"Comments", "method"=>"commentsCount");
    
    $routes['/comment'] = array("class"=>"Comments", "method"=>"getComment");
     
    $routes['/login'] = array("class"=>"Accounts", "method"=>"login");
    $routes['/logout'] = array("class"=>"Accounts", "method"=>"logout");
    $routes['/signup'] = array("class"=>"Accounts", "method"=>"createAccount");
    $routes['/users/update'] = array("class"=>"Accounts", "method"=>"updateUser");
    $routes['/users/changePassword'] = array("class"=>"Accounts", "method"=>"changePassword");
    $routes['/users/changeRole'] = array("class"=>"Accounts", "method"=>"changeRole");
    $routes['/users/getUser'] = array("class"=>"Accounts", "method"=>"getUser");
    $routes['/users/delete'] = array("class"=>"Accounts", "method"=>"deleteUser");
    $routes['/users'] = array("class"=>"Accounts", "method"=>"getAll");
    
    $routes['/categories'] = array('class'=>"Categories",'method'=>"getAll");
    $routes['/categories/add'] = array('class'=>"Categories",'method'=>"createItem");
    $routes['/categories/delete'] = array('class'=>"Categories",'method'=>"deleteItem");
    
    $routes['/contactUs'] = array('class'=>"ContactUs",'method'=>"sendMessage"); 
    
?>