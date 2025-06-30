import React from 'react';
import './App.css';

const SimpleApp = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">InsightFlow AI Trading</h1>
      <p className="text-xl mb-8">This is a simplified version for debugging</p>
      
      <div className="p-6 bg-gray-800 rounded-lg max-w-md">
        <h2 className="text-2xl font-bold mb-4">Status</h2>
        <p>React is working correctly if you can see this content.</p>
        
        <div className="mt-6">
          <button 
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            onClick={() => alert('Button click works!')}
          >
            Click to Test Interactivity
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleApp; 