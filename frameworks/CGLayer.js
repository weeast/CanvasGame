var cg = cg || {};


/********************************************
 *                层节点
 *******************************************/

cg.Layer = cg.Node.extend({
	_isBaked: false,
	_bakeSprite: null,
	_className: "Layer",
	_cacheDirty:false,

	//构造函数，重载时记得调用this.super()
	ctor: function() {
		cg.Node.prototype.ctor.call(this);
	},

	//初始化函数
	init: function() {
		var _t = this;
		_t.setAnchorPoint(0.5, 0.5);
		_t.setContentSize(cg.winSize);
		return true;
	},

	//将所有子元素缓存到一个对象中，方便绘制
	bake: function() {
		if (!this._isBaked) {
			this._isBaked = this._cacheDirty = true;

			this._cachedParent = this;
			var children = this._children;
			for (var i = 0, len = children.length; i < len; i++)
				children[i]._setCachedParent(this);

			if (!this._bakeSprite)
				this._bakeSprite = new cg.BakeSprite();
		}
	},

	//解除缓存
	unbake : function() {
		if (this._isBaked) {
			this._isBaked = false;
			this._cacheDirty = true;

			this._cachedParent = null;
			var children = this._children;
			for (var i = 0, len = children.length; i < len; i++)
				children[i]._setCachedParent(null);
		}
	},

	/**
	 * 是否被缓存
	 * @function
	 * @returns {boolean}
	 * @see cg.Layer#bake and cg.Layer#unbake
	 */
	isBaked: function() {
		return this._isBaked;
	},

	addChild : function(child, localZOrder, tag) {
		cg.Node.prototype.addChild.call(this, child, localZOrder, tag);
		if (child._parent == this && this._isBaked)
			child._setCachedParent(this);
	},

	visit: function(ctx) {
		if (!this._isBaked) {
			cg.Node.prototype.visit.call(this, ctx);
			return;
		}

		var context = ctx || cg._renderContext,
			i;
		var _t = this;
		var children = _t._children;
		var len = children.length;
		if (!_t._visible || len === 0)
			return;

		var locBakeSprite = this._bakeSprite;

		context.save();
		_t.transform(context);

		if (this._cacheDirty) {
			var boundingBox = this._getBoundingBoxForBake();
			boundingBox.width = 0 | boundingBox.width;
			boundingBox.height = 0 | boundingBox.height;
			var bakeContext = locBakeSprite.getCacheContext();
			locBakeSprite.resetCanvasSize(boundingBox.width, boundingBox.height);
			bakeContext.translate(0 - boundingBox.x, boundingBox.height + boundingBox.y);

			var anchor = locBakeSprite.getAnchorPointInPoints();
			locBakeSprite.setPosition(anchor.x + boundingBox.x, anchor.y + boundingBox.y);

			_t.sortAllChildren();
			cg.view._setScaleXYForRenderTexture();
			for (i = 0; i < len; i++) {
				children[i].visit(bakeContext);
			}
			cg.view._resetScale();
			this._cacheDirty = false;
		}

		locBakeSprite.visit(context);

		_t.arrivalOrder = 0;
		context.restore();
	},
	_getBoundingBoxForBake : function() {
		var rect = null;

		if (!this._children || this._children.length === 0)
			return cg.rect(0, 0, 10, 10);

		var locChildren = this._children;
		for (var i = 0; i < locChildren.length; i++) {
			var child = locChildren[i];
			if (child && child._visible) {
				if (rect) {
					var childRect = child._getBoundingBoxToCurrentNode();
					if (childRect)
						rect = cg.rectUnion(rect, childRect);
				} else {
					rect = child._getBoundingBoxToCurrentNode();
				}
			}
		}
		return rect;
	}
});

cg.Layer.create = function() {
	return new cg.Layer();
};