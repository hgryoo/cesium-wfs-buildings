var mouseFollower;
var mouseFollowerZ;
var mouseFollowerLineZ;
var followerLine;

var height = 0;

var followMouse = function(e) {
  viewer.scene.primitives.remove(mouseFollower);
  viewer.scene.primitives.remove(followerLine);

  var cartesian = camera.pickEllipsoid(e.endPosition);
  if(cartesian) {
    mouseFollower = new Cesium.PointPrimitiveCollection();
    mouseFollower.add({
      position : cartesian,
      color : Cesium.Color.YELLOW,
      pixelSize : 5
    });

    if(height > 0) {
      var carto  = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
      var newCartesian = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, carto.height + height);
      mouseFollower.add({
        position : newCartesian,
        color : Cesium.Color.YELLOW,
        pixelSize : 5
      });

      var instance = new Cesium.GeometryInstance({
        geometry : new Cesium.PolylineGeometry({
          positions : [cartesian, newCartesian],
          width : 3.0
        })
      })

      followerLine = viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances : instance,
        appearance : new Cesium.PolylineMaterialAppearance({
          material : Cesium.Material.fromType('Color')
        })
      }));
    }

    viewer.scene.primitives.add(mouseFollower);
  }
}

var drawState = false;
var drawType;

var points = [];
var cartoPoints = [];

var pointsPrimitives;
var linePrimitives;
var polygonPrimitives;
var primitiveCollection;

var queryType;
var queryGeometry;

var drawMouse = function(click) {
  var cartesian = camera.pickEllipsoid(click.position);
  var carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
  if(cartesian) {
    if(height > 0) {
      cartesian = Cesium.Cartesian3.fromRadians(carto.longitude, carto.latitude, carto.height + height);
    }

    cartoPoints.push(new Cesium.Cartographic(carto.longitude, carto.latitude, carto.height + height));
    points.push(cartesian);
    drawGeom();
  }
}

function drawGeom() {
  var type = 0;
  if(drawType.toLowerCase() == "box") {
    type = 1;
  } else if(drawType.toLowerCase() == "polyline") {
    type = 2;
  } else if(drawType.toLowerCase() == "polygon") {
    type = 3;
  } else if(drawType.toLowerCase() == "solid") {
    type = 4;
  }

  $("#draw-done").button("disable");
  viewer.scene.primitives.remove(primitiveCollection);
  primitiveCollection = new Cesium.PrimitiveCollection();
  if(type == 1) {
    if(points.length == 3) {
      points.pop();
    }
    if(points.length == 2) {
      var minX = Math.min(points[0].x, points[1].x);
      var minY = Math.min(points[0].y, points[1].y);
      var minZ = Math.min(points[0].z, points[1].z);
      var maxX = Math.max(points[0].x, points[1].x);
      var maxY = Math.max(points[0].y, points[1].y);
      var maxZ = Math.max(points[0].z, points[1].z);

      var instance = new Cesium.GeometryInstance({
        geometry : new Cesium.BoxGeometry({
          vertexFormat : Cesium.VertexFormat.POSITION_ONLY,
          minimum : new Cesium.Cartesian3(minX, minY, minZ),
          maximum : new Cesium.Cartesian3(maxX, maxY, maxZ)
        })
      })
      primitiveCollection.add(new Cesium.Primitive({
        geometryInstances : instance,
        appearance : new Cesium.MaterialAppearance({
          material : Cesium.Material.fromType('Color')
        })
      }));
    }
  }
  if(type >= 0) {
    pointsPrimitives = new Cesium.PointPrimitiveCollection();
    for(i in points) {
      var p = points[i];
      pointsPrimitives.add({
        position : p,
        color : Cesium.Color.RED,
        pixelSize : 3
      });
    }
    primitiveCollection.add(pointsPrimitives);
  }
  var ps = [];
  if(type >= 2) {
    if(points.length > 1) {
      for(x in points){
          ps = ps.concat(points[x]);
      }

      var instance = new Cesium.GeometryInstance({
        geometry : new Cesium.PolylineGeometry({
          positions : ps,
          width : 3.0
        })
      })

      primitiveCollection.add(new Cesium.Primitive({
        geometryInstances : instance,
        appearance : new Cesium.PolylineMaterialAppearance({
          material : Cesium.Material.fromType('Color')
        })
      }));
    }
  }
  if(points.length > 2) {
    if(type >= 3) {
        ps.push(ps[0]);
        var instance = new Cesium.GeometryInstance({
          geometry : new Cesium.PolygonGeometry({
                        polygonHierarchy : new Cesium.PolygonHierarchy(
                          ps
                        ),
                        //material : Cesium.Color.BLUE.withAlpha(0.01),
                        perPositionHeight : true
                        //outline : true,
                        //outlineColor : Cesium.Color.BLACK.withAlpha(0.1),
                        //outlineWidth : 2.0
                    })
        })
        primitiveCollection.add(new Cesium.Primitive({
          geometryInstances : instance,
          appearance : new Cesium.MaterialAppearance({
            material : Cesium.Material.fromType('Color')
          })
        }));
    }
    if(type >= 4) {
      var instance = new Cesium.GeometryInstance({
        geometry : new Cesium.PolygonGeometry({
                      polygonHierarchy : new Cesium.PolygonHierarchy(
                        ps
                      ),
                      //material : Cesium.Color.BLUE.withAlpha(0.01),
                      perPositionHeight : true,
                      extrudedHeight : height
                      //outline : true,
                      //outlineColor : Cesium.Color.BLACK.withAlpha(0.1),
                      //outlineWidth : 2.0
                  })
      })
      primitiveCollection.add(new Cesium.Primitive({
        geometryInstances : instance,
        appearance : new Cesium.MaterialAppearance({
          material : Cesium.Material.fromType('Color')
        })
      }));
    }
  }
  viewer.scene.primitives.add(primitiveCollection);

  if(drawType.toLowerCase() == "box") {
    if(points.length == 2) {
      $("#draw-done").button("enable");
    }
  } else if(drawType.toLowerCase() == "polyline") {
    if(points.length >= 2) {
      $("#draw-done").button("enable");
    }
  } else if(drawType.toLowerCase() == "polygon") {
    if(points.length >= 3) {
      $("#draw-done").button("enable");
    }
  } else if(drawType.toLowerCase() == "solid") {
    if(points.length >= 3 && height > 0) {
      $("#draw-done").button("enable");
    }
  }
}

