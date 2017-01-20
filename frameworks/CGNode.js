var cg = cg || {};

/********************************************
 *                游戏节点
 *******************************************/
cg.NODE_TAG_INVALID = -1;
cg.s_globalOrderOfArrival = 1;
cg.Node = cg.Class.extend({
	_localZOrder: 0,
	_globalZOrder: 0,
	_vertexZ: 0.0,

	_rotationX: 0,
	_rotationY: 0.0,
	_scaleX: 1.0,
	_scaleY: 1.0,
	_anchorPoint: null,
	_position: null,
	_skewX: 0.0,
	_skewY: 0.0,

	_children: null,

	_visible: true,
	_contentSize: null,
	_running: false,
	_parent: null,

	tag: cg.NODE_TAG_INVALID,

	userData: null,
	userObject: null,
	_transformDirty: true,
	_inverseDirty: true,

	_cachedParent: null,
	_transform: null,
	_inverse: null,

	_reorderChildDirty: false,
	arrivalOrder: 0,

	_renderCmd: null,
	_actionManager: null,
	_scheduler: null,
	_eventDispatcher: null,

	_initializedNode: false,
	_isTransitionFinished: false,

	_rotationRadiansX: 0,
	_rotationRadiansY: 0,
	_className: "Node",
	_showNode: false,
	_name: "",

	_displayedOpacity: 255,
	_realOpacity: 255,
	cascadeOpacity: false,
	cascadeColor: false,
	_displayedColor: null,
	_realColor: null,
	_cascadeColorEnabled: false,
	_cascadeOpacityEnabled: false,

	_nodeDirtyFlag: false,

	_initNode: function() {
		var _t = this;
		_t._contentSize = cg.size(0, 0);
		_t._anchorPoint = cg.p(0, 0);
		_t._position = cg.p(0, 0);
		_t._children = [];
		_t._transform = {
			a: 1,
			b: 0,
			c: 0,
			d: 1,
			tx: 0,
			ty: 0
		};

		var director = cg.director;
		_t._actionManager = director.getActionManager();
		_t._scheduler = director.getScheduler();
		_t._initializedNode = true;

		this._displayedOpacity = 255;
		this._realOpacity = 255;
		this._displayedColor = cg.color(255, 255, 255, 255);
		this._realColor = cg.color(255, 255, 255, 255);
	},

	init: function() {
		if (this._initializedNode === false)
			this._initNode();
		return true;
	},

	/**
	 * 设置属性
	 * @function
	 * @param {Object} attrs 属性对象
	 */
	attr: function(attrs) {
		for (var key in attrs) {
			this[key] = attrs[key];
		}
	},

	setNodeDirty: function() {
		this._nodeDirtyFlag = true;
	},

	getSkewX: function() {
		return this._skewX;
	},

	setSkewX: function(newSkewX) {
		this._skewX = newSkewX;
		this.setNodeDirty();
	},

	getSkewY: function() {
		return this._skewY;
	},

	setSkewY: function(newSkewY) {
		this._skewY = newSkewY;
		this.setNodeDirty();
	},

	setLocalZOrder: function(localZOrder) {
		this._localZOrder = localZOrder;
		if (this._parent)
			this._parent.reorderChild(this, localZOrder);
		cg.eventManager._setDirtyForNode(this);
	},

	_setLocalZOrder: function(localZOrder) {
		this._localZOrder = localZOrder;
	},

	getLocalZOrder: function() {
		return this._localZOrder;
	},

	setGlobalZOrder: function(globalZOrder) {
		if (this._globalZOrder != globalZOrder) {
			this._globalZOrder = globalZOrder;
			cg.eventManager._setDirtyForNode(this);
		}
	},

	getGlobalZOrder: function() {
		return this._globalZOrder;
	},

	getVertexZ: function() {
		return this._vertexZ;
	},

	setVertexZ: function(Var) {
		this._vertexZ = Var;
	},

	getRotation: function() {
		if (this._rotationX !== this._rotationY)
			cg.log(cg._LogInfos.Node_getRotation);
		return this._rotationX;
	},

	setRotation: function(newRotation) {
		this._rotationX = this._rotationY = newRotation;
		this._rotationRadiansX = this._rotationX * 0.017453292519943295; //(Math.PI / 180);
		this._rotationRadiansY = this._rotationY * 0.017453292519943295; //(Math.PI / 180);
		this.setNodeDirty();
	},

	getRotationX: function() {
		return this._rotationX;
	},

	setRotationX: function(rotationX) {
		this._rotationX = rotationX;
		this._rotationRadiansX = this._rotationX * 0.017453292519943295; //(Math.PI / 180);
		this.setNodeDirty();
	},

	getRotationY: function() {
		return this._rotationY;
	},

	setRotationY: function(rotationY) {
		this._rotationY = rotationY;
		this._rotationRadiansY = this._rotationY * 0.017453292519943295; //(Math.PI / 180);
		this.setNodeDirty();
	},

	getScale: function() {
		if (this._scaleX !== this._scaleY)
			cg.log(cg._LogInfos.Node_getScale);
		return this._scaleX;
	},

	setScale: function(scale, scaleY) {
		this._scaleX = scale;
		this._scaleY = (scaleY || scaleY === 0) ? scaleY : scale;
		this.setNodeDirty();
	},

	getScaleX: function() {
		return this._scaleX;
	},

	setScaleX: function(newScaleX) {
		this._scaleX = newScaleX;
		this.setNodeDirty();
	},

	getScaleY: function() {
		return this._scaleY;
	},

	setScaleY: function(newScaleY) {
		this._scaleY = newScaleY;
		this.setNodeDirty();
	},
	getAnchorPoint: function() {
		return cg.p(this._anchorPoint);
	},
	setAnchorPoint: function(point, y) {
		var locAnchorPoint = this._anchorPoint;
		if (y === undefined) {
			if ((point.x === locAnchorPoint.x) && (point.y === locAnchorPoint.y))
				return;
			locAnchorPoint.x = point.x;
			locAnchorPoint.y = point.y;
		} else {
			if ((point === locAnchorPoint.x) && (y === locAnchorPoint.y))
				return;
			locAnchorPoint.x = point;
			locAnchorPoint.y = y;
		}
		this.setNodeDirty();
	},

	setPosition: function(newPosOrxValue, yValue) {
		var locPosition = this._position;
		if (yValue === undefined) {
			locPosition.x = newPosOrxValue.x;
			locPosition.y = newPosOrxValue.y;
		} else {
			locPosition.x = newPosOrxValue;
			locPosition.y = yValue;
		}
		this.setNodeDirty();
	},

	getPosition: function() {
		return cg.p(this._position);
	},

	getPositionX: function() {
		return this._position.x;
	},

	setPositionX: function(x) {
		this._position.x = x;
		this.setNodeDirty();
	},

	getPositionY: function() {
		return this._position.y;
	},

	setPositionY: function(y) {
		this._position.y = y;
		this.setNodeDirty();
	},

	getChildrenCount: function() {
		return this._children.length;
	},

	getChildren: function() {
		return this._children;
	},

	isVisible: function() {
		return this._visible;
	},

	setVisible: function(visible) {
		if (this._visible != visible) {
			this._visible = visible;
			if (visible) this.setNodeDirty();
		}
	},
	_getWidth: function() {
		return this._contentSize.width
	},
	_setWidth: function(width) {
		this._contentSize.width = width;
		this.setNodeDirty();
	},
	_getHeight: function() {
		return this._contentSize.height
	},
	_setHeight: function(height) {
		this._contentSize.height = height;
		this.setNodeDirty();
	},
	getContentSize: function() {
		return cg.size(this._contentSize)
	},
	setContentSize: function(size, height) {
		var locContentSize = this._contentSize;
		if (void 0 === height) {
			if (size.width === locContentSize.width && size.height === locContentSize.height) return;
			locContentSize.width = size.width;
			locContentSize.height = size.height
		} else {
			if (size === locContentSize.width && height === locContentSize.height) return;
			locContentSize.width = size;
			locContentSize.height = height
		}
		this.setNodeDirty();
	},
	isRunning: function() {
		return this._running
	},
	getParent: function() {
		return this._parent
	},
	setParent: function(parent) {
		this._parent = parent;
	},

	getTag: function() {
		return this.tag
	},

	setTag: function(tag) {
		this.tag = tag
	},

	setName: function(name) {
		this._name = name
	},
	getName: function() {
		return this._name
	},
	getUserData: function() {
		return this.userData
	},
	setUserData: function(data) {
		this.userData = data
	},
	getUserObject: function() {
		return this.userObject
	},
	setUserObject: function(obj) {
		this.userObject != obj && (this.userObject = obj)
	},
	getOrderOfArrival: function() {
		return this.arrivalOrder
	},
	setOrderOfArrival: function(order) {
		this.arrivalOrder = order
	},
	getActionManager: function() {
		this._actionManager || (this._actionManager = cg.director.getActionManager());
		return this._actionManager
	},
	setActionManager: function(manager) {
		this._actionManager != manager && (this.stopAllActions(), this._actionManager = manager)
	},
	getScheduler: function() {
		this._scheduler || (this._scheduler = cg.director.getScheduler());
		return this._scheduler
	},
	setScheduler: function(scheduler) {
		this._scheduler != scheduler && (this.unscheduleAllCallbacks(), this._scheduler = scheduler)
	},
	getBoundingBox: function() {
		var curPos = this._position,
			curSize = this._contentSize;
		if (!curPos || !curSize)
			return -1;
		return cg.rect(curPos.x - curSize.width / 2, curPos.y - curSize.height / 2, curSize.width, curSize.height);
	},
	cleanup: function() {
		this.stopAllActions();
		this.unscheduleAllCallbacks();
		cg.eventManager.removeListeners(this);
		var i = 0,
			node, array = this._children,
			len;
		if (array) {
			len = array.length
			for (; i < len; i++) {
				node = array[i];
				if (node)
					node.cleanup();
			}
		}
	},
	getChildByTag: function(aTag) {
		var __children = this._children;
		if (null != __children)
			for (var i = 0; i < __children.length; i++) {
				var node = __children[i];
				if (node && node.tag == aTag) return node
			}
		return null
	},
	getChildByName: function(name) {
		if (!name) return cg.log("Invalid name"), null;
		for (var node = this._children, i = 0, d = node.length; i < d; i++)
			if (node[i]._name == name) return node[i];
		return null
	},
	addChild: function(child, localZOrder, tag) {
		var child = child;
		var localZOrder = localZOrder === undefined ? child._localZOrder : localZOrder;
		var tag, name, setTag = false;
		if (cg.isUndefined(tag)) {
			tag = undefined;
			name = child._name;
		} else if (cg.isString(tag)) {
			name = tag;
			tag = undefined;
		} else if (cg.isNumber(tag)) {
			setTag = true;
			name = "";
		}

		cg.assert(child, cg._LogInfos.Node_addChild_3);
		cg.assert(child._parent === null, "child already added. It can't be added again");

		this._addChildHelper(child, localZOrder, tag, name, setTag);
	},
	_addChildHelper: function(child, localZOrder, tag, name, setTag) {
		if (!this._children)
			this._children = [];

		this._insertChild(child, localZOrder);
		if (setTag)
			child.setTag(tag);
		else
			child.setName(name);

		child.setParent(this);
		child.setOrderOfArrival(cg.s_globalOrderOfArrival++);

		if (this._running) {
			child.onEnter();
			if (this._isTransitionFinished)
				child.onEnterTransitionDidFinish();
		}
	},
	_setCachedParent : function(cparent){
		if(!cparent)
			this._anchorPoint = cg.p(0,0);
		this._anchorPoint = cparent.getAnchorPoint()||cg.p(0,0);
	},
	removeFromParent: function(cleanup) {
		if (this._parent) {
			if (cleanup == null)
				cleanup = true;
			this._parent.removeChild(this, cleanup);
		}
	},
	removeChild: function(child, cleanup) {
		if (this._children.length === 0)
			return;

		if (cleanup == null)
			cleanup = true;
		if (this._children.indexOf(child) > -1)
			this._detachChild(child, cleanup);

		this.setNodeDirty();
	},

	removeChildByTag: function(tag, cleanup) {
		if (tag === cg.NODE_TAG_INVALID)
			cg.log(cg._LogInfos.Node_removeChildByTag);

		var child = this.getChildByTag(tag);
		if (child == null)
			cg.log(cg._LogInfos.Node_removeChildByTag_2);
		else
			this.removeChild(child, cleanup);
	},
	removeAllChildren: function(cleanup) {
		var __children = this._children;
		if (__children != null) {
			if (cleanup == null)
				cleanup = true;
			for (var i = 0; i < __children.length; i++) {
				var node = __children[i];
				if (node) {
					if (this._running) {
						node.onExitTransitionDidStart();
						node.onExit();
					}
					if (cleanup)
						node.cleanup();
					node.parent = null;
				}
			}
			this._children.length = 0;
		}
	},

	_detachChild: function(child, doCleanup) {
		if (this._running) {
			child.onExitTransitionDidStart();
			child.onExit();
		}

		if (doCleanup)
			child.cleanup();

		child.parent = null;

		cg.arrayRemoveObject(this._children, child);
	},
	_insertChild: function(child, z) {
		this._reorderChildDirty = true;
		this._children.push(child);
		child._setLocalZOrder(z);
	},
	reorderChild: function(child, zOrder) {
		cg.assert(child, cg._LogInfos.Node_reorderChild)
		this._reorderChildDirty = true;
		child.arrivalOrder = cg.s_globalOrderOfArrival;
		cg.s_globalOrderOfArrival++;
		child._setLocalZOrder(zOrder);
		this.setNodeDirty();
	},
	sortAllChildren: function() {
		if (this._reorderChildDirty) {
			var _children = this._children;

			// 插入排序
			var len = _children.length,
				i, j, tmp;
			for (i = 1; i < len; i++) {
				tmp = _children[i];
				j = i - 1;
				while (j >= 0) {
					if (tmp._localZOrder < _children[j]._localZOrder) {
						_children[j + 1] = _children[j];
					} else if (tmp._localZOrder === _children[j]._localZOrder && tmp.arrivalOrder < _children[j].arrivalOrder) {
						_children[j + 1] = _children[j];
					} else {
						break;
					}
					j--;
				}
				_children[j + 1] = tmp;
			}

			this._reorderChildDirty = false;
		}
	},
	//需要被重载
	draw: function(ctx) {},
	//重载时需要在方法里调用this.super()
	onEnter: function() {
		this._isTransitionFinished = !1;
		this._running = !0;
		var i = 0,
			node, array = this._children,
			len;
		if (array) {
			len = array.length
			for (; i < len; i++) {
				node = array[i];
				if (node)
					node.onEnter();
			}
		}
		this.resume()
	},
	//重载时需要在方法里调用this.super()
	onEnterTransitionDidFinish: function() {
		this._isTransitionFinished = !0;
		var i = 0,
			node, array = this._children,
			len;
		if (array) {
			len = array.length
			for (; i < len; i++) {
				node = array[i];
				if (node)
					node.onEnterTransitionDidFinish();
			}
		}
	},
	//重载时需要在方法里调用this.super()
	onExitTransitionDidStart: function() {
		var i = 0,
			node, array = this._children,
			len;
		if (array) {
			len = array.length
			for (; i < len; i++) {
				node = array[i];
				if (node)
					node.onExitTransitionDidStart();
			}
		}
	},
	//重载时需要在方法里调用this.super()
	onExit: function() {
		this._running = !1;
		this.pause();
		var i = 0,
			node, array = this._children,
			len;
		if (array) {
			len = array.length
			for (; i < len; i++) {
				node = array[i];
				if (node)
					node.onExit();
			}
		}
	},
	runAction: function(action) {

		cg.assert(action, cg._LogInfos.Node_runAction);

		this._actionManager.addAction(action, this, !this._running);
		return action;
	},
	stopAllActions: function() {
		this._actionManager && this._actionManager.removeAllActionsFromTarget(this)
	},
	stopAction: function(action) {
		this._actionManager.removeAction(action)
	},
	stopActionByTag: function(tag) {
		if (tag === cg.ACTION_TAG_INVALID) {
			cg.log(cg._LogInfos.Node_stopActionByTag);
			return;
		}
		this._actionManager.removeActionByTag(tag, this);
	},
	getActionByTag: function(tag) {
		if (tag === cg.ACTION_TAG_INVALID) {
			cg.log(cg._LogInfos.Node_getActionByTag);
			return null;
		}
		return this._actionManager.getActionByTag(tag, this);
	},
	getNumberOfRunningActions: function() {
		return this._actionManager.numberOfRunningActionsInTarget(this)
	},

	//每帧都会被调用
	scheduleUpdate: function() {
		this.scheduleUpdateWithPriority(0)
	},
	scheduleUpdateWithPriority: function(priority) {
		this._scheduler.scheduleUpdateForTarget(this, priority, !this._running)
	},
	unscheduleUpdate: function() {
		this._scheduler.unscheduleUpdateForTarget(this)
	},
	schedule: function(callback_fn, interval, repeat, delay) {
		interval = interval || 0;

		cg.assert(callback_fn, cg._LogInfos.Node_schedule);

		cg.assert(interval >= 0, cg._LogInfos.Node_schedule_2);

		repeat = (repeat == null) ? cg.REPEAT_FOREVER : repeat;
		delay = delay || 0;

		this._scheduler.scheduleCallbackForTarget(this, callback_fn, interval, repeat, delay, !this._running);
	},
	scheduleOnce: function(callback_fn, delay) {
		this.schedule(callback_fn, 0.0, 0, delay);
	},
	unschedule: function(callback_fn) {
		if (!callback_fn)
			return;

		this._scheduler.unscheduleCallbackForTarget(this, callback_fn);
	},
	unscheduleAllCallbacks: function() {
		this._scheduler.unscheduleAllCallbacksForTarget(this);
	},
	resume: function() {
		this._scheduler.resumeTarget(this);
		this._actionManager && this._actionManager.resumeTarget(this);
		cg.eventManager.resumeTarget(this);
	},
	pause: function() {
		this._scheduler.pauseTarget(this);
		this._actionManager && this._actionManager.pauseTarget(this);
		cg.eventManager.pauseTarget(this);
	},
	grid: null,
	ctor: function() {
		this._initNode();
	},
	visit: function(ctx) {
		var _t = this;
		if (!_t._visible)
			return;

		var context = ctx || cg._renderContext,
			i;
		var children = _t._children,
			child;
		context.save();
		//_t.transform(context);
		var len = children.length;
		if (len > 0) {
			_t.sortAllChildren();
			for (i = 0; i < len; i++) {
				child = children[i];
				if (child._localZOrder < 0)
					child.visit(context);
				else
					break;
			}
			_t.draw(context);
			for (; i < len; i++) {
				children[i].visit(context);
			}
		} else
			_t.draw(context);

		_t.arrivalOrder = 0;
		context.restore();
	},
	transform: null,
	getCamera: function() {
		this._camera || (this._camera = new cg.Camera);
		return this._camera;
	},

    _getBoundingBoxToCurrentNode: function (parentTransform) {
        var rect = cg.rect(0, 0, this._contentSize.width, this._contentSize.height);

        if (!this._children)
            return rect;

        var locChildren = this._children;
        for (var i = 0; i < locChildren.length; i++) {
            var child = locChildren[i];
            if (child && child._visible) {
                var childRect = child._getBoundingBoxToCurrentNode(trans);
                if (childRect)
                    rect = cg.rectUnion(rect, childRect);
            }
        }
        return rect;
    },
	getGrid: function() {
		return this.grid;
	},
	setGrid: function(a) {
		this.grid = a;
	},
	getOpacity: function() {
		return this._realOpacity;
	},
	getDisplayedOpacity: function() {
		return this._displayedOpacity;
	},
	setOpacity: function(opacity) {
		this._displayedOpacity = this._realOpacity = opacity;

		var parentOpacity = 255,
			locParent = this._parent;
		if (locParent && locParent.cascadeOpacity)
			parentOpacity = locParent.getDisplayedOpacity();
		this.updateDisplayedOpacity(parentOpacity);

		this._displayedColor.a = this._realColor.a = opacity;
	},
	updateDisplayedOpacity: function(parentOpacity) {
		this._displayedOpacity = this._realOpacity * parentOpacity / 255.0;
		if (this._cascadeOpacityEnabled) {
			var selChildren = this._children;
			for (var i = 0; i < selChildren.length; i++) {
				var item = selChildren[i];
				if (item)
					item.updateDisplayedOpacity(this._displayedOpacity);
			}
		}
	},
	isCascadeOpacityEnabled: function() {
		return this._cascadeOpacityEnabled
	},
	setCascadeOpacityEnabled: function(a) {
		this._cascadeOpacityEnabled !== a && (this._cascadeOpacityEnabled = a, this._renderCmd.setCascadeOpacityEnabledDirty())
	},
	getColor: function() {
		var locRealColor = this._realColor;
		return cg.color(locRealColor.r, locRealColor.g, locRealColor.b, locRealColor.a);
	},
	getDisplayedColor: function() {
		var tmpColor = this._displayedColor;
		return cg.color(tmpColor.r, tmpColor.g, tmpColor.b, tmpColor.a);
	},
	setColor: function(color) {
		var locDisplayedColor = this._displayedColor,
			locRealColor = this._realColor;
		locDisplayedColor.r = locRealColor.r = color.r;
		locDisplayedColor.g = locRealColor.g = color.g;
		locDisplayedColor.b = locRealColor.b = color.b;

		var parentColor, locParent = this._parent;
		if (locParent && locParent.cascadeColor)
			parentColor = locParent.getDisplayedColor();
		else
			parentColor = cg.color(255, 255, 255);
		this.updateDisplayedColor(parentColor);
	},
	updateDisplayedColor: function(parentColor) {
		var locDispColor = this._displayedColor,
			locRealColor = this._realColor;
		locDispColor.r = 0 | (locRealColor.r * parentColor.r / 255.0);
		locDispColor.g = 0 | (locRealColor.g * parentColor.g / 255.0);
		locDispColor.b = 0 | (locRealColor.b * parentColor.b / 255.0);

		if (this._cascadeColorEnabled) {
			var selChildren = this._children;
			for (var i = 0; i < selChildren.length; i++) {
				var item = selChildren[i];
				if (item)
					item.updateDisplayedColor(locDispColor);
			}
		}
	},
	isCascadeColorEnabled: function() {
		return this._cascadeColorEnabled
	},
	setCascadeColorEnabled: function(a) {
		this._cascadeColorEnabled !== a && (this._cascadeColorEnabled = a, this._renderCmd.setCascadeColorEnabledDirty())
	},
	setOpacityModifyRGB: function(a) {},
	isOpacityModifyRGB: function() {
		return !1
	}
});

cg.Node.create = function() {
	return new cg.Node();
};