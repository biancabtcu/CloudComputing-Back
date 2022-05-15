Introducere

Weather Subscription App este o aplicație web care poate fi folosită în scopul gestionării abonamentelor de prognoza meteo în funcție de locația aleasă, dar și pentru a promova serviciul propus. Această aplicație utilizează patru servicii în cloud, și anume:

-	Google Cloud Platform – folosit pentru asigurarea unei baze de date SQL;
-	SendGrid – folosit pentru a facilita trimiterea e-mailurilor;
-	Weather API – folosit pentru a colecta date despre vreme și prognoză meteo;
-	Heroku – pentru a face deploy aplicatiei.

Link-ul pentru accesarea aplicației este: 
https://morning-badlands-01093.herokuapp.com/

Link-uri GitHub:

https://github.com/biancabtcu/CloudComputing-Back

https://github.com/biancabtcu/CloudComputing-Front

Link prezentare video: https://youtu.be/J5IfjxEhjYg

Descriere problemă 

Rolul acestei aplicații este de a oferi posibilitatea de a trimite prin e-mail prognoza meteo dintr-o anumită localitate unor persoane selectate care au ales să se aboneze pentru acest serviciu. Tot în cadrul aplicației putem trimite mesaje cu scop de marketing folosind e-mailul, astfel încurajând publicul țintă să foloseasca acest serviciu. 

Descriere API

Aplicația folosește o arhitectură de tip client-server care comunică prin protocolul HTTP. Aceasta folosește metode HTTP (GET, POST, PUT, DELETE) pentru a primi date referitoare la mesajele trimise din baza te date, pentru a crea noi înregistrari, a actualiza înregistrarile existente sau a șterge înregistrari.
Aplicația folosește metoda GET pentru a primi toate datele despre e-mailurile trimise, pentru a le afișa apoi în secțiunea de Recently sent e-mails. Metoda POST este folosita pentru a insera noi înregistrări în baza de date folosind datele introduse în câmpurile YOUR NAME, RECEIVER MAIL și YOUR MESSAGE.
 ![image](https://user-images.githubusercontent.com/105164579/168473930-11318866-a654-48ca-a10c-ba0e471560bd.png)

În vederea realizării aplicației am realizat următorii pași:
-	Am inițializat partea de back-end;
-	Am creat, configurat și pornit instanța bazei de dare din Google Cloud platform;
-	Am utilizat MySQL Workbench pentru a configura baza de date și am creat tabela de date folosită în cadrul proiectului, care are următoarele atribute: senderName, Sender Mail, receiverMail, messageContent;
-	Am conectat baza de date la back-end;
-	Am implementat metodele GET, POST, PUT și DELETE iar apoi am testat folosind Postman;
-	Am inițializat partea de front-end;
-	Am obținut informațiile necesare conform documentației SendGrid și am creat un API Key iar după integrarea am testat funcționalitatea în Postman;
-	Am obținut informațiile necesare conform documentației Weather API și am creat un API Key, iar apoi am integrat si am utilizat funcționalitățile în aplicație;
-	Dupa realizarea aplicației, am facut deploy folosind Heroku.

Flux de date 

Datele de intrare folosite în cadrul aplicației sunt cele introduse în câmpurile YOUR NAME, RECEIVER MAIL, YOUR MESSAGE și câmpul destinat introducerii localității dorite pentru a obține prognoza meteo. Aceste câmpuri sunt completate de către utilizator cu scopul de a trimite un e-mail. 
Datele de iesire sunt lista cu mesaje recente din secțiunea de Recently sent e-mails și date referitoare la prognoza meteo aleasă în funcție de localitatea introdusă de utilizator.

1.	Metode HTTP

Metodele HTTP folosite în cadrul aplicației sunt următoarele:
- GET - Read (Citire) – ne ajută să primim date referitoare la toate e-mailurile trimise care se află în baza de date (senderMail, reciverMail, contentMessage);
-	POST – Create (Creare) – ne ajută să creăm o nouă înregistrare în baza de date;
-	PUT – Update (Actualizare) – ne ajută să schimbăm datele dintr-o înregistrare existentă din baza de date;
-	DELETE – Delete (Ștergere) – ne ajută să stergem o înregistrare din baza de date.
Aceste operatii de tip CRUD au rolul de a trimite serverului că facem un request de tip citire/creare/actualizare/ștergere.
 
![image](https://user-images.githubusercontent.com/105164579/168473966-163de6c1-55f2-42ac-a2fe-fc311cecee4a.png)

2.	Exemple de request / response


Get All Messages
Request: http://localhost:8080/messages
(Obține informațiile despre toate mesajele trimise)

Response:
{
    "messages": [
        {
            "entryID": 48,
            "senderName": "Bianca",
            "senderMail": "edith.dragoi@gmail.com",
            "receiverMail": "biticubianca18@stud.ase.ro",
            "messageContent": "Here is the weather forecast for today: New York 16 Mist"
        },
        {
            "entryID": 56,
            "senderName": "Maria",
            "senderMail": "edith.dragoi@gmail.com",
            "receiverMail": "biticubianca18@stud.ase.ro",
            "messageContent": "Subscribe to our weather forecast!"
        }
    ]
}


Get message by ID

Request: http://localhost:8080/messages/56
(Obține informațiile despre mesajul trimis care are Id-ul 56)

Response:
{
    "messages": [
        {
            "entryID": 56,
            "senderName": "Maria",
            "senderMail": "edith.dragoi@gmail.com",
            "receiverMail": "biticubianca18@stud.ase.ro",
            "messageContent": "Subscribe to our weather forecast!"
        }
    ]
}

Delete a message by Id

Request: http://localhost:8080/messages/62
(Sterge înregistrarea cu Id-ul 62)

Response:
{
    "results": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 0,
        "serverStatus": 2,
        "warningCount": 0,
        "message": "",
        "protocol41": true,
        "changedRows": 0
    }
}

Insert a message

Request: http://localhost:8080/messages
(Adaugă o nouă înregistrare)

Response:
{
    "results": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 62,
        "serverStatus": 2,
        "warningCount": 0,
        "message": "",
        "protocol41": true,
        "changedRows": 0
    }
}

