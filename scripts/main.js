const header = document.getElementById('header');
const form = document.getElementById('search');
const input = document.getElementById('mySearch');
const lens = document.getElementById('iconSearch');
const searchSection = document.getElementById('searchSection');
const searchUl = document.getElementById('searchUl');
const tagsUl = document.getElementById('tags');
const tagsContainer = document.getElementById('tagsContainer');
const moreButton = document.getElementById('showMore');

const apiKey= "bUGgXAw5GVOq6EivhmR8bGrhBBCeND12"; 

//Barra de busqueda

input.addEventListener('keyup', showTags);
form.addEventListener('submit', showResult);
lens.addEventListener('click', showResult);

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
    renderTags(data,tagsContainer);
}

showTags();

function renderTags(list, tagsContainer) {
    tagsContainer.innerHTML = "";
    list.forEach (item => {
        const li = document.createElement('li');
        const figure = document.createElement('figure')
        const img = document.createElement('img');
        const span = document.createElement('span');

        li.className = 'dataTag';
        figure.className = 'iconSearch';
        img.className = 'iconSearchImg';
        img.src = './images/icon-search.svg';
        span.className = 'tag';
        span.textContent = item.name;
        
        li.appendChild(figure);
        li.appendChild(span)
        figure.appendChild(img);
        tagsContainer.appendChild(li);
    })
}

const getSearchUrl = (input, limit=12, offset=0) => {
    return `https://api.giphy.com/v1/gifs/search?q=${input}&api_key=${apiKey}&limit=${limit}&offset=${offset}`;
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
        showLine(header);
        showTitle(newKeyword, h2);
        renderResult(results.data, searchUl);
        showMoreButton();
    } else {
        showTitle(newKeyword, h2);
        showErrorFigure();
    };
}

function showLine(container) {
    const line = document.createElement('div');

    line.className = 'line';

    container.appendChild(line);
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
        const favIconHover = document.createElement('img');
        const favIconActive = document.createElement('img');
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
        favIconHover.className = 'favIconHover';
        favIconHover.src = './images/icon-fav-hover.svg';
        favIconActive.className = 'favIconActive';
        favIconActive.src = './images/icon-fav-active.svg';
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
        favButton.appendChild(favIconHover);
        favButton.appendChild(favIconActive);
        downloadButton.appendChild(downloadIcon);
        maxButton.appendChild(maxIcon);
        container.appendChild(li);
        
        //favIcon.addEventListener('onmouseover', changeHoverImg);
        //favIconHover.addEventListener('mouseenter', changeActiveImg);
    })
}

moreButton.addEventListener('click', showMoreResult);

function showMoreButton(){
    document.getElementById('showMore').style.display="block";
}

let offset = 0
const limit = 12

async function showMoreResult(){
    searchUl.innerHTML = "";
    const q = input.value;
    const url = getSearchUrl(q, limit, offset+=12);
    const response = await fetch(url);
    const results = await response.json();  
    renderResult(results.data, searchUl);
}   

function showErrorFigure(){
    errorFig.style.display="block";
}

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

/*function changeHoverImg() {
    favIcon.style.display="none";
    favIconActive.style.display="block";
}

function changeActiveImg() {
    favIconActive.style.display="none";
    favIconHover.style.display="block";
}*/