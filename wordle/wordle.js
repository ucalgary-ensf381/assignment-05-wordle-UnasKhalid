

document.getElementById('drkSwitch').addEventListener('click',()=>{
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {   document.documentElement.setAttribute('data-bs-theme','light')
    }
    else {
        document.documentElement.setAttribute('data-bs-theme','dark')
    }
})

const getWords = async () => {
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {headers: {"x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",},});
    let words = await res.json();
    let {dictionary} = words;

    return {dictionary};
};
const initBoard = () => { 
    const board = document.getElementById('board');
    for (let i = 0; i < 4; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        row.classList.add('justify-content-center');
        for (let j = 0; j < 4; j++) {
            const col = document.createElement('div');
            col.classList.add('col-auto');
            col.classList.add('p-0');
            const box = document.createElement('div');
            box.classList.add('box');
            box.classList.add('border');
            col.appendChild(box);
            row.appendChild(col);
        }
        board.appendChild(row);
    }
    let firstBox = document.getElementsByClassName("box")[0]
    firstBox.classList.add("border-primary")
}
initBoard();


const selectWord = async () => {
    let {dictionary} = await getWords();
    let word = dictionary[Math.floor(Math.random() * dictionary.length)]
    return word
}
currentWord = selectWord()
let guessesRemaining = 4
let nextLetter = 0

document.getElementById("startOver").addEventListener("click", () => {
    if (document.getElementById("win-image")) {
        document.getElementById("win-image").remove()
    }
    let board = document.getElementById("board")
    while (board.firstChild) {
        board.removeChild(board.firstChild)
    }
    initBoard()

    document.getElementById('AlertPlaceholder').innerHTML = ""
    
    nextLetter = 0
    guessesRemaining = 4
    currentWord = selectWord()
    


})




document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess()
        return
    }


    if (pressedKey.match(/^[a-zA-Z]$/)) {
        let found = pressedKey.match(/[a-z]/gi)
        if (!found || found.length > 1) {
            return
        } else {
            insertLetter(pressedKey)
        }
    }
})



const insertLetter = (letter) => {
    if (nextLetter === 4) {
        return
    }
    let row = document.getElementsByClassName("row")[4 - guessesRemaining]
    let boxes = row.getElementsByClassName("box")
    
    letter = letter.toLowerCase()
    
    boxes[nextLetter].innerHTML = letter;

    nextLetter++;
    
    if (nextLetter < 4) {
        boxes[nextLetter].classList.add("border-primary")
    }
    boxes[nextLetter - 1].classList.remove("border-primary")
    
}

const deleteLetter = () => {
    let row = document.getElementsByClassName("row")[4 - guessesRemaining]
    let boxes = row.getElementsByClassName("box")
    boxes[nextLetter - 1].innerHTML = "";
    if (nextLetter < 4) {
        boxes[nextLetter].classList.remove("border-primary")
    }
    nextLetter--;
    
    boxes[nextLetter].classList.add("border-primary")
    
}


const checkGuess = async () => {
    if (nextLetter !== 4) {
        window.alert("Please finish your 4-letter word before enterring!")
        return
    }
    let dictionary = await currentWord
    let word = dictionary["word"]
    word = word.toLowerCase()

    let row = document.getElementsByClassName("row")[4 - guessesRemaining]
    let boxes = row.getElementsByClassName("box")
    let guess = ""
    let alphabet = {}
    for (let i = 0; i < word.length; i++) {
        let letter = word[i]
        if (alphabet[letter]) {
            alphabet[letter] += 1;
        } else {
            alphabet[letter] = 1;
        }
    }
    
    let correctGuesses = {}
    for (let i = 0; i < word.length; i++) {
        let letter = word[i]
        correctGuesses[letter] = 0;
    }
    
    for (let i = 0; i < 4; i++) {
        let letter = boxes[i].innerHTML
        guess += letter
        
        if (letter === word[i]) {
            boxes[i].classList.add("bg-success")
            boxes[i].classList.add("text-white")
            if (correctGuesses[letter]) {
                correctGuesses[letter] += 1;
            }
            else {
                correctGuesses[letter] = 1;
            }
            
        } else {
            boxes[i].classList.add("bg-secondary")
            boxes[i].classList.add("text-white")
        }
    }
    
    for (let i = 0; i < 4; i++) {
        let letter = boxes[i].innerHTML
        if (word.includes(letter) && letter !== word[i]) {
            if ((correctGuesses[letter]) < alphabet[letter]) {
                boxes[i].classList.add("bg-warning")
                boxes[i].classList.add("text-white")
                correctGuesses[letter] += 1;
            }
        }
    }
       if (guess === word) {
        const winImage = document.createElement('img');
        winImage.src = "../congrats.png";
        winImage.classList.add('img-fluid');
        winImage.classList.add('w-25');
        winImage.classList.add('mx-auto');
        winImage.classList.add('d-block');
        document.getElementById('board').innerHTML = "";
        document.getElementById('board').appendChild(winImage);
        let Alert = `<div class="alert alert-success fade show text-center" role="alert"> Your answer: <span class="fw-bold">` + word.toUpperCase() + `</span> was correct!</div>`
        document.getElementById('AlertPlaceholder').innerHTML = Alert
        return
    }
    for (let i = 0; i < 4; i++) {
        boxes[i].classList.remove("border-primary")
    }
    nextLetter = 0
    guessesRemaining--
    if (guessesRemaining === 0) {
        let Alert = `<div class="alert alert-danger fade show text-center" role="alert"> Out of attempts. The correct word was: <span class="fw-bold">` + word.toUpperCase() + `</span></div>`
        // insert the alert into the placeholder div
        document.getElementById('AlertPlaceholder').innerHTML = Alert
        return
    }
    let nextRow = document.getElementsByClassName("row")[4 - guessesRemaining]
    let nextBoxes = nextRow.getElementsByClassName("box")
    nextBoxes[0].classList.add("border-primary")
}

document.getElementById('hintButton').addEventListener('click', async () => {
    let dictionary = await currentWord
    let hint = dictionary["hint"]
    let hintAlert = `<div class="alert alert-warning fade show text-center" role="alert">` + hint
    document.getElementById('AlertPlaceholder').innerHTML = hintAlert
})
