


export type User = {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'User';
  password?: string;
};


export type Vehicle = {
  // General
  id: string;
  kennzeichen: string;
  hersteller: string;
  modell: string;
  fahrgestellnummer: string;
  baujahr: number;
  typ: 'Solo' | 'Sattelzugmaschine' | 'Hängerzug';
  fahrzeugart: 'LKW' | 'Zugmaschine';
  fuhrparkNummer: string;
  
  // Technical
  motorleistungKw: number;
  kraftstoffart: 'Diesel' | 'Elektro' | 'H2';
  getriebeart: 'Automatik' | 'Manuell';
  achszahl: number;
  nutzlastKg: number;
  gesamtgewichtKg: number;
  tankvolumenLiter?: number;
  adblueVolumenLiter?: number;

  // Documents & Deadlines
  tuevBis: string; // Date
  spBis: string; // Date
  versicherungsnummer: string;
  zulassungsdatum: string; // Date
  stillgelegtAm?: string; // Date
  
  // Positioning
  gpsTrackerId?: string;
  simNummer?: string;

  // Status
  status: 'Aktiv' | 'Reparatur' | 'Verkauft' | 'Ausgemustert';
  tourStatus: 'Verfügbar' | 'Unterwegs' | 'Pause';
  fahrerId?: string; // Link to a driver
  
  // Legacy fields for backwards compatibility with previous mock data
  location: string;
  capacity: string;
};

export type Trailer = {
  // General
  id:string;
  kennzeichen: string;
  hersteller: string;
  modell: string;
  fahrgestellnummer: string;
  baujahr: number;
  anhaengerTyp: 'Plane' | 'Kühl' | 'Kipper' | 'Container' | 'Kofferauflieger' | 'Schiebeplanenauflieger';
  fuhrparkNummer: string;

  // Technical
  achsenanzahl: number;
  nutzlastKg: number;
  gesamtgewichtKg: number;
  ladevolumenCbm?: number;
  bremsenTyp: 'Scheibe' | 'Trommel';

  // Documents & Deadlines
  tuevBis: string; // Date
  spBis: string; // Date
  versicherungsnummer: string;
  zulassungsdatum: string; // Date
  stillgelegtAm?: string; // Date
  
  // Coupling
  aktuellGekuppeltMitLkwId?: string;

  // Positioning
  gpsTrackerId?: string;
  simNummer?: string;

  // Status
  status: 'Aktiv' | 'In Werkstatt' | 'Verkauft' | 'Ausgemustert';
  tourStatus: 'Verfügbar' | 'Unterwegs' | 'Pause';

  // Legacy fields for backwards compatibility with previous mock data
  location: string;
  capacity: string;
};


export type Kontakt = {
    id: string;
    kundenId: string;
    anrede: string;
    vorname: string;
    nachname: string;
    position: string;
    telefon: string;
    mobil: string;
    email: string;
    bemerkung: string;
};

export type Customer = {
    id: string;
    // Stammdaten
    firmenname: string;
    kundennummer: string;
    ustId: string;
    steuernummer: string;
    firmenbuchnummer: string;

    // Adresse
    strasse: string;
    hausnummer: string;
    plz: string;
    ort: string;
    land: string;

    // Kontakt
    telefon: string;
    fax: string;
    email: string;
    website: string;

    // Finanzielle Info
    zahlungsbedingungen: string;
    zahlungsziel: number;
    waehrung: string;
    kreditlimit: number;
    skontoProzent: number;
    skontoTage: number;
    mautzuschlag: number; // Mautzuschlag in %

    // Bankverbindung
    bankname: string;
    iban: string;
    bic: string;
    kontoinhaber: string;

    // Overige
    aktiv: boolean;
    bemerkung: string;
erstelltAm: string;
    bearbeitetAm: string;
    
    // Legacy fields for contractors, can be removed if not needed.
    name: string;
    contact: string;
    address: string;
};

export type Contractor = Customer;

export type Kpi = {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  description: string;
};

export type ChartData = {
  month: string;
  onTime: number;
  delayed: number;
};

