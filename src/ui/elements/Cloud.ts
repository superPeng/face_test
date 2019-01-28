/**
 *
 * @author
 *云
 */
class Cloud extends egret.Sprite {
    public static instance: Cloud;
	/*
	 * 获取对象实例
	 */
    public static getInstance(): Cloud {
        if (Cloud.instance == null)
            Cloud.instance = new Cloud();
        return Cloud.instance;
    }
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.createView, this);
    }
    private createView(): void {
        var cloudBox: egret.Sprite = new egret.Sprite();
        this.addChild(cloudBox);
        var minX = -200;
        var maxX = 1200;
        var minY = 35;
        var maxY = 110;
        var per: number = 1;
        var temp: egret.Bitmap;
        for (var i: number = 0; i < 5; i++) {
            temp = Tool.createBitmapByName("cloud1_png");
            this.addChild(temp);
            Tool.anchorXY(temp);
            
            temp.x = Math.random() * (maxX - minX) + minX;
            temp.y = Math.random() * (maxY - minY) + minY;
            temp.scaleX = temp.scaleY = Math.random() * 0.5 + 0.5;
            temp.alpha = temp.scaleX;
            per = 1 - (temp.x - minX) / (maxX - minX);
            egret.Tween.get(temp).to({ x: maxX }, 25000 * per).call(this.loop, this, [temp]);
        }
    }
    private loop(target): void {
        var minX = -200;
        var maxX = 1500;
        var minY = 21;
        var maxY = 120;
        target.x = minX;
        target.y = Math.random() * (maxY - minY) + minY;
        target.scaleX = target.scaleY = Math.random() * 0.5 + 0.5;
        target.alpha = target.scaleX;
        egret.Tween.get(target).to({ x: maxX }, 25000 * target.scaleX).call(this.loop, this, [target]);
    }
}