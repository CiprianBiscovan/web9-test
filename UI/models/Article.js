//Article class
function Article(options){
    if(options){
        this.id          = options.id || 0;
        this.title       = options.title;
        this.content     = options.content;
        this.category    = options.category || "Default Topic";
        this.category_id = options.category_id;
        this.img         = options.main_image_url ? "/Blog/API/uploads/" + options.main_image_url :  "/Blog/Resources/image_comming_soon.png";
        this.userId      = options.user_id || 0;
        this.userName    = options.userName || options.userEmail || "anonymus";
        this.published   = options.published || 0;
        this.dateCreate  = options.creation_date || "Unknown";
        this.dateModif   = options.last_modified || "Never";
        this.commCount   = options.commCount || 0;
    }
}

//Method for updating article
Article.prototype.update = function(data){
    //here we should save the data to the server
    //do an AJAX request or save it in the local storage
    
    //play with git
    
    //added branch
};

//Method to get article by ID
Article.prototype.getArticleById = function(id){
    
    //AJAX request configuration
    var config={
        url: URL_PHP + "article",
        method:"GET",
        data:{
            articleId: id,
        },
        dataType:"JSON",
        
        //function to execute in case of req. fails
        error: function(){
            console.log("Oops! SOmething went wrong while getting article!");
        }
    };
    
    return $.ajax(config); //send request to server and send response to the view
}; //END getArticlebyId method
