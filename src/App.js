import { Fragment, useCallback, useEffect, useRef, useState } from "react"

const backgroundMusicList = [
  "/static/music/Battle! Trainer 8-BIT - Pokemon Diamond & Pearl.mp3",
  "/static/music/Bowser's Castle 8-BIT - Mario Kart Super Circuit.mp3",
  "/static/music/Battle! Rival 8-BIT - Pokemon Diamond & Pearl.mp3",
  "/static/music/Dangerous Scales - Loeder Original.mp3",
  "/static/music/Ghirahim Battle 8-bit - The Legend of Zelda Skyward Sword.mp3",
  "/static/music/winner.wav",
  "/static/music/gameover.wav",
]

const backgroundImageList = [
  "/static/images/round-backgrounds/1.jpg",
  "/static/images/round-backgrounds/2.jpg",
  "/static/images/round-backgrounds/3.jpg",
]

export default function App() {
  const [isStarted, setIsStarted] = useState(false)

  const handleStartGame = () => {
    setIsStarted(true)
  }

  return (
    <Fragment>
      {!isStarted ? <PreStart startGame={handleStartGame} /> : <BattleScreen />}
      <Foot />
    </Fragment>
  )
}

function PreStart({ startGame }) {

  const handleStartGame = () => {
    startGame()
  }
  return (
    <div id="hero">
      <div className="container">
        <div className="wrapper">
          <div className="top">
            <h1>Tic-Tac-Toe</h1>
            <p>Made with ❤ by Mark Kenneth</p>
          </div>
          <div className="bottom">
            <h1 onClick={handleStartGame}>{'>'} Click here to start</h1>
          </div>
        </div>
      </div>
    </div>
  )
}

function BattleScreen() {
  const [round, setRound] = useState(1)
  const bgm = useRef(new Audio(backgroundMusicList[round - 1]))
  const [scores, setScores] = useState({ player: 0, bot: 0 })
  const [isGameOnGoing, setIsGameOnGoing] = useState(true)
  const [isShownResult, setIsShownResult] = useState(false)
  const [roundWinner, setRoundWinner] = useState(null)
  const [announceGameWinner, setAnnounceGameWinner] = useState(null)

  const changeBGM = useCallback(() => {
    bgm.current.pause()

    if (scores.bot === 3) {
      bgm.current = new Audio(backgroundMusicList[6])
    } else if (scores.player === 3) {
      bgm.current = new Audio(backgroundMusicList[5])
    } else {
      bgm.current = new Audio(backgroundMusicList[scores.player + scores.bot])
    }

    bgm.current.play()
    bgm.current.loop = true
  }, [scores.player, scores.bot])

  const handleBoardFull = useCallback(() => {
    setRound(prev => prev + 1)
    setIsGameOnGoing(false)
    setRoundWinner("draw")
  }, [])

  const handleBotWin = useCallback(() => {
    setScores(prev => ({
      ...prev,
      bot: prev.bot + 1
    }))
    setRound(prev => prev + 1)
    setIsGameOnGoing(false)
    setRoundWinner("bot")
  }, [])

  const handlePlayerWin = useCallback(() => {
    setScores(prev => ({
      ...prev,
      player: prev.player + 1
    }))
    setRound(prev => prev + 1)
    setIsGameOnGoing(false)
    setRoundWinner("player")
  }, [])

  const changeBackgroundImage = useCallback(() => {
    if (scores.player > 2) return
    const battleArea = document.getElementById('battle-area')
    battleArea.style.backgroundImage = `url(${backgroundImageList[scores.player]})`
  }, [scores])

  useEffect(() => {
    setTimeout(() => {
      if (!isGameOnGoing) {
        setIsShownResult(true)
      }
    }, 1000);
  }, [isGameOnGoing, changeBackgroundImage])

  const continueGame = useCallback(() => {
    setIsShownResult(false)
    setRoundWinner(null)
    setIsGameOnGoing(true)
  }, [])

  const checkGameWinner = useCallback(() => {
    if (scores.bot === 3) {
      setAnnounceGameWinner("bot")
      return
    } else if (scores.player === 3) {
      setAnnounceGameWinner("player")
      return
    }
  }, [scores.bot, scores.player])

  useEffect(() => { checkGameWinner() }, [checkGameWinner])
  useEffect(() => { changeBGM(); changeBackgroundImage() }, [scores, changeBGM, changeBackgroundImage])
  return (
    <div id="battle-area">
      <div className="container">
        <div className="wrapper">
          <Score scores={scores} round={round} />
          {
            !isShownResult
              ?
              <TicTacToeBoard playerWin={handlePlayerWin} botWin={handleBotWin} boardFull={handleBoardFull} />
              : announceGameWinner ?
                <GameResultBoard announceGameWinner={announceGameWinner} />
                : <RoundResultBoard continueGame={continueGame} scores={scores} round={round} roundWinner={roundWinner} />
          }
        </div>
      </div>
    </div>
  )
}

function GameResultBoard({ announceGameWinner }) {
  return (
    <div id="result-board">
      <div className="texters">
        <h1 className={"result-text " + announceGameWinner}>
          {announceGameWinner === "player" ? "Congratulations, you beat the AI" : "Better luck next time."}
        </h1>
      </div>
      <button onClick={() => { window.location.reload() }}>Play Again</button>
    </div>
  )
}

function RoundResultBoard({ roundWinner, continueGame }) {
  return (
    <div id="result-board">
      <div className="texters">
        <h1 className={`result-text ${roundWinner}`}>
          {roundWinner === "player" ? "You win this round." : roundWinner === "bot" ? "You lose this round" : "The game is draw."}
        </h1>
        <p>Get ready for the next battle.</p>
      </div>
      <button onClick={continueGame}>Continue the battle</button>
    </div >
  )
}

