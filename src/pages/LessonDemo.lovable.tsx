import * as React from "react";
import LessonView from "@/components/academy/LessonView";
import { LessonData } from "@/components/academy/LessonView";

// Sample lesson data
const sampleLesson: LessonData = {
  id: "lesson-001",
  title: "Introduction to Technical Analysis",
  description: "Learn the fundamentals of technical analysis and chart patterns for better trading decisions.",
  sections: [
    {
      id: "section-001",
      title: "What is Technical Analysis?",
      content: `
      <p>Technical analysis is a trading discipline employed to evaluate investments and identify trading opportunities by analyzing statistical trends gathered from trading activity, such as price movement and volume.</p>
      <p>Unlike fundamental analysis, which focuses on a company's financials to determine its value, technical analysis focuses on the study of price and volume.</p>
      <h3>Core Principles</h3>
      <ul>
        <li>Price reflects all available market information</li>
        <li>Price movements are not completely random - they follow trends</li>
        <li>History tends to repeat itself - patterns are recurring</li>
      </ul>
      `,
    },
    {
      id: "section-002",
      title: "Common Chart Patterns",
      content: `
      <h3>Reversal Patterns</h3>
      <p>These patterns signal that a prior trend may be ending and reversing:</p>
      <ul>
        <li>Double Top/Bottom</li>
        <li>Head and Shoulders</li>
        <li>Triple Top/Bottom</li>
        <li>Rounding Bottom</li>
      </ul>
      <h3>Continuation Patterns</h3>
      <p>These patterns suggest a pause in the current trend before continuing in the same direction:</p>
      <ul>
        <li>Flags and Pennants</li>
        <li>Triangles (Ascending, Descending, Symmetrical)</li>
        <li>Rectangles</li>
        <li>Cup and Handle</li>
      </ul>
      `,
      videoUrl: "https://youtu.be/watch?v=example123",
    },
    {
      id: "section-003",
      title: "Key Technical Indicators",
      content: `
      <p>Technical indicators are mathematical calculations based on price, volume, or open interest of a security.</p>
      <h3>Trend Indicators</h3>
      <ul>
        <li>Moving Averages</li>
        <li>MACD (Moving Average Convergence Divergence)</li>
        <li>ADX (Average Directional Index)</li>
      </ul>
      <h3>Momentum Indicators</h3>
      <ul>
        <li>RSI (Relative Strength Index)</li>
        <li>Stochastic Oscillator</li>
        <li>CCI (Commodity Channel Index)</li>
      </ul>
      <h3>Volatility Indicators</h3>
      <ul>
        <li>Bollinger Bands</li>
        <li>ATR (Average True Range)</li>
      </ul>
      `,
      pdfUrl: "/resources/technical-indicators-cheatsheet.pdf",
      quizId: "quiz-001"
    }
  ],
  quizId: "quiz-001"
};

const LessonDemo = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <lessonview  >
    </div>
  );
};

export default LessonDemo; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
