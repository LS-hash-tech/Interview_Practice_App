'use client'

import { useState } from 'react';

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      alert('Please enter a question!');
      return;
    }

    setAiResponse('Generating response...');

    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });

      const data = await response.json();
      
      if (data.error) {
        setAiResponse('Error: ' + data.error);
      } else {
        setAiResponse(data.response);
      }
      
    } catch (error) {
      setAiResponse('Failed to connect to AI. Please try again.');
    }
  };

 return (
  <div className="h-screen bg-blue-50 flex overflow-hidden">
    
    {/* LEFT SIDE - Input (Fixed, Not Scrollable) */}
    <div className="w-1/2 p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 h-full flex flex-col">
        
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Interview Practice
        </h1>

        <div className="flex-1 flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-2">
            What do you want to practice?
          </label>
          
          <textarea 
            placeholder="Example: Help me prepare for a technical interview at a startup..."
            rows={8}
            className="w-full p-4 border-2 border-gray-300 rounded-lg mb-4 text-gray-800 resize-none"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          
          <button
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            onClick={handleSubmit}
          >
            Generate Interview Prep
          </button>
        </div>

      </div>
    </div>

    {/* RIGHT SIDE - Output (Scrollable) */}
    <div className="w-1/2 p-8 flex flex-col">
      {aiResponse ? (
        <div className="bg-white rounded-lg shadow-lg p-8 overflow-y-auto flex-1">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 sticky top-0 bg-white pb-4">
            AI Response
          </h2>
          <div className="text-gray-800 whitespace-pre-line leading-relaxed space-y-4">
            {aiResponse}
          </div>
        </div>
      ) : (
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