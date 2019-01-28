/**
 *
 * @author 
 * 叶子
 *
 */
class Leaf2 extends egret.Sprite {
    public constructor() {
        super();
        this.scene1();
    }
    private rate = 30;
    private leaf_array: Array<any> = [[590, 213], [645, 118], [714, 209], [733, 43], [580, 54], [710, 141], [560, 139]];
    private scene1() {
        for (var i = 0; i < this.leaf_array.length; i++) {
            setTimeout(this.addMc.bind(this), 500 * i, [i]);
        }
        var endX = 100;
        var endY = 0;
    }
    private addMc(i) {
        var leafBox = new egret.Sprite();
        this.addChild(leafBox);
        leafBox.x = Util.stageWidth + 100;
        leafBox.y = Tool.getRandom(-500, 500);

        var raduis = Tool.getRandom(50, 80) * Math.PI / 180;//弧度
        var endX = -100;
        // Math.atan(raduis) = (leafBox.x - endX) / (endY - leafBox.y);
        var endY = (leafBox.x - endX) / Math.atan(raduis) + leafBox.y;

        egret.Tween.get(leafBox).to({ x: endX, y: endY }, 2000).to({ x: 0, y: 0 })
            .call(this.loopFun, this, [leafBox]);

        var leafIn = new egret.Sprite();
        leafBox.addChild(leafIn);
        egret.Tween.get(leafIn, { loop: true }).to({ scaleX: 0 }, 500).to({ scaleX: -0.001 }).to({ scaleX: -1 }, 500).to({ scaleX: -0.001 }, 500).to({ scaleX: 0 }).to({ scaleX: 1 }, 500);

        var leaf = Tool.createBitmapByName("flower_png");
        Tool.anchorXY(leaf);
        leafIn.addChild(leaf);
        leaf.scaleX = leaf.scaleY = 0.3 + Math.random() * 0.7;

        egret.Tween.get(leaf, { loop: true }).to({ rotation: 360 }, 1200);
    }

    private loopFun(target) {
        target.x = Util.stageWidth + 100;
        target.y = Tool.getRandom(-500, 500);
        var raduis = Tool.getRandom(50, 80) * Math.PI / 180;//弧度
        var endX = -100;
        // Math.atan(raduis) = (leafBox.x - endX) / (endY - leafBox.y);
        var endY = (target.x - endX) / Math.atan(raduis) + target.y;
        egret.Tween.get(target).to({ x: endX, y: endY }, 2000).to({ x: 0, y: 0 }).call(this.loopFun, this, [target]);
    }
}
