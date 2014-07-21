// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

function empty(elem){
  return !/\w/.test(elem.text());
}

function empty_if_empty(){
  $(".edit-field").each(function(){
    var elem = $(this);
    if(empty(elem)){
      elem.addClass("empty")
    } else if(elem.hasClass("empty"))
      elem.removeClass("empty")
  });}

function all_filled(){
  var l = $(".edit-field").filter(function(i){
    return empty($(this));
  });

  return l.length == 0;
  //.length == 0;
}

function disable_button_if_empty(){
  if(!all_filled()){
    $("#group-button").attr("disabled",true);
  }
}

function enable_button_if_filled(){
  if(all_filled()){
    $("#group-button").attr("disabled",null);
  }
}

function submit_group(return_url){
  var return_on_success = function (d, textStatus, jqXHR) {
    window.location = return_url;
  }
  ajax_request_from_form($("#group_form"),[
  {'name': "group_name", "value": $("#group_name").text()},
  {'name': "group_description", "value": $("#group_description").text()}
  ],
  return_url === "" ? undefined : return_on_success
  )
}

function emptyElement(e){
  e.text("");
}

function groupText(){
  return "+ Group";
}

function addTextToElementIfEmpty(e,text){
  if(e.text().len == 0)
    e.text(text)
}

function keypressIsEnter(event){
  return event.which == 13;
}

function addNewGroupAttributes(elem){
    elem.autocomplete({
        source: function( request, response ) {
            $.getJSON("/readers/self/groups", {
                term: request.term
            }, response );
        },
        search: function() {
            // custom minLength
            var term = $(this).html();
            if ( term.length < 1 ) {
                return false;
            }
        },
        focus: function() {
            // prevent value inserted on focus
            return false;
        },
        select: function( event, ui ) {
            $(this).html(ui.item.value);
            return false;
        }
    })
    .bind('click', function(e) {
      emptyElement($(this));
    })
    .bind('focusout', function(e) {
      addTextToElementIfEmpty($(this),groupText());
    })
    .keydown(function(e) {
      if(keypressIsEnter(e)){
        $("#content").focus();
      }
    // Shift class to be chosen group
    });


}

/**
 * This gives us the possiblity to find out what is bound where
 */
function addBindings(){
  $(".edit-field").bind('input',function(e){
    empty_if_empty();
    disable_button_if_empty();
    enable_button_if_filled();
  });

  $(".edit-field").bind('focus',function(e){
    empty_if_empty();
    disable_button_if_empty();
    enable_button_if_filled();
  });

  addNewGroupAttributes($(".group"));
}

/**
 * So that we know what actually runs
 */
function main(){ // Because sigurt loves Java so much
  addBindings();
  empty_if_empty();
}

(function($) {
  $(document).ready(function() {
    main();
  });
})(jQuery);
