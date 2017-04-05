/*global $ URL_PHP*/
//Comment class
function Comment(options){
    if(options){
        this.id         = options.id;
        this.title      = options.title;
        this.content    = options.content;
        this.userId    = options.user_id;
        this.userName   = options.nickname || options.userName || "anonymus";
        this.articleId  = options.article_id || 0;
        this.deleted    = options.deleted;
        this.dateCreate = options.creation_date || "Unknown";
        this.dateModif  = options.last_modified || "Never";
    }
} //END Class

//Function for getting all comments from server
Comment.prototype.getAll= function(){
    
    var that = this //save current object
    
    //Configure the request for comments
    var config = {
        url:    URL_PHP + "comments",
        method: "GET",
       
        //function to execute on req. fail
        error: function(){
            console.log("Oops! Something went wrong while getting comments");
        }
    }; //END Config Object
    
    return $.ajax(config); //send req. to server and return the response
}//END getAll function

//Function for getting all comments for given article
Comment.prototype.getCommentsForArticle = function(articleId){
    
    var that = this //save current object
    
    //Configure the request for comments
    var config = {
        url:    URL_PHP + "comments/forArticle",
        method: "GET",
        data:{
            article_id: articleId
        },
        
        //function to execute on req. fail
        error: function(){
            console.log("Oops! Something went wrong while getting comments");
        }
    }; //END Config Object
    
    return $.ajax(config); //send req. to server and return the response
}//END getCommentsForArticle