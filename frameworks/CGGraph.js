var cg = cg || {};
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