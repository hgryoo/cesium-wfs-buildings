var mouseFollower;
var queryGeometry;

var followMouse = function(e) {
  viewer.scene.primitives.remove(mouseFollower);
  pos = camera.pickEllipsoid(e.endPosition);

  mouseFollower = viewer.scene.primitives.add(new Cesium.PointPrimitiveCollection());
  mouseFollower.add({
    position : pos,
    color : Cesium.Color.YELLOW,
    pixelSize : 5
  });
}
