var globalPath = "";
$(document).ready(function(){
    

    $('.save-changes-upload').click(function(){
        globalPath ="train.csv";
        $.ajax({
            // url: '/load_data/'+globalPath,
            url: 'get_piechart_barchart',
            type: 'GET',
            success: function(response) {
                if(response){
                    $('#upload-modal').modal('toggle');
                    $('.first-visualization').append(response);
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    })
})