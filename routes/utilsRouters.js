const express = require('express');
const { sendMail } = require("../utils/mailFunctions.js");
const { LANGUAGE_ISO_CODE } = require('../utils/dictionaries');
const router = express.Router();
const {detectLanguage,translateText}=require("../utils/translateFunctions");
const {detectLabels, detectImageProperties}=require("../utils/imageRecognitionFunctions")

router.get("/detect", async (req,res)=>{
const {text} = req.body;
if(!text){
    return res.status(400).send("Missing Parameters");
}

const languageDetection = await detectLanguage(text);
return res.json({
    language: languageDetection[0]?.language
})
});

router.get("/translate", async (req,res)=>{
    const {text,language} = req.body;
    if(!text||!language){
        return res.status(400).send("Missing Parameters");
    }
    
    if(!LANGUAGE_ISO_CODE[language]){
        return res.status(400).send("Invalid Language");
    }
    const translatedText = await translateText(text,language);
    return res.json({
        translatedText: translatedText[0]
    })
    });

    
    

    router.post("/send", (req,res) => {
        const {senderName, senderMail, receiverMail, messageContent}= req.body;
        if(!senderName||!senderMail||!receiverMail||!messageContent){
            return res.status(400).send("Missing Parameters");
        }
        
        sendMail(receiverMail,senderMail,messageContent, `${senderName} has sent you a message`);
        res.send(200);
    });

    router.get("/labels", async (req, res) => {
        const { link } = req.body;
        if (!link) {
            return res.status(400).send("Bad request. Missing parametres.");
        }
        const labels = await detectLabels(link);

        const dominantColors = await detectImageProperties(link);
        
        return res.json({
            labels,
            dominantColors
        });
    }
    );

module.exports = router;