/*global $*/
/*global UI_PAGE*/
//Wait for html structure to be fully loaded
$(document).ready(onHtmlLoaded);

//FUcntion to execute after html page is loaded
function onHtmlLoaded(){
    var caller = document.referrer;
    var rgxEditComm = /^.*editComment.html.*/gmi;
    var rgxEditArticle = /^.*editArticle.html.*/gmi;
    var rgxNewArticle = /^.*newArticle.html.*/gmi;
    if(caller){
            if(caller.match(rgxEditComm)){
                $('#warning-text').html("You must be Logged In to edit comments and you can edit only the comments that you have posted!");
            }else if(caller.match(rgxEditArticle)){
                $('#warning-text').html("Only Administrator is allowed to edit articles!");
            }else if(caller.match(rgxNewArticle)){
                $('#warning-text').html("Only Administrator is allowed to add articles!");
            }
    }
  
    $(document.body).append($("<button id='login'>Login</button>").click(topMenuClick))
           .append($("<button id='go-to-articles'>Articles</button>").click(topMenuClick));
}

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
           window.location.href = UI_PAGE + "ContactUs.html";
       break;
       case 'go-to-articles':
             window.location.href = UI_PAGE + "articles.html";
       break;
   }
}