Update a message

Request: http://localhost:8080/messages/62
(Modifică înregistrarea cu Id-ul 62)

Response:
{
    "results": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 0,
        "serverStatus": 2,
        "warningCount": 0,
        "message": "(Rows matched: 1  Changed: 1  Warnings: 0",
        "protocol41": true,
        "changedRows": 1
    }
}

3.	Autentificare și autorizare servicii utilizate 

Pentru a utiliza cele patru serivii menționate a fost necesară crearea unui cont în cadrul fiecărei platforme utilizate.

•	Google Cloud Platform 
A fost necesară crearea instanței SQL, a user-ului și a bazei de date folosind o parolă. Apoi, pentru a autoriza rețeaua am adăugat adresa IP în Authorized Networks- Connections. 

•	SendGrid 
După crearea contului a fost necesara utilizarea 2FA (pentru sporirea securității). După această etapă am creat un API Key pe care l-am folosit pentru a oferi autorizare proiectului. Pentru a folosi Send Grid a fost necesară si validarea e-mailului pe care l-am folosit sa trimitem e-mailuri (Single Sender Verification).

•	Weather API 
Similar procesului pentru SendGrid, am creat un cont urmând apoi să creez un API Key pe care l-am folosit apoi în vederea autorizării.

•	Heroku 
Dupa procesul de creare al contului a trebuit să folosesc comanda heroku login pentru a trece prin un proces de logare pe Heroku.

Capturi ecran platforme utilizate și aplicație

Restul capturilor de ecran de regasesc in pdf.

Referințe

How to Build a Weather App with React - https://www.youtube.com/watch?v=rtR4s626ebE
