var cg = cg || {};

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