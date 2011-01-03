(function() {

  function loadScript(src, callback) {
    var scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.src = src;

    var done=false;
    scriptElement.onload = scriptElement.onreadystatechange = function() {
      if (!done && (!this.readyState || this.readyState==='loaded' || this.readyState === 'complete')) {
        done = true;
        if (callback !== undefined) callback();
      }
    };

    var head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(scriptElement);
  }

  if (window.jQuery !== undefined && jQuery.version == '1.4.3')
    run(jQuery);
  else {
    var jqueryOld = window.jQuery;
    loadScript('http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js', function() {
      var jqueryNew = window.jQuery;
      if (jqueryOld !== undefined) window.jQuery = jqueryOld;
      run(jqueryNew);
    });
  }

  function run($) {
    var outlined = null;
    $(document.body)
      .bind('click.vid', function(e) {
        e.preventDefault();
        var $objects = $(e.target).find('object, embed').filter(':not(embed object)');
        if ($objects.length === 1) {
          var w = $objects.width();
          var h = $objects.height();
          $objects.css({
            'margin': 0,
            'width': w,
            'height': h
          });
          var $div = $('<div>').css({
            'position': 'absolute',
            'top': '50%',
            'left': '50%',
            'margin': 0,
            'margin-left': -w/2,
            'margin-top': -h/2
          }).append($objects);
          $('body').css({
            'padding': 0,
            'background': 'Black'
          }).empty().append($div);
          $('html, body').css({
            'width': '100%',
            'min-width': '100%',
            'max-width': '100%',
            'height': '100%',
            'min-height': '100%',
            'max-height': '100%'
          });
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
  }

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
