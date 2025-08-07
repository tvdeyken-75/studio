

export type Vehicle = {
  id: string;
  type: 'LKW' | 'Transporter' | 'Sprinter';
  location: string;
  status: 'Available' | 'On-trip' | 'Maintenance';
  capacity: string;
};

export type Trailer = {
  id: string;
  type: 'Kofferauflieger' | 'Schiebeplanenauflieger' | 'Kippauflieger';
  location: string;
  status: 'Available' | 'On-trip' | 'Maintenance';
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
  customer: string;
  pickupLocation: string;
  deliveryLocation: string;
  driver: string;
  vehicleId: string;
  status: 'Abgeschlossen' | 'Unterwegs' | 'Geplant';
  plannedPickupDate: string;
  plannedDeliveryDate: string;
  actualPickupDate: string;
  actualDeliveryDate: string;
};
