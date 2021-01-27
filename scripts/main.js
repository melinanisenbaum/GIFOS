const home = document.getElementById('home');
const header = document.getElementById('header');
const form = document.getElementById('search');
const input = document.getElementById('mySearch');
const inputOnNav = document.getElementById('mySearchOnNav');
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
const nav = document.getElementById('nav');
const topnav = document.getElementById('topnav');
const topnavItem = document.getElementsByClassName('link');
const createSection = document.getElementById('createSection');
const cover = document.getElementById('cover');
const searchOnNav = document.getElementById('searchOnNav');
const checkbox = document.getElementById('checkbox');

const apiKey= "bUGgXAw5GVOq6EivhmR8bGrhBBCeND12";

//home

home.addEventListener('click', goHome)

function goHome() {
    header.style.display = 'flex';
    trendingSection.style.display = 'block';
    footer.style.display = 'block';
    favouritesSection.style.display = 'none';
    myGifosSection.style.display = 'none';
    createSection.style.display = 'none';
}

//sticky nav

window.onscroll = function() {onStickyNav()};

const sticky = nav.offsetTop;

function onStickyNav() {
    if (window.pageYOffset >= sticky && window.matchMedia("(min-width: 1200px)").matches) {
        nav.classList.add('sticky');
        createButton.style.display = 'none';
        searchOnNav.classList.add('_display');
    } else if (window.pageYOffset === 0){
        nav.classList.remove('sticky');
        createButton.style.display = 'block';
        searchOnNav.classList.remove('_display');
    }
}

//modo light/dark

mode.addEventListener('click', changeMode);

let theme = 'lightMode';

