var cg = cg || {};
/********************************************
 *                游戏工具部分
 *******************************************/
cg.newElement = function(ele) {
	return document.createElement(ele)
};
cg.each = function(obj, func, _this) {
	if (obj)
		if (obj instanceof Array)
			for (var i = 0, len = obj.length; i < len && !1 !== func.call(_this, obj[i], i); i++);
		else
			for (i in obj)
				if (!1 === func.call(_this, obj[i], i)) break
};
cg.extend = function(subObj) {
	var parObjs = 2 <= arguments.length ? Array.prototype.slice.call(arguments, 1) : [];
	cg.each(parObjs, function(parObj) {
		for (var attr in parObj) parObj.hasOwnProperty(attr) && (subObj[attr] = parObj[attr])
	});
	return subObj;
};
cg.isFunction = function(a) {
	return "function" == typeof a
};
cg.isNumber = function(a) {
	return "number" == typeof a || "[object Number]" == Object.prototype.toString.call(a)
};
cg.isString = function(a) {
	return "string" == typeof a || "[object String]" == Object.prototype.toString.call(a)
};
cg.isArray = function(a) {
	return "[object Array]" == Object.prototype.toString.call(a)
};
cg.isUndefined = function(a) {
	return "undefined" == typeof a
};
cg.isObject = function(a) {
	var b = typeof a;
	return "function" == b || a && "object" == b
};
cg.isCrossOrigin = function(a) {
	if (!a) return cg.log("invalid URL"), !1;
	var b = a.indexOf("://");
	if (-1 == b) return !1;
	b = a.indexOf("/", b + 3);
	return (-1 == b ? a : a.substring(0, b)) != location.origin
};
cg.arrayRemoveObject = function(a, b) {
	for (var c = 0, d = a.length; c < d; c++)
		if (a[c] == b) {
			a.splice(c, 1);
			break
		}
};
cg.arrayRemoveArray = function(a, b) {
	for (var c = 0, d = b.length; c < d; c++) cg.arrayRemoveObject(a, b[c])
};
cg.arrayAppendObjectsToIndex = function(a, b, c) {
	a.splice.apply(a, [c, 0].concat(b));
	return a
};
cg.copyArray = function(a) {
	var b, c = a.length,
		d = Array(c);
	for (b = 0; b < c; b += 1) d[b] = a[b];
	return d
};
cg.formatStr = function() {
	var a = arguments,
		b = a.length;
	if (1 > b) return "";
	var c = a[0],
		d = !0;
	"object" == typeof c && (d = !1);
	for (var e = 1; e < b; ++e) {
		var f = a[e];
		if (d)
			for (;;) {
				var g = null;
				if ("number" == typeof f && (g = c.match(/(%d)|(%s)/))) {
					c = c.replace(/(%d)|(%s)/, f);
					break
				}
				c = (g = c.match(/%s/)) ? c.replace(/%s/, f) : c + ("    " + f);
				break
			} else c += "    " + f
	}
	return c
};
cg.REPEAT_FOREVER = Number.MAX_VALUE - 1;
cg.ITEM_SIZE = 32;
cg.NORMAL_TAG = 8801;
cg.SELECTED_TAG = 8802;
cg.DISABLE_TAG = 8803;
/********************************************
 *                游戏日志工具部分
 *******************************************/
