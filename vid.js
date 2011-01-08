(function() {

  // === vvv HEADING vvv =======================================================

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

  if (window.jQuery !== undefined && jQuery.version === '1.4.3')
    run(jQuery);
  else
    loadScript('http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js', function() {
      var $ = jQuery;
      $.noConflict();
      run($);
    });

  // === ^^^ HEADING ^^^ =======================================================

  function run($) {

    // === GLOBAL VARIABLES ====================================================

    // Temporary HTML elements
    var $wrappers = $([]);

    // === CORE CODE ===========================================================

    // Set wmode: opaque to be able to place HTML elements above objects.
    // If <embed> comes alone, wrap it in <object>; otherwise the trick
    // does not work (tested on YouTube with Firefox 3.6 under Linux).
    //
    $('embed').attr('wmode', 'opaque').filter(':not(object embed)').wrap('<object>');
    $('object').each(function() {
      var $object = $(this);
      if ($object.children('param[name="wmode"]').attr('value', 'opaque').length === 0)
        $object.append($(document.createElement('param'), {name: 'wmode', value: 'opaque'}));
      wrapObject($object);
    });

    $(document).bind('keydown.vid', function(e) {
      if (e.which === 27) {
        // Esc cancels
        finalize();
        return false;
      }
    });

    // === HELPER FUNCTIONS 2 ==================================================

    function wrapObject($object) {
      var pos = $object.offset();
      var w = $object.width();
      var h = $object.height();

      var zindex = $object.css('z-index');
      if (zindex === 'auto') {
        zindex = 9999;
        $object.css('z-index', zindex);
      }
      else zindex = parseInt(zindex);

      var $div = $(document.createElement('div'))
        .css({
          'position': 'absolute',
          'left': pos.left,
          'top': pos.top,
          'width': w,
          'height': h,
          'z-index': zindex + 1,
          'cursor': 'pointer'
        })
        .mouseover(function() {
          $(this).css('outline', '3px Solid Yellow');
        })
        .mouseout(function() {
          $(this).css('outline', 'none');
        })
        .mousedown(function(e) {
          e.preventDefault();
          extractObject($object);
        });

      $div.appendTo(document.body);
      $wrappers = $wrappers.add($div);
    }

    function extractObject($object) {
      var w = $object.width();
      var h = $object.height();

      $object.css({
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
      }).append($object);

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

    function finalize() {
      $wrappers.remove();
      $(document).unbind('.vid');
    }
  }

})();
