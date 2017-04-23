//Class Category
function Category(options) {
    if(options){
        this.id         = options.id || 0;
        this.name       = options.name || "Default Topic";
        this.active     = options.active || 0;
        this.dateCreate = options.creation_date || "Unknown";
        this.dateModif  = options.last_modified || "Never";
    }
}

//Fucntion for add new category
Category.prototype.add = function(newCategoryName){
   
   //configure the request for adding category    
    var config = {
        url: URL_PHP + "categories/add",
        method: "POST",
        data:{
            name: newCategoryName
        },
        
        //function to be executed in case of success
        success: function(response){
          //not used
        },
        
        //function to be executed in case of fail
        error: function(response){
            console.log("Oops! something went wrong while adding category!");
            console.log(response);
        }
    };
    
    return $.ajax(config); //Send request to the server and return result
}; //END add function

//Function for delete category
Category.prototype.delete = function(categoryId){
    
     //configure the request for deleting category  
    var config = {
        url: URL_PHP + "categories/delete",
        method: "DELETE",
        data:{
            id: categoryId
        },
        
        //function to be executed in case of success
        success: function(response){
            //not used
        },
        
        //function to be executed in case of fail
        error: function(response){
            console.log("Oops! something went wrong while deleting category!");
            console.log(response);
        }
    };
    
    return $.ajax(config); //Send request to the server and return result
};