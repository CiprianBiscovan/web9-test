/*global $ URL_PHP Article*/

//Articles class
function Articles(){
	this.models = []; // articles list
}

//Method to get selected article
//Articles.prototype.findArticleById = function(id) {
	//USED WHEN DATA WAS STORED ON LOCAL STORAGE
	// var result;
	// for (var i=0; i<this.models.length; i++) {
	// 	if (this.models[i].id == id) {
	// 		result = this.models[i];
	// 	}
	// }
	// return result;
	//----------------------------------------------
	
	
//}; //END FindArticleById method

// Method to get all articles from DB
Articles.prototype.getAll = function() {
	//get all article items from server/localStorage
	// var articlesStr = localStorage.getItem("articles");
	// var articles = JSON.parse(articlesStr);
	// //reset models for current object
	// this.models = [];
	// if (articles) {
	// 	for (var i=0; i<articles.length; i++) {
	// 		var article = new Article(articles[i]);
	// 		this.models.push(article);
	// 	}

	// 	console.log(articles);
	// 	console.log(this.models);
	// }
	//-------------------------------------------------------------
	   
	    var that = this; //save current object instance
		
		//Configure request for getting articles from server
		var config = {
			
			url: URL_PHP + "articles", //URL points to articles php page
			method: "GET",             //Method used - GET
			
			// Function to execute in case of req. succeded
			success: function(resp) {
				//console.log(resp);
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
};//END Delete Article method

//Method to save new article
Articles.prototype.save = function(articleData) {
	//here we should save the new article to server
	
	// var articles = new Articles();
	// var strModels;
	
	// articles.getAll();
	// articles.models.push(articleData);
	// strModels = JSON.stringify(articles.models);
	
	// localStorage.setItem("articles",strModels);
	//---------------------------------------------------
	
//	console.log(articleData);

	var that = this; //save current object
	 
	 //prepare data with image to upload
	 var formData = new FormData();
	 formData.append("main_image_url",articleData.img);
  	 formData.append("title", articleData.title);
	 formData.append("content", articleData.content);
	 formData.append("user_id", "1");
	 formData.append("category_id", "1");
	 
	 //configure request for uploading pictures/file
	 var config = {
	 	
	 	url: URL_PHP + "articles/add",
        method: "POST",
        data: formData,
        processData:false,        // To send DOMDocument or non processed data file it is set to false
	    contentType: false,
	   
	    //function to execute in case of req. succeded
        success: function(response){
        	console.log(response);
        },
        
        //function to execute in case of req. fails
        error: function(xhr,status,error){
        	alert("Oops!Something is wrong" + error);
        },
        
        //function to execute when req. is completed
        complete: function(){
        	console.log("The request is complete!");
        }
    };
    
    return $.ajax(config); //send request to the server and return the result
    
}; //END Save Article Method
