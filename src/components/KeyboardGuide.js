// src/components/KeyboardGuide.js
import React from 'react';

const keyboardLayout = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  ['space']
];

const homeRowFingerMap = {
  'a': 'Left Pinky', 's': 'Left Ring', 'd': 'Left Middle', 'f': 'Left Index',
  'j': 'Right Index', 'k': 'Right Middle', 'l': 'Right Ring', ';': 'Right Pinky',
  'g': 'Left Index', 'h': 'Right Index',
  'e': 'Left Middle', 'i': 'Right Middle', 'r': 'Left Index', 'u': 'Right Index',
  ' ': 'Thumb (Either)'
};

const KeyboardGuide = ({ currentLesson }) => {
  // --- START FIX ---
  if (!currentLesson || !currentLesson.text || !currentLesson.targetKeys) {
    // console.warn("KeyboardGuide rendered without a valid currentLesson prop.");
    return <div>Loading keyboard guide...</div>; // Or null or some placeholder
  }
  // --- END FIX ---

  const { targetKeys, text } = currentLesson;
  // Check if text is not empty before accessing text[0]
  const currentCharacter = text && text.length > 0 ? text[0].toLowerCase() : null;

  let fingerTip = "";
  if (currentCharacter && homeRowFingerMap[currentCharacter]) {
    fingerTip = `Use your ${homeRowFingerMap[currentCharacter]} for '${currentCharacter.toUpperCase()}'`;
  } else if (targetKeys && targetKeys.length > 0 && targetKeys[0] && homeRowFingerMap[targetKeys[0]]) {
    fingerTip = `Focus on ${targetKeys.join(', ').toUpperCase()}! Try ${homeRowFingerMap[targetKeys[0]]} for '${targetKeys[0].toUpperCase()}'`;
  }

  return (
    <div className="keyboard-guide">
      <h3>Keyboard Helper</h3>
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map(key => {
            const keyLower = key.toLowerCase();
            const isHighlighted = (targetKeys && targetKeys.includes(keyLower)) || keyLower === currentCharacter;
            const isSpace = keyLower === 'space';
            return (
              <div
                key={key}
                className={`key ${isHighlighted ? 'highlight' : ''} ${isSpace ? 'space' : ''}`}
              >
                {isSpace ? 'SPACE' : key.toUpperCase()}
              </div>
            );
          })}
        </div>
      ))}
      {fingerTip && <p className="finger-guide-info">{fingerTip}</p>}
    </div>
  );
};

export default KeyboardGuide;