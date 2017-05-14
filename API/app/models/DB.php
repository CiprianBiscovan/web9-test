<?php
    
    //DB class
    class DB{
        
        //Class constructor
        function __construct(){
            
            //connect to DB
            try{
                
                $this->dbh = new PDO("mysql:host=" . DBHOST . ";dbname=" . DBNAME, DBUSER, DBPASS);
                $this->dbh->exec("SET GLOBAL time_zone = '+03:00'");
                
            }catch(PDOException $e){
                
                print 'DB ERROR PLEASE CONTACT ADMIN';
                die();
            }
            
        }//END constructor
        
        // Execute SELECT queries and return result
        function selectSQL($sql){
            $stmt = $this->dbh->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
        
    }//END DB Class

?>