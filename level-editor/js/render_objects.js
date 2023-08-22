export function drawObject(object, variant, posX, posY, ctx) {
    ctx.translate(posX, posY);

    const functionName = object + '_' + variant;
    switch(functionName) {
        case "spawn_fb":
			spawn_fb(ctx);
			break;
		case "spawn_wg":
			spawn_wg(ctx);
			break;
		case "diamond_fb":
			diamond_fb(ctx);
			break;
		case "diamond_wg":
			diamond_wg(ctx);
			break;
		case "door_fb":
			door_fb(ctx);
			break;
		case "door_wg":
			door_wg(ctx);
			break;
		case "button_1":
			button_1(ctx);
			break;
		case "button_2":
			button_2(ctx);
			break;
		case "button_3":
			button_3(ctx);
			break;
		case "button_4":
			button_4(ctx);
			break;
		case "button_5":
			button_5(ctx);
			break;
		case "button_6":
			button_6(ctx);
			break;
		case "button_7":
			button_7(ctx);
			break;
		case "button_8":
			button_8(ctx);
			break;
		case "lever_left_1":
			lever_left_1(ctx);
			break;
		case "lever_left_2":
			lever_left_2(ctx);
			break;
		case "lever_left_3":
			lever_left_3(ctx);
			break;
		case "lever_left_4":
			lever_left_4(ctx);
			break;
		case "lever_left_5":
			lever_left_5(ctx);
			break;
		case "lever_left_6":
			lever_left_6(ctx);
			break;
		case "lever_left_7":
			lever_left_7(ctx);
			break;
		case "lever_left_8":
			lever_left_8(ctx);
			break;
		case "lever_right_1":
			lever_right_1(ctx);
			break;
		case "lever_right_2":
			lever_right_2(ctx);
			break;
		case "lever_right_3":
			lever_right_3(ctx);
			break;
		case "lever_right_4":
			lever_right_4(ctx);
			break;
		case "lever_right_5":
			lever_right_5(ctx);
			break;
		case "lever_right_6":
			lever_right_6(ctx);
			break;
		case "lever_right_7":
			lever_right_7(ctx);
			break;
		case "lever_right_8":
			lever_right_8(ctx);
			break;
		case "box_normal":
			box_normal(ctx);
			break;
		case "box_heavy":
			box_heavy(ctx);
			break;
		case "diamond_fbwg":
			diamond_fbwg(ctx);
			break;
		case "diamond_silver":
			diamond_silver(ctx);
			break;
		
    };

    ctx.resetTransform();
};
function spawn_fb (ctx) {
	ctx.beginPath();
	ctx.arc(32,20,12,0,Math.PI*2);
	ctx.fillStyle="red";
	ctx.fill();
	ctx.moveTo(32,32);
	ctx.lineTo(32,56);
	ctx.moveTo(24,44);
	ctx.lineTo(32,36);
	ctx.lineTo(40,44);
	ctx.moveTo(26,64);
	ctx.lineTo(32,56);
	ctx.lineTo(38,64);
	ctx.strokeStyle="firebrick";
	ctx.lineWidth="4";
	ctx.stroke();
};
function spawn_wg (ctx) {
	ctx.beginPath();
	ctx.arc(32,20,12,0,Math.PI*2);
	ctx.fillStyle="lightblue";
	ctx.fill();
	ctx.moveTo(32,32);
	ctx.lineTo(32,56);
	ctx.moveTo(24,44);
	ctx.lineTo(32,36);
	ctx.lineTo(40,44);
	ctx.moveTo(26,64);
	ctx.lineTo(32,56);
	ctx.lineTo(38,64);
	ctx.strokeStyle="blue";
	ctx.lineWidth="4";
	ctx.stroke();
};
function diamond_fb (ctx) {
	ctx.beginPath();
	ctx.moveTo(16,24);
	ctx.lineTo(24,16);
	ctx.lineTo(40,16);
	ctx.lineTo(48,24);
	ctx.lineTo(32,44);
	ctx.lineTo(16,24);
	ctx.lineTo(24,16);
	ctx.fillStyle="red";
	ctx.strokeStyle="firebrick";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
};
function diamond_wg (ctx) {
	ctx.beginPath();
	ctx.moveTo(16,24);
	ctx.lineTo(24,16);
	ctx.lineTo(40,16);
	ctx.lineTo(48,24);
	ctx.lineTo(32,44);
	ctx.lineTo(16,24);
	ctx.lineTo(24,16);
	ctx.fillStyle="lightblue";
	ctx.strokeStyle="blue";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
};
function door_fb (ctx) {
	ctx.beginPath();
	ctx.rect(8,8,48,56);
	ctx.fillStyle="firebrick";
	ctx.fill();
	ctx.beginPath();
	ctx.rect(16,16,32,48);
	ctx.fillStyle="red";
	ctx.fill();
};
function door_wg (ctx) {
	ctx.beginPath();
	ctx.rect(8,8,48,56);
	ctx.fillStyle="blue";
	ctx.fill();
	ctx.beginPath();
	ctx.rect(16,16,32,48);
	ctx.fillStyle="lightblue";
	ctx.fill();
};
function button_1 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,16);
	ctx.lineTo(48,16);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.lineTo(16,16);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(20,16);
	ctx.lineTo(22,12);
	ctx.lineTo(42,12);
	ctx.lineTo(44,16);
	ctx.lineTo(38,24);
	ctx.lineTo(26,24);
	ctx.lineTo(20,16);
	ctx.fillStyle="red";
	ctx.strokeStyle="darkred";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function button_2 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,16);
	ctx.lineTo(48,16);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.lineTo(16,16);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(20,16);
	ctx.lineTo(22,12);
	ctx.lineTo(42,12);
	ctx.lineTo(44,16);
	ctx.lineTo(38,24);
	ctx.lineTo(26,24);
	ctx.lineTo(20,16);
	ctx.fillStyle="green";
	ctx.strokeStyle="darkgreen";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function button_3 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,16);
	ctx.lineTo(48,16);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.lineTo(16,16);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(20,16);
	ctx.lineTo(22,12);
	ctx.lineTo(42,12);
	ctx.lineTo(44,16);
	ctx.lineTo(38,24);
	ctx.lineTo(26,24);
	ctx.lineTo(20,16);
	ctx.fillStyle="blue";
	ctx.strokeStyle="darkblue";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function button_4 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,16);
	ctx.lineTo(48,16);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.lineTo(16,16);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(20,16);
	ctx.lineTo(22,12);
	ctx.lineTo(42,12);
	ctx.lineTo(44,16);
	ctx.lineTo(38,24);
	ctx.lineTo(26,24);
	ctx.lineTo(20,16);
	ctx.fillStyle="yellow";
	ctx.strokeStyle="yellowgreen";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function button_5 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,16);
	ctx.lineTo(48,16);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.lineTo(16,16);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(20,16);
	ctx.lineTo(22,12);
	ctx.lineTo(42,12);
	ctx.lineTo(44,16);
	ctx.lineTo(38,24);
	ctx.lineTo(26,24);
	ctx.lineTo(20,16);
	ctx.fillStyle="magenta";
	ctx.strokeStyle="purple";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function button_6 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,16);
	ctx.lineTo(48,16);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.lineTo(16,16);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(20,16);
	ctx.lineTo(22,12);
	ctx.lineTo(42,12);
	ctx.lineTo(44,16);
	ctx.lineTo(38,24);
	ctx.lineTo(26,24);
	ctx.lineTo(20,16);
	ctx.fillStyle="lightskyblue";
	ctx.strokeStyle="blue";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function button_7 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,16);
	ctx.lineTo(48,16);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.lineTo(16,16);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(20,16);
	ctx.lineTo(22,12);
	ctx.lineTo(42,12);
	ctx.lineTo(44,16);
	ctx.lineTo(38,24);
	ctx.lineTo(26,24);
	ctx.lineTo(20,16);
	ctx.fillStyle="blueviolet";
	ctx.strokeStyle="purple";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function button_8 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,16);
	ctx.lineTo(48,16);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.lineTo(16,16);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(20,16);
	ctx.lineTo(22,12);
	ctx.lineTo(42,12);
	ctx.lineTo(44,16);
	ctx.lineTo(38,24);
	ctx.lineTo(26,24);
	ctx.lineTo(20,16);
	ctx.fillStyle="white";
	ctx.strokeStyle="gray";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function lever_left_1 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,48);
	ctx.lineTo(48,48);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.moveTo(32,32);
	ctx.lineTo(56,8);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(52,12,8,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(52,12,6,0,Math.PI*2);
	ctx.moveTo(22,36);
	ctx.lineTo(42,36);
	ctx.lineTo(44,44);
	ctx.lineTo(20,44);
	ctx.lineTo(22,36);
	ctx.lineTo(42,36);
	ctx.fillStyle="red";
	ctx.strokeStyle="darkred";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function lever_left_2 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,48);
	ctx.lineTo(48,48);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.moveTo(32,32);
	ctx.lineTo(56,8);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(52,12,8,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(52,12,6,0,Math.PI*2);
	ctx.moveTo(22,36);
	ctx.lineTo(42,36);
	ctx.lineTo(44,44);
	ctx.lineTo(20,44);
	ctx.lineTo(22,36);
	ctx.lineTo(42,36);
	ctx.fillStyle="green";
	ctx.strokeStyle="darkgreen";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function lever_left_3 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,48);
	ctx.lineTo(48,48);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.moveTo(32,32);
	ctx.lineTo(56,8);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(52,12,8,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(52,12,6,0,Math.PI*2);
	ctx.moveTo(22,36);
	ctx.lineTo(42,36);
	ctx.lineTo(44,44);
	ctx.lineTo(20,44);
	ctx.lineTo(22,36);
	ctx.lineTo(42,36);
	ctx.fillStyle="blue";
	ctx.strokeStyle="darkblue";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function lever_left_4 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,48);
	ctx.lineTo(48,48);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.moveTo(32,32);
	ctx.lineTo(56,8);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(52,12,8,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(52,12,6,0,Math.PI*2);
	ctx.moveTo(22,36);
	ctx.lineTo(42,36);
	ctx.lineTo(44,44);
	ctx.lineTo(20,44);
	ctx.lineTo(22,36);
	ctx.lineTo(42,36);
	ctx.fillStyle="yellow";
	ctx.strokeStyle="yellowgreen";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function lever_left_5 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,48);
	ctx.lineTo(48,48);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.moveTo(32,32);
	ctx.lineTo(56,8);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(52,12,8,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(52,12,6,0,Math.PI*2);
	ctx.moveTo(22,36);
	ctx.lineTo(42,36);
	ctx.lineTo(44,44);
	ctx.lineTo(20,44);
	ctx.lineTo(22,36);
	ctx.lineTo(42,36);
	ctx.fillStyle="magenta";
	ctx.strokeStyle="purple";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function lever_left_6 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,48);
	ctx.lineTo(48,48);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.moveTo(32,32);
	ctx.lineTo(56,8);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(52,12,8,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(52,12,6,0,Math.PI*2);
	ctx.moveTo(22,36);
	ctx.lineTo(42,36);
	ctx.lineTo(44,44);
	ctx.lineTo(20,44);
	ctx.lineTo(22,36);
	ctx.lineTo(42,36);
	ctx.fillStyle="lightskyblue";
	ctx.strokeStyle="blue";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function lever_left_7 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,48);
	ctx.lineTo(48,48);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.moveTo(32,32);
	ctx.lineTo(56,8);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(52,12,8,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(52,12,6,0,Math.PI*2);
	ctx.moveTo(22,36);
	ctx.lineTo(42,36);
	ctx.lineTo(44,44);
	ctx.lineTo(20,44);
	ctx.lineTo(22,36);
	ctx.lineTo(42,36);
	ctx.fillStyle="blueviolet";
	ctx.strokeStyle="purple";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function lever_left_8 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,48);
	ctx.lineTo(48,48);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.moveTo(32,32);
	ctx.lineTo(56,8);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(52,12,8,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(52,12,6,0,Math.PI*2);
	ctx.moveTo(22,36);
	ctx.lineTo(42,36);
	ctx.lineTo(44,44);
	ctx.lineTo(20,44);
	ctx.lineTo(22,36);
	ctx.lineTo(42,36);
	ctx.fillStyle="white";
	ctx.strokeStyle="gray";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function lever_right_1 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,48);
	ctx.lineTo(48,48);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.moveTo(32,32);
	ctx.lineTo(8,8);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(12,12,8,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(12,12,6,0,Math.PI*2);
	ctx.moveTo(22,36);
	ctx.lineTo(42,36);
	ctx.lineTo(44,44);
	ctx.lineTo(20,44);
	ctx.lineTo(22,36);
	ctx.lineTo(42,36);
	ctx.fillStyle="red";
	ctx.strokeStyle="darkred";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function lever_right_2 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,48);
	ctx.lineTo(48,48);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.moveTo(32,32);
	ctx.lineTo(8,8);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(12,12,8,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(12,12,6,0,Math.PI*2);
	ctx.moveTo(22,36);
	ctx.lineTo(42,36);
	ctx.lineTo(44,44);
	ctx.lineTo(20,44);
	ctx.lineTo(22,36);
	ctx.lineTo(42,36);
	ctx.fillStyle="green";
	ctx.strokeStyle="darkgreen";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function lever_right_3 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,48);
	ctx.lineTo(48,48);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.moveTo(32,32);
	ctx.lineTo(8,8);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(12,12,8,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(12,12,6,0,Math.PI*2);
	ctx.moveTo(22,36);
	ctx.lineTo(42,36);
	ctx.lineTo(44,44);
	ctx.lineTo(20,44);
	ctx.lineTo(22,36);
	ctx.lineTo(42,36);
	ctx.fillStyle="blue";
	ctx.strokeStyle="darkblue";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function lever_right_4 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,48);
	ctx.lineTo(48,48);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.moveTo(32,32);
	ctx.lineTo(8,8);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(12,12,8,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(12,12,6,0,Math.PI*2);
	ctx.moveTo(22,36);
	ctx.lineTo(42,36);
	ctx.lineTo(44,44);
	ctx.lineTo(20,44);
	ctx.lineTo(22,36);
	ctx.lineTo(42,36);
	ctx.fillStyle="yellow";
	ctx.strokeStyle="yellowgreen";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function lever_right_5 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,48);
	ctx.lineTo(48,48);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.moveTo(32,32);
	ctx.lineTo(8,8);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(12,12,8,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(12,12,6,0,Math.PI*2);
	ctx.moveTo(22,36);
	ctx.lineTo(42,36);
	ctx.lineTo(44,44);
	ctx.lineTo(20,44);
	ctx.lineTo(22,36);
	ctx.lineTo(42,36);
	ctx.fillStyle="magenta";
	ctx.strokeStyle="purple";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function lever_right_6 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,48);
	ctx.lineTo(48,48);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.moveTo(32,32);
	ctx.lineTo(8,8);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(12,12,8,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(12,12,6,0,Math.PI*2);
	ctx.moveTo(22,36);
	ctx.lineTo(42,36);
	ctx.lineTo(44,44);
	ctx.lineTo(20,44);
	ctx.lineTo(22,36);
	ctx.lineTo(42,36);
	ctx.fillStyle="lightskyblue";
	ctx.strokeStyle="blue";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function lever_right_7 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,48);
	ctx.lineTo(48,48);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.moveTo(32,32);
	ctx.lineTo(8,8);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(12,12,8,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(12,12,6,0,Math.PI*2);
	ctx.moveTo(22,36);
	ctx.lineTo(42,36);
	ctx.lineTo(44,44);
	ctx.lineTo(20,44);
	ctx.lineTo(22,36);
	ctx.lineTo(42,36);
	ctx.fillStyle="blueviolet";
	ctx.strokeStyle="purple";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function lever_right_8 (ctx) {
	ctx.beginPath();
	ctx.moveTo(0,32);
	ctx.lineTo(16,48);
	ctx.lineTo(48,48);
	ctx.lineTo(64,32);
	ctx.lineTo(0,32);
	ctx.moveTo(32,32);
	ctx.lineTo(8,8);
	ctx.fillStyle="orange";
	ctx.strokeStyle="#a25900";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(12,12,8,0,Math.PI*2);
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(12,12,6,0,Math.PI*2);
	ctx.moveTo(22,36);
	ctx.lineTo(42,36);
	ctx.lineTo(44,44);
	ctx.lineTo(20,44);
	ctx.lineTo(22,36);
	ctx.lineTo(42,36);
	ctx.fillStyle="white";
	ctx.strokeStyle="gray";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function box_normal (ctx) {
	ctx.beginPath();
	ctx.rect(0,0,64,64);
	ctx.fillStyle="goldenrod";
	ctx.strokeStyle="gray";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(20,0);
	ctx.lineTo(44,0);
	ctx.lineTo(64,20);
	ctx.lineTo(64,44);
	ctx.lineTo(44,64);
	ctx.lineTo(20,64);
	ctx.lineTo(0,44);
	ctx.lineTo(0,20);
	ctx.lineTo(20,0);
	ctx.lineTo(44,0);
	ctx.fillStyle="lightgray";
	ctx.strokeStyle="gray";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function box_heavy (ctx) {
	ctx.beginPath();
	ctx.rect(0,0,64,64);
	ctx.fillStyle="goldenrod";
	ctx.strokeStyle="black";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(20,0);
	ctx.lineTo(44,0);
	ctx.lineTo(64,20);
	ctx.lineTo(64,44);
	ctx.lineTo(44,64);
	ctx.lineTo(20,64);
	ctx.lineTo(0,44);
	ctx.lineTo(0,20);
	ctx.lineTo(20,0);
	ctx.lineTo(44,0);
	ctx.fillStyle="gray";
	ctx.strokeStyle="black";
	ctx.lineWidth="2";
	ctx.fill();
	ctx.stroke();
};
function diamond_fbwg (ctx) {
	ctx.beginPath();
	ctx.moveTo(48,24);
	ctx.lineTo(32,44);
	ctx.lineTo(16,24);
	ctx.lineTo(24,16);
	ctx.lineTo(32,16);
	ctx.fillStyle="red";
	ctx.strokeStyle="firebrick";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(32,16);
	ctx.lineTo(40,16);
	ctx.lineTo(48,24);
	ctx.lineTo(32,44);
	ctx.fillStyle="lightblue";
	ctx.strokeStyle="blue";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
};
function diamond_silver (ctx) {
	ctx.beginPath();
	ctx.moveTo(12,24);
	ctx.lineTo(24,12);
	ctx.lineTo(40,12);
	ctx.lineTo(52,24);
	ctx.lineTo(32,48);
	ctx.lineTo(12,24);
	ctx.lineTo(24,12);
	ctx.fillStyle="lightgray";
	ctx.strokeStyle="gray";
	ctx.lineWidth="4";
	ctx.fill();
	ctx.stroke();
};
