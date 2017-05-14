/*global $ Article User Categories */
/*global UI_PAGE*/
/*global popUp setError resetError logout*/

//always check if HTML is loaded before doing anything
//HTML operations on view
$(document).ready(onHtmlLoaded);
  
  //Get user information 
  //Redirect tu unauthorizedPage if no user is logged or if user is not admin
  var user = new User();
  if(user.isLogged === false || user.isAdmin === false){
       window.location.href = UI_PAGE + "unauthorizedAccess.html";
  }
  
//global variables
var imgFile = '';
var validationErrors = false;
var article = new Article();
var articleId = null;
var publish = false;

//Function executed after document is fully loadeds
function onHtmlLoaded(){
    
    //get reference to html elements that 
    var saveButton         = $("#save-btn");                                    //get Save Button element
    var chooseImg          = $("#article_file");                                //get Choose File button Element
    var deleteImage        = $('#delete-img');                                  // get delete image button
    var radioBtn           = $("input[type='radio']");                          //get radio buttons
    var closeCat           = $("#close-manage-categories");                     //get close button on manage categories section
    var manageCat          = $("input[name='manageCategoriesButton']");         //get manage categories submit button
    
    //If user is not authorized stop script 
    if(user.isLogged === false || user.isAdmin === false){
       return;
   } 
    
  articleId = getUrlParam('id');                                                //Get article id
  
  article.getArticleById(articleId).done(fillArticleData);                      //Get article data
   
    //Subscribe active elements to events
    saveButton.on("click",sendData);
    
    // change picture
    chooseImg.change(pictureSelected);
    
    // Open manage category popup
    $(".manage-categories").on("click",manageCategories);
    
    //delete image
    deleteImage.on("click",function(){
       imgFile = '';
       chooseImg.val("");
       $("#main-image").attr('src','/Blog/Resources/image_comming_soon.png');
   });
   
   //check changes in publish option
   radioBtn.change(checkPublish);
   
   //Close category popUp
   closeCat.on('click',function(){
       $('#category-section-background').addClass('no-display');
       window.location.reload();
   });
   manageCat.on('click',function(){
       $('#category-section-background').removeClass('no-display');
       fillCategorySelectElement();
       resetError($("#error-new-category"));
       resetError($("#error-delete-category"));
   });
    
    addTopMenu();                                                               //Add top menu buttons
    
    //Fil article data
    function fillArticleData(articleData){
        
        //check if server response is valid 
        if(articleData.length > 0 ){
           
            article = new Article(articleData[0]);                              //New Article object
            
             fillCategorySelectElement();                                       //Create list with available categories
             
            //Display article data in correspondent elements
            $('#main-image').attr("src",article.img);
            $('#title').val(article.title);
            $('#content').val(article.content);
            $('select').val(article.category_id);
            $("input[type='radio'][value='" + article.published + "']").prop("checked",true);
            imgFile = articleData[0].main_image_url;
            
            checkPublish();
            
        }else{
            console.log("Article does not exist");
        }
    }
    
} //END onHtmlLoaded

//Function to check if publish=yes and set/reset warning
function checkPublish(){
    
    publish = $("input[type='radio']:checked").val().trim();                    //get selected option
    
    //If unpublish option is selected display warning message for user 
    if(publish.trim() !== "1") {
         setError($("#warning-publish"),"*Unpublished articles are not be visible to other users!");
         return true;
    }else{
        resetError($("#warning-publish"));
        return false;
    }
     
}//END checkPublish

// ------------------------------------------------DOM Manipulation------------------------------------------------------------

//Function for creating top menu 
function addTopMenu(){
   
   //Get existing containers 
   var topMenu = $("#top-menu");
   var usernameContainer = $("#username-wrapper");
   var btnsContainer = $("#buttons-wrapper");
    
    //Determine icon based on user role 
    var roleIcon = '';
	if (user.loggedUserRole === 'ADMIN'){
		roleIcon = "&#9812;";
	}else{
		roleIcon = "&#9817;";
	}
    
    topMenu.append(usernameContainer)
          .append(btnsContainer);
    
    //Add buttons to containers based on logged in user       
    if(user.isLogged) {
            usernameContainer.append("<h3 id='username'><span>"+ roleIcon + "</span> " + user.loggedUserName + "</h3>");
            btnsContainer.append("<button id='logout' class='red'><span><i class='fa fa-power-off'></i></span>Logout</button>");
    }else{
            btnsContainer.append("<button id='login' class='green'><span><i class='fa fa-key'></i></span>Login</button>");
    }
                  
    btnsContainer.append("<button id='go-to-articles' class='blue'><span><i class='fa fa-list-ul'></i></span>Articles</button>");
    
    //subscribe to click events  
    topMenu.children().find('button').click(topMenuClick);
    
}//END addTopMenu function

