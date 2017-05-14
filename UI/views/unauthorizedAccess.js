/*global $*/
/*global UI_PAGE*/
//Wait for html structure to be fully loaded

//always check if HTML is loaded before doing anything
//HTML operations on view
$(document).ready(onHtmlLoaded);

//Fucntion to execute after html page is fully loaded
function onHtmlLoaded(){
    
    var caller         = document.referrer;                                     //get the page from which redirection was done        
    //set pattern for each caller page
    var rgxEditComm    = /^.*editComment.html.*/gmi;                            
    var rgxEditArticle = /^.*editArticle.html.*/gmi;
    var rgxNewArticle  = /^.*newArticle.html.*/gmi;
    
    //check caller page and personalize warning message
    if(caller){
            if(caller.match(rgxEditComm)){
                $('#warning-text').html("You must be Logged In to edit comments and you can edit only the comments that you have posted!");
            }else if(caller.match(rgxEditArticle)){
                $('#warning-text').html("Only Administrator is allowed to edit articles!");
            }else if(caller.match(rgxNewArticle)){
                $('#warning-text').html("Only Administrator is allowed to add articles!");
            }
    }
    
    //add buttons to allow user to stay on site   
    $(document.body).append($("<button id='login'>Login</button>").click(redirect))
                    .append($("<button id='go-to-articles'>Articles</button>").click(redirect));

    
}//END onHtmlLoaded function

// button click event handler
function redirect(){
  
   var clicked = $(this);                                                       //get clicked element
   
   //determin clicked button
   switch (clicked.attr('id')){
        case 'login':
           window.location.href = UI_PAGE + "login.html";
        break;
        case 'go-to-articles':
             window.location.href = UI_PAGE + "articles.html";
        break;
   }
}//END redirect function
