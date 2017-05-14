/*global $ */
/*global URL_PHP */
/*global Category */
/*global popUp */

//Category Class
function Categories(options){
     
    this.categoriesList = [];                                                   //categories list
}

//Get all categories from server
Categories.prototype.getAll = function() {
   
   var that = this;                                                             //save current object
   
   //Configure request object
   var config = {
            url: URL_PHP + "categories",                                        //PHP API path
         method: "GET",                                                         //req. method to be used
       dataType: "JSON",                                                        //expected response type
       
       // Function to execute in case of req. succeded
       success: function(resp) {
           
           //load categories received from server into categories list
		   for (var i=0; i<resp.length; i++) {
		       var cat = new Category(resp[i]);
		       that.categoriesList.push(cat);
		   }
		},
			
		//function to execute in case of request fails
		error: function(xhr){
		popUp("error","Oops! Request for categories failed!",xhr.responseText);
		}
   };
   
   //Send request to the server and return the response
   return $.ajax(config);
   
}; //END get all categories function
    
