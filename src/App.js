// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import LessonSelector from './components/LessonSelector';
import TypingArea from './components/TypingArea';
import AnimatedCharacter from './components/AnimatedCharacter';
import KeyboardGuide from './components/KeyboardGuide';
import { lessons } from './lessons';

function App() {
  // --- START FIX ---
  // Safer initialization for currentLessonId
  const [currentLessonId, setCurrentLessonId] = useState(
    lessons && lessons.length > 0 ? lessons[0].id : null
  );
  // --- END FIX ---

  const [characterMood, setCharacterMood] = useState('thinking');
  const [lessonStats, setLessonStats] = useState(null);

  // --- START FIX ---
  // Derive currentLesson safely
  const currentLesson = currentLessonId !== null
    ? lessons.find(l => l.id === currentLessonId)
    : null;
  // --- END FIX ---

  const handleSelectLesson = (lessonId) => {
    setCurrentLessonId(lessonId);
    setLessonStats(null);
    setCharacterMood('thinking');
  };

  const handleLessonComplete = (stats, nextLessonTrigger = false) => {
    if (stats) {
      setLessonStats(stats);
      setCharacterMood('happy');
    }
    if (nextLessonTrigger) {
      const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
      if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
        setCurrentLessonId(lessons[currentIndex + 1].id);
      } else if (lessons.length > 0) { // If at the end, or no current lesson somehow
        alert("🎉 You've completed all lessons! Great job! Or starting over.");
        setCurrentLessonId(lessons[0].id); // Restart or go to the first lesson
      } else {
        // No lessons available
        alert("No lessons available to proceed.");
        setCurrentLessonId(null);
      }
      setLessonStats(null);
      setCharacterMood('thinking');
    }
  };

  return (
    <div className="App">
      <Header />
      <LessonSelector
        onSelectLesson={handleSelectLesson}
        currentLessonId={currentLessonId}
      />
      <AnimatedCharacter mood={characterMood} />
      {/* The guard below is important: only render TypingArea if currentLesson is valid */}
      {currentLesson ? (
        <TypingArea
          key={currentLesson.id} // Key ensures component re-mounts on lesson change
          lesson={currentLesson}
          onLessonComplete={handleLessonComplete}
          setCharacterMood={setCharacterMood}
        />
      ) : (
        <p>Please select a lesson, or no lessons are currently available.</p>
      )}
      {/* Similarly guard KeyboardGuide */}
      {currentLesson && <KeyboardGuide currentLesson={currentLesson} />}
    </div>
  );
}

export default App;