function Score({ scores, round }) {
  return (
    <div className="score-area">
      <div className="player-scores">
        <h2>Player</h2>
        <div className="player">
          {
            [...Array(3)].map((x, i) => (
              <div key={i} className={"score-box" + (i < scores.player ? " win-score" : " lose-score")}></div>
            ))
          }
        </div>
        <h2>Bot</h2>
        <div className="bot">
          {
            [...Array(3)].map((x, i) => (
              <div key={i} className={"score-box" + (i < scores.bot ? " win-score" : " lose-score")}></div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

let winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
]

function TicTacToeBoard({ playerWin, botWin, boardFull }) {
  const [boardData, setBoardData] = useState([null, null, null, null, null, null, null, null, null])
  const [isPlayerTurn, setIsPlayerTurn] = useState(Math.random() < 0.5)
  const [hasWinner, setHasWinner] = useState(false)

  const tickBoardBox = useCallback((index, tick) => {
    let prevBoardData = [...boardData]
    prevBoardData[index] = tick
    setBoardData(prevBoardData)
    setIsPlayerTurn(prev => !prev)
  }, [boardData])

  const handlePlayerAttack = (index) => {
    tickBoardBox(index, 'X')
  }

  const isBoardFull = useCallback(() => {
    let tickCount = 0
    boardData.forEach(tick => {
      if (tick !== null) tickCount++
    })

    if (tickCount === 9) {
      return true
    }
  }, [boardData])

  const isWinner = useCallback((tickType) => {
    for (let i = 0; i < winningCombinations.length; i++) {
      if (boardData[winningCombinations[i][0]] === tickType && boardData[winningCombinations[i][1]] === tickType && boardData[winningCombinations[i][2]] === tickType) {
        return true
      }
    }
  }, [boardData])

  const isWinning = useCallback((tickType) => {
    for (let i = 0; i < winningCombinations.length; i++) {
      if (
        boardData[winningCombinations[i][0]] === null &&
        boardData[winningCombinations[i][1]] === tickType &&
        boardData[winningCombinations[i][2]] === tickType
      ) {
        return true
      }
      else if (
        boardData[winningCombinations[i][0]] === tickType &&
        boardData[winningCombinations[i][1]] === null &&
        boardData[winningCombinations[i][2]] === tickType
      ) {
        return true
      }
      else if (
        boardData[winningCombinations[i][0]] === tickType &&
        boardData[winningCombinations[i][1]] === tickType &&
        boardData[winningCombinations[i][2]] === null
      ) {
        return true
      }
    }

    return false
  }, [boardData])

  const getWinningPosition = useCallback((tickType) => {
    for (let i = 0; i < winningCombinations.length; i++) {
      if (
        boardData[winningCombinations[i][0]] === null &&
        boardData[winningCombinations[i][1]] === tickType &&
        boardData[winningCombinations[i][2]] === tickType
      ) {
        return winningCombinations[i][0]
      }
      else if (
        boardData[winningCombinations[i][0]] === tickType &&
        boardData[winningCombinations[i][1]] === null &&
        boardData[winningCombinations[i][2]] === tickType
      ) {
        return winningCombinations[i][1]
      }
      else if (
        boardData[winningCombinations[i][0]] === tickType &&
        boardData[winningCombinations[i][1]] === tickType &&
        boardData[winningCombinations[i][2]] === null
      ) {
        return winningCombinations[i][2]
      }
    }
  }, [boardData])

  const randomizeBotAttack = useCallback(() => {
    let targetPosition = Math.floor(Math.random() * boardData.length)
    console.log("trying: " + targetPosition);
    if (boardData[targetPosition] !== null) {
      return randomizeBotAttack()
    }

    return targetPosition
  }, [boardData])

  const letBotAttack = useCallback(() => {
    let pos = 9;
    if (isWinning('O')) {
      console.log("Win me");
      pos = getWinningPosition('O')
    }
    else if (isWinning('X')) {
      console.log("Block");
      pos = getWinningPosition('X')
    }
    else {
      console.log("On random");
      pos = randomizeBotAttack()
    }
    console.log("Attack on: ", pos);
    setTimeout(() => {
      tickBoardBox(pos, 'O')
    }, 1000);
  }, [isWinning, randomizeBotAttack, getWinningPosition, tickBoardBox])

  const checkGameStats = useCallback(() => {
    // Check if has a winner
    if (isWinner('X')) {
      playerWin()
      setHasWinner(true)
    } else if (isWinner('O')) {
      botWin()
      setHasWinner(true)
    }
    else if (isBoardFull()) {
      boardFull()
    }
    else if (!isPlayerTurn) {
      letBotAttack()
    }
  }, [isPlayerTurn, isWinner, isBoardFull, letBotAttack, boardFull, playerWin, botWin])

  useEffect(() => {
    checkGameStats()
  }, [isPlayerTurn, checkGameStats])


  return (
    <div id="tic-tac-toe-board">
      <div className="wrapper">
        {
          boardData.map((value, index) => (
            value !== null
              ?
              <div key={index} className="box">
                <h1 className="user-tick">{value}</h1>
              </div>
              :
              <div
                key={index}
                onClick={() => isPlayerTurn && !hasWinner ? handlePlayerAttack(index) : null} className={(isPlayerTurn && !hasWinner ? "green-box" : "red-box") + " box"}>
              </div>
          ))
        }
      </div>
    </div>
  )
}

function Foot() {
  return (
    <footer>
      <a href="https://www.github.com/markcalendario">Mark Calendario</a>
    </footer>
  )
}