"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CalendarCheck, Filter, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vehicle } from "@/types/vehicle";
import { Booking } from "@/types/booking";
import { formatCurrency, formatDate } from "@/lib/utils";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { UUID } from "crypto";
import { bookingService } from "@/services/ bookingService";
import { vehicleService } from "@/services/vehicleService";

export default function MyBookingsPage() {
    const router = useRouter();
    const isAuthenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();
    if(!currentUser) {
        toast.error("Please login to view your bookings");
        router.push("/login");
        return;
    }
    else if(currentUser.role === "ADMIN") {
        router.push("/admin");
        return;
    }

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
    const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
    const [cancelledBookings, setCancelledBookings] = useState<Booking[]>([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const bookings = await bookingService.getBookingsByEmail(currentUser.email);
                setBookings(bookings);
            }
            catch (error) {
                toast.error("Failed to fetch bookings");
            }
        };

        const fetchVehicles = async () => {
            try {
                const vehicles = await vehicleService.getAllVehicles();
                setVehicles(vehicles);
            }
            catch (error) {
                toast.error("Failed to fetch vehicles");
            }
        };

        fetchVehicles();
        fetchBookings();
    }, []);

    const onCancel = async (booking: Booking) => {
        try {
            await bookingService.cancelBooking(booking.id);
            toast.success("Booking cancelled successfully");
            setActiveBookings(activeBookings.filter((b) => b.id !== booking.id));
            setCancelledBookings([...cancelledBookings, {...booking, status: "CANCELLED"}]);
        }
        catch (error) {
            toast.error("Failed to cancel booking");
        }
    };

    useEffect(() => {
        // Check if user is authenticated
        if (!isAuthenticated) {
            toast.error("Please login to view your bookings");
            router.push("/login");
            return;
        }

        // Filter bookings for current user
        if (currentUser) {
            const userActiveBookings = bookings.filter(
                (booking) => booking.userId === currentUser.id && booking.status === "ACTIVE"
            );

            const userCompletedBookings = bookings.filter(
                (booking) => booking.userId === currentUser.id && booking.status === "COMPLETED"
            );

            const userCancelledBookings = bookings.filter(
                (booking) => booking.userId === currentUser.id && booking.status === "CANCELLED"
            )

            setActiveBookings(userActiveBookings);
            setCompletedBookings(userCompletedBookings);
            setCancelledBookings(userCancelledBookings);
        }
    }, [bookings]);

    const getVehicleDetails = (vehicleId: string): Vehicle | undefined => {
        return vehicles.find((vehicle) => vehicle.id === vehicleId);
    };

    return (
        <div className="container mx-auto">
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
                    <p className="text-muted-foreground">
                        Manage your active rentals and return requests
                    </p>
                </div>

                <Tabs defaultValue="active" className="w-full">
                    <TabsList className="grid grid-cols-3 w-[600px] p-2 h-12">
                        <TabsTrigger value="active" className="relative">
                            Active / Upcoming
                            {activeBookings.length > 0 && (
                                <Badge className="ml-2 rounded-full">{activeBookings.length}</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="completed" className="relative">
                            Completed
                            {completedBookings.length > 0 && (
                                <Badge className="ml-2 rounded-full">{completedBookings.length}</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="cancelled" className="relative">
                            Cancelled
                            {cancelledBookings.length > 0 && (
                                <Badge className="ml-2 rounded-full">{cancelledBookings.length}</Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="active" className="mt-6">
                        {activeBookings.length > 0 ? (
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {activeBookings.map((booking, index) => {
                                    const vehicle = getVehicleDetails(booking.vehicleId);
                                    if (!vehicle) return null;

                                    return (
                                        <motion.div
                                            key={booking.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <BookingCard
                                                booking={booking}
                                                vehicle={vehicle}
                                                type="ACTIVE"
                                                onCancel={onCancel}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <CalendarCheck className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No active rentals</h3>
                                <p className="text-muted-foreground mb-4">
                                    You don't have any active vehicle rentals at the moment
                                </p>
                                <Button onClick={() => router.push("/vehicles")}>
                                    Browse Vehicles
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="completed" className="mt-6">
                        {completedBookings.length > 0 ? (
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {completedBookings.map((booking, index) => {
                                    const vehicle = getVehicleDetails(booking.vehicleId);
                                    if (!vehicle) return null;

                                    return (
                                        <motion.div
                                            key={booking.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <BookingCard
                                                type="COMPLETED"
                                                booking={booking}
                                                vehicle={vehicle}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <Filter className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No return requests</h3>
                                <p className="text-muted-foreground mb-4">
                                    You don't have any completed vehicle rentals at the moment
                                </p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="cancelled" className="mt-6">
                        {cancelledBookings.length > 0 ? (
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {cancelledBookings.map((booking, index) => {
                                    const vehicle = getVehicleDetails(booking.vehicleId);
                                    if (!vehicle) return null;

                                    return (
                                        <motion.div
                                            key={booking.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <BookingCard
                                                type="CANCELLED"
                                                booking={booking}
                                                vehicle={vehicle}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <Filter className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No return requests</h3>
                                <p className="text-muted-foreground mb-4">
                                    You don't have any cancelled vehicle rentals at the moment
                                </p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

interface BookingCardProps {
    booking: Booking;
    vehicle: Vehicle;
    type: "ACTIVE" | "COMPLETED" | "CANCELLED";
    onCancel?: (booking: Booking) => void;
}

function BookingCard({ booking, vehicle, type, onCancel }: BookingCardProps) {
    return (
        <Card className="h-full flex flex-col">
            <div className="relative h-44 overflow-hidden">
                <Image
                    src={vehicle.imageUrl}
                    alt={vehicle.brand + vehicle.model}
                    fill
                    className="object-cover"
                />
            </div>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{vehicle.name}</CardTitle>
                </div>
                <CardDescription>
                    {vehicle.brand} {vehicle.model}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Start Date:</span>
                        <span className="font-medium">{formatDate(booking.startDate)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">End Date:</span>
                        <span className="font-medium">{formatDate(booking.endDate)}</span>
                    </div>
                </div>
            </CardContent>
            {type === "ACTIVE" &&
                <CardFooter>
                    <Button
                        className="w-full"
                        onClick={() => {if(onCancel) onCancel(booking)}}
                    >
                        Cancel Booking
                    </Button>
                </CardFooter>
            }
        </Card>
    );
}