cg._LogInfos = {
	__getListenerID : '无法获取Touch事件类型',
	LoadImgResource : '非法的资源类型',
	LoadImgResource2 : '非法的回调函数',
	ActionSetTarget: '非法的target参数',
	ActionSetNode: '非法的node参数',
	GetActionByTag: 'GetActionByTag TODO'
	ActionMoveToUpdate: '目标anction无法获取对应的节点',
	AnimateManagerAddAnimation: '添加的帧动画必须是cg.Animation类型',
	AnimateManagerAddAnimation: '添加的帧动画的节点必须是cg.Node',
	RenderConstructor: '无法获取到画布',
	Scheduler_scheduleCallbackForTarget: "CGSheduler#scheduleCallback. Callback 已存在",
	Scheduler_scheduleCallbackForTarget_2: "cg.scheduler.scheduleCallbackForTarget(): callback_fn不应该为空",
	Scheduler_scheduleCallbackForTarget_3: "cg.scheduler.scheduleCallbackForTarget(): target不应该为空",
	Node_getRotation: "RotationX !\x3d RotationY，返回RotationX",
	Node_getScale: "ScaleX !\x3d ScaleY，返回ScaleX",
	Node_addChild_3: "child 不能为空",
	Node_removeChildByTag: "参数不是合法的tag",
	Node_removeChildByTag_2: "无法找到目标tag",
	Node_stopActionByTag: "cg.Node.stopActionBy(): tag参数不合法",
	Node_getActionByTag: "cg.Node.getActionByTag(): tag参数不合法",
	Node_reorderChild: "child 不能为空",
	Node_runAction: "cg.Node.runAction(): action 不能为空",
	Node_schedule: "回调函数不能为空",
	Node_schedule_2: "interval必须为正",
	EventListener_create: "无效参数",
	eventManager__forceAddEventListener: "无效的场景优先节点!",
	eventManager_addListener: "优先级0是被禁止的，因为优先级0是节点优先监听器的保留优先级",
	eventManager_removeListeners: "非法的监听器类型!",
	eventManager_addListener_2: "非法的参数",
	eventManager_addListener_3: "当添加优先级监听器时，参数必须是监听器对象",
	eventManager_addListener_4: "该监听器已经被注册过了",
	EventManager__updateListeners: "如果进入这里，则事件分发器正在分发事件",
	EventManager__updateListeners_2: "_inDispatch 的值应为 1"
};
cg.log = function() {
	return console.log.apply(console, arguments);
};
cg.warn = function() {
	cg.log("WARN :  " + cg.formatStr.apply(cg, arguments));
}
cg.error = function(){
	cg.log("ERROR :  " + cg.formatStr.apply(cg, arguments));
};
cg.assert = function(a, b) {
if (!a && b) {
	for (var f = 2; f < arguments.length; f++) b = b.replace(/(%s)|(%d)/, cg._formatString(arguments[f]));
	cg.log("Assert: " + b)
};

(function() {
	// Private array of chars to use
	var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

	cg.uuid = function(len, radix) {
		var chars = CHARS,
			uuid = [],
			i;
		radix = radix || chars.length;

		if (len) {
			// Compact form
			for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
		} else {
			// rfc4122, version 4 form
			var r;

			// rfc4122 requires these characters
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';

			// Fill in random data.  At i==19 set the high bits of clock sequence as
			// per rfc4122, sec. 4.1.5
			for (i = 0; i < 36; i++) {
				if (!uuid[i]) {
					r = 0 | Math.random() * 16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}

		return uuid.join('');
	};

	// A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
	// by minimizing calls to random()
	cg.uuidFast = function() {
		var chars = CHARS,
			uuid = new Array(36),
			rnd = 0,
			r;
		for (var i = 0; i < 36; i++) {
			if (i == 8 || i == 13 || i == 18 || i == 23) {
				uuid[i] = '-';
			} else if (i == 14) {
				uuid[i] = '4';
			} else {
				if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
				r = rnd & 0xf;
				rnd = rnd >> 4;
				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			}
		}
		return uuid.join('');
	};

	// A more compact, but less performant, RFC4122v4 solution:
	cg.uuidCompact = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};
})();
cg.point = function(x, y) {
	x = x || 0;
	y = y || 0;
	var point = {
		x: x,
		y: y
	};
	return point;
};
cg.p = function(a, b) {
	return void 0 == a ? {
		x: 0,
		y: 0
	} : void 0 == b ? {
		x: a.x,
		y: a.y
	} : {
		x: a,
		y: b
	}
};
cg.line = function(pointS, pointE) {
	if (!pointS.x && !pointS.y && !pointE.x && !pointE.y)
		return console.log('type error');
	var line = {
		sPoint: pointS,
		ePoint: pointE
	};
	return line;
};
cg.Size = function(a, b) {
	this.width = a || 0;
	this.height = b || 0
};
cg.size = function(a, b) {
	return void 0 === a ? {
		width: 0,
		height: 0
	} : void 0 === b ? {
		width: a.width,
		height: a.height
	} : {
		width: a,
		height: b
	}
};
cg.sizeEqualToSize = function(a, b) {
	return a && b && a.width == b.width && a.height == b.height
};
cg.Rect = function(a, b, c, d) {
	this.x = a || 0;
	this.y = b || 0;
	this.width = c || 0;
	this.height = d || 0
};
cg.rect = function(a, b, c, d) {
	return void 0 === a ? {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	} : void 0 === b ? {
		x: a.x,
		y: a.y,
		width: a.width,
		height: a.height
	} : {
		x: a,
		y: b,
		width: c,
		height: d
	}
};
cg.rectEqualToRect = function(a, b) {
	return a && b && a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
};
cg._rectEqualToZero = function(a) {
	return a && 0 === a.x && 0 === a.y && 0 === a.width && 0 === a.height
};
cg.rectContainsRect = function(a, b) {
	return a && b ? !(a.x >= b.x || a.y >= b.y || a.x + a.width <= b.x + b.width || a.y + a.height <= b.y + b.height) : !1
};
cg.rectGetMaxX = function(a) {
	return a.x + a.width
};
cg.rectGetMidX = function(a) {
	return a.x + a.width / 2
};
cg.rectGetMinX = function(a) {
	return a.x
};
cg.rectGetMaxY = function(a) {
	return a.y + a.height
};
cg.rectGetMidY = function(a) {
	return a.y + a.height / 2
};
cg.rectGetMinY = function(a) {
	return a.y
};
cg.rectContainsPoint = function(a, b) {
	return b.x >= cg.rectGetMinX(a) && b.x <= cg.rectGetMaxX(a) && b.y >= cg.rectGetMinY(a) && b.y <= cg.rectGetMaxY(a)
};
cg.rectUnion = function(a, b) {
	var c = cg.rect(0, 0, 0, 0);
	c.x = Math.min(a.x, b.x);
	c.y = Math.min(a.y, b.y);
	c.width = Math.max(a.x + a.width, b.x + b.width) - c.x;
	c.height = Math.max(a.y + a.height, b.y + b.height) - c.y;
	return c
};
cg.color = function(r, g, b, a) {
	return new cg.Color(r, g, b, a);
};
cg.Color = function(r, g, b, a) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
};
/********************************************
 *                游戏基类
 *******************************************/
var ClassManager = {
	id: (0 | (Math.random() * 998)),

	instanceId: (0 | (Math.random() * 998)),

	compileSuper: function(func, name, id) {
		//make the func to a string
		var str = func.toString();
		//find parameters
		var pstart = str.indexOf('('),
			pend = str.indexOf(')');
		var params = str.substring(pstart + 1, pend);
		params = params.trim();

		//find function body
		var bstart = str.indexOf('{'),
			bend = str.lastIndexOf('}');
		var str = str.substring(bstart + 1, bend);

		//now we have the content of the function, replace this._super
		//find this._super
		while (str.indexOf('this._super') != -1) {
			var sp = str.indexOf('this._super');
			//find the first '(' from this._super)
			var bp = str.indexOf('(', sp);

			//find if we are passing params to super
			var bbp = str.indexOf(')', bp);
			var superParams = str.substring(bp + 1, bbp);
			superParams = superParams.trim();
			var coma = superParams ? ',' : '';

			//replace this._super
			str = str.substring(0, sp) + 'ClassManager[' + id + '].' + name + '.call(this' + coma + str.substring(bp + 1);
		}
		return Function(params, str);
	},

	getNewID: function() {
		return this.id++;
	},

	getNewInstanceId: function() {
		return this.instanceId++;
	}
};
ClassManager.compileSuper.ClassManager = ClassManager;

/* Managed JavaScript Inheritance
 * Based on John Resig's Simple JavaScript Inheritance http://ejohn.org/blog/simple-javascript-inheritance/
 * MIT Licensed.
 */
(function() {
	var fnTest = /\b_super\b/;
	var config = null; //cg.game.config;
	var releaseMode = true; //config[cg.game.CONFIG_KEY.classReleaseMode];
	if (releaseMode) {
		console.log("release Mode");
	}

	/**
	 * The base Class implementation (does nothing)
	 * @class
	 */
	cg.Class = function() {};

	/**
	 * Create a new Class that inherits from this Class
	 * @static
	 * @param {object} props
	 * @return {function}
	 */
	cg.Class.extend = function(props) {
		var _super = this.prototype;

		// Instantiate a base Class (but only create the instance,
		// don't run the init constructor)
		var prototype = Object.create(_super);

		var classId = ClassManager.getNewID();
		ClassManager[classId] = _super;
		// Copy the properties over onto the new prototype. We make function
		// properties non-eumerable as this makes typeof === 'function' check
		// unnecgessary in the for...in loop used 1) for generating Class()
		// 2) for cg.clone and perhaps more. It is also required to make
		// these function properties cacheable in Carakan.
		var desc = {
			writable: true,
			enumerable: false,
			configurable: true
		};

		prototype.__instanceId = null;

		// The dummy Class constructor
		function Class() {
			this.__instanceId = ClassManager.getNewInstanceId();
			// All construction is actually done in the init method
			if (this.ctor)
				this.ctor.apply(this, arguments);
		}

		Class.id = classId;
		// desc = { writable: true, enumerable: false, configurable: true,
		//          value: XXX }; Again, we make this non-enumerable.
		desc.value = classId;
		Object.defineProperty(prototype, '__pid', desc);

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		desc.value = Class;
		Object.defineProperty(Class.prototype, 'constructor', desc);

		// Copy getter/setter
		this.__getters__ && (Class.__getters__ = cg.clone(this.__getters__));
		this.__setters__ && (Class.__setters__ = cg.clone(this.__setters__));

		for (var idx = 0, li = arguments.length; idx < li; ++idx) {
			var prop = arguments[idx];
			for (var name in prop) {
				var isFunc = (typeof prop[name] === "function");
				var override = (typeof _super[name] === "function");
				var hasSuperCall = fnTest.test(prop[name]);

				if (releaseMode && isFunc && override && hasSuperCall) {
					desc.value = ClassManager.compileSuper(prop[name], name, classId);
					Object.defineProperty(prototype, name, desc);
				} else if (isFunc && override && hasSuperCall) {
					desc.value = (function(name, fn) {
						return function() {
							var tmp = this._super;

							// Add a new ._super() method that is the same method
							// but on the super-Class
							this._super = _super[name];

							// The method only need to be bound temporarily, so we
							// remove it when we're done executing
							var ret = fn.apply(this, arguments);
							this._super = tmp;

							return ret;
						};
					})(name, prop[name]);
					Object.defineProperty(prototype, name, desc);
				} else if (isFunc) {
					desc.value = prop[name];
					Object.defineProperty(prototype, name, desc);
				} else {
					prototype[name] = prop[name];
				}

				if (isFunc) {
					// Override registered getter/setter
					var getter, setter, propertyName;
					if (this.__getters__ && this.__getters__[name]) {
						propertyName = this.__getters__[name];
						for (var i in this.__setters__) {
							if (this.__setters__[i] == propertyName) {
								setter = i;
								break;
							}
						}
						cg.defineGetterSetter(prototype, propertyName, prop[name], prop[setter] ? prop[setter] : prototype[setter], name, setter);
					}
					if (this.__setters__ && this.__setters__[name]) {
						propertyName = this.__setters__[name];
						for (var i in this.__getters__) {
							if (this.__getters__[i] == propertyName) {
								getter = i;
								break;
							}
						}
						cg.defineGetterSetter(prototype, propertyName, prop[getter] ? prop[getter] : prototype[getter], prop[name], getter, name);
					}
				}
			}
		}

		// And make this Class extendable
		Class.extend = cg.Class.extend;

		//add implementation method
		Class.implement = function(prop) {
			for (var name in prop) {
				prototype[name] = prop[name];
			}
		};
		return Class;
	};
})();

/**
 * Common getter setter configuration function
 * @function
 * @param {Object}   proto      A class prototype or an object to config<br/>
 * @param {String}   prop       Property name
 * @param {function} getter     Getter function for the property
 * @param {function} setter     Setter function for the property
 * @param {String}   getterName Name of getter function for the property
 * @param {String}   setterName Name of setter function for the property
 */
cg.defineGetterSetter = function(proto, prop, getter, setter, getterName, setterName) {
	if (proto.__defineGetter__) {
		getter && proto.__defineGetter__(prop, getter);
		setter && proto.__defineSetter__(prop, setter);
	} else if (Object.defineProperty) {
		var desc = {
			enumerable: false,
			configurable: true
		};
		getter && (desc.get = getter);
		setter && (desc.set = setter);
		Object.defineProperty(proto, prop, desc);
	} else {
		throw new Error("browser does not support getters");
	}

	if (!getterName && !setterName) {
		// Lookup getter/setter function
		var hasGetter = (getter != null),
			hasSetter = (setter != undefined),
			props = Object.getOwnPropertyNames(proto);
		for (var i = 0; i < props.length; i++) {
			var name = props[i];

			if ((proto.__lookupGetter__ ? proto.__lookupGetter__(name) : Object.getOwnPropertyDescriptor(proto, name)) || typeof proto[name] !== "function")
				continue;

			var func = proto[name];
			if (hasGetter && func === getter) {
				getterName = name;
				if (!hasSetter || setterName) break;
			}
			if (hasSetter && func === setter) {
				setterName = name;
				if (!hasGetter || getterName) break;
			}
		}
	}

	// Found getter/setter
	var ctor = proto.constructor;
	if (getterName) {
		if (!ctor.__getters__) {
			ctor.__getters__ = {};
		}
		ctor.__getters__[getterName] = prop;
	}
	if (setterName) {
		if (!ctor.__setters__) {
			ctor.__setters__ = {};
		}
		ctor.__setters__[setterName] = prop;
	}
};

/**
 * Create a new object and copy all properties in an exist object to the new object
 * @function
 * @param {object|Array} obj The source object
 * @return {Array|object} The created object
 */
cg.clone = function(obj) {
	// Cloning is better if the new object is having the same prototype chain
	// as the copied obj (or otherwise, the cloned object is certainly going to
	// have a different hidden class). Play with C1/C2 of the
	// PerformanceVirtualMachineTests suite to see how this makes an impact
	// under extreme conditions.
	//
	// Object.create(Object.getPrototypeOf(obj)) doesn't work well because the
	// prototype lacks a link to the constructor (Carakan, V8) so the new
	// object wouldn't have the hidden class that's associated with the
	// constructor (also, for whatever reasons, utilizing
	// Object.create(Object.getPrototypeOf(obj)) + Object.defineProperty is even
	// slower than the original in V8). Therefore, we call the constructor, but
	// there is a big caveat - it is possible that the this.init() in the
	// constructor would throw with no argument. It is also possible that a
	// derived class forgets to set "constructor" on the prototype. We ignore
	// these possibities for and the ultimate solution is a standardized
	// Object.clone(<object>).
	var newObj = (obj.constructor) ? new obj.constructor : {};

	// Assuming that the constuctor above initialized all properies on obj, the
	// following keyed assignments won't turn newObj into dictionary mode
	// becasue they're not *appending new properties* but *assigning existing
	// ones* (note that appending indexed properties is another story). See
	// cglass.js for a link to the devils when the assumption fails.
	for (var key in obj) {
		var copy = obj[key];
		// Beware that typeof null == "object" !
		if (((typeof copy) == "object") && copy &&
			!(copy instanceof cg.Node) && !(copy instanceof HTMLElement)) {
			newObj[key] = cg.clone(copy);
		} else {
			newObj[key] = copy;
		}
	}
	return newObj;
};
/********************************************
 *                游戏导演部分
 *******************************************/
cg.timeInfo = cg.Class.extend({
	firstTick : true,
	oldTime : 0.0,
	paused : true,
	interCount : 0,
	totalFPS : 0,
	
	/*
	函数名：getInfo
	描述：计算上次调用之后所用的时间、FPS、时间延迟等，得到的信息来保证游戏FPS看起来一致；
	参数：无；
	返回：Object*/
	getInfo : function(){
		if(firstTick === true){
			firstTick = false;
			paused = false;
			oldTime = +new Date();//时间的毫秒级 值
			return{
				elapsed : 0,
				FPS : 0,
				averageFPS : 0
				totalFPS : totalFPS
			};
		}

		
		var newTime = +new Date();	
		var elapsed = newTime - oldTime;//上一次调用后使用的时间
		oldTime = newTime;
		var FPS = 1000 / elapsed;//实际帧率
		interCount++;
		totalFPS += FPS;
		if(paused)
			return {
				elapsed : 0,
				FPS : FPS,
				averageFPS : totalFPS / interCount,
				totalFPS : totalFPS
			}
		return{
			elapsed : elapsed,
			FPS : FPS,
			averageFPS : totalFPS / interCount,
			totalFPS : totalFPS
		}
	},
	
	/*
	函数名：pause
	描述：暂停计数，即设置暂停标签，游戏中所有暂停都应调用该方法；
	参数：无；
	返回：无；*/
	pause : function(){
		paused = true;
	},

	resume : function(){
		paused = false;
	}
});
//director
cg.Director =  cg.Class.extend({
	_firstTick : true,
	_timer : null,
	_timeInfo : null,
	_currentSence : null,
	_globalFPS : 0,
	_eventStack : [],
	_stoped : true,
	_paused : true,
	_render : null,
	_scheduler : null,
	_actionManager : null,
	_eventManager : null,
	_animationManager : null,
	_eventBeforeUpate : null,
	_eventAfterUpate: null,
	_eventAfterDraw: null,

	ctor : function(globalFPS){
		this._globalFPS = globalFPS;
		this._timer = new cg.timeInfo();
		this._render = new cg.Render(cg.winSize);
		this._scheduler = new cg.Scheduler();
		this._actionManager = cg.actionManager;
		this._animationManager = cg.animateManager;
		this._eventManager = cg.eventManager;
		this._eventBeforeUpate = new cg.Event(cg.Event.BEFORE_UPATE);
		this._eventAfterUpate = new cg.Event(cg.Event.AFTER_UPATE);
		this._eventAfterDraw = new cg.Event(cg.Event.AFTER_DRAW);

	},

	getRunningScene : function(){
		return this._currentSence;
	},

	getWinSize : function(){
		return cg.winSize;
	},

	getActionManager : function(){
		return this._actionManager;
	},

	getAnimationManager : function(){
		return this._animationManager;
	},

	getEventManager : function(){
		return this._eventManager;
	},

	getScheduler : function(){
		return this._scheduler;
	},

	//游戏主循环函数
	update : function() {
		var _t = this, timeInfo = _t._timeInfo,durationTime;
		durationTime = timeInfo.elapsed;
		_t._eventManager.dispatchEvent(_t._eventBeforeUpate);
		_t._animationManager.update(durationTime);
		_t._actionManager.update(durationTime);
		_t._scheduler.update(durationTime);
		_t._eventManager.dispatchEvent(_t._eventAfterUpate);
		_t.render.draw(this._currentSence);
		_t._eventManager.dispatchEvent(_t._eventAfterDraw);
		/*  首先计算这帧到下帧的时间
			通过事件管理器通知BEFORE_UPATE事件
			更新各子系统(包含了事件处理)
			帧动画子系统
			物理子系统（i.碰撞系统）
			通过事件管理器通知AFTER_UPATE事件
			清空画布
			如果需要进行场景切换
			通知渲染子系统进行绘制
			通过事件管理器通知AFTER_DRAW事件
			增加全局总帧数
			*/
		/**
		 * TODO
		 */
	},
	runScene : function(rootNode){
		this._currentSence = rootNode;
	},

	pause : function(){
		//TODO
	},

	stop : function(){
		//TODO
	},

	resume : function(){
		//TODO
	},

	run : function(){
		if(this._firstTick)
			this._isStopped = this._isPaused = this._firstTick = false;
		this._timeInfo = this._timer.getInfo();
		if(!this._isStopped && !this._isPaused)
			this.update();
		setTimeout(run,1000/this.globalFPS);
	}

});
/********************************************
 *                事件部分
 *******************************************/
cg.Event = cg.Class.extend({
	_type: 0,
	_isStopped: false,
	_currentTarget: null,

	_setCurrentTarget: function(target) {
		this._currentTarget = target;
	},

	ctor: function(type) {
		this._type = type;
	},

	/**
	 * 获取事件类型
	 * @function
	 * @returns {Number}
	 */
	getType: function() {
		return this._type;
	},

	/**
	 * 当前事件停止冒泡
	 * @function
	 */
	stopPropagation: function() {
		this._isStopped = true;
	},

	/**
	 * 当前事件是否停止冒泡
	 * @function
	 * @returns {boolean}
	 */
	isStopped: function() {
		return this._isStopped;
	},

	/**
	 * 获取当前事件冒泡位置，只有绑定在节点上的事件监听器才会有返回值，其他情况返回0
	 * @function
	 * @returns {cg.Node}  目标节点
	 */
	getCurrentTarget: function() {
		return this._currentTarget;
	}
});

//事件类型
cg.Event.TOUCH = 0;
cg.Event.KEYBOARD = 1;
cg.Event.ACCELERATION = 2;
cg.Event.MOUSE = 3;
cg.Event.CUSTOM = 4;
cg.Event.BEFORE_UPATE = 5;
cg.Event.AFTER_UPATE = 6;
cg.Event.AFTER_DRAW = 7;

//用户自定义事件
cg.EventCustom = cg.Event.extend({
	_eventName: null,
	_userData: null,

	ctor: function(eventName) {
		cg.Event.prototype.ctor.call(this, cg.Event.CUSTOM);
		this._eventName = eventName;
	},

	/**
	 * 设置事件数据
	 * @param {*} data
	 */
	setUserData: function(data) {
		this._userData = data;
	},

	/**
	 * 获取事件数据
	 * @returns {*}
	 */
	getUserData: function() {
		return this._userData;
	},

	/**
	 * 获取事件名称
	 * @returns {String}
	 */
	getEventName: function() {
		return this._eventName;
	}
});

//鼠标事件
cg.EventMouse = cg.Event.extend({
	_eventType: 0,
	_button: 0,
	_x: 0,
	_y: 0,
	_prevX: 0,
	_prevY: 0,
	_scrollX: 0,
	_scrollY: 0,

	ctor: function(eventType) {
		cg.Event.prototype.ctor.call(this, cg.Event.MOUSE);
		this._eventType = eventType;
	},

	/**
	 * 设置滚轮位置
	 * @param {number} scrollX
	 * @param {number} scrollY
	 */
	setScrollData: function(scrollX, scrollY) {
		this._scrollX = scrollX;
		this._scrollY = scrollY;
	},

	/**
	 * 获取滚轮x方向值
	 * @returns {number}
	 */
	getScrollX: function() {
		return this._scrollX;
	},

	/**
	 * 获取滚轮y方向值
	 * @returns {number}
	 */
	getScrollY: function() {
		return this._scrollY;
	},

	/**
	 * 设置鼠标位置
	 * @param {number} x
	 * @param {number} y
	 */
	setLocation: function(x, y) {
		this._x = x;
		this._y = y;
	},

	/**
	 * 获取鼠标位置
	 * @return {cg.Point} location
	 */
	getLocation: function() {
		return {
			x: this._x,
			y: this._y
		};
	},

	/**
	 * 获取鼠标在游戏场景中的位置
	 * @return {cg.Point}
	 */
	getLocationInView: function() {
		/*return {
			x: this._x,
			y: cg.view._designResolutionSize.height - this._y
		};
		*TODO
		**/
	},

	/**
	 * 设置鼠标之前的位置
	 * @param {number} x
	 * @param {number} y
	 */
	_setPrevCursor: function(x, y) {
		this._prevX = x;
		this._prevY = y;
	},

	/**
	 * 获取鼠标改变值
	 * @return {cg.Point}
	 */
	getDelta: function() {
		return {
			x: this._x - this._prevX,
			y: this._y - this._prevY
		};
	},

	/**
	 * 获取鼠标x改变值
	 * @return {Number}
	 */
	getDeltaX: function() {
		return this._x - this._prevX;
	},

	/**
	 * 获取鼠标y改变值
	 * @return {Number}
	 */
	getDeltaY: function() {
		return this._y - this._prevY;
	},

	/**
	 * 设置鼠标哪个键被点击
	 * @param {number} button
	 */
	setButton: function(button) {
		this._button = button;
	},

	/**
	 * 获取鼠标哪个键被点击
	 * @returns {number}
	 */
	getButton: function() {
		return this._button;
	},

	/**
	 * 获取鼠标x
	 * @returns {number}
	 */
	getLocationX: function() {
		return this._x;
	},

	/**
	 * 获取鼠标y
	 * @returns {number}
	 */
	getLocationY: function() {
		return this._y;
	}
});

//鼠标事件类型
cg.EventMouse.NONE = 0;
cg.EventMouse.DOWN = 1;
cg.EventMouse.UP = 2;
cg.EventMouse.MOVE = 3;
cg.EventMouse.SCROLL = 4;
cg.EventMouse.BUTTON_LEFT = 0;
cg.EventMouse.BUTTON_RIGHT = 2;
cg.EventMouse.BUTTON_MIDDLE = 1;
cg.EventMouse.BUTTON_4 = 3;
cg.EventMouse.BUTTON_5 = 4;
cg.EventMouse.BUTTON_6 = 5;
cg.EventMouse.BUTTON_7 = 6;
cg.EventMouse.BUTTON_8 = 7;

//触摸事件
cg.EventTouch = cg.Event.extend({
	_eventCode: 0,
	_touches: null,

	ctor: function(arr) {
		cg.Event.prototype.ctor.call(this, cg.Event.TOUCH);
		this._touches = arr || [];
	},

	/**
	 * 获取事件类型
	 * @returns {number}
	 */
	getEventCode: function() {
		return this._eventCode;
	},

	/**
	 * 获取触摸点
	 * @returns {Array}
	 */
	getTouches: function() {
		return this._touches;
	},

	_setEventCode: function(eventCode) {
		this._eventCode = eventCode;
	},

	_setTouches: function(touches) {
		this._touches = touches;
	}
});

//最大触摸点数
cg.EventTouch.MAX_TOUCHES = 5;

cg.EventTouch.EventCode = {
	BEGAN: 0,
	MOVED: 1,
	ENDED: 2,
	CANCELLED: 3
};
/********************************************
 *                事件监听器部分
 *******************************************/
cg.EventListener = cg.Class.extend({
	_onEvent: null, // 事件回调函数
	_type: 0,
	_listenerID: null,
	_registered: false, // 该事件是否被注册

	_fixedPriority: 0, //固定优先级
	_node: null, // 绑定到的节点
	_paused: false,
	_isEnabled: true,

	ctor: function(type, listenerID, callback) {
		this._onEvent = callback;
		this._type = type || 0;
		this._listenerID = listenerID || "";
	},

	/**
	 * 只有绑定到节点上的事件才能暂停，固定优先级的事件通过enabled来控制传递
	 * @param {boolean} paused
	 * @private
	 */
	_setPaused: function(paused) {
		this._paused = paused;
	},

	/**
	 * 检查事件是否被暂停
	 * @returns {boolean}
	 * @private
	 */
	_isPaused: function() {
		return this._paused;
	},

	/**
	 * 设置事件是否被注册
	 * @param {boolean} registered
	 * @private
	 */
	_setRegistered: function(registered) {
		this._registered = registered;
	},

	/**
	 * 检查事件是否被注册
	 * @returns {boolean}
	 * @private
	 */
	_isRegistered: function() {
		return this._registered;
	},

	/**
	 * 获取监听器类型
	 * @returns {number}
	 * @private
	 */
	_getType: function() {
		return this._type;
	},

	/**
	 *  获取监听器类型
	 * @returns {string}
	 * @private
	 */
	_getListenerID: function() {
		return this._listenerID;
	},

	/**
	 * 设置固定优先级，不能设置为0，0是为绑定节点事件专门设置的
	 * @param {number} fixedPriority
	 * @private
	 */
	_setFixedPriority: function(fixedPriority) {
		this._fixedPriority = fixedPriority;
	},

	/**
	 * 获取固定优先级
	 * @returns {number}
	 * @private
	 */
	_getFixedPriority: function() {
		return this._fixedPriority;
	},

	/**
	 * 设置事件绑定节点
	 * @param {cg.Node} node
	 * @private
	 */
	_setSceneGraphPriority: function(node) {
		this._node = node;
	},

	/**
	 * 获取事件绑定节点
	 * @returns {cg.Node}
	 * @private
	 */
	_getSceneGraphPriority: function() {
		return this._node;
	},

	/**
	 * 检查事件是否可用
	 * @returns {boolean}
	 */
	checkAvailable: function() {
		return this._onEvent != null;
	},

	/**
	 * 复制监听器，子类必须重载
	 * @returns {cg.EventListener}
	 */
	clone: function() {
		return null;
	},

	/**
	 *  设置事件是否可用
	 * @param {boolean} enabled
	 */
	setEnabled: function(enabled) {
		this._isEnabled = enabled;
	},

	/**
	 * 检查事件是否可用
	 * @returns {boolean}
	 */
	isEnabled: function() {
		return this._isEnabled;
	},
});

//事件监听器类型
cg.EventListener.UNKNOWN = 0;
cg.EventListener.TOUCH_ONE_BY_ONE = 1;
cg.EventListener.TOUCH_ALL_AT_ONCE = 2;
cg.EventListener.KEYBOARD = 3;
cg.EventListener.MOUSE = 4;
cg.EventListener.ACCELERATION = 5;
cg.EventListener.CUSTOM = 6;
cg.EventListener.EVENT_BEFORE_UPATE = 7;
cg.EventListener.EVENT_AFTER_UPATE = 8;
cg.EventListener.EVENT_AFTER_DRAW = 9;

//用户自定义类型
cg._EventListenerCustom = cg.EventListener.extend({
	_onCustomEvent: null,
	ctor: function(listenerId, callback) {
		this._onCustomEvent = callback;
		var selfPointer = this;
		var listener = function(event) {
			if (selfPointer._onCustomEvent != null)
				selfPointer._onCustomEvent(event);
		};

		cg.EventListener.prototype.ctor.call(this, cg.EventListener.CUSTOM, listenerId, listener);
	},

	checkAvailable: function() {
		return (cg.EventListener.prototype.checkAvailable.call(this) && this._onCustomEvent != null);
	},

	clone: function() {
		return new cg._EventListenerCustom(this._listenerID, this._onCustomEvent);
	}
});

cg._EventListenerCustom.create = function(eventName, callback) {
	return new cg._EventListenerCustom(eventName, callback);
};
//鼠标事件
cg._EventListenerMouse = cg.EventListener.extend({
	onMouseDown: null,
	onMouseUp: null,
	onMouseMove: null,
	onMouseScroll: null,

	ctor: function() {
		var selfPointer = this;
		var listener = function(event) {
			var eventType = cg.EventMouse;
			switch (event._eventType) {
				case eventType.DOWN:
					if (selfPointer.onMouseDown)
						selfPointer.onMouseDown(event);
					break;
				case eventType.UP:
					if (selfPointer.onMouseUp)
						selfPointer.onMouseUp(event);
					break;
				case eventType.MOVE:
					if (selfPointer.onMouseMove)
						selfPointer.onMouseMove(event);
					break;
				case eventType.SCROLL:
					if (selfPointer.onMouseScroll)
						selfPointer.onMouseScroll(event);
					break;
				default:
					break;
			}
		};
		cg.EventListener.prototype.ctor.call(this, cg.EventListener.MOUSE, cg._EventListenerMouse.LISTENER_ID, listener);
	},

	clone: function() {
		var eventListener = new cg._EventListenerMouse();
		eventListener.onMouseDown = this.onMouseDown;
		eventListener.onMouseUp = this.onMouseUp;
		eventListener.onMouseMove = this.onMouseMove;
		eventListener.onMouseScroll = this.onMouseScroll;
		return eventListener;
	},

	checkAvailable: function() {
		return true;
	}
});

cg._EventListenerMouse.LISTENER_ID = "__cg_mouse";

cg._EventListenerMouse.create = function() {
	return new cg._EventListenerMouse();
};

cg._EventListenerTouchOneByOne = cg.EventListener.extend({
	_claimedTouches: null,
	swallowTouches: false,
	onTouchBegan: null,
	onTouchMoved: null,
	onTouchEnded: null,
	onTouchCancelled: null,

	ctor: function() {
		cg.EventListener.prototype.ctor.call(this, cg.EventListener.TOUCH_ONE_BY_ONE, cg._EventListenerTouchOneByOne.LISTENER_ID, null);
		this._claimedTouches = [];
	},

	setSwallowTouches: function(needSwallow) {
		this.swallowTouches = needSwallow;
	},

	clone: function() {
		var eventListener = new cg._EventListenerTouchOneByOne();
		eventListener.onTouchBegan = this.onTouchBegan;
		eventListener.onTouchMoved = this.onTouchMoved;
		eventListener.onTouchEnded = this.onTouchEnded;
		eventListener.onTouchCancelled = this.onTouchCancelled;
		eventListener.swallowTouches = this.swallowTouches;
		return eventListener;
	},

	checkAvailable: function() {
		if (!this.onTouchBegan) {
			cg.log(cg._LogInfos._EventListenerTouchOneByOne_checkAvailable);
			return false;
		}
		return true;
	}
});

cg._EventListenerTouchOneByOne.LISTENER_ID = "__cg_touch_one_by_one";

cg._EventListenerTouchOneByOne.create = function() {
	return new cg._EventListenerTouchOneByOne();
};

cg._EventListenerTouchAllAtOnce = cg.EventListener.extend({
	onTouchesBegan: null,
	onTouchesMoved: null,
	onTouchesEnded: null,
	onTouchesCancelled: null,

	ctor: function() {
		cg.EventListener.prototype.ctor.call(this, cg.EventListener.TOUCH_ALL_AT_ONCE, cg._EventListenerTouchAllAtOnce.LISTENER_ID, null);
	},

	clone: function() {
		var eventListener = new cg._EventListenerTouchAllAtOnce();
		eventListener.onTouchesBegan = this.onTouchesBegan;
		eventListener.onTouchesMoved = this.onTouchesMoved;
		eventListener.onTouchesEnded = this.onTouchesEnded;
		eventListener.onTouchesCancelled = this.onTouchesCancelled;
		return eventListener;
	},

	checkAvailable: function() {
		if (this.onTouchesBegan == null && this.onTouchesMoved == null && this.onTouchesEnded == null && this.onTouchesCancelled == null) {
			cg.log(cg._LogInfos._EventListenerTouchAllAtOnce_checkAvailable);
			return false;
		}
		return true;
	}
});

cg._EventListenerTouchAllAtOnce.LISTENER_ID = "__cg_touch_all_at_once";

cg._EventListenerTouchAllAtOnce.create = function() {
	return new cg._EventListenerTouchAllAtOnce();
};

cg._EventListenerBeforeUpdate = cg.EventListener.extend({
	_onLoopEvent: null,
	ctor: function(callback) {
		this._onLoopEvent = callback;
		var selfPointer = this;
		var listener = function(event) {
			if (selfPointer._onLoopEvent != null)
				selfPointer._onLoopEvent(event);
		};
		cg.EventListener.prototype.ctor.call(this, cg.EventListener.EVENT_BEFORE_UPATE, cg._EventListenerBeforeUpdate.LISTENER_ID, listener);
	},
	checkAvailable: function() {
		return _onLoopEvent != null;
	}
});

cg._EventListenerBeforeUpdate.LISTENER_ID = "__cg_before_update";

cg._EventListenerBeforeUpdate.create = function() {
	return new cg._EventListenerBeforeUpdate();
};

cg._EventListenerAfterUpdate = cg.EventListener.extend({
	_onLoopEvent: null,
	ctor: function(callback) {
		this._onLoopEvent = callback;
		var selfPointer = this;
		var listener = function(event) {
			if (selfPointer._onLoopEvent != null)
				selfPointer._onLoopEvent(event);
		};
		cg.EventListener.prototype.ctor.call(this, cg.EventListener.EVENT_AFTER_UPATE, cg._EventListenerAfterUpdate.LISTENER_ID, listener);
	},
	checkAvailable: function() {
		return _onLoopEvent != null;
	}
});

cg._EventListenerAfterUpdate.LISTENER_ID = "__cg_after_update";

cg._EventListenerAfterUpdate.create = function() {
	return new cg._EventListenerAfterUpdate();
};

cg._EventListenerAfterDraw = cg.EventListener.extend({
	_onLoopEvent: null,
	ctor: function(callback) {
		this._onLoopEvent = callback;
		var selfPointer = this;
		var listener = function(event) {
			if (selfPointer._onLoopEvent != null)
				selfPointer._onLoopEvent(event);
		};
		cg.EventListener.prototype.ctor.call(this, cg.EventListener.EVENT_AFTER_DRAW, cg._EventListenerAfterDraw.LISTENER_ID, listener);
	},
	checkAvailable: function() {
		return _onLoopEvent != null;
	}
});

cg._EventListenerAfterDraw.LISTENER_ID = "__cg_after_draw";

cg._EventListenerAfterDraw.create = function() {
	return new cg._EventListenerAfterDraw();
};
/**
 * 使用json对象创建事件监听器
 * @function
 * @static
 * @param {object} argObj a json object
 * @returns {cg.EventListener}
 */
cg.EventListener.create = function(argObj) {

	cg.assert(argObj && argObj.event, cg._LogInfos.EventListener_create);

	var listenerType = argObj.event;
	delete argObj.event;
	var listener = null;
	if (listenerType === cg.EventListener.TOUCH_ONE_BY_ONE)
		listener = new cg._EventListenerTouchOneByOne();
	else if (listenerType === cg.EventListener.TOUCH_ALL_AT_ONCE)
		listener = new cg._EventListenerTouchAllAtOnce();
	else if (listenerType === cg.EventListener.MOUSE)
		listener = new cg._EventListenerMouse();
	else if (listenerType === cg.EventListener.CUSTOM) {
		listener = new cg._EventListenerCustom(argObj.eventName, argObj.callback);
		delete argObj.eventName;
		delete argObj.callback;
	} else if (listenerType === cg.EventListener.KEYBOARD)
		listener = new cg._EventListenerKeyboard();
	else if (listenerType === cg.EventListener.EVENT_BEFORE_UPATE) {
		listener = new cg._EventListenerBeforeUpdate(argObj.callback);
		delete argObj.callback;
	} else if (listenerType === cg.EventListener.EVENT_AFTER_UPATE) {
		listener = new cg._EventListenerAfterUpdate(argObj.callback);
		delete argObj.callback;
	} else if (listenerType === cg.EventListener.EVENT_AFTER_DRAW) {
		listener = new cg._EventListenerAfterDraw(argObj.callback);
		delete argObj.callback;
	}

	for (var key in argObj) {
		listener[key] = argObj[key];
	}

	return listener;
};
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
		var locListeners = this._listenersMap,
			locInternalCustomEventIDs = this._internalCustomListenerIDs;
		for (var selKey in locListeners) {
			if (locInternalCustomEventIDs.indexOf(selKey) === -1)
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

/********************************************
 *                游戏组块部分
 *******************************************/
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
	};,
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
//场景节点
cg.Scene = cg.Node.extend({
	_className: "Scene",
	ctor: function() {
		cg.Node.prototype.ctor.call(this);
		this.setContentSize(cg.director.getWinSize());
	}
});

cg.Scene.create = function() {
	return new cg.Scene();
};
//层节点
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
	};

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

