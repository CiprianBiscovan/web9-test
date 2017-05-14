/*global $*/
/*global Articles User*/
/*global UI_PAGE HOME_PAGE*/
/*global popUp setError resetError logout*/

//always check if HTML is loaded before doing anything
//HTML operations on view
$(document).ready(onHtmlLoaded);
    
    //global variables
	var totalArticles;                                                          //Total number of articles in DB
	var pageSize         = 5;                                                   //Max. Number of articles on each page 
	var totalPages       = 0;                                                   //Total number of page - initialized with 0
	var articles         = undefined;                                           //Articles class object
	var user             = new User();                                          //User class object - logged user
	var filter           = null;                                                //Search filter - initialized null

//Function executed after document is fully loaded
function onHtmlLoaded() {
	
	// move articles list if header height changes during browser resize
	$(window).resize(positionArticles);

	//Add top buttons and links based on user logged in 
	addTopMenu();
	
	//Initial articles positioning
	positionArticles();
	
	//Add click event on search button
	$('#search-button').on('click',searchArticles);
	
	//Get possible filter from page URL parameter list
	filter = getUrlParam('filter');
	
	//display filter if it exists
	if(filter !== null && filter !== 0){
		displayFilter();
	}
	
	//create articles list
	buildArticlesList();
    
}//END onHtmlLoaded function

//Create articles list function
function buildArticlesList(){
	
	articles = new Articles();                                                  //Create Articles object

	//get total number of articles existing in DB for pagination
	articles.Count(filter).done(function(count){
	   
	   //If articles count is valid calculate number of pages
		if(count.length > 0 ){
			
			totalArticles = parseInt(count[0].NumOfArticles,10);
			
			// If there is at least one page get articles for it
			if(totalArticles > 0){
				
				totalPages = Math.ceil(totalArticles/pageSize);
				createArticlesNavigation(totalPages);
				articles.getPageArticles(1,pageSize,filter).done(displayArticles);
				
			}else{
				
				$("#articles-list").removeClass("visible");
				popUp("warning","No articles found!");
			}
		}else{
			popUp("error","Error getting articles count from server!");
		}
	}); //END articles count function
	
}//END buildArticlesList function

// ------------------------------------------------DOM Manipulation------------------------------------------------------------

//Create top menu 
function addTopMenu(){
	
	var topMenu  = $("#top-menu");                                              //Get top-me nu container
	var roleIcon = '';                                                          //Define variable for user role icon
	
	//Determine icon based on user role
	if (user.loggedUserRole === 'ADMIN'){
		roleIcon = "&#9812;";
	}else{
		roleIcon = "&#9817;";
	}
    
    //Add home link    
    topMenu.append("<a id='home-button' href='"+ HOME_PAGE +"'><i class='fa fa-home'>Home</i></a>");
    
    // If any user is logged add username else add login button
    user.isLogged ? topMenu.append("<h3 id='username'><span>"+ roleIcon + "</span> " + user.loggedUserName + "</h3>").append("<button id='logout' class='red'><span><i class='fa fa-power-off'></i></span>Logout</button>") 
                  : topMenu.append("<button id='login' class='green'><span><i class='fa fa-key'></i></span>Login</button>");
                          
    // If logged user is admin add new article button  else add contactUs button    
    user.isAdmin ? topMenu.append("<button id='new-article' class='lightgreen'><span><i class='fa fa-star-half-o'></i></span>New Article</button>") 
                 : topMenu.append("<button id='contact-us' class='cyan'><span><i class='fa fa-at'></i></span>Contact Us</button>");
    
    //subscribe to click events on top menu buttons 
    topMenu.children().click(topMenuClick);   
    
}//END addTopMenu function

//Display articles
function displayArticles(){
	
	$("#articles-list").addClass("visible");                                    //Make articles list container visible
 	var container = $("#container");                                            //get data container <ul>

	container.empty();                                                          //clear list of old content
   
	//iterate through articles list and add them to the <ul> container
	for(var i = 0; i<articles.models.length; i++) {
		var articleElem = createArticleListElement(articles.models[i]);
		container.append(articleElem);
	}
	
	//Show pagination menu after articles were displayed
	$("#navigation").removeClass('hidden');
	
}//End displayArticles function

//Create articles list element
function createArticleListElement(art){
	
	var li = $("<li data-value=" + art.id + "></li>");                          //Create li element for each article
	li.append(createArticleElement(art));                                       //Create article element and append it to li element
	li.children().find('a').attr('href',UI_PAGE + "article.html?id=" + art.id); //Set href attribute for article title 
	return li;
}//END createArticleListElement function

