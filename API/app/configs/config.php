<?php   

//Activate php errors and warnings
error_reporting(E_ALL);
ini_set('display_errors', 1);

    //DB Config
    define("DBHOST",getenv('IP'));
    define("DBUSER",getenv('C9_USER'));
    define("DBPASS","");
    define("DBNAME","blog");
    
    // define('PASS_SALT', '$1$12ab!');
    const PASS_SALT = '$1$12ab!';
?>