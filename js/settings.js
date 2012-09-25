$("#alv").live('pageinit',function(){
    loadSettings();
    loadTransaction();
});
 
function saveSettings(){       
    localStorage.setItem("sap_connectUrl", $("#connectUrl").val());
    localStorage.setItem("sap_username", $("#username").val());
    sessionStorage.setItem("sap_password", $("#password").val());                  
    $('#settings').dialog('close');
}

function exitSettings(){    
    loadSettings();                  
    $('#settings').dialog('close');
}

function loadSettings(){
    $("#connectUrl").val(localStorage.getItem("sap_connectUrl"));
    $("#username").val(localStorage.getItem("sap_username"));
    $("#password").val(sessionStorage.getItem("sap_password"));    
    $("#transaction").val(localStorage.getItem("sap_transaction"));
}

function checkSettings(){
    if ($("#connectUrl").val() === '' || $("#username").val() === '' || $("#password").val() === ''){
        $.mobile.changePage('#settings');
        return false;
    }else{
        return true;
    }
}

function saveTransaction(){
    localStorage.setItem("sap_transaction", $("#transaction").val());
    localStorage.setItem("sap_variant", $("#variant").val());
}

function loadTransaction(){
    $("#transaction").val(localStorage.getItem("sap_transaction"));                   
    $("#variant").val(localStorage.getItem("sap_variant"));                   
}