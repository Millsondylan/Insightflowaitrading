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
      <P>Technical analysis is a trading discipline employed to evaluate investments and identify trading opportunities by analyzing statistical trends gathered from trading activity, such as price movement and volume.</P>
      <P>Unlike fundamental analysis, which focuses on a company's financials to determine its value, technical analysis focuses on the study of price and volume.</P>
      <H3>Core Principles</H3>
      <Ul>
        <Li>Price reflects all available market information</Ul>
        <Li>Price movements are not completely random - they follow trends</Li>
        <Li>History tends to repeat itself - patterns are recurring</Li />
      `,
    },
    {
      id: "section-002",
      title: "Common Chart Patterns",
      content: `
      <H3>Reversal Patterns</Li>
      <P>These patterns signal that a prior trend may be ending and reversing:</P>
      <Ul>
        <Li>Double Top/Bottom</Ul>
        <Li>Head and Shoulders</Li>
        <Li>Triple Top/Bottom</Li>
        <Li>Rounding Bottom</Li />
      <H3>Continuation Patterns</Li>
      <P>These patterns suggest a pause in the current trend before continuing in the same direction:</P>
      <Ul>
        <Li>Flags and Pennants</Ul>
        <Li>Triangles (Ascending, Descending, Symmetrical)</Li>
        <Li>Rectangles</Li>
        <Li>Cup and Handle</Li />
      `,
      videoUrl: "https://youtu.be/watch?v=example123",
    },
    {
      id: "section-003",
      title: "Key Technical Indicators",
      content: `
      <P>Technical indicators are mathematical calculations based on price, volume, or open interest of a security.</Li>
      <H3>Trend Indicators</H3>
      <Ul>
        <Li>Moving Averages</Ul>
        <Li>MACD (Moving Average Convergence Divergence)</Li>
        <Li>ADX (Average Directional Index)</Li />
      <H3>Momentum Indicators</Li>
      <Ul>
        <Li>RSI (Relative Strength Index)</Ul>
        <Li>Stochastic Oscillator</Li>
        <Li>CCI (Commodity Channel Index)</Li />
      <H3>Volatility Indicators</Li>
      <Ul>
        <Li>Bollinger Bands</Ul>
        <Li>ATR (Average True Range)</Li />
      `,
      pdfUrl: "/resources/technical-indicators-cheatsheet.pdf",
      quizId: "quiz-001"
    }
  ],
  quizId: "quiz-001"
};

const LessonDemo = () => {
  return (
    <Div className="container mx-auto py-8 px-4">
      <LessonView lesson={sampleLesson} /></Li></Div></Div>
    </Div>
  );
};

export default LessonDemo;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 