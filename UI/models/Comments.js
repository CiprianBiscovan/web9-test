/*global $ URL_PHP*/
//Comment class
function Comments(options){

   
} //END Class

//Function for getting all comments from server
Comments.prototype.getAll= function(){
    
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

//Function for getting all comments from server
Comments.prototype.commentsCount= function(articleId){
    
    //Configure the request for comments
    var config = {
        url:    URL_PHP + "comments/count",
        method: "GET",
        data:{
            article_id: articleId
        },
        //function to execute on req. fail
        error: function(response){
            console.log(response);
            console.log("Oops! Something went wrong while getting comments");
        }
    }; //END Config Object
    
    return $.ajax(config); //send req. to server and return the response
};//END getAll function


//Function for getting all comments for given article
Comments.prototype.getCommentsForArticle = function(articleId,page,pageSize){
    
    var that = this; //save current object
    
    //Configure the request for comments
    var config = {
        url:    URL_PHP + "comments/forArticle",
        method: "GET",
        data:{
            article_id: articleId,
            page:page,
            pageSize:pageSize
        },
       
        //function to execute on req. fail
        error: function(response){
            console.log(response);
            console.log("Oops! Something went wrong while getting comments");
        }
    }; //END Config Object
    
    return $.ajax(config); //send req. to server and return the response
}//END getCommentsForArticle

//Method for adding comment
Comments.prototype.add = function(comm){
    
    var config = {
        url:URL_PHP + "comments/add",
        method:'POST',
        data: {
            title: comm.title,
            content: comm.content,
            article_id: comm.article_id
        },
        
        //function to execute in case of request fail
        error: function(){
            console.log("Oops! Somethign went wrong while trying to add comment");
        }
    };
    
    return $.ajax(config); //send request to the server and return the result
};//End ADD method