cg.Sprite = cg.Node.extend({
	_texture: null,
	_textureLoader: null,
	_offsetX: 0,
	_offsetY: 0,
	_className: "Sprite",
	_loadedEventListeners:null,

	ctor : function(texture){
		this.prototype.ctor.call.(this);
		this.setTexture(texture);
	},

	setTexture: function(texture) {
		var textureId;
		if (cg.isString(texture))
			textureId = _textureLoader.loadImg(texture,this._callLoadedEventCallbacks,this);
		else
			textureId = cg.resourcesManager._pushImgResource(texture,this._callLoadedEventCallbacks,this);
		if (textureId)
			this._texture = cg.resourcesManager._getImgResource(textureId);
	},
	getTexture: function() {
		return this._texture;
	},
	setOffPoint: function(point){
		_offsetX = point.x || 0;
		_offsetY = point.y || 0;
	},
	setOffX : function(x){
		_offsetX = x || 0;
	},
	setOffY : function(y){
		_offsetY = y || 0;
	},
	draw: function(ctx) {
		var locAnchor = this._anchorPoint,
			locPoint = this._position,
			locOffY = this._offsetY,
			locOffX = this._offsetX,
			locSize = this._contentSize;
		if(_texture && _texture.readyState){
			ctx.drawImage(_texture, x||locPoint.x - locAnchor.x,y||locPoint.y - locAnchor.y,locSize.width,locSize.height,locOffX,locOffY,locSize.width,locSize.height)
		}

	},
	addLoadedEventListener:function(callback, target){
        if(!this._loadedEventListeners)
            this._loadedEventListeners = [];
        this._loadedEventListeners.push({eventCallback:callback, eventTarget:target});
    },

    _callLoadedEventCallbacks:function(){
        if(!this._loadedEventListeners)
            return;
        var locListeners = this._loadedEventListeners;
        for(var i = 0, len = locListeners.length;  i < len; i++){
            var selCallback = locListeners[i];
            selCallback.eventCallback.call(selCallback.eventTarget, this);
        }
        locListeners.length = 0;
    }

});

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

