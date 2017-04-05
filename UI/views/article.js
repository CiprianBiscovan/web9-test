/*global $*/
/*global Article*/
/*global Comment*/
/*global UI_PAGE*/

$(document).ready(onHtmlLoaded);

//always check if HTML is loaded before doing anything
//HTML operations on view
function onHtmlLoaded(){
    // var article = new Article({
    //     title:"Title1",
    //     content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas lacus orci, rutrum quis auctor sed, maximus vel turpis. Donec malesuada, massa ut semper fringilla, tellus lorem auctor ante, non vestibulum nisi orci nec massa. Cras blandit est eu purus fermentum varius. Mauris a neque ac turpis rhoncus gravida et vel ipsum. Cras condimentum congue pharetra. Pellentesque mi lectus, condimentum at sollicitudin vitae, tempor in leo. Proin auctor eleifend enim, vitae efficitur sapien condimentum quis. Pellentesque molestie ligula et purus mollis blandit. Vivamus tempus luctus lectus, id molestie ligula fermentum sit amet. Aenean at elit at ligula convallis porttitor. Cras ac velit facilisis, tincidunt quam nec, egestas eros. Phasellus lacinia consectetur sapien vel molestie. Nulla ut consectetur odio, non semper nisi.", 
    // });
    // var stringifiedArticle = JSON.stringify(article);
    // window.localStorage.setItem("article1",stringifiedArticle);
   
   // var articles = new Articles();
   // articles.getAll();
   
//   	//check if user is logged In
// 	if(!$.cookie("loggedIn")){
// 		$("body").append("<h1>401 - Unauthorized page access</h1>").append("<a href = '" + UI_PAGE +"login.html'>Login</a>");
// 		return;
		
// 	}
addTopMenu();
addArticlesLink();
    var currentArticleId = getUrlParam("id");  //Get selected article ID
    //var article = articles.findArticleById(currentArticleId);
    var article = new Article();                                    //create new article instance 
    article.getArticleById(currentArticleId).done(displayArticle);  //request article by id and display it
    
    //get comments for current article
    var comments = new Comment();
    comments.getCommentsForArticle(currentArticleId).done(displayComments);
    
    // var containerElement = $("#container");
    
    // generateArticleTitle(article.title);
    // generateArticleContent(article.content);
    
    // //generates a h2 element,adds the title and append the element to the container 
    // function generateArticleTitle(articleTitle){
    //     var titleElement = $("<h2></h2>");
    //     titleElement.html(articleTitle);
        
    //     containerElement.append(titleElement);
    // }
    
    //  //generates an article element,adds the content and append the element to the container
    // function generateArticleContent(articleContent){
    //     var articleContentElem = $("<article></article>");
        
    //     articleContentElem.html(articleContent);
    //     containerElement.append(articleContentElem);
    // }
    
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
    
    //Function to display selected Article
    function displayArticle(response){
       
       if(response.length > 0 && (response[0].id === currentArticleId) ){
           var art = new Article(response[0]);
           
           var container = $("#container");
           container.append(createArticleElement(art));
           addCommentSection();
        //   container.append("<h1>" + art.title + "</h1>")
        //             .append("<div id='author'><strong><em>Posted by:" + art.userName + "</em></strong></div>")
        //             .append("<img class='main-img' height='150px' src= " + art.img + " alt='Main Image'>")
        //             .append("<p>" + art.content +"</p>")
        //             .append("<em id='created'>Created: "+art.dateCreate+"</em>").append("<em id='updated'>Updated: "+art.dateModif+"</em>");
       }
       else{
           console.log("Article received not as expected!");
       }
    }//END displayArticle
    
    function displayComments(response){
      
        if(response.length > 0 && response[0].article_id === currentArticleId){
            var commentsContainer = $("#comm-container");
            for(var i = 0; i < response.length; i++){
                var comm = new Comment(response[i]);
                commentsContainer.append(createCommentElement(comm));            
            }
            
        }
        else{
             console.log("Comments received not as expected!");
        }
    }
}//END OnHtmlLoaded function

function editArticle(){
    console.log("Aticle-EditArticle");
}