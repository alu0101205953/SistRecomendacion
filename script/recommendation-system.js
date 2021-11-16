$(document).ready(function() {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
      // Great success! All the File APIs are supported.
      document.getElementById('file').addEventListener('change', handleFiles, false); // Añade un punto de escucha que invocará a la función handleFiles cuando se produzca un cambio en el campo de subida de ficheros
  } else {
      alert('The File APIs are not fully supported in this browser.');
  }
});
async function handleFiles(e) {
  if (e.target.files[0].type !== 'text/plain') {
    alert ("Formato no válido");
  } else {
    var txtArr = [];
    var fr = new FileReader();
    fr.onload = function() {
      // By lines
      var lines = String(this.result).split('\n');
      txtArr = [...lines];
      var dummy = [];
      txtArr.forEach(e => {
        if (e !== "") {
          dummy.push(e.split(" "));
        }
      });
      txtArr = [...dummy];
      //lines = String(this.result).split('\n');
    }

    fr.onloadend = function() {
      document.getElementById("output").innerHTML = txtArr.join("<br>"); 
    }

    fr.readAsText(file.files[0]);
  }

}