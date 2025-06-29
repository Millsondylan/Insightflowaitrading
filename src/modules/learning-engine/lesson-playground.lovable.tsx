// TODO: implement interactive lesson playground
import React from 'react';

interface LessonPlaygroundProps {
  lessonId: string;
}

export const LessonPlayground: React.FC<LessonPlaygroundProps> = ({ lessonId }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [userCode, setUserCode] = React.useState('');
  const [testResults, setTestResults] = React.useState<any[]>([]);
  const [isRunning, setIsRunning] = React.useState(false);

  const lesson = {
    title: 'Building Your First Trading Strategy',
    steps: [
      {
        instruction: 'Define entry conditions using SMA crossover',
        starter: '// Define when price crosses above 20-period SMA\nentry_condition = ',
        solution: 'price > sma(20) AND price[1] <= sma(20)[1]',
        tests: ['Valid crossover detected', 'No false signals']
      },
      {
        instruction: 'Add volume confirmation',
        starter: '// Add volume filter to entry\nvolume_condition = ',
        solution: 'volume > average_volume * 1.5',
        tests: ['Volume spike detected', 'Filters low volume']
      },
      {
        instruction: 'Set stop loss and take profit',
        starter: '// Risk management rules\nstop_loss = \ntake_profit = ',
        solution: 'entry_price * 0.98\nentry_price * 1.03',
        tests: ['2% stop loss set', '3% take profit set']
      }
    ]
  };

  const runTests = () => {
    setIsRunning(true);
    // TODO: Connect to lessonNarrator AI block for validation
    setTimeout(() => {
      setTestResults([
        { name: lesson.steps[currentStep].tests[0], passed: true },
        { name: lesson.steps[currentStep].tests[1], passed: Math.random() > 0.3 }
      ]);
      setIsRunning(false);
    }, 1500);
  };

  const nextStep = () => {
    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setUserCode('');
      setTestResults([]);
    }
  };

  const progress = ((currentStep + 1) / lesson.steps.length) * 100;

  return (
    <Card style={{ padding: "24px" }}>
      <div >
        <h2 style={{ fontWeight: "700" }}>{lesson.title}</h2>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Progress value={progress}  />
          <span >
            Step {currentStep + 1} of {lesson.steps.length}
          </span>
        </div>
      </div>

      <div >
        <div>
          <h3 style={{ display: "flex", alignItems: "center" }}>
            <span style={{fontSize: '16px'}}>❓</span>
            {lesson.steps[currentStep].instruction}
          </h3>
          
          <div >
            <div>
              <label >Your Code:</label>
              <textarea
                style={{ width: "100%" }}
                value={userCode || lesson.steps[currentStep].starter}
                onChange={(e) => setUserCode(e.target.value)}
              />
            </div>

            <div style={{ display: "flex" }}>
              <Button onClick={runTests} disabled={isRunning} >
                <Play  />
                {isRunning ? 'Running...' : 'Run Tests'}
              </Button>
              <Button variant="outline" onClick={() => setUserCode('')}>
                <RotateCcw  />
                Reset
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h3 >Test Results</h3>
          
          {testResults.length > 0 ? (
            <div >
              {testResults.map((result, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg flex items-center gap-2 ${
                    result.passed
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-red-500/10 text-red-500'
                  }`}
                >
                  {result.passed ? (
                    <span style={{fontSize: '16px'}}>✅</span>
                  ) : (
                    <span style={{fontSize: '16px'}}>❌</span>
                  )}
                  <span >{result.name}</span>
                </div>
              ))}
              
              {testResults.every(r => r.passed) && (
                <Button onClick={nextStep} style={{ width: "100%" }}>
                  Continue to Next Step
                </Button>
              )}
            </div>
          ) : (
            <div style={{ padding: "32px" }}>
              <p>Run your code to see test results</p>
            </div>
          )}

          <div style={{ padding: "16px" }}>
            <h4 >Hint</h4>
            <p >
              Think about how to detect when price moves from below to above the moving average...
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}; 