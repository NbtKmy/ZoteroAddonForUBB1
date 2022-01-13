# Zotero Add-on für UBB1-Bibliothek

Zotero UBB1 Holding Checker ist ein modifiziertes Add-on [Zotero Swissbib Basel Bern Locations](https://github.com/UB-Bern/zotero-swissbib-bb-locations). Mit diesem Add-on kann man Standortinformation der Bibliothek UB-UBB1 an der Universität Zürich in ALMA (IZ innerhalb SLSP = UZB) durchsuchen.

Zotero Swissbib Basel Bern Locations ist ein Add-on für das Literaturverwaltungsprogramm [Zotero](https://www.zotero.org/) sowie das darauf basierende [Jurism](https://juris-m.github.io/) zur Unterstützung des Bestandesaufbaus an der UB Bern. Das Add-on kann über die SRU-Schnittstelle von [Swissbib](https://www.swissbib.ch/) Standortinformationen im Swissbib Basel Bern zu den ausgewählten Einträgen abrufen und -- je nach Ergebnis der Abfrage -- entsprechende Tags setzen.

Weil das Bibliothekssystem ALMA ab Dez. 2020 für die Schweizer Hochschulbibliotheken eingeführt wird und die bisherige SRU-Schnittstelle der Swissbib nicht mehr verwendet werden kann, gibt es die Verison 1.0.0.
Diese Version nutzt die SRU-Schnittstelle ALMA für die Metadatenabfrage. 

## Anwendung
Wenn man einfach das Add-on benutzen will, kann man die Datei 'zotero-ubb1-holding-1.0.0.xpi' von dieser Repository herunterladen und ins Zotero installieren.
Wenn man dies jedoch selber modifizieren will, kann man die anderen Datei, vor allem den Ordner "chrome/\*", herunterladen, Codes ändern und mit folgendem Befehl eine xpi-Datei herstellen, was als Add-on ins Zotero installiert werden kann.

`$zip -r zotero-ubb1-holding-[version].xpi chrome/* chrome.manifest install.rdf`  

Mit diesem Add-on kann man Holdinginformation innerhalb der UZH/ZB zu den jeweiligen Titel suchen, die in Zotero eingetragen sind.
Bedingungen sind:
- Titel/Item in Zotero is als Book/Buch markiert
- Titel/Item hat eine gültige ISBN-Nummer

### How to
1. Add-on in Zotero installieren
2. Buchtitel in Zotero markieren, für die man Besitznachweise untersuchen möchte (mehrere Titel möglich)
3. Mit dem Rechtsklick taucht Menu-Liste. Darunter "UB-UBB1 Bestandssuche" und weiter "Bestandssuche" klicken
4. Dann taucht das Suchergebnis (Bestandsinformation) im Feld "Abstract". Darüber hinaus werden die entsprechenden Tags hinzugefügt

#### Tags
- UB-UBB1 Standortcheck: UB-UBB1 ja - Bedeutet entweder, dass die ubb1-Bibliothek den Titel besitzt, oder - dass mindestens ein e-Book für UZH/ZB vorhanden ist
- UB-UBB1  Standortcheck: UZH/ZB Online - Bedeutet, dass mindestens ein e-Book für UZH/ZB vorhanden ist
- UB-UBB1  Standortcheck: UB-UBB1 Kurierbibliothek - Bedeuet, dass mindestens eine benachbarte Bibliothek der UBB1 (Zentralbibliothek) den Titel besitzt


## License

Copyright (C) 2019 Denis Maier / Modified by Nobutake Kamiya

Distributed under the GPLv3 License.
