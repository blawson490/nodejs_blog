document.addEventListener("DOMContentLoaded", function () {
  const allButtons = document.querySelectorAll(".searchBtn");
  const searchBar = document.querySelector(".searchBar");
  const searchInput = document.getElementById("searchInput");

  for (var i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener("click", function () {
      searchBar.style.opacity = "1";
      searchBar.classList.add("open");
      this.setAttribute("aria-expanded", "true");
      searchInput.focus();
    });
  }

  searchInput.addEventListener("blur", function () {
    searchBar.style.opacity = "0";
    setTimeout(() => searchBar.classList.remove("open"), 500);
    this.setAttribute("aria-expanded", "false");
  });

  // Service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('../js/service-worker.js').then(function(registration) {
      }, function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }

  const typeStrings = ["Weclo", "Welcome tomy b", "Welcome to my blog. "];

  let stringIndex = 0;
  let charIndex = 0;

  function type() {
    const typedOutput = document.getElementById("typed-output");
    if (typedOutput) {
      if (charIndex < typeStrings[stringIndex].length) {
        typedOutput.innerText += typeStrings[stringIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, 100);
      } else if (stringIndex < typeStrings.length - 1) {
        setTimeout(erase, 100);
      }
    }
  }

  function erase() {
    const nextString = typeStrings[stringIndex + 1] || typeStrings[0];
    const currentString = document.getElementById("typed-output").innerText;

    if (currentString !== nextString.slice(0, currentString.length)) {
      let text = document.getElementById("typed-output").innerText;
      document.getElementById("typed-output").innerText = text.substr(
        0,
        charIndex - 1
      );
      charIndex--;
      setTimeout(erase, 100);
    } else {
      stringIndex++;
      if (stringIndex >= typeStrings.length) {
        stringIndex = 0;
      }
      setTimeout(type, 500);
    }
  }

  window.onload = type;

  // Favicon

  function generateFavicon() {
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");
  
    ctx.fillStyle = "#FAF5EE";
    ctx.fillRect(0, 0, 100, 100);
  
    const radius = 15;
    ctx.clearRect(0, 0, radius, radius);
    ctx.clearRect(100 - radius, 0, radius, radius);
    ctx.clearRect(0, 100 - radius, radius, radius);
    ctx.clearRect(100 - radius, 100 - radius, radius, radius);
  
    ctx.fillStyle = "black";
    ctx.font = "300 60px Poppins";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("B", canvas.width / 2, canvas.height / 2);
  
    return canvas.toDataURL();
  }
  
  const faviconDataURL = generateFavicon();
  
  function setFavicon(dataURL) {
    let link =
      document.querySelector('link[rel*="icon"]') ||
      document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = dataURL;
    document.getElementsByTagName("head")[0].appendChild(link);
  }
  
  setFavicon(faviconDataURL);

  // apple-touch-icon
  function generateAppleTouchIcon() {
    const canvas = document.createElement("canvas");
    canvas.width = 180;
    canvas.height = 180;
    const ctx = canvas.getContext("2d");
  
    ctx.fillStyle = "#FAF5EE";
    ctx.fillRect(0, 0, 180, 180);
  
    const radius = 15;
    ctx.clearRect(0, 0, radius, radius);
    ctx.clearRect(180 - radius, 0, radius, radius);
    ctx.clearRect(0, 180 - radius, radius, radius);
    ctx.clearRect(180 - radius, 180 - radius, radius, radius);
  
    ctx.fillStyle = "black";
    ctx.font = "300 60px Poppins";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("B", canvas.width / 2, canvas.height / 2);
  
    return canvas.toDataURL();
  }
  
  const appleTouchIconDataURL = generateAppleTouchIcon();
  function setAppleTouchIcon(dataURL) {
    let link =
      document.querySelector('link[rel="apple-touch-icon"]') ||
      document.createElement("link");
    link.rel = "apple-touch-icon";
    link.href = dataURL;
    document.getElementsByTagName("head")[0].appendChild(link);
  }
  
  setAppleTouchIcon(appleTouchIconDataURL);

});
