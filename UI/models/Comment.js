/*global $ URL_PHP*/
/*global popUp */

//Comment class
function Comment(options){
    
    //Create and initialize comment properties when object is created
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

//Metho to get comment by ID
Comment.prototype.getComment = function(commId){
    
    //AJAX configuration object 
    var config = {
           url: URL_PHP + "comment",                                            //PHP API path
        method: 'GET',                                                          //req. method to be used
          data: {                                                               //PHP API data
                id: commId
          },
        
        //function to execute in case of request fail
        error: function(xhr){
           popUp("error","Oops! Request for comment failed!",xhr.responseText);
        }
    };
    
    return $.ajax(config);                                                      //send request to the server and return the result

    
}; //END get comment method

//Method for edit comment
Comment.prototype.update= function(comm){
    
    //AJAX configurtion object
    var config = {
           url:URL_PHP + "comments/edit",                                       //PHP API path 
        method:'PUT',                                                           //req. method to be used
          data: {                                                               //Data for PHP API
                   title: comm.title,
                 content: comm.content,
              article_id: comm.article_id,
                  userId: comm.userId,
                      id: comm.id
        },
        
        //function to execute in case of request fail
        error: function(xhr){
            popUp("error","Oops! Request to save comment updates failed!",xhr.responseText);
        }
    };
    
    return $.ajax(config);                                                      //send request to the server and return the result

};//End EDIT method

//Method for delete comment
Comment.prototype.delete= function(commId,loggedUserId){
    
    //AJAX configuration object
    var config = {
        
           url: URL_PHP + "comments/delete",                                    //PHP API path
        method:'DELETE',                                                        //req. method to be used
          data: {                                                               //data for PHP API 
                    id: commId,
                userId: loggedUserId
          },
        
        //function to execute in case of request fail
        error: function(xhr){
            popUp("error","Oops! Request to delete comment failed!",xhr.responseText);
        }
    };
    
    return $.ajax(config);                                                      //send request to the server and return the result
    
};//End DELETE method