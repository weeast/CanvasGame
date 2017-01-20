var currentLayer = null;

var PlayLayer = cg.Layer.extend({
    bgSprite: null,
    SushiSprites: null,
    scoreLabel: null,
    timeoutLabel: null,
    score: null,
    timeout: null,
    count : 0,
    ctor: function() {
        this._super();
        this.SushiSprites = [];
        this.score = 0;
        this.timeout = 60;

        var size = cg.winSize;

        this.timeoutLabel = new cg.LabelTTF("" + this.timeout, "", 38);
        this.timeoutLabel.x = size.width-38;
        this.timeoutLabel.y = size.height-38;
        this.addChild(this.timeoutLabel,5);

        this.scoreLabel = new cg.LabelTTF("score:" + this.score, "", 38);
        this.scoreLabel.x = 75;
        this.scoreLabel.y = size.height-38;
        this.addChild(this.scoreLabel,5);

        //cg.spriteFrameCache.addSpriteFrames(res.Sushi_plist);

        // add bg
        this.bgSprite = new cg.Sprite('./res/background.png');
        this.bgSprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            //scale: 0.5,
            rotation: 180
        });
        this.addChild(this.bgSprite, 0);
        this.addSushi();
        this.schedule(this.update, 1, 16 * 1024, 1);
        this.schedule(this.timer, 1, this.timeout, 1);
        return true;
    },

    update: function() {
        cg.log(this.count++);
        this.addSushi();
        this.removeSushi();
    },

    addSushi: function() {

        var sushi = new SushiSprite('./res/sushi_1n.png');
        var size = cg.winSize;

        var x = 150 / 2 + size.width / 2 * cg.random0To1();
        sushi.setPosition(cg.p(x,30));

        var dorpAction = cg.MoveTo.create(4, cg.p(sushi.getPositionX(), size.height - 30));
        sushi.runAction(dorpAction);

        this.SushiSprites.push(sushi);

        this.addChild(sushi, 5);
    },

    removeSushi: function() {
        //移除到屏幕底部的sushi
        for (var i = 0; i < this.SushiSprites.length; i++) {
            if (cg.winSize.height - 40 < this.SushiSprites[i].getPositionY()) {
                cg.log("removeSushi.........");
                this.SushiSprites[i].removeFromParent();
                this.SushiSprites[i] = undefined;
                this.SushiSprites.splice(i, 1);
                i = i - 1;
            }
        }
    },

    addScore: function() {
        this.score += 1;
        this.scoreLabel.setString("score:" + this.score);
    },

    timer: function() {

        if (this.timeout == 0) {
            //cg.log('游戏结束');
            var gameOver = new cg.LayerColor(cg.color(225, 225, 225, 100));
            var size = cg.winSize;
            var titleLabel = new cg.LabelTTF("Game Over", "Arial", 38);
            titleLabel.attr({
                x: size.width / 2,
                y: size.height / 2
            });
            gameOver.addChild(titleLabel, 5);
            var TryAgainItem = new cg.MenuItemFont(
                "Try Again",
                function() {
                    cg.log("Menu is clicked!");
                    var transition = new cg.TransitionMoveInR(1, new PlayScene(), cg.color(255, 255, 255, 255));
                    cg.director.runScene(transition);
                }, this);
            TryAgainItem.attr({
                x: size.width / 2,
                y: size.height / 2 - 60,
                anchorX: 0.5,
                anchorY: 0.5
            });

            var menu = new cg.Menu(TryAgainItem);
            menu.x = 0;
            menu.y = 0;
            gameOver.addChild(menu, 1);
            this.getParent().addChild(gameOver);

            this.unschedule(this.update);
            this.unschedule(this.timer);
            return;
        }

        this.timeout -= 1;
        this.timeoutLabel.setString("" + this.timeout);

    }
});

var PlayScene = cg.Scene.extend({
    onEnter: function() {
        this._super();
        currentLayer = new PlayLayer();
        this.addChild(currentLayer);
        //cg.director.setFPS(0.5);
    }
});