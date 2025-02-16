import React from 'react';
import { Badge } from "@/components/ui/badge"

interface FeatureBadgesProps {
  features:{id:number; name:string;}[];
  selectedFeatures: string[];
  onFeatureToggle: (feature: string) => void;
}

export function FeatureBadges({ features, selectedFeatures, onFeatureToggle }: FeatureBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {features.map((feature) => (
        <Badge
          key={feature.id}
          variant="outline"
          className={`cursor-pointer transition-colors ${
            selectedFeatures.includes(feature.id.toString()) ? 'bg-primary300 text-primary-foreground' : 'bg-background'
          }`}
          onClick={() => onFeatureToggle(feature.id.toString())}
        >
          {feature?.name}
        </Badge>
      ))}
    </div>
  );
}