function prevDrawing() {
  if(points.length > 0) {
    points.pop();
    drawGeom();
  }
}

function resetDrawing() {
  points = [];
  cartoPOints = [];
  viewer.scene.primitives.remove(primitiveCollection);
  height = 0;
  $("#slider").slider('value', height);
  //$("#draw").button("enable");
  //$("#prev").button("disable");
  //$("#draw-done").button("disable");
}

$(function() {
    var handle = $("#custom-handle");
    $("#slider").slider({
      value:0,
      min:0,
      max:500,
      step:1,
      create: function() {
        handle.text( $(this).slider('value') );
      },
      slide: function( event, ui ) {
        height = ui.value;
        handle.text( height );
        drawGeom();
      }
    }).hide();

    $("#type").selectmenu();

    $("#draw").button().on( "click", function() {
      $("#slider").show();
      $("#type").selectmenu("disable");
      drawType = $("#type").find(':selected').text();
      $("#draw").button("disable");
      $("#prev").button("enable");
      $("#draw-cancel").button("enable");
      drawState = true;
      resetDrawing();
      handle.text(height);
      handler.setInputAction(drawMouse, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    });

    $( "#draw-done" ).button().on( "click", function() {
      $("#slider").hide();
      $("#type").selectmenu("enable");
      $("#prev").button("disable");
      $("#draw").button("enable");
      $("#draw-done").button("disable");
      $("#draw-cancel").button("disable");
      drawState = false;
      queryType = drawType;
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    });

    $( "#prev" ).button().on( "click", function() {
      prevDrawing();
    });

    $( "#draw-cancel" ).button().on( "click", function() {
      $("#slider").hide();
      $("#type").selectmenu("enable");
      $("#prev").button("disable");
      $("#draw").button("enable");
      $("#draw-done").button("disable");
      $("#draw-cancel").button("disable");
      drawState = false;
      resetDrawing();
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    });

    $( "#draw-done" ).button("disable");
    $( "#draw-cancel" ).button("disable");
});
