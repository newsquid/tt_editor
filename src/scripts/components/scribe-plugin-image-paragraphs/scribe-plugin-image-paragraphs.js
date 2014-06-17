define(function(){

  'use strict';

  return function(mediaBarElement, addImageFunction){

    return function(scribe){

      scribe.el.addEventListener('keyup', onInput);
      //scribe.el.addEventListener('click', onInput);

      function onInput(event){

        scribe.transactionManager.run(function(){
          insertHoverEvents();
        });

      }

      function insertHoverEvents(){

        var els = scribe.el.children;
        for (var i = 0, len = els.length; i < len; i++){
          var el = els[i];
          if(el.outerHTML == "<p><br></p>"){
            el.addEventListener("mouseover", function(){
              var elem = this;
              var bar = showMediaBar(elem).cloneNode(true); // Hacky way of removing past events

              bar.addEventListener("mouseover", function(event) { showMediaBar(elem); });

              bar.children[0].addEventListener("click", function(event) {
                addImageFunction(event,elem);
                hideMediaBar(elem);
              });

              mediaBarElement.parentNode.replaceChild(bar,mediaBarElement);
              mediaBarElement = bar; // So that parent is not null on next pass.
                                     // I totally didn't waste 10 minutes banging my head

            });
            el.addEventListener("mouseleave", function(){ hideMediaBar(this); });
          }
        }
      }

      function showMediaBar(element){
        mediaBarElement.style.display = "block";

        mediaBarElement.style.top = element.offsetTop + "px";
        mediaBarElement.style.left = element.offsetLeft + "px";
        mediaBarElement.style.position = 'absolute';

        return mediaBarElement;
      }

      function hideMediaBar(element){
        mediaBarElement.style.display = "none";
      }

    };
  };
});
