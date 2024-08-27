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
    someText = "Hello world"; //zmienić po testach
    //content.textContent = someText;
    changeStyle();
    checkComfy(fr.result);
    textBox.textContent = someText;
    preview.src = URL.createObjectURL(fil);
  };
}
function changeStyle() {
  dropbox.remove();

  pictureBox.style.display = "inline-flex";
  textBox.style.display = "initial";
}
//inputs": {"text": "
//", "clip": [
//^ bedzie potrzebne pozniej
function checkComfy(text) {
  markerStart = 'inputs": {"text": "';
  if (text.includes(markerStart)) {
    let promptBegin = text.indexOf('inputs": {"text": "');
    let promptEnd = text.indexOf('", "clip": [');

    console.log("it's comfy!");
    someText = text.slice(promptBegin + markerStart.length, promptEnd);
  } else {
    console.log("not comfy");
    someText = "not comfy!";
  }
}
