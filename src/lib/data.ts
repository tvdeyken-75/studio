import type { Vehicle, Kpi, ChartData } from '@/types';

export const fleetData: Vehicle[] = [
  { id: 'CP-001', type: 'Truck', location: 'Berlin, DE', status: 'Available', capacity: '24t' },
  { id: 'CP-002', type: 'Truck', location: 'Hamburg, DE', status: 'On-trip', capacity: '24t' },
  { id: 'CP-003', type: 'Van', location: 'Munich, DE', status: 'Available', capacity: '3.5t' },
  { id: 'CP-004', type: 'Sprinter', location: 'Frankfurt, DE', status: 'Maintenance', capacity: '1.5t' },
  { id: 'CP-005', type: 'Truck', location: 'Cologne, DE', status: 'Available', capacity: '24t' },
  { id: 'CP-006', type: 'Van', location: 'Stuttgart, DE', status: 'Available', capacity: '3.5t' },
];

export const kpiData: Kpi[] = [
    { title: "On-Time Deliveries", value: "98.2%", change: "+1.5%", changeType: "positive", description: "vs. last month" },
    { title: "Reported Issues", value: "4", change: "-2", changeType: "positive", description: "vs. last month" },
    { title: "Fleet Utilization", value: "85%", change: "+5%", changeType: "positive", description: "vs. last month" },
    { title: "Customer Satisfaction", value: "4.8/5", change: "+0.1", changeType: "positive", description: "vs. last month" },
];

export const weeklyDeliveriesData: ChartData[] = [
  { month: "Jan", onTime: 186, delayed: 10 },
  { month: "Feb", onTime: 305, delayed: 15 },
  { month: "Mar", onTime: 237, delayed: 8 },
  { month: "Apr", onTime: 273, delayed: 12 },
  { month: "May", onTime: 209, delayed: 5 },
  { month: "Jun", onTime: 250, delayed: 7 },
];
