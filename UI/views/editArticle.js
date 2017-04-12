/* global $ Articles*/
$(document).ready(onHtmlLoaded);

  if(isLogged === false || isAdmin === false){
       window.location.href = UI_PAGE + "unauthorizedAccess.html";
    }
// global variables
var imgFile = null;
var validationErrors = false;
var publish = 0;
var article = new Article();

function onHtmlLoaded(){
  
   var articleId = getUrlParam('id'); 
   
   fillCategorySelectElement();  //Create list with available categories
     
   article.getArticleById(articleId).done(fillArticleData);
   
   //get reference to html elements that 
    var saveButton        = $("#save-btn");     //get Save Button element
    var publishButton     = $('#publish-btn');  //get Publish button element
    var chooseImg         = $("#article_file"); //get Choose File button Element
    var categoryList      = $('#categories');   // get category list element
  
    //Subscribe elements to events
    saveButton.on("click",sendData);
    publishButton.on("click",sendData);
    chooseImg.change(pictureSelected);
    categoryList.change(selectionChanged);
    $(".manage-categories").on("click",manageCategories);
 
    
    addTopMenu();                 //Add top menu buttons
    $("#new-article").remove();   //Remove uneeded <New Article> button 
    addArticlesLink();            //Add link to Articles page
  
  
    function fillArticleData(articleData){
        if(articleData.length > 0 ){
            article = new Article(articleData[0]);
            
            //Display article data in correspondent elements
            $('#main-image').attr("src",article.img);
            $('#title').val(article.title);
            $('#category').html(article.category);
            $('#content').val(article.content);
            $('select').val(article.category_id);
            
        }else{
            console.log("Article does not exist");
        }
    }
 
    
} //END onHtmlLoaded
  
//function to get data from inpits and prepare it for ajax requeste
function sendData(ev){
    
    // ev.preventDefault(); 
    
    var titleText = $("#title").val().trim();
    var contentText = $("#content").val().trim();
    var selectedCategory = $("select").val().trim();
   // var imgFile = $("#article_file")[0].files[0];
   
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
   
   //If there were any errors return this function now
    if(validationErrors) return;
 
    switch($(ev.target).attr("id")){
        case "save-btn":
            publish = 0;
            break;
        case "publish-btn":
            publish = 1;
            break;
        default:
            publish = 0;
            break;
    };
    
    var articles = new Articles();

    var newArticle= {
        title: titleText,
        content:contentText,
        category_id: selectedCategory,
        img: imgFile,
        published: publish,
    };
    
    var response = articles.save(newArticle);
    console.log(response);
    response.done(showArticles);
     
}   //End sendData function

 function showArticles(){
        window.location.href = UI_PAGE + "articles.html";
     }
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
         imgFile = null;
       
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
             
             var newCategory = new Category();
             newCategory.add(categoryName).done(doneModifyCategory);
             
             break;
         case 'delete-category':
              var selectedCategory = $("select").val().trim();
             
             if(selectedCategory === ''){
                 $("#error-new-category>p").html("*Choose the category that you wish to delete");
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
        console.log("Category added!")
        fillCategorySelectElement();
    }else{
        console.log(response.message);
    }
    
 }//End doneModifyCategory
 
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