const header = document.getElementById('header');
const form = document.getElementById('search');
const input = document.getElementById('mySearch');
const lens = document.getElementById('iconSearch');
const searchSection = document.getElementById('searchSection');
const searchUl = document.getElementById('searchUl');
const tagsUl = document.getElementById('tags');
const tagsContainer = document.getElementById('tagsContainer');
const tagsLine = document.getElementById('tagsLine');
const moreButton = document.getElementById('showMore');
const closeButton = document.getElementById('iconClose');
const errorFig = document.getElementById('errorFigure');
const mode = document.getElementById('mode');
const themeStyle = document.getElementById('themeStyle');

const apiKey= "bUGgXAw5GVOq6EivhmR8bGrhBBCeND12"; 

//modo light/dark

mode.addEventListener('click', changeMode);

let theme = 'lightMode';

if (localStorage.getItem("theme") != null) {
    theme = localStorage.getItem("theme");
    setMode();
}
function changeMode() {
    if (theme === 'lightMode') {
        theme = 'darkMode';
    }
    else if (theme === 'darkMode') {
        theme = 'lightMode';
    }    
    setMode();
}
function setMode() {
    if (theme === 'lightMode') {
        themeStyle.href='./styles/lightMode.css';
        mode.innerHTML = 'Modo Nocturno';
    }
    else if (theme === 'darkMode') {
        themeStyle. href='./styles/darkMode.css';
        mode.innerHTML = 'Modo Diurno';
    }    
    localStorage.setItem("theme", theme);
}
//Barra de busqueda

input.addEventListener('keyup', showTags);
input.addEventListener('onfocus', () => {input.value = ''});/*no funciona*/
form.addEventListener('submit', showResult);
form.addEventListener('submit', closeTags);/*no funciona*/
closeButton.addEventListener('click', cleanSearch);/*no funciona*/
lens.addEventListener('click', showResult);/*no funciona*/

const getTagsUrl = (q) => {
    return `https://api.giphy.com/v1/gifs/search/tags?api_key=${apiKey}&q=${q}&limit=4`;
}

async function showTags(event) {
    tagsContainer.innerHTML = "";
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

        li.addEventListener('click', autocomplete);

        tagsLine.style.display = 'block';
        tagsContainer.style.display = 'block';
    })
}

function autocomplete(event) {
    input.value = event.target.textContent;
    showResult(event);
    tagsContainer.style.display = 'none';
}

function closeTags() {
    tagsLine.style.display = 'none';
    tagsContainer.style.display = 'none';
}

function cleanSearch() {
    input.innerText = '';
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
       
    if(results.data.length) {
        showLine();
        showTitle(newKeyword, h2);
        renderResult(results.data, searchUl);
        showMoreButton();

    } else {
        showLine();
        showTitle(newKeyword, h2);
        showErrorFigure();
    };
}

function showLine() {
    const line = document.getElementById('searchLine');

    line.style.display = 'block';
}

function showTitle(newKeyword, h2){
    h2.textContent = newKeyword;
    h2.style.display = 'block';
}

function renderResult(list, container) {
    list.forEach(item => {
        const li = document.createElement('li');
        const figure = document.createElement('figure')
        const img = document.createElement('img');
        const imgHover = document.createElement('img');
        const figcaption =document.createElement('figcaption');
        const buttonsContainer = document.createElement('div');
        const user = document.createElement('span');
        const title = document.createElement('span');
        const favButton = document.createElement('button');
        const favIcon = document.createElement('img');
        //const favIconHover = document.createElement('img');
        const favIconActive = document.createElement('img');
        const downloadButton = document.createElement('button');
        const downloadIcon = document.createElement('img');
        const maxButton = document.createElement('button');
        const maxIcon = document.createElement('img');
        
        li.className = 'card';
        /*li. dataset*/
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
        favIconActive.className = 'favIconActive';
        favIconActive.src = './images/icon-fav-active.svg';
        downloadButton.className = 'downloadButton';
        downloadIcon.className = 'downloadIcon';
        downloadIcon.src = './images/icon-download.svg';
        maxButton.className = 'maxButton';
        maxIcon.className = 'maxIcon';
        maxIcon.src = './images/icon-max.svg';

        li.appendChild(figure);
        figure.appendChild(buttonsContainer);
        figure.appendChild(img);
        figure.appendChild(imgHover);
        figure.appendChild(figcaption);
        figcaption.appendChild(user);
        figcaption.appendChild(title);
        buttonsContainer.appendChild(favButton);
        buttonsContainer.appendChild(downloadButton);
        buttonsContainer.appendChild(maxButton);
        favButton.appendChild(favIcon);
        favButton.appendChild(favIconActive);
        downloadButton.appendChild(downloadIcon);
        maxButton.appendChild(maxIcon);
        container.appendChild(li);

        // para agregar a favoritos agregar a favoritos
        if (screen.width < 970) {
            li.addEventListener ('click', () => {
                console.log('agregado a mis favoritos')
            })
        } else {
            favButton.addEventListener('click', changeFavouriteState);
        }
        
        async function changeFavouriteState(event) {
            event.preventDefault();
            
            let gifInfo = {
                id: item.id,
                url: item.images.original.url,
                title: item.title,
                user: item.username,
            };

            //leer el local Storage
            let myFavourites = localStorage.getItem('myFavourites') || '[]';
            myFavourites = JSON.parse(myFavourites);
            console.log(myFavourites);

            // buscamos el id de newGifo en la lista de favoritos
            let newFav = myFavourites.findIndex(function(item) { return item.id === gifInfo.id; });
            if (newFav > -1) {
                // si está, lo quitamos
                myFavourites.splice(newFav, 1);
                console.log('existe')
            } else {
                // si no está, lo añadimos
                myFavourites.push(gifInfo);
                console.log('anadido');
                console.log(gifInfo);
                console.log(myFavourites);
                }
            // guardamos la lista de favoritos 
            localStorage.setItem('myfavourites', JSON.stringify(newFav));

            changeIcon()

            function changeIcon() {
                let icon = favIcon;
                
                if (icon === favIcon) {
                    icon = favIconActive;
                    favIcon.style.display = 'none';
                    favIconActive.style.display = 'block';
                } else if (icon === favIconActive) {
                    icon = favIcon;
                    favIconActive.style.display = 'none';
                    favIcon.style.display = 'block';
                }    
            }
        }
    })
} 

moreButton.addEventListener('click', showMoreResult);

function showMoreButton() {
    document.getElementById('showMore').style.display='block';
}

let offset = 0
const limit = 12

async function showMoreResult(){
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
    const firstResults = results.data.slice(0,5);
    console.log(firstResults);
        
    /*for (let i = 0; i < elementos.length; i++) {
        let elemento = firstResults.split(',');
        elemento[i].addEventListener('click', showResults);
    }*/

    const p = document.createElement("p");
    p.innerText = firstResults.join(', ');
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

const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');

prevButton.addEventListener('click', scrollLeft);
//prevButton.addEventListener('touchstart', scrollLeft);
nextButton.addEventListener('click', scrollRight);
//nextButton.addEventListener('touchend', scrollLeft);

const carouselSize = carousel.getBoundingClientRect();
const displacement = carouselSize.width/3;

function scrollLeft(event) {
    event.preventDefault();
    carousel.scrollLeft += displacement;
}

function scrollRight(event) { /*no funciona*/
    event.preventDefault();
    carousel.scrollRight += displacement;
}