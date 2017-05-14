/*global $ */
/*global URL_PHP */
/*global popUp */

//Conatct class
function Contact(){
    
    this.sendMessage = function(message){
        
        //AJAX configuration object
        var config = {
            
             url: URL_PHP + "contactUs",                                        //PHP API path
            type:'POST',                                                        //Req. method to be used
            data: {                                                             //Data for PHP API
                       name: message.name,
                      email: message.email,
                      phone: message.phone,
                    subject: message.subject,
                    message: message.content,
            },
          
            //function to be executed in case of request failure
            error: function(xhr){
                popUp("error","Oops! Something went wrong while sending message!",xhr.responseText);
            },
        };
        
        return $.ajax(config);                                                  // send message to the server and return the result
        
    };
    
}//end Contact class