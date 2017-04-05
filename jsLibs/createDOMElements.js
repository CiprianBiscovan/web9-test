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

//create article element and send it to caller;
function createArticleElement(art){

   var articleElem = $("<article id='Article" + art.id + "'></article>");
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
    var commentElem = $("<div class='comment'></div>");
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
                "</section>"
    commentSection.append(html);
    commentSection.find("#post-comment").click(newCommentClick);
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
    //event.preventDefault();
    event.stopPropagation();
    var article = new Article();
    console.log(article);
//	console.log("Edit article");

}//END EditArticleClick

//Delete Article click event handler
function deleteArticleClick(event){
    // event.preventDefault();
     event.stopPropagation();
     var articles = new Articles();
     console.log(articles);
//	console.log("delete article");

}//END deleteArticleClick

//Edit Comment click event handler
function editCommentClick(event){
    //event.preventDefault();
    event.stopPropagation();
	console.log("Edit comment");
}//END editCommentClick

//Delete Comment click event handler
function deleteCommentClick(event){
    // event.preventDefault();
     event.stopPropagation();
	console.log("delete comment");
}//END deleteComentClick

//New Comment click event handler
function newCommentClick(event){
    //event.preventDefault();
    event.stopPropagation();
	console.log("Add comment");
}//END newCommentClick