export type Vehicle = {
  id: string;
  type: 'LKW' | 'Transporter' | 'Sprinter';
  location: string;
  status: 'Available' | 'On-trip' | 'Maintenance';
  capacity: string;
};

export type Customer = {
  id: string;
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
    street: string;
    zipCode: string;
    city: string;
    country: string;
}

export interface Country {
    id: string;
    name: string;
    code: string;
}
