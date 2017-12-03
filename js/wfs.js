exports.getFeatures = function(req, res) {
  function template(options) {
      var request =
      "<?xml version=\"1.0\" ?> \
      <wfs:GetFeature \
      service=\"" + options.service + "\" \
      version=\"" + options.version + "\" \
      outputFormat=\"" + options.outputFormat + "\" \
      xmlns:" + options.ns + "=\"" + options.url + "\" \
      xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" \
      xmlns:wfs=\"http://www.opengis.net/wfs\" \
      xmlns:ogc=\"http://www.opengis.net/ogc\" \
      xmlns:gml=\"http://www.opengis.net/gml\" \
      xsi:schemaLocation=\"http://www.opengis.net/wfs ../wfs/1.1.0/WFS.xsd\"> \
      <wfs:Query typeName=\"" + options.ns + ":" + options.typeName + "\">";

      if(options.properties != null && options.properties != "") {
        if(options.properties instanceof Array) {
          for(i in options.properties) {
            request += "<wfs:PropertyName>" + options.ns + ":" + options.properties[i] + "</wfs:PropertyName> ";
          }
        } else {
          request += "<wfs:PropertyName>" + options.ns + ":" + options.properties + "</wfs:PropertyName> ";
        }
      }

      request += options.filter +
      "</wfs:Query>\
      </wfs:GetFeature>";

      return request;
  }

  var fText = "";
  if(req.body.filter !== undefined) {
    fText = req.body.filter;
  }

  var tText = req.body.typeName;

  var prop = req.body.properteis;


  var request = template(
      {
        service : "WFS-3D",
        version : "1.1.0",
        outputFormat : "text/xml; subtype=gml3d/3.1.1",
        ns : "topp",
        url : "http://www.openplans.org/topp",
        typeName : tText,
        properties : prop,
        filter : fText
      });
  console.log(request);
  //text/xml; subtype=gml3d/3.1.1
  var rest = require('restler');
  rest.post('http://164.125.37.201:9999/geoserver/wfs', {
    data : request
  }).on('complete', function(data) {
    res.send(data);
  });
}
