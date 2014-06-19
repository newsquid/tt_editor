/**
 * Return whether the current reader should be presented with the modal
 */
function loadAcceptIf(post_id,reader_id,cb){
  var url = '/tos/should_accept/'+post_id+'/'+reader_id

  $.get(url).success(function(data){
    if(data.answer == "yes"){
      cb();
    }
  });
}

function accept(post,reader,redirect){
  var url = '/tos/accept/'+reader

  $.post(url).then(function(){
    window.location.replace(redirect); //this is bad and non-generic. But it WERKS
  });
}

function accept_button(post,reader,redirect){
  var button = document.createElement('button');
  button.className = 'btn btn-success';
  button.innerText = 'Accept';
  button.onclick = function(){ accept(post,reader,redirect) };

  return button
}

function loadAccept(post,reader) {
  var $modal = $.d_modal("You must accept these terms to continue using TrunkTrunk.");
  $modal.attr('id','accept_tos_modal');
  $modal.append(accept_button(post,reader,document.referrer));
}

function loadRedirect(post,reader){
  var $modal = $.d_modal("To use TrunkTrunk you must read and accept our <a href='/tos'>Terms of Service</a>");
  $modal.attr('id','redirect_tos_modal');
  $modal.append(accept_button(post,reader,document.URL));
}

function loadRedirectIf(post,reader,cb){
  $.get('/tos/should_redirect/'+post+'/'+reader).success(function(data){
    if(data.answer=="yes"){
      cb();
    }
  });
}
