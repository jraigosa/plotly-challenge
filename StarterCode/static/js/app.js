function loadSampleData(sample){
    var panel = d3.select('#sample-metadata')
    panel.html('')
    panel.append('p').text('ID: ' + sample.id)
    panel.append('p').text('Ethnicity: ' + sample.ethnicity)
    panel.append('p').text('Gender: ' + sample.gender)
    panel.append('p').text('Age: ' + sample.age)
    panel.append('p').text('Location: ' + sample.location)
    panel.append('p').text('Belly button type: ' + sample.bbtype)
    panel.append('p').text('Wash Frequency: ' + sample.wfreq)
}

function graphData(sample){

    yValues = sample['otu_ids'].slice(0,10).map(value => 'OTU ' + value + '  ') 
    xValues = sample['sample_values'].slice(0, 10)
    textValues = sample['otu_labels'].slice(0, 10)

    var trace1 = [{
            type: 'bar',
            x: xValues,
            y: yValues,
            text: textValues,
            orientation: 'h'
        }]
    
    var layout = {
        width: 700,
        height: 400,
        yaxis:{
            categoryorder: 'max ascending'
        }
    }

    Plotly.newPlot('bar', trace1, layout)

    // bubble plot
    var trace2 = [{
        x: sample['otu_ids'],
        y: sample['sample_values'],
        text:  sample['otu_labels'],
        mode: 'markers',
        marker: {
          size: sample['sample_values'],
          color: sample['otu_ids'],
          colorscale: 'agsunset',
        }
      }]
      
      Plotly.newPlot('bubble', trace2 )

}

function optionChanged(id){
    d3.json("samples.json").then(function(data){
        var subject = data.samples.filter(item => item.id ==  id)
        var metaData = data.metadata.filter(item => item.id == id)
        loadSampleData(metaData[0])
        graphData(subject[0])
    })
}

(async function(){
    var data = await d3.json("samples.json")  
    //console.log(data)
    var names = data.names

    var select = d3.select('#selDataset')    
    select.selectAll('option')
    .data(names)
    .enter().append('option')
    .attr('value', d => { return d; })
    .text(d => { return d; });

    optionChanged(select.node().value)
    

})()