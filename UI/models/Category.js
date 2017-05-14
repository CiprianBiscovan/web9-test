/*global $ */
/*global URL_PHP */
/*global popUp */

//Class Category
function Category(options) {
    
    //Create an initialize category properties when object is created
    if(options){
        this.id         = options.id || 0;
        this.name       = options.name || "Default Topic";
        this.active     = options.active || 0;
        this.dateCreate = options.creation_date || "Unknown";
        this.dateModif  = options.last_modified || "Never";
    }
}//END class

//Function for add new category
Category.prototype.add = function(newCategoryName){
   
   //configure the request for adding category    
    var config = {

           url: URL_PHP + "categories/add",                                     //PHP API path
        method: "POST",                                                         //method to be used
          data:{                                                                //data for PHP API
                name: newCategoryName
          },
        
        //function to be executed in case of success
        success: function(response){
          //not used
        },
        
        //function to be executed in case of fail
        error: function(response){
            popUp("error","Oops!Request to add category failed!",response.responseText);
        }
    };
    
    return $.ajax(config);                                                      //Send request to the server and return result
    
}; //END add function

//Function for delete category
Category.prototype.delete = function(categoryId){
    
     //configure the request for deleting category  
    var config = {
           url: URL_PHP + "categories/delete",                                  //PHP API path
        method: "DELETE",                                                       //Req. method to be used
          data:{                                                                //Data for PHP API
              id: categoryId
          },
        
        //function to be executed in case of success
        success: function(response){
            //not used
        },
        
        //function to be executed in case of fail
        error: function(response){
            popUp("error","Oops! Request to delete category failed!",response.responseText);
        }
    };
    
    return $.ajax(config);                                                      //Send request to the server and return result
}; // END delete category method