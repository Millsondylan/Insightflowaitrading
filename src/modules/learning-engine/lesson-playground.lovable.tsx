// TODO: implement interactive lesson playground
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, RotateCcw, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface LessonPlaygroundProps {
  lessonId: string;
}

export const LessonPlayground: React.FC<Lessonplaygroundprops > = ({ lessonId }) => {
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
    <Card  />
      <Div className="mb-6">
        <H2 className="text-2xl font-bold mb-2">{lesson.title}</Lessonplaygroundprops>
        <Div className="flex items-center gap-4">
          <Progress >
          <Span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {lesson.steps.length}
          </Div>
        </Div>
      </Div>

      <Div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Div>
          <H3 className="font-semibold mb-3 flex items-center gap-2">
            <Helpcircle  />
            {lesson.steps[currentStep].instruction}
          </Div>
          
          <Div className="space-y-4">
            <Div>
              <Label className="text-sm text-muted-foreground">Your Code:</Div>
              <Textarea
                className="w-full h-32 p-3 mt-1 bg-secondary/20 rounded-lg font-mono text-sm"
                value={userCode || lesson.steps[currentStep].starter}
                onChange={(e) => setUserCode(e.target.value)}
              />
            </Textarea>

            <Div className="flex gap-2">
              <Button >
                <play >
                {isRunning ? 'Running...' : 'Run Tests'}
              </Div>
              <Button variant="outline"> setUserCode('')}>
                <rotateccw >
                Reset
              </Button>
            </Div>
          </Div>
        </Div>

        <Div>
          <H3 className="font-semibold mb-3">Test Results</Div>
          
          {testResults.length > 0 ? (
            <Div className="space-y-2">
              {testResults.map((result, i) => (
                <Div key={i}
                  className={`p-3 rounded-lg flex items-center gap-2 ${
                    result.passed
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-red-500/10 text-red-500'
                  }`}
               >
                  {result.passed ? (
                    <checkcircle >
                  ) : (
                    <xcircle >
                  )}
                  <Span className="text-sm">{result.name}</Div>
                </Div>
              ))}
              
              {testResults.every(r => r.passed) && (
                <Button  style={{ width: "100%" }}>
                  Continue to Next Step
                </Button>
              )}
            </Div>
          ) : (
            <Div className="p-8 text-center text-muted-foreground">
              <P>Run your code to see test results</Div>
            </Div>
          )}

          <Div className="mt-6 p-4 bg-secondary/20 rounded-lg">
            <H4 className="font-medium mb-2">Hint</Div>
            <P className="text-sm text-muted-foreground">
              Think about how to detect when price moves from below to above the moving average...
            </P>
          </Div>
        </Div>
      </Div>
    </Card>
  );
}; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