cg.resourcesManager = {
	_resourceMap: {},
	_resouceIndex: 0,
	_getImgResource: function(IdorName) {
		var locResource, targetResources = [];
		if (cg.isNumber(IdorName))
			targetResources.push(_resourceMap[IdorName]);
		else(cg.isString(IdorName)) {
			for (locResource in _resourceMap) {
				if (_resourceMap[locResource].name == IdorName || _resourceMap[locResource].readyState)
					targetResources.push(_resourceMap[locResource]);
			}
		}
		return targetResources;
	},
	_getImgByURL: function(url) {
		var locResource;
		for (locResource in _resourceMap) {
			if (_resourceMap[locResource].url == url || _resourceMap[locResource].readyState)
				return _resourceMap[locResource];
		}
		return null;
	},
	_pushImgResource: function(urlorResource, callfn, target, name) {
		var img, url = '',
			locId = _resouceIndex;
		name = name || "default_img";
		callfn = callfn || new Function();
		var existImg = _getImgByURL(urlorResource);
		if (!existImg) {
			if (cg.isString(urlorResource)) {
				img = new Image();
				url = img.src = urlorResource;
			} else if (urlorResource instanceof Image)
				img = urlorResource;
			else {
				cg.log(cg._LogInfos.PushImgResource);
				return null;
			}

			_resourceMap[locId] = {
				rid: locId,
				name: name,
				readyState: false,
				url: url,
				resource: img
			};
			_resouceIndex++;

			if (img.complete) {
				_resourceMap[locId].readyState = true;
				callfn.call(target);
				return locId;
			}
			img.onload = function() {
				_resourceMap[locId].readyState = true;
				callfn.call(target);
			};
			return locId;
		} else {
			if (existImg.readyState) {
				callfn.call(target);
				return existImg.rid;
			}
			img.onload = function() {
				existImg.readyState = true;
				callfn.call(target);
			};
			return existImg.rid;
		}
	}
}
cg.Loader = cg.Class.extend({
	ctor: function() {
		this.prototype.ctor.call(this);
	},
	loadImg: function(url, callfn, target, name) {
		var lastp = url.lastIndexOf("."),
			imgType = url.substr(lastp + 1);
		if (imgType != "jpg" && imgType != "png" && imgType != "icon") {
			cg.log(cg._LogInfos.LoadImgResource);
			return;
		}
		if (!cg.isFunction(callfn)) {
			cg.log(cg._LogInfos.LoadImgResource2);
			return;
		}
		
		return cg.resourcesManager._pushImgResource(url, callfn, target, name);
	}
});


