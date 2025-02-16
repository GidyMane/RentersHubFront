// "use client";

// import { useState } from "react";
// import { Grid2X2, List } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { PropertyCard } from "./PropertyCard";

// interface Property {
//   id: string;
//   imageUrl: string;
//   price: number;
//   address: string;
//   city: string;
//   state: string;
//   zip: string;
//   beds: number;
//   baths: number;
//   sqft: number;
//   isPerfectFit?: boolean;
//   isHotSpot?: boolean;
// }

// interface PropertyListProps {
//   properties: Property[];
// }

// export function PropertyList({ properties }: PropertyListProps) {
//   const [view, setView] = useState<"grid" | "list">("grid");
//   const [sortBy, setSortBy] = useState("relevancy");

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm text-muted-foreground">
//             Showing {properties.length} Property Listings in {properties[0]?.city}, {properties[0]?.state}
//           </p>
//         </div>
//         <div className="flex items-center gap-4">
//           <Select value={sortBy} onValueChange={setSortBy}>
//             <SelectTrigger className="w-[160px]">
//               <SelectValue placeholder="Sort by" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="relevancy">Relevancy</SelectItem>
//               <SelectItem value="price-asc">Price: Low to High</SelectItem>
//               <SelectItem value="price-desc">Price: High to Low</SelectItem>
//             </SelectContent>
//           </Select>
//           <div className="flex items-center border rounded-md">
//             <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setView("grid")}>
//               <Grid2X2 className="h-4 w-4" />
//             </Button>
//             <Button variant={view === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setView("list")}>
//               <List className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className={view === "grid" ? "grid sm:grid-cols-2 gap-6" : "space-y-4"}>
//         {properties.map((property) => (
//           <PropertyCard key={property.id} {...property} />
//         ))}
//       </div>
//     </div>
//   );
// }
