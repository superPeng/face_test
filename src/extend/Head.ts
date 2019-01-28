/**
 *
 * @author 
 *
 */
/*
var myHead = new Head();
this.box.addChild(myHead);
myHead.headWidth = 310;
myHead.headHeight = 310;
myHead.maxWidth = 620;
myHead.maxHeight = 620;
myHead.msk = "msk_png";
myHead.updateHead();
myHead.x = 100;
myHead.y = 100;
Util.myHead = myHead;

Util.myHead.renderTexture();//获取当前截图，当照片上传完成执行
Util.myHead.createPoint();//生成点和线条
 */
class Head extends egret.Sprite {
    public static instance: Head;
	/*
	 * 获取对象实例
	 */
    public static getInstance(): Head {
        if (Head.instance == null)
            Head.instance = new Head();
        return Head.instance;
    }
    /**
     * 调用微信头像上传功能时用到
     * 上传完成回调函数
     */
    public static uploadComplete(_data) {
        if (Head.instance) {
            Head.instance.uploadSuccess(_data["headImg"], _data["faceData"]);
        }
    }

    public constructor() {
        super();
        this.createScene();
    }
    private peo: egret.Bitmap;//没用
    private peoBitmap: egret.Bitmap;//没用
    private _msk: egret.Bitmap;//遮罩
    private btn_upload: egret.Sprite;
    private box: egret.Sprite;//顶级容器
    private headBox: egret.Sprite;//照片容器 渲染时的对象
    public myImg: egret.Bitmap;//头像1
    private myHead: egret.Bitmap;//裁切后的头像
    private headX: number = 0;//头像截取X
    private headY: number = 0;//头像截取Y
    public headWidth: number = 150;//头像截取宽
    public headHeight: number = 150;//头像截取高
    public maxWidth: number = 150;//头像默认最大宽
    public maxHeight: number = 150;//头像默认最大高

    public imageBase64: string;//base64码
    private createScene() {
        var box: egret.Sprite = new egret.Sprite();
        this.addChild(box);
        this.box = box;

        var msk: egret.Bitmap = Tool.createBitmapByName("msk_png");
        box.addChild(msk);
        Tool.anchorXY(msk);
        msk.x = this.headX + this.headWidth / 2;
        msk.y = this.headY + this.headHeight / 2;

        this._msk = msk;

        var headBox: egret.Sprite = new egret.Sprite();
        box.addChild(headBox);
        headBox.mask = msk;
        // msk.alpha = 0.5;
        this.headBox = headBox;

        var btn_upload: egret.Sprite = new egret.Sprite();
        btn_upload.graphics.beginFill(0xff0000);
        btn_upload.graphics.drawRect(0, 0, this.headWidth * 1.2, this.headHeight * 1.2);//*1.2 是为了扩大触碰区域，更容易点击
        btn_upload.graphics.endFill();
        btn_upload.x = this.headX - (btn_upload.width - this.headWidth) / 2;
        btn_upload.y = this.headY - (btn_upload.height - this.headHeight) / 2;
        this.addChild(btn_upload);
        // btn_upload.addEventListener(egret.TouchEvent.TOUCH_TAP, this.wxload, this);//微信接口上传
        btn_upload.addEventListener(egret.TouchEvent.TOUCH_TAP, this.doSelect, this);//自带上传
        btn_upload.touchEnabled = true;
        btn_upload.alpha = 0;
        this.btn_upload = btn_upload;
    }
    public set msk(value) {
        this._msk.texture = RES.getRes(value);
        Tool.anchorXY(this._msk);
    }
    //--------------------------------------------------------------------------------------------------------
    private texture;
    public isMove: boolean = false;
    private isChoose = false;
    private tid;
    public doSelect(evt: egret.TouchEvent): void {
        if (!this.isMove) {
            if (!this.isChoose) {
                console.log("选择图片");
                selectImage(this.selectedHandler, this);

                clearTimeout(this.tid);
                this.isChoose = true;
                this.tid = setTimeout(() => {
                    this.isChoose = false
                }, 2000);
            }
        }
    }
    private selectedHandler(thisRef: any, imgURL: string): void {
        // RES.getResByUrl(imgURL, thisRef.compFunc, thisRef, RES.ResourceItem.TYPE_IMAGE);
        // console.log(imgURL);//图片的 base64数据，在手机上貌似不是，待测试

        // var info = EXIF.getAllTags(imgURL);
        // alert(info);
        // console.log(info);

        var imageLoader: egret.ImageLoader = new egret.ImageLoader();
        imageLoader.addEventListener(egret.Event.COMPLETE, thisRef.compFunc2, thisRef);
        imageLoader.load(imgURL);
    }

