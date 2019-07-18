var globalPath = "";
$(document).ready(function(){
    // $('.dataset-success').hide();

    $('.save-changes-upload').click(function(){
        $('#upload-modal').modal('toggle');
        initializeGraph();
              
    });

    function initializeGraph(){
        path = 'static/data/Final_Dataset.csv'
        d3.csv(path, function(error, data) {
            console.log(data);
            if(error) throw(error);
            $('#select-feature').modal('toggle');
            $('.modal-body-feature').html("");
            // d3.keys(data[0])
            var finalValueToBeAppended = "<form id=\"form1\">";
            var itemCount = 0;
            for (var items in data[0]){
                console.log(items);
                if(itemCount<20){
                    finalValueToBeAppended += "<div><input type=\"radio\" id=\""+items+"\" name=\"dataSet\" value=\""+items+"\"><label for=\""+items+"\">"+items+"</label></div>";
                }else{
                    continue;
                }
                itemCount +=1;
                
            }
            finalValueToBeAppended += "</form>";
            $('.modal-body-feature').append(finalValueToBeAppended);
            dataFromDataSet = data;
        }); 
    }


    $('.save-changes-feature').click(function(){
        $('.loader').show();
        var delay = 2000;
        globalPath ="train.csv";
        $.ajax({
            // url: '/load_data/'+globalPath,
            url: 'get_piechart_barchart',
            type: 'GET',
            success: function(response) {                
                if(response){   
                    setTimeout(function() {
                        delaySuccess(response);
                      }, delay);         
                    $('.dataset-success').css("display", "block");
                    $('#select-feature').modal('toggle');
                    
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    function delaySuccess(response) {
        $('.loader').hide();
        $('.first-visualization').append(response);
      }
})