const express = require('express');
const { sendMail } = require("../utils/mailFunctions.js");
const router = express.Router();


  
    

    router.post("/send", (req,res) => {
        const {senderName, senderMail, receiverMail, messageContent}= req.body;
        if(!senderName||!senderMail||!receiverMail||!messageContent){
            return res.status(400).send("Missing Parameters");
        }
        
        sendMail(receiverMail,senderMail,messageContent, `${senderName} has sent you a message`);
        res.send(messageContent);
    });

   

module.exports = router;