var cg = cg || {};


/********************************************
 *                菜单节点
 *******************************************/

cg._globalFontSize = cg.ITEM_SIZE;
cg._globalFontName = "Arial";
cg._globalFontNameRelease = false;

cg.MenuItem = cg.Node.extend({
    _enabled: false,
    _target: null,
    _callback: null,
    _isSelected: false,
    _className: "MenuItem",

    ctor: function (callback, target) {
        var nodeP = cg.Node.prototype;
        nodeP.ctor.call(this);
        this._target = null;
        this._callback = null;
        this._isSelected = false;
        this._enabled = false;

        nodeP.setAnchorPoint.call(this, 0, 0);
        this._target = target || null;
        this._callback = callback || null;
        if (this._callback) {
            this._enabled = true;
        }
    },

    isSelected: function () {
        return this._isSelected;
    },

    setTarget: function (selector, rec) {
        this._target = rec;
        this._callback = selector;
    },

    isEnabled: function () {
        return this._enabled;
    },

    setEnabled: function (enable) {
        this._enabled = enable;
    },

    initWithCallback: function (callback, target) {
        this.anchorX = 0;
        this.anchorY = 0;
        this._target = target;
        this._callback = callback;
        this._enabled = true;
        this._isSelected = false;
        return true;
    },

    rect: function () {
        var locPosition = this._position, locContentSize = this._children[0]._contentSize, locAnchorPoint = this._anchorPoint;
        return cg.rect(locPosition.x - locContentSize.width/2 - locAnchorPoint.x,
            locPosition.y - locContentSize.height/2 - locAnchorPoint.y,
            locContentSize.width, locContentSize.height);
    },

    selected: function () {
        this._isSelected = true;
    },

    unselected: function () {
        this._isSelected = false;
    },

    setCallback: function (callback, target) {
        this._target = target;
        this._callback = callback;
    },

    activate: function () {
        if (this._enabled) {
            var locTarget = this._target, locCallback = this._callback;
            if (!locCallback)
                return;
            if (locTarget && cg.isString(locCallback)) {
                locTarget[locCallback](this);
            } else if (locTarget && cg.isFunction(locCallback)) {
                locCallback.call(locTarget, this);
            } else
                locCallback(this);
        }
    }
});

var _p = cg.MenuItem.prototype;

// Extended properties
/** @expose */
_p.enabled;
cg.defineGetterSetter(_p, "enabled", _p.isEnabled, _p.setEnabled);
cg.MenuItem.create = function (callback, target) {
    return new cg.MenuItem(callback, target);
};

