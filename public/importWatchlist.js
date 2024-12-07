document.getElementById('uploadCsvButton').addEventListener('click', uploadCSV);

function uploadCSV() {
  const fileInput = document.getElementById('csvFileInput');
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a CSV file first.");
    return;
  }

  const reader = new FileReader();

  reader.onload = function(event) {
    const csvData = event.target.result;
    // Store CSV data in localStorage
    
    alert("CSV data has been stored in localStorage!");
  };

  reader.onerror = function() {
    alert("There was an error reading the file.");
  };

  reader.readAsText(file);
}