//Function for building category list in Select element
function fillCategorySelectElement(){
    
    var selectElement = $('select');                                            //get select element container
    var newCategoryText = $("input[name='newCategoryName']");                   //get Text input for new category name
    
    newCategoryText.val('');                                                    //reset new category text input
    
    var categories = new Categories();                                          //create Categories instance
    
    selectElement.empty();                                                      //clear current content
    selectElement.append("<option value='' selected>Choose Category</option>"); //create default dummy option
    
    //function to get all categories from server and add them to the options list
    categories.getAll().done(function(){
      
        for(var i = 0; i < categories.categoriesList.length; i++){
            selectElement.append("<option value=" + categories.categoriesList[i].id + ">" + categories.categoriesList[i].name + "</option>");
        }
    
        //set article`s category
        $('#categories-art-sect').val(article.category_id);
    
    }); //END getAll function
    
    
}//END fillCategorySelectElement function

// -------------------------------------------------------------/DOM Manipulation----------------------------------------------------------

// ---------------------------------------------------------------Events Handle----------------------------------------------------------- 

//Get inputs data and send it to server
function sendData(ev){
    
    //Assume all inputs are valid - set falg to false
    //Any invalid input reset fals
    validationErrors = false;
    
    //get inputs data
    var titleText = $("#title").val().trim();
    var contentText = $("#content").val().trim();
    var selectedCategory = $("select").val();
   
   //Check and create error messages for each required field
    if(titleText.trim() === "") {
        
        setError($("#error-title"),"*Article`s title cannot be empty!");
        validationErrors = true;
    }
    else{
        resetError($("#error-title"));
    }
    
    if(selectedCategory === '' || selectedCategory === null || selectedCategory === undefined){

        setError($("#error-category"),"*Please select a category for this article");
        validationErrors = true;
    }
    else{
        resetError($("#error-category"));
    }
    
    if(contentText.trim() === "") {
      
        setError($("#error-content"),"*Article`s content cannot be empty!");
        validationErrors = true;
    }
    else{
         resetError($("#error-content"));
    }
   
   //If there were any errors return this function now
    if(validationErrors){
        setError($("#inputs-in-error"),"*You have errors on your inputs!");
        return;
    }else{
         resetError($("#inputs-in-error"));
    }
    
    //Create new article from user data
    var newArticle= {
        id: articleId,
        title: titleText,
        content:contentText,
        category_id: selectedCategory,
        img: imgFile,
        published: publish,
    };
    
    // call update method
    article.update(newArticle).done(function(response){
        
        if(response.success === true){
            popUp("success",response.message);
            window.location.reload();
        }else{
            popUp("error",response.message,response.error);
        }
        
    }); //END update method
   
}   //End sendData function

 //Function to display selected picture
 function pictureSelected(ev){
    
    //get selected picture 
    var fileType = ev.target.files[0].type;  
    
    //check if it is an image file 
    if(fileType.match(/^image\/.*$/gmi)){
        
        //read file as data url and assign it to src attribute of the image
        imgFile = ev.target.files[0]; 
        var reader = new FileReader();
        reader.onload = function(output){
            $("#main-image").attr("src",output.target.result);
        };
        reader.readAsDataURL(imgFile);
        resetError( $("#warning-image"));
     }
     else{
         imgFile = '';
        //  $("#warning-image>p").html("* Selected file is not valid. Only images are accepted!");
         setError($("#warning-image"),"* Selected file is not valid. Only images are accepted!");
     }
 }
 
 //Function to handle clicks on add/remove category buttons
 function manageCategories(){
    
    // determine clicked button
    switch(this.id){
        case 'add-category':
            
            //get category name input
            var categoryName = ($("input[name='newCategoryName']").val()).trim();
             
            //Validate category name input 
            if(categoryName === ''){
                setError( $("#error-new-category"),"*Category name cannot be empty");
                break;
            }else{
                resetError( $("#error-new-category"));
            }
            
            //chec if category with same name already exist 
            var existentCategory =  $("select").has("option:contains('" + categoryName + "')");
            
            if(existentCategory.length !== 0){
                setError( $("#error-new-category"),"*Category already exist!");
                break; 
            }else{
                 resetError($("#error-new-category"));
            }
        
            // Add category
            var newCategory = new Category();
            newCategory.add(categoryName).done(doneModifyCategory);
             
            break;
            
         case 'delete-category':
             
            //Get selected category
            var selectedCategory = $("#categories-cat-section").val().trim();
            
            //Validate selected category 
            if(selectedCategory === ''){
                setError($("#error-delete-category"),"*Choose the category that you wish to delete");
                break;
            }else{
                resetError($("#error-delete-category"));
            }
            
            //Delete selected category
            var category = new Category();
            category.delete(selectedCategory).done(doneModifyCategory);
            break;
    }
 }
 
 //callback function for category add/update 
 function doneModifyCategory(response, textStatus, jqXHR){
    if(response.success === true){
        popUp("success",response.message);
        fillCategorySelectElement();
    }else{
        popUp("error",response.message);
    }
    
 }//End doneModifyCategory
 
 //Top menu buttons click handler 
 function topMenuClick(){
  
   var clicked = $(this);
   
   switch (clicked.attr('id')){
       case 'login':
            window.location.href = UI_PAGE + "login.html";
       case 'logout':
            logout();
       break;
       case 'go-to-articles':
            window.location.href = UI_PAGE + "articles.html";
       break;
   }
}//END topMenuClick function
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