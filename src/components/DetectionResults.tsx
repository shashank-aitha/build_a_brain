import { Brain, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DetectionResultsProps {
  objects: Array<{ name: string; confidence: number }>;
  explanation: string;
}

export const DetectionResults = ({ objects, explanation }: DetectionResultsProps) => {
  return (
    <div className="w-full space-y-6">
      <Card className="border-primary/30 neural-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-primary">
            <Eye className="h-6 w-6" />
            Detected Objects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {objects.map((obj, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-4 py-2 text-base bg-primary/20 border-primary/50 hover:bg-primary/30 transition-colors"
              >
                <span className="font-medium">{obj.name}</span>
                <span className="ml-2 text-primary">
                  {(obj.confidence * 100).toFixed(0)}%
                </span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-accent/30 neural-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-accent">
            <Brain className="h-6 w-6" />
            Perception Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/90 leading-relaxed">
            {explanation}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