cg._globalFontSize = cg.ITEM_SIZE;
cg._globalFontName = "Arial";
cg._globalFontNameRelease = false;

cg.MenuItem = cg.Node.extend({
    _enabled: false,
    _target: null,
    _callback: null,
    _isSelected: false,
    _className: "MenuItem",

    ctor: function (callback, target) {
        var nodeP = cg.Node.prototype;
        nodeP.ctor.call(this);
        this._target = null;
        this._callback = null;
        this._isSelected = false;
        this._enabled = false;

        nodeP.setAnchorPoint.call(this, 0, 0);
        this._target = target || null;
        this._callback = callback || null;
        if (this._callback) {
            this._enabled = true;
        }
    },

    isSelected: function () {
        return this._isSelected;
    },

    setTarget: function (selector, rec) {
        this._target = rec;
        this._callback = selector;
    },

    isEnabled: function () {
        return this._enabled;
    },

    setEnabled: function (enable) {
        this._enabled = enable;
    },

    initWithCallback: function (callback, target) {
        this.anchorX = 0;
        this.anchorY = 0;
        this._target = target;
        this._callback = callback;
        this._enabled = true;
        this._isSelected = false;
        return true;
    },

    rect: function () {
        var locPosition = this._position, locContentSize = this._contentSize, locAnchorPoint = this._anchorPoint;
        return cg.rect(locPosition.x - locContentSize.width/2 - locAnchorPoint.x,
            locPosition.y - locContentSize.height/2 - locAnchorPoint.y,
            locContentSize.width, locContentSize.height);
    },

    selected: function () {
        this._isSelected = true;
    },

    unselected: function () {
        this._isSelected = false;
    },

    setCallback: function (callback, target) {
        this._target = target;
        this._callback = callback;
    },

    activate: function () {
        if (this._enabled) {
            var locTarget = this._target, locCallback = this._callback;
            if (!locCallback)
                return;
            if (locTarget && cg.isString(locCallback)) {
                locTarget[locCallback](this);
            } else if (locTarget && cg.isFunction(locCallback)) {
                locCallback.call(locTarget, this);
            } else
                locCallback(this);
        }
    }
});

cg.MenuItem.create = function (callback, target) {
    return new cg.MenuItem(callback, target);
};

cg.MenuItemSprite = cg.MenuItem.extend({
    _normalImage: null,
    _selectedImage: null,
   _disabledImage: null,

    ctor: function (normalSprite, selectedSprite, three, four, five) {
        cg.MenuItem.prototype.ctor.call(this);
        this._normalImage = null;
        this._selectedImage = null;
        this._disabledImage = null;

        if (selectedSprite !== undefined) {
            normalSprite = normalSprite;
            selectedSprite = selectedSprite;
            var disabledImage, target, callback;

            if (five !== undefined) {
                disabledImage = three;
                callback = four;
                target = five;
            } else if (four !== undefined && cg.isFunction(four)) {
                disabledImage = three;
                callback = four;
            } else if (four !== undefined && cg.isFunction(three)) {
                target = four;
                callback = three;
                disabledImage = cg.Sprite.create(selectedSprite);
            } else if (three === undefined) {
                disabledImage = cg.Sprite.create(selectedSprite);
            }
            this.initWithNormalSprite(normalSprite, selectedSprite, disabledImage, callback, target);
        }
    },
    setPosition: function(position){
    	if(this._normalImage)
    		this._normalImage.setPosition(position);
    	if(this._selectedImage)
    		this._selectedImage.setPosition(position);
    	if(this._disabledImage)
    		this._disabledImage.setPosition(position);
    	this.prototype.setPosition.call(this, position);
    },
    getNormalImage: function () {
        return this._normalImage;
    },

    setNormalImage: function (normalImage) {
        if (this._normalImage == normalImage) {
            return;
        }
        if (normalImage) {
            this.addChild(normalImage, 0, cg.NORMAL_TAG);
            normalImage.anchorX = 0;
            normalImage.anchorY = 0;
        }
        if (this._normalImage) {
            this.removeChild(this._normalImage, true);
        }

        this._normalImage = normalImage;
        this.width = this._normalImage.width;
        this.height = this._normalImage.height;
        this._updateImagesVisibility();
    },

    getSelectedImage: function () {
        return this._selectedImage;
    },

    setSelectedImage: function (selectedImage) {
        if (this._selectedImage == selectedImage)
            return;

        if (selectedImage) {
            this.addChild(selectedImage, 0, cg.SELECTED_TAG);
            selectedImage.anchorX = 0;
            selectedImage.anchorY = 0;
        }

        if (this._selectedImage) {
            this.removeChild(this._selectedImage, true);
        }

        this._selectedImage = selectedImage;
        this._updateImagesVisibility();
    },

    getDisabledImage: function () {
        return this._disabledImage;
    },

    setDisabledImage: function (disabledImage) {
        if (this._disabledImage == disabledImage)
            return;

        if (disabledImage) {
            this.addChild(disabledImage, 0, cg.DISABLE_TAG);
            disabledImage.anchorX = 0;
            disabledImage.anchorY = 0;
        }

        if (this._disabledImage)
            this.removeChild(this._disabledImage, true);

        this._disabledImage = disabledImage;
        this._updateImagesVisibility();
    },

    initWithNormalSprite: function (normalSprite, selectedSprite, disabledSprite, callback, target) {
        this.initWithCallback(callback, target);
        this.setNormalImage(normalSprite);
        this.setSelectedImage(selectedSprite);
        this.setDisabledImage(disabledSprite);
        var locNormalImage = this._normalImage;
        if (locNormalImage) {
            this.width = locNormalImage.width;
            this.height = locNormalImage.height;
        }
        this.cascadeColor = true;
        this.cascadeOpacity = true;
        return true;
    },

   setColor: function (color) {
       this._normalImage.color = color;
       if (this._selectedImage)
           this._selectedImage.color = color;
       if (this._disabledImage)
            this._disabledImage.color = color;
    },


    getColor: function () {
        return this._normalImage.color;
    },

    setOpacity: function (opacity) {
        this._normalImage.opacity = opacity;

        if (this._selectedImage)
            this._selectedImage.opacity = opacity;

        if (this._disabledImage)
            this._disabledImage.opacity = opacity;
    },

    getOpacity: function () {
        return this._normalImage.opacity;
    },

    selected: function () {
        cg.MenuItem.prototype.selected.call(this);
        if (this._normalImage) {
            if (this._disabledImage)
                this._disabledImage.visible = false;

            if (this._selectedImage) {
                this._normalImage.visible = false;
                this._selectedImage.visible = true;
            } else
                this._normalImage.visible = true;
        }
    },

    unselected: function () {
        cg.MenuItem.prototype.unselected.call(this);
        if (this._normalImage) {
            this._normalImage.visible = true;

            if (this._selectedImage)
                this._selectedImage.visible = false;

            if (this._disabledImage)
                this._disabledImage.visible = false;
        }
    },

    setEnabled: function (bEnabled) {
        if (this._enabled != bEnabled) {
            cg.MenuItem.prototype.setEnabled.call(this, bEnabled);
            this._updateImagesVisibility();
        }
    },

    _updateImagesVisibility: function () {
        var locNormalImage = this._normalImage, locSelImage = this._selectedImage, locDisImage = this._disabledImage;
        if (this._enabled) {
            if (locNormalImage)
                locNormalImage.visible = true;
            if (locSelImage)
                locSelImage.visible = false;
            if (locDisImage)
                locDisImage.visible = false;
        } else {
            if (locDisImage) {
                if (locNormalImage)
                    locNormalImage.visible = false;
                if (locSelImage)
                    locSelImage.visible = false;
                if (locDisImage)
                    locDisImage.visible = true;
            } else {
                if (locNormalImage)
                    locNormalImage.visible = true;
                if (locSelImage)
                    locSelImage.visible = false;
            }
        }
    }
});

var _p = cg.MenuItemSprite.prototype;

_p.normalImage;
cg.defineGetterSetter(_p, "normalImage", _p.getNormalImage, _p.setNormalImage);
_p.selectedImage;
cg.defineGetterSetter(_p, "selectedImage", _p.getSelectedImage, _p.setSelectedImage);
_p.disabledImage;
cg.defineGetterSetter(_p, "disabledImage", _p.getDisabledImage, _p.setDisabledImage);

cg.MenuItemImage = cg.MenuItem.extend({
	_normalImage: null,
    _selectedImage: null,
    _disabledImage: null,

    ctor: function (normalImage, selectedImage, three, four, five) {
        var normalSprite = null,
            selectedSprite = null,
            disabledSprite = null,
            callback = null,
            target = null;

        if (normalImage === undefined) {
            cg.MenuItemSprite.prototype.ctor.call(this);
        }
        else {
            normalSprite = cg.Sprite.create(normalImage);
            selectedImage &&
            (selectedSprite = cg.Sprite.create(selectedImage));
            if (four === undefined) {
                callback = three;
            }
            else if (five === undefined) {
                callback = three;
                target = four;
            }
            else if (five) {
                disabledSprite = cg.Sprite.create(three);
                callback = four;
                target = five;
            }
            cg.MenuItemSprite.prototype.ctor.call(this, normalSprite, selectedSprite, disabledSprite, callback, target);
        }
    },

    setNormalSpriteFrame: function (frame) {
        this.setNormalImage(cg.Sprite.create(frame));
    },

    setSelectedSpriteFrame: function (frame) {
        this.setSelectedImage(cg.Sprite.create(frame));
    },

    setDisabledSpriteFrame: function (frame) {
        this.setDisabledImage(cg.Sprite.create(frame));
    },

    initWithNormalImage: function (normalImage, selectedImage, disabledImage, callback, target) {
        var normalSprite = null;
        var selectedSprite = null;
        var disabledSprite = null;

        if (normalImage) {
            normalSprite = cg.Sprite.create(normalImage);
        }
        if (selectedImage) {
            selectedSprite = cg.Sprite.create(selectedImage);
        }
        if (disabledImage) {
            disabledSprite = cg.Sprite.create(disabledImage);
        }
        return this.initWithNormalSprite(normalSprite, selectedSprite, disabledSprite, callback, target);
    }
});
cg.MenuItemImage.create = function (normalImage, selectedImage, three, four, five) {
    return new cg.MenuItemImage(normalImage, selectedImage, three, four, five);
};



