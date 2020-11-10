import React from "react";
import "./game.css";
import Container from 'react-bootstrap/Container';
import { Row, Col} from 'react-bootstrap';
import userIcon from '../../images/Icon material-person.png';
import gameIcon from '../../images/Icon awesome-gamepad.svg';
import data from '../../data/dictionary.json'

class GamePage extends React.Component {

constructor(props) {
    super(props);
    this.state = {
        user:localStorage.getItem('currentUser'),
        level: localStorage.getItem('level'),
        score: "00:00",
        word: '',
        time: {},
        seconds: 10,
        FULL_DASH_ARRAY: 283,
        WARNING_THRESHOLD: 2,
        ALERT_THRESHOLD: 1,
        TIME_LIMIT: 4,
        timePassed: 0,
        timeLeft: 4,
        timeleftString: '',
        timerClass: 'base-timer__path-remaining green',
        strokeDasharray: 283,
        EASY: 1,
        MEDIUM: 1.5,
        DIFFICULT: 2,
        DifficultyFactor: 0.01,
        difficulty: 0,
        inputValue: '',
        arrayOfColoredWord: [],
        gameBoard:[],
        classBlock:"",
        classEnd: "none",
        showDetailedScore: []
      };
    if(!localStorage.getItem('currentUser') ){
      this.props.history.push("/");

    }
    // if(localStorage.getItem('reload') === 'reload')
    // {
    //     window.location.reload();
    //     localStorage.removeItem("reload");
    // }
    
    this.onInput = this.onInput.bind(this);
    this.formatTimeLeft = this.formatTimeLeft.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
    this.setCircleDasharray = this.setCircleDasharray.bind(this);
    this.getColoredWord = this.getColoredWord.bind(this);
    this.getGameBoard = this.getGameBoard.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.stopOnClick = this.stopOnClick.bind(this);
    this.getTime = this.getTime.bind(this);
    this.quit = this.quit.bind(this);
    this.restart = this.restart.bind(this);
  }
    componentDidMount() {
        this.nameInput.focus();
        window.addEventListener('load', this.handleLoad);
    }
    getTime() {
        // seconds = this.convertTime(convertToSeconds);
        let scores = localStorage.getItem('score').split(',');
        let seconds = 0;
        let highestScore = ''
        scores.forEach((score,index) => {
            let time =score.split(':').reduce((s, t) => s * 60 + +t, 0);
            if(seconds <= time)
            {
                seconds = time;
                highestScore = score;
            }
        });
        let display = [];
        display.push(<><span key={scores.length+'score'}>  {"Game "+ scores.length + " : " + this.state.score} </span><br/></>);
        if(highestScore === this.state.score)
        {
            display.push (<><span key={highestScore + '_highestScore'}> Highest Score </span><br/></>);
        }
        else{
            display.push (<><span key={highestScore + '_optional'}> Beat the Highest Score: {highestScore} </span><br/></>);
        }
        this.setState({showDetailedScore: display}, () => {});  
    }

    quit() {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("score");
        localStorage.removeItem("level");
        localStorage.setItem('reload', 'reload')
        this.props.history.push("/");
    }

    restart(){
        this.setState({classBlock: '', classEnd: 'none', score: '00:00', inputValue: '', arrayOfColoredWord:[]}, () => {
            this.nameInput.focus();
        });
        this.handleLoad();
    }
    // componentWillUnmount() { 
    // window.removeEventListener('load', this.handleLoad)  
    // }

