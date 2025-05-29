"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Filter, Car } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VehicleCard } from "@/components/ui/vehicle-card";
import { Vehicle, VehicleType } from "@/types/vehicle";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { authService } from "@/services/authService";
import { vehicleService, VehicleFilterParams } from "@/services/vehicleService";

export default function VehiclesPage() {
    const router = useRouter();
    const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
    const [filters, setFilters] = useState<VehicleFilterParams>({
        startPrice: undefined,
        endPrice: undefined,
        types: [],
        brands: [],
    });
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    const isAuthenticated = authService.isAuthenticated();
    // Extract unique brands
    const [brands, setBrands] = useState<string[]>([]);
    const types: VehicleType[] = ['bike', 'scooter', 'hatchback', 'sedan', 'suv', 'mpv'];

    // Fetch vehicles
    const fetchVehicles = async () => {
        try {
            setFilteredVehicles([]);
            const vehicles = await vehicleService.filterVehicles(filters);
            setFilteredVehicles(vehicles);

            if (brands.length === 0) {
                const filteredBrands = [] as string[];

                vehicles.forEach((vehicle) => {
                    if (!filteredBrands.includes(vehicle.brand)) {
                        filteredBrands.push(vehicle.brand);
                    }
                });

                setBrands(filteredBrands.sort());
            }
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, [filters]);

    const resetFilters = () => {
        setFilters({
            startPrice: undefined,
            endPrice: undefined,
            types: [],
            brands: [],
        });
        setStartDate(undefined);
        setEndDate(undefined);
        setFilteredVehicles([]);
    };

    const handleBookNow = (vehicle: Vehicle) => {
        if (!isAuthenticated) {
            toast.error("Please log in to book a vehicle");
            router.push("/login");
            return;
        }

        if (!startDate || !endDate) {
            toast.error("Please select start and end dates");
            return;
        }

        toast.success(`Vehicle booked: ${vehicle.name}`);
    };

    return (
        <div className="container mx-auto">
            <div className="flex flex-col gap-4 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-card rounded-lg border shadow-sm p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold flex items-center">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filters
                                </h2>
                                <div className="flex items-center justify-between">
                                    <Button variant="default" onClick={resetFilters}>
                                        Reset Filters
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium">Price Range</label>
                                    <div className="mt-2 space-y-2">
                                        <Input
                                            type="number"
                                            placeholder="Min price"
                                            value={filters.startPrice || ""}
                                            onChange={(e) => {
                                                const value = e.target.value ? Number(e.target.value) : undefined;
                                                setFilters({ ...filters, startPrice: value });
                                            }}
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Max price"
                                            value={filters.endPrice || ""}
                                            onChange={(e) => {
                                                const value = e.target.value ? Number(e.target.value) : undefined;
                                                setFilters({ ...filters, endPrice: value });
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Dates</label>
                                    <div className="flex flex-col gap-2 mt-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    {startDate ? format(startDate, "PPP") : "Start date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={startDate}
                                                    onSelect={setStartDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                >
                                                    {endDate ? format(endDate, "PPP") : "End date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={endDate}
                                                    onSelect={setEndDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Vehicle Types</label>
                                    <div className="space-y-2">
                                        {types.map((type) => (
                                            <div key={type} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`type-${type}`}
                                                    checked={filters.types?.includes(type)}
                                                    onCheckedChange={(checked) => {
                                                        const updatedTypes = checked
                                                            ? [...(filters.types || []), type]
                                                            : filters.types?.filter((t) => t !== type) || [];
                                                        setFilters({ ...filters, types: updatedTypes });;
                                                    }}
                                                />
                                                <label
                                                    htmlFor={`type-${type}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {type}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Brands</label>
                                    <div className="space-y-2">
                                        {brands.map((brand) => (
                                            <div key={brand} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`brand-${brand}`}
                                                    checked={filters.brands?.includes(brand)}
                                                    onCheckedChange={(checked) => {
                                                        const updatedBrands = checked
                                                            ? [...(filters.brands || []), brand]
                                                            : filters.brands?.filter((b) => b !== brand) || [];
                                                        setFilters({ ...filters, brands: updatedBrands });;
                                                    }}
                                                />
                                                <label
                                                    htmlFor={`brand-${brand}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {brand}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-3">
                        {filteredVehicles.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-96 text-center">
                                <Car className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
                                <p className="text-muted-foreground mb-4">
                                    Try adjusting your filters to see more results
                                </p>
                                <Button onClick={resetFilters}>Reset Filters</Button>
                            </div>
                        ) : (
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {filteredVehicles.map((vehicle, index) => (
                                    <motion.div
                                        key={vehicle.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <VehicleCard
                                            vehicle={vehicle}
                                            onBookNow={() => handleBookNow(vehicle)}
                                            startDate={startDate}
                                            endDate={endDate}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}