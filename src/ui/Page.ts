class Page extends egret.Sprite {
	public static instance: Page;
	/*
	 * 获取对象实例
	 */ 
	public static getInstance():Page{
	    if(Page.instance==null)
            Page.instance = new Page();
        return Page.instance;
	}
	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.createView, this);
	}
	private createView():void{
		//创建场景
	}

	private btn: egret.Bitmap;
    private addEvent(btn): void {
        btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
        btn.touchEnabled = true;
        this.btn = btn;
    }
    private onBegin(e: egret.TouchEvent): void {
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        this.btn = e.currentTarget;
        egret.Tween.get(this.btn).to({ scaleX: 0.9, scaleY: 0.9 }, 100);
    }
    private onEnd(e: egret.TouchEvent): void {
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
        egret.Tween.get(this.btn).to({ scaleX: 1, scaleY: 1 }, 100);
    }
    private onTap(e: egret.TouchEvent): void {
        if (e.currentTarget["name"] == "btn1") {
            e.currentTarget.touchEnabled = false;
            e.currentTarget.touchChildren = false;
            EM.dispatch().dispatchEventWith("showRule");
        } else if (e.currentTarget["name"] == "btn2") {
            EM.dispatch().dispatchEventWith("showRule");
        }
    }
}