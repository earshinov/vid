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
  else {
    var jqueryOld = window.jQuery;
    loadScript('http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js', function() {
      var jqueryNew = window.jQuery;
      if (jqueryOld !== undefined) window.jQuery = jqueryOld;
      run(jqueryNew);
    });
  }

  // === ^^^ HEADING ^^^ =======================================================

  function run($) {

    // === GLOBAL VARIABLES ====================================================

    // Contains a single element - a block user selected with cursor, or nothing
    var $selectedBlock = $([]);

    // All objects within the selected block.
    // User may iterate these with Space or Tab, choosing an object.
    // By default, the first element of the set is chosen.
    var $objects = $([]);

    // An index in $objects where the currently chosen object resides.
    var chosenIndex = 0;

    // Contains a single element - an element to which an outline
    // around the currently chosen object is attached, or nothing.
    // May be not the object itself, but its ancestor.
    var $chosenOutline = $([]);

    // === HELPER FUNCTIONS 1 ==================================================

    function updateObjects() {
      var $element = $selectedBlock.length === 1 ? $selectedBlock : $(document);
      var $newObjects = $element.find('object, embed').filter(':visible:not(embed object)');
      outlineChosen(false);
      $objects = $newObjects;
      chosenIndex = 0;
      outlineChosen(true);
    }

    function outlineChosen(on) {
      if (!on) {
        $chosenOutline.css('outline', 'none');
        $chosenOutline = $([]);
      }
      else {
        $chosenOutline = $objects.eq(chosenIndex);
        if ($chosenOutline.length === 0)
          return;

        // On Vimeo, video object is wrapped in some blocks of the same dimensions.
        // Attach outline to the topmost of these blocks so that the outline is visible.
        for (
          var $parent = $chosenOutline.parent();
          $parent.width() === $chosenOutline.width() &&
          $parent.height() === $chosenOutline.height();
          $chosenOutline = $parent, $parent = $chosenOutline.parent() ) ;

        $chosenOutline.css('outline', '3px solid yellow');
      }
    }

    // === CORE CODE ===========================================================

    updateObjects();

    $(document.body)
      .bind('click.vid', function(e) {
        e.preventDefault();
        extractObject();
      })
      .bind('mouseover.vid', function(e) {
        $selectedBlock = $(e.target);
        $selectedBlock.css('outline', '3px solid red');
        updateObjects();
      })
      .bind('mouseout.vid', function(e) {
        $(e.target).css('outline', 'none');
        $selectedBlock = $([]);
        updateObjects();
      });

    $(document).bind('keydown.vid', function(e) {
      switch (e.which) {
        case 9: case 32: // Tab or Space iterates
          var len = $objects.length;
          if (len > 1) {
            outlineChosen(false);
            chosenIndex = (chosenIndex + (e.shiftKey ? len-1 : 1)) % len;
            outlineChosen(true);
          }
          return false;
        case 13: // Enter extracts
          extractObject();
          return false;
        case 27: // Esc cancels
          finalize();
          return false;
      }
    });

    // === HELPER FUNCTIONS 2 ==================================================

    function extractObject() {
      var $object = $objects.eq(chosenIndex);
      if ($object.length === 0)
        return;

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
      $selectedBlock.css('outline', 'none');
      outlineChosen(false);
      $('body')
        .unbind('click.vid')
        .unbind('mouseover.vid')
        .unbind('mouseout.vid');
      $(document).unbind('keydown.vid');
    }
  }

})();
