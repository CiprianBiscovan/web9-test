/*global $*/

	var isAdmin = false;
	var isLogged = false;
	var loggedUserId = '';
	var loggedUserName='';
	var loggedUserRole='';
//check if user is logged In
	if($.cookie("loggedIn")){
		// $("body").append("<h1>401 - Unauthorized page access</h1>").append("<a href = '" + UI_PAGE +"login.html'>Login</a>");
		// return;
		isLogged = true;
		var loggedUser = JSON.parse($.cookie("loggedIn"));
		loggedUserId = loggedUser.id;
		loggedUserName = loggedUser.name;
		loggedUserRole = loggedUser.role.toUpperCase();
		if(loggedUser.role.toLowerCase() === 'admin'){
			isAdmin = true;
		}
	}
//Create top menu 
function addTopMenu(){
    var topMenu = $("#top-menu");
   
        isLogged ? topMenu.append("<h3>"+ loggedUserRole + ": " + loggedUserName + "</h3>").append("<button id='logout'>Logout</button>") :
                   topMenu.append("<button id='login'>Login</button>");
        
        isAdmin ? topMenu.append("<button id='new-article'>New Article</button>") :
                  topMenu.append("<button id='contact-us'>Contact Us</button>");
     
        topMenu.children().click(topMenuClick);
    
}//END addTopMenu function

//create link to Articles page
function addArticlesLink(){
    var topMenu = $("#top-menu");
    topMenu.append("<button id='go-to-articles'>Articles</button>");
    topMenu.children().click(topMenuClick);
}

//function create content for unathorized page access
function unauthorizedPage(){
    $(document.body).append($("<button id='login'>Login</button>").click(topMenuClick))
           .append($("<button id='go-to-articles'>Articles</button>").click(topMenuClick));
           
}

//create article element and send it to caller;
function createArticleElement(art){

   var articleElem = $("<article id='Article" + art.id + "' data-value='" + art.id + "'></article>");
    articleElem.append("<h1>" + art.title + "</h1>")
               .append("<div id='article-author'><strong><em>Posted by:" + art.userName + "</em></strong></div>")
               .append("<div id='article-category'><strong><em>About:" + art.category + "</em></strong></div>")
               .append("<div id='img-container'><img class='main-img' height='150px' src= " + art.img + " alt='Main Image'></div>")
               .append("<div id='article-content'><p>" + art.content +"</p></div>")
               .append("<em id='article-created'>Created: "+art.dateCreate+"</em>")
               .append("<em id='article-updated'>Updated: "+art.dateModif+"</em>")
               .append("<div id='comm-count'>" + art.commCount + " comments </div>");
    
    if(isAdmin){
        articleElem.append($("<button id='edit-article'>Edit</button>").click(editArticleClick))
                   .append($("<button id='delete-article'>Delete</button>").click(deleteArticleClick));
    }
    
    return articleElem;
}
//create comment element and send it to caller
function createCommentElement(comm){
    var commentElem = $("<li id='"+comm.id+"' class='comment'></li>");
    commentElem.append("<h4>" + comm.title + "</h4>")
               .append("<div id='comm-author'><em>Posted by:" + comm.userName + "</em></div>")
               .append("<div id='comm-created'><em>On:" + comm.dateCreate + "</em></div>")
               .append("<div id='comm-content'><p>" + comm.content +"</p></div>")
               .append("<em id='comm-updated'>Updated: "+comm.dateModif+"</em>");
   
    if(comm.userId === loggedUserId){
        commentElem.append($("<button id='edit-article'>Edit</button>").click(editCommentClick))
                   .append($("<button id='delete-article'>Delete</button>").click(deleteCommentClick));
    }  
    else if(isAdmin){
        commentElem.append($("<button id='delete-article'>Delete</button>").click(deleteCommentClick));
    }
    return commentElem;
}

//function to create add comment section
function addCommentSection(){
    var commentSection = $("#new-comment");
    var html = "<section id='add-comment'>" +
               "<h3>Your opinion matters:</h3> " +
               "<input type='text' name='commTitle' placeholder='Title'/>" +
                "<br>" +
                "<textarea name='commContent' placeholder='Your comment'rows='10' cols='40'></textarea>" +
                "<br>" +
                "<button id='post-comment'>Add comment</button>" +
                "<div id='error-comment'><p>*</p></div>" +
                "</section>"
    commentSection.append(html);
    commentSection.find("#post-comment").click(saveCommentClick);
}//END addCommentSection funtion

 //function for creation of pagination menu
 function createArticlesNavigation(pages){

	var pagesContainer = $(".pagination-pages"); //Get container for pages
	var stepContainer = $(".pagination-step");  //Get container for Newer/Older buttons
	
	//Add Newer Older buttons
	stepContainer.append(newPage("previous","<-Older")); //Add Older button
	stepContainer.append(newPage('next','Newer->'));     //Add Newer Button
	
	//create pages menus
		pagesContainer.append(newPage('first','&laquo;')); //Add << button
	
	//Add each page and make page 1 active
	for(var i = 1; i <= pages; i++){
		pagesContainer.append(newPage(i,i));   
	}
	pagesContainer.append(newPage('last','&raquo;')); //Add >> button
	
	//Manage visual aspects
	$("#previous").addClass('hidden'); //hide Older button in the begining
	$("#first").addClass('disabled'); //disable first button
	
	//if only one page - hide Newer button and disable last button
	if(pages == 1){
	$("#next").addClass('hidden');
	$("#last").addClass('disabled');
	}
	$("#1").addClass('active'); //Set first page as active
    
}//END createArticlesNavigation