cg.MENU_STATE_WAITING = 0;
cg.MENU_STATE_TRACKING_TOUCH = 1;
cg.MENU_HANDLER_PRIORITY = -128;
cg.DEFAULT_PADDING = 5;

cg.Menu = cg.Layer.extend({
    enabled: false,

    _selectedItem: null,
    _state: -1,
    _touchListener: null,
    _className: "Menu",

    ctor: function (menuItems) {
        cg.Layer.prototype.ctor.call(this);
        this._color = cg.color.WHITE;
        this.enabled = false;
        this._opacity = 255;
        this._selectedItem = null;
        this._state = -1;

        this._touchListener = cg.EventListener.create({
            event: cg.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this._onTouchBegan,
            onTouchMoved: this._onTouchMoved,
            onTouchEnded: this._onTouchEnded,
            onTouchCancelled: this._onTouchCancelled
        });

        if ((arguments.length > 0) && (arguments[arguments.length - 1] == null))
            cg.log("参数不能以null结尾");

        var argc = arguments.length, items;
        if (argc == 0) {
            items = [];
        } else if (argc == 1) {
            if (menuItems instanceof Array) {
                items = menuItems;
            }
            else items = [menuItems];
        }
        else if (argc > 1) {
            items = [];
            for (var i = 0; i < argc; i++) {
                if (arguments[i])
                    items.push(arguments[i]);
            }
        }
        this.initWithArray(items);
    },

    onEnter: function () {
        var locListener = this._touchListener;
        if (!locListener._isRegistered())
            cg.eventManager.addListener(locListener, this);
        cg.Node.prototype.onEnter.call(this);
    },

    isEnabled: function () {
        return this.enabled;
    },

    setEnabled: function (enabled) {
        this.enabled = enabled;
    },

    initWithItems: function (args) {
        var pArray = [];
        if (args) {
            for (var i = 0; i < args.length; i++) {
                if (args[i])
                    pArray.push(args[i]);
            }
        }

        return this.initWithArray(pArray);
    },

    initWithArray: function (arrayOfItems) {
        if (cg.Layer.prototype.init.call(this)) {
            this.enabled = true;

            var winSize = cg.winSize;
            this.setPosition(winSize.width / 2, winSize.height / 2);
            this.setContentSize(winSize);
            this.setAnchorPoint(0, 0);

            if (arrayOfItems) {
                for (var i = 0; i < arrayOfItems.length; i++)
                    this.addChild(arrayOfItems[i], i);
            }

            this._selectedItem = null;
            this._state = cg.MENU_STATE_WAITING;

            this.cascadeColor = true;
            this.cascadeOpacity = true;

            return true;
        }
        return false;
    },

    addChild: function (child, zOrder, tag) {
        if (!(child instanceof cg.MenuItem))
            throw "cg.Menu.addChild() :Menu只能接受MenuItem类数据作为子节点";
        cg.Layer.prototype.addChild.call(this, child, zOrder, tag);
    },

    removeChild: function (child, cleanup) {
        if (child == null)
            return;
        if (!(child instanceof cg.MenuItem)) {
            cg.log("cg.Menu.removeChild():Menu只能接受MenuItem类数据作为子节点");
            return;
        }

        if (this._selectedItem == child)
            this._selectedItem = null;
        cg.Node.prototype.removeChild.call(this, child, cleanup);
    },

    _onTouchBegan: function (touch, event) {
        var target = event.getCurrentTarget();
        if (target._state != cg.MENU_STATE_WAITING || !target._visible || !target.enabled)
            return false;

        for (var c = target.parent; c != null; c = c.parent) {
            if (!c.isVisible())
                return false;
        }

        target._selectedItem = target._itemForTouch(touch);
        if (target._selectedItem) {
            target._state = cg.MENU_STATE_TRACKING_TOUCH;
            target._selectedItem.selected();
            return true;
        }
        return false;
    },

    _onTouchEnded: function (touch, event) {
        var target = event.getCurrentTarget();
        if (target._state !== cg.MENU_STATE_TRACKING_TOUCH) {
            cg.log("cg.Menu.onTouchEnded(): 未知状态");
            return;
        }
        if (target._selectedItem) {
            target._selectedItem.unselected();
            target._selectedItem.activate();
        }
        target._state = cg.MENU_STATE_WAITING;
    },

    _onTouchCancelled: function (touch, event) {
        var target = event.getCurrentTarget();
        if (target._state !== cg.MENU_STATE_TRACKING_TOUCH) {
            cg.log("cg.Menu.onTouchCancelled(): 未知状态");
            return;
        }
        if (this._selectedItem)
            target._selectedItem.unselected();
        target._state = cg.MENU_STATE_WAITING;
    },

    _onTouchMoved: function (touch, event) {
        var target = event.getCurrentTarget();
        if (target._state !== cg.MENU_STATE_TRACKING_TOUCH) {
            cg.log("cg.Menu.onTouchMoved(): 未知状态");
            return;
        }
        var currentItem = target._itemForTouch(touch);
        if (currentItem != target._selectedItem) {
            if (target._selectedItem)
                target._selectedItem.unselected();
            target._selectedItem = currentItem;
            if (target._selectedItem)
                target._selectedItem.selected();
        }
    },

    onExit: function () {
        if (this._state == cg.MENU_STATE_TRACKING_TOUCH) {
            if (this._selectedItem) {
                this._selectedItem.unselected();
                this._selectedItem = null;
            }
            this._state = cg.MENU_STATE_WAITING;
        }
        cg.Node.prototype.onExit.call(this);
    },
    

    _itemForTouch: function (touch) {
        var touchLocation = touch.getLocation();
        var itemChildren = this._children, locItemChild;
        if (itemChildren && itemChildren.length > 0) {
            for (var i = itemChildren.length - 1; i >= 0; i--) {
                locItemChild = itemChildren[i];
                if (locItemChild.isVisible() && locItemChild.isEnabled()) {
                    var local = locItemChild.convertToNodeSpace(touchLocation);
                    var r = locItemChild.rect();
                    r.x = locItemChild.getPositionX;
                    r.y = locItemChild.getPositionY;
                    if (cg.rectContainsPoint(r, touchLocation))
                        return locItemChild;
                }
            }
        }
        return null;
    }
});

cg.Menu.create = function (menuItems) {
    var argc = arguments.length;
    if ((argc > 0) && (arguments[argc - 1] == null))
        cg.log("参数不能以null结尾");

    var ret;
    if (argc == 0)
        ret = new cg.Menu();
    else if (argc == 1)
        ret = new cg.Menu(menuItems);
    else
        ret = new cg.Menu(Array.prototype.slice.call(arguments, 0));
    return ret;
};

