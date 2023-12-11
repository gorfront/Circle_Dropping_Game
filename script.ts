const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const circles: Circle[] = [];
const maxCircles = 15;

function getRandomColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

class Circle {
  x: number;
  y: number;
  radius: number;
  velocityY: number;
  dampening: number;
  color: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    this.velocityY = 0;
    this.dampening = 0.85;
    this.color = getRandomColor();
  }

  update(deltaTime: number) {
    this.velocityY += 0.3 * deltaTime;
    this.y += this.velocityY;

    if (this.y + this.radius > canvas.height) {
      this.y = canvas.height - this.radius;
      this.velocityY *= -this.dampening;
    }
  }

  drawWithTrail() {
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    this.draw();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}

function handleMouseClick(event: MouseEvent) {
  if (circles.length < maxCircles) {
    const newCircle = new Circle(
      event.clientX - canvas.offsetLeft,
      event.clientY - canvas.offsetTop
    );
    circles.push(newCircle);
  }
}

document.addEventListener("click", handleMouseClick);

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    circles.forEach(
      (circle) =>
        (circle.dampening =
          event.key === "ArrowUp"
            ? Math.min(0.95, circle.dampening + 0.05)
            : Math.max(0.1, circle.dampening - 0.05))
    );
  }
}

document.addEventListener("keydown", handleKeyPress);

let lastTime = 0;
function tick(currentTime: number) {
  const deltaTime = (currentTime - lastTime) / 1000;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  circles.forEach((circle) => {
    circle.update(deltaTime);
    circle.drawWithTrail();
  });

  lastTime = currentTime;
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
