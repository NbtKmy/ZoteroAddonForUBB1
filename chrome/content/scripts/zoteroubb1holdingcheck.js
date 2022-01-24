///////////////
// Init
////////////////

function ubb1HoldingLookupInitialize () {
	// Hilfsvariable implizit global, ist das eine gute Idee?
	// Aktuell brauche ich die Zähler eigentlich nicht...
	itemWithoutISBN = 0;
	itemWithLocation = 0;
	itemWithoutLocation = 0;

	// Holdingbibliotheken
	holdingbibliothekenubb1 = [
		"UAOI", // AOI
		"UHS", // Historisches Seminar
		"UNI-OEG", // Historisches Seminar
		"UFSW", // Historisches Seminar
		"UKHIS", //Kunsthistorisches Institut
		"UARCH", // Institut für Archäologie
		"UUFG", // Institut für Archäologie
		"UMLS", // Seminar für Griechische und Lateinische Philologie 
		"UKPHS", // Seminar für Griechische und Lateinische Philologie 
		"UPHIL", // Philosophisches Seminar
		"UEZEN", // Ethik-Zentrum
		"UIH", // Theologische Fakultät
		"UIRG", // Theologische Fakultät
		"UTS", // Theologische Fakultät
		"UNI-ES", // Anglistik
		"UBFB", // Betriebswirtschaft
		"UIFE", // Erziehungswissenschaft (FRE)
		"UESZ", // Ethnologie & Soziologie 
		"USIUZ", // Ethnologie & Soziologie 
		"UDS", // Germanistik & Skandinavistik
		"UMBC", // Medizin Careum
		"UFBI", // Naturwissenschaften
		"UBOT", // Pflanzenwissenschaften
		"UVK", // Populäre Kulturen & Filmwissenschaft
		"UPSYC", // Psychologie
		"UNI-RWI", // Rechtswissenschaften
		"UROSE", // Romanistik
		"UKOMP", // Slavistik, AVL & Vergleichende Sprachwissenschaft
		"ULING", // Slavistik, AVL & Vergleichende Sprachwissenschaft
		"UVET", // Veterinärmedizin
		"UVMZ", // Völkerkundemuseum
		"UECON" // Volkswirtschaft
	];

	// Bibliotheken
	kurierbibliothekenubb1 = [
		"Z01" //Zentralbibliothek Zürich
		
	];

	libraryCodeUZBOnline = "UZZZZ";



	// ALMA-SRU-URL
	sruPrefix = "https://slsp-uzb.alma.exlibrisgroup.com/view/sru/41SLSP_UZB?version=1.2&operation=searchRetrieve&recordSchema=marcxml&query=alma.isbn=";
	sruSuffix = "&maximumRecords=3";

	// Tags & Strings
	noResultsubb1Text = "Keine Ergebnisse";
	isWithoutISBNText = "UB-UBB1 Standortcheck: ohne (gültige) ISBN";
	isNotInubb1Text = 'UB-UBB1 Standortcheck: UB-UBB1 nein';
	isInubb1Text= 'UB-UBB1 Standortcheck: UB-UBB1 ja';
	isinubb1KurierbibText = 'UB-UBB1 Standortcheck: UB-UBB1 Kurierbibliothek';
	isInUZBOnlineText = 'UB-UBB1 Standortcheck: UB-UBB1 Online';
	ubb1BEpossibly = 'UB-UBB1 Standortcheck: UB-UBB1 eventuell';

	tags = [isInUZBOnlineText, isWithoutISBNText, isInubb1Text, isinubb1KurierbibText, isNotInubb1Text, ubb1BEpossibly];

};

///////////////
// Funktionen
///////////////

