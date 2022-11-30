import React, { useEffect, useState } from "react";
import BackgroundImg from "../asset/bg.png"
import styled from "styled-components"
import BirdImg from "../asset/bird.png"
import ForegroundImg from "../asset/fg.png"
import PileImg from "../asset/pipe-top.png"
const BIRD_WIDTH =38;
const BIRD_HEIGHT=26;
const GAME_WIDTH=288;
const GAME_HEIGHT=500;
const FORE_WIDTH=288;
const FORE_HEIGHT=118;
const GRAVITY =2;
const JUMP_HEIGHT=30;
const OBSTACLE_WIDTH=40;
const OBSTACLE_GAP=200
const Game = () => {
  const [birdPosition, setBirdPosition]= useState(200);
  const [gameHasStarted,setGameHasStarted]=useState(false);
  const [obsacleHeight,setObsacleHeight]=useState(100);
  const [obsacleLeft,setObsacleLeft]=useState(GAME_WIDTH-OBSTACLE_WIDTH);
  const bottomObsacleHeight = GAME_HEIGHT-OBSTACLE_GAP-obsacleHeight;
  const [score,setScore]=useState(0);
  useEffect(()=>{
    let TimeID;
    if(gameHasStarted && birdPosition < GAME_HEIGHT-BIRD_HEIGHT){
      TimeID=setInterval(()=>{
        setBirdPosition(birdPosition => birdPosition + GRAVITY)
      },24)
    }
    return ()=>{
      clearInterval(TimeID)
    };
  },[birdPosition,gameHasStarted])
  useEffect(()=>{
    let obstacleID;
    if(gameHasStarted&& obsacleLeft >= 0){
      obstacleID = setInterval(()=>{
        setObsacleLeft((obsacleLeft)=>obsacleLeft-2);
      },24)

      return () =>{
        clearInterval(obstacleID);
      }
    }
    else{
      setObsacleLeft(GAME_WIDTH-OBSTACLE_WIDTH);
      setObsacleHeight(Math.floor(Math.random()*(GAME_HEIGHT-OBSTACLE_GAP)));
    };
    setScore((score)=>score+1);
  },[gameHasStarted,obsacleLeft]);
  useEffect(()=>{
    const hasCollidedWithTopObstacle =birdPosition >= 118 && birdPosition < obsacleHeight;
    const hasCollidedWithBottomObstacle=birdPosition <=500 && birdPosition >= 500-bottomObsacleHeight;
    if(
      obsacleLeft >=0 && obsacleLeft <=OBSTACLE_WIDTH &&(hasCollidedWithTopObstacle||hasCollidedWithBottomObstacle)
    ){
      setGameHasStarted(false);
    }
  },[birdPosition,obsacleHeight,bottomObsacleHeight,obsacleLeft])

  const handleClick =()=>{
    let newBirdPosition = birdPosition -JUMP_HEIGHT;
    if(!gameHasStarted){
      setGameHasStarted(true);
    }
    else if(newBirdPosition<0){
      setBirdPosition(0);
    }else{
      setBirdPosition(newBirdPosition);
    }
    setBirdPosition(newBirdPosition);
  }
  return (
    <div onClick={handleClick}>
      <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
      <Obstacle
        top={0}
        width={OBSTACLE_WIDTH}
        height={obsacleHeight}
        left={obsacleLeft}
      />
      <Obstacle
        top={GAME_HEIGHT-(obsacleHeight+bottomObsacleHeight)}
        width={OBSTACLE_WIDTH}
        height={bottomObsacleHeight}
        left={obsacleLeft}
      />
        <Bird width={BIRD_WIDTH} height={BIRD_HEIGHT} top={birdPosition}/>
        <Foreground width={FORE_WIDTH} height={FORE_HEIGHT}/>
      </GameBox>
      <span>{score}</span>
    </div>
  );
};

export default Game;
const Bird = styled.div`
  position:absolute;
  background:url(${BirdImg});
  height:${(props)=>props.height}px;
  width:${(props)=>props.width}px;
  top:${(props)=>props.top}px;
  left:100px;

`;
const GameBox = styled.div`
  height:${(props)=>props.height}px;
  width:${(props)=>props.width}px;
  background:url(${BackgroundImg});
  position:relative;
  overflow:hidden;
  `;
const Foreground =styled.div`
  height:${(props)=>props.height}px;
  width:${(props)=>props.width}px;
  position:absolute;
  bottom:0;
  background:url(${ForegroundImg});
  left:0;

`;
const Obstacle =styled.div`
  position:relative;
  top:${(props)=>props.top}px;
  height:${(props)=>props.height}px;
  width:${(props)=>props.width}px;
  background:url(${PileImg});
  left:${(props)=>props.left}px;
  
`