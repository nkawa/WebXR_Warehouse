


// a-scene 全体で１つのみとする（とりあえず）
// 枠と frame 毎のパレット状況

const conv_global_to_local = (x,y) => {
    const CENTER_X = 1966 + 3885;
    const CENTER_Y = 1156 + 812;
//        const BASE_X = 3885.356;
//        const BASE_Y = 812.703;
    
    const local_x = (x - CENTER_X)/100;
    const local_y = (y - CENTER_Y)/100;
    return `${local_x} 0.01 ${local_y}`;
}

const conv_global_to_local_xy = (x,y) => {
    const CENTER_X = 1966 + 3885;
    const CENTER_Y = 1156 + 812;
    
    const local_x = (x - CENTER_X)/100;
    const local_y = (y - CENTER_Y)/100;
    return [local_x,local_y];
}

// 枠の描画
const draw_box =(box_info) =>{
    const scene = document.querySelector("a-scene");
    for (let i = 0; i < box_info.length; i++) {
        const box = document.createElement("a-plane");
        box.setAttribute("width", "0.9");
        box.setAttribute("height", "0.9");
//           box.setAttribute("depth", "1");
        box.setAttribute("rotation","-90 0 0");

        box.setAttribute("position", conv_global_to_local(box_info[i].x,box_info[i].y));
        box.setAttribute("color", "#77ffdd");
        box.setAttribute("opacity", "0.7");
        box.setAttribute("wireframe", "true");
        box.setAttribute("wireframe-linewidth", "0.6");
        scene.appendChild(box);
//            console.log("Draw Box",box_info[i].x,box_info[i].y);
    }
}

AFRAME.registerComponent("pallets", {
    schema: {
        frame: {type: 'int', default: 0},
        mode: {type: 'string', default: 'None'}
    },
  
    init: async function () {
      // To keep track of the pressed keys.
      console.log("Initialize Pallet!!", this.data.frame);
        try {
            const res = await fetch('/ptokai_box_info.json');
            this.box_info = await res.json();
            console.log("Load Box ", this.box_info.length);

            draw_box(this.box_info);
        }catch(err){
            console.log("box fetch error",err);
        }



        try {
            const res =  await fetch('/box_inspection_area_07-12.json');
            const data = await res.json();
            this.pallets = data
            console.log("Load pallet ", data.length);

            const scene = document.querySelector("a-scene");
            this.pobj= [];

            // 各パレットの初期位置を設定
            // pallets はbox の数だけあって、各pallet の中は、 start/end がある。
            // visible/unvisible の制御でいきたい
            this.pallets.forEach((pallet, index) => {
//                console.log("Working for",index);
                pallet.forEach((box, idx) => {                    
                    const obj = document.createElement("a-box");
                    const xy = conv_global_to_local_xy(this.box_info[index].x,this.box_info[index].y);
                    obj.setAttribute("position",`${xy[0]} 0.4 ${xy[1]}`);
                    obj.setAttribute("width",1);
                    obj.setAttribute("height",0.8);
                    obj.setAttribute("depth",1);
                    obj.setAttribute("color","#00eeee");
                    obj.setAttribute("opacity",0.6);
                    if( box.start <= this.data.frame && box.end >= this.data.frame ){
//                        console.log("Draw pallet", box,idx);
                        obj.setAttribute("visible",true);
                    }else{
                        obj.setAttribute("visible",false);
                    }

                    scene.appendChild(obj);
                    this.pobj.push({"start":box.start, "end": box.end, "obj":obj, "height":idx});
                });
            });
        }catch(err){
            console.log("pallet fetch error",err); 
        }
      // パレット移動情報を読み込む



    },
  
    tick: function (time, delta) {

    },
  
    update: function (oldData) {
        if (this.pobj === undefined) return;
//        console.log("Pallet", this.data.mode);

        if( this.data.mode =="None"){
            this.pobj.forEach((pinfo) => {
                if( pinfo.start <= this.data.frame && pinfo.end >= this.data.frame ){                    
                    pinfo.obj.object3D.position.y = 0.4;
                    pinfo.obj.setAttribute("visible",true);
                }else{
                    pinfo.obj.setAttribute("visible",false);
                }
            })
        }else{
            this.pobj.forEach((pinfo) => {
                if( pinfo.start <= this.data.frame){                    
                    pinfo.obj.object3D.position.y = pinfo.height*.9+0.4;
                    pinfo.obj.setAttribute("visible",true);
                }else{
                    pinfo.obj.setAttribute("visible",false);
                }
            })

        }
        
    },
  
    remove: function () {
    },
  
    play: function () {
    },
  
    pause: function () {
    }
});