// ISBN überprüfen
function isValidIsbn(isbn) {
	// ISBN überprüfen
	// Ist die Prüfziffer korrekt?
	// Korrekte Prüfziffer ist keine Garantie für korrekte ISBN, schliesst aber einige Fehlerquellen aus

	let lastDigit,
		currentDigit,
		checksum;

	// ISBN Rohdaten aufräumen: Alles weg ausser 0-9 und X;
    isbn = isbn.replace(/[^0-9X]/gi, '');
	// Ist die ISBN entweder 10 oder 13 Stellen lang? Falls nein => keine ISBN
    if (isbn.length != 10 && isbn.length != 13) {
        return false;
    }

	// Falls ja: letzte Ziffer holen
	lastDigit = isbn[isbn.length-1].toUpperCase();

	// Prüfzimmern berechnen
	// siehe https://de.wikipedia.org/wiki/Internationale_Standardbuchnummer

	// ISBN-13
    if (isbn.length == 13) {
		let sum =
			(
			  parseInt(isbn[0]) + parseInt(isbn[2]) + parseInt(isbn[4]) +
			  parseInt(isbn[6]) +	parseInt(isbn[8]) + parseInt(isbn[10])
			)
			+ 3 *
			(
			  parseInt(isbn[1]) + parseInt(isbn[3]) + parseInt(isbn[5]) +
			  parseInt(isbn[7]) +	parseInt(isbn[9]) + parseInt(isbn[11])
			);
		checksum =   (10 - (sum % 10)) % 10;
    }

	// ISBN-10
    if (isbn.length == 10) {
        let multiplicator = [1,2,3,4,5,6,7,8,9];
        checksum =
		  (
			parseInt(isbn[0]) * multiplicator[0] +
			parseInt(isbn[1]) * multiplicator[1] +
			parseInt(isbn[2]) * multiplicator[2] +
			parseInt(isbn[3]) * multiplicator[3] +
			parseInt(isbn[4]) * multiplicator[4] +
			parseInt(isbn[5]) * multiplicator[5] +
			parseInt(isbn[6]) * multiplicator[6] +
			parseInt(isbn[7]) * multiplicator[7] +
			parseInt(isbn[8]) * multiplicator[8]
		  ) % 11;
      // Statt Checksum 10 wird X verwendet
    	if (checksum == 10) {
            checksum = 'X';
        }
    }

// entspricht die letzte Ziffer der berechneten Prüfzimmer?
return (checksum == lastDigit);
}


// Tags hinzufügen je nach Status; ausserdem die Zähler hochsetzen
function ApplyTags(item,isInubb1,isinubb1Kurierbib,isInUZBOnline,isWithoutISBN) {
	// eventuell vorhandene alte Tags löschen
	for (const tag of tags) {
		if (item.hasTag(tag)) {
			item.removeTag(tag);
		}
	}
	// neue Tags setzen
	// keine ISBN
	if (isWithoutISBN == true) {
    item.addTag(isWithoutISBNText);
	  itemWithoutISBN++;
	}
	// kein Standort (aber ISBN)
	if ((isInubb1 == false) && (isWithoutISBN == false)) {
    item.addTag(isNotInubb1Text);
	  itemWithoutLocation++;
	}
	// Standort ubb1-BIB
  if (isInubb1 == true) {
		item.addTag(isInubb1Text);
	  itemWithLocation++;
	}
	// In ubb1 Kurierbibliothek
  if (isinubb1Kurierbib == true) {
    item.addTag(isinubb1KurierbibText);
	  itemWithLocation++;
	}
	// An ZB/UZH Online verfügbar
	if (isInUZBOnline == true) {
		item.addTag(isInUZBOnlineText);
	}
  if (status=="eventuell") {
    item.addTag(ubb1BEpossibly);
  }
}

function printResults() {
	results = items.length + " Einträge verarbeitet\n" + itemWithLocation + " Einträge mit Standort in UB-UBB1\n" + itemWithoutLocation + " Einträge ohne Standort in UB-UBB1\n" + itemWithoutISBN + " Einträge ohne ISBN";
	alert(results);
}

