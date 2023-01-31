let mainListWord = window.localStorage.getItem('mainListWord') ? JSON.parse(window.localStorage.getItem('mainListWord')) : [];;


// const btnTranslate = document.querySelector('#btn-translate');
// const btnSaveWord = document.querySelector('#btn-save');

const mainInput = document.querySelector('#inputMain');
const btnShowAllWords = document.querySelector('#btn-show-all-words');

let divTable = document.querySelector('#table-div');


let table = document.createElement('table');

let result;


const pagination = document.querySelector('#pagination');




let itemsOfPagination = [];


mainInput.addEventListener('keydown', function(event){
    if(event.code == 'Enter') {
        translateWord();
    }
})


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
    usePagination();
}

function usePagination(){
    let notesOnPage = 5;
    for (let item of itemsOfPagination) {
            item.addEventListener('click', function() {
            let pageNum = +item.innerHTML;
                
            let start = (notesOnPage * pageNum) - notesOnPage;
            let end = start + notesOnPage;
            let notes = mainListWord.slice(start, end);
            createTable(notes);
            });
        }
}


function translateWord(){
    let wordTrn = document.getElementById('inputMain').value.toLowerCase();
    console.log(wordTrn);
    if(wordTrn == ''){
        alert('Введите слово которое хотите перевести!');
    } 
    else {
            let apiUrl = `https://api.mymemory.translated.net/get?q=${wordTrn}&langpair=en|rus`;
            fetch(apiUrl).then(res => res.json()).then(data => {
                // if(wordTrn.toLowerCase() == data.responseData.translatedText.toLowerCase()){
                //     return alert('Не издевайтесь над программой, Вам известен перевод данного слова.');
                // };
                console.log(data);
            let answer = {
                'english' : wordTrn,
                'russian' : data.responseData.translatedText,
                'id' : mainListWord.length + 1
            }
            //document.querySelector('#inputTranslate').value = data.responseData.translatedText;
            document.querySelector('#inputMain').value = answer.russian;
            saveWord(answer);
            
        });
    }
}



function saveWord(respWord){
    // let inputTranslatedValue = document.querySelector('#inputTranslate').value;
    // let inputWordValue = document.querySelector('#inputMain').value;
    // let result = {
    //     'english' : inputWordValue,
    //     'russian' : inputTranslatedValue,
    //     'id' : mainListWord.length + 1
    // };
    for(let item of mainListWord){
        // console.log(inputTranslatedValue);
        if(item.english == respWord.english){
            return alert(`Данное слово уже имеется в Вашем словаре, оно переводится как: "${respWord.russian}"`);
        }
    }
    mainListWord.push(respWord);
    window.localStorage.setItem('mainListWord' , JSON.stringify(mainListWord));
    createPagination();
    // document.querySelector('#inputMain').value = 'Enter a word';
    // document.querySelector('#inputTranslate').value = 'Translated word:';
    
}

function createTable(massiveWord){
    table.innerHTML = '';
    for(let i = 0; i < massiveWord.length; i++){

        let trTable = document.createElement('tr');
        //let tdTableNumb = document.createElement('td');
        let tdTableWord = document.createElement('td');
        let tdTableDel = document.createElement('button');
        //tdTableNumb.innerHTML = ;
        tdTableWord.innerHTML = `${massiveWord[i].english}  : ${massiveWord[i].russian}`;

        tdTableWord.classList.add("td-text");
        tdTableDel.innerHTML = '<img class="icon_remove" src="./img/deleteimg.jpg" alt="remove"" onclick="deleteWord(event)">';
        tdTableDel.id = `btn-${massiveWord[i].id}`;
        
        //trTable.appendChild(tdTableNumb);
        trTable.appendChild(tdTableWord);
        trTable.appendChild(tdTableDel);
        table.appendChild(trTable);
    }
    divTable.appendChild(table);
    createPagination();
}

function deleteWord(event){
    console.log(event.target.parentNode.id);
    let index = +event.target.parentNode.id.slice(4) - 1;
    console.log(index);
    console.log(mainListWord[index]);
    mainListWord.splice(index, 1);
    window.localStorage.setItem('mainListWord' , JSON.stringify(mainListWord));
    createTable(mainListWord.slice(0, 5));
    
}

//btnTranslate.addEventListener('click', translateWord);
//btnSaveWord.addEventListener('click', saveWord);
btnShowAllWords.addEventListener('click', () => createTable(mainListWord.slice(0, 5)));


