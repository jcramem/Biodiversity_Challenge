function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
    });
}

function optionChanged(newSample) {
  console.log(newSample);
  buildMetadata(newSample);
  buildCharts(newSample);  
}

// Initialize the dashboard
init();

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number    
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Bar and Bubble charts
// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    // Create a variable that filters the samples for the object with the desired sample number.
    var resultA = samples.filter(sampleObj => sampleObj.id == sample);     
    // Create a variable that holds the first sample in the array.
    var results = resultA[0];
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = results.otu_ids ;
    var otu_labels = results.otu_labels ;  
    var sample_values = results.sample_values ;    
    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    // so the otu_ids with the most bacteria are last. 
    // var sortedIds = otu_ids.sort((a,b) => a.sample_values - b.sample_values).reverse(); 
    // console.log(sortedIds);      
    var yticks = otu_ids.slice(0,10).map(_otu_ids => `_otu_ids ${_otu_ids}`).reverse() ;       
    // var tlabels = otu_labels.slice(0,10).map(_otu_labels => _otu_labels).reverse() ;   
    // var xticks = sample_values.slice(0,10).map(_sample_values => _sample_values).reverse(); 
    // // Create the trace for the bar chart. 
    var barData = [
      {
        x: sample_values.slice(0,10).reverse(),
        y: yticks,
        text: otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"      
      }
    ];
    // // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found", 
    };
    // // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar-plot", barData, barLayout);
    // // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        type: "markers",
        x: otu_ids,
        y: sample_values,
        text: otu_labels,        
        mode: 'markers',
        marker: {
          color: otu_ids,
          colorscale: 'earth',
          size: sample_values
        }
      }
    ];

    // // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: {title: "OTU ID"}
    };

    // // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // // 4. Create the trace for the gauge chart.
    var mdata = data.metadata;
    var resultArr = mdata.filter(sampleObj => sampleObj.id == sample);
    var rsult = resultArr[0];    
    var wFreq = rsult.wfreq ;
    var wF = parseFloat(wFreq);
    console.log(wF);
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wF,
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] },
          bar: { color: "darkblue" },
          steps: [
            { range: [0, 2], color: "cyan" },
            { range: [2, 4], color: "red" },
            { range: [4, 6], color: "yellow" },            
            { range: [6, 8], color: "limegreen" },            
            { range: [8, 10], color: "green" }
          ],
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: "Belly Button Washing Frequency",     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}

 
