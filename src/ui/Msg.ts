class Msg extends egret.Sprite {
    public static instance: Msg;
	/*
	 * 获取对象实例
	 */
    public static getInstance(): Msg {
        if (Msg.instance == null)
            Msg.instance = new Msg();
        return Msg.instance;
    }
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.createView, this);
    }
    private createView(): void {
        //创建场景
        var bg: egret.Sprite = Tool.createSprite(0x000000, [0, 0, pageWidth, pageHeight]);
        this.addChild(bg);
        bg.touchEnabled = true;
        bg.alpha = 0.75;

        var txt: egret.TextField = new egret.TextField();
        txt.width = pageWidth;
        txt.textAlign = "center";
        txt.y = pageHeight * 0.45;
        txt.size = 24;

        this.addChild(txt);

        txt.text = "人脸检测中..."

    }
}