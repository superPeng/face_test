class Main extends egret.DisplayObjectContainer {
    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    private onAddToStage(event: egret.Event) {
        var vc: RES.VersionController = new RES.VersionController();
        vc.getVirtualUrl = function (url: string): string {
            return url + "?v=" + version;
        }
        RES.registerVersionController(vc);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("loadingUI");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent) {
        if (event.groupName == "loadingUI") {
            this.init();
            RES.loadGroup("preload");
        } else if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        }
    }
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }
    private container: egret.Sprite;//内容容器
    private init(): void {
        Util.mainRoot = this;
        Util.stageWidth = this.stage.stageWidth;
        Util.stageHeight = this.stage.stageHeight;
        this.container = new egret.Sprite();
        this.addChild(this.container);

        this.loadingView = new LoadingUI("preload");
        this.stage.addChild(this.loadingView);

        var bgSound: BgSound = new BgSound();
        bgSound.x = 590;
        bgSound.y = 50;
        this.stage.addChild(bgSound);

        EM.dispatch().addEventListener(Events.LOAD_COMPLETE, this.createScene, this);
    }
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createScene(e) {
        egret.Tween.get(this.loadingView).to({ alpha: 0 }, 300, egret.Ease.quadInOut).call(Tool.remove, this, [this.loadingView]);
        
        var box: egret.Sprite = new egret.Sprite();
        this.addChild(box);
        box.x = 20;
        box.y = 100;

        var myHead = new Head();
        box.addChild(myHead);
        myHead.headWidth = 310;
        myHead.headHeight = 310;
        myHead.maxWidth = 620;
        myHead.maxHeight = 620;
        myHead.msk = "msk_png";
        myHead.updateHead();
        myHead.x = 100;
        myHead.y = 100;
        Util.myHead = myHead;
    }
    public getHeadTexture() {
        var texture = Util.myHead.renderTexture();
        var img: egret.Bitmap = new egret.Bitmap(texture);
        this.addChild(img);
    }

    private msg: Msg;
    private showMsg() {
        this.msg = new Msg();
        this.stage.addChild(this.msg);
        this.msg.alpha = 0;
        egret.Tween.get(this.msg).to({ alpha: 1 }, 300, egret.Ease.quadInOut);
    }
    private hideMsg() {
        egret.Tween.get(this.msg).to({ alpha: 0 }, 300, egret.Ease.quadInOut).call(Tool.remove, this, [this.msg]);
    }
}