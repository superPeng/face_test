class LoadingUI extends egret.Sprite {
    //public textField: egret.BitmapText;
    public textField: egret.TextField;
    private loaded: number = 0;
    private count: number = 0;
    private myTimer: egret.Timer;
    private box: egret.Sprite;
    private resName: string;
    public constructor(_resName?: string) {
        super();
        this.resName = _resName;
        // this.textField = new egret.BitmapText();
        // var font: egret.BitmapFont = RES.getRes("num_fnt");
        // this.textField.font = font;
        // this.textField.textAlign = "center";
        // this.addChild(this.textField);
        // this.textField.x = 237;
        // this.textField.y = 522;
        // this.textField.text = "l0%";

        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.size = 22;
        this.textField.textColor = 0xffffff;
        this.textField.y = 470;
        this.textField.width = 640;
        this.textField.height = 100;
        this.textField.textAlign = "center";

        this.myTimer = new egret.Timer(15);
        this.myTimer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        this.myTimer.start();
    }
    public setProgress(current, total): void {
        var per: number = Math.floor(current / total * 100);
        this.loaded = per;
    }
    private onTimer(): void {
        if (this.loaded > this.count) {
            this.count = this.loaded;
            this.textField.text = "Loading:" + this.count + "%";
            if (this.count >= 100) {
                this.myTimer.stop();
                this.myTimer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
                this.action();
            }
        }
    }
    private tweenOut(): void {
        egret.Tween.get(this.textField).to({ alpha: 0 }, 500, egret.Ease.quadInOut).call(Tool.remove, this, [this.textField]);
        setTimeout(this.action.bind(this), 500);
    }
    private action(): void {
        EM.dispatch().dispatchEvent(new Events(Events.LOAD_COMPLETE, this.resName));
    }
}