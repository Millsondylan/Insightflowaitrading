import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth.tsx';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty: string;
  estimated_time: number;
  quiz_questions: QuizQuestion[];
  order_index: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

interface UserProgress {
  completed: boolean;
  quiz_score: number | null;
  completed_at: string | null;
}

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    if (id && user) {
      fetchLesson();
      fetchProgress();
    }
  }, [id, user]);

  const fetchLesson = async () => {
    try {
      const { data, error } = await supabase
        .from('academy_lessons')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setLesson(data);
    } catch (error) {
      console.error('Error fetching lesson:', error);
      toast({
        title: "Error",
        description: "Failed to load lesson",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', id)
        .single();

      if (!error && data) {
        setProgress(data);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleQuizSubmit = async () => {
    if (!lesson || !user) return;

    const questions = lesson.quiz_questions;
    let correctCount = 0;

    questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correct_answer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);

    // Save progress
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: id,
          completed: score >= 70, // Pass if 70% or higher
          quiz_score: score,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      if (score >= 70) {
        toast({
          title: "Congratulations!",
          description: `You passed with ${score}%! Keep up the great work.`,
        });
      } else {
        toast({
          title: "Keep trying!",
          description: `You scored ${score}%. Review the material and try again.`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const nextLesson = async () => {
    if (!lesson) return;

    try {
      const { data, error } = await supabase
        .from('academy_lessons')
        .select('id')
        .gt('order_index', lesson.order_index)
        .order('order_index', { ascending: true })
        .limit(1)
        .single();

      if (!error && data) {
        navigate(`/academy/lesson/${data.id}`);
      } else {
        navigate('/academy');
      }
    } catch (error) {
      navigate('/academy');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading lesson...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Lesson not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/academy')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant={lesson.difficulty === 'beginner' ? 'default' : lesson.difficulty === 'intermediate' ? 'secondary' : 'destructive'}>
                {lesson.difficulty}
              </Badge>
              <span className="text-muted-foreground">
                <BookOpen className="inline h-4 w-4 mr-1" />
                {lesson.estimated_time} min
              </span>
              {progress?.completed && (
                <Badge variant="outline" className="text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {!showQuiz ? (
        <Card>
          <CardHeader>
            <CardDescription>{lesson.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{lesson.content}</ReactMarkdown>
            </div>
            <div className="mt-8 flex justify-end">
              <Button onClick={() => setShowQuiz(true)}>
                Take Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Quiz</CardTitle>
            <CardDescription>
              Test your understanding of the lesson
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {lesson.quiz_questions.map((question, index) => (
              <div key={question.id} className="space-y-4">
                <div className="font-medium">
                  {index + 1}. {question.question}
                </div>
                <RadioGroup
                  value={quizAnswers[question.id]?.toString()}
                  onValueChange={(value) => setQuizAnswers({
                    ...quizAnswers,
                    [question.id]: parseInt(value)
                  })}
                  disabled={quizSubmitted}
                >
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem value={optionIndex.toString()} id={`${question.id}-${optionIndex}`} />
                      <Label 
                        htmlFor={`${question.id}-${optionIndex}`}
                        className={`cursor-pointer ${
                          quizSubmitted && optionIndex === question.correct_answer
                            ? 'text-green-600 font-medium'
                            : quizSubmitted && quizAnswers[question.id] === optionIndex && optionIndex !== question.correct_answer
                            ? 'text-red-600'
                            : ''
                        }`}
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {quizSubmitted && (
                  <div className="text-sm text-muted-foreground mt-2">
                    {quizAnswers[question.id] === question.correct_answer ? (
                      <div className="text-green-600">
                        <CheckCircle className="inline h-4 w-4 mr-1" />
                        Correct!
                      </div>
                    ) : (
                      <div>
                        <div className="text-red-600">
                          <XCircle className="inline h-4 w-4 mr-1" />
                          Incorrect
                        </div>
                        <div className="mt-1">{question.explanation}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {!quizSubmitted ? (
              <Button 
                onClick={handleQuizSubmit}
                className="w-full"
                disabled={Object.keys(quizAnswers).length < lesson.quiz_questions.length}
              >
                Submit Quiz
              </Button>
            ) : (
              <div className="space-y-4">
                <Card className={quizScore >= 70 ? 'border-green-600' : 'border-red-600'}>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {quizScore}%
                      </div>
                      <div className="text-muted-foreground mt-2">
                        {quizScore >= 70 ? 'You passed!' : 'Keep practicing'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowQuiz(false);
                      setQuizSubmitted(false);
                      setQuizAnswers({});
                    }}
                    className="flex-1"
                  >
                    Review Lesson
                  </Button>
                  <Button
                    onClick={nextLesson}
                    className="flex-1"
                  >
                    Next Lesson
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 