const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
ctx.setTransform(1, 0, 0, 1, 0, 0);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// resize the canvas to fill browser window dynamically
/* window.addEventListener("resize", resizeCanvas, false);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
	
}

resizeCanvas(); */
let colider = false;
let lightSpeedLimit = false;

let HEIGHT = canvas.height;
let WIDTH = canvas.width;

//visual variables
let scale = 1;
let originx = 0;
let originy = 0;
let visibleWidth = WIDTH;
let visibleHeight = HEIGHT;
const zoomIntensity = 0.2;

const AU = 149.6e6 * 1000; // in m
const G = 6.67428e-11;
const SCALE = 200 / AU; // 1 AU = 100 pixels
const LIGHTSPEED = 299792458; //ms

var TIMESTEP = 3600 * 24; // 1 day

const globalMasses = {
  Sun: 1.98892e30,
  Earth: 5.9742e24,
  Mars: 6.39e23,
  Mercury: 0.33e24,
  Venus: 4.8685e24,
};

function changeSpeed(v) {
  document.querySelector("#range-value").innerHTML = v;
  TIMESTEP = v;
}

class Planet {
  constructor(x, y, radius, color, mass, name) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
    this.mass = mass;
    try {
      this.visualRadius = Math.abs(
        18 * (Math.log10(this.mass) - 23) ** 0.3 - 5
      ); //function that calculates visual visualRadius
    } catch (error) {
      this.visualRadius = 10;
    }
    this.radius = radius;

    this.orbit = [];
    this.sun = false;
    this.orbit_visualRadius = 0;

    this.x_vel = 0;
    this.y_vel = 0;
  }

  draw() {
    var x = this.x * SCALE + WIDTH / 2;
    var y = this.y * SCALE + HEIGHT / 2;
    const num = parseInt((300 * 3600 * 24) / TIMESTEP);
    //console.log(num);
    if (this.orbit.length > num)
      this.orbit = this.orbit.slice(
        this.orbit.length - num,
        this.orbit.length - 1
      );
    //this.orbit.forEach((point) => {
    for (let i = 0; i < this.orbit.length; i++) {
      var point = this.orbit[i];
      if (i != 0) {
        var prevPoint = this.orbit[i - 1];
        ctx.beginPath();
        ctx.strokeStyle = `${this.color.slice(0, this.color.length - 5)},${
          i / this.orbit.length
        })`;
        ctx.moveTo(point[0] * SCALE + WIDTH / 2, point[1] * SCALE + HEIGHT / 2);
        ctx.lineTo(
          prevPoint[0] * SCALE + WIDTH / 2,
          prevPoint[1] * SCALE + HEIGHT / 2
        );
        ctx.stroke();
      }
    }
    //});

    circle(x, y, this.visualRadius, this.color);
  }

  attraction(other) {
    var other_x = other.x;
    var other_y = other.y;
    var distance_x = other_x - this.x;
    var distance_y = other_y - this.y;
    var distance = (distance_x ** 2 + distance_y ** 2) ** 0.5;

    if (distance < (other.radius + this.radius) ** 1.15 && colider) {
      //checking if colides with another planet
      console.log("colide");
      if (this.mass > other.mass) {
        this.mass += other.mass;
        planets.splice(planets.indexOf(other), 1);
      }
    }

    if (other.sun) this.orbit_visualRadius = distance;

    var force = (G * this.mass * other.mass) / distance ** 2;
    var angle = Math.atan2(distance_y, distance_x);
    var force_x = Math.cos(angle) * force;
    var force_y = Math.sin(angle) * force;

    return [force_x, force_y];
  }

  updatePosition(planets) {
    var total_fx = 0;
    var total_fy = 0;

    planets.forEach((planet) => {
      if (this == planet) {
        return;
      }

      var fx = this.attraction(planet)[0];
      var fy = this.attraction(planet)[1];
      total_fx += fx;
      total_fy += fy;
    });

    //if (!(((this.x_vel + total_fx / this.mass) ** 2 + (this.y_vel + (total_fy / this.mass)) ** 2) ** 0.5 > LIGHTSPEED && lightSpeedLimit)) { // check if speed is aboce light speed
    this.x_vel += (total_fx / this.mass) * TIMESTEP;
    this.y_vel += (total_fy / this.mass) * TIMESTEP;
    //}

    //show value in textbox
    var input = document.querySelector(
      `.inputv-planet-${planets.indexOf(this)}`
    );
    if (
      input !== document.activeElement &&
      document.activeElement !==
        document.getElementById(
          `apply-button-${planets.indexOf(this)}`
        ) /*&& document.activeElement !== document.getElementById(`mass-input-${planets.indexOf(this)}`)*/
    ) {
      input.value = ((this.x_vel ** 2 + this.y_vel ** 2) ** 0.5 / 1000).toFixed(
        5
      );
    }
    //end show value in textbox

    this.x += this.x_vel * TIMESTEP;
    this.y += this.y_vel * TIMESTEP;
    this.orbit.push([this.x, this.y]);
  }
}

