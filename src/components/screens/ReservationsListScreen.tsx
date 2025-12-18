import { ChevronLeft, Calendar, Clock, Users, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Reservation } from '../../types';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface ReservationsListScreenProps {
  reservations: Reservation[];
  onBack: () => void;
  onCancel: (id: string) => void;
  onViewRestaurant: (restaurantId: string) => void;
}

export function ReservationsListScreen({
  reservations,
  onBack,
  onCancel,
  onViewRestaurant
}: ReservationsListScreenProps) {
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);

  const now = new Date();
  
  const upcomingReservations = reservations.filter(r => {
    if (r.status !== 'confirmed') return false;
    const reservationDate = new Date(`${r.date}T${r.time}`);
    return reservationDate >= now;
  });

  const pastReservations = reservations.filter(r => {
    const reservationDate = new Date(`${r.date}T${r.time}`);
    return reservationDate < now || r.status === 'cancelled';
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} />;
      case 'pending':
        return <AlertCircle size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  const canCancel = (reservation: Reservation) => {
    if (reservation.status !== 'confirmed') return false;
    const reservationDate = new Date(`${reservation.date}T${reservation.time}`);
    const hoursUntil = (reservationDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntil >= 24;
  };

  const renderReservation = (reservation: Reservation) => (
    <div
      key={reservation.id}
      className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-card-foreground mb-1">{reservation.restaurantName}</h3>
          <Badge className={getStatusColor(reservation.status)}>
            <span className="flex items-center gap-1">
              {getStatusIcon(reservation.status)}
              {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
            </span>
          </Badge>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar size={16} />
          <span>{format(new Date(reservation.date), 'EEEE, MMMM d, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock size={16} />
          <span>{reservation.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users size={16} />
          <span>{reservation.partySize} {reservation.partySize === 1 ? 'Guest' : 'Guests'}</span>
        </div>
      </div>

      {reservation.specialRequests && (
        <div className="bg-secondary rounded-lg p-3 mb-4">
          <p className="text-xs text-muted-foreground mb-1">Special Requests:</p>
          <p className="text-sm text-card-foreground">{reservation.specialRequests}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="text-sm">
          <span className="text-muted-foreground">Deposit: </span>
          <span className="font-medium text-card-foreground">${reservation.depositAmount.toFixed(2)}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewRestaurant(reservation.restaurantId)}
          >
            <MapPin size={16} className="mr-1" />
            View Restaurant
          </Button>
          {canCancel(reservation) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCancelConfirmId(reservation.id)}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border px-4 py-4 z-10">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack}>
            <ChevronLeft size={24} className="text-foreground" />
          </button>
          <h2 className="text-xl text-card-foreground">My Reservations</h2>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingReservations.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastReservations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingReservations.length > 0 ? (
              upcomingReservations.map(renderReservation)
            ) : (
              <div className="text-center py-12">
                <Calendar size={48} className="text-muted-foreground mx-auto mb-3 opacity-30" />
                <p className="text-muted-foreground mb-2">No upcoming reservations</p>
                <p className="text-sm text-muted-foreground">
                  Book a table at your favorite restaurant!
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastReservations.length > 0 ? (
              pastReservations.map(renderReservation)
            ) : (
              <div className="text-center py-12">
                <Calendar size={48} className="text-muted-foreground mx-auto mb-3 opacity-30" />
                <p className="text-muted-foreground mb-2">No past reservations</p>
                <p className="text-sm text-muted-foreground">
                  Your reservation history will appear here
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelConfirmId !== null} onOpenChange={() => setCancelConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this reservation? Your deposit will be fully refunded.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (cancelConfirmId) {
                  onCancel(cancelConfirmId);
                  setCancelConfirmId(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel Reservation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
