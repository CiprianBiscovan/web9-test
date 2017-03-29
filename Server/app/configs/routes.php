<?php
    $routes['/articles'] = array("class"=>"Articles", "method"=>"getAll");
    $routes['/articles/add'] = array("class"=>"Articles", "method"=>"createItem");
    $routes['/articles/edit'] = array("class"=>"Articles", "method"=>"editItem");
    $routes['/articles/delete'] = array("class"=>"Articles", "method"=>"deleteItem");
    
    $routes['/comments'] = array("class"=>"Comments", "method"=>"getAll");
    $routes['/comments/add'] = array("class"=>"Comments", "method"=>"createItem");
    $routes['/comments/delete'] = array("class"=>"Comments", "method"=>"deleteItem");
    
    $routes['/login'] = array("class"=>"Accounts", "method"=>"login");
    $routes['/logout'] = array("class"=>"Accounts", "method"=>"logout");
?>