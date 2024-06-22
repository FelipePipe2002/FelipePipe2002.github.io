let terminal = document.querySelector("#console");
let console_header = document.querySelector("#console-header");
let console_body = document.querySelector("#console-body");
let content = document.querySelector("#content");
let textarea = document.querySelector("#command");
let commands = {};

fetch("comandos/comandos.json")
  .then((response) => response.json())
  .then((data) => {
    commands = data.commands;
    for (let key in commands) {
      console.log(commands[key].name);
      if (commands[key].name === "about") {
        separateCommands("", commands[key].usage);
        break;
      }
    }
  })
  .catch((error) => {
    console.error("Error fetching JSON:", error);
  });

//console movement
movableWindow = (object,event) => {
  shiftX =
    event.clientX -
    object.getBoundingClientRect().left +
    window.innerWidth / 2;
  shiftY =
    event.clientY -
    object.getBoundingClientRect().top +
    window.innerHeight / 2;

  function moveAt(pageX, pageY) {
    object.style.transform = `translate(${pageX - shiftX}px,${Math.max(
      pageY - shiftY,
      -window.innerHeight / 2 + 10
    )}px)`;
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  document.addEventListener("mousemove", onMouseMove);

  window.addEventListener("pagehide", function () {
    document.removeEventListener("mousemove", onMouseMove);
  });

  window.addEventListener("pageshow", function () {
    document.removeEventListener("mousemove", onMouseMove);
  });

  object.addEventListener("mouseup", function () {
    document.removeEventListener("mousemove", onMouseMove);
  });
}

console_header.addEventListener("mousedown", function(event) {
  movableWindow(terminal, event);
});

textarea.value = "C:\\FelipePipe\\Portafolio> ";
commands_history = [];
let index = 0;
textarea.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    let input = sanitize(textarea.value);
    content.innerHTML += `<p>${input}</p>`;
    let end = input.indexOf(" ", 29); //29 is the length of the initial string and find the space after the command
    let command = input.substring(29, end);
    if (end === -1) {
      command = input.substring(29);
    }
    commands_history.push(input.substring(29));
    index = commands_history.length;

    let foundCommand = false;
    for (let key in commands) {
      if (commands[key].name === command) {
        let args = input.substring(end + 1);
        if (end === -1) {
          args = "<br>";
        }
        separateCommands(args, commands[key].usage);
        foundCommand = true;
        break;
      }
    }
    if (!foundCommand) {
      content.innerHTML += `<p>'${command}' is not recognized as an internal or external command, use "help" to see the list of commands</p> <br>`;
    }

    restartCommandInput();
    console_body.scrollTo(0, console_body.scrollHeight);
  }
  if (event.key === "Tab") {
    event.preventDefault();
    autocomplete();
  }
  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (index > 0) {
      index--;
      textarea.value = "C:\\FelipePipe\\Portafolio> " + commands_history[index];
    }
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (index < commands_history.length - 1) {
      index++;
      textarea.value = "C:\\FelipePipe\\Portafolio> " + commands_history[index];
    } else {
      textarea.value = "C:\\FelipePipe\\Portafolio> ";
      index = commands_history.length;
    }
  }
});



textarea.addEventListener("input", function () {
  if (!textarea.value.startsWith("C:\\FelipePipe\\Portafolio> ")) {
    restartCommandInput();
  }
});

restartCommandInput = () => {
  textarea.value = "C:\\FelipePipe\\Portafolio> ";
};

