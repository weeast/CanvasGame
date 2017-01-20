var cg = cg || {};


/********************************************
 *                帧动画管理器
 *******************************************/
cg.animateManager = {
	_animationMap : {},

	cleanup : function(){
		for(var att in this._animationMap){
			if(this._animationMap.hasOwnProperty(att))
				delete this._animationMapp[att];
		}
	},

	addAnimation : function(animation, node, callfn){
		if(!animation instanceof cg.Animation){
			cg.log(cg._LogInfos.AnimateManagerAddAnimation);
			return;
		}
		if(!node instanceof cg.Node){
			cg.log(cg._LogInfos.AnimateManagerAddAnimation2);
			return;
		}
		var locNodeID = node.__instanceId;
		animation._setNode(node);
		animation._setCallBack(callfn);
		if(!this._animationMap[locNodeID])
			this._animationMap[locNodeID] = [];
		this._animationMap[locNodeID].push(animation);
	},

	removeAnimation : function(animation){
		var locNode = animation._getNode(),locID;
		if(locNode){
			locID = locNode.__instanceId;
			cg.arrayRemoveObject(this._animationMap[locID]);
		}
	},

	removeAnimationFromTarget : function(node){
		if(this._animationMap[node.__instanceId])
			this._animationMap[node.__instanceId].length = 0;
	},

	update : function(dt){
		for(var ani in this._animationMap)
			this._updateFromAnimation(this._animationMap[ani],dt);
	},

	_updateFromAnimation : function(arr, dt){
		var i =0, len = arr.length;
		for(i;i<len;++i)
			arr[i].step(dt);
	}
};