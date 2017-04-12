//Category Class
function Categories(options){
     
    this.categoriesList = [];
}

Categories.prototype.getAll = function() {
   
   var that = this; //save current object
   
   //Configure request object
   var config = {
       url: URL_PHP + "categories",
       method: "GET",
       dataType: "JSON",
       
       // Function to execute in case of req. succeded
       success: function(resp) {
           //load categories received from server into categories list
		   for (var i=0; i<resp.length; i++) {
		       var cat = new Category(resp[i]);
		       that.categoriesList.push(cat);
		   }
		},
			
		//function to execute in case of request fails
		error: function(){
		console.log("Something went wrong while getting categories");
		}
   }
   
   //Send request to the server and return the response
   return $.ajax(config);
   
};
    
