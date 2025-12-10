'use client'  // This line is needed for Next.js

import { useState } from 'react';

export default function Home (){
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  return(
    <div>
      <h1>Interview Practice App</h1>
      <textarea 
        placeholder="What do you want to practice?"
        rows={5}
        className="w-full p-4 border-2 border-gray-300 rounded-lg mb-4"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      
      <button>Generate Interview Question</button>
    </div>
  );
}

