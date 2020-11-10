import React from "react";
import "./fast-fingers.css";
import keyboard from './images/Iconawesome-keyboard.png';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class FastFingersApp extends React.Component {

constructor(props) {
    super(props);
    this.state = {value: '', level:'EASY', errors: "", inputClass:""};
    if(localStorage.getItem('currentUser') ){
          this.props.history.push("/game");
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.selectChange = this.selectChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  selectChange(event) {
    this.setState({level: event.target.value});
  }

  handleSubmit(event) {
    if(this.validate(this.state.value.length)){
      localStorage.setItem('currentUser', this.state.value);
      localStorage.setItem('level', this.state.level);
      localStorage.setItem('reload', 'reload')
      this.props.history.push("/game");
    }
    else{
      event.preventDefault();
    }
    }
    
  validate(length){
      let isValid = true;
      if(length === 0 || length > 20){
        isValid = false;
        this.setState({errors: 'Please provide your name.', inputClass:'invalid'}, () => {
                console.log(this.state.errors, 'errors');
              });
      }
      else{
        this.setState({errors: '', inputClass:''}, () => {
                console.log(this.state.errors, 'errors');
              });
      }
     
      return isValid;
  }
     
  
  render() {
    return (
     
          <div>
            <div className="bg-container"/>
            <div className="bg-img" />
            <div className="keyboard">
              <img src={keyboard} alt="keyboard"/>
              <h1 className="header">Fast Fingers</h1>
              <span className="tagLine">The Ultimate Typing Game</span>
              <div className="form-input">
               <form onSubmit={this.handleSubmit}>
                <Form.Group controlId="formBasicEmail" className="inputName" >
                <Form.Control type="text" placeholder="Type Your Name.." 
               
                value={this.state.value} onChange={this.handleChange} className={this.state.inputClass} 
                style={{backgroundColor: "gray", textTransform: "uppercase", color: "black",fontFamily: "'Comic Sans MS', cursive, sans-serif"}}/>
                </Form.Group>
                <label>{this.state.errors}</label>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Control as="select" value={this.state.level} onChange={this.selectChange} 
                  style={{backgroundColor:"transparent", color: "aliceblue",fontFamily: "'Comic Sans MS', cursive, sans-serif"}}>
                    <option value="EASY" style={{backgroundColor:"darkolivegreen", color: "aliceblue",fontFamily: "'Comic Sans MS', cursive, sans-serif"}}>EASY</option>
                    <option value="MEDIUM" style={{backgroundColor:"darkolivegreen", color: "aliceblue",fontFamily: "'Comic Sans MS', cursive, sans-serif"}}>MEDIUM</option>
                    <option value="DIFFICULT" style={{backgroundColor:"darkolivegreen", color: "aliceblue",fontFamily: "'Comic Sans MS', cursive, sans-serif"}}>DIFFICULT</option>
                  </Form.Control>
                </Form.Group>
                <Button type="submit" className="btn bg-transparent" style={{border: "none", color: "red", fontFamily: "'Comic Sans MS', cursive, sans-serif"}}>
                  START GAME
                </Button>
               
              </form>
            </div>
            </div>
          </div>
        );
  }
}

export default FastFingersApp;
