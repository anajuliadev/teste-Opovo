const url = "https://api.themoviedb.org/3/movie/14836?api_key=d05b016c8b01f0debfe296bef96a8359&language=pt-BR";

async function buscarApi() {
    const respostaApi = await fetch(url);
    console.log(respostaApi);

    
    const filme = await respostaApi.json();
    console.log(filme);
};

buscarApi();