sanitize = (str) => {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

autocomplete = () => {
  let input = sanitize(textarea.value);
  let end = input.indexOf(" ", 29); //29 is the length of the initial string and find the space after the command
  let command = input.substring(29, end);
  if (end === -1) {
    command = input.substring(29);
  }
  let foundCommand = false;
  for (let key in commands) {
    console.log(commands[key].name + " " + command);
    if (commands[key].name.startsWith(command)) {
      textarea.value = "C:\\FelipePipe\\Portafolio> " + commands[key].name;
      foundCommand = true;
      break;
    }
  }
  if (!foundCommand) {
    textarea.value = "C:\\FelipePipe\\Portafolio> ";
  }
};

let tformatter = {
  "#.0": "<span style='color: #000000 !important;'>",
  "#.1": "<span style='color: #0000AA !important;'>",
  "#.2": "<span style='color: #00AA00 !important;'>",
  "#.3": "<span style='color: #00AAAA !important;'>",
  "#.4": "<span style='color: #AA0000 !important;'>",
  "#.5": "<span style='color: #AA00AA !important;'>",
  "#.6": "<span style='color: #FFAA00 !important;'>",
  "#.7": "<span style='color: #AAAAAA !important;'>",
  "#.8": "<span style='color: #555555 !important;'>",
  "#.9": "<span style='color: #5555FF !important;'>",
  "#.a": "<span style='color: #55FF55 !important;'>",
  "#.b": "<span style='color: #55FFFF !important;'>",
  "#.c": "<span style='color: #FF5555 !important;'>",
  "#.d": "<span style='color: #FF55FF !important;'>",
  "#.j": "<span id='randomcolor'>",
  "#.k": "<span id='magictext'>",
  "#.l": "<span style='font-weight: bold !important;'>",
  "#.m": "<span style='text-decoration: line-through !important;'>",
  "#.n": "<span style='text-decoration: underline !important;'>",
  "#.o": "<span style='font-style: italic !important;'>",
  "#.r": "</span>",
};

let magicalText = [];
let randomcolorText = [];
textFormatter = (content, text) => {
  text += " #.r";
  for (let key in tformatter) {
    text = text.replaceAll(key, tformatter[key]);
  }
  content.innerHTML += `<p>${text}</p>`;
  return text.replace(/#.[0-9a-zA-Z]/g, "");
};

setInterval(() => {
  magicalText = document.querySelectorAll("#magictext");
  randomcolorText = document.querySelectorAll("#randomcolor");
  magicalText.forEach((element) => {
    let currentText = element.innerText;
    let newText = "";
    for (let i = 0; i < currentText.length; i++) {
      let char = currentText.charAt(i);
      if (char === " ") {
        newText += " ";
      } else {
        let charCode = char.charCodeAt(0);
        if (charCode >= 97 && charCode <= 122) {
          charCode = ((charCode - 97 + 1) % 26) + 97;
        } else if (charCode >= 65 && charCode <= 90) {
          charCode = ((charCode - 65 + 1) % 26) + 65;
        }
        newText += String.fromCharCode(charCode);
      }
    }
    element.innerText = newText;
  });
  randomcolorText.forEach((element) => {
    let randomColor = Math.floor(Math.random() * 16777215).toString(16);
    element.style.color = "#" + randomColor;
    let currentText = element.innerText;
    let newText = "";
    for (let i = 0; i < currentText.length; i++) {
      let char = currentText.charAt(i);
      if (char === " ") {
        newText += " ";
      } else {
        let randomColor = Math.floor(Math.random() * 16777215).toString(16);
        newText += `<span style="color: #${randomColor} !important">${char}</span>`;
      }
    }
    element.innerHTML = newText;
  });
}, 5);

separateCommands = (args, usage) => {
  for (let i = 0; i < usage.length; i++) {
    let index = usage[i].indexOf(" ");
    let arg = usage[i].substring(index + 1);
    if (index === -1) {
      index = usage[i].length;
      arg = "<br>";
    }
    console.log(arg + " | " + args);
    if (arg.includes("{args}") ) {
      arg = args;
    }
    if(arg.includes("{color}")){
      arg = args;
    }
    arg = arg.replaceAll(" ", "&nbsp");
    let command = usage[i].substring(0, index);
    executeCommand(arg, [command]);
  }
};

executeCommand = (arg, usage) => {
  switch (usage[0]) {
    case "clear":
      clear();
      magicalText = [];
      randomcolorText = [];
      break;
    case "echo":
      echo(arg);
      break;
    case "openWindows":
      args = arg.split("&nbsp");
      openWindows(args[0], args[1], args[2], args[3],args[4]);
      break;
    case "color":
      console.log(usage + " " + arg);
      if (/^#[0-9A-F]{6}$/i.test(arg)) {
        console.log("Valid color format");
        console_body.style.color = arg;
        textarea.style.color = arg;
      } else {
        executeCommand("echo", ["Invalid color format"]);
      }
      content.style.color = arg;
      break;
    case "help":
      for (let key in commands) {
        content.innerHTML += `<p>${commands[key].name} - ${commands[key].description}</p>`;
      }
      break;
  }
};

//commands
clear = () => {
  content.innerHTML = "";
};

echo = (text) => {
  console.log("voy a imprimir esto " + text);
  text = textFormatter(content, text);
};

openWindows = (xSize, ySize, title, contenthtml,contentjs) => {
  console.log("openWindows " + xSize + " " + ySize + " " + title + " " + contenthtml + " " + contentjs);
  //content is a html file
  fetch("html/" + contenthtml)
    .then((response) => response.text())
    .then((html) => {
      let window = document.createElement("div");
      window.id = "window";
      window.style.position = "absolute";
      window.style.zIndex = "1000";
      window.style.top = "50%";
      window.style.left = "50%";
      let page = "";
      page += "    <div id='window-header'>";
      page += "        <h3 id='window-title'>" + title + "</h3>";
      page += "        <div id='window-header-right'>";
      page += "            <button id='maximize'>";
      page += "                <img src='images/minus.png' alt='maximize'/>";
      page += "            </button>";
      page += "            <button id='minimize'>";
      page += "                <img src='images/copy.png' alt='minimize'/>";
      page += "            </button>";
      page += "           <button id='exit'>";
      page += "                <img src='images/close.png' alt='exit' />";
      page += "            </button>";
      page += "       </div>";
      page += "    </div>";
      page += "    <div id='window-body'>";
      page += html.replace("400", xSize).replace("300", ySize);

      window.innerHTML = page;
      window.querySelector("#exit").addEventListener("click", function () {
        window.remove();
      });
      window.querySelector("#window-header").addEventListener("mousedown", function(event) {
        movableWindow(window, event);
      });
      document.body.appendChild(window);
      fetch("js/" + contentjs)
        .then((response) => response.text())
        .then((js) => {
          let script = document.createElement("script");
          script.innerHTML = js;
          window.appendChild(script);
        })
        .catch((error) => {
          console.error("Error fetching JS:", error);
        })
    })
    .catch((error) => {
      console.error("Error fetching HTML:", error);
    });
};