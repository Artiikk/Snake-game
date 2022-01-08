const canvas = document.getElementById('canvas')
const canvasContext = canvas.getContext('2d')

const colorMap = {
  red: '#e11',
  green: '#00FF42',
  white: '#fff',
  black: '#000'
}

const directionMap = {
  right: 'RIGHT',
  left: 'LEFT',
  down: 'DOWN',
  up: 'UP'
}

const RECT_SIZE = 10
const DEFAULT_FONT = '20px Arial'

class Snake {
  constructor(x = 0, y = 0, size = RECT_SIZE) {
    this.size = size
    this.tail = [{ x, y }]
    this.directionX = null
    this.directionY = directionMap.down
  }

  move() {
    let newRect = {}
    const head = this.tail[this.tail.length - 1]

    const TURN_RIGHT = this.directionX === directionMap.right
    const TURN_LEFT = this.directionX === directionMap.left
    const TURN_DOWN = this.directionY === directionMap.down
    const TURN_UP = this.directionY === directionMap.up

    if (TURN_RIGHT) {
      newRect = { x: head.x + this.size, y: head.y }
    }
    if (TURN_LEFT) {
      newRect = { x: head.x - this.size, y: head.y }
    } 
    if (TURN_DOWN) {
      newRect = { x: head.x, y: head.y + this.size }
    } 
    if (TURN_UP) {
      newRect = { x: head.x, y: head.y - this.size }
    }

    this.tail.shift()
    this.tail.push(newRect)
  }
}

class Apple {
  constructor() {
    this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size
    this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size
    this.color = colorMap.red
    this.size = RECT_SIZE
  }
}

let snake = new Snake()
let apple = new Apple()

function drawRect(x, y, width, height, color) {
  canvasContext.fillStyle = color
  canvasContext.fillRect(x, y, width, height)
}

function eatApple() {
  const head = snake.tail[snake.tail.length - 1]

  if (head.x === apple.x && head.y === apple.y) {
    snake.tail[snake.tail.length] = { x: apple.x, y: apple.y }
    apple = new Apple()
  }
}

function checkForLose() {
  const head = snake.tail[snake.tail.length - 1]

  const RIGHT_OVERFLOW = head.x >= canvas.width
  const BOTTOM_OVERFLOW = head.y >= canvas.height
  const LEFT_OVERFLOW = head.x < 0
  const TOP_OVERFLOW = head.y < 0
  const BORDERS_OVERFLOW = RIGHT_OVERFLOW || BOTTOM_OVERFLOW || LEFT_OVERFLOW || TOP_OVERFLOW

  const newTail = JSON.parse(JSON.stringify(snake.tail))
  newTail.pop()
  const SNAKE_OVERFLOW = JSON.stringify(newTail).includes(JSON.stringify(head))

  if (BORDERS_OVERFLOW || SNAKE_OVERFLOW) {
    const answer = confirm('You lose :( \nTry again?')
    if (answer) {
      snake = new Snake()
      apple = new Apple()

      gameLoop()
    } else {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height)
      clearInterval(intervalId)
    }
  }
}

function update() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height)
  snake.move()
  checkForLose()
  eatApple()
}

function draw() {
  drawRect(0, 0, canvas.width, canvas.height, colorMap.black)

  for (let i = 0; i < snake.tail.length; i++) {
    drawRect(snake.tail[i].x, snake.tail[i].y, snake.size, snake.size, colorMap.white)
  }

  canvasContext.font = DEFAULT_FONT
  canvasContext.fillStyle = colorMap.green
  canvasContext.fillText('Score: ' + (snake.tail.length - 1), canvas.width - 100, 20)
  drawRect(apple.x, apple.y, apple.size, apple.size, apple.color)
}

function main() {
  update()
  draw()
}

let intervalId
function gameLoop() {
  clearInterval(intervalId)
  intervalId = setInterval(main, 1000/10)
}

window.addEventListener('keydown', ({ key }) => {
  switch(key) {
    case 'ArrowLeft':
      if (snake.directionX !== directionMap.right) {
        snake.directionX = directionMap.left
        snake.directionY = null
      }
      break
    case 'ArrowRight':
      if (snake.directionX !== directionMap.left) {
        snake.directionX = directionMap.right
        snake.directionY = null
      }
      break
    case 'ArrowUp':
      if (snake.directionY !== directionMap.down) {
        snake.directionY = directionMap.up
        snake.directionX = null
      }
      break
    case 'ArrowDown':
      if (snake.directionY !== directionMap.up) {
        snake.directionY = directionMap.down
        snake.directionX = null
      }
      break
  }
})

window.onload = () => gameLoop()