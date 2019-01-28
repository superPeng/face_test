/**
 *
 * @author 
 * 消息弹窗
 */
/*
//Msg测试
var myMsg: Global.Msg = Global.Msg.getInstance("测试信息11",this.stage);
this.addChild(myMsg);

setTimeout(()=>{
    myMsg.msgWidth = this.stage.stageWidth;
    myMsg.update();
},2000)

setTimeout(()=>{
    myMsg.msgTxt = "是否撒范德萨范德萨发是否撒范德萨范德萨发是否撒范德萨范德萨发是否撒范德萨范德萨发是否撒范德萨范德萨发是否撒范德萨范德萨发是否撒范德萨范德萨发是否撒范德萨范德萨发是否撒范德萨范德萨发"
    myMsg.update();
},4000)

setTimeout(()=>{
    myMsg.msgWidth = this.stage.stageWidth*0.8;
    myMsg.update();
},6000)

setTimeout(()=>{
    myMsg = Global.Msg.getInstance("测试信息11111",this.stage,Global.msgType.tip);
    egret.Tween.removeTweens(myMsg);
    myMsg.alpha = 1;
    this.addChild(myMsg);
},8000)

setTimeout(()=>{
    myMsg = Global.Msg.getInstance("测试信息2222",this.stage,Global.msgType.tip);
    egret.Tween.removeTweens(myMsg);
    myMsg.alpha = 1;
    this.addChild(myMsg);
},10000)

setTimeout(()=>{
    myMsg = Global.Msg.getInstance("测试信息3333");
    egret.Tween.removeTweens(myMsg);
    myMsg.alpha = 1;
    this.addChild(myMsg);
},12000)
 */
module Global {
    export enum msgType {
        regular,//正常消息模式，带确认按钮
        tip//提示消息，自动消失
    };
    export class Msg extends egret.Sprite {
        public static instance: Msg;
        /**
        * 获取对象实例
        * @param _msgstr 消息文字:string
        * @param _stage 场景舞台
        * @param _type 消息类型:msgType
        */
        public static createInstance(_msgstr: string, _stage, _type: msgType = msgType.regular): Msg {
            if (Msg.instance == null) {
                Msg.instance = new Msg(_msgstr, _stage, _type);
            } else {
                Msg.instance.msgTxt = _msgstr;
                Msg.instance._stage = _stage;
                Msg.instance._type = _type;
                Msg.instance.update();
            }
            return Msg.instance;
        }
        //--------------------------------------------------------------------------------------
        private 

