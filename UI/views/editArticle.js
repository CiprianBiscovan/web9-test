/* global $ Articles*/
$(document).ready(onHtmlLoaded);
  
  //Get user information
  var user = new User();
  if(user.isLogged === false || user.isAdmin === false){
       window.location.href = UI_PAGE + "unauthorizedAccess.html";
  }
  
//global variables
var imgFile = '';
var validationErrors = false;
var article = new Article();
var articleId = null;

function onHtmlLoaded(){
    
    if(user.isLogged === false || user.isAdmin === false){
       return;
   } 
    
  articleId = getUrlParam('id');
  
  article.getArticleById(articleId).done(fillArticleData);

  
  
  //get reference to html elements that 
    var saveButton        = $("#save-btn");       //get Save Button element
    var chooseImg         = $("#article_file");   //get Choose File button Element
    var categoryList      = $('#categories');     // get category list element
    var deleteImage       = $('#delete-img');     // get delete image button
    
    //Subscribe elements to events
    saveButton.on("click",sendData);
    chooseImg.change(pictureSelected);
    categoryList.change(selectionChanged);
    $(".manage-categories").on("click",manageCategories);
    deleteImage.on("click",function(){
       imgFile = '';
       chooseImg.val("");
       $("#main-image").attr('src','/Blog/Resources/image_comming_soon.png');
   });
    
    addTopMenu();                 //Add top menu buttons
    
     function fillArticleData(articleData){
        if(articleData.length > 0 ){
            article = new Article(articleData[0]);
            
             fillCategorySelectElement();  //Create list with available categories
             
            //Display article data in correspondent elements
            $('#main-image').attr("src",article.img);
            $('#title').val(article.title);
            $('#category').html(article.category);
            $('#content').val(article.content);
            $('select').val(article.category_id);
            $("input[type='radio'][value='" + article.published + "']").prop("checked",true);
            imgFile = articleData[0].main_image_url;
        }else{
            console.log("Article does not exist");
        }
    }
    
} //END onHtmlLoaded

// ------------------------------------------------DOM Manipulation------------------------------------------------------------
//Function for creating top menu 
function addTopMenu(){
    var topMenu = $("#top-menu");
   
        user.isLogged ? topMenu.append("<h3>"+ user.loggedUserRole + ": " + user.loggedUserName + "</h3>").append("<button id='logout'>Logout</button>") :
                   topMenu.append("<button id='login'>Login</button>");
                  
        topMenu.append("<button id='go-to-articles'>Articles</button>");
      
        topMenu.children().click(topMenuClick);
    
}//END addTopMenu function

//Function for building category list in Select element
function fillCategorySelectElement(){
    
    var selectElement = $("#categories"); //get select element container
    var categories = new Categories();    //create Categories instance
    
    selectElement.empty();
    selectElement.append("<option value='' selected>Choose Category</option>");
    
    //function to get all categories from server and add them to the options list
    categories.getAll().done(function(){
      
        for(var i = 0; i < categories.categoriesList.length; i++){
        selectElement.append("<option value=" + categories.categoriesList[i].id + ">" + categories.categoriesList[i].name + "</option>");
    }
    
    //set article`s category
    selectElement.val(article.category_id);
    
    }); //End fillCategorySelectElement function
    
    
}//END fillCategorySelectElement function

// -------------------------------------------------------------/DOM Manipulation----------------------------------------------------------

// ---------------------------------------------------------------Events Handle----------------------------------------------------------- 

