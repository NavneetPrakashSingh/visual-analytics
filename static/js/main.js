// queue()
// 	// .defer(d3.json, piechartDataUrl)
//     // .defer(d3.json, barchartDataUrl)
//     .defer(d3.json, scatterPlotDataUrl)
//     .await(ready);
console.log(barchartDataUrl);
queue()
    .defer(d3.json, scatterPlotDataUrl)
    .defer(d3.json, barchartDataUrl)
    .defer(d3.json, decisionTreeDataUrl)
    .await(ready);

function ready(error, dataset, datasetBarChart, decisionTreeData) {

    console.log("inside ready");
    console.log(dataset);
    console.log(decisionTreeData);

    //d3ScatterPlot(dataset, datasetBarChart);
    // d3PieChart(dataset, datasetBarChart);
    d3BarChart(datasetBarChart);
    d3DecisionTree(decisionTreeData)
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