    handleLoad() {
        this.getGameBoard();
        if (this.state.difficulty  === 0) {
            this.getDifficultyLevel();
        }
        
        this.getWord();
        //Timer value = (Number of letters in the word) / (Difficulty factor);
        const calculatedLimit = Math.ceil(this.state.word.length/this.state.difficulty);
        this.setState({TIME_LIMIT : calculatedLimit, timeLeft: calculatedLimit}, ()=>{});
        this.formatTimeLeft(calculatedLimit);
        let spentTime = 0;
        let remainingTime = calculatedLimit;
        this.timerInterval = setInterval(() => {
            if(remainingTime > 0)
            {
                spentTime += 1;
                remainingTime = this.state.TIME_LIMIT - spentTime;
                this.setState({timePassed: spentTime, timeLeft:remainingTime}, () => {
                    this.formatTimeLeft(this.state.timeLeft);
                    this.setCircleDasharray()
                });
                // if(remainingTime === this.state.WARNING_THRESHOLD) {
                //     this.setState({timerClass: 'base-timer__path-remaining orange'}, () => {
                //     }); 
                // }
                if(remainingTime === this.state.ALERT_THRESHOLD) {
                    this.setState({timerClass: 'base-timer__path-remaining red'}, () => {
                    }); 
                }
                else{
                     this.setState({timerClass: 'base-timer__path-remaining green'}, () => {
                    }); 
                }
            }
            else{
                let localStorageScore = localStorage.getItem('score');
                if(localStorageScore)
                {
                    console.log('IFFFFFFFF')
                    let previousScores = localStorageScore.split(',');
                    previousScores.push(this.state.score)
                    localStorage.setItem('score', previousScores.toString());
                } else{
                    console.log('ELSE')

                    localStorage.setItem('score', this.state.score);
                }
                this.stopTimer();
        //         classBlock:"",
        // classEnd: ""
                 this.setState({classBlock: 'none', classEnd: ''}, () => {
                }); 
                this.getTime();
                this.props.history.push("/gameOver");
            }
            
        }, 1000);
    }
    getGameBoard(){
        const scores = localStorage.getItem('score');
        const arrayOfScores = [];
        if(scores){
            const localStorageScores = localStorage.getItem('score').split(',');
            localStorageScores.forEach((score, index) => {
                const gameCount = 'Game ' + (index + 1) + ' : ';
                arrayOfScores.push (<><span key={index} style={{ color: 'green' }}>  {gameCount + score} </span><br/></>);
            });
        } else{
            arrayOfScores.push (<span key="noScore"> No Scores Yet </span>);
        }

        this.setState({gameBoard: arrayOfScores}, () => {});
        

    }
    stopTimer(){
        clearInterval(this.timerInterval);
    }
    stopOnClick(){
        this.stopTimer();
        let localStorageScore = localStorage.getItem('score');
        if(localStorageScore)
        {
            console.log('IFFFFFFFF')
            let previousScores = localStorageScore.split(',');
            previousScores.push(this.state.score)
            localStorage.setItem('score', previousScores.toString());
        } else{
            console.log('ELSE')

            localStorage.setItem('score', this.state.score);
        }
        this.setState({classBlock: 'none', classEnd: ''}, () => {
        });
         this.setState({classBlock: 'none', classEnd: ''}, () => {
                }); 
                this.getTime();
        this.props.history.push("/gameOver");

    }

