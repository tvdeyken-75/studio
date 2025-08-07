import type { Vehicle, Kpi, ChartData } from '@/types';

export const fleetData: Vehicle[] = [
  { id: 'AT-001', type: 'LKW', location: 'Berlin, DE', status: 'Available', capacity: '24t' },
  { id: 'AT-002', type: 'LKW', location: 'Hamburg, DE', status: 'On-trip', capacity: '24t' },
  { id: 'AT-003', type: 'Transporter', location: 'München, DE', status: 'Available', capacity: '3.5t' },
  { id: 'AT-004', type: 'Sprinter', location: 'Frankfurt, DE', status: 'Maintenance', capacity: '1.5t' },
  { id: 'AT-005', type: 'LKW', location: 'Köln, DE', status: 'Available', capacity: '24t' },
  { id: 'AT-006', type: 'Transporter', location: 'Stuttgart, DE', status: 'Available', capacity: '3.5t' },
];

export const kpiData: Kpi[] = [
    { title: "Pünktliche Lieferungen", value: "98,2%", change: "+1,5%", changeType: "positive", description: "ggü. Vormonat" },
    { title: "Gemeldete Probleme", value: "4", change: "-2", changeType: "positive", description: "ggü. Vormonat" },
    { title: "Flottenauslastung", value: "85%", change: "+5%", changeType: "positive", description: "ggü. Vormonat" },
    { title: "Kundenzufriedenheit", value: "4,8/5", change: "+0,1", changeType: "positive", description: "ggü. Vormonat" },
];

export const weeklyDeliveriesData: ChartData[] = [
  { month: "Jan", onTime: 186, delayed: 10 },
  { month: "Feb", onTime: 305, delayed: 15 },
  { month: "Mrz", onTime: 237, delayed: 8 },
  { month: "Apr", onTime: 273, delayed: 12 },
  { month: "Mai", onTime: 209, delayed: 5 },
  { month: "Jun", onTime: 250, delayed: 7 },
];
