/*global $*/
/*global Articles Article Comments Comment User*/
/*global UI_PAGE*/
/*global popUp setError resetError logout*/

//always check if HTML is loaded before doing anything
//HTML operations on view
//Call function onHtmlLoaded after page was fully loaded
$(document).ready(onHtmlLoaded);

//global variables
var user = new User();
var commCount = undefined;
var commTotalPages = 0;
var commCurrentPage = 1;
var commPageSize = 5;
var currentArticleId = undefined;

//Function executed after document is fully loaded
function onHtmlLoaded(){
    
    // move article if header height changes during browser resize
	$(window).resize(positionArticle);
	
	//Create top menu (buttons and username)
    addTopMenu();
    
    //initial positioning of articles based on header size 
    positionArticle();
    
    currentArticleId = getUrlParam("id");                            //Get selected article ID
    
    var article = new Article();                                    //Create new article object 
    article.getArticleById(currentArticleId).done(displayArticle);  //Request article by id and display it
   
}//END onHtmlLoaded function

//function for query comments that belongs to this article 
function getComments(){
    
    var comments = new Comments();  //New comments object
    
    //Get comments count for creating navigation pages
    comments.commentsCount(currentArticleId).done(function(response){
        
        //Calculate number of pages or set them to 0 if getComments fails
        if(response.length > 0){
            commCount = response[0].totalComments;
            commTotalPages = Math.ceil(commCount/commPageSize);
        }else{
            commTotalPages = 0;
        }
        
        // If there is at least one page create navigation menu
        //hide navigation until comments are displayed
        if(commTotalPages > 0){
            $('navigation').addClass('hidden');
            createCommentsNavigation(commTotalPages);
            comments.getCommentsForArticle(currentArticleId,commCurrentPage,commPageSize).done(displayComments);
        }
        
    }); //END commentsCount function
    
    
}//END getComments function

// ------------------------------------------------DOM Manipulation------------------------------------------------------------

//Function for creating top menu and append it to it`s existing container
function addTopMenu(){
    
    var topMenu = $("#top-menu");            //Get container
    var roleIcon = '';                       //User role variable
    
    //Determin icon to use based on user role
    // Crown for admin
    // Pion for user
	if (user.loggedUserRole === 'ADMIN'){
		roleIcon = "&#9812;";
	}else{
		roleIcon = "&#9817;";
	}
   
    //If any user is logged add username and logout button else display login button
    user.isLogged ? topMenu.append("<h3 id='username'><span>"+ roleIcon + "</span> " + user.loggedUserName + "</h3>").append("<button id='logout' class='red'><span><i class='fa fa-power-off'></i></span>Logout</button>") 
                  : topMenu.append("<button id='login' class='green'><span><i class='fa fa-key'></i></span>Login</button>");
                          
    //If logged user is admin add <New Article> button else add <ContactUs> button    
    user.isAdmin ? topMenu.append("<button id='new-article' class='lightgreen'><span><i class='fa fa-star-half-o'></i></span>New Article</button>") 
                 : topMenu.append("<button id='contact-us' class='cyan'><span><i class='fa fa-at'></i></span>Contact Us</button>");
    
    //Add <Articles> button              
    topMenu.append("<button id='go-to-articles' class='blue'><span><i class='fa fa-list-ul'></i></span>Articles</button>");
      
    topMenu.children().click(topMenuClick);    // Assign click event to added buttons
    
}//END addTopMenu function

