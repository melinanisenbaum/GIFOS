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

    renderResult(e.currentTarget.items, modalCarousel);//como me refiero a esta funcion que esta en otro js?
    //console.log(e.currentTarget.items);
}

closeModal.addEventListener('click', function() {
    modal.style.display = "none";
    trendingSection.style.display = 'block';
    footer.style.display = 'block';
    })