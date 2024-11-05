import kaplay from "kaplay";

const k = kaplay({
	global: false,
	// width: 960,
	// height: 640,
	// stretch: true,
	debug: true,
	background:[0, 255, 255]
})

k.loadSprite("bean", "sprites/bean.png")

// custom comps start
function slingLine() {
    let isAreaPressed = false;
  return {
    id: 'sling',
    require: ['area', 'pos'],
    add(){
        k.onMousePress(() => {
        isAreaPressed = true;
      });
      k.onMouseRelease(() => {
		//@ts-ignore
        const v = this.pos.sub(k.mousePos());
        const speed = v.len();
		//@ts-ignore
        this.use(k.move(v.scale(1/speed), speed));
        isAreaPressed = false;
      });
    },
    draw() {
      if (isAreaPressed) {
        k.drawLine({
          p1: k.vec2(0, 0),
		  //@ts-ignore
          p2: this.fromScreen(k.mousePos()),
          width: 14,
          color: k.rgb(0, 0, 255),
        });
      }
    },
  };
}

export function doubleSling(): any {
    let isAreaPressed = false;
  return {
    id: 'sling',
    require: ['area', 'pos'],
    
    add() {
      k.onMousePress(() => {
        isAreaPressed = true;
      });
      k.onMouseRelease(() => {
        const v = this.pos.sub(k.mousePos());
        const speed = v.len();
        this.use(k.move(v.scale(1/speed), speed));
        isAreaPressed = false;
      });
    },
    draw() {
      if (isAreaPressed) {
        const v = this.pos.sub(k.mousePos()).normal().unit();
        const p = this.fromScreen(k.mousePos());
        k.drawLines({
          pts: [v.scale(32), p, v.scale(-32)],
          width: 14,
          color: k.rgb(0, 0, 255),
          join: "round"
        });
      }
    },
  };
}


// custom function end



k.scene("game", () => {
	const enemy = []

	const enemyCoords = [
		{x: k.width()*0.35, y: k.height()*0.50},
		{x: k.width()*0.55, y: k.height()*0.50},
		{x: k.width()*0.45, y: k.height()*0.60}		
	]

	for(let i = 0; i < enemyCoords.length; i++) {
		enemy.push(
			k.add([
				k.sprite("bean"),
				k.color(255, 0, 255),
				k.pos(enemyCoords[i].x, enemyCoords[i].y),
				k.area(),
				k.anchor("center")
			])
		)
	}
	
})

k.scene("test", () => {
	const bean = k.add([
		k.pos(120, 80),
		k.sprite("bean"),
		k.anchor("center"),
		k.area(),
		doubleSling()
	])

})

k.debug.inspect = true

// k.go("test")
k.go("test")

