"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Vehicle } from "@/types/vehicle";
import { calculateDateDifference, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface VehicleCardProps {
  vehicle: Vehicle;
  onBookNow: () => void;
  startDate?: Date;
  endDate?: Date;
}

export function VehicleCard({ vehicle, onBookNow, startDate, endDate }: VehicleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const numDays = startDate && endDate ? calculateDateDifference(startDate, endDate) + 1 : 1;
  const totalPrice = vehicle.pricePerDay * numDays;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={vehicle.imageUrl}
            alt={vehicle.model}
            fill
            className={`object-cover transition-transform duration-300 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
          <div className="absolute top-2 right-2">
            <Badge>
              {vehicle.type}
            </Badge>
          </div>
        </div>
        <CardHeader className="pb-2">
          <CardDescription>
            {vehicle.brand} {vehicle.model}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-bold text-lg">{formatCurrency(vehicle.pricePerDay)}</span>
              <span className="text-muted-foreground">/day</span>
            </div>
          </div>
          {startDate && endDate && (
            <div className="mt-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{numDays} day{numDays > 1 ? 's' : ''} • Total: {formatCurrency(totalPrice)}</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={onBookNow}
          >
            Book Now
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}