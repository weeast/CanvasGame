var cg = cg || {};

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
	GetActionByTag: 'GetActionByTag TODO',
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
}