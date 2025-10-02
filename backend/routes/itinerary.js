const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Itinerary = require('../models/Itinerary'); // Import the Mongoose model
const authMiddleware = require('../middleware/authMiddleware');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Define the POST route for generating an itinerary
router.post('/generate', authMiddleware, async (req, res) => {
    const { query } = req.body;
    console.log(`Received query for "${query}"`);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const masterPrompt = `
          You are an expert India travel planner. Your task is to create an itinerary based on the user's request.
          User Request: "${query}"
          Your response MUST be a clean JSON object without any surrounding text, comments, or markdown formatting.
          The JSON object must conform to this exact structure:
          {
            "tripTitle": "A descriptive, catchy title for the trip",
            "summary": "A brief 2-3 sentence summary of the trip.",
            "dailyPlan": [
              {
                "day": 1,
                "city": "City Name",
                "theme": "A theme for the day",
                "attractions": ["Attraction 1", "Attraction 2"],
                "foodSuggestion": "Recommend a type of local food."
              }
            ],
            "safetyGuidance": {
              "generalTips": ["A useful safety tip for tourists in India.", "Another relevant tip."],
              "emergencyContacts": {
                "police": "112",
                "ambulance": "102"
              }
            }
          }
        `;

        const result = await model.generateContent(masterPrompt);
        const response = await result.response;
        const text = response.text();
        
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const itineraryData = JSON.parse(cleanedText);

        console.log("✅ Itinerary successfully generated from OpenAI");

        // Debug: Check if req.user exists and has userId
        console.log('🔍 Debug - req.user:', req.user);
        console.log('🔍 Debug - userId:', req.user?.userId);

        // Save the itinerary to the MongoDB database
        const newItinerary = new Itinerary({
          ...itineraryData,
          userId: String(req.user.userId) // Ensure it's stored as string
        });

        await newItinerary.save();
        console.log("✅ Itinerary successfully saved to database.");

        res.status(200).json(itineraryData);

    } catch (error) {
        console.error("❌ Error in /generate route:", error);
        res.status(500).json({ error: "Failed to generate itinerary." });
    }
});

router.get('/my-itineraries', authMiddleware, async (req, res) => {
  try {
    console.log('🔍 Fetching itineraries for user:', req.user.userId);
    
    const itineraries = await Itinerary.find({ userId: String(req.user.userId) })
      .sort({ createdAt: -1 })
      .limit(50); // Limit to prevent large responses

    console.log('✅ Found', itineraries.length, 'itineraries for user');
    
    res.status(200).json({
      success: true,
      count: itineraries.length,
      itineraries: itineraries
    });
  } catch (error) {
    console.error('❌ Error fetching user itineraries:', error);
    res.status(500).json({ 
      error: 'Failed to fetch your itineraries',
      message: error.message 
    });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const itineraryId = req.params.id;
    console.log('🔍 Fetching itinerary by ID:', itineraryId, 'for user:', req.user.userId);
    
    // Find the itinerary by ID
    const itinerary = await Itinerary.findById(itineraryId);
    
    // Check if itinerary exists
    if (!itinerary) {
      console.log('❌ Itinerary not found with ID:', itineraryId);
      return res.status(404).json({ 
        error: 'Itinerary not found',
        message: 'No itinerary exists with the provided ID'
      });
    }
    
    // Verify that the itinerary belongs to the logged-in user
    // Convert both to strings for comparison since one might be number, other string
    const itineraryUserId = String(itinerary.userId);
    const requestUserId = String(req.user.userId);
    
    console.log('🔍 Debug - Itinerary userId:', itineraryUserId, '(type:', typeof itinerary.userId, ')');
    console.log('🔍 Debug - Request userId:', requestUserId, '(type:', typeof req.user.userId, ')');
    
    if (itineraryUserId !== requestUserId) {
      console.log('❌ Unauthorized access attempt. Itinerary userId:', itineraryUserId, 'Request userId:', requestUserId);
      return res.status(401).json({ 
        error: 'Unauthorized access',
        message: 'You are not authorized to view this itinerary'
      });
    }
    
    console.log('✅ Successfully retrieved itinerary for authorized user');
    
    res.status(200).json({
      success: true,
      itinerary: itinerary
    });
  } catch (error) {
    console.error('❌ Error fetching itinerary by ID:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Invalid itinerary ID format',
        message: 'The provided ID is not a valid MongoDB ObjectId'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch itinerary',
      message: error.message 
    });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const itineraryId = req.params.id;
    console.log('🔍 Attempting to delete itinerary by ID:', itineraryId, 'for user:', req.user.userId);
    
    // Find the itinerary by ID
    const itinerary = await Itinerary.findById(itineraryId);
    
    // Check if itinerary exists
    if (!itinerary) {
      console.log('❌ Itinerary not found with ID:', itineraryId);
      return res.status(404).json({ 
        error: 'Itinerary not found',
        message: 'No itinerary exists with the provided ID'
      });
    }
    
    // Verify that the itinerary belongs to the logged-in user
    // Convert both to strings for comparison since one might be number, other string
    const itineraryUserId = String(itinerary.userId);
    const requestUserId = String(req.user.userId);
    
    console.log('🔍 Debug - Itinerary userId:', itineraryUserId, '(type:', typeof itinerary.userId, ')');
    console.log('🔍 Debug - Request userId:', requestUserId, '(type:', typeof req.user.userId, ')');
    
    if (itineraryUserId !== requestUserId) {
      console.log('❌ Unauthorized deletion attempt. Itinerary userId:', itineraryUserId, 'Request userId:', requestUserId);
      return res.status(401).json({ 
        error: 'Unauthorized access',
        message: 'You are not authorized to delete this itinerary'
      });
    }
    
    // Delete the itinerary from the database
    await Itinerary.findByIdAndDelete(itineraryId);
    console.log('✅ Successfully deleted itinerary for authorized user');
    
    res.status(200).json({
      success: true,
      message: 'Itinerary deleted successfully',
      deletedItineraryId: itineraryId
    });
    
  } catch (error) {
    console.error('❌ Error deleting itinerary by ID:', error);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Invalid itinerary ID format',
        message: 'The provided ID is not a valid MongoDB ObjectId'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to delete itinerary',
      message: error.message 
    });
  }
});

module.exports = router;