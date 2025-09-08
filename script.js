const id_filme = 157336;
const apiKey = "d05b016c8b01f0debfe296bef96a8359";
const linguagem = "pt-BR";

const url = "https://api.themoviedb.org/3/movie/" + id_filme + "?api_key=" + apiKey + "&language=" + linguagem;
const urlPorters = "https://api.themoviedb.org/3/movie/" + id_filme + "/images" + "?api_key=" + apiKey;
const urlRecomendacoes = "https://api.themoviedb.org/3/movie/" + id_filme + "/recommendations" + "?api_key=" + apiKey;
const urlResenhas = "https://api.themoviedb.org/3/movie/" + id_filme + "/reviews" + "?api_key=" + apiKey + "&language=" + linguagem;
const urlVideos = "https://api.themoviedb.org/3/movie/" + id_filme + "/videos" + "?api_key=" + apiKey + "&language=" + linguagem;
const urlElenco = "https://api.themoviedb.org/3/movie/" + id_filme + "/credits" + "?api_key=" + apiKey + "&language=" + linguagem;


async function buscarApi(url) {
    const respostaApi = await fetch(url);
    let json = await respostaApi.json();
    console.log(json);

    return json;
};
const idiomas = {
    English: "Inglês",
    Spanish: "Espanhol",
    French: "Francês",
};
const status = {
    Released: "Relançado",
};

async function sobreFilme() {
    buscarApi(url).then((filme) => {
        document.getElementById('titulo').innerHTML = filme.title;
        document.getElementById('ano').innerHTML = "(" + filme.release_date.split("-")[0] + ")";
        document.getElementById('genero').innerHTML = filme.genres.map(genres => genres.name).join(', ');
        document.getElementById('sinopse').innerHTML = filme.overview;
        document.getElementById('situacao').innerHTML = status[filme.status] || filme.status;
        document.getElementById('idioma').innerHTML = idiomas[filme.spoken_languages[0].english_name] || filme.spoken_languages[0].english_name;
        const orcamento = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(filme.budget);
        document.getElementById('orcamento').innerHTML = orcamento;
        const receita = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(filme.revenue);
        document.getElementById('receita').innerHTML = receita;
        document.getElementById('capa').src = "https://image.tmdb.org/t/p/original" + filme.poster_path;
    });
};
sobreFilme();


function acharPorCargo(cargo, api) {
    const pessoa = api.crew.find(pessoa => pessoa.known_for_department === cargo);
    return pessoa;
}

async function imagesFilme() {
    buscarApi(urlPorters).then((filme) => {

        for (let i = 0; i < 4; i++) {
            document.getElementById('posters').innerHTML +=
                "<div>" +
                "<img class='rounded-3 posters-img h-100 w-100' src='https://image.tmdb.org/t/p/original" + filme.posters[i].file_path + "' alt='Pôster do filme " + (i + 1) + "'>" +
                "</div>";
        }

        for (let i = 0; i < 2; i++) {
            document.getElementById('fundo').innerHTML +=
                "<div>" +
                "<img class='rounded-3 imagens-fundo-img h-100 w-100' src='https://image.tmdb.org/t/p/original" + filme.backdrops[i].file_path + "' alt='Imagem de fundo " + (i + 1) + "'>" +
                "</div>";
        }

    });

    buscarApi(urlElenco).then((filme) => {

        const diretor = acharPorCargo("Directing", filme);
        if (diretor) {
            document.getElementById('direcao').innerHTML = diretor.name;
        } else {
            document.getElementById('direcao').innerHTML = "Não encontrado";
        }

        const escritor = acharPorCargo("Writing", filme);;
        if (escritor) {
            document.getElementById('escritor').innerHTML = escritor.name;
        } else {
            document.getElementById('escritor').innerHTML = "Não encontrado";
        }


        for (let i = 0; i < 10; i++) {
            document.getElementById('elenco').innerHTML +=
                "<div class='text-center'>" +
                "<img class='elenco-img rounded-circle' src='https://image.tmdb.org/t/p/original" + filme.cast[i].profile_path + "' alt='Foto de " + filme.cast[i].name + "'>" +
                "<p class='pt-3 m-0 text-gray fs-4 fw-bold'>" + filme.cast[i].name + "</p>" +
                "<p class='p-0 m-0 text-gray fs-4'>" + filme.cast[i].character + "</p>" +
                "</div>";

        }
    });
    buscarApi(urlResenhas).then((filme) => {

        for (let i = 0; i < 2; i++) {
            const data = new Date(filme.results[i].updated_at);
            const dataFormatada = data.toLocaleDateString('pt-BR');

            document.getElementById('resenhas').innerHTML +=
                "<div class='col d-flex flex-column col bg-yellow-bege rounded-3 p-4 ' id='resenhas'>" +
                "<p class='fs-4 lh-1 resenha-truncate flex-grow-1'>" + filme.results[i].content + "</p>" +
                "<div class='d-flex flex-column justify-content-between'><p class='fs-4 m-0'>por <strong class='text-primary'>" + filme.results[i].author + "</strong></p>" + "" +
                "<div class='d-flex justify-content-between'><p class='fs-4 d-flex m-0'>" + dataFormatada +
                "<p class='fs-4 m-0'>Nota: " +
                "<strong class='text-primary'>" + filme.results[i].author_details.rating + "</strong>/10</p></div>" +
                "</div>" +
                "</div>";

        }

    });
    buscarApi(urlVideos).then((filme) => {

        for (let i = 0; i < 3; i++) {
            document.getElementById('videos').innerHTML += "<div class='rounded-3 overflow-hidden'><iframe width='100%' height='100%' class='videos-frame' src='https://www.youtube.com/embed/" + filme.results[i].key + "?si=yeB7vxHUEdSC63-w' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerpolicy='strict-origin-when-cross-origin' allowfullscreen></iframe> </div>";

        }
    });
    buscarApi(urlRecomendacoes).then((filme) => {

        for (let i = 0; i < 6; i++) {
            const avaliacao = Math.round(filme.results[i].vote_average / 10 * 100) + "%";

            document.getElementById('recomendacoes').innerHTML += "<div class='d-flex flex-column text-center'><img class='rounded-3 recomendacoes-img' src='https://image.tmdb.org/t/p/original" + filme.results[i].backdrop_path + "' alt='Poster de " + filme.results[i].title + "'><p class='fw-semibold fs-4 text-yellow-bege p-0 m-0'>" + filme.results[i].title + "</p><p class='fw-normal fs-4 text-yellow-bege p-0 m-0'>" + avaliacao + "</p></div>";

        }
    });
};

imagesFilme();