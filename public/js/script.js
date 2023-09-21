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

  const typeStrings = ["Weclo", "Welcome tomy b", "Welcome to my blog. "];

  let stringIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < typeStrings[stringIndex].length) {
      document.getElementById("typed-output").innerText +=
        typeStrings[stringIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, 100);
    } else if (stringIndex < typeStrings.length - 1) {
      // Check if it's not the last string
      setTimeout(erase, 100);
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
});
