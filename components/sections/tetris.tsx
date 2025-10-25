"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

type TetrisProps = {
  onReturn: () => void;
  skipAnimation?: boolean;
  onMobileUp?: () => void;
  onMobileDown?: () => void;
  onMobileLeft?: () => void;
  onMobileRight?: () => void;
  onMobileRotate?: () => void;
}

// Game constants
const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const INITIAL_DROP_SPEED = 600
const MIN_DROP_SPEED = 80
const SPEED_INCREMENT = 40

// Letter shapes for tetrominoes (W, E, S, M, T, C, H)
// Each shape is represented as a 4x4 grid with the letter character
const TETROMINOS = {
  W: {
    shape: [
      [0, 0, 0, 0],
      ['W', 0, 'W', 0],
      ['W', 'W', 'W', 0],
      [0, 0, 0, 0],
    ],
    color: '#fbbf24', // yellow
  },
  E: {
    shape: [
      [0, 0, 0, 0],
      ['E', 'E', 'E', 0],
      ['E', 0, 0, 0],
      ['E', 'E', 'E', 0],
    ],
    color: '#60a5fa', // blue
  },
  S: {
    shape: [
      [0, 0, 0, 0],
      [0, 'S', 'S', 0],
      ['S', 'S', 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#34d399', // green
  },
  M: {
    shape: [
      [0, 0, 0, 0],
      ['M', 0, 'M', 0],
      ['M', 'M', 'M', 0],
      ['M', 0, 'M', 0],
    ],
    color: '#f87171', // red
  },
  T: {
    shape: [
      [0, 0, 0, 0],
      ['T', 'T', 'T', 0],
      [0, 'T', 0, 0],
      [0, 'T', 0, 0],
    ],
    color: '#a78bfa', // purple
  },
  C: {
    shape: [
      [0, 0, 0, 0],
      [0, 'C', 'C', 0],
      ['C', 0, 0, 0],
      [0, 'C', 'C', 0],
    ],
    color: '#fb923c', // orange
  },
  H: {
    shape: [
      [0, 0, 0, 0],
      ['H', 0, 'H', 0],
      ['H', 'H', 'H', 0],
      ['H', 0, 'H', 0],
    ],
    color: '#ec4899', // pink
  },
}

type TetrominoType = keyof typeof TETROMINOS
type Cell = string | 0
type Board = Cell[][]

interface Position {
  x: number
  y: number
}

interface Piece {
  shape: Cell[][]
  color: string
  position: Position
  type: TetrominoType
}

// Create an empty board
const createEmptyBoard = (): Board => {
  return Array(BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(0))
}

// Get a random tetromino
const getRandomTetromino = (): Piece => {
  const types = Object.keys(TETROMINOS) as TetrominoType[]
  const type = types[Math.floor(Math.random() * types.length)]
  const tetromino = TETROMINOS[type]

  return {
    shape: tetromino.shape,
    color: tetromino.color,
    position: { x: Math.floor(BOARD_WIDTH / 2) - 2, y: 0 },
    type,
  }
}

// Rotate a piece 90 degrees clockwise
const rotatePiece = (piece: Piece): Piece => {
  const newShape = piece.shape[0].map((_, index) =>
    piece.shape.map(row => row[index]).reverse()
  )
  return { ...piece, shape: newShape }
}

// Check if a piece collides with the board or boundaries
const checkCollision = (piece: Piece, board: Board, offset = { x: 0, y: 0 }): boolean => {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        const newX = piece.position.x + x + offset.x
        const newY = piece.position.y + y + offset.y

        // Check boundaries
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return true
        }

        // Check board collision
        if (newY >= 0 && board[newY][newX] !== 0) {
          return true
        }
      }
    }
  }
  return false
}

// Merge piece into board
const mergePieceToBoard = (piece: Piece, board: Board): Board => {
  const newBoard = board.map(row => [...row])

  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== 0) {
        const boardY = piece.position.y + y
        const boardX = piece.position.x + x
        if (boardY >= 0) {
          newBoard[boardY][boardX] = piece.shape[y][x]
        }
      }
    }
  }

  return newBoard
}

// Clear completed lines and return new board and number of lines cleared
const clearLines = (board: Board): { newBoard: Board; linesCleared: number } => {
  let linesCleared = 0
  const newBoard = board.filter(row => {
    if (row.every(cell => cell !== 0)) {
      linesCleared++
      return false
    }
    return true
  })

  // Add new empty rows at the top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(0))
  }

  return { newBoard, linesCleared }
}

