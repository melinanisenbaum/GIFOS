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
        _timer = setTimeout(function() { showTags()}, 300);
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
    //console.log (data);
    //console.log(q);

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
        img.src = './images/icon-search.svg';
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
    console.log('llegue');
    input.value = '';
    console.log('lo logre');
    closeButton.classList.remove('focus');
    lens.classList.remove ('focus');
}

const getSearchUrl = (input, limit=12, offset=0) => {
    return `https://api.giphy.com/v1/gifs/search?q=${input}&api_key=${apiKey}&limit=${limit}&offset=${offset}`;
}

async function showResult(event) {
    event.preventDefault();

    closeTags();
    console.log('showResult');
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
    console.log(results);

    const h2 = document.getElementById('searchTitle');
       
    if(results.data.length>0) {
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
        //favIcon.className = 'fav-icon';
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

        // para agregar a favoritos agregar a favoritos
        if (screen.width < 970) {
            li.addEventListener('touchend', getModal)//????????
        } else {
            favButton.addEventListener('click', changeFavouriteState);
            downloadButton.addEventListener('click', download);
            maxButton.addEventListener('click', getModal);
            maxButton.items = list;
            maxButton.gifInfo = gifInfo;
        }

        async function changeFavouriteState(event) {
            event.preventDefault();
          
            //leer el local Storage
            let myFavourites = localStorage.getItem('myFavourites') || '[]';
            myFavourites = JSON.parse(myFavourites);

            // buscamos el id de newGifo en la lista de favoritos
            let newFav = myFavourites.findIndex(function(item) { return item.id === gifInfo.id; });
            if (newFav > -1) {
                // si está, lo quitamos
                myFavourites.splice(newFav, 1);
                console.log('existe');
                changeIcon(0);
            } else {
                // si no está, lo añadimos
                myFavourites.push(gifInfo);
                changeIcon(1);
                }
            // guardamos la lista de favoritos 
            localStorage.setItem('myFavourites', JSON.stringify(myFavourites));
        }

        function changeIcon(_state) {
            if (_state == 0) {
                favIcon.src = './images/icon-fav.svg';
            } else if (_state == 1) {
                favIcon.src = './images/icon-fav-active.svg';
                //favButton.classList.add('fav-icon-active');
            }
        }
        //download image
        async function download (event) {//no funciona
            event.preventDefault();

            //create new a element
            const a = document.createElement('a');
            const response = await fetch(item.url)//, init: {
                //mode: 'no-cors',//no funciona!
            //});
            // get image as blob
            const file = await response.blob();
            a.download = item.title;
            a.href = window.URL.createObjectURL(file);
            //store download url in javascript https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes#JavaScript_access
            a.dataset.downloadUrl = ['application/octet-stream', a.download, a.href].join(':');
            //click on element to start download
            container.appendChild(a);
            a.click();
        }
    })
} 
//seccion favoritos

const favouritesLi = document.getElementById('favourites');
const favouritesSection = document.getElementById('favouritesSection');
const favouritesUl = document.getElementById('favouritesUl');
const noFavouritesYet = document.getElementById('emptyFavs');

favouritesLi.addEventListener('click', showFavourites);

async function showFavourites (e) {

    let myFavourites = localStorage.getItem('myFavourites') || '[]';
    myFavourites = JSON.parse(myFavourites);

    favouritesSection.style.display = 'block';

    if (myFavourites.length != 0) {
        header.style.display = 'none',
        renderResult(myFavourites, favouritesUl);//error
        showMoreButton();
    } else {
        noFavouritesYet.style.display = 'block';
    }
}
//seccion misGifos

const myGifosLi = document.getElementById('myGifosLi');
const myGifosSection = document.getElementById('myGifosSection');
const myGifosList = document.getElementById('myGifosList');
const emptyMyGifos = document.getElementById('emptyMyGifos');

myGifosLi.addEventListener('click', showMyGifos);

