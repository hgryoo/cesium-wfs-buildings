var highlightedEntities = [];
var highlightColor = Cesium.Color.YELLOW;
var normalColor = Cesium.Color.ALICEBLUE;
var geojsonPromise;

var entityMap = {};

//A property that returns a highlight color if the entity is currently moused over, or a default color otherwise.
function materialCallback(entity){
    var colorProperty = new Cesium.CallbackProperty(function(time, result){
        if(highlightedEntities.includes(entity)){
            return Cesium.Color.clone(highlightColor, result);
        }
        return Cesium.Color.clone(normalColor, result);
    }, false);
    return new Cesium.ColorMaterialProperty(colorProperty);
}

function getIdentifier(id) {
  var idStr;
  /*
  if(typeof id === string) {
    var idStr = id.split('_');
  } else {
    var idStr = id._value.split('_');
  }
  */
  //return idStr[1];
  return id;
}

function drawExtrudedBuildings() {
    if(!geojsonPromise) {
      geojsonPromise = Cesium.GeoJsonDataSource.load('./bbs.geojson');
       geojsonPromise.then(function(dataSource) {
         viewer.dataSources.add(dataSource);
         var entities = dataSource.entities.values;
         for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            //Extrude the polygon based on any attribute you desire
            //entity.outline = true;
            //entity.outlineColor = Cesium.Color.BLACK;
            entity.polygon.material = materialCallback(entity);
            entity.polygon.outline = false;
            //entity.polygon.outlineColor = Cesium.Color.LIGHTGREY;
            entity.polygon.extrudedHeight = entity.properties.BUILDING_H;

            var id = getIdentifier(entity.properties.BUILDING_I);
            if(entityMap[id] === undefined) {
              entityMap[id] = [];
            }
            entityMap[id].push(entity);
        }
      });
      viewer.zoomTo(geojsonPromise);
    }
    return geojsonPromise;
}

var selectCallback = function(click) {
    var pickedObject = scene.pick(click.position);
    if (Cesium.defined(pickedObject) && pickedObject.id instanceof Cesium.Entity) {
        var entity = pickedObject.id;
        var id = getIdentifier(entity.properties.BUILDING_I);
        var sameEntities = entityMap[id];
        highlightedEntities = highlightedEntities.concat(sameEntities);
    } else{
        highlightedEntities = [];
    }
  };