//Create article element and return it to caller;
function createArticleElement(art){
    
   var publishedContainer = $("<div class='published-container'></div>");                              //Create container for published options
   var articleElem = $("<article id='Article" + art.id + "' data-value='" + art.id + "'></article>");  //Create new Article element 
   
   //Select the newest date so it can be displayed at the beginning of article
   var higherDate;
   var lowerDate;
   
   // options for date formatting
   var options = { /*weekday: 'long',*/ year: 'numeric', month: 'long', day: 'numeric',hour:'numeric',minute:'numeric' };
   
   if( isNaN(Date.parse(art.dateModif))){
   	higherDate = "Posted: " + new Date(art.dateCreate).toLocaleString('en-GB', options); //format date
   	lowerDate =  "Modified: " + art.dateModif;
   	
   }else if(Date.parse(art.dateModif) > Date.parse(art.dateCreate)){
   		higherDate = "Updated: " + new Date(art.dateModif).toLocaleString('en-GB', options);
   		lowerDate = "Created: " + new Date(art.dateCreate).toLocaleString('en-GB', options); 
   }else{
   		higherDate = "Posted: " + new Date(art.dateCreate).toLocaleString('en-GB', options); //format date
   		lowerDate =  "Modified: " + new Date(art.dateModif).toLocaleString('en-GB', options);
   }

    //Add all needed fields to the article element
    articleElem.append("<div class='article-title-container'><h1 class='article-title'>" + art.title + "</h1></div>")
               .append("<div class='article-category'><h2>about: <span class='strikeable '>" + art.category.toUpperCase() + "</span></h2></div>")
               .append(publishedContainer)
               .append("<div class='article-higherdate inline-block'><i class='material-icons red'>date_range</i><span>" + higherDate + "</span></div>")
               .append("<div class='article-author inline-block'><i class='material-icons blue'>person </i><span>" + art.userName + "</span></div>")
               .append("<div></div>")
               .append("<div class='main-img-container'><img class='main-img'  src= " + art.img + " alt='Main Image'></div>")
               .append("<div class='article-content'><p><span>" + art.content + "</span></p></div>")
               .append("<div class='clearfix'></div>")
               .append("<div class='article-lowerdate inline-block'><i class='material-icons red'>date_range </i><span>" + lowerDate +" </span></div>")
               .append("<div class='comm-count inline-block'><i class='material-icons green'>chat</i><span>" + art.commCount + " comments </span></div>");
     
    //If logged user is admin add Edit and Delete buttons and display published status of article
    if(user.isAdmin){
        
    	var buttonsContainer = $("<div class='manage-article-btn-container'></div>");
    	articleElem.append(buttonsContainer); 
    	buttonsContainer.append($("<button class='edit-article purple'><span>&#10002;</span> Edit</button>").click(editArticleClick))
    	                .append($("<button class='delete-article red'><span>&#10015;</span> Delete</button>").click(deleteArticleClick));
    	                
    	if(art.published == '1'){
    		publishedContainer.append("<h3 class='text-green'>Published!</h3>");
    	}else{
    		publishedContainer.append("<h3 class='text-red'> Not published!</h3>");
    	} 
    }
    
    // If category was deleted meanwhile strike it out
    if(art.cat_active == 0) {
    	articleElem.children().find("span.strikeable").addClass("strikeout");
    }
    
    return articleElem;
    
}//END createArticleElement function


//Create comment element and return it to caller
function createCommentElement(comm){
    
    var commentElem = $("<li id='Comment"+comm.id+"' class='comment'></li>");                                              //New JQuery <li> element
    var btnContainer = $("<div class='manage-comments'></div>");                                                           //Create Manage comments container
    var dateCreated;
    var dateUpdated;
    var options = { /*weekday: 'long',*/ year: 'numeric', month: 'long', day: 'numeric',hour:'numeric',minute:'numeric' }; //Options for date formatting
   
    //   Format dates
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
   
    //Add needed fields to commet element
    commentElem.append("<div class='comm-title'><h3>" + comm.title + "</h3></div>")
               .append("<div class='comm-author comm-details'><strong>Posted by: </strong><em>" + comm.userName + "</em></div>")
               .append("<div class='comm-created comm-details'><strong>on: </strong><em>" + dateCreated + "</em></div>")
               .append("<div class='comm-updated comm-details'><strong>Updated: </strong><em>"+dateUpdated+"</em></div>")
               .append("<div class='clearfix'></div>")
               .append("<div class='comm-content'><p>" + comm.content +"</p></div>")
               .append(btnContainer);
               
    //If owner user is logged add edit and delete buttons
    //If user is not owner but is admin add only delete button
    if(comm.userId === user.loggedUserId){
        btnContainer.append($("<button class='edit-article purple'><span><i class='fa fa-pencil-square'></i></span>Edit</button>").click(editCommentClick))
                   .append($("<button class='delete-article red'><span><i class='fa fa-trash'></i></span>Delete</button>").click(deleteCommentClick));
    }  
    else if(user.isAdmin){
        btnContainer.append($("<button class='delete-article red'><span><i class='fa fa-trash'></i></span>Delete</button>").click(deleteCommentClick));
    }
    
    return commentElem;
    
}//END createCommentElement

