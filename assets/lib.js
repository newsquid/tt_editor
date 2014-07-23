/**
 * Converts a file in base64 representation to the corresponding
 * file blob.
 */
var base64_to_blob = function(dataUri) {
    var dataUriParts = dataUri.split(',');
    var byteString = atob(dataUriParts[1]);
    var mimeString = dataUriParts[0].split(':')[1].split(';')[0];

    var array_buffer =  new ArrayBuffer(byteString.length);
    var int_arr = new Uint8Array(array_buffer);

    for(var i = 0; i < byteString.length; i++) {
        int_arr[i] = byteString.charCodeAt(i);
    }

    return new Blob([array_buffer], { type: mimeString });
};

/**
 * Creates an ajax form for the given (jQuery element) form.
 * extra_data will be padded along with the form fields,
 * exta_data must have format [{'name':'a','value':'b'},..]
 */
function ajax_request_from_form($form,extra_data,success_cb,error_cb){
  if(success_cb === undefined){
    success_cb = function (d, textStatus, jqXHR) {
      if (d.redirect !== undefined)
        window.location = d.redirect;
      console.log("Went well",d);
    }
  }
  if(error_cb === undefined){
    error_cb = function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        message = JSON.parse(jqXHR.responseText).message
        console.log("Oh noes!",message);
      }
  }
  var form = $form.clone();
  var data = form.serializeArray();
  for(d in extra_data){
    data.push(extra_data[d]);
  }

  $.ajax({
      type: form.attr("method"),
      url: form.attr("action"),
      data: data,
      success: success_cb,
      error: error_cb
  });
}


/**
 * Loading indicator shows that something is loading!
 */
var $loadingIndicator = $('<div class="spinner"></div>');
