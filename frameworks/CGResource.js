var cg = cg || {};


/********************************************
 *                资源管理器
 *******************************************/
cg.resourcesManager = {
	_resourceMap: {},
	_resouceIndex: 1,
	_getImgResource: function(IdorName) {
		var locResource, targetResources = [];
		if (cg.isNumber(IdorName))
			targetResources.push(this._resourceMap[IdorName]);
		else if(cg.isString(IdorName)) {
			for (locResource in this._resourceMap) {
				if (this._resourceMap[locResource].name == IdorName)
					targetResources.push(this._resourceMap[locResource]);
			}
		}
		return targetResources;
	},
	_getImgByURL: function(url) {
		var locResource;
		for (locResource in this._resourceMap) {
			if (this._resourceMap[locResource].url == url)
				return this._resourceMap[locResource];
		}
		return null;
	},
	_pushImgResource: function(urlorResource, callfn, target, name) {
		var img, url = '',
			locId = this._resouceIndex,
			_t = this;
		name = name || "default_img";
		callfn = callfn || new Function();
		var existImg = _t._getImgByURL(urlorResource);
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

			_t._resourceMap[locId] = {
				rid: locId,
				name: name,
				readyState: false,
				url: url,
				resource: img
			};
			_t._resouceIndex++;

			if (img.complete) {
				_t._resourceMap[locId].readyState = true;
				// callfn.call(target);
				return locId;
			}
			img.onload = function() {
				_t._resourceMap[locId].readyState = true;
				callfn.call(target);
			};
			return locId;
		} else {
			if (existImg.readyState) {
				//callfn.call(target);
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
	loadImg: function(url, callfn, target, name) {
		var lastp = url.lastIndexOf("."),
			imgType = url.substr(lastp + 1);
		if (imgType != "jpg" && imgType != "png" && imgType != "icon") {
			cg.log(cg._LogInfos.LoadImgResource);
			return;
		}
		if (!cg.isFunction(callfn)) { 
			return;
		}
		
		return cg.resourcesManager._pushImgResource(url, callfn, target, name);
	}
});