//XML Parsen
function processXML(item,xml) {
	// Schalter setzen
	let isInubb1 = false;
    let isInUZBOnline = false;
	let isinubb1Kurierbib = false;
	let isWithoutISBN = false;
	// Formatierung der Ergebnisse
	let date = new Date();
	let thisMonth = date.getMonth() + 1;
	let currentDate = date.getFullYear() + "-" + thisMonth + "-" + date.getDate() + " (" + date.getHours() + ":"  + date.getMinutes() + ":" + date.getSeconds() + ")";
	let holdingsFormatted = currentDate + " Bestand UB-UBB1\n=======================================";
	let xmlResponse = xml.responseXML;
	// Haben wir Ergebnisse in SLSP?
	// Nein =>
	if (xmlResponse.querySelector("searchRetrieveResponse > numberOfRecords").textContent == "0") {
		holdingsFormatted += ("\n" + noResultsubb1Text);
	// Ja =>
	} else {
		let holdings = xmlResponse.querySelectorAll("datafield[tag='AVA'], datafield[tag='AVE']");
		for (const holding of holdings) {
			let holdingLibraryCode,
				holdingLibrary,
				holdingLibraryLocation,
				holdingLibraryConditions,
				holdingVolumeInformation,
				holdingFormatted;

				//Bibliothekscode UZZZZ ist unter dem Unberfeld "l" untergebracht. Sonst unter "b"
				// wenige Metadaten für e-book haben kein Unterfeld "l" mit UZZZZ - trotzdem verfügbar
				if (holding.querySelector("subfield[code='b']")){
					holdingLibraryCode = holding.querySelector("subfield[code='b']").textContent;
				} else if (holding.querySelector("subfield[code='l']")){
					holdingLibraryCode = holding.querySelector("subfield[code='l']").textContent;
				} else if (holding.querySelector("subfield[code='e']").textContent == "Available" || holding.querySelector("subfield[code='e']").textContent == "available"){
					holdingLibraryCode = "UZZZZ";
				} else {
					continue;
				}

				//Besitzerbibliothek im Text
				if (holding.querySelector("subfield[code='q']")) {
					holdingLibrary = holding.querySelector("subfield[code='q']").textContent;
				} else if (holdingLibraryCode == "UZZZZ"){
					holdingLibrary = "UZH/ZB online"
				} else {
					holdingLibrary = holdingLibraryCode;
					}

				//Standort
				if (holding.querySelector("subfield[code='c']")){
					holdingLibraryLocation = holding.querySelector("subfield[code='c']").textContent;
				}

				//verfügbar?
				if (holding.querySelector("subfield[code='e']")){
					holdingLibraryConditions = holding.querySelector("subfield[code='e']").textContent;
				}
				//Signatur
				if (holding.querySelector("subfield[code='d']")) {
					holdingVolumeInformation = holding.querySelector("subfield[code='d']").textContent;
				}
				holdingFormatted = "\n" + holdingLibrary;
				if (holdingLibraryLocation) holdingFormatted = holdingFormatted + ", " + holdingLibraryLocation;
				if (holdingLibraryConditions) holdingFormatted = holdingFormatted + ", " + holdingLibraryConditions;
				if (holdingVolumeInformation) holdingFormatted = holdingFormatted + " (" + holdingVolumeInformation + ")";

			// Aktuelles Holding zur Holdingliste hinzufügen
			holdingsFormatted += holdingFormatted;

			// In UZH-ubb1?
			// Irgendwo in UZH-ubb1 oder UZH/ZB Online - holdingLibrary müsste immer "UZH, Asien-Orient-Institut" sein...
			if ((holdingbibliothekenubb1.includes(holdingLibraryCode)) || holdingLibraryCode == "UZZZZ") isInubb1 = true;
			// Kurierbibliothek
			if (kurierbibliothekenubb1.includes(holdingLibraryCode)) isinubb1Kurierbib = true;
			// Online spezifisch
			if (holdingLibraryCode == "UZZZZ") isInUZBOnline = true;
		}
	}

	// Tags setzen
	ApplyTags(item,isInubb1,isinubb1Kurierbib,isInUZBOnline,isWithoutISBN);

	// Holdings speichern
	// Im Feld Zusammenfassung
	let oldAbstractNote = item.getField('abstractNote');
	item.setField('abstractNote', holdingsFormatted + "\n============================\n\n" + oldAbstractNote);
	// Oder in Notiz?
	// var note = new Zotero.Item('note');
	// note.setNote(holdingsFormatted);
	// ??? VAR1 note.parentKey = item.key;
  // ??? ODER note.parentID = item.id;
	// note.saveTx();
}


//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
// MAIN
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////

async function ubb1HoldingLookup() {
	ubb1HoldingLookupInitialize();
	// Zuerst holen wir die aktuell ausgewählten Titel
	var ZoteroPane = Zotero.getActiveZoteroPane();
	var selectedItems = ZoteroPane.getSelectedItems();

	// Alle nicht-Buch-Titel werden herausgefiltert
	var items = selectedItems.filter(item => item.itemTypeID == Zotero.ItemTypes.getID('book'));
	// Loop durch die Items
	for (const item of items) {
		let isbns;
		if (item.getField('ISBN')) {
			isbns = item.getField('ISBN').split(" ");
		}
		if (!(item.getField('ISBN')) || !(isbns.some(isValidIsbn) == true)) {
			// Keine (oder keine gültige) ISBN vorhanden
			let isInubb1 = false;
			let isInUZBOnline = false;
			let isinubb1Kurierbib = false;
			let isWithoutISBN = true;
			ApplyTags(item,isInubb1,isinubb1Kurierbib,isInUZBOnline,isWithoutISBN);
			await item.saveTx();
		} else {
			// Mindestens eine gültige ISBN vorhanden
			// SRU-Request
			let URL = sruPrefix + isbns + sruSuffix;
			let sru = new XMLHttpRequest();
			//sru.onreadystatechange = async function() {
			sru.onreadystatechange = async function() {
					if (this.readyState == 4 && this.status == 200) {
					await processXML(item,this);
					await item.saveTx();
					//item.saveTx();
					//if () {
					//	printResults();
					//}

			};
			};
			sru.open("GET", URL, true);
			sru.send();


		}
	};
};
