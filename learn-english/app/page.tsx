"use client";

import { useState } from 'react';

// Text component to display the speaking practice text
const SpeakingText = ({ text }: { text: string }) => {
  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col gap-4">
        <p className="text-lg font-medium text-blue-700 border-l-4 border-blue-500 pl-3">
          {text}
        </p>
      </div>
    </section>
  );
};

// Speaking button component
const SpeakButton = ({ onSpeak }: { onSpeak: () => void }) => {
  return (
    <div className="flex justify-center mb-6">
      <button 
        onClick={onSpeak}
        className="bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-700 transition flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        <span className="font-medium">Speak Now</span>
      </button>
    </div>
  );
};

// Feedback component to display speaking evaluation
const SpeakingFeedback = ({ 
  speechText, 
  score, 
  feedback 
}: { 
  speechText: string, 
  score: number, 
  feedback: string[] 
}) => {
  return (
    <div>
      {/* Recognition Result */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-600 mb-2">Your Speech:</h3>
        <p className="p-3 bg-gray-50 rounded border border-gray-200">
          {speechText}
        </p>
      </div>
      
      {/* Pronunciation Score */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Pronunciation Score:</h3>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${star <= score ? 'text-yellow-500' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-lg font-medium text-gray-700">{score}.0/5.0</span>
        </div>
        
        {/* Feedback */}
        <div className="bg-blue-50 p-3 rounded border border-blue-100">
          <h4 className="text-sm font-medium text-blue-700 mb-1">Feedback:</h4>
          <ul className="text-sm text-blue-600 list-disc pl-4">
            {feedback.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default function Home() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const speechTexts = [
    "What are your plans for the weekend?",
    "Could you tell me how to get to the nearest subway station?",
    "I'd like to order a coffee with milk, please.",
    "The weather is beautiful today, isn't it?",
    "Can you recommend a good restaurant in this area?"
  ];
  const [userSpeech, setUserSpeech] = useState("");
  const [score, setScore] = useState(4);
  const [feedback, setFeedback] = useState([
    "Great intonation on the question!",
    "Try to emphasize \"weekend\" a bit more."
  ]);

  const handlePrevText = () => {
    setCurrentTextIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : speechTexts.length - 1
    );
  };

  const handleNextText = () => {
    setCurrentTextIndex((prevIndex) => 
      (prevIndex + 1) % speechTexts.length
    );
  };

  // Function to handle speech recognition (not implemented)
  const handleSpeak = () => {
    // This would contain the actual speech recognition logic
    console.log("Speech recognition triggered");
    
    // For demo purposes, we're just using the static values
    // In a real implementation, this would update with actual speech recognition results
    setUserSpeech(speechTexts[currentTextIndex]);
  };

  return (
    <main className="min-h-screen max-w-4xl mx-auto p-4 flex flex-col">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-blue-600">English Learning Assistant</h1>
      </header>

      {/* Text to speak with navigation */}
      <div className="relative">
        <SpeakingText text={speechTexts[currentTextIndex]} />
        <div className="absolute inset-y-0 left-0 flex items-center">
          <button 
            onClick={handlePrevText}
            className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button 
            onClick={handleNextText}
            className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Speaking Practice Section */}
      <section className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Speaking Practice</h2>
        
        {/* Speaking Button */}
        <SpeakButton onSpeak={handleSpeak} />
        
        {/* Feedback Component */}
        {userSpeech && (
          <SpeakingFeedback 
            speechText={userSpeech} 
            score={score} 
            feedback={feedback} 
          />
        )}
      </section>

      {/* Settings Bar */}
      <section className="flex justify-between text-sm text-gray-500">
        <button className="flex items-center gap-1 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <span>Dark Mode</span>
        </button>
        
        <div className="flex items-center gap-2">
          <button className="hover:text-gray-700">A-</button>
          <span>Font Size</span>
          <button className="hover:text-gray-700">A+</button>
        </div>
      </section>
    </main>
  );
}
