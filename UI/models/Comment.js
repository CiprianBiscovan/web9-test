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

//Method for edit comment
Comment.prototype.update= function(comm){
    
    var config = {
        url:URL_PHP + "comments/edit",
        method:'PUT',
        data: {
            title: comm.title,
            content: comm.content,
            article_id: comm.article_id,
           user_id: comm.userId
        },
        
        //function to execute in case of request fail
        error: function(){
            console.log("Oops! Somethign went wrong while trying to edit comment");
        }
    };
    
    return $.ajax(config); //send request to the server and return the result
};//End EDIT method

//Method for edit comment
Comment.prototype.delete= function(commId,loggedUserId){
    
    var config = {
        url:URL_PHP + "comments/delete",
        method:'DELETE',
        data: {
            id: commId,
            userId: loggedUserId
        },
        
        //function to execute in case of request fail
        error: function(){
            console.log("Oops! Somethign went wrong while trying to delete comment");
        }
    };
    
    return $.ajax(config); //send request to the server and return the result
};//End EDIT method