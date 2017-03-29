/*global $*/
/*global Articles*/

$(document).ready(onHtmlLoaded);
//always check if HTML is loaded before doing anything
//HTML operaations on view
function onHtmlLoaded(){
    // var article = new Article({
    //     title:"Title1",
    //     content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas lacus orci, rutrum quis auctor sed, maximus vel turpis. Donec malesuada, massa ut semper fringilla, tellus lorem auctor ante, non vestibulum nisi orci nec massa. Cras blandit est eu purus fermentum varius. Mauris a neque ac turpis rhoncus gravida et vel ipsum. Cras condimentum congue pharetra. Pellentesque mi lectus, condimentum at sollicitudin vitae, tempor in leo. Proin auctor eleifend enim, vitae efficitur sapien condimentum quis. Pellentesque molestie ligula et purus mollis blandit. Vivamus tempus luctus lectus, id molestie ligula fermentum sit amet. Aenean at elit at ligula convallis porttitor. Cras ac velit facilisis, tincidunt quam nec, egestas eros. Phasellus lacinia consectetur sapien vel molestie. Nulla ut consectetur odio, non semper nisi.", 
    // });
    // var stringifiedArticle = JSON.stringify(article);
    // window.localStorage.setItem("article1",stringifiedArticle);
    var articles = new Articles();
    articles.getAll();
    var currentArticleId = getUrlParam("id");
    var article = articles.findArticleById(currentArticleId);
    var containerElement = $("#container");
    
    generateArticleTitle(article.title);
    generateArticleContent(article.content);
    
    //generates a h2 element,adds the title and append the element to the container 
    function generateArticleTitle(articleTitle){
        var titleElement = $("<h2></h2>");
        titleElement.html(articleTitle);
        
        containerElement.append(titleElement);
    }
    
     //generates an article element,adds the content and append the element to the container
    function generateArticleContent(articleContent){
        var articleContentElem = $("<article></article>");
        
        articleContentElem.html(articleContent);
        containerElement.append(articleContentElem);
    }
    
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
}