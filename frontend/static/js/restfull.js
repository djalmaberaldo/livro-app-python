const url='http://127.0.0.1:5000/livro';
var objId = null;

function carregarDados(){

    fetch(url,{
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
    window.location = url + '/criar';
}

function preencherTabela(livros){
    var rows = "";
    for (var key in livros){
        var contentRow = "<tr><td>"+livros[key].titulo+"</td>"
        + "<td>"+livros[key].autor+"</td>"
        +"<td>"+livros[key].isbn+"</td>"
        +"<td>"+livros[key].editora+"</td>"
        +"<td>"+livros[key].edicao+"</td>"
        +"<td>R$ "+livros[key].preco+",00</td>"
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


function cadastrarOuEditarLivro(){

    //Pega os valores do formulário
    var formData = {"titulo": document.getElementById("titulo").value,
    "autor": document.getElementById("autor").value,
    "isbn": document.getElementById("isbn").value,
    "preco": document.getElementById("preco").value,
    "edicao": document.getElementById("edicao").value,
    "editora": document.getElementById("editora").value,
    "id": objId};

    var headers = new Headers();
    headers.append("Content-type","application/json")

    console.log(objId);

    fetch(url,{
        method: (formData.id === null ? 'POST':'PUT'),
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
    fetch(url+'/'+id+'/',{
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
                 console.log(key);
                document.getElementById(key).value = response[key];
            }
        }
    })
    .catch(function(err) { console.error(err); });
}

function excluirLivro(id){
    fetch(url+'/'+id+'/',{
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
    document.getElementById("isbn").value = '';
    document.getElementById("preco").value = '';
    document.getElementById("edicao").value ='';
    document.getElementById("editora").value = '';
    objId = null;
}