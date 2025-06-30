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
        <li>Price reflects all available market information</ul>
        <li>Price movements are not completely random - they follow trends</li>
        <li>History tends to repeat itself - patterns are recurring</Li />
      `,
    },
    {
      id: "section-002",
      title: "Common Chart Patterns",
      content: `
      <h3>Reversal Patterns</li>
      <p>These patterns signal that a prior trend may be ending and reversing:</p>
      <ul>
        <li>Double Top/Bottom</ul>
        <li>Head and Shoulders</li>
        <li>Triple Top/Bottom</li>
        <li>Rounding Bottom</Li />
      <h3>Continuation Patterns</li>
      <p>These patterns suggest a pause in the current trend before continuing in the same direction:</p>
      <ul>
        <li>Flags and Pennants</ul>
        <li>Triangles (Ascending, Descending, Symmetrical)</li>
        <li>Rectangles</li>
        <li>Cup and Handle</Li />
      `,
      videoUrl: "https://youtu.be/watch?v=example123",
    },
    {
      id: "section-003",
      title: "Key Technical Indicators",
      content: `
      <p>Technical indicators are mathematical calculations based on price, volume, or open interest of a security.</li>
      <h3>Trend Indicators</h3>
      <ul>
        <li>Moving Averages</ul>
        <li>MACD (Moving Average Convergence Divergence)</li>
        <li>ADX (Average Directional Index)</Li />
      <h3>Momentum Indicators</li>
      <ul>
        <li>RSI (Relative Strength Index)</ul>
        <li>Stochastic Oscillator</li>
        <li>CCI (Commodity Channel Index)</Li />
      <h3>Volatility Indicators</li>
      <ul>
        <li>Bollinger Bands</ul>
        <li>ATR (Average True Range)</Li />
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
      <Lessonview ></li></div>
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
