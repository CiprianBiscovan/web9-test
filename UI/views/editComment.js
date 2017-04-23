/*global $*/
$(document).ready(onHtmlLoaded);

var user = new User();
var comment = undefined;

if(user.isLogged === false){
    window.location.href = UI_PAGE + "unauthorizedAccess.html";
}
function onHtmlLoaded(){
    
    
if(user.isLogged === false){
    return;
}
    var commentId = getUrlParam('id');
    var comment = new Comment();
    var buttonSave = $('#save-comment');
    var buttonCancel = $('#cancel-edit');
    
    //Subscribe to click events
    buttonSave.on('click',saveCommentClick);
    buttonCancel.on('click',redirect);
    
    comment.getComment(commentId,user.userId).done(displayComment);
}

// ------------------------------------------------DOM Manipulation------------------------------------------------------------
//create comment element and send it to caller
function createCommentElement(comm){
   var commentElem = $('#comment-element-container');
    commentElem.append("<h4>" + comm.title + "</h4>")
               .append("<div id='comm-author'><em>Posted by:" + comm.userName + "</em></div>")
               .append("<div id='comm-created'><em>On:" + comm.dateCreate + "</em></div>")
               .append("<div id='comm-content'><p>" + comm.content +"</p></div>")
               .append("<em id='comm-updated'>Updated: "+comm.dateModif+"</em>");
    return commentElem;
}//END createCommentElement

function displayComment(response){
  
    if(response.length > 0){
        comment = new Comment(response[0]);
        createCommentElement(comment);
        $("input[name='commTitle']").val(comment.title);
        $("textarea[name='commContent']").val(comment.content);
        if(user.loggedUserId !== comment.userId){
            $('h1').html("You can edit only youre own comments!");
        }else{
            $('h1').html("Edit comment!");
        }
        
    }else{
        console.log(response.message);
    }
}

//New Comment click event handler
function saveCommentClick(event){
	var comTitle   =  $("input[name='commTitle']").val();
    var comContent = $("textarea[name='commContent']").val();
    
	if(comTitle.length === 0 || comContent.length === 0){
	    $('#error-comment>p').html('*Please fill in both Title and Content for your comment!');
	    return;
	}
	else{
	    $('#error-comment>p').html('*');
	}

	if(comment.userId !== user.loggedUserId){
	    $('#error-comment>p').html('*You can edit only youre own comments!');
	    return;
	}else{
	    $('#error-comment>p').html('*');
	}

	if(comment !== undefined){

	    var comm = {
	        title: comTitle,
	        content: comContent,
	        article_id: comment.articleId,
	        user_id:user.loggedUserId,
	        id: comment.id
	    };
	  
	    var cmnt = new Comment();
	    cmnt.update(comm).done(updateComplete);
	}
	else{
	    console.log("Error saving comment");
	}
	
}//END saveCommentClick

//Callback function for add/delete/update ajax requests
function updateComplete(response,textStatus,jqXHR){
    if(response && response.success === true){
        console.log(response.message);
       redirect();
    }else{
        console.log(response.message);
    }
    
}//END commentsOperation callback function

//Function for redirecting user after comment editing
function redirect(){
  if(comment !== undefined){
        window.location.href = UI_PAGE + 'article.html?id=' + comment.articleId;
    }else{
        window.location.href = UI_PAGE + "articles.html";
    }
}//END redirect function

// ---------------------------------------------------------------/Events Handle-----------------------------------------------------------

//util function, will return the url param for the provided key
    function getUrlParam(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null){
           return null;
        }
        else{
           return results[1] || 0;
        }
    }

