// queue()
// 	// .defer(d3.json, piechartDataUrl)
//     // .defer(d3.json, barchartDataUrl)
//     .defer(d3.json, scatterPlotDataUrl)
//     .await(ready);

queue()
    .defer(d3.json, scatterPlotDataUrl)
    .await(ready);

function ready(error, dataset, datasetBarChart) {
    console.log("inside ready");
    console.log(dataset);
    console.log(datasetBarChart);
    d3ScatterPlot(dataset,datasetBarChart);
    // d3PieChart(dataset, datasetBarChart);
    // d3BarChart(datasetBarChart);
}

// $(document).ready(function(){   
//     $.ajax({
//         // url: '/load_data/'+globalPath,
//         url: '/get_scatter_plot_data',
//         type: 'GET',
//         success: function(response) {
//             if(response){
//                 d3ScatterPlot(response);
//             }
//         },
//         error: function(error) {
//             console.log(error);
//         }
//     });
// })