/*global $*/
/*global Articles*/
/*global UI_PAGE*/

//always check if HTML is loaded before doing anything
//HTML operations on view
$(document).ready(onHtmlLoaded);

	var totalArticles;   //Total number of articles in DB
	var pageSize = 5;    //Max. Number of articles on each page 
	var totalPages = 0; //Total number of page - initilized with 0
	var articles = new Articles(); //create Articles object
	
// function addMockedData() {
// 		var articles = [{
// 			title:"Title1",
// 			content:"Content1",
// 			id:1
// 		},{
// 			title:"Title2",
// 			content:"Content2",
// 			id:2
// 		},{
// 			title:"Title3",
// 			content:"Content3",
// 			id:3
// 		},{
// 			title:"Title4",
// 			content:"Content4",
// 			id:4
// 		},{
// 			title:"Title5",
// 			content:"Content5",
// 			id:5
// 		}];
        
//         if(localStorage.getItem("articles") == null){
        	
//         	var stringifiedData = JSON.stringify(articles);
//         	localStorage.setItem("articles",stringifiedData);
//         }
		
// }
// addMockedData();
//----------------------------------------------------------------------


//Function executed after document is fully loaded
function onHtmlLoaded() {
	
	
	
	// //get total number of articles 
	// articles.Count().done(function(count){
	// 	if(count.length > 0 ){
	// 		totalArticles = parseInt(count[0].NumOfArticles,10);
	// 		if(totalArticles > 0){
	// 			totalPages = Math.ceil(totalArticles/pageSize);
	// 		}
	// 	}else{
	// 		console.log("Server response not as expected!");
	// 	}
	// });
	
	// articles.getPageArticles(1,pageSize).done(displayArticles);
	
	//Add top buttons and links based on user logged in 
	addTopMenu();
	
	//get all articles from server
	articles.getAll().done(function(){
		
		//Calculate number of pages based on total number of articles
		totalArticles = articles.models.length;
		if(totalArticles > 0){
			totalPages = Math.ceil(totalArticles/pageSize);
		}else{
			totalPages = 1;
		}
		createArticlesNavigation(totalPages);
		displayArticles(1);
	});

	
}//END onHtmlLoaded function

//Function for displaying articles
function displayArticles(page){
	
	var container = $("#container"); //get data container <ul>
	var begin,end;
	
	//calculate limits in articles array that need to be displayed  
	begin = (page-1)*pageSize;
	end =   (begin + pageSize) < totalArticles ? (begin+pageSize) : totalArticles ;
	
	container.empty();//clear list of old content
	
	//iterate through articles list and add them to the <ul> container
	for(var i = begin; i<end; i++) {
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
	// 	li.html("<h1> " + art.title + "</h1>");
	 	li.on("click", goToArticlePage);
	// 	li.append("<div id='author'><strong><em>Posted by:" + art.userName + "</em></strong></div>")
	// var imgContainer = $("<div class='img-container'></div>");
	// var contentContainer = $("<div class='content-container'></div>");
	
	// imgContainer.append("<img class='main-img' height='150px' src= " + art.img + " alt='Main Image'>");
	// contentContainer.append("<p>" + art.content +"</p>");
	
	// li.append(imgContainer).append(contentContainer);
	// li.append("<em id='created'>Created: "+art.dateCreate+"</em>").append("<em id='updated'>Updated: "+art.dateModif+"</em>")
	return li;
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
	
	
	displayArticles(futurePage); //display new articles;
	
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


function deleteArticle(){
	console.log("Articles-deleteArticle");
}