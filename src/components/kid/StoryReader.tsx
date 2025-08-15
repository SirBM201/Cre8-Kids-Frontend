import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { seedStories } from '../../data/seedData';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Home, BookOpen, Type } from 'lucide-react';

const StoryReader: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [currentPage, setCurrentPage] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');
  const [highlightedWord, setHighlightedWord] = useState<number>(-1);
  
  const story = seedStories.find(s => s.id === storyId);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (story) {
      // Add learning minutes when story is opened
      dispatch({ type: 'ADD_LEARNING_MINUTES', payload: 1 });
    }
  }, [story, dispatch]);

  useEffect(() => {
    // Cleanup speech synthesis on unmount
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Story Not Found</h1>
          <button
            onClick={() => navigate('/kid/stories')}
            className="btn-primary"
          >
            Back to Stories
          </button>
        </div>
      </div>
    );
  }

  const currentPageData = story.pages[currentPage];
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === story.pages.length - 1;

  const startReading = () => {
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(currentPageData.text);
    utterance.rate = 0.8; // Slightly slower for kids
    utterance.pitch = 1.1; // Slightly higher pitch
    utterance.volume = isMuted ? 0 : 1;
    
    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopReading = () => {
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    }
  };

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < story.pages.length) {
      setCurrentPage(pageIndex);
      setHighlightedWord(-1);
      stopReading();
    }
  };

  const nextPage = () => {
    if (!isLastPage) {
      goToPage(currentPage + 1);
    } else {
      // Story completed
      dispatch({ 
        type: 'COMPLETE_ITEM', 
        payload: { id: story.id, type: 'story', title: story.title }
      });
      dispatch({ type: 'ADD_LEARNING_MINUTES', payload: story.estimatedMinutes });
      
      // Show completion message
      alert(`🎉 Congratulations! You've finished "${story.title}"!`);
      navigate('/kid/stories');
    }
  };

  const previousPage = () => {
    if (!isFirstPage) {
      goToPage(currentPage - 1);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (utteranceRef.current) {
      utteranceRef.current.volume = !isMuted ? 0 : 1;
    }
  };

  const toggleTextSize = () => {
    setTextSize(textSize === 'normal' ? 'large' : 'normal');
  };

  const highlightWords = (text: string) => {
    const words = text.split(' ');
    return words.map((word, index) => (
      <span
        key={index}
        className={`transition-all duration-200 ${
          index === highlightedWord 
            ? 'bg-yellow-300 text-black px-1 rounded' 
            : ''
        }`}
      >
        {word}{' '}
      </span>
    ));
  };

  useEffect(() => {
    if (isReading && utteranceRef.current) {
      // Simulate word highlighting
      const words = currentPageData.text.split(' ');
      let wordIndex = 0;
      
      const highlightInterval = setInterval(() => {
        if (wordIndex < words.length) {
          setHighlightedWord(wordIndex);
          wordIndex++;
        } else {
          clearInterval(highlightInterval);
          setHighlightedWord(-1);
        }
      }, 800); // Highlight each word every 800ms

      return () => clearInterval(highlightInterval);
    }
  }, [isReading, currentPageData.text]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-primary-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/kid/stories')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Back to Stories</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTextSize}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition-colors"
            >
              <Type className="w-4 h-4" />
              <span className="text-sm font-medium">
                {textSize === 'normal' ? 'Large Text' : 'Normal Text'}
              </span>
            </button>
            
            <button
              onClick={toggleMute}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {isMuted ? 'Unmute' : 'Mute'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Story Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{story.title}</h1>
          <div className="flex items-center justify-center space-x-4 text-gray-600">
            <span>Page {currentPage + 1} of {story.pages.length}</span>
            <span>•</span>
            <span>Ages {story.ageBand}</span>
            <span>•</span>
            <span>{story.estimatedMinutes} min read</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-primary-100">
          <div className={`text-center ${
            textSize === 'large' ? 'text-2xl leading-relaxed' : 'text-xl leading-relaxed'
          }`}>
            {highlightWords(currentPageData.text)}
          </div>
          
          {/* Placeholder for story image */}
          <div className="mt-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🖼️</div>
            <p className="text-gray-600">Story illustration would appear here</p>
          </div>
        </div>

        {/* Reading Controls */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border-2 border-primary-100">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={previousPage}
              disabled={isFirstPage}
              className={`p-3 rounded-full transition-all duration-200 ${
                isFirstPage 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-110'
              }`}
            >
              <SkipBack className="w-6 h-6" />
            </button>

            <button
              onClick={isReading ? stopReading : startReading}
              className={`p-4 rounded-full transition-all duration-200 transform hover:scale-110 ${
                isReading 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isReading ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </button>

            <button
              onClick={nextPage}
              disabled={isLastPage}
              className={`p-3 rounded-full transition-all duration-200 ${
                isLastPage 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-110'
              }`}
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-2">
              {isReading ? 'Reading aloud...' : 'Click play to hear the story read to you!'}
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span>🎧</span>
              <span>Use the speaker button to hear each word clearly</span>
            </div>
          </div>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/kid/stories')}
            className="btn-secondary"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Stories
          </button>

          <div className="flex items-center space-x-2">
            {story.pages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentPage 
                    ? 'bg-blue-500' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextPage}
            disabled={isLastPage}
            className={`btn-primary ${
              isLastPage ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLastPage ? 'Finish Story' : 'Next Page'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryReader;
