import React from "react";
import "../Game/game.css";
import Container from 'react-bootstrap/Container';
import { Row, Col} from 'react-bootstrap';
import userIcon from '../../images/Icon material-person.png';
import gameIcon from '../../images/Icon awesome-gamepad.svg';

class GameOver extends React.Component {

constructor(props) {
    super(props);
    this.state = {
        user:localStorage.getItem('currentUser'),
        level: localStorage.getItem('level'),
        score: localStorage.getItem('score').split(',')[localStorage.getItem('score').split(',').length-1]
      };
    if(!localStorage.getItem('currentUser') ){
      this.props.history.push("/");

    }
    this.getTime = this.getTime.bind(this);
    this.quit = this.quit.bind(this);
    this.restart = this.restart.bind(this);
  }
    componentDidMount() {
        this.getTime();
    }
    getTime() {
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
        localStorage.setItem('reload', 'reload')
        this.props.history.push("/");
        
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
                <Col className="centre">
                   Game Over
                   <div>
                       {this.state.showDetailedScore}
                   </div>
                   

                </Col>
                
            </Row>
            <Row>
                <Col>
                 <div className="btn-container right" onClick={this.restart}>
                    <button className="btn1 btn">Restart</button>
                </div>
                </Col>
                <Col>
                 <div className="btn-container" onClick={this.quit}>
                    <button className="btn2 btn">Quit</button>
                </div>
                </Col>
            </Row>
            </Container>
          </div>
        );
  }
}

export default GameOver;
