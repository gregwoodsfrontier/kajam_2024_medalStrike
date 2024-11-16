import { k } from "../kaplay"
import { GameObj, AreaComp, PosComp, FixedComp } from "kaplay";
import { RigidBodyComp } from "../planck/rigid_body";


export type SlingLineOpt = {
    speed: number;
};
  
// custom comps start
export function slingLine(_opt: SlingLineOpt) {
    let isAreaPressed = false;
    return {
        id: "sling",
        require: ["area", "pos", "rigidBody"],
        add(this:GameObj<AreaComp|PosComp|RigidBodyComp>) {
            k.onMousePress(() => {
                if (this.isHovering()) {
                isAreaPressed = true;
                }
            });
            k.onMouseRelease(() => {
                if (isAreaPressed == true) {
                const v = this.pos.sub(k.mousePos()).unit();
                let speed = _opt.speed || 1;

                this.addForce(v.scale(speed));
                isAreaPressed = false;
                }
            });
            },
            draw(this:GameObj<PosComp|FixedComp>) {
            if (isAreaPressed) {
                k.drawLine({
                p1: k.vec2(0, 0),
                p2: this.fromScreen(k.mousePos()),
                width: 14,
                color: k.rgb(0, 0, 255),
                });
            }
        },
    };
}