if (localStorage.getItem("theme") != null) {
    theme = localStorage.getItem("theme");
    setMode();
}
function changeMode() {
    if (window.matchMedia("(max-width: 700px)").matches) {
        topnav.style.display = 'none';
    }
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
input.addEventListener('focus', focus);
input.addEventListener('keyup', keyTimer);
form.addEventListener('submit', showResult);
lens.addEventListener('click', showResult);
closeButton.addEventListener('click', cleanSearch);
moreButton.addEventListener('click', showMoreResult);

const getTagsUrl = (q) => {
    return `https://api.giphy.com/v1/gifs/search/tags?api_key=${apiKey}&q=${q}&limit=4`;
}

function focus() {
    lens.classList.add('focus');
    closeButton.classList.add('focus');
}

let _timer = null;

function keyTimer(event){
    clearTimeout(_timer);

    if (event.keyCode !== 13) {
        _timer = setTimeout(function() { showTags()}, 200);
    }
    else {
        closeTags();
    }
}

async function showTags() {
    tagsContainer.innerHTML = "";
    const q = input.value;
    const url = getTagsUrl(q);
    const response = await fetch(url);
    const results = await response.json();
    const data = results.data;

    if (results.data.length > 0) {
        tagsLine.style.display = 'block';
        tagsContainer.style.display = 'block';
        renderTags(data,tagsContainer);
    } else {
        tagsLine.style.display = 'none';
        tagsContainer.style.display = 'none';
    }
}

function renderTags(list, tagsContainer) {
    tagsContainer.innerHTML = '';

    list.forEach (item => {
        const li = document.createElement('li');
        const figure = document.createElement('figure')
        const img = document.createElement('img');
        const span = document.createElement('span');

        li.className = 'dataTag';
        figure.className = 'iconSearch';
        img.className = 'iconSearchImg';
        img.src = './images/icon-search-gray.svg';
        span.className = 'tag';
        span.textContent = item.name;

        li.appendChild(figure);
        li.appendChild(span)
        figure.appendChild(img);
        tagsContainer.appendChild(li);

        li.addEventListener('click', autocomplete);
        figure.addEventListener('click', autocomplete);
    })
}

function autocomplete(event) {
    input.value = event.target.textContent;
    showResult(event);
    tagsContainer.style.display = 'none';
}

function cleanSearch() {
    closeTags();
    input.value = '';
    closeButton.classList.remove('focus');
    lens.classList.remove ('focus');
    lens.style.display = 'block';
}

const getSearchUrl = (input, limit=12, offset=0) => {
    return `https://api.giphy.com/v1/gifs/search?q=${input}&api_key=${apiKey}&limit=${limit}&offset=${offset}`;
}

async function showResult(event) {
    event.preventDefault();

    lens.style.display = 'none';
    closeTags();
    searchSection.style.display = 'block';
    const images = searchUl.querySelectorAll('li');

    if (images.length > 0) {
        images.forEach (item => item.parentNode.removeChild(item))
        moreButton.style.display='none';
        errorFig.style.display='none';
    };

    const newKeyword = input.value;
    const url = getSearchUrl(newKeyword);
    const response = await fetch(url);
    const results = await response.json();

    const h2 = document.getElementById('searchTitle');

    if(results.data.length > 0) {
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

function closeTags() {
    tagsLine.style.display = 'none';
    tagsContainer.style.display = 'none';
}

function showLine() {
    const line = document.getElementById('searchLine');

    line.style.display = 'block';
}

function showTitle(newKeyword, h2){
    h2.textContent = newKeyword;
    h2.style.display = 'block';
}

function renderResult(list, container, selected = 1) {
    var pos = 0; /* CAMBIO JUAN */
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
        const downloadButton = document.createElement('button');
        const downloadIcon = document.createElement('img');
        const maxButton = document.createElement('button');
        const maxIcon = document.createElement('img');

        li.className = 'card';
        figure.className = 'gif-figure';
        img.className = 'gif';

        img.src = item.images.original.url;
        imgHover.className = 'imgHover';
        figcaption.className = 'figcaption';
        user.className = 'username';
        user.textContent = item.username;
        title.className = 'title';
        title.textContent = item.title;
        buttonsContainer.className = 'gif-buttons';
        favButton.className = 'favButton';
        favIcon.src = './images/icon-fav.svg';
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
        downloadButton.appendChild(downloadIcon);
        maxButton.appendChild(maxIcon);
        container.appendChild(li);

        let gifInfo = {
            id: item.id,
            url: item.images.original.url,
            images: {
                original: item.images.original

            },
            title: item.title,
            user: item.username,
        };

        if (window.screen.width < 970) {
            li.addEventListener('touchend', getModal)
        } else {
            favButton.addEventListener('click', changeFavouriteStateCallback(item, gifInfo, favIcon));
            downloadButton.addEventListener('click', downloadCallback(item, container));
            maxButton.addEventListener('click', getModal);
            maxButton.items = list;
            maxButton.gifInfo = gifInfo;
            maxButton.position = pos; /* CAMBIO JUAN */
        }

        pos++; /* CAMBIO JUAN */
    })

    /* CAMBIO JUAN */
    console.log(selected);
    if (selected != undefined) {
      _itemWidth = container.getElementsByClassName("card")[0].offsetWidth;
      container.style.marginLeft = "-" + ((_itemWidth * selected)) + 'px';
    }

}

function changeIcon(_state, favIcon) {
    if (_state == 0) {
        favIcon.src = './images/icon-fav.svg';
    } else if (_state == 1) {
        favIcon.src = './images/icon-fav-active.svg';
    }
}

const changeFavouriteStateCallback = (item, gifInfo, favIcon) =>  async function changeFavouriteState(event) {
    event.preventDefault()

    let myFavourites = localStorage.getItem('myFavourites') || '[]';
    myFavourites = JSON.parse(myFavourites);

    let newFav = myFavourites.findIndex(function(item) { return item.id === gifInfo.id; });
    if (newFav > -1) {
        myFavourites.splice(newFav, 1);
        changeIcon(0, favIcon);
    } else {
        myFavourites.push(gifInfo);
        changeIcon(1, favIcon);
    }

    localStorage.setItem('myFavourites', JSON.stringify(myFavourites));
}

const downloadCallback = (item, container) => async function download (event) {
    event.preventDefault();

    const a = document.createElement('a');
    let response = await fetch(item.images.original.url);
    const file = await response.blob();
    a.download = item.title;
    a.href = window.URL.createObjectURL(file);
    a.dataset.downloadUrl = ['application/octet-stream', a.download, a.href].join(':');
    container.appendChild(a);
    a.click();
}



//seccion favoritos

const favouritesLi = document.getElementById('favourites');
const favouritesSection = document.getElementById('favouritesSection');
const favouritesUl = document.getElementById('favouritesUl');
const noFavouritesYet = document.getElementById('emptyFavs');
const moreFavsButton = document.getElementById('showMoreFavs');
favouritesLi.addEventListener('click', showFavourites);

async function showFavourites (event) {
    event.preventDefault();

    checkbox.checked = false;

    let myFavourites = localStorage.getItem('myFavourites') || '[]';
    myFavourites = JSON.parse(myFavourites);

    header.style.display = 'none';
    myGifosSection.style.display = 'none';
    createSection.style.display = 'none';
    favouritesSection.style.display = 'block';

    if (myFavourites.length != 0) {
        header.style.display = 'none';
        renderResult(myFavourites, favouritesUl);
        if (myFavourites.length > 12) {
            moreFavsButton.style.display = 'block';
        }
    } else {
        noFavouritesYet.style.display = 'block';
    }
}

//seccion misGifos

const myGifosLi = document.getElementById('myGifosLi');
const myGifosSection = document.getElementById('myGifosSection');
const myGifosList = document.getElementById('myGifosList');
const emptyMyGifos = document.getElementById('emptyMyGifos');
const showMoreGifos = document.getElementById('showMoreGifos');

myGifosLi.addEventListener('click', showMyGifos);

async function showMyGifos (event) {
    event.preventDefault();

    let myGifos = localStorage.getItem('myGifos') || '[]';
    myGifos = JSON.parse(myGifos);

    header.style.display = 'none';
    createSection.style.display = 'none';
    favouritesSection.style.display = 'none';
    myGifosSection.style.display = 'block';

    if (myGifos.length != 0) {
        header.style.display = 'none',
        renderResult(myGifos, myGifosList);
        if (myGifos.length > 12) {
            showMoreGifos.style.display = 'block';
        }
    } else {
        emptyMyGifos.style.display = 'block';
    }
}

// modal
const modal = document.getElementById('modal');
const trendingSection = document.getElementById('trendingSection')
const modalCarousel = document.getElementById('modalCarousel');
const closeModal = document.getElementById('closeModal');
const footer = document.getElementById('footer');

function getModal(e) {
    modal.style.display = 'block';
//    trendingSection.style.display = 'none';   /* CAMBIO JUAN */
  //  footer.style.display = 'none';   /* CAMBIO JUAN */

    renderResult(e.currentTarget.items, modalCarousel, e.currentTarget.position); /* CAMBIO JUAN */
}

closeModal.addEventListener('click', function() {
    modal.style.display = "none";
//    trendingSection.style.display = 'block';  /* CAMBIO JUAN */
//    footer.style.display = 'block';  /* CAMBIO JUAN */
    })

    function showMoreButton() {
    moreButton.style.display='block';
}

let offset = 0
const limit = 12

async function showMoreResult(){
    const q = input.value;
    const url = getSearchUrl(q, limit, offset+=12);
    const response = await fetch(url);
    const results = await response.json();
    renderResult(results.data, searchUl);
    if (results.data.length < 12) {
        moreButton.style.display='none';
    }
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

    const p = document.createElement('p');
    for (let i = 0; i < firstResults.length; i++) {

        _aux = document.createElement('a');
        _aux.innerText = firstResults[i].charAt(0).toUpperCase() + firstResults[i].slice(1);
        _aux.addEventListener("click", autocomplete);

        coma = document.createElement('span');
        coma.innerText = ', ';

        p.appendChild(_aux);

        if (i < 4) {
            p.appendChild(coma);
        }
    }

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
    renderResult(results.data, carousel);
}

//carousel

position = 0;
width = 26.74;
count = 1;
items = carousel.querySelectorAll('carousel');
const nCarousel = 25;

prevButton.addEventListener('click', () => {
    position = Math.min(position + width * count, 0);
    carousel.style.marginLeft = position + 'vw';
})

nextButton.addEventListener('click', () => {
    position = Math.max(position - width * count, width * (items.length - (nCarousel - 5)));
    carousel.style.marginLeft = position + 'vw';
})

//create-mygifo

const createButton = document.getElementById('createButton');
const startCreateButton = document.getElementById('startCreateButton');
const stepOne = document.getElementById('stepOne');
const stepTwo = document.getElementById('stepTwo');
const stepThree = document.getElementById('stepThree');
const video = document.getElementById('video');
const one = document.getElementById('one');
const two = document.getElementById('two');
const three = document.getElementById('three');
const startRecordingButton = document.getElementById('startRecordingButton');
const timer = document.getElementById('timer');
const stopRecordingButton = document.getElementById('stopRecordingButton');
const repeatButton = document.getElementById('repeatButton');
const uploadButton = document.getElementById('uploadButton');
const preview = document.getElementById('preview');
const uploadingItems = document.getElementById('uploadingItems');
const successUploading = document.getElementById('successUploading');
const myGifDownloadButton = document.getElementById('myGifDownloadButton');
const myGifLinkButton = document.getElementById('myGifLinkButton');


createButton.addEventListener('click', openCreateSection);

function openCreateSection (event) {
    event.preventDefault();

    if (window.matchMedia("(min-width: 970px)").matches) {
        createButton.style.backgroundImage = "url('../images/CTA-crear-gifo-active.svg')";

        header.style.display = 'none';
        favouritesSection.style.display = 'none';
        trendingSection.style.display = 'none';
        createSection.style.display = 'block';
        cover.style.display = 'block';
        startCreateButton.style.display = 'block';

        startCreateButton.addEventListener('click', openStepOne);
    }
}

function openStepOne(event) {
    event.preventDefault();

    cover.style.display = 'none';
    stepOne.style.display = 'block';
    one.style.backgroundColor = '#572EE5';
    one.style.color = '#FFFFFF';
    startCreateButton.style.display = 'none';

    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        getStreamAndRecord();
    } else {
        alert('This device cannot support this action!');
    }
}

