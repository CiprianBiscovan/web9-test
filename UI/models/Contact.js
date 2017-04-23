//Conatct class
function Contact(){
    
    this.sendMessage = function(message){
        
        var config = {
            url: URL_PHP + "contactUs",
            type:'POST',
            data:{
                name:message.name,
                email:message.email,
                phone:message.phone,
                subject:message.subject,
                message:message.content,
            },
            
            //function to be executed in case of request failure
            error: function(){
                console.log("Oops! Something went wrong while sending message!");
            },
        };
        
        return $.ajax(config); // send message to the server and return the result
        
    };
    
}//end Contact class