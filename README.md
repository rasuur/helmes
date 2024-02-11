Töö tehtud Helmese test ülesandeks.

Tehtud backend-s spring boot-ga Java-s ja frontend-s javascript-ga ning päringud fetch API-ga.

Frontend asub src/main/resources/static kaustas.

Andmebaas on lihtsalt H2 mälu, mis sellise rakenduse jaoks on piisav, kuna otseselt kasutusse see kunagi ei lähe. Sellepärast pole ka database dumpi.
Database struktuur genereeritakse ise entitite pealt ehk kui rakendus käivitada, siis luuakse tabelid ja täidetakse andmetega vastavalt data.sql failile.

Paar muudatust tegin ka html-i.
Lisasin toasti, ning sektorite valik on selline, et kui selectid üks või mitu sektorit, siis vastavalt selectitud sektoritele ta ka kuvab subsectorid uues selectis (millegi pärast tegin endale töö raskemaks :) ).

Css-i ei hakkanud ka lisama, kuna otseselt soovitud ei olnud. Teste ka ei teinud.

Kindlasti mingeid bugisid on, mis märkamata jäi.
