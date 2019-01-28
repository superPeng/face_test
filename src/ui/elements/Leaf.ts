/**
 *
 * @author 
 * 叶子
 *
 */
class Leaf extends egret.Sprite {
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    private onAddToStage(event: egret.Event) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.scene1();
    }

    private rate = 30;
    private leaf_array: Array<any> = [[590, 213], [645, 118], [714, 209], [733, 43], [580, 54], [710, 141], [560, 139]];
    private scene1() {
        for (var i = 0; i < this.leaf_array.length; i++) {
            setTimeout(this.addMc.bind(this), Tool.gear(10,this.rate) * i, [i]);
        }
    }
    private addMc(i) {
        var leafBox = new egret.Sprite();
        this.addChild(leafBox);
        leafBox.x = this.leaf_array[i][0] + 400;
        leafBox.y = this.leaf_array[i][1] - 220;

        var leaf_mc = new egret.Sprite();
        leafBox.addChild(leaf_mc);
        var tw = egret.Tween.get(leaf_mc);
        tw.wait(Tool.gear(0)).to({ x: -800 - Math.round(Math.random() * 200), y: 600 + Math.round(Math.random() * 300) }, Tool.gear(60 + Math.random() * 60,this.rate)).to({ x: 0, y: 0 }).call(this.loopFun, this, [leaf_mc]);//.wait(Tool.gear(Math.round(Math.random()*60)));

        var leafIn = new egret.Sprite();
        leaf_mc.addChild(leafIn);
        var tw = egret.Tween.get(leafIn, { loop: true });
        tw.wait(Tool.gear(0)).to({ scaleX: 0 }, Tool.gear(10,this.rate)).to({ scaleX: -0.001 }).to({ scaleX: -1 }, Tool.gear(10,this.rate)).to({ scaleX: -0.001 }, Tool.gear(10,this.rate)).to({ scaleX: 0 }).to({ scaleX: 1 }, Tool.gear(10,this.rate))

        var leaf = Tool.createBitmapByName("flower_png");
        Tool.anchorXY(leaf);
        leafIn.addChild(leaf);
        leaf.scaleX = leaf.scaleY = 0.3 + Math.random() * 0.7;

        var tw = egret.Tween.get(leaf, { loop: true });
        tw.wait(Tool.gear(0)).to({ rotation: 360 }, Tool.gear(40,this.rate));
    }

    private loopFun(target) {
        var tw = egret.Tween.get(target);
        tw.wait(Tool.gear(0)).to({ x: Math.round(Math.random() * 200), y: Math.round(Math.random() * 200) }).to({ x: -800 - Math.round(Math.random() * 200), y: 600 + Math.round(Math.random() * 300) }, Tool.gear(60 + Math.random() * 60,this.rate)).call(this.loopFun, this, [target]);
    }
}
