const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const optionsList = document.querySelectorAll(".option");
const inputName= document.getElementById('name');
const gameStart = document.getElementById('divGame');
const error = document.getElementById('error');
const errMessageSpan = document.getElementById('noName');
const errorMessage = "Can't enter without your name!";
fetch('../data/dictionary.json')
  .then(response => response.json())
  .then(data => {
  	// Do something with your data
  	console.log(data);
  });
window.onload = function() {
    sessionStorage.removeItem("scores");
    if(sessionStorage.getItem('CurrentUser') && sessionStorage.getItem('Level'))
    {
        gamePage();
    }
}
function checkError(){
    if(inputName.value.length >0)
    {
        error.style.display = 'none';
    }
    else{
        error.style.display = 'inline-block';
        errMessageSpan.innerHTML = errorMessage;
    }
}
inputName.addEventListener("keyup", function (evt) {
    checkError();
    if(this.value.length === 20) {
        document.getElementById("textCount").className = "warning";
    } else{
        document.getElementById("textCount").className  = "countText";
    }
    document.getElementById("textCount").innerHTML = this.value.length + "/20";
    
}, false);


function storeUsers()
{
    const user = inputName.value;
    sessionStorage.setItem("CurrentUser", user);
    console.log('sessionStorage', sessionStorage)
}

selected.addEventListener("click", () => {
  optionsContainer.classList.toggle("active");
  console.log('p', selected.innerHTML)
});

optionsList.forEach(o => {
  o.addEventListener("click", () => {
    selected.innerHTML = o.querySelector("label").innerHTML;
    optionsContainer.classList.remove("active");
    sessionStorage.setItem("Level", selected.innerHTML.trim());
  });
  sessionStorage.setItem("Level" ,'EASY');
});

gameStart.addEventListener("click", () => {
    const user = inputName.value;
    if( user === '')
    {
        checkError();
        console.log(sessionStorage.getItem("Level"));
    }
    else{
        storeUsers();
        gamePage();
    }
    
});

function gamePage() { 
    window.location.href="game.html"; 
  } 
  

