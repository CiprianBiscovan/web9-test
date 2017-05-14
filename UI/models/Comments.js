/*global $ URL_PHP*/
/*global popUp */

//Comment class
function Comments(options){

   
} //END Class

//Method for getting all comments from server
Comments.prototype.getAll= function(){
    
    var that = this;                                                            //save current object
    
    //Configure the request for comments
    var config = {
           url: URL_PHP + "comments",                                           //PHP API path
        method: "GET",                                                          //req. method to be used
       
        //function to execute on req. fail
        error: function(xhr){
            popUp("error","Oops! Request for all comments failed!",xhr.responseText);
        }
        
    }; //END Config Object
    
    return $.ajax(config);                                                      //send req. to server and return the response

};//END getAll function

//Function for getting all comments from server
Comments.prototype.commentsCount= function(articleId){
    
    //Configure the request for comments
    var config = {
           url: URL_PHP + "comments/count",                                     //PHP API path
        method: "GET",                                                          //req. method to be used
          data: {                                                               // data for PHP API
                article_id: articleId
          },
        
        //function to execute on req. fail
        error: function(xhr){
            popUp("error","Oops! Request for comments count failed!",xhr.responseText);
        }
        
    }; //END Config Object
    
    return $.ajax(config);                                                      //send req. to server and return the response
    
};//END getAll function


//Function for getting all comments for given article
Comments.prototype.getCommentsForArticle = function(articleId,page,pageSize){
    
    var that = this;                                                            //save current object
    
    //Configure the request for comments
    var config = {
           url: URL_PHP + "comments/forArticle",                                //PHP API path
        method: "GET",                                                          //req. method to be used
          data: {                                                               //data for PHP API
                article_id: articleId,
                      page: page,
                  pageSize: pageSize
        },
       
        //function to execute on req. fail
        error: function(xhr){
            popUp("error","Oops! Request for comments failed",xhr.responseText);
        }
        
    }; //END Config Object
    
    return $.ajax(config);                                                      //send req. to server and return the response
    
};//END getCommentsForArticle

//Method for adding comment
Comments.prototype.add = function(comm){
    
    //AJAX configuration object
    var config = {
           url: URL_PHP + "comments/add",                                       //PHP API path
        method:'POST',                                                          //Req. method to be used
          data: {                                                               //data for PHP API
                   title: comm.title,
                 content: comm.content,
              article_id: comm.article_id
        },
        
        //function to execute in case of request fail
        error: function(xhr){
            popUp("error","Oops! Request to add comment failed!",xhr.responseText);
        }
    };
    
    return $.ajax(config);                                                      //send request to the server and return the result
    
};//End ADD method