/*global $ URL_PHP Article*/

//Articles class
function Articles(){
	this.models = []; // articles list
}

// Method to get all articles from DB
Articles.prototype.getAll = function() {
	   
	    var that = this; //save current object instance
		
		//Configure request for getting articles from server
		var config = {
			
			url: URL_PHP + "articles", //URL points to articles php page
			method: "GET",             //Method used - GET
			
			// Function to execute in case of req. succeded
			success: function(resp) {
			 
				//load articles received from server to articles list
				for (var i=0; i<resp.length; i++) {
					var article = new Article(resp[i]);
					that.models.push(article);
				}
			},
			
			//function to execute in case of request fails
			error: function(){
				console.log("Something went wrong while getting articles");
			}
		};
		
	return $.ajax(config); //send request to the server and return result received
};//END getAll method

//Method for retrieving number of articles stored in DB
Articles.prototype.Count = function(){
	var config = {
		url: URL_PHP + "articles/count",
		method:'GET',
		dataType: 'JSON',
		error: function(){
			console.log("Oops! Somethign went wrong while counting articles");
		}
	};
	
	return $.ajax(config); //send request and return server response;
	
};//END Count method

//Method for getting articles for current page
Articles.prototype.getPageArticles = function(pageNum,pageSize){

	var that = this; //save current object instance
	 
	var config = {
		
		url: URL_PHP + "articles/page",
		method:'GET',
		dataType: 'JSON',
		data:{
			pageNum: pageNum,
			pageSize: pageSize
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
		error: function(){
			console.log("Oops! Somethign went wrong while counting articles");
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
		url: URL_PHP + "articles/delete",
		method: 'DELETE',
		data: {
			id: articleId	
		},
		//function to be executed in case of error
		error: function(){
			console.log("Oops! Something went wrong while trying to delete article");
		}
	};
	
	return $.ajax(config); //send request to the server and return the response
	
	
	
};//END Delete Article method

//Method to save new article
Articles.prototype.save = function(articleData) {

	var that = this; //save current object
	
	 //prepare data with image to upload
	 var formData = new FormData();
	 formData.append("main_image_url",articleData.img);
  	 formData.append("title", articleData.title);
	 formData.append("content", articleData.content);
	 formData.append("category_id",articleData.category_id);
	 formData.append("published", articleData.published);
	 
	 //configure request for uploading pictures/file
	 var config = {
	 	
	 	url: URL_PHP + "articles/add",
        method: "POST",
        data: formData,
        processData:false,        // To send DOMDocument or non processed data file it is set to false
	    contentType: false,
	   
	    //function to execute in case of req. succeded
        success: function(response){
        	//not used
        },
        
        //function to execute in case of req. fails
        error: function(xhr,status,error){
        	alert("Oops!Something is wrong" + error);
        },
        
        //function to execute when req. is completed
        complete: function(){
        	//not used
        }
    };
    
    return $.ajax(config); //send request to the server and return the result
    
}; //END Save Article Method
