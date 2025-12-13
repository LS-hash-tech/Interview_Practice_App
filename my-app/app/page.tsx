'use client' // Enables client-side features like useState and onClick-ui

import { useState } from 'react';

export default function Home() {
  // Store user's question input
  const [userInput, setUserInput] = useState('');
  
  // Store AI's response
  const [aiResponse, setAiResponse] = useState('');

  // Handle form submission when user clicks "Generate Interview Prep"
  const handleSubmit = async () => {
    // Validate input isn't empty
    if (!userInput.trim()) {
      alert('Please enter a question!');
      return;
    }

    // Show loading message while waiting for API
    setAiResponse('Generating response...');

    try {
      // Call our backend API with user's input
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });

      const data = await response.json();
      
      // Handle errors from backend
      if (data.error) {
        setAiResponse('Error: ' + data.error);
      } else {
        // Display AI's response
        setAiResponse(data.response);
      }
      
    } catch (error) {
      // Handle network errors
      setAiResponse('Failed to connect to AI. Please try again.');
    }
  };

  return (
    // Main container - full height, light blue background, side-by-side layout
    <div className="h-screen bg-blue-50 flex overflow-hidden">
      
      {/* LEFT SIDE - Input area (stays fixed while right side scrolls) */}
      <div className="w-1/2 p-8">
        <div className="bg-white rounded-lg shadow-lg p-8 h-full flex flex-col">
          
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Interview Practice
          </h1>

          <div className="flex-1 flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              What do you want to practice?
            </label>
            
            {/* Text input - user types their question here */}
            <textarea 
              placeholder="Example: Help me prepare for a technical interview at a startup..."
              rows={8}
              className="w-full p-4 border-2 border-gray-300 rounded-lg mb-4 text-gray-800 resize-none"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)} // Update state as user types
            />
            
            {/* Submit button - triggers API call */}
            <button
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
              onClick={handleSubmit}
            >
              Generate Interview Prep
            </button>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE - Output area (scrollable independently) */}
      <div className="w-1/2 p-8 flex flex-col">
        {aiResponse ? (
          // Show AI response once it's available
          <div className="bg-white rounded-lg shadow-lg p-8 overflow-y-auto flex-1">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 sticky top-0 bg-white pb-4">
              AI Response
            </h2>
            {/* Display response with proper line breaks and spacing */}
            <div className="text-gray-800 whitespace-pre-line leading-relaxed space-y-4">
              {aiResponse}
            </div>
          </div>
        ) : (
          // Show placeholder when no response yet
          <div className="bg-white rounded-lg shadow-lg p-8 flex items-center justify-center">
            <p className="text-gray-400 text-center">
              Your AI response will appear here...
            </p>
          </div>
        )}
      </div>

    </div>
  );
}