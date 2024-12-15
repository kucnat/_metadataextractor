const fileInput = document.getElementById("fileInput");
const content = document.getElementById("content");
const dropbox = document.getElementById("dropbox");
const textBox = document.getElementById("textBox");
const pictureBox = document.getElementById("pictureBox");
const preview = document.getElementById("preview");
const container = document.getElementById("container");

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
    changeStyle();
    let someText = checkComfy(fr.result);
    someText += wildcardCheckComfy(fr.result);
    someText = unicodeToChar(someText);
    someText = someText.replace(/\\n/g, "\n");
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
  let prompt = "";
  let posBegin = 0;
  let posEnd = 0;
  let promptBegin = text.indexOf('inputs": {"text": "', posBegin);
  if (promptBegin === -1) return "not comfy";
  let promptEnd = text.indexOf('"', promptBegin + markerStart.length);
  if (promptEnd === -1) return "cand find end of prompt";
  let promptBlockCount = text.match(/inputs": {"text": "/g).length;
  if (promptBlockCount === -1) return "not comfy";
  console.log(promptBlockCount);
  for (let i = 0; i < promptBlockCount; i++) {
    prompt +=
      "Prompt " +
      (i + 1) +
      "\n" +
      text.slice(promptBegin + markerStart.length, promptEnd) +
      "\n\n";
    posBegin = promptBegin + markerStart.length;
    posEnd = promptEnd + '"'.length;
  }
  console.log("it's comfy!");
  return prompt;
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
  if (promptBegin === -1) return "";
  let promptEnd = text.indexOf('"', promptBegin + markerStart.length);
  if (promptEnd === -1) return "";
  return (
    "Wildcards: " +
    "\n" +
    text.slice(promptBegin + markerStart.length, promptEnd) +
    "\n\n"
  );
}
