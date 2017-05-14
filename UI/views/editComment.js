/*global $*/
/*global User Comment*/
/*global UI_PAGE*/
/*global popUp setError resetError logout*/

//always check if HTML is loaded before doing anything
//HTML operations on view
$(document).ready(onHtmlLoaded);

//global variables
var user    = new User();                                                       //Get logged User
var comment = undefined;                                                    

//Check if user is logged or redirect to unauthorizedAccess page
if(user.isLogged === false){
    window.location.href = UI_PAGE + "unauthorizedAccess.html";
}

//Function executed after document is fully loaded
function onHtmlLoaded(){
    
    //if no user is logged in stop script execution
    if(user.isLogged === false){
        return;
    }
    
    var commentId    = getUrlParam('id').replace("Comment","");                 //Get comment id and remove "Comment" text to get actual ID from database"
    var comment      = new Comment();                                           //New comment object
    var buttonSave   = $('#save-comment');                                      //Save button reference          
    var buttonCancel = $('#cancel-edit');                                       //Cancel button reference
    
    //Create top menu 
    addTopMenu();
    
    //Subscribe to click events
    buttonSave.on('click',saveCommentClick);
    buttonCancel.on('click',redirect);
    
    
    comment.getComment(commentId,user.userId).done(displayComment);             //Get comment from DB and display it
}

// ------------------------------------------------DOM Manipulation------------------------------------------------------------

//Create top menu 
function addTopMenu(){
    
    //Get existing containers
    var topMenu = $("#top-menu");
    var usernameContainer = $("#username-wrapper");
    var btnsContainer = $("#buttons-wrapper");
    
    //Determin role icon to be used based on logged user role
    var roleIcon = '';
	if (user.loggedUserRole === 'ADMIN'){
		roleIcon = "&#9812;";
	}else{
		roleIcon = "&#9817;";
	}
    
    // For logged in user add username and logout button
    // for no logged user add login button
    if(user.isLogged) {
        usernameContainer.append("<h3 id='username'><span>"+ roleIcon + "</span> " + user.loggedUserName + "</h3>");
        btnsContainer.append("<button id='logout' class='red'><span><i class='fa fa-power-off'></i></span>Logout</button>");
    }else{
        btnsContainer.append("<button id='login' class='green'><span><i class='fa fa-key'></i></span>Login</button>");
    }
    
    //Subscribe buttons to click events    
    topMenu.children().find('button').click(topMenuClick);
    
}//END addTopMenu function

//create comment element and return it to caller
function createCommentElement(comm){
    
   var commentElem = $('#comment-element-container');                           //Get existing container for comment
   
   //Variables for formatted dates
   var dateCreated;
   var dateUpdated;
   
   //Options for date formatting
   var options = { /*weekday: 'long',*/ year: 'numeric', month: 'long', day: 'numeric',hour:'numeric',minute:'numeric' };
   
   //Format dates
   if( !isNaN(Date.parse(comm.dateCreate)) ){
       dateCreated = new Date(comm.dateCreate).toLocaleString('en-GB', options); //format date
   }else{
       dateCreated = 'Unknown';
   }
   if( !isNaN(Date.parse(comm.dateModif)) ){
       dateUpdated = new Date(comm.dateModif).toLocaleString('en-GB', options); //format date
   }else{
       dateUpdated = 'Never';
   }
   
    //Create comment element and add needed info
    commentElem.append("<div class='comm-title'><h3>" + comm.title + "</h3></div>")
               .append("<div class='comm-author comm-details'><strong>Posted by: </strong><em>" + comm.userName + "</em></div>")
               .append("<div class='comm-created comm-details'><strong>on: </strong><em>" + dateCreated + "</em></div>")
               .append("<div class='comm-updated comm-details'><strong>Updated: </strong><em>"+dateUpdated+"</em></div>")
               .append("<div class='clearfix'></div>")
               .append("<div class='comm-content'><p>" + comm.content +"</p></div>");
               
    return commentElem;
    
}//END createCommentElement

//Dispaly comment received from DB
function displayComment(response){
  
    if(response.length > 0){
        
        comment = new Comment(response[0]); 
        createCommentElement(comment);
        $("input[name='commTitle']").val(comment.title);
        $("textarea[name='commContent']").val(comment.content);
        
        //Check if current user is comment owner
        if(user.loggedUserId !== comment.userId){
            $('h1').html("You can edit only youre own comments!").addClass("font-red").removeClass("font-green");
        }else{
            $('h1').html("Edit comment!").addClass("font-green").removeClass("font-red");
        }
        
    }else{
        popUp("error",response.message);
    }
}

//New Comment click event handler
function saveCommentClick(event){
    
    //Get user input data
	var comTitle   =  $("input[name='commTitle']").val();
    var comContent = $("textarea[name='commContent']").val();
    
    //Validate user input data
	if(comTitle.length === 0 || comContent.length === 0){
	   setError($('#error-comment'),"*Please fill in both Title and Content for your comment!");
	    return;
	}
	else{
	    resetError($('#error-comment'));
	}
    
    //Check if current user is comment owner
	if(comment.userId !== user.loggedUserId){
	    setError($('#error-comment'),"*You can edit only your own comments!");
	    return;
	}else{
	    resetError($('#error-comment'));
	}
    
    //Update comment in DB
	if(comment !== undefined){
        
        //Build new comment object
	    var comm = {
	             title: comTitle,
	           content: comContent,
	        article_id: comment.articleId,
	            userId: user.loggedUserId,
	                id: comment.id
	    };
	     
	    var cmnt = new Comment();                                               //create new comment object
	    cmnt.update(comm).done(updateComplete);                                 //call update comment function 
	}
	else{
	    popUp("error","Error saving comment!","Original comment reference is lost or not available.");
	}
	
}//END saveCommentClick

//Callback function for add/delete/update ajax requests
function updateComplete(response,textStatus,jqXHR){
    
    if(response && response.success === true){
        popUp("success",response.message);
        setTimeout(redirect,1000);
        
    }else{
        popUp("error",response.message);
    }
    
}//END commentsOperation callback function

//Redirect user after comment edit is finished
function redirect(){
    
  if(comment !== undefined){
        window.location.href = UI_PAGE + 'article.html?id=' + comment.articleId;
    }else{
        window.location.href = UI_PAGE + "articles.html";
    }
}//END redirect function

//Handle mouse click on elements from top menu
function topMenuClick(){
  
   var clicked = $(this);                                                       //get clicked element
   
   //Determine clicked button
   switch (clicked.attr('id')){
       
       case 'login':
           window.location.href = UI_PAGE + "login.html";
       break; 
       case 'logout':
           logout();
       break;
       case 'new-article':
           window.location.href = UI_PAGE + "newArticle.html";
       break;
       case 'contact-us':
           window.location.href = UI_PAGE + "contactUs.html";
       break;
       case 'go-to-articles':
             window.location.href = UI_PAGE + "articles.html";
       break;
   }
}//END topMenuCLick() function

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

