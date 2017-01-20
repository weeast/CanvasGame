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

cg.random0To1 = Math.random;