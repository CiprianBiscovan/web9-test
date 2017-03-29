/*global $*/
/*global Article*/
$(document).ready(onHtmlLoaded);
//always check if HTML is loaded before doing anything
//HTML operaations on view

function addMockedData() {
		var articles = [{
			title:"Title1",
			content:"Content1",
			id:1
		},{
			title:"Title2",
			content:"Content2",
			id:2
		},{
			title:"Title3",
			content:"Content3",
			id:3
		},{
			title:"Title4",
			content:"Content4",
			id:4
		},{
			title:"Title5",
			content:"Content5",
			id:5
		}];
        
        if(localStorage.getItem("articles") == null){
        	
        	var stringifiedData = JSON.stringify(articles);
        	localStorage.setItem("articles",stringifiedData);
        }
		
}

addMockedData();

function onHtmlLoaded() {
	var articles = new Articles();
	articles.getAll().done(function(){	
		var container = $("#container");
		for(var i = 0; i<articles.models.length; i++) {
			var articleElem = $("<li data-value="+articles.models[i].id+"></li>");
			articleElem.html(articles.models[i].title)
			articleElem.on("click", goToArticlePage);
			container.append(articleElem);
	}});


}

function goToArticlePage() {
	var currentArticleId = $(this).attr("data-value");
	//window.location.href = "https://web9-siitwebcluj.c9users.io/blog/UI/pages/article.html?id="+currentArticleId;
//	window.location.href = "https://preview.c9users.io/ciprianbiscovan/web9/Blog/UI/pages/article.html?id="+currentArticleId;
	
}