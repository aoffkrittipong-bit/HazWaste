import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Plus, AlertTriangle, BarChart3, ArrowLeft, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { dropOffLocations, wasteTypeInfo, type WasteType } from '../lib/data';
import { toast } from 'sonner';
import { WasteScanner } from './WasteScanner';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [wasteType, setWasteType] = useState<WasteType>('battery');
  const [requestType, setRequestType] = useState<'pickup' | 'dropoff'>('pickup');

  const handleSubmitRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDialogOpen(false);
    toast.success('Request submitted successfully!', {
      description: requestType === 'pickup' 
        ? 'A collector will be assigned to your location soon.'
        : 'Your drop-off has been recorded.',
    });
  };

  const nearbyLocations = dropOffLocations.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <div className="bg-emerald-600 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="text-white hover:bg-emerald-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl mb-2">Resident Dashboard</h1>
          <p className="text-emerald-100">Manage your hazardous waste disposal</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-emerald-500">
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                    <Plus className="w-6 h-6 text-emerald-600" />
                  </div>
                  <CardTitle>Request Pickup</CardTitle>
                  <CardDescription>Schedule a collection from your location</CardDescription>
                </CardHeader>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>New Waste Disposal Request</DialogTitle>
                <DialogDescription>
                  Request a pickup or record a drop-off
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <Label>Request Type</Label>
                  <RadioGroup value={requestType} onValueChange={(v) => setRequestType(v as any)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup">Request Pickup</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dropoff" id="dropoff" />
                      <Label htmlFor="dropoff">Record Drop-off</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Waste Type</Label>
                  <Select value={wasteType} onValueChange={(v) => setWasteType(v as WasteType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(wasteTypeInfo).map(([key, info]) => (
                        <SelectItem key={key} value={key}>
                          {info.icon} {info.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {requestType === 'pickup' && (
                  <>
                    <div>
                      <Label>Address</Label>
                      <Input placeholder="Enter your address" required />
                    </div>
                    
                    <div>
                      <Label>Quantity/Description</Label>
                      <Input placeholder="e.g., 2 car batteries" required />
                    </div>

                    <div>
                      <Label>Urgency</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low - Within a week</SelectItem>
                          <SelectItem value="medium">Medium - Within 3 days</SelectItem>
                          <SelectItem value="high">High - Urgent (24hrs)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Additional Notes (Optional)</Label>
                      <Textarea placeholder="Special instructions..." />
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Submit Request
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-blue-500"
            onClick={() => navigate('/map')}
          >
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Find Drop-off Points</CardTitle>
              <CardDescription>Locate nearby disposal bins</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-purple-500"
            onClick={() => navigate('/stats')}
          >
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>View Statistics</CardTitle>
              <CardDescription>See waste disposal data</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Scan Waste Banner */}
        <Card
          className="cursor-pointer hover:shadow-lg transition-all border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50"
          onClick={() => setScannerOpen(true)}
        >
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <Camera className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-800">Scan Your Waste</h3>
              <p className="text-sm text-emerald-600">Use your camera to identify what type of hazardous waste you have and get instant disposal instructions.</p>
            </div>
          </CardContent>
        </Card>

        <WasteScanner
          open={scannerOpen}
          onClose={() => setScannerOpen(false)}
          onResult={(type) => {
            setWasteType(type);
            setDialogOpen(true);
          }}
        />

        {/* Nearby Drop-off Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Nearby Drop-off Locations
            </CardTitle>
            <CardDescription>Closest hazardous waste disposal centers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {nearbyLocations.map((location) => (
              <div key={location.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{location.name}</h3>
                    <p className="text-sm text-slate-600">{location.address}</p>
                    <p className="text-sm text-slate-500 mt-1">🕒 {location.hours}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs ${
                    location.capacity < 30 ? 'bg-red-100 text-red-700' :
                    location.capacity < 70 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {location.capacity}% Full
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap mt-3">
                  {location.acceptedTypes.map((type) => (
                    <span 
                      key={type}
                      className="px-2 py-1 bg-slate-100 rounded text-xs"
                      style={{ borderLeft: `3px solid ${wasteTypeInfo[type].color}` }}
                    >
                      {wasteTypeInfo[type].icon} {wasteTypeInfo[type].name}
                    </span>
                  ))}
                </div>
                <Button 
                  className="w-full mt-3" 
                  variant="outline"
                  onClick={() => navigate('/map')}
                >
                  View on Map
                </Button>
              </div>
            ))}
            <Button 
              variant="link" 
              className="w-full"
              onClick={() => navigate('/map')}
            >
              View All Locations on Map →
            </Button>
          </CardContent>
        </Card>

        {/* Disposal Guidelines */}
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Safe Disposal Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>🔋 <strong>Batteries:</strong> Keep terminals taped to prevent sparking</li>
              <li>💻 <strong>Electronics:</strong> Remove all personal data before disposal</li>
              <li>⚗️ <strong>Chemicals:</strong> Keep in original containers with labels</li>
              <li>🎨 <strong>Paint:</strong> Solidify latex paint before disposal</li>
              <li>💉 <strong>Medical:</strong> Use sharps containers for needles</li>
              <li>🛢️ <strong>Oil:</strong> Store in sealed, leak-proof containers</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
