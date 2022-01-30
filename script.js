class Snake {
  constructor() {
    this.size = 10
    this.color = 'red'
    this.body = []
  }

  spawn(width, height) {
    const x = Math.floor(Math.random() * width - this.size)
    const y = Math.floor(Math.random() * height - this.size)
    this.body = [[x - (x % this.size), y - (y % this.size)]]
  }
}

class Apple {
  constructor() {
    this.position
    this.color = 'green'
    this.size = 10
    this.x
    this.y
  }

  spawn(width, height) {
    const x = Math.floor(Math.random() * width) - this.size
    const y = Math.floor(Math.random() * height) - this.size
    this.x = x - (x % this.size)
    this.y = y - (y % this.size)
  }
}

function onKeydown(event) {
  switch (event.key) {
    case 'd':
    case 'ArrowRight':
      // Go right
      if (direction === 'left') return
      direction = 'right'
      break;
    case 'q':
    case 'a':
    case 'ArrowLeft':
      // Go left
      if (direction === 'right') return
      direction = 'left'
      break;
    case 's':
    case 'ArrowDown':
      // Go down
      if (direction === 'up') return
      direction = 'down'
      break;
    case 'z':
    case 'w':
    case 'ArrowUp':
      // Go up
      if (direction === 'down') return
      direction = 'up'
      break;
  }
}

function drawSnake() {
  ctx.fillStyle = snake.color
  ctx.fillRect(snake.body[0][0], snake.body[0][1], snake.size, snake.size)
}

function spawnSnake() {
  snake.spawn(width, height)
  drawSnake()
}

function spawnApple() {
  // Spawn apple
  apple.spawn(width, height)

  // Get snake body coordinates
  const snakeBody = snake.body.flat()

  // Prevent apple from spawning on snake body
  for (let i = 0; i < snakeBody.length; i += 2) {
    if (snakeBody[i] === apple.x && snakeBody[i + 1] === apple.y) {
      spawnApple()
    }
  }

  // Draw apple on canvas
  ctx.fillStyle = apple.color
  ctx.fillRect(apple.x, apple.y, apple.size, apple.size)
}

function restart() {
  // Clear score
  score = 0

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  updateScore()
  spawnSnake()
  spawnApple()
}

function updateScore() {
  scoreLabel.innerText = `Score: ${score}`
}

// Grab canvas
const canvas = document.getElementById('canvas')

// Grab score
const scoreLabel = document.getElementById('score')

// Get context
const ctx = canvas.getContext('2d')

// Initialize canvas size
const width = 1080
const height = 500

// Create snake object
const snake = new Snake()

// Create apple object
const apple = new Apple()

// Initialize direction
let direction = 'right'

// Initialize game speed (in ms)
let speed = 50

// Initialize score
let score = 0

// Detect user press on key
document.addEventListener('keydown', onKeydown);

// Set canvas size
canvas.width = width
canvas.height = height

// Draw items on canvas
spawnApple()
spawnSnake()

// Game loop
setInterval(() => {

  const previousHead = [...snake.body[0]]

  switch (direction) {
    case 'right':
      // Move head to right
      snake.body.splice(0, 0, [previousHead[0] += snake.size, previousHead[1]])
      break;
    case 'left':
      // Move head to left
      snake.body.splice(0, 0, [previousHead[0] -= snake.size, previousHead[1]])
      break;
    case 'down':
      // Move head to down
      snake.body.splice(0, 0, [previousHead[0], previousHead[1] += snake.size])
      break;
    case 'up':
      // Move head to up
      snake.body.splice(0, 0, [previousHead[0], previousHead[1] -= snake.size])
      break;
  }

  drawSnake()

  // Grab snake head to detect collision
  const head = snake.body[0]

  // Detect wall collision
  if (head[0] < 0 || head[0] >= width || head[1] < 0 || head[1] >= height) {
    alert('Game over')
    restart()
    return
  }

  // Detect snake bite itself
  if (snake.body.slice(1).some(position => {
    return position[0] === head[0] && position[1] === head[1]
  })) {
    alert('You just killed yourself')
    restart()
    return
  }

  // Detect eaten apple
  if (head[0] === apple.x && head[1] === apple.y) {
    score += 1
    updateScore()
    spawnApple()
    return
  }

  // Remove previous tail
  const previousTail = snake.body.pop()
  ctx.clearRect(previousTail[0], previousTail[1], snake.size, snake.size)

}, speed)