    convertTime(time){
        // eslint-disable-next-line no-extend-native
            var sec_num = parseInt(time, 10);
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}
            if(hours > 0) {
                return hours + ':' + minutes + ':' + seconds;
            }
            else{
                return minutes + ':' + seconds;
            }
    
    }
    getScore() {
        let seconds = '';
        if(this.state.score === "00:00")
        {
            seconds = this.convertTime(this.state.timePassed);
        }
        else{
            const convertToSeconds = this.state.score.split(':').reduce((s, t) => s * 60 + +t, 0) + this.state.timePassed;
            seconds = this.convertTime(convertToSeconds);
        }
        return seconds;
    }
    onInput(event) {
        this.setState({inputValue: event.target.value.toUpperCase()}, () => {
            this.getColoredWord();
        });
        if(event.target.value.toUpperCase() === this.state.word.toUpperCase())
        {
            //this.setState({companyName: "your value", designation: "your value"});
            let difficultLevel = '';
            if(this.state.difficulty + 0.01 === 1.5){
                difficultLevel = 'MEDIUM';
            } else if(this.state.difficulty + 0.01 === 2){
                difficultLevel = 'DIFFICULT';
            }
            this.setState({
                difficulty: parseFloat(this.state.difficulty + 0.01),
                score: this.getScore(),
                level: difficultLevel ? difficultLevel.length > 0 : this.state.level,
                inputValue: '',
                timeLeft: this.state.TIME_LIMIT
            });
            localStorage.setItem('level', this.state.level);
            this.stopTimer();
            this.handleLoad();
        }
    }
    getWord() {
        
        let fetchedWord = '';
        const difficulty = this.state.difficulty;
        if(difficulty < 1.5)
        {
                fetchedWord = this.fetchWord(1,4);
        }
        else if(difficulty < 2)
        {
                fetchedWord = this.fetchWord(5,8);
        } else if(difficulty >= 2){
                fetchedWord = this.fetchWord(9);
        }
        this.setState({word: fetchedWord}, () => {});
        this.getColoredWord();
      }
        getDifficultyLevel(){
            let difficulty = 1;
            switch(this.state.level){
                case 'EASY': 
                    difficulty = 1;
                    break;
                case 'MEDIUM': 
                    difficulty = 1.5;
                    break;
                case 'DIFFICULT': 
                    difficulty = 2;
                    break;
                default:
                    difficulty = 1;
            }
            this.setState({difficulty: difficulty}, () => {});
    // Timer value = (Number of letters in the word) / (Difficulty factor)
}
    fetchWord(start, end)
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
    calculateTimeFraction() {
        return this.state.timeLeft / this.state.TIME_LIMIT;
    }
        
    setCircleDasharray() {
        const circleDasharray = `${(
            this.calculateTimeFraction() * this.state.FULL_DASH_ARRAY
        ).toFixed(0)} 283`;
        this.setState({strokeDasharray: circleDasharray}, () => {
                    });
        
    }
    formatTimeLeft(time) {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        if (seconds < 10) {
            seconds = `0${seconds}`;
        }
        this.setState({timeleftString: `${minutes}:${seconds}`}) ;
    }

    getColoredWord() {
        const arrayOfletters = [];
        console.log('this.state.word', this.state.word);
        this.state.word.split('').forEach((letter, index) => {
            console.log('this.state.inputValue && this.state.inputValue[index]', this.state.inputValue , this.state.inputValue[index])
            if(this.state.inputValue && this.state.inputValue[index]){
                if(letter.toUpperCase() === this.state.inputValue[index].toUpperCase()) {
                    arrayOfletters.push (<span key={index} style={{ color: 'green' }}> {letter} </span>);
                } else {
                    arrayOfletters.push (<span key={index} style={{ color: 'red' }}> {letter} </span>);
                }
            }
            else{
                arrayOfletters.push (<span key={index} style={{ color: '#ffffff' }}> {letter} </span>);
            }
        });

        this.setState({arrayOfColoredWord: arrayOfletters}, () => {});
        console.log('Span',arrayOfletters, this.state.arrayOfColoredWord)
    }
  render() {
    return (
          <div>
            <div className="bg-container"/>
            <div className="bg-img" />
            <Container>
            <Row style={{color: 'aliceblue', marginTop:'10px'}}>
                <Col>
                    <img src={userIcon} alt="keyboard" className="user"/>
                    <label className="userName">{this.state.user}</label>
                </Col>
                <Col>
                    <label className="fastFingers">fast fingers</label>
                </Col>
            </Row>
             <Row style={{color: 'aliceblue'}}>
                <Col>
                    <img src={gameIcon} alt="game" className="user"/>
                    <label className="userName">{this.state.level}</label>
                </Col>
                <Col>
                    <label className="fastFingers">Score : {this.state.score}</label>
                </Col>
            </Row>
            <Row style={{color: 'aliceblue'}}>
                <Col className="d-none d-lg-block d-md-block">
                    <div className="scoreBoard">
                        <h3>Game Board</h3>
                        {this.state.gameBoard}
                    </div>
                </Col>
                <Col xs={5} className="centered">
                    <div className="base-timer">
                        <svg className="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <g className="base-timer__circle">
                            <circle className="base-timer__path-elapsed" cx="50" cy="50" r="45" />
                             <path
                                id="base-timer-path-remaining"
                                strokeDasharray={this.state.strokeDasharray}
                                className={this.state.timerClass}
                                d="
                                M 50, 50
                                m -45, 0
                                a 45,45 0 1,0 90,0
                                a 45,45 0 1,0 -90,0
                                "
                            ></path>
                            </g>
                        </svg>
                        <span  id="base-timer-label" className="base-timer__label">
                            {this.state.timeleftString}
                        </span>
                    </div>
                    <div className="divWord">
                        <p className="labelWord">{this.state.arrayOfColoredWord}</p>
                        <br/>
                        <input type="text" onChange={ this.onInput } value={this.state.inputValue} 
                        autoFocus className="inputText"
                        ref={(input) => { this.nameInput = input; }} 
                        />
                    </div>
                </Col>
                <Col className="d-none d-lg-block d-md-block">
                    {/* <button type="button" onClick={this.stopOnClick} className="btn-container"  > STOP</button> */}
                    <div className="btn-container" onClick={this.stopOnClick}>
                        <button className="btn2 btn">STOP</button>
                    </div>
                </Col>
            </Row>
            </Container>
          </div>
        );
  }
}

export default GamePage;
