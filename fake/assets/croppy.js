function submitCropForm(){
  $(".crop_form").submit();
}

function updateCoords(c){
  // variables can be accessed here as
  $("#x").val(c.x);
  $("#y").val(c.y);
  $("#h").val(c.h);
  $("#w").val(c.w);
};

$(document).keyup(function(e){
  if(e.which == 13){
    console.log("Submitting")
    $("#submit_crop").click()
  }
});

crop_vars = undefined
//{
//  onChange: updateCoords,
//  aspectRatio: 16 / 9,
//  bgColor:     'black',
//  bgOpacity:   .4,
//  setSelect: [0,0,0,540]
//};

//Wat de fak is diz?
$(function() {

  if(crop_vars === undefined){
    $("#crop_image").Jcrop({
      onChange: updateCoords,
      aspectRatio: 16 / 9,
      bgColor:     'black',
      bgOpacity:   .4,
      setSelect: [0,0,0,540]
    });
  } else {
    crop_vars["onChange"] = updateCoords;
    $("#crop_image").Jcrop(crop_vars);
  }
})
