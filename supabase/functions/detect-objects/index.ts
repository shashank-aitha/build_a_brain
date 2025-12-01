import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing image for object detection...");

    // Use Lovable AI with vision model to detect objects
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an object detection system. Analyze images and identify all visible objects. Return a JSON response with: 1) 'objects' array containing object names with confidence scores, 2) 'explanation' describing how the visual system processes this input from sensation to perception in 2-3 sentences. Be specific about what you see."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Detect and label all objects in this image. Provide confidence scores and explain the perception process."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("AI Response:", content);

    // Parse the AI response to extract structured data
    let detectionResult;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        detectionResult = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: create structured response from text
        detectionResult = {
          objects: [{ name: "Multiple objects detected", confidence: 0.9 }],
          explanation: content
        };
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      detectionResult = {
        objects: [{ name: "Objects detected", confidence: 0.85 }],
        explanation: content || "The visual system processes this image through multiple stages of neural processing."
      };
    }

    return new Response(
      JSON.stringify(detectionResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in detect-objects function:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process image";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
