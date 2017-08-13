/**
 * @author mrdoob / http://mrdoob.com/
 */

var Loader = function ( ) {
	this.texturePath = '';
	this.loadFile = function ( file ) {
		var filename = file.name;
		var extension = filename.split( '.' ).pop().toLowerCase();
		var reader = new FileReader();
		/*reader.addEventListener( 'progress', function ( event ) {

			var size = '(' + Math.floor( event.total / 1000 ).format() + ' KB)';
			var progress = Math.floor( ( event.loaded / event.total ) * 100 ) + '%';
			console.log( 'Loading', filename, size, progress );

		} );*/
		switch ( extension ) {
			case 'gml': {
				//solidtocsv = "id, geom\n";
				//movingfeaturewgs84 = "@stboundedby,urn:x-ogc:def:crs:EPSG:6.6:4326,3D,50.23 9.23 0,50.31 9.27 0,2016-10-31T13:44:34Z,2012-01-17T12:49:40Z,sec\n@columns,mfidref,trajectory,\"typecode\",xsd:integer\n";

				var inlineWorkerText =
    			"self.addEventListener('message', function(e) { postMessage(e); } ,false);";

				reader.addEventListener( 'load', function ( event ) {
					console.log("gml file load finish");
					console.log(new Date(Date.now()));
					var contents = event.target.result;
					var indoorgmlLoader = new IndoorGMLLoader();
					var data = indoorgmlLoader.unmarshal(contents);
					//console.log(data);
					//var worker = require('webworkify')(require('./loader/IndoorGMLLoader.js'));
					//worker.addEventListener('message', function (ev) {
					console.log("receive json!!");
				  console.log(new Date(Date.now()));
					indoor = new Indoor();
						//var maxmin_xyz = indoor.init(ev.data);
					var maxmin_xyz = indoor.init(data);
					draw(indoor, maxmin_xyz);

					//var blob = new Blob([solidtocsv], {type: "text/plain;charset=utf-8"});
					//	saveAs(blob, "lotte.csv");
					//});
					//worker.postMessage(contents);
				}, false );
				reader.readAsText( file );
				break;
			}
			default: {
				alert( 'Unsupported file format (' + extension +  ').' );
				break;
			}
		}
	};
};
