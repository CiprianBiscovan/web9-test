/*global $ */
/*global URL_PHP */
/*global popUp */

//Article class
function Article(options){
    
    //Create and initialize article properties when object it is created 
    if(options){
        this.id          = options.id || 0;
        this.title       = options.title;
        this.content     = options.content;
        this.category    = options.category || "";
        this.category_id = (options.catExist == "1") ? options.category_id : "";
        this.cat_active  = options.catExist || 1;
        this.img         = options.main_image_url ? "/Blog/API/uploads/" + options.main_image_url :  "/Blog/Resources/image_comming_soon.png";
        this.userId      = options.user_id || 0;
        this.userName    = options.userName || options.userEmail || "anonymus";
        this.published   = options.published || 0;
        this.dateCreate  = options.creation_date || "Unknown";
        this.dateModif   = options.last_modified || "Never";
        this.commCount   = options.commCount || 0;
    }
} //End class 

//Method for updating article
Article.prototype.update = function(articleData){
    //here we should save the data to the server
    //do an AJAX request or save it in the local storage
    
    var that = this;                                                            //save current object
	
	 //prepare user data containing image to upload
	 var formData = new FormData();                                             
	 formData.append("id", articleData.id);
	 formData.append("main_image_url",articleData.img);
  	 formData.append("title", articleData.title);
	 formData.append("content", articleData.content);
	 formData.append("category_id",articleData.category_id);
	 formData.append("published", articleData.published);
	 
	 //configure request for uploading pictures/file and article data
	 var config = {
	 	
	 	        url: URL_PHP + "articles/edit",                                 //PHP API path
             method: "POST",                                                    //Request method type to use 
               data: formData,                                                  //Data for PHP API
        processData: false,                                                     //To send DOMDocument or non processed data file it is set to false
	    contentType: false,                                                     //used for multipart/form-data forms that pass files
	   
	    //function to execute in case of req. succeded
        success: function(response){
        	//not used
        },
        
        //function to execute in case of req. fails
        error: function(xhr,status,error){
        	popUp("error","Oops!Request to update article failed!",xhr.responseText);
        },
        
        //function to execute when req. is completed
        complete: function(){
        	//not used
        }
    };
    
    return $.ajax(config); //send request to the server and return the result
   
}; //END update method

//Method to get article by ID
Article.prototype.getArticleById = function(id){
    
    //AJAX request configuration
    var config={
             url: URL_PHP + "article",                                          //PHP API path
          method: "GET",                                                        //Request method type to use
        dataType: "JSON",                                                       //expected response type
            data: {                                                             //data for PHP API
                articleId: id,
            },
            
        //function to execute in case of req. fails
        error: function(xhr,statusText,errorThrown){
            popUp("error","Oops! Request for article failed!",xhr.responseText);
        }
    };
    
    return $.ajax(config);                                                      //send request to server and return response to the view

}; //END getArticlebyId method
