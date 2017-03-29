function Articles(){
	this.models = [];
}

Articles.prototype.findArticleById = function(id) {
	var result;
	for (var i=0; i<this.models.length; i++) {
		if (this.models[i].id == id) {
			result = this.models[i];
		}
	}
	return result;
};

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
	    var that = this;
		var config = {
		url: URL_PHP + "articles",
		method: "GET",
		success: function(resp) {
			console.log(resp);
			for (var i=0; i<resp.length; i++) {
				var article = new Article(resp[i]);
				that.models.push(article);
			}
		},
		error: function(){
			console.log("Something went wrong while getting articles");
		}
	}
	return $.ajax(config);
};

Articles.prototype.removeArticle = function(articleId) {
	//here we will search for article model by id
	//and we remove it from models array and from 
	//server/localStorage
};

Articles.prototype.save = function(articleData) {
	//here we should save the new article to server
	
	// var articles = new Articles();
	// var strModels;
	
	// articles.getAll();
	// articles.models.push(articleData);
	// strModels = JSON.stringify(articles.models);
	
	// localStorage.setItem("articles",strModels);
	console.log(articleData);
	 var that = this;
	 var formData = new FormData();
	formData.append("main_image_url",articleData.img);
	formData.append("title", articleData.title);
	formData.append("content", articleData.content);
	formData.append("user_id", "1");
	formData.append("category_id", "1");
	
    var config = {
     
       url: URL_PHP + "articles/add",
        method: "POST",
        // data: {
        // title:articleData.title,
        // content: articleData.content,
        // category_id: articleData.catId,
        // user_id: articleData.userId,
        // main_image_url: articleData.img
        // },
       data: formData,
       	processData:false,        // To send DOMDocument or non processed data file it is set to false
		contentType: false,
        success: function(response){
            console.log(response);
        },
        error: function(xhr,status,error){
            alert("Oops!Something is wrong" + error);
        },
        complete: function(){
            console.log("The request is complete!");
        }
    };
    return $.ajax(config);
};
