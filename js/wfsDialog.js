$( function() {

  $( "#prepare-query" ).button().on( "click", function() {

  });
  $( "#show-query" ).button().on( "click", function() {

  });
  $( "#send-wfs" ).button().on( "click", function() {
    $.post("/wfs", {filter : filter("geom", "Intersects", "Polyline", cartoPoints, height)}, function(data){
        lastResult = data;

        $xml = $( $.parseXML( data ) );
        highlightedEntities = [];
        $ids = $xml.find("stem\\:part_id").each(function() {
          var $id = $(this);
          var entity = entityMap[getIdentifier($id.text())];
          highlightedEntities = highlightedEntities.concat(entity);
        });
    });
  });
  $( "#show-wfs" ).button().on( "click", function() {
    dialog.dialog( "open" );
  });

  var dialog = $( "#dialog-result" ).dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
      Close: function() {
        dialog.dialog( "close" );
      }
    },
    close: function() {
      dialog.dialog( "close" );
    }
  });
  $( "#result-wfs" ).button().on( "click", function() {
    dialog.dialog( "open" );
  });
} );
