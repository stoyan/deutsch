import React, { Component } from 'react';
import './App.css';

import deutsch from '../public/deutsch/json/deutsch.json';

const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

let term;

function justLetters(s) {
  return s
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')  
    .replace(/ü/g, 'o')
    .replace(/\W/g, '');
}

function getQuestion(i) {
  term = deutsch[Math.floor(Math.random() * deutsch.length)];
  return <div><h3>{term[0]}</h3></div>;
}

function getAnswer(i) {
  return (
    <div>
      <p><strong>{term[0]}</strong></p>
      <p>{term[1]}</p>
    </div>
  );
}

function getAudio() {  
  const word = justLetters(term[0]);
  return [
    new Audio(`deutsch/voices/Anna/${word}.mp3`),
    new Audio(`deutsch/voices/Markus/${word}.mp3`),
    new Audio(`deutsch/voices/Petra/${word}.mp3`),
    new Audio(`deutsch/voices/Yannick/${word}.mp3`),
  ];
}

// the actual quiz is done, boring stuff follows...

class App extends Component {
  constructor() {
    super();
    this.state = {
      question: getQuestion(1),
      answer: getAnswer(1),
      i: 1,
      audio: getAudio(1),
      pause: false,
    };
    window.addEventListener('keydown', (e) => {
      // space bar
      if (e.keyCode === 32 || e.charCode === 32) {
        e.preventDefault();
        this.say();
      }
      // p and P
      if (e.keyCode === 112 || e.charCode === 112 || e.keyCode === 80 || e.charCode === 80) {
        e.preventDefault();
        this.say();
      }
      // right arrow
      if (e.keyCode === 39 || e.charCode === 39) {
        e.preventDefault();
        this.nextQuestion();
      }
      // n and N
      if (e.keyCode === 110 || e.charCode === 110 || e.keyCode === 78 || e.charCode === 78) {
        e.preventDefault();
        this.nextQuestion();
      }
    });
  }
  
  nextQuestion() {
    this.pause();
    this.setState({
      question: getQuestion(this.state.i + 1),
      answer: getAnswer(this.state.i + 1),
      i: this.state.i + 1,
      audio: getAudio(this.state.i + 1),
    });
  }
  
  pause() {    
    for (const note of this.state.audio) {
      note.pause();
      note.currentTime = 0;
    }
    this.setState({pause: true});
  }

  say() {
    this.pause();
    this.setState({pause: false});
    this.state.audio[Math.floor(Math.random() * this.state.audio.length)].play();    
  }
    
  render() {
    return (
      <div>
        <Flashcard 
          question={this.state.question}
          answer={this.state.answer}
        />
        <button 
          className="playButton" 
          onMouseDown={this.say.bind(this)}>
          {iOS ? 'say' : '▶'}
        </button>
        {' '}
        <button 
          className="nextButton" 
          onClick={this.nextQuestion.bind(this)}>
          next...
        </button>
      </div>
    );
  }
}

class Flashcard extends Component {

  constructor() {
    super();
    this.state = {
      reveal: false,
    };
    window.addEventListener('keydown', (e) => {
      // arrows
      if (e.keyCode === 38 || e.charCode === 38 || e.keyCode === 40 || e.charCode === 40) {
        this.flip();
      }
      // f and F
      if (e.keyCode === 102 || e.charCode === 102 || e.keyCode === 70 || e.charCode === 70) {
        this.flip();
      }
    });
  }

  componentWillReceiveProps() {
    this.setState({reveal: false});
  }

  flip() {
    this.setState({
      reveal: !this.state.reveal,
    });
  }

  render() {
    const className = "card flip-container" + (this.state.reveal ? ' flip' : '');
    return (
      <div><center>
        <div className={className} onClick={this.flip.bind(this)}>
          <div className="flipper">
            <div className="front" style={{display: this.state.reveal ? 'none' : ''}}>
              {this.props.question}
            </div>
            <div className="back" style={{display: this.state.reveal ? '' : 'none'}}>
              {this.props.answer}
            </div>
          </div>
        </div>
        <button className="answerButton" onClick={this.flip.bind(this)}>flip</button>
      </center></div>
    );
  }
}

export default App;

