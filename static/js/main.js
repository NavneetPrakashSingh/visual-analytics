
queue()
    .defer(d3.json, scatterPlotDataUrl)
    .defer(d3.json, barchartDataUrl)
    .defer(d3.json, decisionTreeDataUrl)
    .await(ready);

function ready(error, dataset, datasetBarChart, decisionTreeData) {

    // console.log("inside ready");
    // console.log(dataset);
    // console.log(decisionTreeData);

    //d3ScatterPlot(dataset, datasetBarChart);
    // d3PieChart(dataset, datasetBarChart);
    d3BarChart(datasetBarChart);
    d3DecisionTree(decisionTreeData)
}

queue()
    .defer(d3.json, scatterPlotDataUrl)
    .await(scatterPlotContent);

function scatterPlotContent(error, dataset, datasetBarChart) {
    d3ScatterPlot(dataset,datasetBarChart);
    d3ScatterPlotWithBoundaries(dataset,datasetBarChart);
}


queue()
    .defer(d3.json, histogramPlotDataUrl)
    .await(histogramReady);

function histogramReady(error,dataset,datasetBarChart){
    d3HistogramData(dataset,datasetBarChart);
}

queue()
    .defer(d3.json, histogramPlotDataUrl)
    .await(treeReady);

function treeReady(error,dataset,datasetBarChart){
    d3Tree(dataset,datasetBarChart);
}

queue()
    .defer(d3.json, pieDataUrl)
    .await(pieReady);

function pieReady(error,dataset,datasetBarChart){
    pie(dataset,datasetBarChart);
}


