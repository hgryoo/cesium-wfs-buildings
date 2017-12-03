$( function() {

  var dialogRequest = $( "#dialog-form" ).dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
      Close: function() {
        dialogRequest.dialog( "close" );
      }
    },
    close: function() {
      dialogRequest.dialog( "close" );
    }
  });

  var dialogResult = $( "#dialog-result" ).dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
      Close: function() {
        dialogResult.dialog( "close" );
      }
    },
    close: function() {
      dialogResult.dialog( "close" );
    }
  });
  /*
  $( "#request-wfs-building" ).button().on("click", function() {
    dialogRequest.dialog( "open" );
  });
  $( "#response-wfs-building" ).button().on("click", function() {
    $( ".wfs-result" ).remove();
    $( "#dialog-result" ).append( "<p class=\"wfs-result\">" + lastResult + "</p>" );
    dialogResult.dialog( "open" );
  });
  $( "#request-wfs-indoor" ).button().on("click", function() {
    dialogRequest.dialog( "open" );
  });
  $( "#response-wfs-indoor" ).button().on("click", function() {
    $( ".wfs-result" ).remove();
    $( "#dialog-result" ).append( "<p class=\"wfs-result\">" + lastResult + "</p>" );
    dialogResult.dialog( "open" );
  });
  */
  $( "#send-wfs-building" ).button().on("click", function() {
    $.post("/wfs", {filter : filter("geom", "Intersects", queryType, points, height), typeName : "footprint", properteis : ["part_id"]}, function(data) {
        lastResult = data;
        console.log(lastResult);
        $xml = $( $.parseXML( data ) );
        highlightedEntities = [];
        $ids = $xml.find("topp\\:part_id").each(function() {
          var $id = $(this);
          var entity = entityMap[getIdentifier($id.text())];
          console.log($id.text());
          highlightedEntities = highlightedEntities.concat(entity);
        });
    });
  });

  var highlited = [];
  $( "#send-wfs-indoor" ).button().on("click", function() {
    $.post("/wfs", {filter : filter("geom", "Intersects", queryType, points, height), typeName : "lotte_indoors", properteis : ["id"]}, function(data) {
        lastResult = data;
        console.log(lastResult);
        $xml = $( $.parseXML( data ) );
        clearHighlight();
        $ids = $xml.find("topp\\:id").each(function() {
          var $id = $(this);
          highlited.push($id.text());
          var polygons = HilightCell[ $id.text() ];
          for(p in polygons) {
            var attributes = viewer.scene.primitives._primitives[1].getGeometryInstanceAttributes( polygons[p] );
            attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.YELLOW.withAlpha(1));
          }
          console.log($id.text());
        });
    });
  });

  function clearHighlight() {
    for(id in highlited) {
        var polygons = HilightCell[ id ];
        for(p in polygons) {
          var attributes = viewer.scene.primitives._primitives[1].getGeometryInstanceAttributes( polygons[p] );
          attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(Cesium.Color.ALICEBLUE.withAlpha(0.3));
        }
      }
      highlited = [];
  }
} );
