import { useNavigate } from 'react-router';
import { Trash2, Truck } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl mb-4 text-emerald-900">
            ⚠️ HazWaste Manager
          </h1>
          <p className="text-xl text-emerald-700">
            Safe Disposal of Hazardous Waste
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* User Card */}
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-emerald-500">
            <CardHeader>
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Trash2 className="w-8 h-8 text-emerald-600" />
              </div>
              <CardTitle className="text-center text-2xl">I'm a Resident</CardTitle>
              <CardDescription className="text-center text-base">
                Drop hazardous waste or request pickup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm text-slate-600">
                <li>✓ Find nearby disposal bins</li>
                <li>✓ Request pickup from your location</li>
                <li>✓ Track waste disposal history</li>
                <li>✓ Get disposal guidelines</li>
              </ul>
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => navigate('/user')}
              >
                Continue as Resident
              </Button>
            </CardContent>
          </Card>

          {/* Truck Card */}
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-amber-500">
            <CardHeader>
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Truck className="w-8 h-8 text-amber-600" />
              </div>
              <CardTitle className="text-center text-2xl">I'm a Collector</CardTitle>
              <CardDescription className="text-center text-base">
                Manage pickup routes and collections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6 text-sm text-slate-600">
                <li>✓ View all pickup requests</li>
                <li>✓ Optimize collection routes</li>
                <li>✓ Mark collections complete</li>
                <li>✓ Track collection statistics</li>
              </ul>
              <Button 
                className="w-full bg-amber-600 hover:bg-amber-700"
                onClick={() => navigate('/truck')}
              >
                Continue as Collector
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/stats')}
            className="mr-4"
          >
            View Statistics
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/map')}
          >
            View Map
          </Button>
        </div>
      </div>
    </div>
  );
}
