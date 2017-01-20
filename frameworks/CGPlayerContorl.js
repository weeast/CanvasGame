var cg = cg || {};


/********************************************
 *                控制器
 *******************************************/
cg.playerContorl = {
	_locPostion : null,
	_eventDispatcher : null,
	_mousePoint : null,

	init : function(){
		this._locPostion = cg.winPosition;
		this._eventDispatcher = cg.eventManager;
		this._listenMouse();
		this._listenTouchs();
	},

	_listenMouse : function(){
		var locCanvas = document.getElementById(cg.DRAW_CANVAS);
		this._addEvent(locCanvas,'mousedown',this._mouseClick);
		this._addEvent(locCanvas,'mouseup',this._mouseUp);
	},

	_listenTouchs : function(){
		var locCanvas = document.getElementById(cg.DRAW_CANVAS);
		this._addEvent(locCanvas,'touchstart',this._touchStart);
		this._addEvent(locCanvas,'touchmove',this._touchMove);
		this._addEvent(locCanvas,'touchend',this._touchEnd);
		this._addEvent(locCanvas,'touchcancel',this._touchCancel);
	},

	_mouseUp : function(e){
		event.preventDefault();
		var locX = e.offsetX, locY = e.offsetY, locEvent,touchEv;
		touchEv = new cg.EventTouch(this._mousePoint);
		touchEv._setEventCode(cg.EventTouch.EventCode.ENDED );
		cg.playerContorl._eventDispatcher.dispatchEvent(touchEv);
	},

	_mouseClick : function(e){
		event.preventDefault();
		var locX = e.offsetX, locY = e.offsetY, locEvent,touchEv,touch = [{offsetX:locX,offsetY:locY}];
		this._mousePoint = touch;
		// locEvent = new cg.EventMouse(cg.EventMouse.BUTTON_LEFT);
		// cg.playerContorl._eventDispatcher.dispatchEvent(locEvent);
		touchEv = new cg.EventTouch(touch);
		touchEv._setEventCode(cg.EventTouch.EventCode.BEGAN );
		cg.playerContorl._eventDispatcher.dispatchEvent(touchEv);
	},

	_touchStart : function(event) {
         event.preventDefault();
         var locEvent = new cg.EventTouch(event.touches);
         locEvent._setEventCode(cg.EventTouch.EventCode.BEGAN );
         cg.playerContorl._eventDispatcher.dispatchEvent(locEvent);
	},

	_touchMove : function(event) {
         event.preventDefault();
         var locEvent = new cg.EventTouch(event.touches);
         locEvent._setEventCode(cg.EventTouch.EventCode.MOVED );
         cg.playerContorl._eventDispatcher.dispatchEvent(locEvent);
	},

	_touchEnd : function(event) {
         event.preventDefault();
         var locEvent = new cg.EventTouch(event.touches);
         locEvent._setEventCode(cg.EventTouch.EventCode.ENDED );
         cg.playerContorl._eventDispatcher.dispatchEvent(locEvent);
	},

	_touchCancel : function(event) {
         event.preventDefault();
         var locEvent = new cg.EventTouch(event.touches);
         locEvent._setEventCode(cg.EventTouch.EventCode.CANCELLED );
         cg.playerContorl._eventDispatcher.dispatchEvent(locEvent);
	},

	_addEvent : function(el, type, fn){
		if (document.addEventListener) {
			if (el.length) {
				for (var i = 0; i < el.length; i++) {
					this._addEvent(el[i], type, fn);
				}
			} else {
				el.addEventListener(type, fn, false);
			}
		} else {
			if (el.length) {
				for (var i = 0; i < el.length; i++) {
					this._addEvent(el[i], type, fn);
				}
			} else {
				el.attachEvent('on' + type, function() {
					return fn.call(el, window.event);
				});
			}
		}
	}
};