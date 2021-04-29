
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const paginacion = document.querySelector('#paginacion');

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

document.addEventListener('DOMContentLoaded', ()=>{
    formulario.addEventListener('submit', validarFormulario);
});

function validarFormulario(e){
    e.preventDefault();

    const término = document.querySelector('#termino').value;

    if(término === ''){
        mostrarAlerta('Debes agregar un término de busqueda');

        return;
    }


    // Consular API
    
    buscarIMG();
};

function mostrarAlerta(mensaje){
    
    const existeAlerta = document.querySelector('.bg-red-100');
    if(!existeAlerta){
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded',
        'max-w-lg','mx-auto','mt-6','text-center');

        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;

        formulario.appendChild(alerta);

        setTimeout(()=>{
            alerta.remove();
        },2000)
    }

};


function buscarIMG(){

    const término = document.querySelector('#termino').value;
    
    const key = '21240768-fa691ac22b98a4486381f7828';
    const url = `https://pixabay.com/api/?key=${key}&q=${término}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => {
        totalPaginas = calcularPáginas(resultado.totalHits);
        mostrarImagenes(resultado.hits);
    })    
};

// Generador que va a registrar la cantidad de elementos de acuerdo a las páginas
function *crearPaginador(total){
    for(let i = 1; i <= total; i++){
        yield i;
    }
}

function calcularPáginas(total){
    return parseInt(Math.ceil(total / registrosPorPagina));
}

function mostrarImagenes(imagenes){
    // console.log(imagenes);
    
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    };

    // Iterar sobre el arreglo de imágenes y construir HTML

    imagenes.forEach(imagen=> {
        const {previewURL, likes, views, largeImageURL} =  imagen;

        resultado.innerHTML += `
            <div class ="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">
                
                <div class="p-4">
                        <p class="font-bold"> ${likes} <span class="font-light"> Me gusta </span> </p>
                        <p class="font-bold"> ${views} <span class="font-light"> Vistas </span> </p>
                    
                        <a 
                            class= "block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" 
                            href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                             Ver Imagen
                            </a>
                    </div>
                </div>
            </div>
        `;  
    });
    imprimirPaginador();
}


function imprimirPaginador(){
    limpiarHTML();
    
    iterador = crearPaginador(totalPaginas);

    while(true){
        const { value, done} = iterador.next();
        if(done) return;

        // Caso contrario genera un botón por cada elemento del generador
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400','px-4','py-1','mr-2','font-bold','mb-4','rounded');

        boton.onclick = () => {
            paginaActual = value;

            buscarIMG();
        }
        
        paginacion.appendChild(boton);
    }
}

function limpiarHTML(){
    while(paginacion.firstChild){
        paginacion.removeChild(paginacion.firstChild);
    };
};