var sun = new Planet(
  0,
  0,
  696340000,
  "rgba(255,255,0,255)",
  globalMasses.Sun,
  "Sun"
);
sun.sun = true;

var earth = new Planet(
  -1 * AU,
  0,
  6371000,
  "rgba(0, 153, 255,255)",
  globalMasses.Earth,
  "Earth"
);
earth.y_vel = 29.783 * 1000;

var mars = new Planet(
  -1.524 * AU,
  0,
  3389500,
  "rgba(255, 0, 0,255)",
  globalMasses.Mars,
  "Mars"
);
mars.y_vel = 24.077 * 1000;

var mercury = new Planet(
  0.387 * AU,
  0,
  2439700,
  "rgba(102, 102, 153,255)",
  globalMasses.Mercury,
  "Mercury"
);
mercury.y_vel = -47.4 * 1000;

var venus = new Planet(
  0.723 * AU,
  0,
  6051800,
  "rgba(255, 255, 255,255)",
  globalMasses.Venus,
  "Venus"
);
venus.y_vel = -35.02 * 1000;

var planets = [sun, mercury, venus, earth, mars];

function render() {
  if (scale < 1)
    ctx.clearRect(
      (-WIDTH - posX) / scale,
      (-HEIGHT - posY) / scale,
      2 * WIDTH ** (1 / scale),
      2 * HEIGHT ** (1 / scale)
    );
  else ctx.clearRect(-WIDTH, -HEIGHT, 2 * WIDTH, 2 * HEIGHT);
  planets.forEach((planet) => {
    planet.updatePosition(planets);
    planet.draw();
  });
}
let dragging = false;
let generalMouseX = 0;
let generalMouseY = 0;
let posX = 0;
let posY = 0;

canvas.addEventListener("mousedown", (event) => {
  generalMouseY = event.clientY - canvas.offsetTop;
  generalMouseX = event.clientX - canvas.offsetLeft;
  dragging = true;
  //dragging = setInterval(applyView, 10,event);
});
canvas.addEventListener("mouseup", () => {
  dragging = false;
  //clearInterval(dragging)
});
canvas.onmousemove = (e) => {
  applyView(e);
  /* sleep(10) */
};
canvas.onmouseleave = () => {
  dragging = false;
};
function applyView(event) {
  if (!dragging) return;
  const mousey = event.clientY - generalMouseY;
  const mousex = event.clientX - generalMouseX;

  //ctx.translate(originx, originy);

  /*  originx -= mousex / (scale * zoom) - mousex / scale;
  originy -= mousey / (scale * zoom) - mousey / scale;  */

  //console.log((mousex - WIDTH / 2) * -1, (mousey - HEIGHT / 2) * -1);
  posX += mousex;
  posY += mousey;
  //console.log(posX, posY);
  ctx.translate(mousex / scale, mousey / scale);
  generalMouseY = mousey + event.clientY;
  generalMouseX = mousex + event.clientX;

  //ctx.translate(x,y);
}

function zoom(event, zoomin = false) {
  var wheel = 1;
  if (event === null) {
    wheel = zoomin ? 1 : -1;
  } else {
    event.preventDefault();
    wheel = event.deltaY < 0 ? 1 : -1;
    if (scale < 0.05 && wheel <= 0) return;
    if (scale >= 1 && wheel >= 1) {
      scale = 1;
      return;
    }
  }

  /*  const mousex = event.clientX - canvas.offsetLeft;
  const mousey = event.clientY - canvas.offsetTop; */

  const zoom = Math.exp(wheel * zoomIntensity);

  originx = WIDTH / 2 - posX;
  originy = HEIGHT / 2 - posY;

  //ctx.translate(originx, originy);
  ctx.translate(originx, originy);
  //ctx.translate(WIDTH / 2, HEIGHT / 2);

  /* originx -= mousex / (scale * zoom) - mousex / scale;
  originy -= mousey / (scale * zoom) - mousey / scale; */

  ctx.scale(zoom, zoom);

  //ctx.translate(-originx, -originy);
  ctx.translate(-originx, -originy);
  //ctx.translate(-WIDTH / 2, -HEIGHT / 2);

  scale *= zoom;
  visibleWidth = WIDTH / scale;
  visibleHeight = HEIGHT / scale;
}
canvas.onwheel = (e) => zoom(e);

function main() {
  render();

  window.requestAnimationFrame(main);
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function circle(x, y, r, c) {
  ctx.beginPath();
  ctx.fillStyle = c;
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fill();
}

function changePlanetSpeed(key, newVel) {
  newVel *= 1000;
  if (newVel < LIGHTSPEED) {
    console.log(newVel, key);
    planets[key].x_vel =
      Math.cos(Math.atan2(planets[key].y_vel, planets[key].x_vel)) * newVel;
    planets[key].y_vel =
      Math.sin(Math.atan2(planets[key].y_vel, planets[key].x_vel)) * newVel;
  }
}
