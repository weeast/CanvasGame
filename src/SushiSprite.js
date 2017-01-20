var SushiSprite = cg.Sprite.extend({
	disappearAction: null,
	onEnter: function() {
		cg.log("onEnter");
		this._super();
		this.addTouchEventListenser();
		this.disappearAction = this.createDisappearAction();
		
	},

	onExit: function() {
		cg.log("onExit");
		this._super();
	},

	getLocation : function(touch){
        if(touch.offsetX){
            return cg.p(touch.offsetX,touch.offsetY)
        }
        return cg.p(touch.clientX - cg.winPosition.x,touch.clientY - cg.winPosition.y)
    },

	addTouchEventListenser: function() {
		this.touchListener = cg.EventListener.create({
			event: cg.EventListener.TOUCH_ONE_BY_ONE,
			// When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
			swallowTouches: true,
			//onTouchBegan event callback function                      
			onTouchBegan: function(touch, event) {
				var pos;
				if(touch.offsetX){
					pos = cg.p(touch.offsetX,touch.offsetY);
				}
				else
					pos = cg.p(touch.clientX - cg.winPosition.x,touch.clientY - cg.winPosition.y);

				var target = event.getCurrentTarget();
				if (cg.rectContainsPoint(target.getBoundingBox(), pos)) {
					cg.log("touched")
					target.removeTouchEventListener();
					//响应精灵点中
					cg.log("pos.x=" + pos.x + ",pos.y=" + pos.y);

					currentLayer.addScore();

					target.stopAllActions();

					/*var ac = target.disappearAction;
					var seqAc = cg.Sequence.create(ac, cg.CallFunc.create(function() {
						cg.log("callfun........");
						target.removeFromParent();

					}, target));*/

					cg.animateManager.addAnimation(target.disappearAction, target, function() {
						cg.log("callfun........");
						target.removeFromParent();

					});
					//target.runAction(seqAc);	

					return true;
				}
				return false;
			}

		});
		cg.eventManager.addListener(this.touchListener, this);
	},

	removeTouchEventListener:function(){
		cg.eventManager.removeListener(this.touchListener);
	},

	createDisappearAction: function() {
		var frames = [];
		for (var i = 0; i < 11; i++) {
			var str = "sushi_1n_" + i + ".png"
				//cg.log(str);
			//var frame = cg.spriteFrameCache.getSpriteFrame(str);
			frames.push(str);
		}

		var animation = new cg.Animation(frames, 0.02);
		//var action = new cg.Animate(animation);

		return animation;
	},
});