export interface Address {
    id: string;
    kurzname: string;
    name: string;
    strasse: string;
    plz: string;
    stadt: string;
    land: string;
    koordinaten: string;
    tourPOI: boolean;
    kundenAdresse: boolean;
    mitarbeiterAdresse: boolean;
}

export interface Country {
    id: string;
    iso_code: string;
    kurzname: string;
    official_country_name: string;
}

export type Transport = {
  id: string;
  transportNumber: string;
  auftragsId?: string; // order number from customer
  customer: string;
  frachtbeschreibung?: string;
  pickupLocation: string;
  deliveryLocation: string;
  driver?: string;
  vehicleId?: string;
  status: 'Geplant' | 'In Vorbereitung' | 'Bereit zur Abholung' | 'Unterwegs' | 'Abgeschlossen' | 'Storniert';
  plannedPickupDate: string;
  plannedDeliveryDate: string;
  actualPickupDate: string;
  actualDeliveryDate: string;
};


export type Document = {
  id: string;
  name: string;
  type: 'TÜV' | 'SP' | 'Reparatur' | 'Schaden' | 'Sonstiges' | 'Rechnung' | 'Lieferschein' | 'Wartung' | 'Vertrag' | 'Foto';
  date: string;
  fileUrl: string;
  notes?: string;
  zuordnung: {
    kategorie: 'Kunde' | 'Fahrzeug' | 'Anhänger' | 'Transportauftrag' | 'Route' | 'Buchhaltung' | 'Tour';
    id: string; // The ID of the associated entity
    name: string; // A display name for the association
  }
};

export type Report = {
    id: string;
    assetId: string; // vehicle or trailer id
    type: 'Wartung' | 'Schaden' | 'TÜV' | 'Sonstiges';
    date: string;
    description: string;
    documents?: Document[];
};

export type Dieselpreis = {
    id: string;
    woche: string;
    von: string;
    bis: string;
    preis: number;
    zuschlag: number;
};

export type InvoiceItem = {
    id: string;
    beschreibung: string;
    menge: number;
    einheit: string;
    einzelpreis: number;
    gesamtpreis: number;
    datum?: string;
}

export type Invoice = {
    id: string;
    rechnungsnummer: string;
    kundenId: string;
    kundenName: string;
    rechnungsdatum: string;
    faelligkeitsdatum: string;
    status: 'Entwurf' | 'Offen' | 'Bezahlt' | 'Überfällig' | 'Storniert';
    betrag: number;
    waehrung: 'EUR';
    items: InvoiceItem[];
}

export type Transaction = {
    id: string;
    datum: string; // ISO Date String
    art: 'Einnahme' | 'Ausgabe';
    kategorie: string;
    beschreibung: string;
    betrag: number; // always positive, sign is determined by 'art'
    waehrung: 'EUR';
    belegnummer?: string;
    kostenstelleId?: string; // Optional: Link to a cost center
    rechnungsId?: string; // Optional: Link to an invoice
    status: 'Offen' | 'Verbucht';
}

export type Kostenstelle = {
  id: string;
  nummer: string;
  name: string;
  beschreibung: string;
  typ: 'Fahrzeug' | 'Abteilung' | 'Projekt' | 'Sonstiges';
  verantwortlicher?: string;
};

// New Tour Structure
export type TourStop = {
    id: string;
    stopSequence: number;
    type: 'Pickup' | 'Delivery';
    customerId: string;
    customerName: string;
    location: string; // Free text for now
    plannedDateTime: string;
    actualDateTime?: string;
    goodsDescription: string;
    status: 'Planned' | 'Confirmed' | 'Completed' | 'Exception';
};

export type Tour = {
    id: string;
    tourNumber: string;
    tourDate: string;
    vehicleId?: string;
    trailerId?: string;
    driverId?: string;
    stops: TourStop[];
    status: 'Draft' | 'Planned' | 'Assigned' | 'Ongoing' | 'Finished' | 'Closed';
    // Financials - placeholders for now
    totalCosts?: number;
    totalRevenue?: number;
    profitability?: number;
};