cg.MenuItemSprite = cg.MenuItem.extend({
    _normalImage: null,
    _selectedImage: null,
   _disabledImage: null,
   _className: "MenuItemSprite",

    ctor: function (normalSprite, selectedSprite, three, four, five) {
        cg.MenuItem.prototype.ctor.call(this);
        this._normalImage = null;
        this._selectedImage = null;
        this._disabledImage = null;

        if (selectedSprite !== undefined) {
            normalSprite = normalSprite;
            selectedSprite = selectedSprite;
            var disabledImage, target, callback;

            if (five !== undefined) {
                disabledImage = three;
                callback = four;
                target = five;
            } else if (four !== undefined && cg.isFunction(four)) {
                disabledImage = three;
                callback = four;
            } else if (four !== undefined && cg.isFunction(three)) {
                target = four;
                callback = three;
                disabledImage = cg.Sprite.create(selectedSprite);
            } else if (three === undefined) {
                disabledImage = cg.Sprite.create(selectedSprite);
            }
            this.initWithNormalSprite(normalSprite, selectedSprite, disabledImage, callback, target);
        }
    },

    visit : function(ctx){
        if(this._isSelected)
            this._selectedImage.visit(ctx);
        else
            this._normalImage.visit(ctx);
    },

    setPosition: function(position){
    	if(this._normalImage)
    		this._normalImage.setPosition(position);
    	if(this._selectedImage)
    		this._selectedImage.setPosition(position);
    	if(this._disabledImage)
    		this._disabledImage.setPosition(position);
    	cg.Node.prototype.setPosition.call(this, position);
    },
    getNormalImage: function () {
        return this._normalImage;
    },

    setNormalImage: function (normalImage) {
        if (this._normalImage == normalImage) {
            return;
        }
        if (normalImage) {
            this.addChild(normalImage, 0, cg.NORMAL_TAG);
            normalImage.anchorX = 0;
            normalImage.anchorY = 0;
        }
        if (this._normalImage) {
            this.removeChild(this._normalImage, true);
        }

        this._normalImage = normalImage;
        this.width = this._normalImage.width;
        this.height = this._normalImage.height;
        this._updateImagesVisibility();
    },

    getSelectedImage: function () {
        return this._selectedImage;
    },

    setSelectedImage: function (selectedImage) {
        if (this._selectedImage == selectedImage)
            return;

        if (selectedImage) {
            this.addChild(selectedImage, 0, cg.SELECTED_TAG);
            selectedImage.anchorX = 0;
            selectedImage.anchorY = 0;
        }

        if (this._selectedImage) {
            this.removeChild(this._selectedImage, true);
        }

        this._selectedImage = selectedImage;
        this._updateImagesVisibility();
    },

    getDisabledImage: function () {
        return this._disabledImage;
    },

    setDisabledImage: function (disabledImage) {
        if (this._disabledImage == disabledImage)
            return;

        if (disabledImage) {
            this.addChild(disabledImage, 0, cg.DISABLE_TAG);
            disabledImage.anchorX = 0;
            disabledImage.anchorY = 0;
        }

        if (this._disabledImage)
            this.removeChild(this._disabledImage, true);

        this._disabledImage = disabledImage;
        this._updateImagesVisibility();
    },

    initWithNormalSprite: function (normalSprite, selectedSprite, disabledSprite, callback, target) {
        this.initWithCallback(callback, target);
        this.setNormalImage(normalSprite);
        this.setSelectedImage(selectedSprite);
        this.setDisabledImage(disabledSprite);
        var locNormalImage = this._normalImage;
        if (locNormalImage) {
            this.width = locNormalImage.width;
            this.height = locNormalImage.height;
        }
        this.cascadeColor = true;
        this.cascadeOpacity = true;
        return true;
    },

   setColor: function (color) {
       this._normalImage.color = color;
       if (this._selectedImage)
           this._selectedImage.color = color;
       if (this._disabledImage)
            this._disabledImage.color = color;
    },


    getColor: function () {
        return this._normalImage.color;
    },

    setOpacity: function (opacity) {
        this._normalImage.opacity = opacity;

        if (this._selectedImage)
            this._selectedImage.opacity = opacity;

        if (this._disabledImage)
            this._disabledImage.opacity = opacity;
    },

    getOpacity: function () {
        return this._normalImage.opacity;
    },

    selected: function () {
        cg.MenuItem.prototype.selected.call(this);
        if (this._normalImage) {
            if (this._disabledImage)
                this._disabledImage.visible = false;

            if (this._selectedImage) {
                this._normalImage.visible = false;
                this._selectedImage.visible = true;
            } else
                this._normalImage.visible = true;
        }
    },

    unselected: function () {
        cg.MenuItem.prototype.unselected.call(this);
        if (this._normalImage) {
            this._normalImage.visible = true;

            if (this._selectedImage)
                this._selectedImage.visible = false;

            if (this._disabledImage)
                this._disabledImage.visible = false;
        }
    },

    setEnabled: function (bEnabled) {
        if (this._enabled != bEnabled) {
            cg.MenuItem.prototype.setEnabled.call(this, bEnabled);
            this._updateImagesVisibility();
        }
    },

    _updateImagesVisibility: function () {
        var locNormalImage = this._normalImage, locSelImage = this._selectedImage, locDisImage = this._disabledImage;
        if (this._enabled) {
            if (locNormalImage)
                locNormalImage.visible = true;
            if (locSelImage)
                locSelImage.visible = false;
            if (locDisImage)
                locDisImage.visible = false;
        } else {
            if (locDisImage) {
                if (locNormalImage)
                    locNormalImage.visible = false;
                if (locSelImage)
                    locSelImage.visible = false;
                if (locDisImage)
                    locDisImage.visible = true;
            } else {
                if (locNormalImage)
                    locNormalImage.visible = true;
                if (locSelImage)
                    locSelImage.visible = false;
            }
        }
    }
});

var _p = cg.MenuItemSprite.prototype;

_p.normalImage;
cg.defineGetterSetter(_p, "normalImage", _p.getNormalImage, _p.setNormalImage);
_p.selectedImage;
cg.defineGetterSetter(_p, "selectedImage", _p.getSelectedImage, _p.setSelectedImage);
_p.disabledImage;
cg.defineGetterSetter(_p, "disabledImage", _p.getDisabledImage, _p.setDisabledImage);

