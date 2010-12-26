(function() {
  var $ = jQuery;
  var outlined = null;

  $('body')
    .bind('click.vid', function(e) {
      e.preventDefault();
      var $objects = $(e.target).find('object, embed').filter(':not(embed object)');
      if ($objects.length === 1) {
        $objects.css({
          'margin': 0
        });
        var $div = $('<div>').css({
          'position': 'absolute',
          'top': '50%',
          'left': '50%',
          'margin': 0,
          'margin-left': -$objects.width()/2,
          'margin-top': -$objects.height()/2
        }).append($objects);
        $('body').css({
          'padding': 0,
          'width': '100%',
          'height': '100%',
          'background-color': 'Black'
        }).empty().append($div);
        finalize();
      }
    })
    .bind('mouseover.vid', function(e) {
      outlined = e.target;
      $(outlined).css('outline', '3px solid red');
    })
    .bind('mouseout.vid', function(e) {
      $(e.target).css('outline', 'none');
      outlined = null;
    });

  $(document).bind('keydown.vid', function(e) {
    if (e.which === 27) {
      finalize();
      return false;
    }
  });

  function finalize() {
    if (outlined !== null)
      $(outlined).css('outline', 'none');
    $('body')
      .unbind('click.vid')
      .unbind('mouseover.vid')
      .unbind('mouseout.vid');
    $(document).unbind('keydown.vid');
  }
})();