async function getStreamAndRecord() {

    stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });

    if (stream.active === true) {
        stepOne.style.display = 'none';
        stepTwo.style.display = 'block';
        video.style.display = 'block';
        video.srcObject = stream;
        timer.style.display = 'block';
        one.style.color = '#572EE5';
        one.style.backgroundColor = '#FFFFFF';
        two.style.backgroundColor = '#572EE5';
        two.style.color = '#FFFFFF';
        startRecordingButton.style.display = 'block';
        video.play();
        }

        startRecordingButton.addEventListener('click', startRecorder);
    }

function startRecorder(event) {
    startRecordingButton.style.display = 'none';
    stopRecordingButton.style.display = 'block';
    timer.style.display = "block";

    recorder = RecordRTC(stream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        });

    onGifRecordingStarted(recorder);

    stopRecordingButton.addEventListener('click', stopRecorder)
}

async function onGifRecordingStarted() {
    recorder.startRecording();
    counting();
}

function counting() {
    let sec = 0;
    let min = 0;
    let hour = 0;
    countdown = setInterval(function () {
        const time = new timer
        timer.innerHTML = `${hour}:${min}:${sec}`;
        sec++;
        if (sec == 60) {
            sec = 0;
            min++;
            if (min == 60) {
                min = 0;
                hour++;
            }
        }
    }, 1000);
}