cg.MenuItemSprite.create = function (normalSprite, selectedSprite, three, four, five) {
    return new cg.MenuItemSprite(normalSprite, selectedSprite, three, four, five || undefined);
};

cg.MenuItemImage = cg.MenuItemSprite.extend({
	_normalImage: null,
    _selectedImage: null,
    _disabledImage: null,
    _className: "MenuItemImage",


    ctor: function (normalImage, selectedImage, three, four, five) {
        var normalSprite = null,
            selectedSprite = null,
            disabledSprite = null,
            callback = null,
            target = null;

        if (normalImage === undefined) {
            cg.MenuItemSprite.prototype.ctor.call(this);
        }
        else {
            normalSprite = cg.Sprite.create(normalImage);
            selectedImage &&
            (selectedSprite = cg.Sprite.create(selectedImage));
            if (four === undefined) {
                callback = three;
            }
            else if (five === undefined) {
                callback = three;
                target = four;
            }
            else if (five) {
                disabledSprite = cg.Sprite.create(three);
                callback = four;
                target = five;
            }
            cg.MenuItemSprite.prototype.ctor.call(this, normalSprite, selectedSprite, disabledSprite, callback, target);
        }
    },

    setNormalSpriteFrame: function (frame) {
        this.setNormalImage(cg.Sprite.create(frame));
    },

    setSelectedSpriteFrame: function (frame) {
        this.setSelectedImage(cg.Sprite.create(frame));
    },

    setDisabledSpriteFrame: function (frame) {
        this.setDisabledImage(cg.Sprite.create(frame));
    },

    initWithNormalImage: function (normalImage, selectedImage, disabledImage, callback, target) {
        var normalSprite = null;
        var selectedSprite = null;
        var disabledSprite = null;

        if (normalImage) {
            normalSprite = cg.Sprite.create(normalImage);
        }
        if (selectedImage) {
            selectedSprite = cg.Sprite.create(selectedImage);
        }
        if (disabledImage) {
            disabledSprite = cg.Sprite.create(disabledImage);
        }
        return this.initWithNormalSprite(normalSprite, selectedSprite, disabledSprite, callback, target);
    }
});
cg.MenuItemImage.create = function (normalImage, selectedImage, three, four, five) {
    return new cg.MenuItemImage(normalImage, selectedImage, three, four, five);
};



cg.MENU_STATE_WAITING = 0;
cg.MENU_STATE_TRACKING_TOUCH = 1;
cg.MENU_HANDLER_PRIORITY = -128;
cg.DEFAULT_PADDING = 5;

