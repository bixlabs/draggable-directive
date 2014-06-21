angular.module('bix-directives',[])
  .directive('draggable', function($document) {
    return function(scope, element, attr) {
      var currentX = 0,currentY = 0, elem = jQuery(element[0]), fit = false;
	    var rect = [];

      element.css({
        position: 'relative',
        border: '1px solid #000',
        width: '30px',
        height: '30px',
        cursor: 'pointer'
      });

      var hammertime = new Hammer(element[0], {preventDefault: true});

	    hammertime.on("dragstart", function(ev) {

        rect = [];
        var trays = jQuery(".tray");
        for(var i= 0;i<trays.length;i++) {

          var $el = jQuery(trays[i]);
          if ($el.is(':visible')) {
            var bounds = $el.offset();
            rect.push({top:bounds.top,left:bounds.left,width:50,height:50,$el:$el});
          }
        }
	    });

      hammertime.on("drag", function(ev) {

        element[0].style.webkitTransform = 'translate(' + (ev.gesture.deltaX + currentX) + 'px,'+ (ev.gesture.deltaY + currentY) +'px)' + 'translateZ(0)';

        var el_w = parseInt( element[0].style.width  ),
            el_h = parseInt( element[0].style.height );

        var rectInside = {};
	      if (util.isInsideRectangules(elem.offset().left,elem.offset().top,rect,rectInside) &&
		        util.isInsideRectangules(elem.offset().left + el_w,elem.offset().top,rect,rectInside) &&
		        util.isInsideRectangules(elem.offset().left,elem.offset().top + el_h,rect,rectInside) &&
		        util.isInsideRectangules(elem.offset().left + el_w,elem.offset().top + el_h,rect,rectInside)) {

					if (!fit){
						elem.addClass("over");
						scope.fitIn(element[0],rectInside.rect);
						fit = true;
					}
	      } else {
		      if (fit){
			      elem.removeClass("over");
			      scope.fitOut(element[0]);
			      fit = false;
		      }
	      }
	      scope.$apply();
      });

      hammertime.on("dragend", function(ev){
        currentX += ev.gesture.deltaX;
        currentY += ev.gesture.deltaY;
      });

	    scope.$on('$destroy', function() {
		    console.log("destroy in directive");
	    });
    };
  });
