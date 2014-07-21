# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

@blankNonTTLinks = () ->
    # Make all links not going to trunktrunk have target blank
    #address =~ /(^|http\:\/\/)trunktrunk\.com/

$(() -> blankNonTTLinks())
