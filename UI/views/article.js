/*global $*/
/*global Articles Article Comments Comment User*/
/*global UI_PAGE*/

$(document).ready(onHtmlLoaded);

var user = new User();
var commCount = undefined;
var commTotalPages = 0;
var commCurrentPage = 1;
var commPageSize = 5;
var currentArticleId = undefined;
var expectedCommentsNo = undefined;
//always check if HTML is loaded before doing anything
//HTML operations on view
function onHtmlLoaded(){
    
addTopMenu();
// addArticlesLink();

    currentArticleId = getUrlParam("id");  //Get selected article ID
    
    var article = new Article();                                    //create new article instance 
    article.getArticleById(currentArticleId).done(displayArticle);  //request article by id and display it
    
    var comments = new Comments();
    comments.commentsCount(currentArticleId).done(function(response){
        
        if(response.length > 0){
            commCount = response[0].totalComments;
            commTotalPages = Math.ceil(commCount/commPageSize);
        }else{
            commTotalPages = 0;
        }
        if(commTotalPages > 0){
            createCommentsNavigation(commTotalPages);
        }
        
        comments.getCommentsForArticle(currentArticleId,commCurrentPage,commPageSize).done(displayComments);
    });

    //get comments for current article
  
   
  
   
}//END OnHtmlLoaded function

// ------------------------------------------------DOM Manipulation------------------------------------------------------------
//Function for creating top menu 
function addTopMenu(){
    var topMenu = $("#top-menu");
   
        user.isLogged ? topMenu.append("<h3>"+ user.loggedUserRole + ": " + user.loggedUserName + "</h3>").append("<button id='logout'>Logout</button>") :
                   topMenu.append("<button id='login'>Login</button>");
        
        user.isAdmin ? topMenu.append("<button id='new-article'>New Article</button>") :
                  topMenu.append("<button id='contact-us'>Contact Us</button>");
                  
        topMenu.append("<button id='go-to-articles'>Articles</button>");
      
        topMenu.children().click(topMenuClick);
    
}//END addTopMenu function

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
    
    if(user.isAdmin){
        articleElem.append($("<button id='edit-article'>Edit</button>").click(editArticleClick))
                   .append($("<button id='delete-article'>Delete</button>").click(deleteArticleClick));
    }
    
    return articleElem;
}//END createArticleElement

//create comment element and send it to caller
function createCommentElement(comm){
    var commentElem = $("<li id='"+comm.id+"' class='comment'></li>");
    commentElem.append("<h4>" + comm.title + "</h4>")
               .append("<div id='comm-author'><em>Posted by:" + comm.userName + "</em></div>")
               .append("<div id='comm-created'><em>On:" + comm.dateCreate + "</em></div>")
               .append("<div id='comm-content'><p>" + comm.content +"</p></div>")
               .append("<em id='comm-updated'>Updated: "+comm.dateModif+"</em>");
   
    if(comm.userId === user.loggedUserId){
        commentElem.append($("<button id='edit-article'>Edit</button>").click(editCommentClick))
                   .append($("<button id='delete-article'>Delete</button>").click(deleteCommentClick));
    }  
    else if(user.isAdmin){
        commentElem.append($("<button id='delete-article'>Delete</button>").click(deleteCommentClick));
    }
    return commentElem;
}//END createCommentElement

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
                "</section>";
    commentSection.append(html);
    commentSection.find("#post-comment").click(addCommentClick);
}//END addCommentSection funtion
// -------------------------------------------------------------/DOM Manipulation----------------------------------------------------------

// --------------------------------------------------------------NAVIGATION Menu----------------------------------------------------------
//function for creation of pagination menu
 function createCommentsNavigation(pages){

	var pagesContainer = $(".pagination-pages"); //Get container for pages
	
	//create pages menus
		pagesContainer.append(newPage('first','&laquo;')); //Add << button
	
	//Add each page and make page 1 active
	for(var i = 1; i <= pages; i++){
		pagesContainer.append(newPage(i,i));   
	}
	pagesContainer.append(newPage('last','&raquo;')); //Add >> button
	
	//Manage visual aspects
	$("#first").addClass('disabled'); //disable first button
	
	//if only one page - Disable last button
	if(pages == 1){
	$("#last").addClass('disabled');
	}
	$("#1").addClass('active'); //Set first page as active
    
}//END createArticlesNavigation

function newPage(id,text){
     return $("<a id='" + id + "' href='#'>" + text + "</a>").click(navigate);
}
     
