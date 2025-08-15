import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Play, Pause } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
}

const QuizRunner: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { state } = useApp();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Mock quiz data - in a real app, this would come from an API or context
  const mockQuiz: Quiz = {
    id: quizId || '1',
    title: 'Fun Math Quiz',
    description: 'Let\'s practice some fun math problems!',
    difficulty: 'easy',
    timeLimit: 10,
    questions: [
      {
        id: '1',
        question: 'What is 2 + 3?',
        options: ['4', '5', '6', '7'],
        correctAnswer: 1,
        explanation: '2 + 3 = 5! Great job!'
      },
      {
        id: '2',
        question: 'How many sides does a triangle have?',
        options: ['2', '3', '4', '5'],
        correctAnswer: 1,
        explanation: 'A triangle has 3 sides!'
      },
      {
        id: '3',
        question: 'What comes after 5?',
        options: ['4', '6', '7', '8'],
        correctAnswer: 1,
        explanation: 'After 5 comes 6!'
      }
    ]
  };

  const currentQuestion = mockQuiz.questions[currentQuestionIndex];

  useEffect(() => {
    if (mockQuiz.timeLimit && !isPaused) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null) return mockQuiz.timeLimit! * 60;
          if (prev <= 1) {
            handleQuizComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isPaused, mockQuiz.timeLimit]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestionIndex < mockQuiz.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        handleQuizComplete();
      }
    }, 2000);
  };

  const handleQuizComplete = () => {
    setQuizCompleted(true);
    // Update learning minutes in the app context
    // This would typically update the focusBeforeFun state
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (quizCompleted) {
    const percentage = Math.round((score / mockQuiz.questions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            {percentage >= 80 ? (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-blue-600" />
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
            <p className="text-gray-600 mb-4">Great job completing the quiz!</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <div className="text-4xl font-bold text-primary-600 mb-2">{percentage}%</div>
            <div className="text-gray-600">
              You got {score} out of {mockQuiz.questions.length} questions correct!
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/kid/quizzes')}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-2xl font-semibold text-lg transition-colors"
            >
              Try Another Quiz
            </button>
            <button
              onClick={() => navigate('/kid')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-2xl font-semibold text-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/kid/quizzes')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Quizzes
            </button>

            <div className="flex items-center gap-4">
              {/* Timer */}
              {timeLeft !== null && (
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-gray-700">
                    {formatTime(timeLeft)}
                  </span>
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {/* Progress */}
              <div className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {mockQuiz.questions.length}
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <h1 className="text-2xl font-bold text-gray-800">{mockQuiz.title}</h1>
            <p className="text-gray-600">{mockQuiz.description}</p>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  selectedAnswer === index
                    ? showResult
                      ? index === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index
                      ? showResult
                        ? index === currentQuestion.correctAnswer
                          ? 'border-green-500 bg-green-500'
                          : 'border-red-500 bg-red-500'
                        : 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === index && (
                      <span className="text-white text-sm font-bold">
                        {index === currentQuestion.correctAnswer ? '✓' : '✗'}
                      </span>
                    )}
                  </div>
                  <span className="text-gray-800 font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Submit Button */}
          {!showResult && selectedAnswer !== null && (
            <div className="mt-6 text-center">
              <button
                onClick={handleSubmitAnswer}
                className="bg-primary-500 hover:bg-primary-600 text-white py-3 px-8 rounded-xl font-semibold text-lg transition-colors"
              >
                Submit Answer
              </button>
            </div>
          )}

          {/* Result Display */}
          {showResult && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <span className={`font-semibold ${
                  selectedAnswer === currentQuestion.correctAnswer ? 'text-green-600' : 'text-red-600'
                }`}>
                  {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              {currentQuestion.explanation && (
                <p className="text-gray-700">{currentQuestion.explanation}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizRunner;
