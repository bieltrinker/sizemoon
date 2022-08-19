function upload(){
    //Obtenha sua imagem
    var image=document.getElementById('image').files[0];
    //Obtenha o texto do seu blog
    var post=document.getElementById('post').value;
    //Obtenha o nome da imagem
    var imageName=image.name;
    //Referência de armazenamento de Firebase
    //É o caminho onde sua imagem será armazenada
    var storageRef=firebase.storage().ref('images/'+imageName);
    //Carregue a imagem para referência de armazenamento selecionado
    //Certifique-se de passar a imagem aqui
    var uploadTask=storageRef.put(image);
    //Para obter o estado de upload da imagem...
    uploadTask.on('state_changed',function(snapshot){
         //Obtenha o progresso da tarefa seguindo o código
         var progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
         console.log("upload é "+progress+" feita");
    },function(error){
      //lidar com o erro aqui
      console.log(error.message);
    },function(){
        //lidar com o upload bem -sucedido aqui ..
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
           //Obtenha sua imagem URL download aqui e envie -o para o banco de dados
           //Nosso caminho onde os dados são armazenados ... Push é usado para que cada post tenha um ID exclusivo
           firebase.database().ref('blogs/').push().set({
                 text:post,
                 imageURL:downloadURL
           },function(error){
               if(error){
                   alert("Erro durante o upload");
               }else{
                   alert("Carregado com sucesso");
                   // Agora redefina seu formulário
                   document.getElementById('post-form').reset();
                   getdata();
               }
           });
        });
    });

}

window.onload=function(){
    this.getdata();
}


function getdata(){
    firebase.database().ref('blogs/').once('value').then(function(snapshot){
      // Obtenha suas postagens div
      var posts_div=document.getElementById('posts');
      // Remova todos os dados restantes nessa div
      posts.innerHTML="";
      // Obtenha dados da Firebase
      var data=snapshot.val();
      console.log(data);
      // Agora passe esses dados para nossas postagens div
      // temos que passar nossos dados para o loop para obter um por um
      // estamos passando a chave dessa postagem para excluí-la do banco de dados
      for(let[key,value] of Object.entries(data)){
        posts_div.innerHTML="<div class='col-sm-4 mt-2 mb-1'>"+
        "<div class='card'>"+
        "<img src='"+value.imageURL+"' style='height:250px;'>"+
        "<div class='card-body'><p class='card-text'>"+value.text+"</p>"+
        "<button class='btn btn-danger' id='"+key+"' onclick='delete_post(this.id)'>Excluir</button>"+
        "</div></div></div>"+posts_div.innerHTML;
      }
    
    });
}

function delete_post(key){
    firebase.database().ref('blogs/'+key).remove();
    getdata();

}