cg.ACTION_TAG_INVALID = -1;
cg.Action = cg.Class.extend(){
	_target : null,
	_node : null,
	_duration : 0.0,
	_enabled : false,
	_paused : false,
	_finished : false,
	_finishCallBack : null,

	ctor : function(duration, target, callfn){
		var _t = this;
		_t.prototype.ctor.call(_t);
		_t._enabled = true;
		_t._duration = duration;
		_t._target = target;
		if(callfn)
			_t._finishCallBack = callfn;
	}

	getTarget : function(){
		return this._target;
	},

	setTarget : function(target){
		if(!cg.isNumber(target)){
			cg.log(cg._LogInfos.ActionSetTarget);
			return;
		}
		this._target = target || cg.ACTION_TAG_INVALID;
		
	},

	getNode : function(){
		return this._node;
	},

	setNode : function(node){
		if(!(node instanceof cg.Node){
			cg.log(cg._LogInfos.ActionSetNode);
			return;
		}
		this._node = node;
	},

	getDuration : function(){
		return this._duration;
	},

	setDuration : function(duration){
		if(!cg.isNumber(duration))
			return
		this._duration = duration;
	},

	isEnabled : function(){
		return this._enabled;
	},

	setEnabled : function(bool){
		if(!(bool instanceof Boolean))
			return
		this._enabled = bool;
	},

	isPaused : function(){
		return this._paused;
	},

	setPaused : function(bool){
		if(!(bool instanceof Boolean))
			return
		this._paused = bool;
	},

	isFinished : function(){
		return this._finished;
	},

	setFinished : function(bool){
		if(!(bool instanceof Boolean))
			return
		this._finished = bool;
	},

	setCallback : function(callfn){
		if(!cg.isFunction(callfn))
			return
		this._finishCallBack = callfn;
	},

	_callFinishFunc : function(target){
		this._finishCallBack.call(target);
	}
};

cg.MoveTo = cg.Action.extend() {
	_destination: null,
	_firstTick : false,
	_elapsed: 0.0,
	_dx : 0.0,
	_dy : 0.0,

	ctor: function(duration, destination, callfn, target) {
		var _t = this;
		_t.prototype.ctor.call(this, duration, callfn, target);
		_t._destination = destination;
		_t._firstTick = true;
	},

	step: function(dt) {
		var locNode = this.getNode(),startPosition;
		if(!locNode){
			cg.log(cg._LogInfos.ActionMoveToUpdate);
			return;
		}
		if(this._firstTick){
			startPosition = locNode.getPosition;
			this._dx = this._duration.x - startPosition.x;
			this._dy = this._duration.y - startPosition.y;
			this._firstTick = false;
		}
		if(this.isEnabled() && !this.isStopped() && !this.isFinished()){
			this._elapsed += dt;
			var t = this._elapsed / (this._duration > 0.0000001192092896 ? this._duration : 0.0000001192092896);
			t = (1 > t ? t : 1);
			this.update(t > 0 ? t : 0);
		}
	},

	update : function(dt){
		var locNode =  this.getNode();
		if(this._startPosition && locNode){			
			locNode.setPosition(cg.p(this._dx*dt+this._startPosition.x,this._dy*dt+this._startPosition.y));
			if(dt == 1){
				this.setFinished(true);
				this._callFinishFunc();
			}
		}
	}
};

cg.ACTION_TAG_NORMAL = 1;
cg.actionManager = {
	_actionMap : [],
	_nodeActionsMap : {},

	addAction : function(action, node){
		action.setNode(node);
		var locTag = action.getTarget() ,locNodeID = node.__instanceId;
		actionMap.push(action);
		if(_nodeActionsMap[locNodeID])
			_nodeActionsMap[locNodeID] = [];
		_nodeActionsMap[locNodeID].push(action);
	},

	removeAllActionsFromTarget : function(node){
		var locID = node.__instanceId, actions = _nodeActionsMap[locID],i,len;
		if(!actions)
			return
		for(i=0,len=actions.length;i<len;++i)
			cg.arrayRemoveObject(this._actionMap,actions[i]);
		actions.length = 0;
	},

	removeAction : function(action){
		var locNodeID = action.getNode().__instanceId;
		cg.arrayRemoveObject(this._actionMap,action);
		if(this._nodeActionsMap[locNodeID])
			cg.arrayRemoveObject(this._nodeActionsMap[locNodeID],action);
	},

	removeActionByTag : function(tag, node){
		var locNodeID = node.__instanceId, tagAction = [],
			locNodeMap = this._nodeActionsMap[locNodeID],i,len;
		if(locNodeMap){
			for(i=0,len=locNodeMap.length;i<len;++i){
				if(tag == locNodeMap[i].getTag())
					tagAction = locNodeMap[i];
			}
		}
		cg.arrayRemoveArray(locNodeMap,tagAction);
		cg.arrayRemoveArray(_actionMap,tagAction);
	},

	getActionByTag : function(){
		cg.log(cg._LogInfos.GetActionByTag);
	},

	numberOfRunningActionsInTarget: function(node){
		var locID =node.__instanceId;
		if(this._nodeActionsMap[locID])
			return this._nodeActionsMap[locID].length;
		return 0;
	},

	resumeTarget : function(node){
		var locID =node.__instanceId, locNode = this._nodeActionsMap[locID],i,len;
		if(locNode){
			for(i=0,len=locNode.length;i<len;++i){
				locNode[i].setEnabled(true);
				locNode[i].setPaused(false);
			}
		}
	},

	pauseTarget : function(node){
		var locID =node.__instanceId, locNode = this._nodeActionsMap[locID],i,len;
		if(locNode){
			for(i=0,len=locNode.length;i<len;++i){
				locNode[i].setEnabled(true);
				locNode[i].setPaused(true);
			}
		}
	},

	update : function(dt){
		var i=0,len = _actionMap.length;
		for(;i<len;++i)
			_actionMap[i].step(dt);
	}
};

cg.Animation = cg.Class.extend({
	_frames : [],
	_interval : 0.0,
	_loader : null,
	_lastTick : 0.0,
	_node : null,
	_index : 0,
	_finished : false,
	_finishCall : null,

	ctor : function(frames, interval){
		this._loader = new cg.Loader();
		this._frames = [];
		this._interval = interval;
		this._loadFrames(frames);
	},

	_loadFrames : function(frames){
		if(cg.isArray(frames)){
			for(var i=0,len=frames.length;i<len;++i){
				var rid = this._loader.loadImg(frames[i]);
				this.frames.push(cg.resourcesManager._getImgResource(rid));
			}
		}
	},

	_setNode : function(node){
		if(!(node instanceof cg.Node))
			return
		this._node = node;
	},

	_getNode : function(){
		return this._node;
	},

	_setCallBack : function(callfn){
		this._finishCall = callfn;
	},

	step : function(dt){
		var locNode = this._node;
		_lastTick += dt;
		if(_lastTick>_interval && !this._finished && locNode){
			locNode.setTexture(this._frames[this._index].resource);
			this._index++;
			if(this._index == this._frames.length){
				this._finished = true;
				if(cg.isFunction(this._finishCall))
					this._finishCall.call(this);
			}
			_lastTick = 0.0;
		}
	}
});

cg.animateManager = {
	_animationMap : {},

	addAnimation : function(animation, node, callfn){
		if(!(animation instanceof cg.Animation)){
			cg.log(cg._LogInfos.AnimateManagerAddAnimation);
			return;
		}
		if(!(node instanceof cg.Node)){
			cg.log(cg._LogInfos.AnimateManagerAddAnimation2);
			return;
		}
		var locNodeID = node.__instanceId;
		animation._setNode(node);
		animation._setCallBack(callfn);
		if(!_animationMap[locNodeID])
			_animationMap[locNodeID] = [];
		_animationMap[locNodeID].push(animation);
	},

	removeAnimation : function(animation){
		var locNode = animation._getNode(),locID;
		if(locNode){
			locID = locNode.__instanceId;
			cg.arrayRemoveObject(_animationMap[locID]);
		}
	},

	removeAnimationFromTarget : function(node){
		if(_animationMap[node.__instanceId])
			_animationMap[node.__instanceId].length = 0;
	},

	update : function(dt){
		for(var ani in _animationMap)
			this._updateFromAnimation(ani,dt);
	},

	_updateFromAnimation : function(arr, dt){
		var i =0, len = arr.length;
		for(i;i<len;++i)
			arr[i].step(dt);
	}
};
/*
cg.Scheduler =  cg.Class.extend({
	//TODO
	ctor : function(){},
	pauseTarget : function(node){},
	resumeTarget: function(node){},
	unscheduleAllCallbacksForTarget: function(node){},
	unscheduleCallbackForTarget: function(node, callfn){},
	scheduleCallbackForTarget: function(node,callback_fn, interval, repeat, delay,running){},
	unscheduleUpdateForTarget: function(node){},
	scheduleUpdateForTarget: function(node,priority,running){},
	update : function(dt){}
});*/


cg.Render = cg.Class.extend({
	_winSize : null,
	_cashedCanvas : null,
	_cashedContext : null,
	_drawCanvas : null,
	_drawContext : null,

	ctor : function(winSize){
		this._cashedCanvas = document.createElement("canvas");
		this._winSize = winSize;
		if(winSize.width && winSize.height){
			this._cashedCanvas.setAttribute('width',winSize.width+'');
			this._cashedCanvas.setAttribute('height',winSize.height+'');
		}
		this._cashedContext = this._cashedCanvas.getContext("2d");
		cg._renderContext = this._cashedContext;
		this._drawCanvas = document.getElementById(cg.DRAW_CANVAS);
		if(this._drawCanvas){
			cg.log(cg._LogInfos.RenderConstructor);
			return
		}
		this._drawContext = this._drawCanvas.getContext("2d");
	},

	draw : function(rootNode){
		if(rootNode instanceof cg.Node){
			cg.director.stop();
			return
		}
		this._resetCanvas();
		var locW = this._winSize.width, locH = this._winSize.height;
		rootNode.visit(this._cashedContext);
		this._drawContext.drawImage(this._cashedContext,0,0,locW,locH,0,0,locW,locH);
		
	},

	_resetCanvas : function(){
		this._cashedContext.clearRect(0,0,this._winSize.width,this.winSize.height);
		this._drawContext.clearRect(0,0,this._winSize.width,this.winSize.height);
	}

});


cg.PRIORITY_NON_SYSTEM = cg.PRIORITY_SYSTEM + 1;
cg.ListEntry = function (prev, next, target, priority, paused, markedForDeletion) {
    this.prev = prev;
    this.next = next;
    this.target = target;
    this.priority = priority;
    this.paused = paused;
    this.markedForDeletion = markedForDeletion;
};

cg.HashUpdateEntry = function (list, entry, target, hh) {
	this.list = list;
    this.entry = entry;
    this.target = target;
    this.hh = hh;
};

cg.HashTimerEntry = function (timers, target, timerIndex, currentTimer, currentTimerSalvaged, paused, hh) {
var _t = this;
    _t.timers = timers;
    _t.target = target;
    _t.timerIndex = timerIndex;
    _t.currentTimer = currentTimer;
    _t.currentTimerSalvaged = currentTimerSalvaged;
    _t.paused = paused;
    _t.hh = hh;
};

cg.Timer = cg.Class.extend(/** @lends cg.Timer# */{
    _interval:0.0,
    _callback:null,//is called _callback before

    _target:null,//target of _callback
    _elapsed:0.0,

    _runForever:false,
    _useDelay:false,
    _timesExecuted:0,
    _repeat:0, //0 = once, 1 is 2 x executed
    _delay:0,
    getInterval : function(){return this._interval;},
    setInterval : function(interval){this._interval = interval;},
    getCallback : function(){return this._callback},
    ctor:function (target, callback, interval, repeat, delay) {
        var self = this;
        self._target = target;
        self._callback = callback;
        self._elapsed = -1;
        self._interval = interval || 0;
        self._delay = delay || 0;
        self._useDelay = self._delay > 0;
        self._repeat = (repeat == null) ? cg.REPEAT_FOREVER : repeat;
        self._runForever = (self._repeat == cg.REPEAT_FOREVER);
    },

    _doCallback:function(){
        var self = this;
        if (cg.isString(self._callback))
            self._target[self._callback](self._elapsed);
        else // if (typeof(this._callback) == "function") {
            self._callback.call(self._target, self._elapsed);
    },

    update:function (dt) {
        var self = this;
        if (self._elapsed == -1) {
            self._elapsed = 0;
            self._timesExecuted = 0;
        } else {
            var locTarget = self._target, locCallback = self._callback;
            self._elapsed += dt;//standard timer usage
            if (self._runForever && !self._useDelay) {
                if (self._elapsed >= self._interval) {
                    if (locTarget && locCallback)
                        self._doCallback();
                    self._elapsed = 0;
                }
            } else {
                //advanced usage
                if (self._useDelay) {
                    if (self._elapsed >= self._delay) {
                        if (locTarget && locCallback)
                            self._doCallback();

                        self._elapsed = self._elapsed - self._delay;
                        self._timesExecuted += 1;
                        self._useDelay = false;
                    }
                } else {
                    if (self._elapsed >= self._interval) {
                        if (locTarget && locCallback)
                            self._doCallback();

                        self._elapsed = 0;
                        self._timesExecuted += 1;
                    }
                }

                if (self._timesExecuted > self._repeat)
                    cg.director.getScheduler().unscheduleCallbackForTarget(locTarget, locCallback);
            }
        }
    }
});

cg.Scheduler = cg.Class.extend({
    _timeScale:1.0,

    _updates : null, //_updates[0] list of priority < 0, _updates[1] list of priority == 0, _updates[2] list of priority > 0,

    _hashForUpdates:null, // hash used to fetch quickly the list entries for pause,delete,etc
    _arrayForUpdates:null,

    _hashForTimers:null, //Used for "selectors with interval"
    _arrayForTimes:null,

    _currentTarget:null,
    _currentTargetSalvaged:false,
    _updateHashLocked:false, //If true unschedule will not remove anything from a hash. Elements will only be marked for deletion.

    ctor:function () {
        var self = this;
        self._timeScale = 1.0;
        self._updates = [[], [], []];

        self._hashForUpdates = {};
        self._arrayForUpdates = [];

        self._hashForTimers = {};
        self._arrayForTimers = [];

        self._currentTarget = null;
        self._currentTargetSalvaged = false;
        self._updateHashLocked = false;
    },
    _removeHashElement:function (element) {
        delete this._hashForTimers[element.target.__instanceId];
        cg.arrayRemoveObject(this._arrayForTimers, element);
        element.Timer = null;
        element.target = null;
        element = null;
    },

    _removeUpdateFromHash:function (entry) {
        var self = this, element = self._hashForUpdates[entry.target.__instanceId];
        if (element) {
            //list entry
            cg.arrayRemoveObject(element.list, element.entry);

            delete self._hashForUpdates[element.target.__instanceId];
            cg.arrayRemoveObject(self._arrayForUpdates, element);
            element.entry = null;

            //hash entry
            element.target = null;
        }
    },

    _priorityIn:function (ppList, target, priority, paused) {
        var self = this, listElement = new cg.ListEntry(null, null, target, priority, paused, false);

        // empey list ?
        if (!ppList) {
            ppList = [];
            ppList.push(listElement);
        } else {
            var index2Insert = ppList.length - 1;
            for(var i = 0; i <= index2Insert; i++){
                if (priority < ppList[i].priority) {
                    index2Insert = i;
                    break;
                }
            }
            ppList.splice(i, 0, listElement);
        }

        //update hash entry for quick acgess
        var hashElement = new cg.HashUpdateEntry(ppList, listElement, target, null);
        self._arrayForUpdates.push(hashElement);
        self._hashForUpdates[target.__instanceId] = hashElement;

        return ppList;
    },

    _appendIn:function (ppList, target, paused) {
        var self = this, listElement = new cg.ListEntry(null, null, target, 0, paused, false);
        ppList.push(listElement);

        //update hash entry for quicker acgess
        var hashElement = new cg.HashUpdateEntry(ppList, listElement, target, null);
        self._arrayForUpdates.push(hashElement);
        self._hashForUpdates[target.__instanceId] = hashElement;
    },
    setTimeScale:function (timeScale) {
        this._timeScale = timeScale;
    },

    getTimeScale:function () {
        return this._timeScale;
    },
    update:function (dt) {
        var self = this;
        var locUpdates = self._updates, locArrayForTimers = self._arrayForTimers;
        var tmpEntry, elt, i, li;
        self._updateHashLocked = true;

        if (this._timeScale != 1.0) {
            dt *= this._timeScale;
        }

        for(i = 0, li = locUpdates.length; i < li && i >= 0; i++){
            var update = self._updates[i];
            for(var j = 0, lj = update.length; j < lj; j++){
                tmpEntry = update[j];
                if ((!tmpEntry.paused) && (!tmpEntry.markedForDeletion)) tmpEntry.target.update(dt);
            }
        }

        //Interate all over the custom callbacks
        for(i = 0, li = locArrayForTimers.length; i < li; i++){
            elt = locArrayForTimers[i];
            if(!elt) break;
            self._currentTarget = elt;
            self._currentTargetSalvaged = false;

            if (!elt.paused) {
                // The 'timers' array may change while inside this loop
                for (elt.timerIndex = 0; elt.timerIndex < elt.timers.length; elt.timerIndex++) {
                    elt.currentTimer = elt.timers[elt.timerIndex];
                    elt.currentTimerSalvaged = false;

                    elt.currentTimer.update(dt);
                    elt.currentTimer = null;
                }
            }

            if ((self._currentTargetSalvaged) && (elt.timers.length == 0)){
                self._removeHashElement(elt);
                i--;
            }
        }

        for(i = 0, li = locUpdates.length; i < li; i++){
            var update = self._updates[i];
            for(var j = 0, lj = update.length; j < lj; ){
                tmpEntry = update[j];
                if(!tmpEntry) break;
                if (tmpEntry.markedForDeletion) self._removeUpdateFromHash(tmpEntry);
                else j++;
            }
        }

        self._updateHashLocked = false;
        self._currentTarget = null;
    },
    scheduleCallbackForTarget:function (target, callback_fn, interval, repeat, delay, paused) {

        cg.assert(callback_fn, cg._LogInfos.Scheduler_scheduleCallbackForTarget_2);

        cg.assert(target, cg._LogInfos.Scheduler_scheduleCallbackForTarget_3);

        // default arguments
        interval = interval || 0;
        repeat = (repeat == null) ? cg.REPEAT_FOREVER : repeat;
        delay = delay || 0;
        paused = paused || false;

        var self = this, timer;
        var element = self._hashForTimers[target.__instanceId];

        if (!element) {
            // Is this the 1st element ? Then set the pause level to all the callback_fns of this target
            element = new cg.HashTimerEntry(null, target, 0, null, null, paused, null);
            self._arrayForTimers.push(element);
            self._hashForTimers[target.__instanceId] = element;
        }

        if (element.timers == null) {
            element.timers = [];
        } else {
            for (var i = 0; i < element.timers.length; i++) {
                timer = element.timers[i];
                if (callback_fn == timer._callback) {
                    cg.log(cg._LogInfos.Scheduler_scheduleCallbackForTarget, timer.getInterval().toFixed(4), interval.toFixed(4));
                    timer._interval = interval;
                    return;
                }
            }
        }

        timer = new cg.Timer(target, callback_fn, interval, repeat, delay);
        element.timers.push(timer);
    },
    scheduleUpdateForTarget:function (target, priority, paused) {
        if(target === null)
            return;
        var self = this, locUpdates = self._updates;
        var hashElement = self._hashForUpdates[target.__instanceId];

        if (hashElement) {
            // TODO: check if priority has changed!
            hashElement.entry.markedForDeletion = false;
            return;
        }

        // most of the updates are going to be 0, that's way there
        // is an special list for updates with priority 0
        if (priority == 0) {
            self._appendIn(locUpdates[1], target, paused);
        } else if (priority < 0) {
            locUpdates[0] = self._priorityIn(locUpdates[0], target, priority, paused);
        } else {
            // priority > 0
            locUpdates[2] = self._priorityIn(locUpdates[2], target, priority, paused);
        }
    },
    unscheduleCallbackForTarget:function (target, callback_fn) {
        // explicity handle nil arguments when removing an object
        if ((target == null) || (callback_fn == null)) {
            return;
        }

        var self = this, element = self._hashForTimers[target.__instanceId];
        if (element) {
            var timers = element.timers;
            for(var i = 0, li = timers.length; i < li; i++){
                var timer = timers[i];
                if (callback_fn == timer._callback) {
                    if ((timer == element.currentTimer) && (!element.currentTimerSalvaged)) {
                        element.currentTimerSalvaged = true;
                    }
                    timers.splice(i, 1)
                    //update timerIndex in case we are in tick;, looping over the actions
                    if (element.timerIndex >= i) {
                        element.timerIndex--;
                    }

                    if (timers.length == 0) {
                        if (self._currentTarget == element) {
                            self._currentTargetSalvaged = true;
                        } else {
                            self._removeHashElement(element);
                        }
                    }
                    return;
                }
            }
        }
    },
    unscheduleUpdateForTarget:function (target) {
        if (target == null) {
            return;
        }

        var self = this, element = self._hashForUpdates[target.__instanceId];
        if (element != null) {
            if (self._updateHashLocked) {
                element.entry.markedForDeletion = true;
            } else {
                self._removeUpdateFromHash(element.entry);
            }
        }
    },

    unscheduleAllCallbacksForTarget:function (target) {
        //explicit NULL handling
        if (target == null) {
            return;
        }

        var self = this, element = self._hashForTimers[target.__instanceId];
        if (element) {
            var timers = element.timers;
            if ((!element.currentTimerSalvaged) && (timers.indexOf(element.currentTimer) >= 0)) {
                element.currentTimerSalvaged = true;
            }
            timers.length = 0;

            if (self._currentTarget == element) {
                self._currentTargetSalvaged = true;
            } else {
                self._removeHashElement(element);
            }
        }
        // update callback
        self.unscheduleUpdateForTarget(target);
    },
    unscheduleAllCallbacks:function () {
        this.unscheduleAllCallbacksWithMinPriority(cg.Scheduler.PRIORITY_SYSTEM);
    },
    unscheduleAllCallbacksWithMinPriority:function (minPriority) {
        // Custom Selectors
        var self = this, locArrayForTimers = self._arrayForTimers, locUpdates = self._updates;
        for(var i = 0, li = locArrayForTimers.length; i < li; i++){
            // element may be removed in unscheduleAllCallbacksForTarget
            self.unscheduleAllCallbacksForTarget(locArrayForTimers[i].target);
        }
        for(var i = 2; i >= 0; i--){
            if((i == 1 && minPriority > 0) || (i == 0 && minPriority >= 0)) continue;
            var updates = locUpdates[i];
            for(var j = 0, lj = updates.length; j < lj; j++){
                self.unscheduleUpdateForTarget(updates[j].target);
            }
        }
    },
    pauseAllTargets:function () {
        return this.pauseAllTargetsWithMinPriority(cg.Scheduler.PRIORITY_SYSTEM);
    },
    pauseAllTargetsWithMinPriority:function (minPriority) {
        var idsWithSelectors = [];

        var self = this, element, locArrayForTimers = self._arrayForTimers, locUpdates = self._updates;
        // Custom Selectors
        for(var i = 0, li = locArrayForTimers.length; i < li; i++){
            element = locArrayForTimers[i];
            if (element) {
                element.paused = true;
                idsWithSelectors.push(element.target);
            }
        }
        for(var i = 0, li = locUpdates.length; i < li; i++){
            var updates = locUpdates[i];
            for(var j = 0, lj = updates.length; j < lj; j++){
                element = updates[j];
                if (element) {
                    element.paused = true;
                    idsWithSelectors.push(element.target);
                }
            }
        }
        return idsWithSelectors;
    },
    resumeTargets:function (targetsToResume) {
        if (!targetsToResume)
            return;

        for (var i = 0; i < targetsToResume.length; i++) {
            this.resumeTarget(targetsToResume[i]);
        }
    },
    pauseTarget:function (target) {

        cg.assert(target, cg._LogInfos.Scheduler_pauseTarget);

        //customer selectors
        var self = this, element = self._hashForTimers[target.__instanceId];
        if (element) {
            element.paused = true;
        }

        //update callback
        var elementUpdate = self._hashForUpdates[target.__instanceId];
        if (elementUpdate) {
            elementUpdate.entry.paused = true;
        }
    },
    resumeTarget:function (target) {

        cg.assert(target, cg._LogInfos.Scheduler_resumeTarget);

        // custom selectors
        var self = this, element = self._hashForTimers[target.__instanceId];

        if (element) {
            element.paused = false;
        }

        //update callback
        var elementUpdate = self._hashForUpdates[target.__instanceId];

        if (elementUpdate) {
            elementUpdate.entry.paused = false;
        }
    },
    isTargetPaused:function (target) {

        cg.assert(target, cg._LogInfos.Scheduler_isTargetPaused);

        // Custom selectors
        var element = this._hashForTimers[target.__instanceId];
        if (element) {
            return element.paused;
        }
        return false;
    }
});
cg.Scheduler.PRIORITY_SYSTEM = (-2147483647 - 1);

cg.playerContorl = {
	_locPostion : null,
	_eventDispatcher : null,

	init : function(){
		this._locPostion = cg.winPosition;
		this._eventDispatcher = cg.eventManager;
	},

	_listenMouse : function(){
		var locCanvas = document.getElementById(cg.DRAW_CANVAS);
		this._addEvent(locCanvas,'click',this._mouseClickfn);
	},

	_mouseClickfn : function(e){
		var locX = e.offsetX, locY = e.offsetY, locEvent;
		locEvent = new cg.EventTouch(cg.p(locX,locY));
		locEvent._setEventCode(cg.EventTouch.EventCode.BEGAN )
		this._eventDispatcher.dispatchEvent(locEvent);
	},

	_addEvent : function(el, type, fn){
		if (document.addEventListener) {
			if (el.length) {
				for (var i = 0; i & lt; el.length; i++) {
					this._addEvent(el[i], type, fn);
				}
			} else {
				el.addEventListener(type, fn, false);
			}
		} else {
			if (el.length) {
				for (var i = 0; i & lt; el.length; i++) {
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

cg.gamer = {
	_globalFPS : FPS,
	_gameDirector : null,

	init : function(canvas,size,position,FPS){
		cg.DRAW_CANVAS =  canvas ||'canvas';
		cg.winSize = size || cg.size(800,450);
		cg.winPosition = position || cg.p(0,0);
		this._globalFPS = FPS;
	},

	run : function(){
		if(!this._gameDirector)
			this._gameDirector = new cg.Director(this._globalFPS);
		this._gameDirector.run();
	}
};

cg.LabelTTF = cg.Node.extend({
	_color : null,
	_text : null,
	_font_size : null,
	_font_family :null,

	ctor : function(text,font_size,font_family,color){
		this.prototype.ctor.call(this);
		this._text = text||' ';
		this._font_family = font_family||cg.FONT_FAMILY;
		this._font_size = font_size||cg.FONT_SIZE;
		this._color = color||'#000000';
	},

	setString : function(text){
		this._text = text;
	},

	draw : function(ctx){
		ctx.font="normal "+this._font_size+"px "+this._font_family;
		ctx.fillStyle=this._color;
		ctx.fillText(this._text,x||this._position.x,this._position.y);
	}
});