//Create <Add comment> section
function addCommentSection(){
    
    var commentSection = $("#new-comment");                                     //Get existing container reference
    
    //Create html structure
    var html = "<section id='add-comment'>" +
               "<h3>Your opinion matters:</h3> " +
               "<input type='text' name='commTitle' placeholder='Title' maxlength = '64'/>" +
                "<br>" +
                "<textarea name='commContent' placeholder='Your comment'rows='5' cols='1' maxlength = '255'></textarea>" +
                "<span><em>* 255 characters max.</em></span>" +
                "<br>" +
                "<div id='error-comment' class='error-container'><p class='errortext'>*</p></div>" +
                "<div id='post-comment-container'><button id='post-comment' class='green'><span><i class='fa fa-commenting'></i></span>Post</button></div>" +
                "</section>";
    
    commentSection.append(html);                                                //Append html structure to the container
    
    commentSection.find("#post-comment").click(addCommentClick);                //Add click event to the Add comment buton
    
}//END addCommentSection funtion

// -------------------------------------------------------------/DOM Manipulation----------------------------------------------------------

// --------------------------------------------------------------NAVIGATION Menu----------------------------------------------------------
 //Creat pagination menu
 function createCommentsNavigation(pages){

	var pagesContainer = $(".pagination-pages");                                //Get container for nav. pages
	
	//create pages menu
	pagesContainer.append(newPage('first','&laquo;'));                          //Add << button
	
	//Add each page and make page 1 active
	for(var i = 1; i <= pages; i++){
		pagesContainer.append(newPage("Page" + i,i));   
	}
	pagesContainer.append(newPage('last','&raquo;'));                           //Add >> button
	
	//Manage visual aspects
	$("#first").addClass('disabled');                                           //disable first button
	
	//if only one page - Disable last button
	if(pages == 1){
	    $("#last").addClass('disabled');
	}
	
	$("#Page1").addClass('active');                                             //Set first page as active
    
}//END createArticlesNavigation

//Create new page button and return it to caller
function newPage(id,text){
     return $("<a id='" + id + "' href='#'>" + text + "</a>").click(navigate);
}//END newPage function
     
