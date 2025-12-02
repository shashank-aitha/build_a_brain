import { useState } from "react";
import { CameraView } from "@/components/CameraView";
import { DetectionResults } from "@/components/DetectionResults";
import { Brain, Sparkles } from "lucide-react";

const Index = () => {
  const [detectionResult, setDetectionResult] = useState<{
    objects: Array<{ name: string; confidence: number }>;
    explanation: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-neural-deep to-background neural-grid">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/5 rounded-full blur-3xl neural-pulse" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-accent/5 rounded-full blur-3xl neural-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="h-12 w-12 text-primary neural-pulse" />
            <h1 className="text-5xl md:text-6xl font-display font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Build-A-Brain
            </h1>
          </div>
          
          <p className="text-lg text-muted-foreground/80 mb-4">
            By: Shashank Aitha
          </p>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore how a brain-like system turns raw visual sensation into meaningful perception,
            tracing the path from camera input to object recognition and explanation.
          </p>

          <div className="flex items-center justify-center gap-2 text-primary/70">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">From Sensation to Perception</span>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column: Camera/Upload */}
          <section className="space-y-6">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                <span className="text-primary">01</span>
                <span>Sensation</span>
              </h2>
              <CameraView onDetection={setDetectionResult} />
            </div>
          </section>

          {/* Right Column: Results */}
          <section className="space-y-6">
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                <span className="text-accent">02</span>
                <span>Perception</span>
              </h2>
              
              {detectionResult ? (
                <DetectionResults
                  objects={detectionResult.objects}
                  explanation={detectionResult.explanation}
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-center">
                  <div className="space-y-4">
                    <Brain className="h-16 w-16 mx-auto text-muted-foreground/30 neural-pulse" />
                    <p className="text-muted-foreground">
                      Capture or upload an image to trace sensation to perception
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Info Section */}
        <section className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-display font-bold mb-4 text-center">
                How It Works
              </h2>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-display font-bold">1</span>
                  </div>
                  <h3 className="font-display font-semibold">Sensation</h3>
                  <p className="text-sm text-muted-foreground">
                    Camera captures raw visual input, similar to how the eye receives light
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-display font-bold">2</span>
                  </div>
                  <h3 className="font-display font-semibold">Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    AI model analyzes patterns and features, like neural pathways in the brain
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary font-display font-bold">3</span>
                  </div>
                  <h3 className="font-display font-semibold">Perception</h3>
                  <p className="text-sm text-muted-foreground">
                    Objects are recognized and labeled, creating meaningful understanding
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Index;

// Import Card components for the info section
import { Card, CardContent } from "@/components/ui/card";
