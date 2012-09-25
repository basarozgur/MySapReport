var alvMetadata;
var alvData;
var reportDescription;

function getALV(){
    saveTransaction();
    initializeChartRules();
    
    if (!checkSettings()){
        return;
    }   
    
    alvData = [];
    alvMetadata = [];
    
    //remove prefix http://, this will add in ajax call
    $("#connectUrl").val($.trim($("#connectUrl").val().replace("http://","")));
       
    $.ajax({
        type: "GET",               
        url: 'http://' + $("#username").val() + ':' + $("#password").val() + '@' + $("#connectUrl").val() + '?tcode=' + $("#transaction").val() + '&variant=' + $("#variant").val(),
        data: "",
        dataType: "jsonp",
        contentType: "application/javascript",
        username:$("#username").val(),
        password:$("#password").val(),         
        jsonpCallback:"jsonp_success",
        crossDomain: true, 
        cache: false,
        timeout: 10000,
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function(xhr, settings){                                            
            $.mobile.showPageLoadingMsg();
        },
        complete: function(xhr, textStatus) {
            $.mobile.hidePageLoadingMsg();
            if (alvMetadata){
                createDynamicTable(getColumnData(alvMetadata),alvData);
                $.mobile.changePage('#showDatatable');
                $('#datatableHeader').text(reportDescription);                
            }
        },
        success: function(sys){        
        },
        error: function( result ){
            if (result.statusText !== "success"){
                alert('Error!! Unable to call ALV Report. Please check your settings & SAP connection');
                $.mobile.changePage('#settings');
            }
        }
    }); // Ajax posting    
}

function JSONP_SUCCESS(result){    
    reportDescription = result.description;
    alvMetadata = result.alvMetadata;               
    alvData = result.alvData;
              
    //sort ALV metadata according to col_pos
    alvMetadata.sort(function(a,b) {
        return (parseInt(a.col_pos) > parseInt(b.col_pos)) ? 1 : ((parseInt(b.col_pos) > parseInt(a.col_pos)) ? -1 : 0);
    } );
}

function getDemoData() {
    $.ajax({
        //url: 'http://localhost/SubmitALV/json.php',
        url: 'http://alvdemo.appspot.com/alvdemo.php',
        type: 'POST',
        dataType: 'jsonp',
        timeout: 10000,
        cache: false,
        beforeSend: function(xhr, settings){
            $.mobile.showPageLoadingMsg();
        },
        complete: function(xhr, textStatus) {
            $.mobile.hidePageLoadingMsg();
        },
        success: function(data, textStatus, xhr) {

            var parsedData = JSON.parse(data);
            reportDescription = parsedData.description;
            alvMetadata = parsedData.alvMetadata;               
            alvData = parsedData.alvData;
              
            //sort ALV metadata according to col_pos
            alvMetadata.sort(function(a,b) {
                return (parseInt(a.col_pos) > parseInt(b.col_pos)) ? 1 : ((parseInt(b.col_pos) > parseInt(a.col_pos)) ? -1 : 0);
            } );              
            
            if (alvMetadata){
                createDynamicTable(getColumnData(alvMetadata),alvData);
                $.mobile.changePage('#showDatatable');
                $('#datatableHeader').text(reportDescription);                
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}

function createDynamicTable(aColumnData,aDataSet){       
    $('#dynamicDatatableDIV').html( '<table id="dynamicDatatable" class="tbl_basket_style"></table>' );               
    var alvTable = $('#dynamicDatatable').dataTable( {
        "sDom": 'rfCtip',       
        "bStateSave": true,//length, filtering, pagination and sorting not change when refresh(cooki)
        "sPaginationType": "full_numbers",                        
        "iDisplayLength": 65536,        
        "oColVis": {            
            "bRestore": true                        
        },          
        "bUseRendered": false,
        "aaData": aDataSet,        
        "aoColumns": aColumnData 
    } );    
}

function getColumnData(alvMetadata){
    var column = new Array();
    var type;
    var just;
    var sclass;
    var visible;       
    var visCount = 0;
    
    for(i=0;i<alvMetadata.length;i++){ 
                
        type = alvMetadata[i].inttype;
        just = alvMetadata[i].just; 
        visible = alvMetadata[i].no_out;
            
        switch (type){
            case 'D':
                type = "date";
                break; 
            case 'N':
                type = "string";
                break;        
            case 'P':
                type = "numeric";
                break;
            case 'I':
                type = "numeric";
                break;
            case 'F':
                type = "numeric";                
                break;  
            default:
                type = "string";
                break;
        }
                                                
        
        switch (just){
            case 'L':
                sclass = "left-align";
                break;
            case 'R':
                sclass = "right-align";
                break;
            case 'C':
                sclass = "center-align";
                break;
            default:
                sclass = "left-align";
                break;
        }         
                
        if (visible == 'X' || visCount > 5)
            visible = false;
        else{
            visible = true;
            visCount++;
        }
                                    
        column.push({
            "mDataProp":alvMetadata[i].fieldname.toLowerCase(),
            "sName": alvMetadata[i].fieldname,
            "sTitle": alvMetadata[i].seltext,
            "sType": type,
            "sClass": sclass,
            "bVisible": visible                
        }); 
    }
        
    return column;
}
