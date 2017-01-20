var cg = cg || {};
/********************************************
 *                事件管理器部分
 *******************************************/
cg._EventListenerVector = cg.Class.extend({
	_fixedListeners: null,
	_sceneGraphListeners: null,
	gt0Index: 0,

	ctor: function() {
		this._fixedListeners = [];
		this._sceneGraphListeners = [];
	},

	size: function() {
		return this._fixedListeners.length + this._sceneGraphListeners.length;
	},

	empty: function() {
		return (this._fixedListeners.length === 0) && (this._sceneGraphListeners.length === 0);
	},

	push: function(listener) {
		if (listener._getFixedPriority() == 0)
			this._sceneGraphListeners.push(listener);
		else
			this._fixedListeners.push(listener);
	},

	clearSceneGraphListeners: function() {
		this._sceneGraphListeners.length = 0;
	},

	clearFixedListeners: function() {
		this._fixedListeners.length = 0;
	},

	clear: function() {
		this._sceneGraphListeners.length = 0;
		this._fixedListeners.length = 0;
	},

	getFixedPriorityListeners: function() {
		return this._fixedListeners;
	},

	getSceneGraphPriorityListeners: function() {
		return this._sceneGraphListeners;
	}
});

cg.__getListenerID = function(event) {
	var eventType = cg.Event,
		getType = event.getType();

	if (getType === eventType.BEFORE_UPATE)
		return cg._EventListenerBeforeUpdate.LISTENER_ID;
	if (getType === eventType.AFTER_UPATE)
		return cg._EventListenerAfterUpdate.LISTENER_ID;
	if (getType === eventType.AFTER_DRAW)
		return cg._EventListenerAfterDraw.LISTENER_ID;
	if (getType === eventType.ACCELERATION)
		return cg._EventListenerAcceleration.LISTENER_ID;
	if (getType === eventType.CUSTOM)
		return event.getEventName();
	if (getType === eventType.KEYBOARD)
		return cg._EventListenerKeyboard.LISTENER_ID;
	if (getType === eventType.MOUSE)
		return cg._EventListenerMouse.LISTENER_ID;
	if (getType === eventType.TOUCH) {
		cg.log(cg._LogInfos.__getListenerID);
	}
	return "";
};
cg.eventManager = {
	//事件监听顺序混乱标签
	DIRTY_NONE: 0,
	DIRTY_FIXED_PRIORITY: 1 << 0,
	DIRTY_SCENE_GRAPH_PRIORITY: 1 << 1,
	DIRTY_ALL: 3,

	_listenersMap: {},
	_priorityDirtyFlagMap: {},
	_nodeListenersMap: {},
	_nodePriorityMap: {},
	_globalZOrderNodeMap: {},
	_toAddedListeners: [],
	_dirtyNodes: [],
	_inDispatch: 0,
	_isEnabled: false,
	_nodePriorityIndex: 0,


	// _internalCustomListenerIDs: [cg.game.EVENT_HIDE, cg.game.EVENT_SHOW],

	_setDirtyForNode: function(node) {
		if (this._nodeListenersMap[node.__instanceId] != null)
			this._dirtyNodes.push(node);
		var _children = node.getChildren();
		for (var i = 0, len = _children.length; i < len; i++)
			this._setDirtyForNode(_children[i]);
	},

	/**
	 * 暂停当前节点的所有事件
	 * @param {cg.Node} node
	 * @param {Boolean} [recursive=false]
	 */
	pauseTarget: function(node, recursive) {
		var listeners = this._nodeListenersMap[node.__instanceId],
			i, len;
		if (listeners) {
			for (i = 0, len = listeners.length; i < len; i++)
				listeners[i]._setPaused(true);
		}
		if (recursive === true) {
			var locChildren = node.getChildren();
			for (i = 0, len = locChildren.length; i < len; i++)
				this.pauseTarget(locChildren[i], true);
		}
	},

	/**
	 * 恢复当前节点的所有事件
	 * @param {cg.Node} node
	 * @param {Boolean} [recursive=false]
	 */
	resumeTarget: function(node, recursive) {
		var listeners = this._nodeListenersMap[node.__instanceId],
			i, len;
		if (listeners) {
			for (i = 0, len = listeners.length; i < len; i++)
				listeners[i]._setPaused(false);
		}
		this._setDirtyForNode(node);
		if (recursive === true) {
			var locChildren = node.getChildren();
			for (i = 0, len = locChildren.length; i < len; i++)
				this.resumeTarget(locChildren[i], true);
		}
	},

	_addListener: function(listener) {
		if (this._inDispatch === 0)
			this._forceAddEventListener(listener);
		else
			this._toAddedListeners.push(listener);
	},

	_forceAddEventListener: function(listener) {
		var listenerID = listener._getListenerID();
		var listeners = this._listenersMap[listenerID];
		if (!listeners) {
			listeners = new cg._EventListenerVector();
			this._listenersMap[listenerID] = listeners;
		}
		listeners.push(listener);

		if (listener._getFixedPriority() == 0) {
			this._setDirty(listenerID, this.DIRTY_SCENE_GRAPH_PRIORITY);

			var node = listener._getSceneGraphPriority();
			if (node == null)
				cg.log(cg._LogInfos.eventManager__forceAddEventListener);

			this._associateNodeAndEventListener(node, listener);
			if (node.isRunning())
				this.resumeTarget(node);
		} else
			this._setDirty(listenerID, this.DIRTY_FIXED_PRIORITY);
	},

	_getListeners: function(listenerID) {
		return this._listenersMap[listenerID];
	},

	_updateDirtyFlagForSceneGraph: function() {
		if (this._dirtyNodes.length == 0)
			return;

		var locDirtyNodes = this._dirtyNodes,
			selListeners, selListener, locNodeListenersMap = this._nodeListenersMap;
		for (var i = 0, len = locDirtyNodes.length; i < len; i++) {
			selListeners = locNodeListenersMap[locDirtyNodes[i].__instanceId];
			if (selListeners) {
				for (var j = 0, listenersLen = selListeners.length; j < listenersLen; j++) {
					selListener = selListeners[j];
					if (selListener)
						this._setDirty(selListener._getListenerID(), this.DIRTY_SCENE_GRAPH_PRIORITY);
				}
			}
		}
		this._dirtyNodes.length = 0;
	},

	//如果事件分发器正在分发事件，则将要删除的事件标记起来，下次删除
	_removeAllListenersInVector: function(listenerVector) {
		if (!listenerVector)
			return;
		var selListener;
		for (var i = 0; i < listenerVector.length;) {
			selListener = listenerVector[i];
			selListener._setRegistered(false);
			if (selListener._getSceneGraphPriority() != null) {
				this._dissociateNodeAndEventListener(selListener._getSceneGraphPriority(), selListener);
				selListener._setSceneGraphPriority(null);
			}

			if (this._inDispatch === 0)
				cg.arrayRemoveObject(listenerVector, selListener);
			else
				++i;
		}
	},

	_removeListenersForListenerID: function(listenerID) {
		var listeners = this._listenersMap[listenerID],
			i;
		if (listeners) {
			var fixedPriorityListeners = listeners.getFixedPriorityListeners();
			var sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();

			this._removeAllListenersInVector(sceneGraphPriorityListeners);
			this._removeAllListenersInVector(fixedPriorityListeners);

			delete this._priorityDirtyFlagMap[listenerID];

			if (!this._inDispatch) {
				listeners.clear();
				delete this._listenersMap[listenerID];
			}
		}

		var locToAddedListeners = this._toAddedListeners,
			listener;
		for (i = 0; i < locToAddedListeners.length;) {
			listener = locToAddedListeners[i];
			if (listener && listener._getListenerID() == listenerID)
				cg.arrayRemoveObject(locToAddedListeners, listener);
			else
				++i;
		}
	},

	_sortEventListeners: function(listenerID) {
		var dirtyFlag = this.DIRTY_NONE,
			locFlagMap = this._priorityDirtyFlagMap;
		if (locFlagMap[listenerID])
			dirtyFlag = locFlagMap[listenerID];

		if (dirtyFlag != this.DIRTY_NONE) {
			locFlagMap[listenerID] = this.DIRTY_NONE;

			if (dirtyFlag & this.DIRTY_FIXED_PRIORITY)
				this._sortListenersOfFixedPriority(listenerID);

			if (dirtyFlag & this.DIRTY_SCENE_GRAPH_PRIORITY) {
				var rootNode = cg.director.getRunningScene();
				if (rootNode)
					this._sortListenersOfSceneGraphPriority(listenerID, rootNode);
				else
					locFlagMap[listenerID] = this.DIRTY_SCENE_GRAPH_PRIORITY;
			}
		}
	},

	_sortListenersOfSceneGraphPriority: function(listenerID, rootNode) {
		var listeners = this._getListeners(listenerID);
		if (!listeners)
			return;

		var sceneGraphListener = listeners.getSceneGraphPriorityListeners();
		if (!sceneGraphListener || sceneGraphListener.length === 0)
			return;

		this._nodePriorityIndex = 0;
		this._nodePriorityMap = {};

		this._visitTarget(rootNode, true);

		listeners.getSceneGraphPriorityListeners().sort(this._sortEventListenersOfSceneGraphPriorityDes);
	},

	_sortEventListenersOfSceneGraphPriorityDes: function(l1, l2) {
		var locNodePriorityMap = cg.eventManager._nodePriorityMap;
		if (!l1 || !l2 || !l1._getSceneGraphPriority() || !l2._getSceneGraphPriority())
			return -1;
		return locNodePriorityMap[l2._getSceneGraphPriority().__instanceId] - locNodePriorityMap[l1._getSceneGraphPriority().__instanceId];
	},

	_sortListenersOfFixedPriority: function(listenerID) {
		var listeners = this._listenersMap[listenerID];
		if (!listeners)
			return;

		var fixedListeners = listeners.getFixedPriorityListeners();
		if (!fixedListeners || fixedListeners.length === 0)
			return;

		fixedListeners.sort(this._sortListenersOfFixedPriorityAsc);

		var index = 0;
		for (var len = fixedListeners.length; index < len;) {
			if (fixedListeners[index]._getFixedPriority() >= 0)
				break;
			++index;
		}
		listeners.gt0Index = index;
	},

	_sortListenersOfFixedPriorityAsc: function(l1, l2) {
		return l1._getFixedPriority() - l2._getFixedPriority();
	},

	//将被标记了的监听器删除
	//清理vector内部
	_onUpdateListeners: function(listenerID) {
		var listeners = this._listenersMap[listenerID];
		if (!listeners)
			return;

		var fixedPriorityListeners = listeners.getFixedPriorityListeners();
		var sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();
		var i, selListener;

		if (sceneGraphPriorityListeners) {
			for (i = 0; i < sceneGraphPriorityListeners.length;) {
				selListener = sceneGraphPriorityListeners[i];
				if (!selListener._isRegistered()) {
					cg.arrayRemoveObject(sceneGraphPriorityListeners, selListener);
				} else
					++i;
			}
		}

		if (fixedPriorityListeners) {
			for (i = 0; i < fixedPriorityListeners.length;) {
				selListener = fixedPriorityListeners[i];
				if (!selListener._isRegistered())
					cg.arrayRemoveObject(fixedPriorityListeners, selListener);
				else
					++i;
			}
		}

		if (sceneGraphPriorityListeners && sceneGraphPriorityListeners.length === 0)
			listeners.clearSceneGraphListeners();

		if (fixedPriorityListeners && fixedPriorityListeners.length === 0)
			listeners.clearFixedListeners();
	},

	_updateListeners: function(event) {
		var locInDispatch = this._inDispatch;
		cg.assert(locInDispatch > 0, cg._LogInfos.EventManager__updateListeners);
		if (event.getType() == cg.Event.TOUCH) {
			this._onUpdateListeners(cg._EventListenerTouchOneByOne.LISTENER_ID);
			this._onUpdateListeners(cg._EventListenerTouchAllAtOnce.LISTENER_ID);
		} else
			this._onUpdateListeners(cg.__getListenerID(event));

		if (locInDispatch > 1)
			return;

		cg.assert(locInDispatch == 1, cg._LogInfos.EventManager__updateListeners_2);

		//清理_listenersMap
		var locListenersMap = this._listenersMap,
			locPriorityDirtyFlagMap = this._priorityDirtyFlagMap;
		for (var selKey in locListenersMap) {
			if (locListenersMap[selKey].empty()) {
				delete locPriorityDirtyFlagMap[selKey];
				delete locListenersMap[selKey];
			}
		}

		//将上帧需要添加的事件添加
		var locToAddedListeners = this._toAddedListeners;
		if (locToAddedListeners.length !== 0) {
			for (var i = 0, len = locToAddedListeners.length; i < len; i++)
				this._forceAddEventListener(locToAddedListeners[i]);
			this._toAddedListeners.length = 0;
		}
	},

	_onTouchEventCallback: function(listener, argsObj) {
		if (!listener._isRegistered)
			return false;

		var event = argsObj.event,
			selTouch = argsObj.selTouch;
		event._setCurrentTarget(listener._node);

		var isClaimed = false,
			removedIdx;
		var getCode = event.getEventCode(),
			eventCode = cg.EventTouch.EventCode;
		if (getCode == eventCode.BEGAN) {
			if (listener.onTouchBegan) {
				isClaimed = listener.onTouchBegan(selTouch, event);
				if (isClaimed && listener._registered)
					listener._claimedTouches.push(selTouch);
			}
		} else if (listener._claimedTouches.length > 0 && ((removedIdx = listener._claimedTouches.indexOf(selTouch)) != -1)) {
			isClaimed = true;
			if (getCode === eventCode.MOVED && listener.onTouchMoved) {
				listener.onTouchMoved(selTouch, event);
			} else if (getCode === eventCode.ENDED) {
				if (listener.onTouchEnded)
					listener.onTouchEnded(selTouch, event);
				if (listener._registered)
					listener._claimedTouches.splice(removedIdx, 1);
			} else if (getCode === eventCode.CANCELLED) {
				if (listener.onTouchCancelled)
					listener.onTouchCancelled(selTouch, event);
				if (listener._registered)
					listener._claimedTouches.splice(removedIdx, 1);
			}
		}

		if (event.isStopped()) {
			cg.eventManager._updateListeners(event);
			return true;
		}

		if (isClaimed && listener._registered && listener.swallowTouches) {
			if (argsObj.needsMutableSet)
				argsObj.touches.splice(selTouch, 1);
			return true;
		}
		return false;
	},

	_dispatchTouchEvent: function(event) {
		this._sortEventListeners(cg._EventListenerTouchOneByOne.LISTENER_ID);
		this._sortEventListeners(cg._EventListenerTouchAllAtOnce.LISTENER_ID);

		var oneByOneListeners = this._getListeners(cg._EventListenerTouchOneByOne.LISTENER_ID);
		var allAtOnceListeners = this._getListeners(cg._EventListenerTouchAllAtOnce.LISTENER_ID);

		if (null == oneByOneListeners && null == allAtOnceListeners)
			return;

		var originalTouches = event.getTouches(),
			mutableTouches = cg.copyArray(originalTouches);
		var oneByOneArgsObj = {
			event: event,
			needsMutableSet: (oneByOneListeners && allAtOnceListeners),
			touches: mutableTouches,
			selTouch: null
		};

		if (oneByOneListeners) {
			for (var i = 0; i < originalTouches.length; i++) {
				oneByOneArgsObj.selTouch = originalTouches[i];
				this._dispatchEventToListeners(oneByOneListeners, this._onTouchEventCallback, oneByOneArgsObj);
				if (event.isStopped())
					return;
			}
		}

		if (allAtOnceListeners && mutableTouches.length > 0) {
			this._dispatchEventToListeners(allAtOnceListeners, this._onTouchesEventCallback, {
				event: event,
				touches: mutableTouches
			});
			if (event.isStopped())
				return;
		}
		this._updateListeners(event);
	},

	_onTouchesEventCallback: function(listener, callbackParams) {
		if (!listener._registered)
			return false;

		var eventCode = cg.EventTouch.EventCode,
			event = callbackParams.event,
			touches = callbackParams.touches,
			getCode = event.getEventCode();
		event._setCurrentTarget(listener._node);
		if (getCode == eventCode.BEGAN && listener.onTouchesBegan)
			listener.onTouchesBegan(touches, event);
		else if (getCode == eventCode.MOVED && listener.onTouchesMoved)
			listener.onTouchesMoved(touches, event);
		else if (getCode == eventCode.ENDED && listener.onTouchesEnded)
			listener.onTouchesEnded(touches, event);
		else if (getCode == eventCode.CANCELLED && listener.onTouchesCancelled)
			listener.onTouchesCancelled(touches, event);

		if (event.isStopped()) {
			cg.eventManager._updateListeners(event);
			return true;
		}
		return false;
	},

	_associateNodeAndEventListener: function(node, listener) {
		var listeners = this._nodeListenersMap[node.__instanceId];
		if (!listeners) {
			listeners = [];
			this._nodeListenersMap[node.__instanceId] = listeners;
		}
		listeners.push(listener);
	},

	_dissociateNodeAndEventListener: function(node, listener) {
		var listeners = this._nodeListenersMap[node.__instanceId];
		if (listeners) {
			cg.arrayRemoveObject(listeners, listener);
			if (listeners.length === 0)
				delete this._nodeListenersMap[node.__instanceId];
		}
	},

	_dispatchEventToListeners: function(listeners, onEvent, eventOrArgs) {
		var shouldStopPropagation = false;
		var fixedPriorityListeners = listeners.getFixedPriorityListeners();
		var sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();

		var i = 0,
			j, selListener;
		if (fixedPriorityListeners) {
			if (fixedPriorityListeners.length !== 0) {
				for (; i < listeners.gt0Index; ++i) {
					selListener = fixedPriorityListeners[i];
					if (selListener.isEnabled() && !selListener._isPaused() && selListener._isRegistered() && onEvent(selListener, eventOrArgs)) {
						shouldStopPropagation = true;
						break;
					}
				}
			}
		}

		if (sceneGraphPriorityListeners && !shouldStopPropagation) {
			for (j = 0; j < sceneGraphPriorityListeners.length; j++) {
				selListener = sceneGraphPriorityListeners[j];
				if (selListener.isEnabled() && !selListener._isPaused() && selListener._isRegistered() && onEvent(selListener, eventOrArgs)) {
					shouldStopPropagation = true;
					break;
				}
			}
		}

		if (fixedPriorityListeners && !shouldStopPropagation) {
			for (; i < fixedPriorityListeners.length; ++i) {
				selListener = fixedPriorityListeners[i];
				if (selListener.isEnabled() && !selListener._isPaused() && selListener._isRegistered() && onEvent(selListener, eventOrArgs)) {
					shouldStopPropagation = true;
					break;
				}
			}
		}
	},

	_setDirty: function(listenerID, flag) {
		var locDirtyFlagMap = this._priorityDirtyFlagMap;
		if (locDirtyFlagMap[listenerID] == null)
			locDirtyFlagMap[listenerID] = flag;
		else
			locDirtyFlagMap[listenerID] = flag | locDirtyFlagMap[listenerID];
	},

	_visitTarget: function(node, isRootNode) {
		var children = node.getChildren(),
			i = 0;
		var childrenCount = children.length,
			locGlobalZOrderNodeMap = this._globalZOrderNodeMap,
			locNodeListenersMap = this._nodeListenersMap;

		if (childrenCount > 0) {
			var child;
			for (; i < childrenCount; i++) {
				child = children[i];
				if (child && child.getLocalZOrder() < 0)
					this._visitTarget(child, false);
				else
					break;
			}

			if (locNodeListenersMap[node.__instanceId] != null) {
				if (!locGlobalZOrderNodeMap[node.getGlobalZOrder()])
					locGlobalZOrderNodeMap[node.getGlobalZOrder()] = [];
				locGlobalZOrderNodeMap[node.getGlobalZOrder()].push(node.__instanceId);
			}

			for (; i < childrenCount; i++) {
				child = children[i];
				if (child)
					this._visitTarget(child, false);
			}
		} else {
			if (locNodeListenersMap[node.__instanceId] != null) {
				if (!locGlobalZOrderNodeMap[node.getGlobalZOrder()])
					locGlobalZOrderNodeMap[node.getGlobalZOrder()] = [];
				locGlobalZOrderNodeMap[node.getGlobalZOrder()].push(node.__instanceId);
			}
		}

		if (isRootNode) {
			var globalZOrders = [];
			for (var selKey in locGlobalZOrderNodeMap)
				globalZOrders.push(selKey);

			globalZOrders.sort(this._sortNumberAsc);

			var zOrdersLen = globalZOrders.length,
				selZOrders, j, locNodePriorityMap = this._nodePriorityMap;
			for (i = 0; i < zOrdersLen; i++) {
				selZOrders = locGlobalZOrderNodeMap[globalZOrders[i]];
				for (j = 0; j < selZOrders.length; j++)
					locNodePriorityMap[selZOrders[j]] = ++this._nodePriorityIndex;
			}
			this._globalZOrderNodeMap = {};
		}
	},

	_sortNumberAsc: function(a, b) {
		return a - b;
	},

	/**
	 * 添加监听器
	 * @param {cg.EventListener|Object} listener 事件监听器对象或者配置对象
	 * @param {cg.Node|Number} nodeOrPriority 监听器绑定的节点或者优先级
	 */
	addListener: function(listener, nodeOrPriority) {
		cg.assert(listener && nodeOrPriority, cg._LogInfos.eventManager_addListener_2);
		if (!(listener instanceof cg.EventListener)) {
			cg.assert(!cg.isNumber(nodeOrPriority), cg._LogInfos.eventManager_addListener_3);
			listener = cg.EventListener.create(listener);
		} else {
			if (listener._isRegistered()) {
				cg.log(cg._LogInfos.eventManager_addListener_4);
				return;
			}
		}

		if (!listener.checkAvailable())
			return;

		if (cg.isNumber(nodeOrPriority)) {
			if (nodeOrPriority == 0) {
				cg.log(cg._LogInfos.eventManager_addListener);
				return;
			}

			listener._setSceneGraphPriority(null);
			listener._setFixedPriority(nodeOrPriority);
			listener._setRegistered(true);
			listener._setPaused(false);
			this._addListener(listener);
		} else {
			listener._setSceneGraphPriority(nodeOrPriority);
			listener._setFixedPriority(0);
			listener._setRegistered(true);
			this._addListener(listener);
		}
	},

	/**
	 * 添加用户指定的监听器，优先级默认为0
	 * @param {string} eventName
	 * @param {function} callback
	 * @return {cg.EventListener}
	 */
	addCustomListener: function(eventName, callback) {
		var listener = cg._EventListenerCustom.create(eventName, callback);
		this.addListener(listener, 1);
		return listener;
	},

	/**
	 * 删除监听器
	 * @param {cg.EventListener} 一个监听器或游戏节点
	 */
	removeListener: function(listener) {
		if (listener == null)
			return;

		var isFound, locListener = this._listenersMap;
		for (var selKey in locListener) {
			var listeners = locListener[selKey];
			var fixedPriorityListeners = listeners.getFixedPriorityListeners(),
				sceneGraphPriorityListeners = listeners.getSceneGraphPriorityListeners();

			isFound = this._removeListenerInVector(sceneGraphPriorityListeners, listener);
			if (isFound) {
				this._setDirty(listener._getListenerID(), this.DIRTY_SCENE_GRAPH_PRIORITY);
			} else {
				isFound = this._removeListenerInVector(fixedPriorityListeners, listener);
				if (isFound)
					this._setDirty(listener._getListenerID(), this.DIRTY_FIXED_PRIORITY);
			}

			if (listeners.empty()) {
				delete this._priorityDirtyFlagMap[listener._getListenerID()];
				delete locListener[selKey];
			}

			if (isFound)
				break;
		}

		if (!isFound) {
			var locToAddedListeners = this._toAddedListeners;
			for (var i = 0, len = locToAddedListeners.length; i < len; i++) {
				var selListener = locToAddedListeners[i];
				if (selListener == listener) {
					cg.arrayRemoveObject(locToAddedListeners, selListener);
					break;
				}
			}
		}
	},

	_removeListenerInVector: function(listeners, listener) {
		if (listeners == null)
			return false;

		for (var i = 0, len = listeners.length; i < len; i++) {
			var selListener = listeners[i];
			if (selListener == listener) {
				selListener._setRegistered(false);
				if (selListener._getSceneGraphPriority() != null) {
					this._dissociateNodeAndEventListener(selListener._getSceneGraphPriority(), selListener);
					selListener._setSceneGraphPriority(null);
				}

				if (this._inDispatch == 0)
					cg.arrayRemoveObject(listeners, selListener);
				return true;
			}
		}
		return false;
	},

	/**
	 * 删除相同事件类型或者同一个节点下的监听器
	 * @param {Number|cg.Node} listenerType 监听器类型或者节点
	 * @param {Boolean} [recursive=false]
	 */
	removeListeners: function(listenerType, recursive) {
		var _t = this;
		if (listenerType instanceof cg.Node) {
			delete _t._nodePriorityMap[listenerType.__instanceId];
			cg.arrayRemoveObject(_t._dirtyNodes, listenerType);
			var listeners = _t._nodeListenersMap[listenerType.__instanceId],
				i;
			if (listeners) {
				var listenersCopy = cg.copyArray(listeners);
				for (i = 0; i < listenersCopy.length; i++)
					_t.removeListener(listenersCopy[i]);
				listenersCopy.length = 0;
			}

			var locToAddedListeners = _t._toAddedListeners;
			for (i = 0; i < locToAddedListeners.length;) {
				var listener = locToAddedListeners[i];
				if (listener._getSceneGraphPriority() == listenerType) {
					listener._setSceneGraphPriority(null);
					listener._setRegistered(false);
					locToAddedListeners.splice(i, 1);
				} else
					++i;
			}

			if (recursive === true) {
				var locChildren = listenerType.getChildren(),
					len;
				for (i = 0, len = locChildren.length; i < len; i++)
					_t.removeListeners(locChildren[i], true);
			}
		} else {
			if (listenerType == cg.EventListener.TOUCH_ONE_BY_ONE)
				_t._removeListenersForListenerID(cg._EventListenerTouchOneByOne.LISTENER_ID);
			else if (listenerType == cg.EventListener.TOUCH_ALL_AT_ONCE)
				_t._removeListenersForListenerID(cg._EventListenerTouchAllAtOnce.LISTENER_ID);
			else if (listenerType == cg.EventListener.MOUSE)
				_t._removeListenersForListenerID(cg._EventListenerMouse.LISTENER_ID);
			else if (listenerType == cg.EventListener.ACCELERATION)
				_t._removeListenersForListenerID(cg._EventListenerAcceleration.LISTENER_ID);
			else if (listenerType == cg.EventListener.KEYBOARD)
				_t._removeListenersForListenerID(cg._EventListenerKeyboard.LISTENER_ID);
			else if (listenerType == cg.EventListener.EVENT_BEFORE_UPATE)
				_t._removeListenersForListenerID(cg._EventListenerBeforeUpdate.LISTENER_ID);
			else if (listenerType == cg.EventListener.EVENT_AFTER_UPATE)
				_t._removeListenersForListenerID(cg._EventListenerAfterUpdate.LISTENER_ID);
			else if (listenerType == cg.EventListener.EVENT_AFTER_DRAW)
				_t._removeListenersForListenerID(cg._EventListenerAfterDraw.LISTENER_ID);
			else
				cg.log(cg._LogInfos.eventManager_removeListeners);
		}
	},

	/**
	 * 删除用户自定义监听器
	 * @param {string} customEventName
	 */
	removeCustomListeners: function(customEventName) {
		this._removeListenersForListenerID(customEventName);
	},

	/**
	 * 删除所有监听器
	 */
	removeAllListeners: function() {
		var locListeners = this._listenersMap;
		for (var selKey in locListeners) {
			this._removeListenersForListenerID(selKey);
		}
	},

	/**
	 * 设置监听器的优先级
	 * @param {cg.EventListener} listener
	 * @param {Number} fixedPriority
	 */
	setPriority: function(listener, fixedPriority) {
		if (listener == null)
			return;

		var locListeners = this._listenersMap;
		for (var selKey in locListeners) {
			var selListeners = locListeners[selKey];
			var fixedPriorityListeners = selListeners.getFixedPriorityListeners();
			if (fixedPriorityListeners) {
				var found = fixedPriorityListeners.indexOf(listener);
				if (found != -1) {
					if (listener._getSceneGraphPriority() != null)
						cg.log(cg._LogInfos.eventManager_setPriority);
					if (listener._getFixedPriority() !== fixedPriority) {
						listener._setFixedPriority(fixedPriority);
						this._setDirty(listener._getListenerID(), this.DIRTY_FIXED_PRIORITY);
					}
					return;
				}
			}
		}
	},

	/**
	 * 是否能分发事件
	 * @param {boolean} enabled
	 */
	setEnabled: function(enabled) {
		this._isEnabled = enabled;
	},

	/**
	 * 检查能否分发事件
	 * @returns {boolean}
	 */
	isEnabled: function() {
		return this._isEnabled;
	},

	/**
	 * 分发事件
	 * @param {cg.Event} event
	 */
	dispatchEvent: function(event) {
		if (!this._isEnabled)
			return;

		this._updateDirtyFlagForSceneGraph();
		this._inDispatch++;
		if (!event || !event.getType)
			throw "event is undefined";
		if (event.getType() == cg.Event.TOUCH) {
			this._dispatchTouchEvent(event);
			this._inDispatch--;
			return;
		}
		var listenerID = cg.__getListenerID(event);
		this._sortEventListeners(listenerID);
		var selListeners = this._listenersMap[listenerID];
		if (selListeners != null)
			this._dispatchEventToListeners(selListeners, this._onListenerCallback, event);

		this._updateListeners(event);
		this._inDispatch--;
	},

	_onListenerCallback: function(listener, event) {
		event._setCurrentTarget(listener._getSceneGraphPriority());
		listener._onEvent(event);
		return event.isStopped();
	},

	/**
	 * 分发用户事件，带有用户数据
	 * @param {string} eventName
	 * @param {*} optionalUserData
	 */
	dispatchCustomEvent: function(eventName, optionalUserData) {
		var ev = new cg.EventCustom(eventName);
		ev.setUserData(optionalUserData);
		this.dispatchEvent(ev);
	}
};