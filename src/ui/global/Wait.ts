/**
 *
 * @author 
 * 消息弹窗
 */
// var myWait = Global.Wait.createInstance("数据加载中...", this.stage);
// var myWait: Global.Wait = Global.Wait.instance;
// this.addChild(myWait);

module Global {
    export enum waitType {
        tip//提示消息，自动消失
    };
    export class Wait extends egret.Sprite {
        public static instance: Wait;
        /**
        * 获取对象实例
        * @param _waitstr 消息文字:string
        * @param _stage 场景舞台
        * @param _type 消息类型:waitType
        */
        public static createInstance(_waitstr: string, _stage, _type: waitType = waitType.tip): Wait {
            if (Wait.instance == null) {
                Wait.instance = new Wait(_waitstr, _stage, _type);
            } else {
                Wait.instance.waitTxt = _waitstr;
                Wait.instance._stage = _stage;
                Wait.instance._type = _type;
                Wait.instance.update();
            }
            return Wait.instance;
        }
        //--------------------------------------------------------------------------------------
        private _type;//消息类型:waitType
        private _stage;//场景舞台
        private str: string;
        /**
         * @param _waitstr 消息文字:string
         * @param _type 消息类型:waitType
         */
        public constructor(_waitstr: string, _stage, _type: waitType = waitType.tip) {
            super();
            this.str = _waitstr
            this._stage = _stage;
            this._type = _type;
            this._waitWidth = this._stage.stageWidth * 0.8;//消息背景宽
            this._waitHeight = this._stage.stageHeight * 0.9;//消息背景高
            this.createWait();
        }
        private _waitWidth;
        private _waitHeight;
        private _waitTxt: egret.TextField;//消息内容
        public padding: number = 50;
        private textSize: number = 24;
        private createWait() {
            var bg: egret.Shape = new egret.Shape();
            //--------------------------------------------------------------------------------------
            var waitContainer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
            this.addChild(waitContainer);
            //--------------------------------------------------------------------------------------
            var waitBg: egret.Bitmap = Tool.createBitmapByName("public_wait_bg_png");
            waitBg.width = this._waitWidth;
            waitContainer.addChild(waitBg);
            //--------------------------------------------------------------------------------------
            var icon: egret.Bitmap = Tool.createBitmapByName("public_wait_icon_png");
            waitContainer.addChild(icon);
            Tool.anchorXY(icon);
            egret.Tween.get(icon,{loop:true}).to({rotation:360},2000)

            var waitTxt: egret.TextField = new egret.TextField();
            waitTxt.textColor = 0xffffff;
            waitTxt.size = this.textSize;
            waitTxt.textAlign = "center";
            waitTxt.lineSpacing = 10;
            waitTxt.x = this.padding;
            waitTxt.y = this.padding;
            waitTxt.text = this.str;
            this._waitTxt = waitTxt;
            waitContainer.addChild(waitTxt);

            //更新接口
            this.update = function () {
                egret.Tween.removeTweens(waitContainer);
                waitContainer.alpha = 1;

                bg.graphics.clear();
                bg = new egret.Shape();
                bg.graphics.beginFill(0x000000);
                bg.graphics.drawRect(0, 0, this._stage.stageWidth, this._stage.stageHeight);
                bg.graphics.endFill();
                bg.alpha = 0.8;
                bg.touchEnabled = true;
                this.addChild(bg);
                this.setChildIndex(bg, 0);

                waitBg.width = this._waitWidth;

                waitTxt.width = this._waitWidth - this.padding * 2;

                if (this._type == waitType.tip) {
                    waitBg.height = waitTxt.height + 100 + this.padding * 2;
                    if (waitBg.height > this._waitHeight) {
                        waitBg.height = this._waitHeight;
                        waitTxt.height = this._waitHeight - 100 - this.padding * 2;
                    }
                } else if (this._type == waitType.tip) {
                    waitBg.height = waitTxt.height + this.padding * 2;
                    if (waitBg.height > this._waitHeight) {
                        waitBg.height = this._waitHeight;
                        waitTxt.height = this._waitHeight - this.padding * 2;
                    }
                }

                icon.x = Math.round(this._waitWidth / 2);
                icon.y = this.padding - 50;

                waitContainer.x = Math.round(this._stage.stageWidth / 2);
                waitContainer.y = Math.round(this._stage.stageHeight / 2);
                waitContainer.anchorOffsetX = Math.round(waitContainer.width / 2);
                waitContainer.anchorOffsetY = Math.round(waitContainer.height / 2);
            }
            this.update();
        }
        /**
         * 隐藏消息
         */
        private hideWait(): void {
            egret.Tween.removeTweens(this);
            egret.Tween.get(this).to({ alpha: 0 }, 100, egret.Ease.quadInOut).call(Tool.remove, this, [this]);
        }

        /**
         * 设置消息宽度
         */
        public set waitWidth(value: number) {
            console.log("waitWidth:" + value);
            this._waitWidth = value;
        }
        /**
         * 获取消息宽度
         */
        public get waitWidth() {
            return this._waitWidth;
        }
        /**
         * 设置消息高度
         */
        public set waitHeight(value: number) {
            this._waitHeight = value;
        }
        /**
         * 获取消息高度
         */
        public get waitHeight() {
            return this._waitHeight;
        }
        /**
         * 设置消息内容
         */
        public set waitTxt(value: string) {
            this._waitTxt.text = value;
        }
        /**
         * 更新消息UI布局，当更改 宽、高、内容 时发生
         */
        public update: Function;
    }
}