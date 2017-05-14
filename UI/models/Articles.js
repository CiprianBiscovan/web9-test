/*global $ URL_PHP Article*/
/*global popUp*/

//Articles class
function Articles(){
	this.models = [];                                                           // articles list
}

//Method for retrieving number of articles stored in DB
Articles.prototype.Count = function(userFilter){

    //Ajax configuration object
	var config = {
		     url: URL_PHP + "articles/count",                                   //PHP API path
	  	  method: 'GET',                                                        //Req. method to be used
		dataType: 'JSON',                                                       //Expected response data type
		data:{                                                                  //data for PHP API
			filter: userFilter
        },
        
        //function executed in case of request fails
		error: function(jqXHR){
			popUp("error","Oops! Request for articles count failed!",jqXHR.responseText);
		}
	};
	
	return $.ajax(config); //send request and return server response;
	
};//END Count method

//Method for getting articles for current page
Articles.prototype.getPageArticles = function(pageNum,pageSize,userFilter){

	var that = this;                                                            //save current object instance
	 
	//AJAX configuration object 
	var config = {
		
		     url: URL_PHP + "articles/page",                                    //PHP API path
		  method: 'GET',                                                        //req. method to be used
		dataType: 'JSON',                                                       //expected response type
		    data:{                                                              //data for PHP API
				 pageNum: pageNum,
				pageSize: pageSize,
				  filter: userFilter
			},
		
		// Function to execute in case of req. succeded
		success: function(resp) {
			
			//load articles received from server to articles list
			for (var i=0; i<resp.length; i++) {
				var article = new Article(resp[i]);
				that.models.push(article);
			}
		},
		
		//function to execute in case of request fails	
		error: function(jqXHR){
			
			popUp("error","Oops! Request for articles for current page failed!",jqXHR.responseText);
		}
	};

	return $.ajax(config); //send request and return server response;
		
};//END Count method

//Method for delete article
Articles.prototype.removeArticle = function(articleId) {
	//here we will search for article model by id
	//and we remove it from models array and from 
	//server/localStorage
	
	//config request for deleting article
	var config = {
		   url: URL_PHP + "articles/delete",                                    // PHP API path
		method: 'DELETE',                                                       // req. method to be used
		  data: {                                                               //data for PHP API
				id: articleId	
		  },
		
		//function to be executed in case of error
		error: function(jqXHR){
			popUp("error","Oops! Request to delete article failed!",jqXHR.responseText);
		}
	};
	
	return $.ajax(config); //send request to the server and return the response
	
};//END Delete Article method

//Method to save new article
Articles.prototype.save = function(articleData) {
	
	 //prepare data containing image to upload
	 var formData = new FormData();
	 formData.append("main_image_url",articleData.img);
  	 formData.append("title", articleData.title);
	 formData.append("content", articleData.content);
	 formData.append("category_id",articleData.category_id);
	 formData.append("published", articleData.published);
	 
	 //configure request for uploading pictures/file
	 var config = {
	 	
	 	        url: URL_PHP + "articles/add",                                  //PHP API path
             method: "POST",                                                    // Method to be used
               data: formData,                                                  // data for PHP API
        processData: false,                                                     // To send DOMDocument or non processed data file it is set to false
	    contentType: false,                                                     //used for multipart/form-data forms that pass files
	   
	    //function to execute in case of req. succeded
        success: function(response){
        	//not used
        },
        
        //function to execute in case of req. fails
        error: function(xhr,status,error){
        	popUp("error","Oops!Request to save article failed!",xhr.responseText);
        },
        
        //function to execute when req. is completed
        complete: function(){
        	//not used
        }
    };
    
    return $.ajax(config);                                                      //send request to the server and return the result
    
}; //END Save Article Method
