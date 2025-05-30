"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Car, ImagePlus, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authService } from "@/services/authService";
import { Vehicle, VehicleType } from "@/types/vehicle";
import { vehicleService } from "@/services/vehicleService";

const vehicleSchema = z.object({
  brand: z.string().min(1, { message: "Brand is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  type: z.enum(["bike", "scooter", "hatchback", "sedan", "suv", "mpv"] as const),
  pricePerDay: z.coerce.number().positive({ message: "Price must be positive" }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL" }),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

export default function AddVehiclePage() {
  const router = useRouter();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!isAuthenticated) {
      toast.error("Please login to access the admin dashboard");
      router.push("/login");
      return;
    }
    
    if (currentUser?.role !== "ADMIN") {
      toast.error("You don't have permission to access the admin dashboard");
      router.push("/vehicles");
      return;
    }

    const fetchVehicles = async () => {
      try {
        const response = await vehicleService.getAllVehicles();
        setVehicles(response);
      }
      catch (error) {
        toast.error("Failed to fetch vehicles");
      }
    }
  }, [isAuthenticated, currentUser, router]);
  
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      brand: "",
      model: "",
      type: "bike",
      pricePerDay: 50,
      imageUrl: ""
    },
  });
  
  const onSubmit = async (data: VehicleFormValues) => {
    try {
        await vehicleService.createVehicle(data);
        toast.success("Vehicle added successfully");
        router.push("/vehicles");
    }
    catch(error) {
      toast.error("Failed to add vehicle");
    }
    finally {
      form.reset();
    }
    
  };
  
  return (
    <div className="container mx-auto">
      <motion.div
        className="flex flex-col gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Vehicle</h1>
            <p className="text-muted-foreground">
              Add a new vehicle to your inventory
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brand</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Honda" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Civic" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vehicle Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="2-Wheeler">2-Wheeler</SelectItem>
                                <SelectItem value="4-Wheeler">4-Wheeler</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="pricePerDay"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Daily Rate ($)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input placeholder="https://example.com/image.jpg" {...field} />
                              <Button type="button" variant="outline" size="icon">
                                <ImagePlus className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Enter a URL for the vehicle image
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Vehicle
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}