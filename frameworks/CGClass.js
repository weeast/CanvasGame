var cg = cg || {};
/********************************************
 *                基类部分
 *******************************************/
var ClassManager = {
	id: (0 | (Math.random() * 998)),

	instanceId: (0 | (Math.random() * 998)),

	compileSuper: function(func, name, id) {
		var str = func.toString();
		var pstart = str.indexOf('('),
			pend = str.indexOf(')');
		var params = str.substring(pstart + 1, pend);
		params = params.trim();

		var bstart = str.indexOf('{'),
			bend = str.lastIndexOf('}');
		var str = str.substring(bstart + 1, bend);

		while (str.indexOf('this._super') != -1) {
			var sp = str.indexOf('this._super');

			var bp = str.indexOf('(', sp);

			var bbp = str.indexOf(')', bp);
			var superParams = str.substring(bp + 1, bbp);
			superParams = superParams.trim();
			var coma = superParams ? ',' : '';

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

(function() {
	var fnTest = /\b_super\b/;
	var config = null; 
	var releaseMode = true; 
	if (releaseMode) {
		console.log("release Mode");
	}

	cg.Class = function() {};

	cg.Class.extend = function(props) {
		var _super = this.prototype;

		var prototype = Object.create(_super);

		var classId = ClassManager.getNewID();
		ClassManager[classId] = _super;
		var desc = {
			writable: true,
			enumerable: false,
			configurable: true
		};

		prototype.__instanceId = null;

		function Class() {
			this.__instanceId = ClassManager.getNewInstanceId();
			if (this.ctor)
				this.ctor.apply(this, arguments);
		}

		Class.id = classId;
		desc.value = classId;
		Object.defineProperty(prototype, '__pid', desc);

		Class.prototype = prototype;

		desc.value = Class;
		Object.defineProperty(Class.prototype, 'constructor', desc);

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
							this._super = _super[name];

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

		Class.extend = cg.Class.extend;

		Class.implement = function(prop) {
			for (var name in prop) {
				prototype[name] = prop[name];
			}
		};
		return Class;
	};
})();

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

cg.clone = function(obj) {
	var newObj = (obj.constructor) ? new obj.constructor : {};

	for (var key in obj) {
		var copy = obj[key];
		if (((typeof copy) == "object") && copy &&
			!(copy instanceof cg.Node) && !(copy instanceof HTMLElement)) {
			newObj[key] = cg.clone(copy);
		} else {
			newObj[key] = copy;
		}
	}
	return newObj;
};