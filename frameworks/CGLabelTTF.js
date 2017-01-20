var cg = cg || {};


/********************************************
 *                字体节点
 *******************************************/

cg.LabelTTF = cg.Node.extend({
	_color : null,
	_text : null,
	_font_size : null,
	_font_family :null,

	ctor : function(text,font_size,font_family,color){
		cg.Node.prototype.ctor.call(this);
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
		ctx.fillText(this._text,this.x||this._position.x,this.y||this._position.y);
	}
});