//Create article element and return it to caller;
function createArticleElement(art){
	
	var contentContainer = $("<div class='article-content content-container'></div>");   //Container for text and READ MORE link
	var publishedContainer = $("<div class='published-container'></div>");               //Container for published options

    //Select the bigger date so it can be displayed at the beginning of article
    var higherDate;
    var lowerDate;
    var options = { /*weekday: 'long',*/ year: 'numeric', month: 'long', day: 'numeric',hour:'numeric',minute:'numeric' }; //Options for formatting dates
   
   //Determin newest date and format dates
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
   
   //create article element
   var articleElem = $("<article id='Article" + art.id + "' data-value='" + art.id + "'></article>");
    articleElem.append("<div><i class='fa fa-link'></i></div>")
               .append("<div class='article-title-container'><a class='article-title' href=''><h1>" + art.title + "</h1></a></div>")
               .append("<div class='article-category'><h2>about: <span class='strikeable '>" + art.category.toUpperCase() + "</span></h2></div>")
               .append(publishedContainer)
               .append("<div class='article-higherdate inline-block'><i class='material-icons red'>date_range</i><span>" + higherDate + "</span></div>")
               .append("<div class='article-author inline-block'><i class='material-icons blue'>person </i><span>" + art.userName + "</span></div>")
               .append("<div></div>")
               .append("<div class='img-container'><img class='main-img'  src= " + art.img + " alt='Main Image'></div>")
               .append(contentContainer)
               .append("<div class='clearfix'></div>")
               .append("<div class='article-lowerdate inline-block'><i class='material-icons red'>date_range </i><span>" + lowerDate +" </span></div>")
               .append("<div class='comm-count inline-block'><i class='material-icons green'>chat</i><span>" + art.commCount + " comments </span></div>");

    //Add text content and "READ MORE link in the same container "
    contentContainer.append("<p>" + art.content + "</p>")
                    .append("<div class='read-more-container'><a class='read-more' href=''>READ MORE</a></div>");
    
    //Add additional buttons and informations for admin user 
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
    
    // if category was deleted strike it out
    if(art.cat_active == 0) {
    	articleElem.children().find("span.strikeable").addClass("strikeout");
    }
    
    return articleElem;
    
}//END createArticleElement

//Display filter fucntion
function displayFilter(){
	
	//variables
	var messageHeight;
	var articleList =$("#articles-list");
	var newPos;
	var activeFilter = $('#active-filter');
	var clearFilter = $("<span class='closebtn'>&times;</span>");
	
	//add message text
	activeFilter.append("<strong>INFO! </strong>Articles with title containing word: '"+ filter.toUpperCase() +"'")
	            .append(clearFilter);
	            
	//Show alert message
	activeFilter.css({display: 'block',
		              position: 'absolute',
		              width:'99%'
		             });
    
	//get message height
	messageHeight = activeFilter.outerHeight();
	
	//move articles down
	newPos =  articleList.offset().top + messageHeight +"px";
	articleList.animate({top: newPos},2000,function(){activeFilter.css({position:'relative', width:'auto'})});
	
	//Close alert message
	clearFilter.on('click',function() {
		activeFilter.css({opacity: 0,
			              position:"absolute",
			              width:'99%',
			              animation: 'fadeOut', 
			             'animation-duration':'2s'
		});  //Set opacity to 0 
		
		//move articles up
		messageHeight = activeFilter.outerHeight();  
		newPos =   articleList.offset().top - messageHeight + "px";
		articleList.animate({top: newPos},2000,function(){
			   window.location.href = UI_PAGE + "articles.html";
		});
		
	  
	});
	
}//END displayFilter

// -----------------------------------------------------------//DOM Manipulation-----------------------------------------------------------

// --------------------------------------------------------------NAVIGATION Menu----------------------------------------------------------
//Create pagination menu for articles
 function createArticlesNavigation(pages){

	var pagesContainer  = $(".pagination-pages");                               //Get container for pages
	var stepContainer   = $(".pagination-step");                                //Get container for Newer/Older buttons
	pagesContainer.empty();
	stepContainer.empty();
	
	//Add Newer Older buttons
	stepContainer.append(newPage('next','Newer'));                              //Add Newer Button
	stepContainer.append(newPage("previous","Older"));                          //Add Older button
	
	//create pages menus
	pagesContainer.append(newPage('first','&laquo;'));                          //Add << button
	
	//Add each page and make page 1 active
	for(var i = 1; i <= pages; i++){
		pagesContainer.append(newPage(i,i));   
	}
	pagesContainer.append(newPage('last','&raquo;'));                           //Add >> button
	
	//Manage visual aspects
	$("#next").addClass('hidden');                                              //hide Newer button in the begining
	$("#first").addClass('disabled');                                           //disable first button
	
	//if only one page - hide Older button and disable last button
	if(pages == 1){
	$("#previous").addClass('hidden');
	$("#last").addClass('disabled');
	}
	$("#1").addClass('active');                                                 //Set first page as active
    
}//END createArticlesNavigation

