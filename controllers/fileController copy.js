const XLSX = require('xlsx');

// Definir los intervalos de CoF y FoF
const intervalsCof = {
  "Extreme": [1.50e9, Infinity],
  "Critical": [1.50e8, 1.50e9],
  "Severe": [1.50e6, 1.50e8],
  "Serious": [5.00e5, 1.50e6],
  "Moderate": [4.00e4, 5.00e5],
  "Minor": [4.00e3, 4.00e4],
  "Insignificant": [0, 4.00e3]
};

const intervalsFoF = {
  "Almost Impossible": [0, 1.00e-5],
  "Rare": [1.00e-5, 1.00e-4],
  "Possible": [1.00e-4, 1.00e-3],
  "Likely": [1.00e-3, 1.00e-2],
  "Very Likely": [1.00e-2, 1.00e-1],
  "Highly Likely": [1.00e-1, 1.00],
  "Almost Certain": [1.00, Infinity]
};

// Función para determinar el índice en la matriz de acuerdo al valor de FoF o CoF
function getCategoryIndex(value, intervals) {
  const keys = Object.keys(intervals);
  for (let i = 0; i < keys.length; i++) {
    const [min, max] = intervals[keys[i]];
    if (value >= min && value < max) {
      return i; // Devuelve el índice correspondiente a la categoría
    }
  }
  return -1; // Si no encaja en ninguna categoría
}

function processFile(buffer) {
  const workbook = XLSX.read(buffer); // Leer el archivo desde el buffer

  // Obtenemos la hoja llamada 'FoF'
  const worksheetFoF = workbook.Sheets['FoF'];
  const jsonDataFoF = XLSX.utils.sheet_to_json(worksheetFoF);

  // Procesar la hoja FoF
  const fofProcesado = {};

  jsonDataFoF.forEach(row => {
    const key = `${row.Begin}-${row.End}`; // Crear clave única

    if (!fofProcesado[key]) {
      fofProcesado[key] = {
        TransmissionLineID: row.TransmissionLineID,
        Name: row.Name,
        Company: row.Company,
        System: row.System,
        Pipeline: row.Pipeline,
        Section: row.Section,
        StationID: row.StationID,
        Begin_m: row.Begin_m,
        End_m: row.End_m,
        Begin: row.Begin,
        End: row.End,
        Value: 0 // Inicializar valor total
      };
    }

    // Sumar el valor de 'Value'
    fofProcesado[key].Value += row.Value;
  });

  // Convertir objeto resultante en array
  const fofProcesadoArray = Object.values(fofProcesado);

  // Procesar la hoja CoF
  const worksheetCoF = workbook.Sheets['CoF'];
  const jsonDataCoF = XLSX.utils.sheet_to_json(worksheetCoF);

  const cofProcesado = {};

  jsonDataCoF.forEach(row => {
    const key = `${row.Begin}-${row.End}`; // Crear clave única

    if (!cofProcesado[key]) {
      cofProcesado[key] = {
        TransmissionLineID: row.TransmissionLineID,
        Name: row.Name,
        Company: row.Company,
        System: row.System,
        Pipeline: row.Pipeline,
        Section: row.Section,
        StationID: row.StationID,
        Begin_m: row.Begin_m,
        End_m: row.End_m,
        Begin: row.Begin,
        End: row.End,
        Value: 0 // Inicializar valor total
      };
    }

    // Sumar el valor de 'Value'
    cofProcesado[key].Value += row.Value;
  });

  // Convertir objeto resultante en array
  const cofProcesadoArray = Object.values(cofProcesado);

  // Inicializar la matriz de 7x7
  const matrix = Array(7).fill(null).map(() => Array(7).fill(null).map(() => ({
    count: 0, // Para contar el número de coincidencias
    ducts: [] // Para almacenar los tramos que coinciden en cada celda
  })));

  // Recorrer fofProcesado y cofProcesado para cruzar datos y llenar la matriz
  fofProcesadoArray.forEach(fof => {
    cofProcesadoArray.forEach(cof => {
      if (fof.Begin === cof.Begin && fof.End === cof.End) {
        // Obtener el índice de la categoría para FoF y CoF
        const fofIndex = getCategoryIndex(fof.Value, intervalsFoF);
        const cofIndex = getCategoryIndex(cof.Value, intervalsCof);

        // Solo llenar la matriz si ambos índices son válidos
        if (fofIndex !== -1 && cofIndex !== -1) {
          matrix[fofIndex][cofIndex].count++;
          matrix[fofIndex][cofIndex].ducts.push({ fof, cof });
        }
      }
    });
  });

  // Construir el JSON de salida basado en la matriz
  const jsonOutput = [];
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      jsonOutput.push({
        fofCategory: Object.keys(intervalsFoF)[i],
        cofCategory: Object.keys(intervalsCof)[j],
        count: matrix[i][j].count,
        ducts: matrix[i][j].ducts
      });
    }
  }

  return {
    fofProcesado: fofProcesadoArray,
    cofProcesado: cofProcesadoArray,
    matrix,
    jsonOutput
  };
}

module.exports = {
  processFile
};
