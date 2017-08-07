$( function() {
  var dialog;

  dialog = $( "#dialog-result" ).dialog({
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

  $( "#result" ).button().on( "click", function() {
    dialog.dialog( "open" );
  });
} );
