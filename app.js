const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
ctx.setTransform(1, 0, 0, 1, 0, 0);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var FPS;
// resize the canvas to fill browser window dynamically
/* window.addEventListener("resize", resizeCanvas, false);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
	
}

resizeCanvas(); */
let colider = false;
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

var TIMESTEP = 3600 * 24; // 1 day

const globalMasses = {
  Sun: 1.98892e30,
  Earth: 5.9742e24,
  Mars: 6.39e23,
  Mercury: 0.33e24,
  Venus: 4.8685e24,
  Jupiter: 1.898e27,
  Saturn: 5.683e26,
  Uranus: 8.681e25,
  Neptune: 1.024e26
};

function changeSpeed(v) {
  document.querySelector("#range-value").innerHTML = (v*FPS/3600/24).toFixed(2);
  TIMESTEP = v;
}

class Planet {
  constructor(x, y, radius, color, mass, name) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.color = color;
    this.mass = mass;
    this.orbitalPeriod = ((4*Math.PI**2*Math.abs(x)**3)/(G*1.968*10**30))**0.5; // in seconds
    this.orbitalPeriod = this.orbitalPeriod==0?1:this.orbitalPeriod; // can not divide by 0
    
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
    this.y_vel = -((2*Math.PI)/this.orbitalPeriod) * x;
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
        ctx.strokeStyle = `${this.color.slice(0, this.color.length - 5)},${i / this.orbit.length
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
    ctx.beginPath()
    ctx.fillStyle = "white"
    ctx.font = `${20}px Arial`
    ctx.fillText(this.name, x + 13 + this.visualRadius, y + 7);
    ctx.fillStyle = `${this.color.slice(0, this.color.length - 5)},.4)`
    ctx.fillRect(x + 10 + this.visualRadius, y - 10, this.name.length * 14, 20)
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
      console.log(this.name, this.mass, "  ", other.name, other.mass)
      if (this.mass > other.mass) {
        this.mass += other.mass;
        //console.log(planets)
        planets.splice(planets.indexOf(other), 1);
        //console.log(planets)
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
      var attractionArr = this.attraction(planet);
      var fx = attractionArr[0];
      var fy = attractionArr[1];
      total_fx += fx;
      total_fy += fy;
    });


    this.x_vel += (total_fx / this.mass) * TIMESTEP;
    this.y_vel += (total_fy / this.mass) * TIMESTEP;


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

var mars = new Planet(
  -1.524 * AU,
  0,
  3389500,
  "rgba(255, 0, 0,255)",
  globalMasses.Mars,
  "Mars"
);

var mercury = new Planet(
  0.387 * AU,
  0,
  2439700,
  "rgba(102, 102, 153,255)",
  globalMasses.Mercury,
  "Mercury"
);

var venus = new Planet(
  0.723 * AU,
  0,
  6051800,
  "rgba(255, 255, 255,255)",
  globalMasses.Venus,
  "Venus"
);

var jupiter = new Planet(
  -5.2 * AU,
  0,
  69911000,
  "rgba(255, 165, 0,255)",
  globalMasses.Jupiter,
  "Jupiter"
);

var saturn = new Planet(
  -9.538 * AU,
  0,
  58232000,
  "rgba(255, 214, 0,255)",
  globalMasses.Saturn,
  "Saturn"
);

var uranus = new Planet(
  -19.8 * AU,
  0,
  25362000,
  "rgba(0, 224, 255,255)",
  globalMasses.Uranus,
  "Uranus"
);

var neptune = new Planet(
  -30 * AU,
  0,
  24622000,
  "rgba(0, 133, 255,255)",
  globalMasses.Neptune,
  "Neptune"
);

var planets = [sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune];

function render() {
  if (scale < 1)
    ctx.clearRect(
      (-WIDTH - posX) / scale,
      (-HEIGHT - posY) / scale,
      2 * WIDTH ** (1 / scale),
      2 * HEIGHT ** (1 / scale)
    );
  else ctx.clearRect(-WIDTH, -HEIGHT, 2 * WIDTH, 2 * HEIGHT);
  /*  ctx.clearRect(-posX / scale, -posY / scale, visibleWidth + visibleWidth / scale, visibleHeight + visibleHeight / scale);
   ctx.beginPath()
   ctx.fillRect(-posX, -posY, 10, 10)
   ctx.beginPath()
   ctx.fillRect(posX + canvas.width, posY + canvas.height, 10, 10) */
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
  FPS++;
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
  console.log(newVel, key);
  planets[key].x_vel =
    Math.cos(Math.atan2(planets[key].y_vel, planets[key].x_vel)) * newVel;
  planets[key].y_vel =
    Math.sin(Math.atan2(planets[key].y_vel, planets[key].x_vel)) * newVel;
}