//Handle navigation buttons clicks
function navigate(){
	
	var clicked     = $(this);                                                  //get clicked element in the navigation panel
	var pageId      = $(".active").attr('id');                                  //get clicked element id
	var currentPage = parseInt(pageId.replace("Page",""),10);                   //get current page number
	var futurePage  = currentPage;                                              //Initialize future page (same as current page)
    
    //Determin future page based on clicked button	
	switch(clicked.attr('id')){
		case 'first':
				futurePage = 1;
		break;
		
		case 'last':
				futurePage = commTotalPages;
		break;
		
		default:
		    pageId = clicked.attr('id');                                        //get clicked page ID
			var newPage = pageId.replace("Page","");                            //get clicked page number
			
		 	//if clicked page is in valid page range
			if(newPage >= 1 && newPage <=commTotalPages){
				futurePage = newPage;
			}
		break;
	} //End Switch
	
	var comments = new Comments();
	comments.getCommentsForArticle(currentArticleId,futurePage,commPageSize).done(displayComments); //get and display comments for first page;
	
	//Manage visual spects
	$("a").removeClass('active');                                               //remove active class for all elements
	$("#Page" + futurePage).addClass('active');                                 //activate new page
	
	//Reconfigure first and last buttons
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

//Handle mouse click on elements from top menu
function topMenuClick(){
  
   var clicked = $(this);                                                       //Get clicked element                                 
   
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

//Display article
function displayArticle(response){
       
    //Check if server response is valid
    if(response.length > 0 && (response[0].id === currentArticleId) ){
        
        var art = new Article(response[0]);                                     //New Article object 
           
        var container = $("#container");                                        //Get existing container element 
        container.append(createArticleElement(art));                            //Add new article element into container
        
        //Add number of comments info   
        if(art.commCount == 0){
            $("#comm-header").append("<h2>No comments</h2>");
        }else{
            $("#comm-header").append("<h2>" + art.commCount + " comments</h2>");
        }
        
        //display comments and new comment sections   
        $("#comm-container").removeClass('hidden');
        $("#new-comment").removeClass('hidden');
        getComments();                                                          //Get comments for this article
        addCommentSection();                                                    //Create New comment section
       
        
    }else{
           popUp("error","Article was not received from the server or it isn`t the article expected!");
    }
    
}//END displayArticle

//Display comments for this article
function displayComments(response){
    
    //Check if comments were received corectlly
    if(response.length > 0 && response[0].article_id === currentArticleId){
            
        var commentsContainer = $("#comments-list");
        
        commentsContainer.empty();                                              //Clear comments list of old content
        
        //Iterates received comments and add them to the comments list
        for(var i = 0; i < response.length; i++){
            var comm = new Comment(response[i]);
            commentsContainer.append(createCommentElement(comm));
        }
            
        //Show pagination menu after articles were displayed
	    $("#navigation").removeClass('hidden');
	    
    }else{
        popUp("error","Comments were not received or they are not as expected!");
    }
    
}//END displayComments function

//Edit Article click event handler
function editArticleClick(event){
  
    event.stopPropagation();                                                    //Stop event bubbling
    
    var markedId = $(this).parents('article').attr("data-value");               //Get article id
    
    window.location.href = UI_PAGE + "editArticle.html?id=" + markedId;         //Open edit article window 

}//END EditArticleClick

//Delete Article click event handler
function deleteArticleClick(event){
  
    event.stopPropagation();                                                    //Stop event bubbling
     
    var articles = new Articles();                                              //New article object
     
    var markedId = $(this).parents('article').attr("data-value");               //Get article ID
     
    // If id was determined correctly delete article
    if(markedId){
        articles.removeArticle(markedId).done(deleteResponse);
    }else{
        popUp("error","Failed to get target article ID");
    }

}//END deleteArticleClick

//Callback for delete article command
function deleteResponse(response,statusText,jqXHR){
    
    if(response.success === true){
        
        popUp("success",response.message);
        setTimeout(function() {window.location.href = UI_PAGE + "articles.html"; }, 2000);
    }else{
        popUp("error",response.message);
    }
    
}//End deleteResponse callback

//Edit Comment click event handler
function editCommentClick(event){

    event.stopPropagation();  

    var commentId = $(this).parents('li').attr('id');

    window.location.href = UI_PAGE + "editComment.html?id="+commentId;
    
}//END editCommentClick

//Delete Comment click event handler
function deleteCommentClick(event){
    
    event.stopPropagation();
     
    var comElementId= $(this).parents('li').attr('id');                         //Get html element ID
    var commentId = comElementId.replace("Comment","");                         //Strip 'Comment' to get actual comment ID from database

    // if commetn id was determined correctly call delete method 
 	if(commentId){
 	    
	  var comment = new Comment();
	  comment.delete(commentId,user.loggedUserId).done(commentsOperation);
	  
	}else{
	  popUp("error","Delete comment not posible. Failed to get target commet ID!");  
	}
	
}//END deleteComentClick

//New Comment click event handler
function addCommentClick(event){

    event.stopPropagation();
    
    //get user inputs
    var comTitle = $('input[name="commTitle"]').val().trim();
    var comContent = $('textarea[name="commContent"]').val().trim();
	var articleId = $('article[data-value]').attr('data-value');
	var errorComment =  $('#error-comment');
	
	//Check user logged in
	if(user.isLogged === false){
        setError(errorComment,"*You must be logged in to post comments!");
        return;
    }else{
        
        //validate user inputs
        if(comTitle.length === 0 || comContent.length === 0){
            setError(errorComment,"*Please fill in both Title and Content for your comment!");
            return;
        }else{
            resetError(errorComment);
        }
    }
    
    //Create comment if associated article id is known
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
	    popUp("error","Saving comment not possible. Failed to get target article ID!");
	}
	
}//END saveCommentClick

//Callback function for add/delete ajax requests
function commentsOperation(response,textStatus,jqXHR){
    
    if(response && response.success === true){
        popUp("success",response.message);
        setTimeout(function(){window.location.reload();},1000);
        
    }else{
        popUp("error",response.message);
    }
    
}//END commentsOperation callback function

//Move articles position if header height is changed
function positionArticle(){
    
	var headerHeight = $('#header-section').outerHeight();                      //Get header height
	$("#content").css({top: headerHeight + 20 + "px"});                         //Change articles position
	
}//END positionArticle

// ---------------------------------------------------------------/Events Handle-----------------------------------------------------------


 //util function, will return the url param for the provided key
function getUrlParam(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
        return null;
    }else{
        return results[1] || 0;
    }
}//END getUrlParam function