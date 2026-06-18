import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, CheckCircle2, Clock, AlertCircle, BarChart3, ArrowLeft, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { pickupRequests, wasteTypeInfo } from '../lib/data';
import { toast } from 'sonner';

export default function TruckDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(pickupRequests);

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const assignedRequests = requests.filter(r => r.status === 'assigned');
  const completedRequests = requests.filter(r => r.status === 'completed');

  const handleAssign = (id: string) => {
    setRequests(requests.map(r => 
      r.id === id ? { ...r, status: 'assigned' as const } : r
    ));
    toast.success('Pickup assigned to your route');
  };

  const handleComplete = (id: string) => {
    setRequests(requests.map(r => 
      r.id === id ? { ...r, status: 'completed' as const } : r
    ));
    toast.success('Pickup marked as completed');
  };

  const getUrgencyBadge = (urgency: string) => {
    const variants = {
      high: 'bg-red-100 text-red-700 border-red-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-green-100 text-green-700 border-green-300',
    };
    return variants[urgency as keyof typeof variants] || variants.low;
  };

  const RequestCard = ({ request, showActions }: { request: typeof requests[0]; showActions?: boolean }) => {
    const wasteInfo = wasteTypeInfo[request.wasteType];
    
    return (
      <div className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{wasteInfo.icon}</span>
              <h3 className="font-semibold">{wasteInfo.name}</h3>
              <Badge className={`${getUrgencyBadge(request.urgency)} border`}>
                {request.urgency.toUpperCase()}
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mb-1">
              <MapPin className="w-3 h-3 inline mr-1" />
              {request.address}
            </p>
            <p className="text-sm text-slate-500">
              <Clock className="w-3 h-3 inline mr-1" />
              Requested: {new Date(request.requestedDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="bg-slate-100 rounded p-2 mb-3 text-sm">
          <strong>Quantity:</strong> {request.quantity}
        </div>
        
        {request.notes && (
          <div className="bg-amber-50 border border-amber-200 rounded p-2 mb-3 text-sm">
            <AlertCircle className="w-3 h-3 inline mr-1 text-amber-600" />
            {request.notes}
          </div>
        )}
        
        {showActions && (
          <div className="flex gap-2">
            {request.status === 'pending' && (
              <>
                <Button 
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                  onClick={() => handleAssign(request.id)}
                >
                  Assign to Route
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => navigate('/map')}
                >
                  <Navigation className="w-4 h-4" />
                </Button>
              </>
            )}
            {request.status === 'assigned' && (
              <>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleComplete(request.id)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => navigate('/map')}
                >
                  <Navigation className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-amber-600 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="text-white hover:bg-amber-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl mb-2">Collector Dashboard</h1>
          <p className="text-amber-100">Manage pickup routes and collections</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Pickups</CardDescription>
              <CardTitle className="text-3xl text-orange-600">{pendingRequests.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Assigned to You</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{assignedRequests.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed Today</CardDescription>
              <CardTitle className="text-3xl text-green-600">{completedRequests.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all"
            onClick={() => navigate('/stats')}
          >
            <CardHeader className="pb-3">
              <CardDescription>View Statistics</CardDescription>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Analytics</CardTitle>
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Map Button */}
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg"
          onClick={() => navigate('/map')}
        >
          <MapPin className="w-5 h-5 mr-2" />
          View All Requests on Map
        </Button>

        {/* Pickup Requests Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Pickup Requests</CardTitle>
            <CardDescription>Manage your collection schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">
                  Pending ({pendingRequests.length})
                </TabsTrigger>
                <TabsTrigger value="assigned">
                  Assigned ({assignedRequests.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedRequests.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending" className="space-y-4 mt-4">
                {pendingRequests.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">No pending requests</p>
                ) : (
                  pendingRequests.map(request => (
                    <RequestCard key={request.id} request={request} showActions />
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="assigned" className="space-y-4 mt-4">
                {assignedRequests.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">No assigned pickups</p>
                ) : (
                  assignedRequests.map(request => (
                    <RequestCard key={request.id} request={request} showActions />
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4 mt-4">
                {completedRequests.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">No completed pickups yet</p>
                ) : (
                  completedRequests.map(request => (
                    <RequestCard key={request.id} request={request} />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Collection Safety Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-700">
              <li>✓ Always wear protective equipment when handling hazardous materials</li>
              <li>✓ Verify waste type matches the description before loading</li>
              <li>✓ Secure all containers to prevent spills during transport</li>
              <li>✓ Follow proper disposal procedures at designated facilities</li>
              <li>✓ Report any leaks or damaged containers immediately</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
