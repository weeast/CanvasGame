var StartLayer = cg.Layer.extend({
    ctor: function() {
        this._super();

        var size = cg.winSize;

        var helloLabel = new cg.LabelTTF("Hello World", "", 38);
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2;
        this.addChild(helloLabel);
        helloLabel.setName("helloLabel");
        this.bgSprite = new cg.Sprite('./res/background.png');
        this.bgSprite.attr({
            x: size.width / 2,
            y: size.height / 2,
        });
        this.addChild(this.bgSprite, 0);
        this.bgSprite.setName("background");
        //add start menu
        var startItem = new cg.MenuItemImage(
            './res/Start_N.png',
            './res/Start_S.png',
            function() {
                cg.log("Menu is clicked!");
                cg.director.runScene(new PlayScene());
            }, this);
        startItem.setPosition(cg.p(size.width / 2,size.height / 2));
        startItem.attr({
            x: size.width / 2,
            y: size.height / 2,
            anchorX: 0,
            anchorY: 0
        });
        startItem.setName("startButton");

        var menu = new cg.Menu(startItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);
        menu.setName("menu");
        return true;
    }
});

var StartScene = cg.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new StartLayer();
        this.addChild(layer);
    }
});