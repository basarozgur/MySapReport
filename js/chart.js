$('#pageChart').live('pageshow', function () {
    switch ($('#select-choice-ctype').val()){
        case 'pie':
            basicPieChart();
            break;
        default:
            basicChart();           
            break;
    }    
});

$('#chartRules').live('pagecreate', function () {    
    fillChartingRules();
});

$('#chartRules').live('pagebeforeshow', function () {    
    fillChartingRules();
});

$('#select-choice-b').live('change', function () {    
    fillSeriesFilterData();  
});

function initializeChartRules(){    
    $('#select-choice-x').empty();
    $('#select-choice-y').empty();
    $('#select-choice-b').empty();
    $('#select-choice-f').empty(); 
}

function fillChartingRules(){ 
    var outputx = [];
    var outputy = [];
    var outputb = [];
    
    if (!$('#select-choice-x').is(':empty')){
        return;
    }
        
    outputx.push('<option>X-Axis</option>');        
    outputy.push('<option>Y-Axis</option>');        
    outputb.push('<option>Base</option>');        
        
    for(i=0;i<alvMetadata.length;i++){
        outputx.push('<option value="' + alvMetadata[i].fieldname.toLowerCase() + '">' + alvMetadata[i].seltext + '</option>');
        outputy.push('<option value="' + alvMetadata[i].fieldname.toLowerCase() + '">' + alvMetadata[i].seltext + '</option>');
        outputb.push('<option value="' + alvMetadata[i].fieldname.toLowerCase() + '">' + alvMetadata[i].seltext + '</option>');            
    }       
    
    $('#select-choice-x').empty();
    $('#select-choice-y').empty();
    $('#select-choice-b').empty();     
    $('#select-choice-f').empty();
    
    $('#select-choice-x').append(outputx.join(''));
    $('#select-choice-y').append(outputy.join(''));
    $('#select-choice-b').append(outputb.join(''));
    
    try{
        $('#select-choice-x').selectmenu("refresh");
        $('#select-choice-y').selectmenu("refresh");
        $('#select-choice-b').selectmenu("refresh");
        $('#select-choice-f').selectmenu("refresh");
    }catch(err){ }
    
}

function fillSeriesFilterData(){
    var outputf = [];
    var optionf;                  
    
    outputf.push('<option>Base Filter</option>');         
            
    for(i=0;i<alvData.length;i++){
        optionf = '<option value="' + alvData[i][$("#select-choice-b").val()] + '">' + alvData[i][$("#select-choice-b").val()] + '</option>';
        if (jQuery.inArray(optionf, outputf) === -1) 
            outputf.push(optionf);                
    }
        
    outputf.sort(function(a,b) {
        return (a > b) ? 1 : ((b > a) ? -1 : 0);
    } );         
        
    $('#select-choice-f').empty();
    $('#select-choice-f').append(outputf.join(''));    
    $('#select-choice-f').selectmenu('refresh', true);
}

function basicChart(){
               
    var options = {
        chart: {
            renderTo: 'chartContainer',
            defaultSeriesType: $("#select-choice-ctype").val()//pie, column, bar, line            
        },
        title: {
            text: reportDescription            
        },
        subtitle: {
            text: $('#select-choice-x option:selected').text() + ' / ' + $('#select-choice-y option:selected').text()            
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -10,
            y: 100,
            borderWidth: 0
        },
        xAxis: {
            categories: [],
            labels: {
                rotation: -45,
                align: 'right',
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            },
            title: {
                text: $('#select-choice-x option:selected').text()
            }
        },
        yAxis: {
            title: {
                text: $('#select-choice-y option:selected').text()
            }
        },
        series: []
    };
    
    setXaxisCategories(options);
    setSeries(options);
    
    // Create chart
    var chart = new Highcharts.Chart(options);                     
}


function setXaxisCategories(pOptions){
    
    alvData.sort(function(a,b) {
        return (a[$("#select-choice-x").val()] > b[$("#select-choice-x").val()]) ? 1 : ((b[$("#select-choice-x").val()] > a[$("#select-choice-x").val()]) ? -1 : 0);
    } ); 
    
    for(i=0;i<alvData.length;i++){ 
        if (jQuery.inArray(alvData[i][$("#select-choice-x").val()], pOptions.xAxis.categories) === -1) 
            pOptions.xAxis.categories.push(alvData[i][$("#select-choice-x").val()]);         
    }
    
}

