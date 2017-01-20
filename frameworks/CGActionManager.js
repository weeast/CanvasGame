var cg = cg || {};


/********************************************
 *                动作管理器
 *******************************************/

cg.ACTION_TAG_NORMAL = 1;
cg.actionManager = {
	_actionMap : [],
	_nodeActionsMap : {},

	cleanup : function(){
		this._actionMap.length = 0;
		for(var att in this._nodeActionsMap){
			if(this._nodeActionsMap.hasOwnProperty(att))
				delete this._nodeActionsMapp[att];
		}
	},

	addAction : function(action, node){
		action.setNode(node);
		var locTag = action.getTarget() ,locNodeID = node.__instanceId;
		this._actionMap.push(action);
		if(!this._nodeActionsMap[locNodeID])
			this._nodeActionsMap[locNodeID] = [];
		this._nodeActionsMap[locNodeID].push(action);
	},

	removeAllActionsFromTarget : function(node){
		var locID = node.__instanceId, actions = this._nodeActionsMap[locID],i,len;
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
		cg.arrayRemoveArray(this._actionMap,tagAction);
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
		var i=0,len = this._actionMap.length;
		for(;i<len;++i)
			this._actionMap[i].step(dt);
	}
};