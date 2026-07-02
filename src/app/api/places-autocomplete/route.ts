import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const input = searchParams.get("input");
    const sessionToken = searchParams.get("sessiontoken");

    if (!input || input.trim().length < 2) {
      return NextResponse.json([], { status: 200 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    
    // If no API key is set, fallback to mock data to allow UI testing/verification
    if (!apiKey || apiKey.trim() === "") {
      console.warn("GOOGLE_MAPS_API_KEY is not defined. Falling back to mock data for testing.");
      
      const mockVenues = [
        { 
          label: "Lucky Strike Bowling, New York, NY, USA", 
          value: "Lucky Strike Bowling, New York, NY, USA",
          mainText: "Lucky Strike Bowling",
          secondaryText: "New York, NY, USA"
        },
        { 
          label: "Bowlero Chelsea Piers, New York, NY, USA", 
          value: "Bowlero Chelsea Piers, New York, NY, USA",
          mainText: "Bowlero Chelsea Piers",
          secondaryText: "New York, NY, USA"
        },
        { 
          label: "Brooklyn Bowl, Brooklyn, NY, USA", 
          value: "Brooklyn Bowl, Brooklyn, NY, USA",
          mainText: "Brooklyn Bowl",
          secondaryText: "Brooklyn, NY, USA"
        },
        { 
          label: "Apex Entertainment, Marlborough, MA, USA", 
          value: "Apex Entertainment, Marlborough, MA, USA",
          mainText: "Apex Entertainment",
          secondaryText: "Marlborough, MA, USA"
        },
        { 
          label: "Super Bowl FEC, Houston, TX, USA", 
          value: "Super Bowl FEC, Houston, TX, USA",
          mainText: "Super Bowl FEC",
          secondaryText: "Houston, TX, USA"
        },
        { 
          label: "Main Event Entertainment, Austin, TX, USA", 
          value: "Main Event Entertainment, Austin, TX, USA",
          mainText: "Main Event Entertainment",
          secondaryText: "Austin, TX, USA"
        },
        { 
          label: "Dave & Buster's, Dallas, TX, USA", 
          value: "Dave & Buster's, Dallas, TX, USA",
          mainText: "Dave & Buster's",
          secondaryText: "Dallas, TX, USA"
        }
      ];

      // Filter mock venues based on input
      const filtered = mockVenues.filter(item =>
        item.label.toLowerCase().includes(input.toLowerCase())
      );
      
      return NextResponse.json(filtered, { status: 200 });
    }

    // Call Google's modern Places API (New) Autocomplete endpoint
    const url = "https://places.googleapis.com/v1/places:autocomplete";
    const body: Record<string, any> = {
      input: input,
    };
    if (sessionToken) {
      body.sessionToken = sessionToken;
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Google Places API responded with status ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const suggestions = data.suggestions || [];
    const options = suggestions
      .filter((item: any) => item.placePrediction?.text?.text)
      .map((item: any) => {
        const text = item.placePrediction.text.text;
        const mainText = item.placePrediction.structuredFormat?.mainText?.text || text;
        const secondaryText = item.placePrediction.structuredFormat?.secondaryText?.text || "";
        return {
          label: text,
          value: text,
          mainText,
          secondaryText,
        };
      });

    return NextResponse.json(options, { status: 200 });
  } catch (error: any) {
    console.error("Error in places-autocomplete API:", error);
    return NextResponse.json(
      { error: "Failed to fetch autocomplete options." },
      { status: 500 }
    );
  }
}
