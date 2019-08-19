const baseUrl ='http://127.0.0.1:5000/book';
var objId = null;
let method = 'POST';

function carregarDados(){

    fetch(baseUrl,{
        method: 'GET'
    })
    .then(function(response){
        return response.json();
    })
    .then(function(response) { 
        preencherTabela(response);
    })
    .catch(function(err) { console.error(err); });
}

function carregarFormularioCadastroEdicao(){
    document.getElementById("form-add").style.display='block';
    document.getElementById("table-area").style.display='none';
}

function preencherTabela(livros){
    var rows = "";
    for (var key in livros){
        var contentRow = "<tr><td>"+livros[key].title+"</td>"
        + "<td>"+livros[key].author+"</td>"
        +"<td><input type='button' value='Editar' onclick='editarLivro("+livros[key].id+")'>"
        +"<input type='button' value='Excluir' onclick='excluirLivro("+livros[key].id+")'></td>"
        +"</tr>"
        rows = rows + contentRow;
    }

    document.getElementById("content-row").innerHTML = rows;
}

function cancelarAdicionar(){
    document.getElementById("form-add").style.display='none';
    document.getElementById("table-area").style.display='block';
}


function cadastrarOuEditarLivro() {

    //Pega os valores do formulário
    var formData = {"title": document.getElementById("titulo").value,
    "author": document.getElementById("autor").value,
    "id": objId};

    var headers = new Headers();
    headers.append("Content-type","application/json")

    if(formData.id !== null) {
        method = 'PUT';
        url = baseUrl + '/' + formData.id;
    } else {
        method = 'POST';
        url = baseUrl;
    }

    console.log(method);

    fetch( url , {
        method: method,
        body: JSON.stringify(formData),
        headers: headers
    })
    .then(function(response) { 
        response.text()
        .then(function(result){ 
            document.getElementById("table-area").style.display='block';
            document.getElementById("form-add").style.display='none';
            limparTabela();
            carregarDados();
        }) 
    })
    .catch(function(err) { console.error(err); });
}

function editarLivro(id){

    //Carrega formulário para edição
    carregarFormularioCadastroEdicao();
    
    //Busca dados do livro
    fetch(baseUrl+'/'+id ,{
        method: 'GET'
    })
    .then(function(response){
        return response.json();
    })
    .then(function(response) { 
        for(key in response){
            if(key === 'id'){
                objId = response[key];
            }else{
                 //Atribui valores ao campos
                document.getElementById(key).value = response[key];
            }
        }
    })
    .catch(function(err) { console.error(err); });
}

function excluirLivro(id){
    fetch(baseUrl+'/'+id,{
        method: 'DELETE'
    })
    .then(function(response) { 
        response.text()
        .then(function(result){ 
            carregarDados();
        }) 
    })
    .catch(function(err) { console.error(err); });
}

function limparTabela(){
    document.getElementById("titulo").value = '';
    document.getElementById("autor").value ='';
    objId = null;
}