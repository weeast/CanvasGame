
var HelloWorldLayer = cg.Layer.extend({
    sprite:null,
    ctor:function () {

        this._super();

        var size = cg.winSize;

        var closeItem = new cg.MenuItemImage(
            './res/CloseNormal.png',
            './res/CloseSelected.png',
            function () {
                cg.log("Menu is clicked!");
            }, this);

        closeItem.setPosition(cg.p(size.width - 20,20));

        var menu = new cg.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);


        var helloLabel = new cg.LabelTTF("Hello World", "Arial", 38);

        helloLabel.x = size.width / 2;
        helloLabel.y = 0;
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);

        // add "HelloWorld" splash screen"
        this.sprite = new cg.Sprite('./res/HelloWorld.png');
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 0.5,
            rotation: 180
        });
        this.addChild(this.sprite, 0);
        return true;
    }
});

var HelloWorldScene = cg.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

