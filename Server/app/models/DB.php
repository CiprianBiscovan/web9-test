<?php
    
    //DB class
    class DB{
        
        //Class constructor
        function __construct(){
            
            //connect to DB
            try{
                
                $this->dbh = new PDO("mysql:host=" . DBHOST . ";dbname=" . DBNAME, DBUSER, DBPASS);
                
            }catch(PDOException $e){
                
                print 'DB ERROR PLS CONTACT ADMIN';
                die();
                
            }
        }//END constructor
        
        // Execute Select queries
        function selectSQL($sql){
            $stmt = $this->dbh->prepare($sql);
            $stmt->execute();
        
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }

?>