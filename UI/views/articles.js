/*global $*/
/*global Articles User*/
/*global UI_PAGE*/

//always check if HTML is loaded before doing anything
//HTML operations on view
$(document).ready(onHtmlLoaded);

	var totalArticles;   //Total number of articles in DB
	var pageSize = 5;    //Max. Number of articles on each page 
	var totalPages = 0; //Total number of page - initialized with 0
	var articles = undefined;
	var user = new User();
	var filter = null;

//Function executed after document is fully loaded
function onHtmlLoaded() {
	
	//Add top buttons and links based on user logged in 
	addTopMenu();
	
	$('#search-button').on('click',searchArticles);
	
	filter = getUrlParam('filter');
	
	if(filter !== null){
		displayFilter();
	}
	
	buildArticlesList();

}//END onHtmlLoaded function

function buildArticlesList(){
	
	articles = new Articles(); //create Articles object
	
		//get total number of articles existing in DB
	articles.Count(filter).done(function(count){
	   
		if(count.length > 0 ){
			totalArticles = parseInt(count[0].NumOfArticles,10);
			if(totalArticles > 0){
				totalPages = Math.ceil(totalArticles/pageSize);
			}
		}else{
			console.log("Server response not as expected!");
		}
		
		createArticlesNavigation(totalPages);
	});
	
	articles.getPageArticles(1,pageSize,filter).done(displayArticles);
	
}//END buildArticlesList function

// ------------------------------------------------DOM Manipulation------------------------------------------------------------
//Function for creating top menu 
function addTopMenu(){
    var topMenu = $("#top-menu");
   
        user.isLogged ? topMenu.append("<h3>"+ user.loggedUserRole + ": " + user.loggedUserName + "</h3>").append("<button id='logout'>Logout</button>") :
                   topMenu.append("<button id='login'>Login</button>");
                          
        
        user.isAdmin ? topMenu.append("<button id='new-article'>New Article</button>") :
                  topMenu.append("<button id='contact-us'>Contact Us</button>");
     
        topMenu.children().click(topMenuClick);
    
}//END addTopMenu function

//Function for displaying articles
function displayArticles(){
	
	var container = $("#container"); //get data container <ul>

	container.empty();//clear list of old content
   
	//iterate through articles list and add them to the <ul> container
	for(var i = 0; i<articles.models.length; i++) {
		var articleElem = createArticleListElement(articles.models[i]);
		container.append(articleElem);
	}
}//End DisplayArticles function

function goToArticlePage() {
	var currentArticleId = $(this).attr("data-value");
	window.location.href = UI_PAGE + "article.html?id=" + currentArticleId;
}

function createArticleListElement(art){
	var li = $("<li data-value=" + art.id + "></li>"); 
	li.append(createArticleElement(art));
	li.on("click", goToArticlePage);
	return li;
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
    
    if(user.isAdmin){
        articleElem.append($("<button id='edit-article'>Edit</button>").click(editArticleClick))
                   .append($("<button id='delete-article'>Delete</button>").click(deleteArticleClick));
    }
    
    return articleElem;
}//END createArticleElement

function displayFilter(){
	var activeFilter = $('#active-filter');
	var clearFilter = $("<h4>X<h4>");
	clearFilter.on('click',function() {
	    window.location.href = UI_PAGE + "articles.html";
	});
	activeFilter.append("<h5>Articles with title containing word "+ filter +"</h5>")
	            .append(clearFilter);
	
	
}//END displayFilter

// --------------------------------------------------------------NAVIGATION Menu----------------------------------------------------------
//function for creation of pagination menu
 function createArticlesNavigation(pages){

	var pagesContainer = $(".pagination-pages"); //Get container for pages
	var stepContainer = $(".pagination-step");  //Get container for Newer/Older buttons
	pagesContainer.empty();
	stepContainer.empty();
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
     
//Function to handle navigation buttons clicks
function navigate(){
	var clicked = $(this);                     //get clicked element in the navigation panel
	var currentPage = parseInt($(".active").attr('id'),10); //get current page number
	var futurePage= currentPage;
	switch(clicked.attr('id')){
		case 'previous':
			//if current page is not the first page
			if(currentPage > 1){
				futurePage = currentPage - 1; //set new page
				// $("a").removeClass('active');              //remove active class for all elements
				// $("#" + currentPage-1).addClass('active'); //activate next page before current page
				// displayArticles(currentPage-1);            //display new page
			}
		break;
		case 'next':
			//if current page is not last page
			if(currentPage < totalPages){
				futurePage = currentPage + 1; //set new page
				// $("a").removeClass('active');               //remove active class for all elements
				// $("#" + currentPage+1).addClass('active'); //activate next page following current page
				// displayArticles(currentPage+1);            //display new page
			}
		break;
		case 'first':
			//if the current page is not first page
			if(currentPage > 1){
				futurePage = 1;
				// $("a").removeClass('active'); //remove active class for all elements
				// $("#1").addClass('active');   //activate first page
				// displayArticles(1);           //display first page
			}
		break;
		case 'last':
			//if current page is not last page
			if(currentPage < totalPages){
				futurePage = totalPages;
				// $("a").removeClass('active');           //remove active class for all elements
				// $("#" + totalPages).addClass('active'); //activate last page
				// displayArticles(totalPages);            //display last page
			}
		break;
		default:
			var newPage = clicked.attr('id');  //get clicked page number
			//if clicked page is in valid page range
			if(newPage >= 1 && newPage <=totalPages){
				
				futurePage = newPage;
				// $("a").removeClass('active');        //remove active class for all elements
				// $("#" + newPage).addClass('active'); //activate last page
				// displayArticles(newPage);         //display last page
			}
		break;
	} //End Switch
	
	
	//displayArticles(futurePage); //display new articles;
	articles = new Articles(); //create new object to reset models[] array
	articles.getPageArticles(futurePage,pageSize,filter).done(displayArticles); //get and display new articles;
	
	//Manage visual spects
	$("a").removeClass('active');           //remove active class for all elements
	$("#" + futurePage).addClass('active'); //activate new page
	
	if(parseInt(futurePage,10) === 1 ){
		$("#previous").addClass('hidden');
		$("#first").addClass('disabled');
		$("#next").removeClass('hidden');
		$("#last").removeClass('disabled');
	}else if(parseInt(futurePage,10) === totalPages ){
		$("#previous").removeClass('hidden');
		$("#first").removeClass('disabled');
		$("#next").addClass('hidden');
		$("#last").addClass('disabled');
	}
	else{
		$("#previous").removeClass('hidden');
		$("#first").removeClass('disabled');
		$("#next").removeClass('hidden');
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
       break;
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

//Function for searching articles by title
function searchArticles(){
	var searchText = $('input[name="search"]').val().trim();
	var searchError = $('#error-search-input');
	
	if(searchText.length > 0){
		searchError.html("*");
		window.location.href = UI_PAGE + "articles.html?filter="+searchText+"";
		// filter='%' + searchText + '%';
		// buildArticlesList();
	}else{
		searchError.html("*Nothing to search for");
	}
	
}//END searchArticles function

function deleteResponse(response,statusText,jqXHR){

        if(response.success === true){
            console.log(response.message);
            window.location.href = UI_PAGE + "articles.html"; 
        }else{
            console.log(response.message);
        }
}//End deleteResponse
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