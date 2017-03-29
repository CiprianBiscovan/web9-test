/* global $ Articles*/
$(document).ready(onHtmlLoaded);

function onHtmlLoaded(){
    var submitButton = $("#submit-btn");
    
    //submitButton.click(sendData);
    submitButton.on("click",sendData);
}

function sendData(ev){
    ev.preventDefault();
    var titleText = $("#title").val();
    var contentText = $("#content").val();
    var imgFile = $("#article_file")[0].files[0];
    if(titleText.trim() == "") 
        titleText="Default Title";
        
      
    if(contentText.trim() == "") 
        contentText="No content";
    
    var articles = new Articles();
    
    //THIS PART WAS USED FOR SAVE ON LOCAL STORAGE
    // articles.getAll();
    
    // var newArticle= new Article({
    //     title: titleText,
    //     content : contentText,
    //     catId: 1,
    //     userId: 1
    // });
    
    // console.log(articles.models.length);
    // articles.save(newArticle);
    // articles.getAll();
    // console.log(articles.models.length);
    var newArticle={
        title: titleText,
        content : contentText,
        catId: 1,
        userId: 1,
        img:imgFile
    }
     var response = articles.save(newArticle);
     
     response.done(showArticles)
     
     function showArticles(){
        window.location.href = UI_PAGE + "articles.html";
     }
     
}   