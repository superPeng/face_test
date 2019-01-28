// private trace_txt:egret.TextField;
// private myShake: Shake
// private rockNum: number = 0;//晃动次数
// private shakeDemo(){
// 	this.myShake = new Shake();
// 	this.myShake.addEventListener(egret.Event.CHANGE, this.onChange, this);
// 	this.myShake.start();

// 	this.trace_txt = new egret.TextField();
// 	this.trace_txt.width = 640;
// 	this.trace_txt.height = 1030;
// 	this.addChild(this.trace_txt);
// }
// private onChange(e: egret.Event) {
// 	var data = e.data;
// 	//用户大概晃动了手机2-3次
// 	this.rockNum++;
// 	this.trace_txt.text += this.rockNum + "//   ";
// 	if (data.shakeCount > 6) {
// 		egret.log("摇一摇完成");
// 		this.trace_txt.text += "//   摇一摇完成";
// 		this.myShake.stop();
// 	}
// }

/**
 * 摇一摇工具类
 * @author
 */
class Shake extends egret.EventDispatcher {
	private orientation: egret.DeviceOrientation; //设备方向变化
	private xAngle: number = 0;     //设备绕x角度
	private yAngle: number = 0;     //设备绕y角度
	private zAngle: number = 0;     //设备绕z角度
	private last_x: number = 0;     //上一次绕x角度
	private last_y: number = 0;     //上一次绕y角度
	private last_z: number = 0;     //上一次绕z角度
	private shakeCount: number = 0; //摇动次数
	private lastTime: number = 0;    //上一次更新时间
	private shakeAngle: number = 45; //当晃动角度大于一定角度时，算摇动一次

	public constructor() {
		super();
	}

	/**开始 */
	public start() {
		//重置数据
		this.shakeCount = 0;
		this.lastTime = 0;
		this.last_x = 0;
		this.last_y = 0;
		this.last_z = 0;
		
		//开始监听
		this.orientation || (this.orientation = new egret.DeviceOrientation());
		this.orientation.addEventListener(egret.Event.CHANGE, this.onOrientation, this);
		this.orientation.start();
	}

	/**停止 */
	public stop() {
		if (this.orientation) {
			this.orientation.removeEventListener(egret.Event.CHANGE, this.onOrientation, this);
			this.orientation.stop();
		}
	}
	private onOrientation(e: egret.OrientationEvent) {
		var curTime: number = egret.getTimer();
		//每100ms判断一次
		if (curTime - this.lastTime > 100) {
			this.lastTime = curTime;

			this.xAngle = e.beta;   //x轴
			this.yAngle = e.gamma;  //y轴
			this.zAngle = e.alpha; //z轴

			//旋转超过一定角度，则算摇动一次
			if (Math.abs(this.last_x - this.xAngle) > this.shakeAngle ||
				Math.abs(this.last_y - this.yAngle) > this.shakeAngle ||
				Math.abs(this.last_z - this.zAngle) > this.shakeAngle) {
				this.shakeCount++;
				this.dispatchEventWith(egret.Event.CHANGE, false, { x: this.xAngle, y: this.yAngle, z: this.zAngle, shakeCount: this.shakeCount });
			}
			this.last_x = this.xAngle;
			this.last_y = this.yAngle;
			this.last_z = this.zAngle;
		}
		
		//派发事件(应该在shakeCount++时派发一次，写在这里只是为了方便显示测试数据...)
		// this.dispatchEventWith(egret.Event.CHANGE, false, { x: this.xAngle, y: this.yAngle, z: this.zAngle, shakeCount: this.shakeCount });
	}
}