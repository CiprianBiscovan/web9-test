/*global $*/

//wait for page to be loaded
$(document).ready(onHtmlLoaded);
    
    //global variables
	var inputName = undefined;
	var inputId   = undefined;
	var errorEl   = undefined; 

//function to be executed when page is fully loaded
function onHtmlLoaded(){
	
	//get inputs that could be in error
	var inputs    = $("input");
    var select    = $("select");
	var textareas = $("textarea");
	
	//attach focus event
	inputs.focus(inputFocused);
	select.focus(inputFocused);
	textareas.focus(inputFocused);
	
}//END onHtmlLoaded function

//On inpuit focus event handler
function inputFocused(){
	    
	    //get focused input name or id
		inputName = this.name;
		inputId   = this.id;
		
	    errorEl = $("div[input-name = '" + inputName + "']");                   //try to get associated error message container by input name 
	    
		if(errorEl !== undefined && errorEl.length > 0 ){                       //if error message container was found reset error           
		   resetError(errorEl);
		   resetError($("#inputs-in-error"));
		}else{                                                                  //if error message container was not found
			
		   errorEl = $("div[input-id = '" + inputId + "']");                    //try to get associated error message container by input id 
		   
		   if(errorEl !== undefined && errorEl.length > 0 ){                    //if error message container was found reset error
				resetError(errorEl);
				resetError($("#inputs-in-error"));
		   }
		}
	
		if($(this).attr("section") == 'change-password'){                       //if focused element is in change-password section
			resetError($("#changepass-inputs-in-error"));                       //reset inputs-in-error message for that section
		}
		
}//END inputFocused function

//Show error message tootltip
function setError(errElement,errorMessage){
	
	var inputName = errElement.attr('input-name');                              //Get input name 
	var inputId = errElement.attr('input-id');                                  //Get input id
	var relatedInput;                                                           //Variable for input in error
	
	//Get input in error by name or by id - whichever was provided
	if(inputName){
		relatedInput = $('input[name = ' + inputName+ ']');
	}else if(inputId){
	   	relatedInput =  $('*[id=' + inputId +']' );
	}else{
		relatedInput =  $('');
	}
	
	//If input was selected set it "in-error" - red border
	if(relatedInput.length > 0 ){
		relatedInput.addClass('input-error');
	}
	
	//Set error message inside tooltip and show tooltip
	errElement.children("p").html(errorMessage);
	errElement.addClass('visible');
	errElement.removeClass('no-display');
	
}//END setError

//Hide error message tooltip
function resetError(errElement){
	var inputName = errElement.attr('input-name');                              //Get input name
	var inputId = errElement.attr('input-id');                                  //Get input ID
	var relatedInput;                                                           //Variable for input in error
	
    //Get input in error by name or by id - whichever was provided
	if(inputName){
		relatedInput = $('input[name = ' + inputName+ ']');
	}else if(inputId){
	   	relatedInput =  $('*[id=' + inputId +']' );
	}else{
		relatedInput =  $('');
	}
	//If input was selected remove red border
	if(relatedInput.length > 0 ){
		relatedInput.removeClass('input-error');
	}
	
	//Reset error message inside tooltip and hide tooltip
	errElement.children("p").html('*');
	errElement.removeClass('visible');
	errElement.addClass('no-display');
	
}//END resetError function

//Show pop-up messages
function popUp(type,message,description){
	
	//Check if detailed description exist
	if(description === undefined) {
		description = '';
	}else{
		description = '<strong>REASON: </strong>' + description;
	}
	
	//Create pop-up window 
	var popUp = $("<div id='popUp'>" +
	              "<div id='popup-content' class='" + type.toLowerCase() + "'>" +
	               "<p class='close'>&times;</p>" +
		          "<h1>" + message +  "</h1>" +
		          "<p>" + description + "</p>" +
		          "</div>" +
	              "</div>");
	
	//Add pop-up element to the page body
	$("body").append(popUp);
	
	//set timer for automatic closing of pop-up window
	setTimeout(closePopUp,POPUP_TOUT);
	
	//attach click event to the window close button X 
	popUp.children().find(".close").on('click',closePopUp);
	
}//end popUp function

//Close popUp window
function closePopUp(){
	
	//remove element from page body
	$("#popUp").remove();
	
}//END closePopUp