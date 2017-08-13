function computeCircle(radius) {
  var positions = [];
  for (var i = 90; i < 91; i++) {
    var radians = Cesium.Math.toRadians(i);
    positions.push(new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
  }
  return positions;
}

function geometryToGML(primitive) {
  var polyline = new Cesium.PolylineGeometry({
    positions : Cesium.Cartesian3.fromDegreesArray([-75, 35,
                                                    -125, 35]),
  width : 10.0
  });
  var geom = Cesium.PolylineGeometry.createGeometry(polyline);

  var volumeOutline = new Cesium.PolylineVolumeOutlineGeometry({
    polylinePositions : geom
  });

  var instance = new Cesium.GeometryInstance({
    geometry : volumeOutline
  })

  var prim = viewer.scene.primitives.add(new Cesium.Primitive({
    geometryInstances : instance,
    appearance : new Cesium.PolylineMaterialAppearance({
      material : Cesium.Material.fromType('Color')
    })
  }));

  viewer.zoomTo(prim);
}

function pointsToPolyline(points) {
  var gml = "<gml:LineString> \
    <gml:posList>";

    /*
    var carto = Cesium.Ellipsoid.WGS84.cartesianArrayToCartographicArray(points);
    for(i in carto) {
      gml += Cesium.Math.toDegrees(carto[i].longitude) + " " + Cesium.Math.toDegrees(carto[i].latitude) + " " + Cesium.Math.toDegrees(carto[i].height) + " ";
    }
    */
    for(i in points) {
      gml += Cesium.Math.toDegrees(points[i].longitude) + " " + Cesium.Math.toDegrees(points[i].latitude) + " " + Cesium.Math.toDegrees(points[i].height) + " ";
    }

  gml += "</gml:posList></gml:LineString>";
  return gml;
}

function pointsToPolygon(points, height) {

}

function pointsToSolid(points, height) {

}

function filter(propertyName, filterType, geomType, points, height) {
  var filterTemplate = "<ogc:Filter> \
    <ogc:" + filterType + "> ";

    if(propertyName instanceof Array) {
      for(i in propertyName) {
        filterTemplate += "<ogc:PropertyName>" + propertyName[i] + "</ogc:PropertyName> ";
      }
    } else {
      filterTemplate += "<ogc:PropertyName>" + propertyName + "</ogc:PropertyName> ";
    }

    var queryGeom;
    if(geomType == "Polyline") {
      queryGeom = pointsToPolyline(points);
    } else if(geomType == "Polygon") {
      queryGeom = pointsToPolygon(points);
    } else if(geomType == "Solid") {
      queryGeom = pointsToSolid(points);
    }
    filterTemplate += queryGeom;

    filterTemplate += "</ogc:" + filterType + "> \
    </ogc:Filter>";
    return filterTemplate;
}
