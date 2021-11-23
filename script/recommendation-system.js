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
    }

    fr.onloadend = function() {
      document.getElementById("output").innerHTML = txtArr.join("<br>"); 
    }

    fr.readAsText(file.files[0]);
  }

  document.getElementById("calcular").addEventListener("click", (_) => {
    if (Number(document.getElementById("vecinos").value) < txtArr.length) {
      calculate(txtArr, document.getElementById("metrica").value, Number(document.getElementById("vecinos").value), document.getElementById("prediccion").value);
    }
  });

}

function calculate(matrix, metrics, neighbors, prediction) {
  let sim = calculateSimilarity(matrix, metrics);
  calculatePrediction(sim, matrix, neighbors, prediction);
}

function calculateSimilarity(matrix, metrics) {
  let vect = [];
  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i].indexOf("-") !== -1) {
      let aux = [];
      for (let j = 0; j < matrix.length; j++) {
        if (i == j) {
          aux.push(0);
        } else {
          switch (metrics) {
            case "coseno":
              aux.push(cosine(matrix[i], matrix[j]));
              break;
            case "euclidea":
              aux.push(euclidean(matrix[i], matrix[j]));
              break;
            default:
              aux.push(pearson(matrix[i], matrix[j]));
              break;
          }
        }
        
      }
      vect.push([i, aux]);
    }
  }
  console.log(vect);
  return vect;
}

function pearson(u, v) {
  let s = [];
  for (let i = 0; i < u.length; i++) {
    if ((u[i] !== "-") && (v[i] !== "-")) {
      s.push(i);
    }
  }

  let acc1 = 0;
  let acc2 = 0;
  let acc3 = 0;

  for (let i = 0; i < s.length; i++) {
    acc1 += (u[s[i]] - average(u)) * (v[s[i]] - average(v));
    acc2 += Math.pow((u[s[i]] - average(u)), 2);
    acc3 += Math.pow((v[s[i]] - average(v)), 2);
  }

  acc2 = Math.sqrt(acc2);
  acc3 = Math.sqrt(acc3);

  return acc1 / (acc2 * acc3);
}

function cosine(u, v) {
  let s = [];
  for (let i = 0; i < u.length; i++) {
    if ((u[i] !== "-") && (v[i] !== "-")) {
      s.push(i);
    }
  }
  
  let acc1 = 0;
  let acc2 = 0;
  let acc3 = 0;

  for (let i = 0; i < s.length; i++) {
    acc1 += u[s[i]] * v[s[i]];
    acc2 += Math.pow(u[s[i]], 2);
    acc3 += Math.pow(v[s[i]], 2);
  }

  acc2 = Math.sqrt(acc2);
  acc3 = Math.sqrt(acc3);

  return acc1 / (acc2 * acc3);
}

function euclidean(u, v) { //Cuanto mayor es la distancia menor es la similitud
  let s = [];
  for (let i = 0; i < u.length; i++) {
    if ((u[i] !== "-") && (v[i] !== "-")) {
      s.push(i);
    }
  }

  let acc = 0;

  for (let i = 0; i < s.length; i++) {
    acc += Math.pow((u[s[i]] - v[s[i]]), 2);
  }

  return Math.sqrt(acc);
}

function average(u) {
  let acc = 0;
  let len = 0;
  for (let i = 0; i < u.length; i++) {
    if (u[i] !== "-") {
      acc += Number(u[i]);
      len++;
    }
  }
  return acc / len;
}

function calculatePrediction(sim, matrix, neighbors, prediction) {
  let sort = [];
  let aux = [];
  for (let i = 0; i < sim.length; i++) {
    aux.push(sim[i][1].sort((a, b) => a - b));
    sort.push(i, aux);
  }
  
  
  // if (neighbors < matrix.length) {
  //  sim = sim.slice(0, neighbors + 1);
  //}
  console.log(sort);
}