function newPage(id,text){
     return $("<a id='" + id + "' href='#'>" + text + "</a>").click(navigate);
}

function topMenuClick(){
  
   var clicked = $(this);
   
   switch (clicked.attr('id')){
       case 'login':
       case 'logout':
           window.location.href = UI_PAGE + "login.html";
       break;
       case 'new-article':
           window.location.href = UI_PAGE + "newArticle.html";
       break;
       case 'contact-us':
           window.location.href = UI_PAGE + "ContactUs.html";
       break;
       case 'go-to-articles':
             window.location.href = UI_PAGE + "articles.html";
       break;
   }
}

//Edit Article click event handler
function editArticleClick(event){
  
    event.stopPropagation();
    var article = new Article();
    var markedId = $(this).parents('article').attr("data-value");
    window.location.href = UI_PAGE + "newArticle.html?id=" + markedId;

}//END EditArticleClick

//Delete Article click event handler
function deleteArticleClick(event){
  
     event.stopPropagation();
     var articles = new Articles();
     var markedId = $(this).parents('article').attr("data-value");
     
     if(markedId){
         articles.removeArticle(markedId).done(deleteResponse);
     }else{
         console.log("error getting article ID");
     }


}//END deleteArticleClick

//Edit Comment click event handler
function editCommentClick(event){
    //event.preventDefault();
    event.stopPropagation();
    
    var target = $(this);
    var comTitle = target.siblings('h4').html();
    var comContent = target.siblings('#comm-content').children('p').html();
    var commentSection = $("#new-comment");
    var saveButton = $("<button id='update-comment'>Save</button>");
    var cancelButton = $("<button id='cancel-update'>Cancel</button>");
    saveButton.on('click',saveCommentClick);
    cancelButton.on('click',cancelUpdateClick);
    $('#post-comment').remove();
    saveButton.remove();
    cancelButton.remove();
    commentSection.append(saveButton)
                  .append(cancelButton);
                  
    commentSection.children().find("input[name='commTitle']").val(comTitle);
    commentSection.children().find("textarea[name='commContent']").val(comContent);
}//END editCommentClick

//Delete Comment click event handler
function deleteCommentClick(event){
    // event.preventDefault();
     event.stopPropagation();
	var commentId = $(this).parents('li').attr('id');
	if(commentId){
	  var comment = new Comment();
	  comment.delete(commentId,loggedUserId).done(commentsOperation);
	}else{
	  console.log("Delete comment fail!");  
	}
}//END deleteComentClick

//New Comment click event handler
function saveCommentClick(event){
    //event.preventDefault();
    event.stopPropagation();
	//console.log("Add comment");
	
    var comTitle = $('input[name="commTitle"]').val().trim();
    var comContent = $('textarea[name="commContent"]').val().trim();
	var articleId = $('article[data-value]').attr('data-value');
	
	if(comTitle.length === 0 || comContent.length === 0){
	    $('#error-comment>p').html('*Please fill in both Title and Content for your comment!');
	    return;
	}
	else{
	    $('#error-comment>p').html('*');
	}
	
	
	if(articleId){

	    var comm = {
	        title: comTitle,
	        content: comContent,
	        article_id: articleId,
	        user_id:loggedUserId
	    }
	    
	    if(this.id === "post-comment" )	{
	        var comment = new Comments();
	        comment.add(comm).done(commentsOperation);
	    }else{
	        var comment = new Comment();
	        comment.update(comm).done(commentsOperation);
	    }
	}
	else{
	    console.log("Error saving comment");
	}
	
}//END saveCommentClick

//Function for building category list in Select element
function fillCategorySelectElement(){
    
    var selectElement = $("#categories"); //get select element container
    var categories = new Categories();    //create Categories instance
    
    selectElement.empty();
    selectElement.append("<option value='' selected>Choose Category</option>")
    //function to get all categories from server and add them to the options list
    categories.getAll().done(function(){
      
        for(var i = 0; i < categories.categoriesList.length; i++){
        selectElement.append("<option value=" + categories.categoriesList[i].id + ">" + categories.categoriesList[i].name + "</option>");
    }
    }); //End fillCategorySelectElement function
    
    
}//END fillCategorySelectElement function

function deleteResponse(response,statusText,jqXHR){

        if(response.success === true){
            console.log(response.message);
            window.location.href = UI_PAGE + "articles.html"; 
        }else{
            console.log(response.message);
        }
}//End manageArticlesOperations

//Callback function for add/delete/update ajax requests
function commentsOperation(response,textStatus,jqXHR){
    if(response && response.success === true){
        console.log(response.message);
        window.location.reload();
    }else{
        console.log(response.message);
    }
}//END commentsOperation callback function

//Function for canceling comment editing
function cancelUpdateClick(){
    $("#new-comment").empty();
    addCommentSection();
}//END cancelUpdate