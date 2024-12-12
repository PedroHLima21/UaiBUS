
// Insira sua chave de API aqui
const API_KEY = '9ce9a8acefe84927854d9b19eb7fd0c5';

// Selecionar os elementos de checkbox e o botão
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const botaoEnviar = document.querySelector('.Botao');
const containerMeio = document.querySelector('.container-meio');

// Função para buscar notícias reais de Belo Horizonte
async function buscarNoticias(categorias) {
    try {
        // Montar a URL de consulta à API, incluindo Belo Horizonte como cidade
        const url = `https://newsapi.org/v2/everything?q=${categorias.join(' OR ')} AND "Belo Horizonte" AND (trânsito OR acidentes OR políticas)&language=pt&sortBy=publishedAt&apiKey=${API_KEY}`;

        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (dados.status === 'ok') {
            mostrarNoticias(dados.articles);
        } else {
            console.error('Erro ao buscar as notícias:', dados);
            mostrarMensagemErro('Erro ao buscar as notícias.');
        }
    } catch (erro) {
        console.error('Erro de rede:', erro);
        mostrarMensagemErro('Erro ao se conectar à API de notícias.');
    }
}

// Função para exibir as notícias no HTML
function mostrarNoticias(noticias) {
    const noticiasContainer = document.createElement('div');
    noticiasContainer.classList.add('noticias-container');

    // Limpa o container antes de exibir novas notícias
    const noticiasAntigas = document.querySelector('.noticias-container');
    if (noticiasAntigas) {
        noticiasAntigas.remove();
    }

    noticias.forEach(noticia => {
        const noticiaElemento = document.createElement('div');
        noticiaElemento.classList.add('noticia');

        // Verificar se a notícia tem imagem
        const imagem = noticia.urlToImage ? `<img src="${noticia.urlToImage}" alt="Imagem da notícia" class="imagem-noticia">` : '';

        noticiaElemento.innerHTML = `
            ${imagem}
            <h3>${noticia.title}</h3>
            <p>${noticia.description ? noticia.description : 'Sem descrição disponível.'}</p>
            <a href="${noticia.url}" target="_blank">Leia mais</a>
        `;

        noticiasContainer.appendChild(noticiaElemento);
    });

    containerMeio.appendChild(noticiasContainer);
}

// Função para mostrar mensagem de erro
function mostrarMensagemErro(mensagem) {
    const erroElemento = document.createElement('div');
    erroElemento.classList.add('erro');
    erroElemento.textContent = mensagem;

    // Remove a mensagem de erro anterior, se houver
    const erroAntigo = document.querySelector('.erro');
    if (erroAntigo) {
        erroAntigo.remove();
    }

    containerMeio.appendChild(erroElemento);
}

// Função que coleta as categorias marcadas e chama a busca de notícias
function coletarCategoriasSelecionadas() {
    const categoriasSelecionadas = [];

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            categoriasSelecionadas.push(checkbox.value);
        }
    });

    return categoriasSelecionadas;
}

// Evento de clique no botão para buscar as notícias
botaoEnviar.addEventListener('click', () => {
    const categoriasSelecionadas = coletarCategoriasSelecionadas();

    if (categoriasSelecionadas.length === 0) {
        mostrarMensagemErro('Por favor, selecione pelo menos uma categoria.');
    } else {
        buscarNoticias(categoriasSelecionadas);
    }
});

const botaoDesativar = document.querySelector('.desativar-noticias');

// Função para desativar as notícias
function desativarNoticias() {
    const noticiasContainer = document.querySelector('.noticias-container');
    if (noticiasContainer) {
        noticiasContainer.style.display = 'none'; // Esconde as notícias
    }
}

// Evento de clique no botão para desativar as notícias
botaoDesativar.addEventListener('click', desativarNoticias);
