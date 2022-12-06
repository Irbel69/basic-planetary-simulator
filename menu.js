const menu = document.querySelector("#menu");
if (document.querySelector("#menu").className.includes("show")) {
  document.querySelector("#button-menu").innerHTML = ">";
  document.querySelector("#button-menu").classList.add("showbutton");
} else {
  document.querySelector("#button-menu").innerHTML = "<";
  document.querySelector("#button-menu").classList.remove("showbutton");
}

document.querySelector("#button-menu").addEventListener("click", () => {
  menu.classList.toggle("show");
  //console.log(document.querySelector("#menu").className);
  if (document.querySelector("#menu").className.includes("show")) {
    document.querySelector("#button-menu").innerHTML = ">";
    document.querySelector("#button-menu").classList.add("showbutton");
  } else {
    document.querySelector("#button-menu").innerHTML = "<";
    document.querySelector("#button-menu").classList.remove("showbutton");
  }
});
var selectionfocusvalue = 0;
function apply(key) {
  
  document.activeElement.blur();
  const globalMasses = {
    Sun: 1.98892e30,
    Earth: 5.9742e24,
    Mars: 6.39e23,
    Mercury: 0.33e24,
    Venus: 4.8685e24,
  };

  var inp = document.querySelector(`input.planet-${key}`);
  var select = document.querySelector(`select.planet-${key}`);

  if (select.value === "kg") values[planets[key].name] = inp.value;
  else values[planets[key].name] = inp.value * globalMasses[select.value];
  planets[key].mass =
    (values[planets[key].name] / globalMasses[planets[key].name]) *
    globalMasses[planets[key].name];
  console.log(values[planets[key].name]);
  //change velocities
  changePlanetSpeed(
    key,
    parseFloat(document.querySelector(`.inputv-planet-${key}`).value)
  );
}

function selection(key) {
  var inp = document.querySelector(`input.planet-${key}`);
  var select = document.querySelector(`select.planet-${key}`);
  console.log(select.value);
  console.log(selectionfocusvalue);


  console.log(selectionfocusvalue);
  if (selectionfocusvalue !== "kg" && select.value === planets[key].name) {
    values[planets[key].name] = inp.value * globalMasses[selectionfocusvalue]
    inp.value = values[planets[key].name] / globalMasses[planets[key].name]

  } 
  
  
  else if (select.value === "kg") {
    if (selectionfocusvalue === "kg" && select.value !== planets[key].name)
      values[planets[key].name] = inp.value * globalMasses[planets[key].name];
    else {
      values[planets[key].name] = inp.value * globalMasses[selectionfocusvalue];
    }
    inp.value = values[planets[key].name];
  } else {
    if (selectionfocusvalue !== "kg") {
      console.log(globalMasses[select.value]);
      if (
        //selectionfocusvalue !== planets[key].name &&
        select.value !== planets[key].name
      )
        values[planets[key].name] =
          inp.value * globalMasses[selectionfocusvalue];
      else values[planets[key].name] = inp.value;
      if (select.value !== planets[key].name) {
        inp.value = values[planets[key].name] / globalMasses[select.value];
      } else
        inp.value =
          values[planets[key].name] / globalMasses[selectionfocusvalue];
    } else {
      if (select.value !== planets[key].name) {
        inp.value = values[planets[key].name] / globalMasses[select.value];
      } else {
        inp.value = values[planets[key].name] / globalMasses[planets[key].name];
      }
    }
  }

  console.log({ selectionfocusvalue, select: select.value, inp: inp.value });
  
  console.log(values);
  select.blur();
}
function selectionfocus(value) {
  console.log("EPPPPPPPPPP");
  selectionfocusvalue = value;
}
const values = {
  Sun: 1.98892e30,
  Earth: 5.9742e24,
  Mars: 6.39e23,
  Mercury: 0.33e24,
  Venus: 4.8685e24,
};
var planetList = document.querySelector(".planet-list");
planets.forEach((planet, key) => {
  var mass = planet.mass;
  var velocity = (planet.x_vel ** 2 + planet.y_vel ** 2) ** 0.5;
  const globalMasses = {
    Sun: 1.98892e30,
    Earth: 5.9742e24,
    Mars: 6.39e23,
    Mercury: 0.33e24,
    Venus: 4.8685e24,
  };

  document.querySelector(".planet-list .accordion").innerHTML += `
 
  <div class="accordion-item">
    <h2 class="accordion-header" id="flush-heading${key}">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${key}" aria-expanded="false" aria-controls="flush-collapse${key}">
      ${planet.name}
      </button>
    </h2>
    <div id="flush-collapse${key}" class="accordion-collapse collapse show" aria-labelledby="flush-heading${key}" data-bs-parent="#accordionFlushExample">
      <div class="accordion-body">
      <div class="inputgroup"><input type="number" min="0" step="${
        globalMasses[planet.name] / 100
      }" class="input planet-${key}" id="mass-input-${key}" value="${
    globalMasses[planet.name]
  }"></input><select onfocus="selectionfocus(value)" onchange="selection(${key})" class="input2 planet-${key}">
        <option value='kg' style="text-align:center;">kg</option>
        ${planets.map((val) => {
          return `<option value='${val.name}' style="text-align:center;">${val.name}</option>`;
        })}
      </select></div>
      <div class="inputgroup"><input class="input inputv-planet-${key}" disabled type="number" step="1" value="${
    (planet.x_vel ** 2 + planet.y_vel ** 2) ** 0.5 / 1000
  }"></input><div class="addVelocityDiv"><button>+</button><button>-</button></div><p class="input2">km/s</p></div>
      <div class="applybuttondiv"><button class="apply-button" id="apply-button-${key}" onclick="apply(${key})")>🪐 Apply!</button></div>
      </div>
    </div>
  </div>
    `;
});

var btn = document.querySelector(".play-pause-button");

btn.addEventListener("click", function () {
  btn.classList.toggle("paused");

  console.log(btn.value);
  if (btn.classList.contains("paused")) {
    TIMESTEP = parseInt(document.querySelector("#range-value").innerHTML);
    console.log("a");
  } else {
    TIMESTEP = 0;
    console.log("b");
  }
});
