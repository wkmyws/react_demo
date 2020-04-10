import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import * as serviceWorker from './serviceWorker';

class Square extends React.Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
      <button onClick={()=>{this.props.onClick()}} 
      className="square">
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  constructor(props){
    super(props);
    this.state={
      squares:Array(9).fill(null),
      xIsNext:true,

      msg:'there will be some tips',
      msg_SetTimeOut:null,
      primMsg:'',

      isEnd:null,
      leftTimes:9,

      pc:Math.random()>0.5?'X':'O',
    }
  }
  componentDidMount(){
    this.showMessage("I'm thinking who will go first...")
    setTimeout(()=>{
      if(this.state.pc=='X'){
        this.pcWillDo();
      }else{
        this.showMessage("I'm kind enough to give you a head start !")
      }
    },1500)
  }
  showMessage(msg,time){
    if(!time){
      if(this.state.msg_SetTimeOut){
        clearTimeout(this.state.msg_SetTimeOut)
      }
      this.setState({msg:msg})
    }
    else{
      if(this.state.msg_SetTimeOut){
        clearTimeout(this.state.msg_SetTimeOut)
      }else{
        this.state.primMsg=this.state.msg;
      }
      this.setState({msg:msg})
      this.state.msg_SetTimeOut=setTimeout(()=>{
        this.setState({msg:this.state.primMsg})
      },time)
    }
  }
  renderSquare(i) {
    return <Square onClick={()=>{this.handleClick(i)}} 
        value={this.state.squares[i]} />;
  }
  handleClick(i,isPc){
    if(((this.state.xIsNext?'X':'O')==this.state.pc)&&!isPc)return;
    if(this.state.leftTimes<=0)return;
    if(this.state.isEnd){
      this.showMessage("winner '"+this.state.isEnd+"' has generated,game has ended.")
      return
    }
    if(this.state.squares[i]!=null){
      this.showMessage("the box has been occupied",1000)
      return;
    }
    if(this.state.xIsNext){
      this.state.squares[i]='X';
      this.showMessage("It's O's turn")
    }else{
      this.state.squares[i]='O';
      this.showMessage("It's X's turn")
    }
    this.state.xIsNext=!this.state.xIsNext
    this.setState({xIsNext:this.state.xIsNext,squares:this.state.squares})
    this.state.leftTimes--;
    this.state.isEnd=calculateWinner(this.state.squares)
    if(this.state.isEnd){
      this.showMessage("winner is "+this.state.isEnd)
    }else if(this.state.leftTimes<=0){
      this.showMessage("It ends in a draw.")
      return
    }
    if(!isPc)this.pcWillDo()
  }
  pcWillDo(){
    this.showMessage("ohh,it's my turn!")
    setTimeout(()=>{
      this.handleClick(autoFillIn(this.state.pc,this.state.squares),true)
    },Math.floor(700+Math.random()*1000))
  }
  render() {
    return (
      <div>
        <div className="status">{this.state.msg}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}
function calculateWinner(sq) {
  let squares=sq.slice(0)
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
function autoFillIn(role,sq){
  //role x||o
  //return 0-9
  let squares=sq.slice(0)
  for(let i=0;i<9;i++){
    if(squares[i])continue;
    squares[i]=role;
    if(calculateWinner(squares)==role)return i;
    squares[i]=null;
  }
  role=role=='X'?'O':'X';
  for(let i=0;i<9;i++){
    if(squares[i])continue;
    squares[i]=role;
    if(calculateWinner(squares)==role)return i;
    squares[i]=null;
  }
  if(squares[4]==null)return 4;
  for(let i=0;i<9;i++)
  if(squares[i]==null)return i;
  return 0;
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
