"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { PlusCircle, Search, MoreHorizontal, Car, Filter } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Vehicle } from "@/types/vehicle";
import { formatCurrency } from "@/lib/utils";
import { authService } from "@/services/authService";
import { Badge } from "@/components/ui/badge";
import { vehicleService } from "@/services/vehicleService";
import Fuse from "fuse.js";
import { UUID } from "crypto";

export default function AdminVehiclesPage() {
  const router = useRouter();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  if (!isAuthenticated) {
    toast.error("Please login to access the admin dashboard");
    router.push("/login");
    return;
  }
  
  if (currentUser?.role !== "ADMIN") {
    toast.error("You don't have permission to access the admin dashboard");
    router.push("/browse-vehicles");
    return;
  }

  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {

    const fetchVehicles = async () => {
      try {
        const response = await vehicleService.getAllVehicles();
        setAllVehicles(response);
        setFilteredVehicles(response);
      }
      catch (error) {
        toast.error("Failed to fetch vehicles");
      }
    };
    fetchVehicles();
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  useEffect(() => {
    if(!searchQuery || searchQuery.trim().length === 0) {
        setFilteredVehicles(allVehicles);
        return;
    }
    const fuse = new Fuse(allVehicles, {
        keys: [
            {name: "brand", weight: 0.6}, 
            {name: "model", weight: 0.4}
        ],
        threshold: 0.5
    });
    const results = fuse.search(searchQuery);
    const filteredVehicles = results.map((result) => result.item);
    setFilteredVehicles(filteredVehicles);
  }, [searchQuery, allVehicles])
  
  const handleEdit = (vehicleId: string) => {
    router.push(`/vehicles/${vehicleId}/edit`);
  };
  
  const handleDelete = async (vehicleId: UUID) => {
    try{
        await vehicleService.deleteVehicle(vehicleId);
        const updatedVehicles = allVehicles.filter((vehicle) => vehicle.id !== vehicleId);
        setAllVehicles(updatedVehicles);
        toast.success("Vehicle deleted successfully");
    }
    catch(error) {
        toast.error("Failed to delete vehicle");
        return;
    }
    
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vehicle Inventory</h1>
          </div>
          <Button onClick={() => router.push("/vehicles/add")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Vehicle
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>
        
        {allVehicles.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Daily Rate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-md overflow-hidden">
                          <Image 
                            src={vehicle.imageUrl}
                            alt={vehicle.brand + vehicle.model}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">{vehicle.brand} {vehicle.model}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {vehicle.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(vehicle.pricePerDay)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(vehicle.id)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(vehicle.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Car className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or add a new vehicle
            </p>
            <Button onClick={() => router.push("/vehicles/add")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}