/**
 *
 * @author
 *星星
 */
class Star extends egret.Sprite {
    private static cacheDict: Object = {};
    /**生产*/
    public static produce(_textureName: string): Star {
        var textureName = _textureName;
        if (Star.cacheDict[textureName] == null)
            Star.cacheDict[textureName] = [];
        var dict: Star[] = Star.cacheDict[textureName];
        var temp: Star;
        if (dict.length > 0) {
            temp = dict.pop();
        } else {
            temp = new Star(textureName);
        }
        return temp;
    }
    /**回收*/
    public static reclaim(target: Star): void {
        if (Star.cacheDict[target.textureName] == null)
            Star.cacheDict[target.textureName] = [];
        var dict: Star[] = Star.cacheDict[target.textureName];
        if (dict.indexOf(target) == -1)
            dict.push(target);
        Tool.remove(target);
    }

    public textureName: string;
    public constructor(_textureName) {
        super();
        this.textureName = _textureName;
        var temp: egret.Bitmap = Tool.createBitmapByName(this.textureName);
        Tool.anchorXY(temp);
        temp.x = temp.width;
        temp.y = temp.height;
        this.addChild(temp);
        this.loop(temp);
    }
    private loop(target): void {
        var num = Math.random() * 0.7 + 0.3;
        target.x = Tool.getRandom(0, 640);
        target.y = Tool.getRandom(0, 1030);
        target.alpha = 0;
        egret.Tween.get(target)
            .to({ scaleX: num, scaleY: num, alpha: num }, Tool.gear(Math.random() * 250 + 400), egret.Ease.quadInOut)
            .to({ scaleX: num / 2, scaleY: num / 2, alpha: 0 }, Tool.gear(Math.random() * 250 + 400), egret.Ease.quadInOut).call(this.loop, this, [target]);
    }
}