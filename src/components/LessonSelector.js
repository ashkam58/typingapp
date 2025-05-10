// src/components/LessonSelector.js
import React from 'react';
import { lessons } from '../lessons';

const LessonSelector = ({ onSelectLesson, currentLessonId }) => {
  return (
    <div className="lesson-selector">
      <h2>Choose a Lesson:</h2>
      {lessons.map(lesson => (
        <button
          key={lesson.id}
          onClick={() => onSelectLesson(lesson.id)}
          className={currentLessonId === lesson.id ? 'active' : ''}
        >
          {lesson.id}. {lesson.title}
        </button>
      ))}
    </div>
  );
};

export default LessonSelector;