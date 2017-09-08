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

function pointsToPolyline(carto) {
  var gml = "<gml:LineString>";
    for(i in carto) {
      gml += "<gml:pos>" + Cesium.Math.toDegrees(carto[i].longitude) + " " + Cesium.Math.toDegrees(carto[i].latitude) + " " + carto[i].height + "</gml:pos>";
    }
  gml += "</gml:LineString>";
  return gml;
}

function pointsToPolygon(carto) {
  var gml = "<gml:Polygon><gml:exterior><gml:LinearRing>";
  for(i in carto) {
    gml += "<gml:pos>" + Cesium.Math.toDegrees(carto[i].longitude) + " " + Cesium.Math.toDegrees(carto[i].latitude) + " " + carto[i].height + "</gml:pos>";
  }
  gml += "<gml:pos>" + Cesium.Math.toDegrees(carto[0].longitude) + " " + Cesium.Math.toDegrees(carto[0].latitude) + " " + carto[0].height + "</gml:pos>";
  gml += "</gml:LinearRing></gml:exterior></gml:Polygon>";
  return gml;
}

function pointsToSolid(carto, height) {
  var gml = "<gml:Solid srsName=\"EPSG:4329\" srsDimension=\"3\"><gml:exterior><gml:CompositeSurface>";

  var lower = carto;
  var upper = [];
  for(i in lower) {
    lower[i].height = 0;
    upper.push(new Cesium.Cartographic(lower[i].longitude, lower[i].latitude, height));
  }

  var rev = lower.slice(0).reverse();
  gml += "<gml:surfaceMember>";
  gml += pointsToPolygon(rev);
  gml += "</gml:surfaceMember>";
  gml += "<gml:surfaceMember>";
  gml += pointsToPolygon(upper);
  gml += "</gml:surfaceMember>";

  for(var i = 0; i < lower.length; i++) {
    gml += "<gml:surfaceMember>";
    var points = [lower[i], lower[(i + 1) % lower.length], upper[i]];
    gml += pointsToPolygon(points);
    gml += "</gml:surfaceMember>";

    gml += "<gml:surfaceMember>";
    var points = [upper[i], lower[(i + 1) % lower.length], upper[(i + 1) % lower.length]];
    gml += pointsToPolygon(points);
    gml += "</gml:surfaceMember>";
  }
  gml += "</gml:CompositeSurface></gml:exterior></gml:Solid>";
  return gml;
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
    var carto = Cesium.Ellipsoid.WGS84.cartesianArrayToCartographicArray(points);
    if(geomType == "Polyline") {
      queryGeom = pointsToPolyline(carto);
    } else if(geomType == "Polygon") {
      queryGeom = pointsToPolygon(carto);
    } else if(geomType == "Solid") {
      queryGeom = pointsToSolid(carto, height);
    }
    filterTemplate += queryGeom;

    filterTemplate += "</ogc:" + filterType + "> \
    </ogc:Filter>";
    return filterTemplate;
}
