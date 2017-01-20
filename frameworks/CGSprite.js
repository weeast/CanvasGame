var cg = cg || {};


/********************************************
 *                精灵节点
 *******************************************/

cg.Sprite = cg.Node.extend({
	_texture: null,
	_textureLoader: null,
	_offsetX: 0,
	_offsetY: 0,
	_className: "Sprite",
	_loadedEventListeners: null,

	ctor: function(texture) {
		cg.Node.prototype.ctor.call(this);
		this._textureLoader = new cg.Loader();
		this._loadedEventListeners = [];
		this.addLoadedEventListener(this._textLoadedFn, this);
		if(texture){
			this.setTexture(texture);
		}
	},

	_textLoadedFn: function() {
		if (this._texture.readyState)
			this.setContentSize(this._texture.resource.width, this._texture.resource.height);
	},

	setTexture: function(texture) {
		var textureId;
		if (cg.isString(texture))
			textureId = this._textureLoader.loadImg(texture, this._callLoadedEventCallbacks, this);
		else
			textureId = cg.resourcesManager._pushImgResource(texture, this._callLoadedEventCallbacks, this);
		if (textureId)
			this._texture = cg.resourcesManager._getImgResource(textureId)[0];
		if(this._texture.readyState)
			this._callLoadedEventCallbacks();
	},
	getTexture: function() {
		return this._texture;
	},
	setOffPoint: function(point) {
		_offsetX = point.x || 0;
		_offsetY = point.y || 0;
	},
	setOffX: function(x) {
		_offsetX = x || 0;
	},
	setOffY: function(y) {
		_offsetY = y || 0;
	},
	draw: function(ctx) {
		var locAnchor = this._anchorPoint,
			locPoint = this._position,
			locOffY = this._offsetY,
			locOffX = this._offsetX,
			locSize = this._contentSize;
		if (this._texture && this._texture.readyState) {

			ctx.drawImage(this._texture.resource,  locOffX, locOffY, locSize.width, locSize.height, (this.x || locPoint.x) - locAnchor.x-locSize.width/2, (this.y || locPoint.y) - locAnchor.y-locSize.height/2, locSize.width, locSize.height)
		}

	},
	addLoadedEventListener: function(callback, target) {
		if (!this._loadedEventListeners)
			this._loadedEventListeners = [];
		this._loadedEventListeners.push({
			eventCallback: callback,
			eventTarget: target
		});
	},

	_callLoadedEventCallbacks: function() {
		if (!this._loadedEventListeners)
			return;
		var locListeners = this._loadedEventListeners;
		for (var i = 0, len = locListeners.length; i < len; i++) {
			var selCallback = locListeners[i];
			selCallback.eventCallback.call(selCallback.eventTarget, this);
		}
		locListeners.length = 0;
	}

});

cg.Sprite.create = function(texture) {
	return new cg.Sprite(texture);
}

cg.BakeSprite = cg.Sprite.extend({
	_cacheCanvas: null,
	_cacheContext: null,
	ctor: function() {
		cg.Sprite.prototype.ctor.call(this);
		var a = document.createElement("canvas");
		a.width = a.height = 10;
		this._cacheCanvas = a;
		this._cacheContext = new cg.CanvasContextWrapper(a.getContext("2d"));
		var b = new cg.Texture2D;
		b.initWithElement(a);
		b.handleLoadedTexture();
		this.setTexture(b)
	},
	getCacheContext: function() {
		return this._cacheContext
	},
	getCacheCanvas: function() {
		return this._cacheCanvas
	},
	resetCanvasSize: function(a, b) {
		void 0 === b &&
			(b = a.height, a = a.width);
		var c = this._cacheCanvas;
		c.width = a;
		c.height = b;
		this.getTexture().handleLoadedTexture();
		this.setTextureRect(cg.rect(0, 0, a, b), !1)
	}
});

cg.BakeSprite.create = function() {
	return new cg.BakeSprite();
}