function setSeries(pOptions){
    
    var seriesData = [];
    var seriesFilter = $("#select-choice-f").val() || [];
    var hasFilter = false;
    
    var _series = {
        name:"",
        data:[]
    };
     
    //initialize data array for each category
    var _initData = [];
    for(i=0;i<pOptions.xAxis.categories.length;i++){
        _initData.push(0);
    }         
     
    if (seriesFilter.length < 1){
        _series.name = "";
        _series.data = _initData.slice();
        seriesData.push(_series);
    }else{
        hasFilter = true;
        for(i=0;i<seriesFilter.length;i++){         
            var _seriesF = {
                name:"",
                data:[]
            };
            _seriesF.name = seriesFilter[i];
            _seriesF.data = _initData.slice();
            seriesData.push(_seriesF);
        } 
    }
       
    var xValue;
    var yValue;
    var _index; 
    var _seriesindex;
    var _filter;
       
    for(i=0;i<alvData.length;i++){
        
        xValue = alvData[i][$("#select-choice-x").val()];
        yValue = alvData[i][$("#select-choice-y").val()];
        _index = jQuery.inArray(xValue, pOptions.xAxis.categories);
        
        _seriesindex = 0;
        if (hasFilter) {
            _filter = alvData[i][$("#select-choice-b").val()];
            if (jQuery.inArray(_filter, seriesFilter) !== -1){ 
                for(j=0;j<seriesData.length;j++){
                    if (_filter === seriesData[j].name){
                        _seriesindex = j;
                        break;
                    }                                                
                }       
            }else{
                continue;
            }
        }
        
        if (isNaN(seriesData[_seriesindex].data[_index]))  
            seriesData[_seriesindex].data[_index] = parseFloat(yValue);   
        else
            seriesData[_seriesindex].data[_index] = seriesData[_seriesindex].data[_index] + parseFloat(yValue); 
        
        //set 2 decimal point 
        seriesData[_seriesindex].data[_index] = parseFloat(seriesData[_seriesindex].data[_index].toFixed(2));
    }
            
    pOptions.series = seriesData;
    
}

function createChartData(){
    var xaxis = [];          
    
    var dataRow = {
        seriesName:"",
        xAxisValue:"",
        value:""
    };
    
    $.each(alvData, function(itemNo, row) {
        if (jQuery.inArray(row[$("#select-choice-x").val()], xaxis) === -1) 
            xaxis.categories.push(row[$("#select-choice-x").val()]);
    
        dataRow.seriesName = row[$("#select-choice-x").val()];
        dataRow.value = row[$("#select-choice-y").val()];
    });
}

function basicPieChart(){
    
    var options = {
        chart: {
            renderTo: 'chartContainer',
            defaultSeriesType: $("#select-choice-ctype").val() 
        },
        title: {
            text: reportDescription        
        },
        subtitle: {
            text: $('#select-choice-x option:selected').text() + ' / ' + $('#select-choice-y option:selected').text()            
        },
        tooltip: {
            formatter: function() {
                return '<b>'+ this.point.name +'</b>: '+ this.point.y;
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#01FF9A',                    
                    formatter: function() {
                        return '<b>'+ this.point.name +'</b>: '+ this.percentage.toFixed(2) +' %';
                    }
                },
                showInLegend: true
            }
        },
        series: [{
            data:[]
        }]
    };
    
    var xValue;
    var yValue;
    var _index;     
    var pieData = {
        name:"",
        y:0        
    };
    
    for(i=0;i<alvData.length;i++){
        
        xValue = alvData[i][$("#select-choice-x").val()];
        yValue = alvData[i][$("#select-choice-y").val()];        
        
        _index = -1.        
        for(j=0;j<options.series[0].data.length;j++){
            if(options.series[0].data[j].name === xValue){
                _index = j;
                break;
            }
        }
        
        if (_index === -1){ 
            pieData.name = xValue;
            pieData.y = parseFloat(yValue);
            pieData.y = parseFloat(pieData.y.toFixed(2));
            options.series[0].data.push(jQuery.extend({}, pieData));
        }else{
            options.series[0].data[_index].y = options.series[0].data[_index].y + parseFloat(yValue);
            options.series[0].data[_index].y = parseFloat(options.series[0].data[_index].y.toFixed(2));
        }                    
               
    }           
    
    // Create the chart
    var chart = new Highcharts.Chart(options);                
}
