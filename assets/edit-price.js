var change_i = 0;

// The price box is not input, apparently
$(".price-picker").keyup(function() {
    var $this = $(this);
    var this_i = ++change_i;

    //If no change happens in 1s, clean contents of field
    setTimeout( function() {
        if(this_i >= change_i)
            cleanPriceField($this);
    }, 1000);
}).css('padding-left','20px');

function cleanPriceField($field) {
    var number = Number($field.val().replace(/[^0-9\.]+/g,""));
    $field.val(number);
}
