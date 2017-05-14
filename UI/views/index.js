/*global $*/
/*global Articles User*/
/*global UI_PAGE */
/*global logout*/

//always check if HTML is loaded before doing anything
//HTML operations on view
$(document).ready(onHtmlLoaded);

//global variables
var user = new User();                                                          //Get logged User
var articles;

//Function executed after document is fully loaded
function onHtmlLoaded(){
    
    //check if user is logged and configure top menu buttons
    if(user.isLogged === true){
        $("#login").addClass("hidden");
        $("#logout").removeClass("hidden");
        $("#contact-us").attr("disabled","disabled")
                        .attr("href","");
        $("#contact-us").click(function(ev){ev.preventDefault();});           //prevent page refresh when <a>element is clicked
        
        //Subscribe and Handle logout button click events           
        $("#logout").on("click",function(ev){
            ev.preventDefault();
            logout();
        });  
        
        var username = $("#logged-user");                                       //Get username container
        var accountsBtn = $("#accounts-btn");                                   //Get account button container
	    var roleIcon = '';
	    
	    //Determin icon to use based on user role
	    if (user.loggedUserRole === 'ADMIN'){
		    roleIcon = "&#9812;";
	    }else{
		    roleIcon = "&#9817;";
	    }
	    
	    //Add username and myaccount button
        username.append("<h4 id='logged-username'><span>"+ roleIcon + "</span> " + user.loggedUserName + "</h4>");
        accountsBtn.append("<a href = '" +UI_PAGE + "myAccount.html"+ "'class='btn btn-md btn-success btn-block'>myAccount</a>");
    
        
    }else{
        $("#logout").addClass("hidden");
        $("#login").removeClass("hidden");
        $("#contact-us").removeAttr("disabled",false)
                   .attr("href","/Blog/UI/pages/contactUs.html");
    }
    
    articles = new Articles();                                                  //New articles object
    articles.getPageArticles(1,5,"").done(displayArticles);                     //Get and display top 5 newest articles
    
}//END onHtmlLoaded

  //Display articles
function displayArticles(){
	var container = $("#container");                                            //get data container <ul>
    $("#articles-list").addClass("visible");                                    //Make articles list visible
	container.empty();                                                          //clear list of old content
   
	//iterate through articles list and add them to the <ul> container
	for(var i = 0; i<articles.models.length; i++) {
		var articleElem = createArticleListElement(articles.models[i]);
		container.append(articleElem);
	}
	
}//End DisplayArticles function

//Create article list element function
function createArticleListElement(art){
	var li = $("<li data-value=" + art.id + "></li>");                          //Create li element as article container
	li.append(createArticleElement(art));                                       //Append new article element
	li.children().find('a').attr('href',UI_PAGE + "article.html?id=" + art.id); //Set href attribute for article`s title
	
	return li;
}

//create article element and return it to caller;
function createArticleElement(art){
    
	var contentContainer = $("<div class='article-content content-container'></div>");   //Container for text and READ MORE link
	var publishedContainer = $("<div class='published-container'></div>");               //Container for published options
	
   //Select the newest date so it can be displayed at the beginning of article
   var higherDate;
   var lowerDate;
   
   //options used for date formatting
   var options = { /*weekday: 'long',*/ year: 'numeric', month: 'long', day: 'numeric',hour:'numeric',minute:'numeric' };
   
   //Determine and format newest date
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
   
   //Create article element
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
     
    //Add published status for admin user
    if(user.isAdmin){
        
    	if(art.published == '1'){
    		publishedContainer.append("<h3 class='text-green'>Published!</h3>");
    	}else{
    		publishedContainer.append("<h3 class='text-red'> Not published!</h3>");
    	}           
    }
    
    //If category was deleted strike it out
    if(art.cat_active == 0) {
    	articleElem.children().find("span.strikeable").addClass("strikeout");
    }
    
    return articleElem;
    
}//END createArticleElement