cg.Menu = cg.Layer.extend({
    enabled: false,

    _selectedItem: null,
    _state: -1,
    _touchListener: null,
    _className: "Menu",

    ctor: function (menuItems) {
        cg.Layer.prototype.ctor.call(this);
        this._color = cg.color.WHITE;
        this.enabled = false;
        this._opacity = 255;
        this._selectedItem = null;
        this._state = -1;

        this._touchListener = cg.EventListener.create({
            event: cg.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this._onTouchBegan,
            onTouchMoved: this._onTouchMoved,
            onTouchEnded: this._onTouchEnded,
            onTouchCancelled: this._onTouchCancelled
        });

        if ((arguments.length > 0) && (arguments[arguments.length - 1] == null))
            cg.log("参数不能以null结尾");

        var argc = arguments.length, items;
        if (argc == 0) {
            items = [];
        } else if (argc == 1) {
            if (menuItems instanceof Array) {
                items = menuItems;
            }
            else items = [menuItems];
        }
        else if (argc > 1) {
            items = [];
            for (var i = 0; i < argc; i++) {
                if (arguments[i])
                    items.push(arguments[i]);
            }
        }
        this.initWithArray(items);
    },

    onEnter: function () {
        var locListener = this._touchListener;
        if (!locListener._isRegistered())
            cg.eventManager.addListener(locListener, this);
        cg.Node.prototype.onEnter.call(this);
    },

    isEnabled: function () {
        return this.enabled;
    },

    setEnabled: function (enabled) {
        this.enabled = enabled;
    },

    initWithItems: function (args) {
        var pArray = [];
        if (args) {
            for (var i = 0; i < args.length; i++) {
                if (args[i])
                    pArray.push(args[i]);
            }
        }

        return this.initWithArray(pArray);
    },

    initWithArray: function (arrayOfItems) {
        if (cg.Layer.prototype.init.call(this)) {
            this.enabled = true;

            var winSize = cg.winSize;
            this.setPosition(winSize.width / 2, winSize.height / 2);
            this.setContentSize(winSize);
            this.setAnchorPoint(0, 0);

            if (arrayOfItems) {
                for (var i = 0; i < arrayOfItems.length; i++)
                    this.addChild(arrayOfItems[i], i);
            }

            this._selectedItem = null;
            this._state = cg.MENU_STATE_WAITING;

            this.cascadeColor = true;
            this.cascadeOpacity = true;

            return true;
        }
        return false;
    },

    addChild: function (child, zOrder, tag) {
        if (!(child instanceof cg.MenuItem))
            throw "cg.Menu.addChild() :Menu只能接受MenuItem类数据作为子节点";
        cg.Layer.prototype.addChild.call(this, child, zOrder, tag);
    },

    removeChild: function (child, cleanup) {
        if (child == null)
            return;
        if (!(child instanceof cg.MenuItem)) {
            cg.log("cg.Menu.removeChild():Menu只能接受MenuItem类数据作为子节点");
            return;
        }

        if (this._selectedItem == child)
            this._selectedItem = null;
        cg.Node.prototype.removeChild.call(this, child, cleanup);
    },

    _onTouchBegan: function (touch, event) {
        var target = event.getCurrentTarget();
        if (target._state != cg.MENU_STATE_WAITING || !target._visible || !target.enabled)
            return false;

        for (var c = target.parent; c != null; c = c.parent) {
            if (!c.isVisible())
                return false;
        }

        target._selectedItem = target._itemForTouch(touch);
        if (target._selectedItem) {
            target._state = cg.MENU_STATE_TRACKING_TOUCH;
            target._selectedItem.selected();
            return true;
        }
        return false;
    },

    _onTouchEnded: function (touch, event) {
        var target = event.getCurrentTarget();
        if (target._state !== cg.MENU_STATE_TRACKING_TOUCH) {
            cg.log("cg.Menu.onTouchEnded(): 未知状态");
            return;
        }
        if (target._selectedItem) {
            target._selectedItem.unselected();
            target._selectedItem.activate();
        }
        target._state = cg.MENU_STATE_WAITING;
    },

    _onTouchCancelled: function (touch, event) {
        var target = event.getCurrentTarget();
        if (target._state !== cg.MENU_STATE_TRACKING_TOUCH) {
            cg.log("cg.Menu.onTouchCancelled(): 未知状态");
            return;
        }
        if (this._selectedItem)
            target._selectedItem.unselected();
        target._state = cg.MENU_STATE_WAITING;
    },

    _onTouchMoved: function (touch, event) {
        var target = event.getCurrentTarget();
        if (target._state !== cg.MENU_STATE_TRACKING_TOUCH) {
            cg.log("cg.Menu.onTouchMoved(): 未知状态");
            return;
        }
        var currentItem = target._itemForTouch(touch);
        if (currentItem != target._selectedItem) {
            if (target._selectedItem)
                target._selectedItem.unselected();
            target._selectedItem = currentItem;
            if (target._selectedItem)
                target._selectedItem.selected();
        }
    },

    onExit: function () {
        if (this._state == cg.MENU_STATE_TRACKING_TOUCH) {
            if (this._selectedItem) {
                this._selectedItem.unselected();
                this._selectedItem = null;
            }
            this._state = cg.MENU_STATE_WAITING;
        }
        cg.Node.prototype.onExit.call(this);
    },
    

    _itemForTouch: function (touch) {
        var touchLocation = this.getLocation(touch);
        var itemChildren = this._children, locItemChild;
        if (itemChildren && itemChildren.length > 0) {
            for (var i = itemChildren.length - 1; i >= 0; i--) {
                locItemChild = itemChildren[i];
                if (locItemChild.isVisible() && locItemChild.isEnabled()) {
                    var r = locItemChild.rect();
                    if (cg.rectContainsPoint(r, touchLocation))
                        return locItemChild;
                }
            }
        }
        return null;
    },

    getLocation : function(touch){
        if(touch.offsetX){
            return cg.p(touch.offsetX,touch.offsetY)
        }
        return cg.p(touch.clientX - cg.winPosition.x,touch.clientY - cg.winPosition.y)
    }
});

cg.Menu.create = function (menuItems) {
    var argc = arguments.length;
    if ((argc > 0) && (arguments[argc - 1] == null))
        cg.log("参数不能以null结尾");

    var ret;
    if (argc == 0)
        ret = new cg.Menu();
    else if (argc == 1)
        ret = new cg.Menu(menuItems);
    else
        ret = new cg.Menu(Array.prototype.slice.call(arguments, 0));
    return ret;
};