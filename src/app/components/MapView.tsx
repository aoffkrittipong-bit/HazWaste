import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Navigation, AlertTriangle, Layers, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { dropOffLocations, pickupRequests, wasteTypeInfo, heatmapData } from '../lib/data';

// Fix leaflet default icon issue with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const greenIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:32px;height:32px;background:#10b981;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
    <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -20],
});

const makeUrgencyIcon = (urgency: string) => {
  const colors: Record<string, string> = { high: '#ef4444', medium: '#f97316', low: '#eab308' };
  const color = colors[urgency] || colors.medium;
  return new L.DivIcon({
    className: '',
    html: `<div style="width:32px;height:32px;background:${color};border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
      <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45l8.27 14.1H3.73L12 5.45zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });
};

function UserLocationButton() {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  const handleLocate = () => {
    setLocating(true);
    map.locate({ setView: true, maxZoom: 15 });
    map.once('locationfound', () => setLocating(false));
    map.once('locationerror', () => setLocating(false));
  };

  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: '80px' }}>
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={handleLocate}
          title="My Location"
          style={{
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: 18,
          }}
        >
          {locating ? '⏳' : '📍'}
        </button>
      </div>
    </div>
  );
}

export default function MapView() {
  const navigate = useNavigate();
  const [showDropoffs, setShowDropoffs] = useState(true);
  const [showPickups, setShowPickups] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const pendingPickups = pickupRequests.filter(r => r.status === 'pending');

  const selectedDropOff = dropOffLocations.find(l => l.id === selectedLocation);
  const selectedPickup = pickupRequests.find(r => r.id === selectedLocation);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl">Hazardous Waste Map</h1>
            <p className="text-blue-100 text-sm">Interactive map — San Francisco Bay Area</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Map column */}
          <div className="lg:col-span-2 space-y-3">
            {/* Layer controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch id="dropoffs" checked={showDropoffs} onCheckedChange={setShowDropoffs} />
                    <Label htmlFor="dropoffs" className="flex items-center gap-2 cursor-pointer">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      Drop-off Locations ({dropOffLocations.length})
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="pickups" checked={showPickups} onCheckedChange={setShowPickups} />
                    <Label htmlFor="pickups" className="flex items-center gap-2 cursor-pointer">
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                      Pickup Requests ({pendingPickups.length})
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="heatmap" checked={showHeatmap} onCheckedChange={setShowHeatmap} />
                    <Label htmlFor="heatmap" className="flex items-center gap-2 cursor-pointer">
                      <div className="w-3 h-3 rounded-full bg-red-500 opacity-60" />
                      Waste Density Heatmap
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaflet Map */}
            <Card className="overflow-hidden">
              <div style={{ height: 520 }}>
                <MapContainer
                  center={[37.7749, -122.4194]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <UserLocationButton />

                  {/* Heatmap circles */}
                  {showHeatmap && heatmapData.map((point, i) => (
                    <Circle
                      key={`heat-${i}`}
                      center={[point.lat, point.lng]}
                      radius={point.intensity * 400}
                      pathOptions={{
                        color: 'transparent',
                        fillColor: '#ef4444',
                        fillOpacity: point.intensity * 0.35,
                      }}
                    />
                  ))}

                  {/* Drop-off location markers */}
                  {showDropoffs && dropOffLocations.map((loc) => (
                    <Marker
                      key={loc.id}
                      position={[loc.lat, loc.lng]}
                      icon={greenIcon}
                      eventHandlers={{ click: () => setSelectedLocation(loc.id) }}
                    >
                      <Popup>
                        <div className="min-w-[180px]">
                          <p className="font-semibold text-sm mb-1">{loc.name}</p>
                          <p className="text-xs text-gray-500 mb-1">{loc.address}</p>
                          <p className="text-xs text-gray-500 mb-2">🕒 {loc.hours}</p>
                          <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            loc.capacity > 70 ? 'bg-red-100 text-red-700' :
                            loc.capacity > 40 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {loc.capacity}% Full
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Pickup request markers */}
                  {showPickups && pendingPickups.map((req) => (
                    <Marker
                      key={req.id}
                      position={[req.lat, req.lng]}
                      icon={makeUrgencyIcon(req.urgency)}
                      eventHandlers={{ click: () => setSelectedLocation(req.id) }}
                    >
                      <Popup>
                        <div className="min-w-[180px]">
                          <p className="font-semibold text-sm mb-1">
                            {wasteTypeInfo[req.wasteType].icon} {wasteTypeInfo[req.wasteType].name}
                          </p>
                          <p className="text-xs text-gray-500 mb-1">{req.address}</p>
                          <p className="text-xs text-gray-500 mb-2">{req.quantity}</p>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            req.urgency === 'high' ? 'bg-red-100 text-red-700' :
                            req.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {req.urgency.toUpperCase()} urgency
                          </span>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </Card>

            {/* Selected location detail panel */}
            {(selectedDropOff || selectedPickup) && (
              <Card className="border-2 border-blue-300">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">
                      {selectedDropOff ? '📍 ' + selectedDropOff.name : wasteTypeInfo[selectedPickup!.wasteType].icon + ' ' + wasteTypeInfo[selectedPickup!.wasteType].name}
                    </CardTitle>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedLocation(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {selectedDropOff && (
                    <div className="space-y-2 text-sm">
                      <p className="text-slate-600">{selectedDropOff.address}</p>
                      <p className="text-slate-500">🕒 {selectedDropOff.hours}</p>
                      <div className="flex gap-2 flex-wrap">
                        {selectedDropOff.acceptedTypes.map(t => (
                          <span key={t} className="px-2 py-0.5 bg-slate-100 rounded text-xs" style={{ borderLeft: `3px solid ${wasteTypeInfo[t].color}` }}>
                            {wasteTypeInfo[t].icon} {wasteTypeInfo[t].name}
                          </span>
                        ))}
                      </div>
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        selectedDropOff.capacity > 70 ? 'bg-red-100 text-red-700' :
                        selectedDropOff.capacity > 40 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {selectedDropOff.capacity}% capacity
                      </div>
                    </div>
                  )}
                  {selectedPickup && (
                    <div className="space-y-2 text-sm">
                      <p className="text-slate-600">{selectedPickup.address}</p>
                      <p className="text-slate-500"><strong>Quantity:</strong> {selectedPickup.quantity}</p>
                      {selectedPickup.notes && (
                        <p className="bg-amber-50 border border-amber-200 rounded p-2 text-xs">{selectedPickup.notes}</p>
                      )}
                      <Badge className={`text-xs ${
                        selectedPickup.urgency === 'high' ? 'bg-red-100 text-red-700' :
                        selectedPickup.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {selectedPickup.urgency.toUpperCase()} urgency
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Layers className="w-4 h-4" />
                  Legend
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Drop-off Location</p>
                    <p className="text-xs text-slate-500">Permanent disposal bins</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">High Urgency Pickup</p>
                    <p className="text-xs text-slate-500">Urgent collection needed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Medium Urgency Pickup</p>
                    <p className="text-xs text-slate-500">3-day collection window</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Low Urgency Pickup</p>
                    <p className="text-xs text-slate-500">Within a week</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-400 opacity-50 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Waste Density</p>
                    <p className="text-xs text-slate-500">Concentration hotspots</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location list */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Locations Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="dropoffs">
                  <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
                    <TabsTrigger value="dropoffs">Drop-offs</TabsTrigger>
                    <TabsTrigger value="pickups">Pickups</TabsTrigger>
                  </TabsList>

                  <TabsContent value="dropoffs" className="space-y-2 p-4 max-h-96 overflow-y-auto">
                    {dropOffLocations.map((location) => (
                      <div
                        key={location.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                          selectedLocation === location.id ? 'border-emerald-500 bg-emerald-50' : 'hover:bg-slate-50'
                        }`}
                        onClick={() => setSelectedLocation(location.id)}
                      >
                        <h4 className="font-semibold text-sm mb-1">{location.name}</h4>
                        <p className="text-xs text-slate-600 mb-2">{location.address}</p>
                        <Badge className={`text-xs ${
                          location.capacity > 70 ? 'bg-red-100 text-red-700' :
                          location.capacity > 40 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {location.capacity}% Full
                        </Badge>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="pickups" className="space-y-2 p-4 max-h-96 overflow-y-auto">
                    {pendingPickups.map((request) => {
                      const wasteInfo = wasteTypeInfo[request.wasteType];
                      return (
                        <div
                          key={request.id}
                          className={`border rounded-lg p-3 cursor-pointer transition-all ${
                            selectedLocation === request.id ? 'border-orange-500 bg-orange-50' : 'hover:bg-slate-50'
                          }`}
                          onClick={() => setSelectedLocation(request.id)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span>{wasteInfo.icon}</span>
                            <h4 className="font-semibold text-sm">{wasteInfo.name}</h4>
                          </div>
                          <p className="text-xs text-slate-600 mb-2">{request.address}</p>
                          <Badge className={`text-xs ${
                            request.urgency === 'high' ? 'bg-red-100 text-red-700' :
                            request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {request.urgency.toUpperCase()}
                          </Badge>
                        </div>
                      );
                    })}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
