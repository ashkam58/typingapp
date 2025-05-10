// src/components/AnimatedCharacter.js
import React from 'react';

// You could use actual images here by importing them
// import happyCharImg from '../assets/happy_char.png';
// import oopsCharImg from '../assets/try_again_char.png';

const AnimatedCharacter = ({ mood }) => { // mood can be 'thinking', 'happy', 'oops'
  let moodText = "Let's Type!";
  if (mood === 'happy') moodText = "Great Job! 🎉";
  if (mood === 'oops') moodText = "Oops, try again! 🧐";

  return (
    <div className={`animated-character ${mood}`}>
      <p style={{margin: 'auto', paddingTop: '35px', fontWeight:'bold'}}>{moodText}</p>
    </div>
  );
};

export default AnimatedCharacter;