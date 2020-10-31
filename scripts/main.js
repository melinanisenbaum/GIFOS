const form = document.getElementById('search');
const input = document.getElementById('mySearch');
const lens = document.getElementById('iconSearch');
const searchSection = document.getElementById('searchSection');
const searchUl = document.getElementById('searchUl');
const tagsUl = document.getElementById('tags');
const tagsContainer = document.getElementById('tagsContainer');

const apiKey= "bUGgXAw5GVOq6EivhmR8bGrhBBCeND12"; 

//Barra de busqueda

input.addEventListener('keyup', showTags);
form.addEventListener('submit', showResult);
lens.addEventListener('click', showResult);

//showMoreButton.addEventListener('click', showMore);

const getTagsUrl = (q) => {
    return `https://api.giphy.com/v1/gifs/search/tags?api_key=${apiKey}&q=${q}&limit=4`;
}

async function showTags(event) {
    const q = input.value;
    const url = getTagsUrl(q);
    const response = await fetch(url);
    const results = await response.json();
    const data = results.data;
    console.log (data);
    console.log(q);
    renderTags(results.data,tagsContainer);
}

showTags();

function renderTags(list, container) {
    container.innerHTML = '';
    list.forEach (item => {
        const li = document.createElement('li');
        const figure = document.createElement('figure')
        const img = document.createElement('img');

        li.className = 'dataTag';
        li.textContent = item.name;
        figure.className = 'iconSearch';
        img.className = 'iconSearchImg';
        img.src = './images/icon-search.svg';

        li.appendChild('figure');/*tira error*/
        figure.appendChild('img');
        container.appendChild('li');
    })
}
const getSearchUrl = input => {
    return `https://api.giphy.com/v1/gifs/search?q=${input}&api_key=${apiKey}&limit=12`;
}

async function showResult(event) {
    event.preventDefault();

    const images = searchUl.querySelectorAll('li');
    
    if (images.length > 0) {
        images.forEach (item => item.parentNode.removeChild(item))
    };

    const newKeyword = input.value;
    const url = getSearchUrl(newKeyword);
    const response = await fetch(url);
    const results = await response.json();
    console.log(results);

    const h2 = document.getElementById('searchTitle');
    const errorFig = document.getElementById('errorFigure');
    
    if(results.data.length) {
        showTitle(newKeyword, h2);
        renderResult(results.data, searchUl);
        showMoreButton();
    } else {
        showTitle(newKeyword, h2);
        showErrorFigure();
    };
}

function showTitle(newKeyword, h2){
    h2.textContent = newKeyword;
}

function renderResult(list, container) {
    list.forEach(item => {
        const li = document.createElement('li');
        const figure = document.createElement('figure')
        const img = document.createElement('img');
        const imgHover = document.createElement('img');
        const figcaption =document.createElement('figcaption');
        const user = document.createElement('span');
        const title = document.createElement('span');
        const buttonsContainer = document.createElement('div');
        const favButton = document.createElement('button');
        const favIcon = document.createElement('img');
        const downloadButton = document.createElement('button');
        const downloadIcon = document.createElement('img');
        const maxButton = document.createElement('button');
        const maxIcon = document.createElement('img');
        
        li.className = 'card';
        figure.className = 'gifFigure';
        img.className = 'gifImg';
        img.src = item.images.original.url;
        imgHover.className = 'imgHover';
        figcaption.className = 'figcaption';
        user.className = 'username';
        user.textContent = item.username;
        title.className = 'title';
        title.textContent = item.title;
        buttonsContainer.className = 'gifButtons';
        favButton.className = 'favButton';
        favIcon.className = 'favIcon';
        favIcon.src = './images/icon-fav.svg';
        downloadButton.className = 'downloadButton';
        downloadIcon.className = 'downloadIcon';
        downloadIcon.src = './images/icon-download.svg';
        maxButton.className = 'maxButton';
        maxIcon.className = 'maxIcon';
        maxIcon.src = './images/icon-max.svg';

        li.appendChild(figure);
        figure.appendChild(img);
        figure.appendChild(imgHover);
        figure.appendChild(figcaption);
        figcaption.appendChild(user);
        figcaption.appendChild(title);
        li.appendChild(buttonsContainer);
        buttonsContainer.appendChild(favButton);
        buttonsContainer.appendChild(downloadButton);
        buttonsContainer.appendChild(maxButton);
        favButton.appendChild(favIcon);
        downloadButton.appendChild(downloadIcon);
        maxButton.appendChild(maxIcon);
        container.appendChild(li);        
    })
}

function showMoreButton(){
    document.getElementById('showMore').style.display="block";
}
function showErrorFigure(){
    errorFig.style.display="block";
}

//async function showMore() {

//}

//trend words

const  wordTrends = document.getElementById('wordTrends');

async function showWordTrends(){
    const url = `https://api.giphy.com/v1/trending/searches?api_key=${apiKey}`;
    const response = await fetch(url);
    const results = await response.json();
    const firstResults = results.data.splice(0,5);
    const p = document.createElement("p");
    p.innerText = firstResults;
    p.className = "themes";
    wordTrends.appendChild(p);
}

showWordTrends()

//trendings

const carousel = document.getElementById('carousel');

const getTrendingsUrl = () => {
    return "https://api.giphy.com/v1/gifs/trending?api_key=bUGgXAw5GVOq6EivhmR8bGrhBBCeND12&limit=25&rating=gs";
}

showTrendings()

async function showTrendings() {
    const url = getTrendingsUrl();
    const response = await fetch(url);
    const results = await response.json();
    console.log(results);
    renderResult(results.data, carousel);
}
