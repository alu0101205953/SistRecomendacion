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

      for (let i = 0; i < dummy.length; i++) { //Eliminar los espacios en blanco al final de cada fila de la matriz
        for (let j = 0; j < dummy[i].length; j++) {
          if (dummy[i][j] == "") {
            dummy[i].pop();
          }
        }
      }
    
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
  calculatePrediction(sim, matrix, neighbors, prediction, metrics);
}

function calculateSimilarity(matrix, metrics) {
  let vect = [];
  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i].indexOf("-") !== -1) {
      let aux = [];
      for (let j = 0; j < matrix.length; j++) { 
        if (i !== j) {
          switch (metrics) {
            case "coseno":
              aux.push([j, cosine(matrix[i], matrix[j])]);
              break;
            case "euclidea":
              aux.push([j, euclidean(matrix[i], matrix[j])]);
              break;
            default:
              aux.push([j, pearson(matrix[i], matrix[j])]);
              break;
          }
        }
        
      }
      vect.push([i, aux]);
    }
  }
  let str = "<table>";
  str += "<tr><th>/</th>";
  
  for (let j = 0; j < matrix.length; j++) {
    str += "<th> Usuario " + String(j) + "</th>";
  }

  for (let i = 0; i < vect.length; i++) {
    str += "<tr>";
    str += "<th> Usuario " + vect[i][0] + "</th>";
    
    let k = 0;
    for (let j = 0; j < matrix.length; j++) {
      if (vect[i][0] !== j) {
        str += "<th>" + vect[i][1][k][1] + "</th>";
        k++;
      } else {
        str += "<th>-</th>";
      }
    }
    str += "</tr>";
  }
  str += "</table>";
  document.getElementById("output2").innerHTML = str; 
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

function calculatePrediction(sim, matrix, neighbors, prediction, metrics) {
  let tupleCounter = 0;

  if (prediction == "diferencia") {
    for (let i = 0; i < matrix.length; i++) {
      if (matrix[i].indexOf("-") !== -1) {
        let similarNeighbors = sortArray(neighbors, sim[tupleCounter][1], metrics);
        for (let j = 0; j < matrix[i].length; j++) {
          if (matrix[i][j] == "-") {
            let acc1 = 0;
            let acc2 = 0;
            for (let k = 0; k < similarNeighbors.length; k++) {
              if (!isNaN(matrix[similarNeighbors[k][0]][j])) {
                acc1 += similarNeighbors[k][1] * (matrix[similarNeighbors[k][0]][j] - average(matrix[similarNeighbors[k][0]]));
                acc2 += Math.abs(similarNeighbors[k][1]);
              }
            }
            if (acc2 !== 0) {
              matrix[i][j] = String(Math.round(acc1 / acc2));
              if (Math.round(acc1 / acc2) < 0) {
                matrix[i][j] = String(0);
              } else if (Math.round(acc1 / acc2) > 5) {
                matrix[i][j] = String(5); 
              }
            }   
          }
        }
        tupleCounter++;
      }
    }
  } else {
    for (let i = 0; i < matrix.length; i++) {
      if (matrix[i].indexOf("-") !== -1) {
        let similarNeighbors = sortArray(neighbors, sim[tupleCounter][1], metrics);
        for (let j = 0; j < matrix[i].length; j++) {
          if (matrix[i][j] == "-") {
            let acc1 = 0;
            let acc2 = 0;
            for (let k = 0; k < similarNeighbors.length; k++) {
              if (!isNaN(matrix[similarNeighbors[k][0]][j])) {
                acc1 += similarNeighbors[k][1] * matrix[similarNeighbors[k][0]][j];
                acc2 += Math.abs(similarNeighbors[k][1]); 
              }               
            }
            if (acc2 !== 0) {
              matrix[i][j] = String(Math.round(acc1 / acc2));
              
              if (Math.round(acc1 / acc2) < 0) {
                matrix[i][j] = String(0);
              } else if (Math.round(acc1 / acc2) > 5) {
                matrix[i][j] = String(5); 
              } 
            }           
          }
        }
        tupleCounter++;
      }
    }
  }
  
  document.getElementById("output3").innerHTML = matrix.join("<br>");
}

function sortArray(k, arr, metrics) {
  let neighbors = [...arr];
  let result = [];

  if (metrics == "euclidea") {
    for (let i = 0; i < k; i++) {
      let min = 0;
      for (let j = 0; j < neighbors.length; j++) {
        if (neighbors[min][1] >= neighbors[j][1]) {
          min = j;
        }
      }
      result.push(neighbors[min]);
      neighbors.splice(min, 1);
    }
  } else {
    for (let i = 0; i < k; i++) {
      let max = 0;
      for (let j = 0; j < neighbors.length; j++) {
        if (neighbors[max][1] <= neighbors[j][1]) {
          max = j;
        }
      }
      result.push(neighbors[max]);
      neighbors.splice(max, 1);
    }
  }

  return result;
}