const fileInput = document.getElementById("fileInput");
const content = document.getElementById("content");
const dropbox = document.getElementById("dropbox");
const textBox = document.getElementById("textBox");
const pictureBox = document.getElementById("pictureBox");
const preview = document.getElementById("preview");
const container = document.getElementById("container");
let someText;
const fr = new FileReader();
fileInput.addEventListener("change", clickHandler);
dropbox.addEventListener("click", () => {
  fileInput.click();
});
pictureBox.addEventListener("click", () => {
  fileInput.click();
});
function dragOverHandler(e) {
  console.log("File(s) in drop zone");
  // Prevent default behavior (Prevent file from being opened)
  e.preventDefault();
}

function dropHandler(e) {
  console.log("File(s) dropped");

  e.preventDefault();
  fr.readAsText(e.dataTransfer.files[0]);
  whenLoaded(e.dataTransfer.files[0]);
}

function clickHandler() {
  fr.readAsText(fileInput.files[0]);
  whenLoaded(fileInput.files[0]);

  // fr.readAsDataURL(fileInput.files[0]);
  // fr.onload = function () {
  //   preview.src = fr.result;
  // };
}
function whenLoaded(fil) {
  fr.onload = function () {
    // someText = fr.result;
    someText = ""; //zmienić po testach
    //content.textContent = someText;
    changeStyle();
    checkComfy(fr.result);
    wildcardCheckComfy(fr.result);
    textBox.textContent = someText;

    preview.src = URL.createObjectURL(fil);
  };
}
function changeStyle() {
  dropbox.remove();

  pictureBox.style.display = "inline-flex";
  textBox.style.display = "initial";
}
function checkComfy(text) {
  markerStart = 'inputs": {"text": "';
  let posBegin = 0;
  let posEnd = 0;
  if (text.includes(markerStart)) {
    let promptBlockCount = text.match(/inputs": {"text": "/g).length;
    console.log(promptBlockCount);
    for (let i = 0; i < promptBlockCount; i++) {
      let promptBegin = text.indexOf('inputs": {"text": "', posBegin);
      let promptEnd = text.indexOf('"', promptBegin + markerStart.length);
      someText +=
        "Prompt " +
        (i + 1) +
        "\n" +
        text.slice(promptBegin + markerStart.length, promptEnd) +
        "\n\n";
      posBegin = promptBegin + markerStart.length;
      posEnd = promptEnd + '"'.length;
    }
    someText = unicodeToChar(someText);
    someText = someText.replace(/\\n/g, "\n");

    console.log("it's comfy!");
  } else {
    console.log("not comfy");
    someText = "not comfy!";
  }
}
function unicodeToChar(text) {
  //replaces unicode with characters
  return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
    return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
  });
}
function wildcardCheckComfy(text) {
  const markerStart = 'populated_text": "';
  let promptBegin = text.indexOf(markerStart);
  let promptEnd = text.indexOf('"', promptBegin + markerStart.length);
  if (text.includes(markerStart)) {
    someText +=
      "Wildcards: " +
      "\n" +
      text.slice(promptBegin + markerStart.length, promptEnd) +
      "\n\n";
  }
}