async function showMyGifos (event) {
    event.preventDefault();

    let myGifos = localStorage.getItem('myGifos') || '[]';
    myGifos = JSON.parse(myGifos);

    console.log(myGifos)//error

    myGifosSection.style.display = 'block';

    if (myGifos.length != 0) {
        header.style.display = 'none',
        renderResult(myGifos, myGifosList);
        showMoreButton();
    } else {
        emptyMyGifos.style.display = 'block';
    }
}

// modal HAY QUE BORRARLO Y VINCULARLO CON EL OTRO ARCHIVO
const modal = document.getElementById('modal');
const trendingSection = document.getElementById('trendingSection')
const modalCarousel = document.getElementById('modalCarousel');
const closeModal = document.getElementById('closeModal');
const footer = document.getElementById('footer');

function getModal(e) {//terminar
    modal.style.display = 'block';
    //nav.style.display = 'none';
    //header.style.display = 'none';
    trendingSection.style.display = 'none';
    footer.style.display = 'none';
    //funciona pero como hago para que se dirija arriba el scroll cuando abro? 

    renderResult(e.currentTarget.items, modalCarousel);
    console.log(e.currentTarget.items);
}

closeModal.addEventListener('click', function() {
    modal.style.display = "none";
    trendingSection.style.display = 'block';
    footer.style.display = 'block';
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
        
    for (let i = 0; i < firstResults.length; i++) {
        firstResults[i] = firstResults[i].charAt(0).toUpperCase() + firstResults[i].slice(1);
        //firstResults[i].addEventListener('click', showResults);
        //terminar
    }

    const p = document.createElement('p');
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
    renderResult(results.data, carousel);
    //setInitialClasses(results.data);
}

//carousel

/*const itemClassName = 'card';
    items = document.getElementsByClassName(itemClassName),
    totalItems = items.length,
    slide = 0,
    moving = true;*/
  
/*
// Set classes
function setInitialClasses(items) {
    // Targets the previous, current, and next items
    // This assumes there are at least three items.
    items[items - 1].classList.add('prev');
    items[0].classList.add('active');
    items[1].classList.add('active');
    items[2].classList.add('active');
    items[3].classList.add('next');
  }

  prevButton.addEventListener('click', movePrev);
  //prevButton.addEventListener('touchstart', scrollLeft);
  nextButton.addEventListener('click', moveNext);
  //nextButton.addEventListener('touchend', scrollLeft);  

  // Next navigation handler
function moveNext() {
    // Check if moving
    if (!moving) {
      // If it's the last slide, reset to 0, else +1
      if (slide === (totalItems - 1)) {
        slide = 0;
      } else {
        slide++;
      }
      // Move carousel to updated slide
      moveCarouselTo(slide);
    }
  }
  // Previous navigation handler
  function movePrev() {
    // Check if moving
    if (!moving) {
      // If it's the first slide, set as the last slide, else -1
      if (slide === 0) {
        slide = (totalItems - 1);
      } else {
        slide--;
      }
            
      // Move carousel to updated slide
      moveCarouselTo(slide);
    }
  }
  function disableInteraction() {
    // Set 'moving' to true for the same duration as our transition.
    // (0.5s = 500ms)
    
    moving = true;
    // setTimeout runs its function once after the given time
    setTimeout(function(){
      moving = false
    }, 500);
  }
  function moveCarouselTo(slide) {
    // Check if carousel is moving, if not, allow interaction
    if(!moving) {
      // temporarily disable interactivity
      disableInteraction();
      // Update the "old" adjacent slides with "new" ones
      var newPrevious = slide - 1,
          newNext = slide + 1,
          oldPrevious = slide - 2,
          oldNext = slide + 2;
      // Test if carousel has more than three items
      if ((totalItems - 1) > 3) {
        // Checks and updates if the new slides are out of bounds
        if (newPrevious <= 0) {
          oldPrevious = (totalItems - 1);
        } else if (newNext >= (totalItems - 1)){
          oldNext = 0;
        }
        // Checks and updates if slide is at the beginning/end
        if (slide === 0) {
          newPrevious = (totalItems - 1);
          oldPrevious = (totalItems - 2);
          oldNext = (slide + 1);
        } else if (slide === (totalItems -1)) {
          newPrevious = (slide - 1);
          newNext = 0;
          oldNext = 1;
        }
        // Now we've worked out where we are and where we're going, 
        // by adding/removing classes we'll trigger the transitions.
        // Reset old next/prev elements to default classes
        items[oldPrevious].className = itemClassName;
        items[oldNext].className = itemClassName;
        // Add new classes
        items[newPrevious].className = itemClassName + " prev";
        items[slide].className = itemClassName + " active";
        items[newNext].className = itemClassName + " next";
      }
    }
  }
  function initCarousel() {
    setInitialClasses();
    // Set moving to false so that the carousel becomes interactive
    moving = false;
  }
  initCarousel();
*/
  //create-mygifo

const createButton = document.getElementById('createButton');
const createSection = document.getElementById('createSection');
const cover = document.getElementById('cover');
const startCreateButton = document.getElementById('startCreateButton');

createButton.addEventListener('click', openCreateSection);

function openCreateSection (event) {
    event.preventDefault();

    const stepOne = document.getElementById('stepOne');

    createButton.style.backgroundImage = "url('../images/CTA-crear-gifo-active.svg')";

    header.style.display = 'none';
    favouritesSection.style.display = 'none';
    trendingSection.style.display = 'none';
    createSection.style.display = 'block';
    cover.style.display = 'block';
    startCreateButton.style.display = 'block';

    startCreateButton.addEventListener('click', openStepOne);
    
    function openStepOne(event) {
        event.preventDefault();

        const one = document.getElementById('one');
                
        cover.style.display = 'none';
        stepOne.style.display = 'block';
        one.style.backgroundColor = '#572EE5';
        one.style.color = '#FFFFFF';
        startCreateButton.style.display = 'none';
        
        //Checking Device Support
        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            console.log("Let's get this party started");
            getStreamAndRecord();
        } else {
              alert('This device cannot support this action!');
        }
        
        async function getStreamAndRecord() {//no se como es el permiso desde el navegador
            stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
            const stepTwo = document.getElementById('stepTwo');
            const video = document.getElementById('video');
            const two = document.getElementById('two');
            const startRecordingButton = document.getElementById('startRecordingButton');
            const timer = document.getElementById('timer');

            if (stream.active === true) {
                stepOne.style.display = 'none';
                video.style.display = 'block';
                video.src = stream;
                one.style.color = '#572EE5';
                one.style.backgroundColor = '#FFFFFF';
                two.style.backgroundColor = '#572EE5';
                two.style.color = '#FFFFFF';
                startRecordingButton.style.display = 'block';
                video.play();
                //timer.style.display = "block";
                //timer.innerHTML = '00:00:00';
            }

            startRecordingButton.addEventListener('click', startRecording);

            async function startRecording(event) {

            }
            //stream.then(function(mediaStream) {
                

                //video.play();
                //video.src = window.URL.createObjectURL(mediaStream);
                
                //video.onloadedmetadata = function(e) {
                    
                // Do something with the video here.
            //})
            //.catch(function(err) {
            //    console.log(err.name);
            //});
        }
        //https://github.com/migue1223/gifos/blob/master/assets/js/crearGifos.js#L6
                

                    

        //
    }
}
    //const startRecordingButton = document.getElementById('startRecordingButton');
    //startRecordingButton.style.display = 'block';
/*function changeCreateIcon(_state) {
    if (_state == 0) {
        favIcon.src = './images/icon-fav.svg';
    } else if (_state == 1) {
        favIcon.src = './images/icon-fav-active.svg';
        //favButton.classList.add('fav-icon-active');
    }
}
//acceder a la camara

});

p.catch(function(err) { console.log(err.name); }); // always check for errors at the end.
*/