//Function to handle navigation buttons clicks
function navigate(){
	var clicked = $(this);                     //get clicked element in the navigation panel
	var currentPage = parseInt($(".active").attr('id'),10); //get current page number
	var futurePage= currentPage;
	switch(clicked.attr('id')){
		case 'first':
			//if the current page is not first page
			if(currentPage > 1){
				futurePage = 1;
			}
		break;
		case 'last':
			//if current page is not last page
			if(currentPage < commTotalPages){
				futurePage = commTotalPages;
			}
		break;
		default:
			var newPage = clicked.attr('id');  //get clicked page number
			//if clicked page is in valid page range
			if(newPage >= 1 && newPage <=commTotalPages){
				futurePage = newPage;
			}
		break;
	} //End Switch
	
	
	
	var comments = new Comments();
	comments.getCommentsForArticle(currentArticleId,futurePage,commPageSize).done(displayComments); //get and display new articles;
	
	//Manage visual spects
	$("a").removeClass('active');           //remove active class for all elements
	$("#" + futurePage).addClass('active'); //activate new page
	
	if(parseInt(futurePage,10) === 1 ){
		$("#first").addClass('disabled');
		$("#last").removeClass('disabled');
	}else if(parseInt(futurePage,10) === commTotalPages ){
		$("#first").removeClass('disabled');
		$("#last").addClass('disabled');
	}
	else{
		$("#first").removeClass('disabled');
		$("#last").removeClass('disabled');
	}
	
}//END Navigation function
// --------------------------------------------------------------/NAVIGATION Menu----------------------------------------------------------

// ---------------------------------------------------------------Events Handle-----------------------------------------------------------

//function for handling mouse click on elements from top menu
function topMenuClick(){
  
   var clicked = $(this);
   
   switch (clicked.attr('id')){
       case 'login':
            window.location.href = UI_PAGE + "login.html";
       case 'logout':
           window.location.href = UI_PAGE + "logout.html";
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

  //Function to display selected Article
    function displayArticle(response){
       
       if(response.length > 0 && (response[0].id === currentArticleId) ){
           var art = new Article(response[0]);
           
           var container = $("#container");
           container.append(createArticleElement(art));
           expectedCommentsNo = art.commCount;
           addCommentSection();
       }
       else{
           console.log("Article received not as expected!");
       }
    }//END displayArticle

 function displayComments(response){
    
        if(response.length > 0 && response[0].article_id === currentArticleId){
            var commentsContainer = $("#comments-list");
            commentsContainer.empty();
            for(var i = 0; i < response.length; i++){
                var comm = new Comment(response[i]);
                commentsContainer.append(createCommentElement(comm));            
            }
        }
        else if(expectedCommentsNo != undefined && expectedCommentsNo != response.length){
             console.log("Comments received not as expected!");
        }
    }

//Edit Article click event handler
function editArticleClick(event){
  
    event.stopPropagation();
    //var article = new Article();
    var markedId = $(this).parents('article').attr("data-value");
    window.location.href = UI_PAGE + "editArticle.html?id=" + markedId;

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

function deleteResponse(response,statusText,jqXHR){

        if(response.success === true){
            console.log(response.message);
            window.location.href = UI_PAGE + "articles.html"; 
        }else{
            console.log(response.message);
        }
}//End deleteResponse

//Edit Comment click event handler
function editCommentClick(event){
    //event.preventDefault();
    event.stopPropagation();
    var commentId = $(this).parents('li').attr('id');
    window.location.href = UI_PAGE + "editComment.html?id="+commentId;
    
}//END editCommentClick

//Delete Comment click event handler
function deleteCommentClick(event){
    // event.preventDefault();
     event.stopPropagation();
	var commentId = $(this).parents('li').attr('id');
	if(commentId){
	  var comment = new Comment();
	  comment.delete(commentId,user.loggedUserId).done(commentsOperation);
	}else{
	  console.log("Delete comment fail!");  
	}
}//END deleteComentClick

//New Comment click event handler
function addCommentClick(event){

    event.stopPropagation();

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
	        user_id:user.loggedUserId,
	    };
	   
	    var comment = new Comments();
	    comment.add(comm).done(commentsOperation);
	    
	}
	else{
	    console.log("Error saving comment");
	}
	
}//END saveCommentClick

//Callback function for add/delete ajax requests
function commentsOperation(response,textStatus,jqXHR){
    if(response && response.success === true){
        console.log(response.message);
        window.location.reload();
    }else{
        console.log(response.message);
    }
    
}//END commentsOperation callback function


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