    private compFunc2(evt: egret.Event): void {
        console.log("compFunc2");
        // this.onLoadComolete(evt);
        egret.Tween.get(this).wait(200).call(this.onLoadComolete, this, [evt.currentTarget]);
        // if (!this.isAddEvent) {
        //     this.addEvent();
        // }
    }
    //--------------------------------------------------------------------------------------------------------
    /**
     * 调用微信头像上传功能
     * 提交完成
     */
    private wxload() {
        if (!this.isMove) {
            // uploadSuccess();
        }
    }
    public uploadSuccess(_src, data): void {
        //选择/照相成功返回数据，开始加载图片
        var imageLoader: egret.ImageLoader = new egret.ImageLoader();
        imageLoader.once(egret.Event.COMPLETE, (e) => {
            this.onLoadComolete(e);
        }, this);
        imageLoader.once(egret.IOErrorEvent.IO_ERROR, (e) => {
            alert("IO_ERROR:" + e.toString());
        }, this);
        imageLoader.load(_src);
        this.addEvent();
    }
    //--------------------------------------------------------------------------------------------------------
    private isAddEvent: Boolean = false;
    public addEvent() {
        this.isAddEvent = true;
        this.touchEnabled = true;
    }
    public removeEvent(): void {
        this.btn_upload.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.doSelect, this);//自带上传
    }
    public clear(): void {
        console.log("clear");
        this.removeEvent();
        Tool.remove(this.btn_upload);
    }
    //--------------------------------------------------------------------------------------------------------
    /**
     * 截图并返回纹理
     */
    public renderTexture() {
        //开始渲染
        // this.removeEvent();
        var renderTexture: egret.RenderTexture = new egret.RenderTexture();
        renderTexture.drawToTexture(this.headBox, new egret.Rectangle(this.headX, this.headY, this.headWidth, this.headHeight));
        // this.imageBase64 = renderTexture.toDataURL("image/jpeg", new egret.Rectangle(0, 0, this.headWidth, this.headHeight));
        // this.replace(renderTexture);
        return renderTexture;
    }
    /**
     * 截取后，替换原来画面(如果有必要的话)
     */
    public replace(renderTexture): void {
        this.myHead = new egret.Bitmap();
        this.myHead.texture = renderTexture;
        this.myHead.x = this.headX;
        this.myHead.y = this.headY;
        this.addChild(this.myHead);
        /**
         * 移除原有的图片
         */
        Tool.remove(this.myImg);
        Tool.remove(this.headBox);
    }
    private startRotation;
    private onLoadComolete(e = null): void {
        this.startRotation = 0;
        switch (myOrientation) {
            case 6://需要顺时针（向左）90度旋转  
                // alert('需要顺时针（向左）90度旋转');
                this.startRotation = 90;
                break;
            case 8://需要逆时针（向右）90度旋转  
                // alert('需要顺时针（向右）90度旋转');
                this.startRotation = -90;
                break;
            case 3://需要180度旋转  
                alert('需要180度旋转 转两次  ');
                this.startRotation = 180;
                break;
        }
        //加载完成
        //加入图片
        this.headBox.removeChildren();

        if (e) {
            var loader: egret.ImageLoader = e;
            var bmd: egret.BitmapData = loader.data;
            var bmp: egret.Bitmap = new egret.Bitmap(bmd);
        } else {
            var bmp: egret.Bitmap = new egret.Bitmap();
            bmp.texture = this.texture;
        }
        bmp["mcW"] = bmp.width;
        bmp["mcH"] = bmp.height;

        var box: egret.Sprite = new egret.Sprite();
        box.addChild(bmp);
        box["mcW"] = bmp["mcW"];
        box["mcH"] = bmp["mcH"];
        box.rotation = this.startRotation;
        Tool.anchorXY(box);
        //--------------------------------------------------------------------------------------------------------
        this._currentBirdRotation = this.startRotation;
        var tempT = this.renderDefault(box);

        var tempImg = new egret.Bitmap();
        tempImg.texture = tempT;
        this.myImg = tempImg;

        Util.mainRoot.showMsg();
        this.touchChildren = false;
        var myPost = new PostExp(submit_url, "img=" + encodeURIComponent(this.defaultBase64));
        myPost.addEventListener("complete", (e) => {
            var myJson = JSON.parse(myPost.response);
            this.myJson = myJson;
            if (myJson.errorcode == 0) {
                this.touchChildren = true;
                this.headBox.addChild(this.myImg);
                this.setLoc(myJson.face[0].x, myJson.face[0].y, myJson.face[0].width, myJson.face[0].height);

                Util.mainRoot.hideMsg();
                Util.mainRoot.getHeadTexture();
            } else {
                this.touchChildren = true;
                alert(myJson.errormsg);
                this.myImg = null;
                this.headBox.removeChildren();
                Util.mainRoot.hideMsg();
            }
        }, this);
        myPost.addEventListener("io_error", (e) => {
            alert("数据出错");
            this.myImg = null;
            this.headBox.removeChildren();
        }, this);
        myPost.send();
    }

    public defaultBase64;
    public renderDefault(target) {
        var max = 1000;
        if (target["mcW"] > max) {
            target.scaleX = max / target["mcW"];
            target.scaleY = target.scaleX;
        }
        if (target.height > max) {
            target.scaleY = max / target["mcH"];
            target.scaleX = target.scaleY;
        }
        // console.log(this.startRotation);
        target.x = target.anchorOffsetX * target.scaleX;
        target.y = target.anchorOffsetY * target.scaleY;
        switch (myOrientation) {
            case 6:
                console.log('需要向左90度旋转');
                target.x = target.anchorOffsetY * target.scaleY;
                target.y = target.anchorOffsetX * target.scaleX;
                break;
            case 8:
                // alert('需要顺时针（向右）90度旋转');
                console.log('需要向右90度旋转');
                target.x = target.anchorOffsetY * target.scaleY;
                target.y = target.anchorOffsetX * target.scaleX;
                break;
            case 3://需要180度旋转  
                // alert('需要180度旋转 转两次  ');
                console.log('需要180度旋转 转两次');
                break;
        }
        var tempBox: egret.Sprite = new egret.Sprite();
        tempBox.addChild(target);

        var renderTexture: egret.RenderTexture = new egret.RenderTexture();
        renderTexture.drawToTexture(tempBox);
        this.defaultBase64 = renderTexture.toDataURL("image/jpeg");
        Util.defaultBase64 = this.defaultBase64;

        return renderTexture;
    }
    public setLoc(x, y, w, h) {
        Tool.anchorXY(this.myImg, x + w / 2, y + h / 2);
        var percent = 0.5;
        var mX = x;
        var mY = y;
        var mW = w;
        var mH = h;

        var per = 1;

        mW = this.headWidth * percent;
        per = mW / w;
        mH = per * h;

        if (mH > this.headWidth * percent) {
            mH = this.headWidth * percent;
            per = mH / h;
            mW = per * w;
        }
        this.myImg.scaleX = this.myImg.scaleY = per;
        this.myImg.x = this.headWidth / 2;
        this.myImg.y = this.headHeight / 2;
    }

    public updateHead(): void {
        this.btn_upload.graphics.clear();
        this.btn_upload.graphics.beginFill(0xff0000);
        this.btn_upload.graphics.drawRect(0, 0, this.headWidth * 1.2, this.headHeight * 1.2);
        this.btn_upload.graphics.endFill();
        this.btn_upload.x = this.headX - (this.btn_upload.width - this.headWidth) / 2;
        this.btn_upload.y = this.headY - (this.btn_upload.height - this.headHeight) / 2;
        this._msk.x = this.headX + this.headWidth / 2;
        this._msk.y = this.headY + this.headHeight / 2;

        // alert(this.startRotation);
        if (this.myImg) {
            //居中
            this.myImg.x = Math.round(this.headX + this.headWidth / 2);
            this.myImg.y = Math.round(this.headY + this.headHeight / 2);
            //设置图片默认大小
            this.myImg.width = this.headWidth;
            this.myImg.height = this.myImg["mcH"] * this.myImg.width / this.myImg["mcW"];

            if (this.myImg.height < this.headHeight) {
                this.myImg.height = this.headHeight;
                this.myImg.width = this.myImg["mcW"] * this.myImg.height / this.myImg["mcH"];
            }
            Tool.anchorXY(this.myImg);
            this.myImg.scaleX = this.myImg.scaleY = 1;
            this.myImg.rotation = this._currentBirdRotation;
        }
        this._currentBirdRotation = this.startRotation;
    }

    //---------------------------------------------------------------------------------------------------------
    /**
     * 图片拖动、缩放
     */
    private touchPoints: Object = { names: [] }; //{touchid:touch local,names:[ID1,ID2]};
    private distance: number = 0;
    private defAngle: number = 0;
    private touchCon: number = 0;
    private _currentBirdRotation: number = 0;
    private _touchStatus: boolean = false;              //当前触摸状态，按下时，值为true
    private _distance: egret.Point = new egret.Point(); //鼠标点击时，鼠标全局坐标与 对象 的位置差

    private startX = 0
    private startY = 0
    public mouseDown(evt: egret.TouchEvent) {
        this.startX = evt.stageX;
        this.startY = evt.stageY;
        this.isMove = false;
        if (this.touchPoints[evt.touchPointID] == null) {
            this.touchPoints[evt.touchPointID] = new egret.Point(evt.stageX, evt.stageY);
            this.touchPoints["names"].push(evt.touchPointID);
        }
        this.touchCon++;
        if (this.touchCon == 2) {
            this.distance = this.getTouchDistance();
            this.defAngle = this.getTouchAngle();
        }
        this._touchStatus = true;
        this._distance.x = evt.stageX - this.myImg.x;
        this._distance.y = evt.stageY - this.myImg.y;

        if (this.touchCon == 1) {
            this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
            this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        }
    }
    private mouseMove(evt: egret.TouchEvent = null) {
        if (Math.round(this.startX - evt.stageX) > 10 || Math.round(this.startY - evt.stageY) > 10) {
            //
        }
        this.isMove = true;
        this.touchPoints[evt.touchPointID].x = evt.stageX;
        this.touchPoints[evt.touchPointID].y = evt.stageY;
        if (this.touchCon == 2) {
            var newdistance = this.getTouchDistance();
            this.myImg.scaleX = newdistance / this.distance;
            this.myImg.scaleY = this.myImg.scaleX;

            var newangle = this.getTouchAngle();
            this.myImg.rotation = this._currentBirdRotation + newangle - this.defAngle;
        }
        if (this._touchStatus && this.touchCon != 2) {
            this.myImg.x = evt.stageX - this._distance.x;
            this.myImg.y = evt.stageY - this._distance.y;
        }
    }
    private mouseUp(evt: egret.TouchEvent = null) {
        delete this.touchPoints[evt.touchPointID];
        this.touchCon--;
        if (this.touchCon < 0) {
            this.touchCon = 0;
            //this.isMove = false;
        }
        //
        this.myImg.width *= this.myImg.scaleX;
        this.myImg.height *= this.myImg.scaleY;
        this.myImg.scaleX = this.myImg.scaleY = 1;
        this.myImg.anchorOffsetX = this.myImg.width / 2;
        this.myImg.anchorOffsetY = this.myImg.height / 2;
        this._currentBirdRotation = this.myImg.rotation;

        this._touchStatus = false;

        console.log("this.touchCon:" + this.touchCon);

        if (this.touchCon == 0) {
            this.parent["touchType"] = "";

            this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
            this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        }
    }
    private getTouchDistance(): number {
        var _distance: number = 0;
        var names = this.touchPoints["names"];
        _distance = egret.Point.distance(this.touchPoints[names[names.length - 1]],
            this.touchPoints[names[names.length - 2]]);
        return _distance;
    }
    private c: number = 0.017453292; //2PI/360
    private getTouchAngle(): number {
        var ang: number = 0;
        var names = this.touchPoints["names"];
        var p1: egret.Point = this.touchPoints[names[names.length - 1]];
        var p2: egret.Point = this.touchPoints[names[names.length - 2]];
        ang = Math.atan2((p1.y - p2.y), (p1.x - p2.x)) / this.c;
        return ang;
    }
    //==================================================================================================================
    //==================================================================================================================
    private myJson;
    private pointBox: egret.Sprite;
    public createPoint() {
        var _json = this.myJson.face[0].face_shape

        this.pointBox = new egret.Sprite();
        this.headBox.addChild(this.pointBox);
        this.pointBox.anchorOffsetX = this.myImg.anchorOffsetX;
        this.pointBox.anchorOffsetY = this.myImg.anchorOffsetY;
        this.pointBox.x = this.myImg.x;
        this.pointBox.y = this.myImg.y;
        this.pointBox.scaleX = this.pointBox.scaleY = this.myImg.scaleX;

        var left_eyebrow = [];
        var right_eyebrow = [];
        for (var i = 0; i < _json.left_eyebrow.length / 2; i++) {
            left_eyebrow.push(_json.left_eyebrow[i]);
        }

        for (var i = 0; i < _json.right_eyebrow.length / 2; i++) {
            right_eyebrow.push(_json.right_eyebrow[i]);
        }
        setTimeout(() => {
            //眉毛
            this.addPoint(left_eyebrow, 'eyebrow');
            this.addPoint(right_eyebrow, 'eyebrow');
        }, 1)

        var left_eye = [];
        var right_eye = [];
        left_eye.push(_json.left_eye[0]);
        left_eye.push(_json.left_eye[Math.round(_json.left_eye.length / 2)]);
        right_eye.push(_json.right_eye[0]);
        right_eye.push(_json.right_eye[Math.round(_json.right_eye.length / 2)]);
        setTimeout(() => {
            //眼睛
            this.addPoint(left_eye, 'eye');
            this.addPoint(right_eye, 'eye');
        }, 200)

        var nose = []
        nose.push(_json.nose[Math.round(1)]);
        nose.push(_json.nose[Math.round((_json.nose.length - 2) / 3) + 1]);
        nose.push(_json.nose[Math.round((_json.nose.length) / 2)]);
        nose.push(_json.nose[Math.round((_json.nose.length - 2) / 3 * 2 + 2)]);
        setTimeout(() => {
            //鼻子
            this.addPoint(nose, 'nose');
        }, 500)

        var face_profile = _json.face_profile;
        setTimeout(() => {
            //脸轮廓
            this.addPoint(face_profile, 'face_profile');
        }, 650)

        var mouth = []
        mouth.push(_json.mouth[0]);
        mouth.push(_json.mouth[Math.round(_json.mouth.length / 8)]);
        mouth.push(_json.mouth[Math.round(_json.mouth.length / 8) * 2]);
        mouth.push(_json.mouth[Math.round(_json.mouth.length / 8) * 3]);
        setTimeout(() => {
            //嘴巴
            this.addPoint(mouth, 'mouth');
        }, 800)
        //-----------------------------------------------------------------------------
        //-----------------------------------------------------------------------------
        var per = this.pointBox.scaleX
        //鼻子的线
        var line: egret.Sprite = new egret.Sprite();
        line.graphics.lineStyle(1 / per, 0xffffff);
        this.pointBox.addChild(line);
        line.graphics.lineTo(nose[0].x, nose[0].y);
        for (var i = 1; i < nose.length; i++) {
            line.graphics.lineTo(nose[i].x, nose[i].y);
            line.graphics.lineTo(nose[0].x, nose[0].y);
        }
        line.alpha = 0;
        egret.Tween.get(line).to({ alpha: 1 }, 500);
        //-----------------------------------------------------------------------------
        //脸轮廓的线
        var line: egret.Sprite = new egret.Sprite();
        line.graphics.lineStyle(0.5 / per, 0xffffff);
        this.pointBox.addChild(line);
        line.graphics.lineTo(face_profile[0].x, face_profile[0].y);
        for (var i = 1; i < face_profile.length; i++) {
            line.graphics.lineTo(face_profile[i].x, face_profile[i].y);
        }
        line.graphics.lineTo(face_profile[0].x, face_profile[0].y);
        line.alpha = 0;
        egret.Tween.get(line).to({ alpha: 1 }, 500);
        //-----------------------------------------------------------------------------
        //嘴巴的线
        var line: egret.Sprite = new egret.Sprite();
        line.graphics.lineStyle(1 / per, 0xffffff);
        this.pointBox.addChild(line);
        line.graphics.lineTo(mouth[0].x, mouth[0].y);
        for (var i = 1; i < mouth.length; i++) {
            line.graphics.lineTo(mouth[i].x, mouth[i].y);
        }
        line.graphics.lineTo(mouth[0].x, mouth[0].y);
        line.alpha = 0;
        egret.Tween.get(line).to({ alpha: 1 }, 500);
        //-----------------------------------------------------------------------------
        //特殊的线1 
        var special: Array<any> = [];
        special.push(face_profile[0]);
        special.push(face_profile[Math.round(face_profile.length / 2) - 2]);
        special.push(mouth[0]);
        special.push(face_profile[0]);
        var line: egret.Sprite = new egret.Sprite();
        line.graphics.lineStyle(0.5 / per, 0xffffff);
        this.pointBox.addChild(line);
        line.graphics.lineTo(special[0].x, special[0].y);
        for (var i = 1; i < special.length; i++) {
            line.graphics.lineTo(special[i].x, special[i].y);
        }
        line.graphics.lineTo(special[0].x, special[0].y);
        line.alpha = 0;
        egret.Tween.get(line).to({ alpha: 1 }, 500);

        //特殊的线2
        var special: Array<any> = [];
        special.push(face_profile[face_profile.length - 1]);
        special.push(face_profile[Math.round(face_profile.length / 2)]);
        special.push(mouth[2]);
        special.push(face_profile[face_profile.length - 1]);
        var line: egret.Sprite = new egret.Sprite();
        line.graphics.lineStyle(0.5 / per, 0xffffff);
        this.pointBox.addChild(line);
        line.graphics.lineTo(special[0].x, special[0].y);
        for (var i = 1; i < special.length; i++) {
            line.graphics.lineTo(special[i].x, special[i].y);
        }
        line.graphics.lineTo(special[0].x, special[0].y);
        line.alpha = 0;
        egret.Tween.get(line).to({ alpha: 1 }, 500);
        //-----------------------------------------------------------------------------
        //特殊的线3 白线1
        var special: Array<any> = [];
        special.push(face_profile[0]);
        special.push(nose[0]);
        special.push(face_profile[Math.round(face_profile.length - 1)]);
        var line: egret.Sprite = new egret.Sprite();
        line.graphics.lineStyle(2 / per, 0xffffff);
        this.pointBox.addChild(line);
        for (var i = 0; i < special.length; i++) {
            line.graphics.lineTo(special[i].x, special[i].y);
        }
        line.alpha = 0;
        egret.Tween.get(line).wait(1000).to({ alpha: 1 }, 500).wait(1000).to({ alpha: 0 }, 500);
        //-----------------------------------------------------------------------------
        //特殊的线4 白线2
        var special: Array<any> = [];
        special.push(nose[0]);
        special.push(nose[2]);
        special.push(mouth[3]);
        special.push(mouth[1]);
        special.push(face_profile[Math.round(face_profile.length / 2) - 1]);
        var line: egret.Sprite = new egret.Sprite();
        line.graphics.lineStyle(2 / per, 0xffffff);
        this.pointBox.addChild(line);
        for (var i = 0; i < special.length; i++) {
            line.graphics.lineTo(special[i].x, special[i].y);
        }
        line.alpha = 0;
        egret.Tween.get(line).wait(1000).to({ alpha: 1 }, 500).wait(1000).to({ alpha: 0 }, 500);
        //-----------------------------------------------------------------------------

        //特殊的线3 绿线1
        var special: Array<any> = [];
        special.push(face_profile[0]);
        special.push(nose[0]);
        special.push(face_profile[Math.round(face_profile.length - 1)]);
        var line: egret.Sprite = new egret.Sprite();
        line.graphics.lineStyle(2 / per, 0x00ff00);
        this.pointBox.addChild(line);
        for (var i = 0; i < special.length; i++) {
            line.graphics.lineTo(special[i].x, special[i].y);
        }
        line.alpha = 0;
        egret.Tween.get(line).wait(2500).to({ alpha: 1 }, 500).wait(1000).to({ alpha: 0 }, 500);
        //-----------------------------------------------------------------------------
        //特殊的线4 绿线2
        var special: Array<any> = [];
        special.push(nose[0]);
        special.push(nose[2]);
        special.push(mouth[3]);
        special.push(mouth[1]);
        special.push(face_profile[Math.round(face_profile.length / 2) - 1]);
        var line: egret.Sprite = new egret.Sprite();
        line.graphics.lineStyle(2 / per, 0x00ff00);
        this.pointBox.addChild(line);
        for (var i = 0; i < special.length; i++) {
            line.graphics.lineTo(special[i].x, special[i].y);
        }
        line.alpha = 0;
        egret.Tween.get(line).wait(2500).to({ alpha: 1 }, 500).wait(1000).to({ alpha: 0 }, 500);
        //-----------------------------------------------------------------------------

        //特殊的线5 绿线
        this.pointBox.addChild(line);
        for (var i = 0; i < face_profile.length; i++) {
            var line: egret.Sprite = new egret.Sprite();
            line.graphics.lineStyle(2 / per, 0x00ff00);
            line.graphics.lineTo(face_profile[i].x, face_profile[i].y);
            line.graphics.lineTo(face_profile[i].x, face_profile[0].y);
            this.pointBox.addChild(line);
            line.alpha = 0;
            egret.Tween.get(line).wait(2500 + 150 * i).to({ alpha: 1 }, 500).wait(700).to({ alpha: 0 }, 500);
        }
    }

    private addPoint(arr: Array<any>, type) {
        var point: egret.Sprite
        for (var i = 0; i < arr.length; i++) {
            point = new egret.Sprite();
            point.graphics.beginFill(0xffffff);
            if (type == 'eyebrow') {
                point.graphics.drawCircle(0, 0, (i + 1) / arr.length * 3 / this.pointBox.scaleX);
            } else if (type == 'eye') {
                point.graphics.drawCircle(0, 0, 3 / this.pointBox.scaleX);
            } else if (type == 'nose') {
                point.graphics.drawCircle(0, 0, 3 / this.pointBox.scaleX);
            } else if (type == 'mouth') {
                point.graphics.drawCircle(0, 0, 3 / this.pointBox.scaleX);
            } else if (type == 'face_profile') {
                point.graphics.drawCircle(0, 0, (1 - (Math.abs(i - arr.length / 2) / (arr.length / 2))) * 3 / this.pointBox.scaleX + 1);
            }
            point.graphics.endFill();
            this.pointBox.addChild(point);
            point.x = arr[i].x;
            point.y = arr[i].y;
            point.alpha = 0;
            egret.Tween.get(point).wait(Tool.getRandom(0, 300)).to({ alpha: 1 }, 200)
                .to({ alpha: 0 }, 200).to({ alpha: 1 }, 200)
        }
    }
}