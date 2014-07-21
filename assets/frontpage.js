/** FINI SCROLL (c) 2014 TRUNKETY LOL **/

var currently_loading_next_grid = false;
var loading_indicator = $loadingIndicator.clone();
var more_grids_available = true;
var $noMoreArticlesMessage = $('<div class="the-end-message">There are no more articles on the frontpage. <a href="/posts">Start over</a> or <a href="/posts/new">write your own</a>.</div>');

(function($) {
    $(document).ready(function() {
        $("body").scroll(considerShowingNextGrid);
        $(window).scroll(considerShowingNextGrid);
    });
})(jQuery);

function considerShowingNextGrid() {
    if(endOfLastGridVisible()) {
        fakeLoadNextGrid();
    }
}

function endOfLastGridVisible() {
    return visibleBottomOffset() > lastVisibleGridBottomOffset();
}

function visibleBottomOffset() {
    return $(window).scrollTop() + $(window).height();
}

function lastVisibleGridBottomOffset() {
    var lastVisibleGrid = $(".article-grid:visible").last();
    return lastVisibleGrid.offset().top + lastVisibleGrid.height();
}

function fakeLoadNextGrid() {
    if(!currently_loading_next_grid && more_grids_available) {
        currently_loading_next_grid = true;
        indicateLoadingGrid();
        setTimeout(function() {
            removeLoadingIndication();
            showNextGrid(function() {
                currently_loading_next_grid = false;
            });
        }, 1200);
    }
}

function indicateLoadingGrid() {
    $(".frontpage").append(loading_indicator);
}

function removeLoadingIndication() {
    loading_indicator.remove();
    loading_indicator = $loadingIndicator.clone();
}

function showNextGrid(callback) {
    var nextGrid = getNextGrid();
    if(nextGrid) {
        getNextGrid().slideDown(callback);
    }
    else {
        //No more grids available
        more_grids_available = false;

        showNoMoreArticlesMessage();
    }
};

function getNextGrid() {
    var hidden_articles = getHiddenArticles();
    if(hidden_articles.length > 0) return hidden_articles.first();
    return false;
}

function getHiddenArticles() {
    return $(".article-grid:hidden");
}

function showNoMoreArticlesMessage() {
    $noMoreArticlesMessage.appendTo(".frontpage").hide().slideDown();
}