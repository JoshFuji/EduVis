

let data;
let url = "Education.csv";
let table;
let filteredRows = [];
let selectedColumn;  // Variable to hold the selected column
let columnNames = ["GeoName", "NoHigh", "YesHigh", "SomeCol", "YesBA"];

function preload() {
  data = loadTable(url, 'csv', 'header');
  table = loadTable('Education.csv', 'csv', 'header');
}

function setup() {
  createCanvas(6000, 800); // Adjust canvas size as needed
  textSize(8); // Set text size for readability

  // Create a dropdown menu for selecting a column
  let dropdown = createSelect();
  dropdown.position(10, 10);
  
  // Add the column options to the dropdown
  for (let i = 1; i < columnNames.length; i++) {
    dropdown.option(columnNames[i]);
  }
  
  // Set default selection to 'NoHigh'
  dropdown.selected('NoHigh');
  
  // Update selected column when dropdown changes
  dropdown.changed(() => {
    selectedColumn = dropdown.value();
    redraw(); // Redraw chart on column selection
  });

  // Extract rows with 2019 data
  for (let i = 0; i < table.getRowCount(); i++) {
    let row = table.getRow(i);

    // Check if any column in the row contains "2019"
    let contains2019 = false;
    for (let j = 0; j < table.getColumnCount(); j++) {
      let cellValue = row.getString(j);
      if (cellValue.includes("2019")) {
        contains2019 = true;
        break;
      }
    }

    // If the row contains "2019", extract relevant columns
    if (contains2019) {
      let geoName = row.getString("GeoName");
      let noHigh = parseFloat(row.getString("C_EA_GT25_WODIS_EDUATTAIN_LHSG"));
      let yesHigh = parseFloat(row.getString("C_EA_GT25_WODIS_EDUATTAIN_HSGIE"));
      let someCol = parseFloat(row.getString("C_EA_GT25_WODIS_EDUATTAIN_SCAG"));
      let yesBA = parseFloat(row.getString("C_EA_GT25_WODIS_EDUATTAIN_BDH"));

      // Push an array with only the relevant columns
      filteredRows.push([geoName, noHigh, yesHigh, someCol, yesBA]);
    }
  }

  // Set the initial column selection
  selectedColumn = "NoHigh";
  noLoop(); // Avoid continuous looping
}

function draw() {
  background(255, 194, 52);
  noStroke();

  // Chart settings
  let chartX = 100; // Start of chart on the x-axis
  let chartY = 700; // Bottom of chart on the y-axis
  let barWidth = 100; // Width of each bar
  let maxBarHeight = 400; // Maximum height of the bars
  let spacing = 10; // Space between bars

  // Find the index of the selected column
  let columnIndex;
  switch (selectedColumn) {
    case "NoHigh":
      columnIndex = 1;
      break;
    case "YesHigh":
      columnIndex = 2;
      break;
    case "SomeCol":
      columnIndex = 3;
      break;
    case "YesBA":
      columnIndex = 4;
      break;
    default:
      columnIndex = 1; // Default to "NoHigh"
  }

  // Determine maximum value for scaling
  let maxValue = 0;
  for (let i = 0; i < filteredRows.length; i++) {
    maxValue = max(maxValue, filteredRows[i][columnIndex]);
  }

  // Draw bars
  for (let i = 0; i < filteredRows.length; i++) {
    let stateName = filteredRows[i][0];
    let value = filteredRows[i][columnIndex];
    let barHeight = map(value, 0, maxValue, 0, maxBarHeight);

    // Calculate bar position
    let x = chartX + i * (barWidth + spacing);
    let y = chartY - barHeight;

    // Determine color based on value
    let barColor;
    if (value < maxValue / 2) {
      // Lower values will be red
      barColor = color(247, 56, 84); // pink
    } else {
      // Higher values will be green
      barColor = color(53, 173, 190); // green
    }

    // Draw the bar with the determined color
    fill(barColor);
    rect(x, y, barWidth, barHeight);

    // Draw the value above the bar
    fill(0);
    textAlign(CENTER);
    text(nf(value, 0, 2), x + barWidth / 2, y - 5);

    // Draw state name below the bar
    text(stateName, x + barWidth / 2, chartY + 15);
  }

  // Draw axes labels
  textAlign(CENTER);
  textSize(18);
  text("States", 200, 750);
  textSize(16);
  text(`Education Level: ${selectedColumn}`, 200, 50);
  text("*Percentage out of 100 of people with disibilities", 200, 70);
}