//Create page button
function newPage(id,text){
     return $("<a id='" + id + "' href='#'>" + text + "</a>").click(navigate);
}
     
//Function to handle navigation buttons clicks
function navigate(){
	var clicked = $(this);                                                      //get clicked element in the navigation panel
	var currentPage = parseInt($(".active").attr('id'),10);                     //get current page number
	var futurePage= currentPage;                                                //Initialize future page
	
	//Determin clicked page
	switch(clicked.attr('id')){
		case 'next':
			//if current page is not the first page
			if(currentPage > 1){
				futurePage = currentPage - 1; //set new page
			}
		break;
		case 'previous':
			//if current page is not last page
			if(currentPage < totalPages){
				futurePage = currentPage + 1; //set new page
			}
		break;
		case 'first':
			//if the current page is not first page
			if(currentPage > 1){
				futurePage = 1;
			}
		break;
		case 'last':
			//if current page is not last page
			if(currentPage < totalPages){
				futurePage = totalPages;
			}
		break;
		default:
			var newPage = clicked.attr('id');  //get clicked page number
			//if clicked page is in valid page range
			if(newPage >= 1 && newPage <=totalPages){
				futurePage = newPage;
			}
		break;
		
	} //End Switch
	
	articles = new Articles();                                                  //create new object to reset models[] array
	articles.getPageArticles(futurePage,pageSize,filter).done(displayArticles); //get and display new articles;
	
	//Manage visual spects
	$("a").removeClass('active');                                               //remove active class for all elements
	$("#" + futurePage).addClass('active');                                     //activate new page
	
	if(parseInt(futurePage,10) === 1 ){
		$("#next").addClass('hidden');
		$("#first").addClass('disabled');
		$("#previous").removeClass('hidden');
		$("#last").removeClass('disabled');
	}else if(parseInt(futurePage,10) === totalPages ){
		$("#next").removeClass('hidden');
		$("#first").removeClass('disabled');
		$("#previous").addClass('hidden');
		$("#last").addClass('disabled');
	}
	else{
		$("#next").removeClass('hidden');
		$("#first").removeClass('disabled');
		$("#previous").removeClass('hidden');
		$("#last").removeClass('disabled');
	}
	
}//END Navigation function

// --------------------------------------------------------------/NAVIGATION Menu----------------------------------------------------------

// ---------------------------------------------------------------Events Handle-----------------------------------------------------------

//function for handling mouse click on elements from top menu
function topMenuClick(){
  
   var clicked = $(this);                                                       //Get clicked button from the top menu
   
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

//Edit Article click event handler
function editArticleClick(event){
  
    event.stopPropagation();                                                    //Stop event bubbling
    
    var markedId = $(this).parents('article').attr("data-value");               //Get article id
    
    window.location.href = UI_PAGE + "editArticle.html?id=" + markedId;         //redirect to artcile page

}//END EditArticleClick

//Delete Article click event handler
function deleteArticleClick(event){
  
    event.stopPropagation();                                                    //Stop event bubbling
      
    var articles = new Articles();                                              //Create new Article object
    var markedId = $(this).parents('article').attr("data-value");               //Get target article ID
    
    // if ID is known call delete method 
    if(markedId){
        articles.removeArticle(markedId).done(deleteResponse);
    }else{
        popUp("error","Failed to get target article ID!");
   }

}//END deleteArticleClick

//Function for searching articles by title
function searchArticles(){
	
	var searchText = $('input[name="search"]').val().trim();                    //Get search input
	var searchError = $('#error-search');
	
	// if input is valid apply filter
	if(searchText.length > 0){
		resetError(searchError);
		window.location.href = UI_PAGE + "articles.html?filter="+searchText+"";
		
	}else{
		setError(searchError,"*Nothing to search for!");
	}
	
}//END searchArticles function

//Callback function for article delete command
function deleteResponse(response,statusText,jqXHR){
	
	if(response.success === true){
		
		popUp("success",response.message);
		setTimeout(function() {window.location.href = UI_PAGE + "articles.html"; }, 2000);
    }else{
       popUp("error",response.message);
    }
}//End deleteResponse

//Move articles position if header height is changed
function positionArticles(){
	var headerHeight = $('#header-section').outerHeight();                      //Get header height
	$("#articles-list").css({top: headerHeight + 20 + "px"});                   //Change articles position
}

// ---------------------------------------------------------------/Events Handle-----------------------------------------------------------

//util function, will return the url param for the provided key
function getUrlParam(name){
	
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	
	if (results==null){
		return null;
    }else{
        return results[1] || 0;
    }
}