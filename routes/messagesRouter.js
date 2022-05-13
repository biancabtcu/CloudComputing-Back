const express = require('express');
const mysql = require("mysql");
const router = express.Router();
const connection = require("../db.js");
const {detectLanguage,translateText}=require("../utils/translateFunctions");
const { sendMail } = require("../utils/mailFunctions.js");
const { LANGUAGE_ISO_CODE } = require('../utils/dictionaries');

//get all messages
router.get("/", (req, res) => {
    connection.query("SELECT * FROM messages", (err, results) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
  
      return res.json({
        messages: results,
      });
    });
  });

  //get a message by id
  router.get("/:id", (req, res) => {
    const { id } = req.params;
    connection.query(`SELECT * FROM messages WHERE entryID = ${mysql.escape(id)}`, (err, results) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      if (results.length ===0 ) {
        return res.status(400).send("Message not found.");
    }
      return res.json({
        messages: results,
      });
    });
  });

 
//Insert a message
  router.post("/", (req, res) => {
    const { senderName, senderMail, receiverMail, messageContent } = req.body;
    
    if (!senderName || !senderMail || !receiverMail || !messageContent ) {
      // send bad request error
      return res.status(400).send("Bad request. Missing parametres.");
    }
  
    const queryString = `INSERT INTO messages (senderName, senderMail, receiverMail, messageContent) VALUES (${mysql.escape(
      senderName
    )}, ${mysql.escape(senderMail)}, ${mysql.escape(
      receiverMail
    )}, ${mysql.escape(messageContent)})`;
  
    connection.query(queryString, (err, results) => {
      if (err) {
        return res.send(err);
      }
  
      return res.json({
         results,
      });
    });
  });


  router.post("/send", (req,res) => {
    const {senderName, senderMail, receiverMail, messageContent}= req.body;
    if(!senderName||!senderMail||!receiverMail||!messageContent){
        return res.status(400).send("Missing Parameters");
    }
    
    sendMail(receiverMail,senderMail,messageContent, `${senderName} has sent you a message`);
    
    const queryString = `INSERT INTO messages (senderName, senderMail, receiverMail, messageContent) VALUES (${mysql.escape(
      senderName
    )}, ${mysql.escape(senderMail)}, ${mysql.escape(
      receiverMail
    )}, ${mysql.escape(messageContent)})`;
  
    connection.query(queryString, (err, results) => {
      if (err) {
        return res.send(err);
      }
  
      return res.json({
         messageContent
      });
    });
});
//delete a message
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    if (!id) {
        // send bad request error
        return res.status(400).send("Bad request. Missing parametres.");
    }
    const queryString = `DELETE FROM messages WHERE entryID = ${mysql.escape(id)}`;
    connection.query(queryString, (err, results) => {
        if (err) {
            return res.send(err);
        }
        if (results.length === 0) {
            return res.status(404).send("Message not found.");
        }
        return res.json({
            results,
        });
    }
    );
}
);


// Add update by id route
router.put("/:id", (req, res) => {
    const { id } = req.params;
    if (!id) {
        // send bad request error
        return res.status(400).send("Bad request. Missing parametres.");
    }
    const { senderName, senderMail, receiverMail, messageContent } = req.body;
    if (!senderName || !senderMail || !receiverMail || !messageContent) {
        // send bad request error
        return res.status(400).send("Bad request. Missing parametres.");
    }
    const queryString = `UPDATE messages SET senderName = ${mysql.escape(senderName)}, senderMail = ${mysql.escape(senderMail)}, receiverMail = ${mysql.escape(receiverMail)}, messageContent = ${mysql.escape(messageContent)} WHERE entryID = ${mysql.escape(id)}`;
    connection.query(queryString, (err, results) => {
        if (err) {
            return res.send(err);
        }
        if (results.length === 0) {
            return res.status(404).send("Message not found.");
        }
        return res.json({
            results,
        });
    }
    );
}
);


router.post("/foreign", async (req,res) => {
  const {senderName,senderMail,receiverMail,messageContent, language} = req.body;
  if (!senderName || !senderMail || !receiverMail || !messageContent || !language) {
    // send bad request error
    return res.status(400).json({
      error: "All fields are required"})
}

if(!LANGUAGE_ISO_CODE[language] && language !== "ALL"){
  console.log(language);
  return res.status(400).send("Invalid Language");
}

let translationData = {};

try{
if(LANGUAGE_ISO_CODE[language]){
  const translatedText = await translateText(messageContent,LANGUAGE_ISO_CODE[language]);
  translationData.translatedText=translatedText[0];
}
  else if(language === "ALL"){
    const availableLanguages = Object.values(LANGUAGE_ISO_CODE);

    const translatedAnswersArray = await Promise.all(
      availableLanguages.map( async (language) => {
        const translatedText = await translateText(messageContent, LANGUAGE_ISO_CODE[language]);
        return translatedText[0];
      })
    );

    translationData.translatedText=translatedAnswersArray.reduce(
      (acc,curr) => {
        return acc+ curr + "\n";
      }, 
      ""
    );
  }

  else {
    return res.send("Invalid Language");
  }

  sendMail(receiverMail,senderMail,translationData.translatedText, `${senderName} has sent you a message`);

  connection.query(`INSERT INTO messages (senderName, senderMail, receiverMail, messageContent) VALUES (${mysql.escape(senderName)}, ${mysql.escape(senderMail)}, ${mysql.escape(receiverMail)}, ${mysql.escape(messageContent)})`, (err, results)=>{
    if(err) {
      console.log(err);
      return res.send(err);
    }

    return res.json({
      translationData
    });
  });
}
catch(err){
  console.log(err);
        return res.send(err);
}
});
module.exports = router;