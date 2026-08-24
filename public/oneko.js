(function () {
  if (document.getElementById("oneko")) return;

  const cat = document.createElement("div");
  cat.id = "oneko";
  cat.textContent = "🐈";
  Object.assign(cat.style, {
    position: "fixed",
    left: "0px",
    top: "0px",
    fontSize: "20px",
    pointerEvents: "none",
    zIndex: "45",
    transform: "translate(-50%, -50%)",
    filter: "grayscale(1)",
  });

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let targetX = x;
  let targetY = y;

  document.addEventListener("mousemove", function (event) {
    targetX = event.clientX + 18;
    targetY = event.clientY + 18;
  });

  function tick() {
    x += (targetX - x) * 0.12;
    y += (targetY - y) * 0.12;
    cat.style.left = x + "px";
    cat.style.top = y + "px";
    requestAnimationFrame(tick);
  }

  document.body.appendChild(cat);
  requestAnimationFrame(tick);
})();
