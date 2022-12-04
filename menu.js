const menu = document.querySelector("#menu");
if (document.querySelector("#menu").className.includes("show"))
	document.querySelector("#button-menu").innerHTML = ">";
else document.querySelector("#button-menu").innerHTML = "<";

document.querySelector("#button-menu").addEventListener("click", () => {
	menu.classList.toggle("show");
	console.log(document.querySelector("#menu").className);
	if (document.querySelector("#menu").className.includes("show"))
		document.querySelector("#button-menu").innerHTML = ">";
	else document.querySelector("#button-menu").innerHTML = "<";
});

var planetList = document.querySelector(".planet-list");
planets.forEach((planet,key) => {
	document.querySelector(".planet-list .accordion").innerHTML += `
 
  <div class="accordion-item">
    <h2 class="accordion-header" id="flush-heading${key}">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${key}" aria-expanded="false" aria-controls="flush-collapse${key}">
      ${planet.name}
      </button>
    </h2>
    <div id="flush-collapse${key}" class="accordion-collapse collapse" aria-labelledby="flush-heading${key}" data-bs-parent="#accordionFlushExample">
      <div class="accordion-body">Placeholder content for this accordion, which is intended to demonstrate the <code>.accordion-flush</code> class. This is the first item's accordion body.</div>
    </div>
  </div>
    `;
});
