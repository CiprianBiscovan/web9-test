/* global $ */
/* global User Articles Categories Category*/
/* global UI_PAGE logout*/
/* global setError resetError popUp*/

//always check if HTML is loaded before doing anything
//HTML operations on view
$(document).ready(onHtmlLoaded);
  
  var user = new User();                                                        //Get logged user information
  
if(user.isLogged === false || user.isAdmin === false){                          //If user is not admin redirect to unauthorized page
    window.location.href = UI_PAGE + "unauthorizedAccess.html";
}
  
//global variables
var imgFile          = '';
var validationErrors = false;
var publish          = false;

function onHtmlLoaded(){
    
    //get reference to html elements that 
    var saveButton        = $("#save-btn");                                     //get Save Button element
    var chooseImg         = $("#article_file");                                 //get Choose File button Element
    var deleteImage       = $('#delete-img');                                   // get delete image button
    var radioBtn          = $("input[type='radio']");                           //get radio buttons
    var closeCat          = $("#close-manage-categories");                      //get close button on manage categories section
    var manageCat         = $("input[name='manageCategoriesButton']");          //get manage categories submit button

    //If nobody is logged or logged user is not admin stop script   
    if(user.isLogged === false || user.isAdmin === false){
       return;
    } 
     
    //Check published status 
    checkPublish();
  
    fillCategorySelectElement();                                                //Create list with available categories
    
    //Subscribe elements to events
    saveButton.on("click",sendData);
    chooseImg.change(pictureSelected);
    $(".manage-categories").on("click",manageCategories);
    deleteImage.on("click",function(){
       imgFile = '';
       chooseImg.val("");
       $("#main-image").attr('src','/Blog/Resources/image_comming_soon.png');
       resetError($("#warning-image"));
    }); //END delete image button event handler
   
    radioBtn.change(checkPublish);
   
    closeCat.on('click',function(){
       $('#category-section-background').addClass('no-display');
       
    }); //END close category button event handler
   
    manageCat.on('click',function(){
       $('#category-section-background').removeClass('no-display');
       fillCategorySelectElement();
       resetError($("#error-new-category"));
       resetError($("#error-delete-category"));
 
    }); //END manage category button event handler
    
    addTopMenu();                                                               //Add top menu buttons
   
    
} //END onHtmlLoaded

//Function to check if publish=yes and set/reset warning
function checkPublish(){
    
    publish = $("input[type='radio']:checked").val().trim();                    //get published status
    
    //if article is not published warn user it will not be visible 
    if(publish.trim() !== "1") {
        setError($("#warning-publish"),"*Unpublished articles will not be visible to other users!");
        return true;
    }else{
        resetError($("#warning-publish"));
        return false;
    }
     
}//END checkPublish function

// ------------------------------------------------DOM Manipulation------------------------------------------------------------

// Create top menu 
function addTopMenu(){
    
    //get existing containers
    var topMenu           = $("#top-menu");
    var usernameContainer = $("#username-wrapper");
    var btnsContainer     = $("#buttons-wrapper");
    
    //Init. role icon variable
    var roleIcon          = '';
	
	//determine role icon to use based on user role
	if (user.loggedUserRole === 'ADMIN'){
		roleIcon = "&#9812;";
	}else{
		roleIcon = "&#9817;";
	}
    
    //Add logged user name and buttons to top menu 
    topMenu.append(usernameContainer)
           .append(btnsContainer);
    
    //if user is logged in add username and logout button
    //else add login button
    if(user.isLogged) {
        usernameContainer.append("<h3 id='username'><span>"+ roleIcon + "</span> " + user.loggedUserName + "</h3>");
        btnsContainer.append("<button id='logout' class='red'><span><i class='fa fa-power-off'></i></span>Logout</button>");
    }else{
        btnsContainer.append("<button id='login' class='green'><span><i class='fa fa-key'></i></span>Login</button>");
    }
    
    btnsContainer.append("<button id='go-to-articles' class='blue'><span><i class='fa fa-list-ul'></i></span>Articles</button>");
    
    //Subscribe to click events on top menu buttons  
    topMenu.children().find('button').click(topMenuClick);
    
}//END addTopMenu function

//Create category list - fill Select element
function fillCategorySelectElement(){
    
    var selectElement = $('select');                                            //get select element container
    var newCategoryText = $("input[name='newCategoryName']");                   //get Text input for new category name
    
    newCategoryText.val('');                                                    //reset new category text input
    
    var categories = new Categories();                                          //New Categories object
    
    selectElement.empty();                                                      //Clear select element
    selectElement.append("<option value='' selected>Choose Category</option>"); //Add default option
    
    //Get all categories from server and add them to the options list
    categories.getAll().done(function(){
      
        for(var i = 0; i < categories.categoriesList.length; i++){
            selectElement.append("<option value=" + categories.categoriesList[i].id + ">" + categories.categoriesList[i].name + "</option>");
        }
    }); //Get all categories request completed
    
    
}//END fillCategorySelectElement function

