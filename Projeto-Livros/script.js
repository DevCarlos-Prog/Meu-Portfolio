let paginaAtual = 1;
let termoAtual = "";

async function buscar() {
    termoAtual = document.getElementById("pesquisa").value;

    if (!termoAtual) {
        alert("Digite algo para buscar!");
        return;
    }

    paginaAtual = 1;
    carregarPagina();
}

async function carregarPagina() {
    const status = document.getElementById("status");
    const resultado = document.getElementById("resultado");

    status.innerHTML = "Carregando...";
    resultado.innerHTML = "";

    try {
        const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(termoAtual)}&page=${paginaAtual}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!data.docs || data.docs.length === 0) {
            status.innerHTML = "Nenhum livro encontrado.";
            return;
        }

        const totalPaginas = Math.ceil(data.numFound / 100);

        status.innerHTML = `
            Total encontrado: ${data.numFound} livros <br>
            Página ${paginaAtual} de ${totalPaginas}
        `;

        data.docs.forEach(item => {

            const capa = item.cover_i
                ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
                : `https://via.placeholder.com/128x180?text=Sem+Capa`;

            resultado.innerHTML += `
                <div class="card">
                    <img src="${capa}">
                    <h3>${item.title}</h3>
                    <p>${item.author_name ? item.author_name[0] : "Desconhecido"}</p>
                    <small>${item.first_publish_year || "N/A"}</small>
                </div>
            `;
        });

        mostrarControles(totalPaginas);

    } catch (e) {
        status.innerHTML = "Erro ao buscar livros.";
    }
}

function mostrarControles(totalPaginas) {
    const resultado = document.getElementById("resultado");

    let botoes = `<div class="paginacao">`;

    if (paginaAtual > 1) {
        botoes += `<button onclick="anterior()">⬅ Anterior</button>`;
    }

    botoes += `<span> Página ${paginaAtual} </span>`;

    if (paginaAtual < totalPaginas) {
        botoes += `<button onclick="proxima()">Próxima ➡</button>`;
    }

    botoes += `</div>`;

    resultado.innerHTML += botoes;
}

function proxima() {
    paginaAtual++;
    carregarPagina();
}

function anterior() {
    if (paginaAtual > 1) {
        paginaAtual--;
        carregarPagina();
    }
}

document.getElementById("pesquisa").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        buscar();
    }
});
