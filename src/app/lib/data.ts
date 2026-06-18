// Mock data for hazardous waste management

export type WasteType = 'battery' | 'electronics' | 'chemicals' | 'paint' | 'medical' | 'oil';

export interface DropOffLocation {
  id: string;
  lat: number;
  lng: number;
  name: string;
  address: string;
  acceptedTypes: WasteType[];
  hours: string;
  capacity: number; // percentage
}

export interface PickupRequest {
  id: string;
  lat: number;
  lng: number;
  address: string;
  wasteType: WasteType;
  quantity: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'assigned' | 'completed';
  requestedDate: string;
  notes?: string;
}

export const wasteTypeInfo: Record<WasteType, { name: string; color: string; icon: string }> = {
  battery: { name: 'Batteries', color: '#10b981', icon: '🔋' },
  electronics: { name: 'Electronics', color: '#3b82f6', icon: '💻' },
  chemicals: { name: 'Chemicals', color: '#ef4444', icon: '⚗️' },
  paint: { name: 'Paint & Solvents', color: '#f59e0b', icon: '🎨' },
  medical: { name: 'Medical Waste', color: '#ec4899', icon: '💉' },
  oil: { name: 'Oil & Fluids', color: '#8b5cf6', icon: '🛢️' },
};

// Mock drop-off locations (centered around San Francisco)
export const dropOffLocations: DropOffLocation[] = [
  {
    id: 'loc1',
    lat: 37.7749,
    lng: -122.4194,
    name: 'Downtown Hazardous Waste Center',
    address: '123 Market St, San Francisco, CA',
    acceptedTypes: ['battery', 'electronics', 'chemicals', 'paint', 'oil'],
    hours: 'Mon-Sat: 8am-6pm',
    capacity: 45,
  },
  {
    id: 'loc2',
    lat: 37.7849,
    lng: -122.4094,
    name: 'North Bay Collection Point',
    address: '456 Bay St, San Francisco, CA',
    acceptedTypes: ['battery', 'electronics', 'paint'],
    hours: 'Mon-Fri: 9am-5pm',
    capacity: 78,
  },
  {
    id: 'loc3',
    lat: 37.7649,
    lng: -122.4294,
    name: 'Mission District Depot',
    address: '789 Mission St, San Francisco, CA',
    acceptedTypes: ['battery', 'chemicals', 'medical', 'oil'],
    hours: 'Daily: 7am-8pm',
    capacity: 92,
  },
  {
    id: 'loc4',
    lat: 37.7949,
    lng: -122.3994,
    name: 'East Side Recycling Hub',
    address: '321 Valencia St, San Francisco, CA',
    acceptedTypes: ['electronics', 'paint', 'oil'],
    hours: 'Tue-Sun: 10am-6pm',
    capacity: 23,
  },
  {
    id: 'loc5',
    lat: 37.7549,
    lng: -122.4394,
    name: 'Sunset District Station',
    address: '654 Sunset Blvd, San Francisco, CA',
    acceptedTypes: ['battery', 'electronics', 'chemicals', 'medical'],
    hours: 'Mon-Sat: 8am-5pm',
    capacity: 61,
  },
];

// Mock pickup requests
export const pickupRequests: PickupRequest[] = [
  {
    id: 'req1',
    lat: 37.7699,
    lng: -122.4144,
    address: '100 Pine St, San Francisco, CA',
    wasteType: 'battery',
    quantity: '2 car batteries',
    urgency: 'medium',
    status: 'pending',
    requestedDate: '2026-06-20',
    notes: 'Please call before arriving',
  },
  {
    id: 'req2',
    lat: 37.7799,
    lng: -122.4244,
    address: '200 Oak St, San Francisco, CA',
    wasteType: 'electronics',
    quantity: '1 old TV, 2 monitors',
    urgency: 'low',
    status: 'pending',
    requestedDate: '2026-06-21',
  },
  {
    id: 'req3',
    lat: 37.7599,
    lng: -122.4344,
    address: '300 Elm St, San Francisco, CA',
    wasteType: 'chemicals',
    quantity: '5 gallons cleaning products',
    urgency: 'high',
    status: 'assigned',
    requestedDate: '2026-06-19',
    notes: 'Hazardous - handle with care',
  },
  {
    id: 'req4',
    lat: 37.7899,
    lng: -122.4044,
    address: '400 Maple Ave, San Francisco, CA',
    wasteType: 'paint',
    quantity: '10 paint cans',
    urgency: 'medium',
    status: 'pending',
    requestedDate: '2026-06-22',
  },
  {
    id: 'req5',
    lat: 37.7499,
    lng: -122.4444,
    address: '500 Cedar St, San Francisco, CA',
    wasteType: 'oil',
    quantity: '3 gallons motor oil',
    urgency: 'low',
    status: 'completed',
    requestedDate: '2026-06-15',
  },
  {
    id: 'req6',
    lat: 37.7749,
    lng: -122.4494,
    address: '600 Birch Ln, San Francisco, CA',
    wasteType: 'medical',
    quantity: 'Box of syringes',
    urgency: 'high',
    status: 'pending',
    requestedDate: '2026-06-19',
    notes: 'Medical waste - urgent',
  },
];

// Statistics data
export interface WasteStats {
  type: WasteType;
  count: number;
  weight: number; // in kg
  trend: number; // percentage change
}

export const wasteStatistics: WasteStats[] = [
  { type: 'battery', count: 342, weight: 1240, trend: 12 },
  { type: 'electronics', count: 156, weight: 4320, trend: -5 },
  { type: 'chemicals', count: 89, weight: 890, trend: 23 },
  { type: 'paint', count: 234, weight: 2100, trend: 8 },
  { type: 'medical', count: 67, weight: 180, trend: -12 },
  { type: 'oil', count: 198, weight: 1560, trend: 15 },
];

// Heatmap data for waste concentrations
export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
}

export const heatmapData: HeatmapPoint[] = [
  { lat: 37.7749, lng: -122.4194, intensity: 0.8 },
  { lat: 37.7849, lng: -122.4094, intensity: 0.6 },
  { lat: 37.7649, lng: -122.4294, intensity: 0.9 },
  { lat: 37.7949, lng: -122.3994, intensity: 0.4 },
  { lat: 37.7549, lng: -122.4394, intensity: 0.7 },
  { lat: 37.7699, lng: -122.4144, intensity: 0.5 },
  { lat: 37.7799, lng: -122.4244, intensity: 0.3 },
  { lat: 37.7599, lng: -122.4344, intensity: 0.85 },
];