export default function Tetris({ onReturn, skipAnimation = false }: TetrisProps) {
  const isMobile = useIsMobile()
  const [board, setBoard] = useState<Board>(createEmptyBoard())
  const [currentPiece, setCurrentPiece] = useState<Piece>(getRandomTetromino())
  const [nextPiece, setNextPiece] = useState<Piece>(getRandomTetromino())
  const [score, setScore] = useState(0)
  const [lines, setLines] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [dropSpeed, setDropSpeed] = useState(INITIAL_DROP_SPEED)

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)
  const lastMoveTime = useRef<number>(Date.now())

  // Move piece down
  const moveDown = useCallback(() => {
    if (gameOver || isPaused) return

    if (!checkCollision(currentPiece, board, { x: 0, y: 1 })) {
      setCurrentPiece(prev => ({
        ...prev,
        position: { ...prev.position, y: prev.position.y + 1 },
      }))
    } else {
      // Merge piece to board
      const newBoard = mergePieceToBoard(currentPiece, board)
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard)

      setBoard(clearedBoard)
      setLines(prev => prev + linesCleared)

      // Update score based on lines cleared
      if (linesCleared > 0) {
        const points = [0, 100, 300, 500, 800][linesCleared] * level
        setScore(prev => prev + points)
      }

      // Check if game over
      setCurrentPiece(nextPiece)
      setNextPiece(getRandomTetromino())

      if (checkCollision(nextPiece, clearedBoard)) {
        setGameOver(true)
      }
    }
  }, [currentPiece, board, gameOver, isPaused, nextPiece, level])

  // Move piece left
  const moveLeft = useCallback(() => {
    if (gameOver || isPaused) return

    if (!checkCollision(currentPiece, board, { x: -1, y: 0 })) {
      setCurrentPiece(prev => ({
        ...prev,
        position: { ...prev.position, x: prev.position.x - 1 },
      }))
    }
  }, [currentPiece, board, gameOver, isPaused])

  // Move piece right
  const moveRight = useCallback(() => {
    if (gameOver || isPaused) return

    if (!checkCollision(currentPiece, board, { x: 1, y: 0 })) {
      setCurrentPiece(prev => ({
        ...prev,
        position: { ...prev.position, x: prev.position.x + 1 },
      }))
    }
  }, [currentPiece, board, gameOver, isPaused])

  // Rotate piece
  const rotate = useCallback(() => {
    if (gameOver || isPaused) return

    const rotated = rotatePiece(currentPiece)
    if (!checkCollision(rotated, board)) {
      setCurrentPiece(rotated)
    }
  }, [currentPiece, board, gameOver, isPaused])

  // Hard drop
  const hardDrop = useCallback(() => {
    if (gameOver || isPaused) return

    let testPiece = { ...currentPiece }
    while (!checkCollision(testPiece, board, { x: 0, y: 1 })) {
      testPiece = {
        ...testPiece,
        position: { ...testPiece.position, y: testPiece.position.y + 1 },
      }
    }
    setCurrentPiece(testPiece)
    moveDown()
  }, [currentPiece, board, gameOver, isPaused, moveDown])

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard())
    setCurrentPiece(getRandomTetromino())
    setNextPiece(getRandomTetromino())
    setScore(0)
    setLines(0)
    setLevel(1)
    setGameOver(false)
    setIsPaused(false)
    setDropSpeed(INITIAL_DROP_SPEED)
  }, [])

  // Update level and speed based on lines
  useEffect(() => {
    const newLevel = Math.floor(lines / 10) + 1
    if (newLevel !== level) {
      setLevel(newLevel)
      setDropSpeed(Math.max(MIN_DROP_SPEED, INITIAL_DROP_SPEED - (newLevel - 1) * SPEED_INCREMENT))
    }
  }, [lines, level])

  // Game loop
  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = setInterval(() => {
        moveDown()
      }, dropSpeed)
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [moveDown, dropSpeed, gameOver, isPaused])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        return // Let parent handle return
      }

      // Prevent default behavior for game keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'p', 'P'].includes(e.key)) {
        e.preventDefault()
      }

      // Throttle movement to prevent too rapid inputs
      const now = Date.now()
      if (now - lastMoveTime.current < 50 && !['ArrowDown', ' '].includes(e.key)) {
        return
      }
      lastMoveTime.current = now

      switch (e.key) {
        case 'ArrowLeft':
          moveLeft()
          break
        case 'ArrowRight':
          moveRight()
          break
        case 'ArrowDown':
          moveDown()
          break
        case 'ArrowUp':
          rotate()
          break
        case ' ':
          hardDrop()
          break
        case 'p':
        case 'P':
          if (!gameOver) {
            setIsPaused(prev => !prev)
          }
          break
        case 'Enter':
          if (gameOver) {
            resetGame()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [moveLeft, moveRight, moveDown, rotate, hardDrop, gameOver, resetGame])

  // Render the board with the current piece
  const renderBoard = () => {
    // Create a copy of the board
    const displayBoard = board.map(row => [...row])

    // Add current piece to display board
    if (!gameOver) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== 0) {
            const boardY = currentPiece.position.y + y
            const boardX = currentPiece.position.x + x
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.shape[y][x]
            }
          }
        }
      }
    }

    return displayBoard
  }

  const displayBoard = renderBoard()

  return (
    <div className="tetris-game w-full">
      {/* Mobile-only notice for desktop */}
      {!isMobile && (
        <div className="mb-4 p-4 border border-yellow-500 bg-yellow-900/20">
          <p className="text-yellow-300 text-center mb-2">
            ~ This game is designed for mobile devices only ~
          </p>
          <p className="text-white text-center text-sm">
            Please visit this page on a mobile device to play!
          </p>
        </div>
      )}

      {/* Mobile Instructions */}
      {isMobile && (
        <div className="mb-3 text-white">
          <p className="text-yellow-300 mb-1 text-center">~ TETRIS - WESM.TECH Edition ~</p>
          <p className="text-xs text-center text-gray-300">
            ↑ Move Left | ↓ Move Right | &gt; Rotate | R Menu
          </p>
        </div>
      )}

      {/* Game container */}
      {isMobile && (
        <div className="flex flex-col items-center gap-4">
          {/* Score panel */}
          <div className="w-full flex justify-between text-xs mb-2 px-1">
            <div>
              <span className="text-yellow-300">Score:</span> {score}
            </div>
            <div>
              <span className="text-yellow-300">Lines:</span> {lines}
            </div>
            <div>
              <span className="text-yellow-300">Level:</span> {level}
            </div>
          </div>

          {/* Game board and next piece - ASCII style */}
          <div className="flex gap-3 items-start justify-center">
            {/* Main game board - ASCII */}
            <div className="flex flex-col font-mono text-xs leading-none" style={{ letterSpacing: '0' }}>
              {displayBoard.map((row, y) => (
                <div key={y} className="flex">
                  {row.map((cell, x) => (
                    <span
                      key={`${y}-${x}`}
                      style={{
                        color: cell !== 0 ? getCellColor(cell as string) : '#1e3a5f',
                      }}
                    >
                      {cell !== 0 ? '█' : '░'}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            {/* Next piece preview - ASCII */}
            <div className="flex flex-col gap-1">
              <div className="text-xs text-yellow-300 text-center">Next</div>
              <div className="flex flex-col font-mono text-xs leading-none" style={{ letterSpacing: '0' }}>
                {nextPiece.shape.map((row, y) => (
                  <div key={y} className="flex">
                    {row.map((cell, x) => (
                      <span
                        key={`next-${y}-${x}`}
                        style={{
                          color: cell !== 0 ? nextPiece.color : '#0f172a',
                        }}
                      >
                        {cell !== 0 ? '█' : ' '}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Game status */}
          {gameOver && (
            <div className="mt-2 p-3 border border-red-500 bg-red-900/20">
              <p className="text-red-300 text-center font-bold mb-1">GAME OVER!</p>
              <p className="text-white text-center text-sm">Score: {score}</p>
            </div>
          )}

          {isPaused && (
            <div className="mt-2 p-3 border border-yellow-500 bg-yellow-900/20">
              <p className="text-yellow-300 text-center font-bold">PAUSED</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Helper function to get cell color
function getCellColor(letter: string): string {
  const colors: { [key: string]: string } = {
    'W': '#fbbf24', // yellow
    'E': '#60a5fa', // blue
    'S': '#34d399', // green
    'M': '#f87171', // red
    'T': '#a78bfa', // purple
    'C': '#fb923c', // orange
    'H': '#ec4899', // pink
  }
  return colors[letter] || '#6b7280'
}
