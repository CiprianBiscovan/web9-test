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
    
    $routes['/login'] = array("class"=>"Accounts", "method"=>"login");
    $routes['/logout'] = array("class"=>"Accounts", "method"=>"logout");
    
    $routes['/categories'] = array('class'=>"Categories",'method'=>"getAll");
    $routes['/categories/add'] = array('class'=>"Categories",'method'=>"createItem");
    $routes['/categories/delete'] = array('class'=>"Categories",'method'=>"deleteItem");
?>