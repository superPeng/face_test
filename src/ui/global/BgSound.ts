/**
 *
 * @author 
 * 
    var bgSound:BgSound = new BgSound();
    bgSound.x = 600;
    bgSound.y = 50;
    this.stage.addChild(bgSound);
 *
 */
class BgSound extends egret.Sprite {
    private soundBtn: egret.Sprite;
    private static icon1: egret.Bitmap;
    private static icon2: egret.Bitmap;
    private static status:boolean;
    public constructor() {
        super();
        this.soundBtn = new egret.Sprite();
        this.addChild(this.soundBtn);
        
        var icon1: egret.Bitmap = Tool.createBitmapByName("music_icon1_png");
        this.soundBtn.addChild(icon1);
        BgSound.icon1 = icon1;
        
        Tool.anchorXY(BgSound.icon1);
        var tw = egret.Tween.get(BgSound.icon1,{ loop: true });
        tw.to({ rotation: 360 },3000);

        var icon2: egret.Bitmap = Tool.createBitmapByName("music_icon2_png");
        Tool.anchorXY(icon2);
        this.soundBtn.addChild(icon2);
        BgSound.icon2 = icon2;
        BgSound.icon2.visible = false;
        
        this.soundBtn.touchEnabled = true;
        this.soundBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,BgSound.playSound,this);
    }
    /**
     * 播放声音
     * @param type 方式 true为播放，false为暂停
     */
    public static playSound(type = null):void{
        BgSound.status = play_sound();
        if(BgSound.status) {
            BgSound.icon1.visible = true;
            BgSound.icon2.visible = false;
        } else {
            BgSound.icon1.visible = false;
            BgSound.icon2.visible = true;
        }
    }
    
    /**
	 * 播放音效
     * @param name 资源名字
     * @param volume 音量
	*/
	// public static playEffect(name:string,volume:number=1){
    // 	//判断音效按钮是否静音，是则return 否则播放
    //     var sound_eff: egret.Sound = RES.getRes(name);
    //     sound_eff.type = egret.Sound.EFFECT;
    //     var channel: egret.SoundChannel = sound_eff.play(0,1);
    //     channel.volume = volume;
	// }
}