// -------------------------------------------------------------/DOM Manipulation----------------------------------------------------------

// ---------------------------------------------------------------Events Handle----------------------------------------------------------- 

//Get data from inputs and prepare it for ajax requeste
function sendData(ev){
    
    validationErrors     = false;
    
    //Get user inputs
    var titleText        = $("#title").val().trim();
    var contentText      = $("#content").val().trim();
    var selectedCategory = $("select").val().trim();
   
   //Check and create error messages for each required field
    if(titleText.trim() === "") {
        
        setError($("#error-title"),"*Article`s title cannot be empty!");
        validationErrors = true;
    }else{
        resetError($("#error-title"));
    }

    if(selectedCategory === ''){
        setError($("#error-category"),"*Please select a category for this article");
        validationErrors = true;
    }else{
        resetError($("#error-category"));
    }
    
    if(contentText.trim() === "") {
        setError($("#error-content"),"*Article`s content cannot be empty!");
        validationErrors = true;
    }else{
         resetError($("#error-content"));
    }
   
   //If there were any errors return this function now
    if(validationErrors){
        setError($("#inputs-in-error"),"*You have errors on your inputs!");
        return;
    }else{
         resetError($("#inputs-in-error"));
    }
    
    var newArticle= {                                                           //article object with user data
        title: titleText,
        content:contentText,
        category_id: selectedCategory,
        img: imgFile,
        published: publish,
    };
        
    var articles = new Articles();                                              //new Articles object
    articles.save(newArticle).done(showArticles);                               // Save new article request
     
}  //End sendData function

 //Display selected picture
 function pictureSelected(ev){
     
     var fileType = ev.target.files[0].type;                                    //get selected file type
     
     if(fileType.match(/^image\/.*$/gmi)){                                      //check if file is image
         
        imgFile = ev.target.files[0];                                           //get selected picture
        var reader = new FileReader();                                          //new file reader object
        reader.readAsDataURL(imgFile);                                          //read image file
        
        reader.onload = function(output){                                       //load read data intu image html element
             $("#main-image").attr("src",output.target.result);
        };
        
        resetError( $("#warning-image"));
     }
     else{
         imgFile = '';
         setError($("#warning-image"),"* Selected file is not valid. Only images are accepted!");
     }
 }
 
 // add/remove category buttons clcik evend handler
 function manageCategories(){
    
    //determine clicked button 
    switch(this.id){
        case 'add-category':
            
            //get category name input
            var categoryName = ($("input[name='newCategoryName']").val()).trim(); 
            
            //check if  user input is valid
            if(categoryName === ''){
                setError( $("#error-new-category"),"*Category name cannot be empty");
                break;
            }else{
                resetError( $("#error-new-category"));
            }
            
            //verify if input name already exist
            var existentCategory =  $("select").has("option:contains('" + categoryName + "')");
            
            if(existentCategory.length !== 0){
               setError( $("#error-new-category"),"*Category already exist!");
               break; 
            }else{
                 resetError($("#error-new-category"));
            }
            
            //add category request 
            var newCategory = new Category();
            newCategory.add(categoryName).done(doneModifyCategory);
             
        break;
        
        case 'delete-category':
            
            //get selected category
            var selectedCategory = $("#categories-cat-section").val().trim();
            
            //validate selected category 
            if(selectedCategory === ''){
                setError($("#error-delete-category"),"*Choose the category that you wish to delete");
                break;
            }else{
                resetError($("#error-delete-category"));
            }
            
            //delete category request
            var category = new Category();
            category.delete(selectedCategory).done(doneModifyCategory);
        break;
    }
 } //END manageCategories function
 
 //deleting/adding category request completed 
 function doneModifyCategory(response, textStatus, jqXHR){
     
    if(response.success === true){
        popUp("success",response.message);
        fillCategorySelectElement();
    }else{
        popUp("error",response.message);
    }
    
 }//End doneModifyCategory function
 
//show newlly created article
function showArticles(response){
    
    if(response.success === true){
        window.location.href = UI_PAGE + "articles.html";
    
    }else{
        popUp("error",response.message);
    }
} //END showArticles

//top menu click event handler     
function topMenuClick(){
  
   var clicked = $(this);
   
   switch (clicked.attr('id')){
        case 'login':
            window.location.href = UI_PAGE + "login.html";
        break;
        case 'logout':
            logout();
        break;
        case 'go-to-articles':
             window.location.href = UI_PAGE + "articles.html";
        break;
   }
}//END topMenuClick function

// ---------------------------------------------------------------/Events Handle----------------------------------------------------------- 
