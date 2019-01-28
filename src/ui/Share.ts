/**
 *
 * @author 
 *
 */
class Share extends egret.Sprite {
    public static instance: Share;
	/*
	 * 获取对象实例
	 */
    public static getInstance(): Share {
        if (Share.instance == null)
            Share.instance = new Share();
        return Share.instance;
    }
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    private onAddToStage(event: egret.Event) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.scene();
    }
    private scene() {
        var bg = Tool.createSprite(0x000000);
        bg.alpha = 0.85;
        this.addChild(bg);
        bg.touchEnabled = true;

        var data = RES.getRes("share_arrow_json");
        var texture = RES.getRes("share_arrow_png");
        var mcDataFactory = new egret.MovieClipDataFactory(data, texture);
        var arrow = new egret.MovieClip(mcDataFactory.generateMovieClipData("share_arrow"));
        this.addChild(arrow);
        arrow.x = 530;
        arrow.y = 10;
        arrow.play();

        var txt: egret.Bitmap = Tool.createBitmapByName("share_txt_png");
        this.addChild(txt);
        txt.x = 420;
        txt.y = 180;
        txt.alpha = 0;
        egret.Tween.get(txt).wait(1000).to({ alpha: 1 }, 700, egret.Ease.quadOut);

        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        this.touchEnabled = true;
    }

    private onTap(e: egret.TouchEvent): void {
        this.dispatchEventWith("hideLayer");
    }
}
