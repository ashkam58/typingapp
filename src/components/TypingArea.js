// src/components/TypingArea.js
import React, { useState, useEffect, useRef, useCallback } from 'react';

const TypingArea = ({ lesson, onLessonComplete, setCharacterMood }) => {
  // --- SECTION 1: HOOKS ---
  // All hook calls must be at the top level, unconditionally.

  // State Hooks
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isComplete, setIsComplete] = useState(false);

  // Ref Hooks
  const inputRef = useRef(null);

  // Callback Hooks
  const handleKeyDown = useCallback((e) => {
    if (isComplete) return; // Internal condition is fine
    if (e.key === 'Backspace') {
      e.preventDefault();
    }
  }, [isComplete]); // Dependencies for useCallback

  // Effect Hooks
  useEffect(() => {
    // Logic to handle focus
    if (lesson && inputRef.current && !isComplete) {
      inputRef.current.focus();
    }
  }, [lesson, isComplete]);

  useEffect(() => {
    // Reset state when lesson changes.
    if (lesson) {
      setTypedText('');
      setCurrentIndex(0);
      setErrorCount(0);
      setStartTime(null);
      setWpm(0);
      setAccuracy(100);
      setIsComplete(false);
      setCharacterMood('thinking');
      if (inputRef.current) inputRef.current.value = '';
    }
    // No 'else' needed here that would affect hook calls from other branches
  }, [lesson, setCharacterMood]);


  // --- SECTION 2: CONDITIONAL EARLY RETURN ---
  // This check now comes AFTER all hook calls.
  if (!lesson) {
    console.warn("TypingArea: No lesson provided, rendering placeholder.");
    return <p>Loading lesson details or please select a lesson to start!</p>;
  }

  // --- SECTION 3: DERIVED VALUES & REGULAR FUNCTIONS ---
  // If we reach here, `lesson` is defined.
  const { text: textToType, instructions } = lesson;

  // Regular function (not a hook, so its definition here is fine)
  // If this function needed to be memoized with useCallback, it would go in SECTION 1.
  const handleInputChange = (e) => {
    if (isComplete || !textToType) return;

    const fullInput = e.target.value;
    const typedChar = fullInput.slice(-1);

    if (!startTime && typedChar) { // Only start timer on actual input
      setStartTime(Date.now());
    }

    // If no character was typed (e.g., only modifier keys, or empty input), do nothing further
    if (!typedChar && e.target.value === '') {
        e.target.value = ''; // Ensure input is cleared
        return;
    }


    let newTypedText = typedText;
    let newErrorCount = errorCount;
    let newCurrentIndex = currentIndex;

    if (currentIndex < textToType.length) {
      if (typedChar === textToType[currentIndex]) {
        newTypedText += typedChar;
        newCurrentIndex++;
        setTypedText(newTypedText);
        setCurrentIndex(newCurrentIndex);
        setCharacterMood('happy');
      } else if (typedChar) { // An incorrect character was typed
        newErrorCount++;
        setErrorCount(newErrorCount);
        setCharacterMood('oops');
        // NOTE: currentIndex does not advance on error. typedText also does not advance.
      }

      // Live Accuracy Calculation (using updated values for immediate feedback)
      const totalInputsMade = newTypedText.length + newErrorCount; // Correct chars + errors
      const liveAcc = totalInputsMade > 0 ? (newTypedText.length / totalInputsMade) * 100 : 100;
      setAccuracy(parseFloat(liveAcc.toFixed(2)));

      // Lesson Completion Check
      if (newCurrentIndex === textToType.length) { // Check against newCurrentIndex
        setIsComplete(true);
        const endTime = Date.now();
        // Ensure startTime is not null to prevent NaN, though it should be set by now
        const timeTakenSeconds = startTime ? (endTime - startTime) / 1000 : 0;
        let calculatedWpm = 0;

        if (timeTakenSeconds > 0) {
            const charactersTyped = textToType.length; // Use full length of target text
            calculatedWpm = Math.round((charactersTyped / 5) / (timeTakenSeconds / 60));
        } else if (textToType.length > 0) { // Fallback for very short text/time
            const charactersTyped = textToType.length;
            calculatedWpm = Math.round((charactersTyped / 5) / (1/60)); // Assume 1 second if time is negligible
        }
        
        setWpm(calculatedWpm < 0 ? 0 : calculatedWpm);

        // Final accuracy calculation based on final state
        const finalTotalInputs = newTypedText.length + newErrorCount;
        const finalAccuracy = finalTotalInputs > 0 ? (newTypedText.length / finalTotalInputs) * 100 : 100;

        onLessonComplete({
            wpm: calculatedWpm < 0 ? 0 : calculatedWpm,
            accuracy: parseFloat(finalAccuracy.toFixed(2)),
            errors: newErrorCount // Use the latest error count
        });
        setCharacterMood('happy');
      }
    }
    // Always clear the physical input field after processing the character
    e.target.value = '';
  };

  const getCharClass = (charIndex) => {
    // This function determines class based on current state for display
    if (charIndex < currentIndex) {
      return 'correct'; // Assumes if currentIndex has passed it, it was typed correctly
    }
    if (charIndex === currentIndex) {
      return 'current';
    }
    return 'pending';
  };


  // --- SECTION 4: JSX RETURN ---
  return (
    <div className="typing-area" onClick={() => inputRef.current && inputRef.current.focus()}>
      <h3>{lesson.title}</h3>
      {instructions && <p className="instructions">💡 {instructions}</p>}

      <div className="text-to-type">
        {textToType.split('').map((char, index) => (
          <span key={index} className={getCharClass(index)}>
            {char === ' ' && getCharClass(index) === 'current' ? '␣' : char}
          </span>
        ))}
      </div>

      <input
        ref={inputRef}
        type="text"
        className="hidden-input"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // handleKeyDown is now correctly defined before this point
        autoFocus
        disabled={isComplete}
      />

      {!isComplete && (
        <div className="stats">
          <p>Errors: {errorCount}</p>
          <p>Accuracy: {accuracy.toFixed(1)}%</p>
        </div>
      )}

      {isComplete && (
        <div className="lesson-complete">
          <h2>Lesson Complete! ✨</h2>
          <p>Your Speed: {wpm} WPM</p>
          <p>Accuracy: {accuracy.toFixed(1)}%</p>
          <p>Mistakes: {errorCount}</p>
          <button onClick={() => {
            onLessonComplete(null, true); // Signal to pick next lesson
          }}>
            Next Lesson / Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default TypingArea;