let mainListWord = window.localStorage.getItem('mainListWord') ? JSON.parse(window.localStorage.getItem('mainListWord')) : [];;


const btnTranslate = document.querySelector('#btn-translate');
const btnSaveWord = document.querySelector('#btn-save');
const btnShowAllWords = document.querySelector('#btn-show-all-words');

let divTable = document.querySelector('#table-div');


let table = document.createElement('table');

let result;


const pagination = document.querySelector('#pagination');




let itemsOfPagination = [];

function createPagination(){
    let notesOnPage = 5;
    let countOfItems = Math.ceil(mainListWord.length / notesOnPage);
    pagination.innerHTML = '';
    for (let i = 1; i <= countOfItems; i++) {
        let li = document.createElement('li');
        li.innerHTML = i;
        pagination.appendChild(li);
        itemsOfPagination.push(li);
    }
    
    for (let item of itemsOfPagination) {
            item.addEventListener('click', function() {
            let pageNum = +item.innerHTML;
                console.log(232);
                
            let start = (notesOnPage * pageNum) - notesOnPage;
            let end = start + notesOnPage;
            let notes = mainListWord.slice(start, end);
            console.log(notes);
        
            createTable(notes);
            });
        }
}

function translateWord(){
    let word = document.getElementById('inputMain').value;
    if(word == ''){
        alert('Введите слово которое хотите перевести!');
    } 
    else {
            let apiUrl = `https://api.mymemory.translated.net/get?q=${word}&langpair=en|rus`;
            fetch(apiUrl).then(res => res.json()).then(data => {
            document.querySelector('#inputTranslate').value = data.responseData.translatedText;
        });
    }
}

function saveWord(){
    let inputTranslatedValue = document.querySelector('#inputTranslate').value;
    let inputWordValue = document.querySelector('#inputMain').value;
    let result = {
        'english' : inputWordValue,
        'russian' : inputTranslatedValue,
        'id' : mainListWord.length + 1
    };
    for(let item of mainListWord){
        console.log(item.english);
        console.log(inputTranslatedValue);
        if(item.english == inputWordValue){

            return alert('Данное слово уже имеется в Вашем словаре');
        }
    }
    mainListWord.push(result);
    window.localStorage.setItem('mainListWord' , JSON.stringify(mainListWord));
    document.querySelector('#inputMain').value = 'Enter a word';
    document.querySelector('#inputTranslate').value = 'Translated word:';
    
}

function createTable(massiveWord){
    table.innerHTML = '';
    for(let i = 0; i < massiveWord.length; i++){

        let trTable = document.createElement('tr');
        let tdTableNumb = document.createElement('td');
        let tdTableWord = document.createElement('td');
        let tdTableDel = document.createElement('button');
        tdTableNumb.innerHTML = massiveWord[i].id;
        tdTableWord.innerHTML = `${massiveWord[i].english}  : ${massiveWord[i].russian}`;

        tdTableWord.classList.add("td-text");
        tdTableDel.innerHTML = '<img class="icon_remove" src="../img/deleteimg.jpg" alt="remove"" onclick="deleteWord(event)">';
        tdTableDel.id = `btn-${i}`;
        trTable.appendChild(tdTableNumb);
        trTable.appendChild(tdTableWord);
        trTable.appendChild(tdTableDel);
        table.appendChild(trTable);
    }
    divTable.appendChild(table);
    createPagination();
}

function deleteWord(event){
    let index = +event.target.parentNode.id.slice(4);
    mainListWord.splice(index, 1);
    createTable(mainListWord);
}

btnTranslate.addEventListener('click', translateWord);
btnSaveWord.addEventListener('click', saveWord);
btnShowAllWords.addEventListener('click', () => createTable(mainListWord.slice(0, 5)));