//function to get data from inputs and prepare it for ajax requeste
function sendData(ev){
    
    // ev.preventDefault(); 
    
    var titleText = $("#title").val().trim();
    var contentText = $("#content").val().trim();
    var selectedCategory = $("select").val().trim();
    var publish = $("input[type='radio']:checked").val().trim();
   
   //Check and create error messages for each required field
    if(titleText.trim() === "") {
        
        $("#error-title>p").html("*Article`s title cannot be empty!");
        validationErrors = true;
    }
    else{
         $("#error-title>p").html("*");
    }

    if(selectedCategory === ''){
          $("#error-category>p").html("*Please select a category for this article");
    }
    else{
        $("#error-category>p").html("*");
    }
    
    if(contentText.trim() === "") {
      
       $("#error-content>p").html("*Article`s content cannot be empty!");
        validationErrors = true;
    }
    else{
        $("#error-content>p").html("*");
    }
    if(publish.trim() !== "1") {
      
       $("#warning-publish>p").html("*Unpublished articles are not be visible to other users!");
        
    }
    else{
        $("#warning-publish>p").html("*");
    }
   
   //If there were any errors return this function now
    if(validationErrors) return;
    
    var newArticle= {
        id: articleId,
        title: titleText,
        content:contentText,
        category_id: selectedCategory,
        img: imgFile,
        published: publish,
    };
    
        article.update(newArticle).done(function(response){
                
                window.location.reload();
        });
   
}   //End sendData function

 //Function to display selected picture
 function pictureSelected(ev){
     var fileType = ev.target.files[0].type;
     
     if(fileType.match(/^image\/.*$/gmi)){
         
         imgFile = ev.target.files[0]; 
         var reader = new FileReader();
         reader.onload = function(output){
             $("#main-image").attr("src",output.target.result);
        };
        reader.readAsDataURL(imgFile);
        $("#warning-image>p").html("*");
     }
     else{
         imgFile = '';
       
         $("#warning-image>p").html("* Selected file is not valid. Only images are accepted!");
     }
 }
 
 //function to handle selection changes
 function selectionChanged(){
     var option = this.selectedIndex;     //get selected index
     var  category      = $('#category'); // get choosen category display element 
     
     //Update category element with choosen category name
     if(option === 0){
         category.html("Default Topic");
     }else{
         category.html(this.options[option].text);
     }
 }
 
 //Function to handle clicks on add/remove category buttons
 function manageCategories(){
     
     switch(this.id){
         case 'add-category':
             var categoryName = ($("input[name='newCategoryName']").val()).trim();
             
             if(categoryName === ''){
                 $("#error-new-category>p").html("*Category name cannot be empty");
                 break;
             }
             else{
                 $("#error-new-category>p").html("*");
             }
             var existentCategory =  $("select").has("option:contains('" + categoryName + "')");
            
             if(existentCategory.length !== 0){
                $("#error-new-category>p").html("*Category already exist");
                 break; 
             }else{
                $("#error-new-category>p").html("*");
             }
             var newCategory = new Category();
             newCategory.add(categoryName).done(doneModifyCategory);
             
             break;
         case 'delete-category':
              var selectedCategory = $("select").val().trim();
             
             if(selectedCategory === ''){
                 $("#error-new-category>p").html("*Choose the category that you wish to delete");s
                 break;
             }
             else{
                 $("#error-new-category>p").html("*");
             }
             var category = new Category();
             category.delete(selectedCategory).done(doneModifyCategory);
             break;
     }
 }
 //function executed after deleting/adding category  
 function doneModifyCategory(response, textStatus, jqXHR){
    if(response.success === true){
        console.log(response.message);
        fillCategorySelectElement();
    }else{
        console.log(response.message);
    }
    
 }//End doneModifyCategory
 
    function showArticles(){
        window.location.href = UI_PAGE + "articles.html";
    }
     
 function topMenuClick(){
  
   var clicked = $(this);
   
   switch (clicked.attr('id')){
       case 'login':
            window.location.href = UI_PAGE + "login.html";
       case 'logout':
           window.location.href = UI_PAGE + "logout.html";
       break;
       case 'go-to-articles':
             window.location.href = UI_PAGE + "articles.html";
       break;
   }
}
// ---------------------------------------------------------------/Events Handle----------------------------------------------------------- 
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