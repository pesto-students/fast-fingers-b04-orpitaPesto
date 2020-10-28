// import * as data from '../data/dictionary.json';
const data = fetch("../data/dictionary.json")
.then(response => {
   return response.json();
})
.then(data => console.log(data));
const player = document.getElementById('name');
const level = document.getElementById('level');
const wordLabel = document.getElementById('word');
const selectedLevel = sessionStorage.getItem('Level');
const restart = document.getElementById('restart');
const stop = document.getElementById('stop');
let wordInputElement = document.getElementById('input-word'); 
let currentLevel = '';
let difficulty = 0;
let currentWord = '';
let score = 0;
let totalTime = 0; 
let TIME_LIMIT = 30;
window.onload = function() {
    currentLevel = selectedLevel;
    getDifficultyLevel();
    createText();
   if( sessionStorage.getItem('CurrentUser') === '') {
    window.location.href="index.html"; 
   }
   else{
    player.innerHTML = sessionStorage.getItem('CurrentUser');
    level.innerHTML = selectedLevel;
   }
   timerApp();
  };
  String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours + ':' + minutes + ':' + seconds;
}
function getWord(start, end)
{
    let item = '';
    if(end === undefined)
    {
        while(item.length < start)
        {
            item = data[Math.floor(Math.random()*data.length)];
        }
    }
    else{
        while(item.length < start || item.length >end)
        {
            item = data[Math.floor(Math.random()*data.length)];
        }
    }
    return item;
}

function getDifficultyLevel(){
    switch(selectedLevel){
        case 'EASY': 
            difficulty = 1;
            break;
        case 'MEDIUM': 
            difficulty = 1.5;
            break;
        case 'DIFFICULT': 
            difficulty = 2;
            break;
        
    }
    

    // Timer value = (Number of letters in the word) / (Difficulty factor)


}

function createText()
{
  let item = '';
  if(difficulty === 1 || difficulty < 1.5)
    {
            item = getWord(1,4);
    }
    else if(difficulty === 1.5 || difficulty < 2)
    {
            item = getWord(5,8);
    } else if(difficulty >= 2){
            item = getWord(9);
    }
    currentWord =item;
    let htmlString = '';
    for(let i=1; i< (item.length+1); i++)
    {
        htmlString += "<span id='" +i +"'>"+ item[i-1] + "</span>";
    }
    
    wordLabel.innerHTML = htmlString;
    TIME_LIMIT = Math.ceil(currentWord.length/difficulty);
    console.log('TIME_LIMIT', TIME_LIMIT);
    timePassed = 0;
    timeLeft = TIME_LIMIT;
    timerInterval = null;
    remainingPathColor = COLOR_CODES.info.color;
    timerApp();
    startTimer();
}
    // wordLabel.innerHTML = item;
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};


let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;
function timerApp(){
  document.getElementById("app").innerHTML = `
  <div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
        <path
          id="base-timer-path-remaining"
          stroke-dasharray="283"
          class="base-timer__path-remaining ${remainingPathColor}"
          d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
          "
        ></path>
      </g>
    </svg>
    <span id="base-timer-label" class="base-timer__label">${formatTime(
      timeLeft
    )}</span>
  </div>
  `;
}



function onTimesUp() {
  clearInterval(timerInterval);
  restart.style.display = "block";
  stop.style.display = "none";
  wordInputElement.readOnly = true;
  populateScoreBoard();
}

function startTimer() {
  timerInterval = setInterval(() => {
    if (timeLeft === 0) {
      onTimesUp();
    }
    else{
      timePassed = timePassed += 1;
      timeLeft = TIME_LIMIT - timePassed;
      document.getElementById("base-timer-label").innerHTML = formatTime(
        timeLeft
      );
      setCircleDasharray();
      setRemainingPathColor();
        console.log('timeLeft :', timeLeft)
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

function setRemainingPathColor() {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

const logout = document.getElementById('logout');
logout.addEventListener("click", () => {
    sessionStorage.setItem('CurrentUser', '');
    window.location.href="index.html"; 
    console.log('logout')
});
let scorelist = [];
let success = false;
wordInputElement.addEventListener("keyup", function () {
    console.log(wordInputElement.value);
    let keyBoardValue = wordInputElement.value;
    
    for(let i=1; i< (keyBoardValue.length+1); i++)
    {
      if(keyBoardValue[i-1] === currentWord[i-1])
      {
        document.getElementById(i).className = 'success';
        success = true;
      }
      else{
        document.getElementById(i).className = 'fail';
        success = false;
      }
    }
    if(keyBoardValue.length === currentWord.length && success)
    {
      score += timePassed;
      console.log(timePassed);
      document.getElementById('score').innerHTML = (""+score).toHHMMSS();
      difficulty += 0.01;
      scorelist = sessionStorage.getItem("scores") ? JSON.parse(sessionStorage.getItem("scores")): [];
      scorelist.push((""+score).toHHMMSS());
      sessionStorage.setItem("scores", JSON.stringify(scorelist));
      
      createText();
      wordInputElement.value = '';
    }
});

function restartGame()
{
  console.log('restart');
  restart.style.display = "none";
  stop.style.display = "block";
  document.getElementById('score').innerHTML = "00:00"
  wordInputElement.readOnly = false;
  wordInputElement.value = '';
  createText();
  wordInputElement.focus();
}

function stopGame()
{
  restart.style.display = "none";
  stop.style.display = "block";
  wordInputElement.readOnly = false;
  wordInputElement.value = '';
  createText();
}

function populateScoreBoard()
{
  let innerScoreBoard = '';
  if(scorelist.length > 10)
  {
    scorelist.splice(10);
  }
  scorelist.forEach(function(score, i) {
    innerScoreBoard += '<span>' + 'Game ' + (i+1) + ' : '+ score + '<p id="score_'+ i + '"></p></span><br/>';
  });
  document.getElementById('scoreDetails').innerHTML = innerScoreBoard;
}