async function stopRecorder() {

    stopRecordingButton.style.display = 'none';
    timer.style.display = "none";
    repeatButton.style.display = 'block';
    uploadButton.style.display = 'block';

    recorder.stopRecording();
    clearInterval(countdown);
    const blob = await recorder.getBlob();
    let urlCreator = window.URL || window.webkitURL;
    imageUrl = urlCreator.createObjectURL(blob);
    preview.src = imageUrl;

    video.style.display = "none";
    preview.style.display = "block";

    repeatButton.addEventListener('click', repeatCapture);
    uploadButton.addEventListener('click', uploadMyGif);
}

function repeatCapture() {
    preview.style.display = "none";
    uploadButton.style.display = 'none';
    repeatButton.style.display = 'none';
    timer.style.display = 'block';

    getStreamAndRecord();
}

const uploadUrl = () => {
    return `https://upload.giphy.com/v1/gifs?api_key=${apiKey}`;
}

async function uploadMyGif() {
    two.style.backgroundColor = '#FFFFFF';
    two.style.color = '#572EE5';
    three.style.backgroundColor = '#572EE5';
    three.style.color = '#FFFFFF';
    three.style.display = 'block';
    stepThree.style.display = 'block';
    uploadingItems.style.display = 'block';

    let form = new FormData();
    form.append("file", recorder.getBlob(), "myGif.gif");
    form.append("tags", "");

    const url = uploadUrl();
    const response = await fetch(url,
        {
            method: "POST",
            body: form,
        });
    const results = await response.json();

    if (results.meta.status === 200) {
        uploadingItems.style.display = 'none';
        successUploading.style.display = 'block';

        const myGifData = await fetch(`https://api.giphy.com/v1/gifs/${results.data.id}?api_key=${apiKey}`);
        const dataResponse = await myGifData.json();

        let gifInfo = {
            id: dataResponse.data.id,
            title: dataResponse.data.title,
            username: dataResponse.data.username,
            images: { original: { url: dataResponse.data.images.original.url } },
        }

        let myGifos = localStorage.getItem('myGifos') || '[]';
        myGifos = JSON.parse(myGifos);

        myGifos.push(gifInfo);
        localStorage.setItem('myGifos', JSON.stringify(myGifos));
    }
}

myGifDownloadButton.addEventListener('click', downloadMyGif);

function downloadMyGif() {
    myGifDownloadButton.download = 'mygif';
    myGifDownloadButton.href = imageUrl;
    myGifDownloadButton.dataset.downloadUrl = [
        "application/octet-stream",
        myGifDownloadButton.download,
        myGifDownloadButton.href,
    ].join(":");
}
