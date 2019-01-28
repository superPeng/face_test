//简单的应用
// var sheetDict = [];
// var resname: string;
// for (var i: number = 1; i <= 23; i++) {
//     resname = "anan1_" + i + "_png";
//     sheetDict.push(RES.getRes(resname));
// }
// var mySheet: SheetFactory = new SheetFactory(sheetDict, 50, 2)
// this.addChild(mySheet);
// mySheet.addEventListener("complete", this.onSheetComplete, this);

//可以倒序播放，按住鼠标左右拖动
// var sheetDict = [];
// var resname: string;
// for (var i: number = 0; i <= 23; i++) {
//     resname = "nw_" + i + "_png";
//     sheetDict.push(RES.getRes(resname));
// }
// var mySheet: SheetFactory = new SheetFactory(sheetDict, 50);
// this.addChild(mySheet);
// mySheet.pause();
// var startX = 0;
// this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, (e) => {
//     mySheet.index = Math.round((e.stageX - startX) / 10);
// }, this)

/**
 * 序列图播放
 */
class SheetFactory extends egret.Sprite {
    /**
     * @param list 序列图列表<egeret.Texture>
     * @param delay 播放间隔 number
     * @param loop 播放次数 number
     */
    public constructor(list: Array<egret.Texture>, delay: number = 80, loop: number = 0) {
        super();
        this._list = list;
        this._totalNum = this._list.length;
        this._delay = delay;
        this._loop = loop * this._totalNum;
        this.init();
    }
    private _bitmap: egret.Bitmap;//显示对象
    private _list: Array<egret.Texture>;//显示列表
    private _totalNum: number = 0;//总数
    private _index: number = 0;//当前索引
    private _myTimer: egret.Timer;//计时器
    private _delay: number;//间隔
    private _loop: number = 0;//循环次数
    private _status: Boolean = false;//当前是否为播放状态
    private _sign = 1;//index的累加值，顺序(1)或倒序(-1)播放
    private init(): void {
        this._bitmap = new egret.Bitmap(this._list[this._index]);
        this.addChild(this._bitmap);
        this.addTimer();
    }
    private addTimer(): void {
        this._myTimer = new egret.Timer(this._delay, this._loop);
        this._myTimer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        if (this._loop > 0) {
            this._myTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onComplete, this);
        }
        this._myTimer.start();
        this._status = true;
    }
    private onTimer(e: egret.TimerEvent): void {
        this._bitmap.texture = this._list[this._index];
        this._index += this._sign;
        if (this._sign > 0) {
            if (this._index >= this._totalNum) {
                this._index = 0;
            }
        } else if (this._sign < 0) {
            if (this._index < 0) {
                this._index = this._totalNum - 1;
            }
        }
    }
    private onComplete(e: egret.TimerEvent): void {
        this.kill();
        this.dispatchEventWith("complete");
    }

    /**
     * 清除当前Timer
     */
    public kill(): void {
        this._myTimer.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        if (this._loop > 0) {
            this._myTimer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onComplete, this);
        }
        this._myTimer.stop();
        this._myTimer = null;
        this._status = false;
    }
    /**
     * 暂停Timer
     */
    public pause(): void {
        if (this._status && this._myTimer) {
            this._myTimer.stop();
            this._status = false;
        }
    }

    /**
     * 继续播放
     */
    public play(): void {
        if (!this._status) {
            if (!this._myTimer) {
                this.addTimer();
            }
            this._myTimer.start();
            this._status = true;
        }
    }

    /**
     * 设置播放间隔
     */
    public set delay(value) {
        this._delay = value;
        if (this._status) {
            this.kill();
            this.play();
        }
    }

    /**
     * 设置当播放索引
     */
    public set index(value) {
        value = Math.round(value);
        if (value >= 0) {
            if (value < this._totalNum) {
                this._index = value;
            } else {
                this._index = value % this._totalNum;
            }
        } else {
            if (-value < this._totalNum) {
                this._index = this._totalNum - 1 + value;
            } else {
                this._index = this._totalNum - 1 + value % this._totalNum;
            }
        }
        this._bitmap.texture = this._list[this._index];
    }

    /**
     * 获取当前播放索引
     */
    public get index(): number {
        return this._index;
    }

    /**
     * 设置播放顺序，1：顺序 ， -1：倒序
     * 设置之后会取消播放次数，默认无限循环
     * 
     */
    public set sign(value) {
        this._sign = value;
        this._loop = 0;
        this.kill();
        this.play();
    }
}