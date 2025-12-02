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
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    
    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not configured");
    }

    console.log("Processing image for object detection...");

    // Extract base64 data from data URL (remove data:image/...;base64, prefix)
    const base64Data = imageData.includes(",") ? imageData.split(",")[1] : imageData;
    
    // Determine image type from data URL or default to jpeg
    let imageType = "image/jpeg";
    if (imageData.startsWith("data:")) {
      const match = imageData.match(/data:image\/(\w+);base64/);
      if (match) {
        imageType = `image/${match[1]}`;
      }
    }

    // Use Claude API with vision model to detect objects
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        system: "You are an object detection system. Analyze images and identify all visible objects. Return a JSON response with: 1) 'objects' array containing object names with confidence scores, 2) 'explanation' This is for a psych class. Pretend you are the brain and explain how visual system processes this input from sensation to perception in 2-3 sentences. Do not use em dashes Be specific about what you see.",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Detect and label all objects in this image. Provide confidence scores and explain the perception process. Return your response as valid JSON with 'objects' (array of {name, confidence}) and 'explanation' (string) fields."
              },
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: imageType,
                  data: base64Data
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 401 || response.status === 403) {
        return new Response(
          JSON.stringify({ error: "API authentication failed. Please check your API key." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`Claude API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    // Claude API returns content as an array of content blocks
    const contentBlocks = data.content || [];
    const textBlock = contentBlocks.find((block: any) => block.type === "text");
    const content = textBlock?.text || contentBlocks[0]?.text || "";

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