        //--------------------------------------------------------------------------------------
        private _type;//消息类型:msgType
        private _stage;//场景舞台
        private str: string;
        /**
         * @param _msgstr 消息文字:string
         * @param _type 消息类型:msgType
         */
        public constructor(_msgstr: string, _stage, _type: msgType = msgType.regular) {
            super();
            this.str = _msgstr
            this._stage = _stage;
            this._type = _type;
            this._msgWidth = this._stage.stageWidth * 0.8;//消息背景宽
            this._msgHeight = this._stage.stageHeight * 0.9;//消息背景高
            this.createMsg();
        }
        private _msgWidth;
        private _msgHeight;
        private _msgTxt: egret.TextField;//消息内容
        public padding: number = 50;
        private textSize: number = 30;
        private createMsg() {
            var bg: egret.Shape = new egret.Shape();
            //--------------------------------------------------------------------------------------
            var msgContainer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
            this.addChild(msgContainer);
            //--------------------------------------------------------------------------------------
            var msgBg: egret.Bitmap = Tool.createBitmapByName("public_msg_bg_png");
            msgBg.width = this._msgWidth;
            msgContainer.addChild(msgBg);
            //--------------------------------------------------------------------------------------
            var msgTxt: egret.TextField = new egret.TextField();
            msgTxt.textColor = 0x000000;
            msgTxt.size = this.textSize;
            msgTxt.textAlign = "center";
            msgTxt.lineSpacing = 10;
            msgTxt.x = this.padding;
            msgTxt.y = this.padding;
            msgTxt.text = this.str;
            this._msgTxt = msgTxt;
            msgContainer.addChild(msgTxt);

            var btn: egret.Sprite;
            //更新接口
            this.update = function () {
                egret.Tween.removeTweens(msgContainer);
                msgContainer.alpha = 1;
                if (this._type == msgType.regular) {
                    if (btn) {
                        msgContainer.addChild(btn);
                    } else {
                        btn = this.createBtn("确定");
                        btn.y = msgBg.height - 100;
                        msgContainer.addChild(btn);
                    }
                } else {
                    Tool.remove(btn);
                }
                bg.graphics.clear();
                bg = new egret.Shape();
                bg.graphics.beginFill(0x000000);
                bg.graphics.drawRect(0, 0, this._stage.stageWidth, this._stage.stageHeight);
                bg.graphics.endFill();
                bg.alpha = 0.3;
                bg.touchEnabled = true;
                this.addChild(bg);
                this.setChildIndex(bg, 0);

                msgBg.width = this._msgWidth;

                msgTxt.width = this._msgWidth - this.padding * 2;

                if (this._type == msgType.regular) {
                    msgBg.height = msgTxt.height + 100 + this.padding * 2;
                    if (msgBg.height > this._msgHeight) {
                        msgBg.height = this._msgHeight;
                        msgTxt.height = this._msgHeight - 100 - this.padding * 2;
                    }
                } else if (this._type == msgType.tip) {
                    msgBg.height = msgTxt.height + this.padding * 2;
                    if (msgBg.height > this._msgHeight) {
                        msgBg.height = this._msgHeight;
                        msgTxt.height = this._msgHeight - this.padding * 2;
                    }
                }

                if (this._type == msgType.regular) {
                    btn["update"]();
                    btn.y = msgBg.height - 100;
                }

                msgContainer.x = Math.round(this._stage.stageWidth / 2);
                msgContainer.y = Math.round(this._stage.stageHeight / 2);
                msgContainer.anchorOffsetX = Math.round(msgContainer.width / 2);
                msgContainer.anchorOffsetY = Math.round(msgContainer.height / 2);

                if (this._type == msgType.tip) {
                    msgContainer.y += 100;
                    msgContainer.alpha = 0;
                    egret.Tween.get(msgContainer).to({ y: msgContainer.y - 100, alpha: 1 }, 300, egret.Ease.quadOut)
                        .wait(1000).to({ y: msgContainer.y - 200, alpha: 0 }, 300, egret.Ease.quadIn)
                        .call(this.hideMsg, this);
                }
            }
            this.update();
        }
        private createBtn(str): egret.Sprite {
            var btn: egret.Sprite = new egret.Sprite();

            var tbg: egret.Bitmap = Tool.createBitmapByName("public_msg_btn_bg_png");
            tbg.width = this._msgWidth;
            tbg.alpha = 0;

            var line: egret.Sprite = new egret.Sprite();
            line.graphics.beginFill(0xd2d3d5);
            line.graphics.drawRect(0, 0, this._msgWidth, 1);
            line.graphics.endFill();

            var text: egret.TextField = new egret.TextField();
            text.textColor = 0x00c200;
            text.size = this.textSize + 4;
            text.textAlign = "center";
            text.width = this._msgWidth;
            text.text = str;
            text.y = Math.round((tbg.height - text.textHeight) / 2);

            btn.addChild(tbg);
            btn.addChild(line);
            btn.addChild(text);

            //更新UI接口
            btn["update"] = () => {
                tbg.width = this._msgWidth;
                
                line.graphics.clear();
                line = new egret.Sprite();
                line.graphics.beginFill(0xd2d3d5);
                line.graphics.drawRect(0, 0, this._msgWidth - 1, 1);
                line.graphics.endFill();
                btn.addChild(line);
                btn.setChildIndex(line, 0);
                text.width = this._msgWidth;
            }
            //----------------------------------------------------------------------------------------------
            //添加事件
            this.onBegin = function (e: egret.TouchEvent) {
                this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
                egret.Tween.get(tbg).to({ alpha: 1 }, 100);
            }
            this.onEnd = function () {
                this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
                egret.Tween.get(tbg).to({ alpha: 0 }, 100);
            }
            btn["name"] = "ok";
            btn.touchEnabled = true;
            btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);

            return btn;
        }
        private addEvent(btn): void {
            btn.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
            btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTap, this);
            btn.touchEnabled = true;
        }
        private onBegin: Function;
        private onEnd: Function;

        private onTap(e: egret.TouchEvent): void {
            if (e.currentTarget["name"] == "ok") {
                this.touchChildren = false;
                this.hideMsg();
            }
        }
        /**
         * 隐藏消息
         */
        private hideMsg(): void {
            egret.Tween.removeTweens(this);
            egret.Tween.get(this).to({ alpha: 0 }, 100, egret.Ease.quadInOut).call(Tool.remove, this, [this]);
        }

        /**
         * 设置消息宽度
         */
        public set msgWidth(value: number) {
            console.log("msgWidth:" + value);
            this._msgWidth = value;
        }
        /**
         * 获取消息宽度
         */
        public get msgWidth() {
            return this._msgWidth;
        }
        /**
         * 设置消息高度
         */
        public set msgHeight(value: number) {
            this._msgHeight = value;
        }
        /**
         * 获取消息高度
         */
        public get msgHeight() {
            return this._msgHeight;
        }
        /**
         * 设置消息内容
         */
        public set msgTxt(value: string) {
            this._msgTxt.text = value;
        }
        /**
         * 更新消息UI布局，当更改 宽、高、内容 时发生
         */
        public update: Function;
    }
}