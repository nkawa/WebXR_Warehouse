


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
        mode: {type: 'string', default: 'None'},
        ptrace: {type: 'boolean', default: true}, // パレットの移動経路を表示するかどうか
    },
  
    init: async function () {
      // To keep track of the pressed keys.
      console.log("Initialize Pallet!!", this.data.frame);
      // 本当は以下のファイル読み込みはパラレルで実行可能
        try {
            const res = await fetch('/ptokai_box_info.json');
            this.box_info = await res.json();
            console.log("Load Box ", this.box_info.length);

            draw_box(this.box_info);
        }catch(err){
            console.log("box fetch error",err);
        }

        //pallet_trace
        try {
            const res = await fetch('/pallet_trace_20241003_1100-1130.json');
            this.pallet_trace = await res.json();
            console.log("Load Pallet Trace ", this.pallet_trace.length);

            // 移動経路表示用にもオブジェクトを用意
            this.ptrace=[];

        }catch(err){
            console.log("Pallet Trace  fetch error",err);
        }


        try {
            const res =  await fetch('/box_insp_sort_area_07-12.json');
            const data = await res.json();
            this.pallets = data
            console.log("Load pallet ", data.length);

            const scene = document.querySelector("a-scene");
            this.pobj= [];

            // 各パレットの初期位置を設定
            // pallets はbox の数だけあって、各pallet の中は、 start/end がある。
            // visible/invisible の制御でいきたい
            this.pallets.forEach((pallet, index) => {
//                console.log("Working for",index);
                pallet.forEach((box, idx) => {                    
                    const obj = document.createElement("a-box");
                    const xy = conv_global_to_local_xy(this.box_info[index].x,this.box_info[index].y);
                    obj.setAttribute("position",`${xy[0]} 0.4 ${xy[1]}`);
                    obj.setAttribute("width",1);
                    obj.setAttribute("height",0.8);
                    obj.setAttribute("depth",1);
                    if ("inspect_start" in box){
                        const mycolor = this.pcolor(this.data.frame, box.start, box.end, box.inspect_start, box.inspect_end);
                        console.log("IColor ", box.start, box.end, box.inspect_start, box.inspect_end,mycolor);
                        obj.setAttribute("color",mycolor);// 色でモードを表現したい！（本当は　inspect されていない時間を表現したい)
                        
                    }else{
                        obj.setAttribute("color","#00eeee");// 色でモードを表現したい！（本当は　inspect されていない時間を表現したい)                        
                    }
                    obj.setAttribute("opacity",0.6);
                    if( box.start <= this.data.frame && box.end >= this.data.frame ){
//                        console.log("Draw pallet", box,idx);
                        obj.setAttribute("visible",true);
                    }else{
                        obj.setAttribute("visible",false);
                    }

                    scene.appendChild(obj);
                    const myobj = {"start":box.start, "end": box.end, "obj":obj, "height":idx};
                    if (typeof box.inspect_start !== "undefined"){
                        myobj.pallet_type = box.pallet_type;
                        myobj.inspect_start = box.inspect_start;
                        myobj.inspect_end = box.inspect_end;
                    }
                    this.pobj.push(myobj);
                });
            });
        }catch(err){
            console.log("pallet fetch error",err); 
        }
      // パレット移動情報を読み込む

        try{
            const res =  await fetch('/frame_based_pallet_1110.json');
            const data = await res.json();

            // フレーム毎の配列にしたい。（現状は各フレーム内にframe_id が入ってる）
            var ptrack = [];
            data.forEach((frame) => {
                ptrack[frame.frame_id] = frame.tracks;
            });
            this.ptrack = ptrack;
            console.log("Load pallet track ", data.length, ptrack.length);

            const scene = document.querySelector("a-scene");
            this.ptobj= [];
            this.ptstate=[];

            // 事前に3D 用意するの、、、むずかしいかも。
            // なので、あえて用意せずにやってみる。。。

            
        }catch(err){
            console.log("pallet track fetch error",err);
        }



    },
  
    tick: function (time, delta) {

    },

    pcolor: function (frm, start, end, inspect_start, inspect_end){
        // 到着後
        if ( frm <= inspect_start){
            const col = (frm - start)/1500*200  // 10分で黒くしたい　-> 600秒 = 1500フレーム
            var bval = (col > 200)?55:Math.floor(255-col);
            var gval = 0;//col > 300)?55:Math.floor(155-col/2);
            if (bval > 255) bval = 255;
            if (gval > 255) gval = 255;
            const color = `#00${gval.toString(16).padStart(2, '0')}${bval.toString(16).padStart(2, '0')}`;
            return color;
        // 検品中
        }else if (frm <= inspect_end){
            const col = (frm - inspect_start)/1500*200  // 10分で黒くしたい　-> 600秒 = 1500フレーム
            const gval = (col > 200)?55:Math.floor(255-col);
            const bval =0;// (col > 300)?55:Math.floor(155-col/2);
            const color = `#00${gval.toString(16).padStart(2, '0')}${bval.toString(16).padStart(2, '0')}`;
            return color;
                                
        }else {// 検品済み
            const col = (frm - inspect_end)/1500*200  // 10分で黒くしたい　-> 600秒 = 1500フレーム
            const rval = (col > 200)?55:Math.floor(255-col);
            const gval = 0;// (col > 300)?55:Math.floor(155-col/2);
            const bval = 0;
            const color = `#${rval.toString(16).padStart(2, '0')}${gval.toString(16).padStart(2, '0')}${bval.toString(16).padStart(2, '0')}`;
            return color;
        }
    },
  
    update: function (oldData) {
        if (this.pobj === undefined) return;
//        console.log("Pallet", this.data.mode);

//   box 毎の表示方法
        if( this.data.mode =="None"){
            this.pobj.forEach((pinfo) => {
                const frm = this.data.frame
                if( pinfo.start <= frm && pinfo.end >= frm ){                    
                    pinfo.obj.object3D.position.y = 0.4;
                    pinfo.obj.setAttribute("visible",true);
                    // ここで色を設定 3種類が必要
                    if ("inspect_start" in pinfo){
                        const mycolor = this.pcolor(frm, pinfo.start, pinfo.end, pinfo.inspect_start, pinfo.inspect_end);
//                        console.log("Attribute:",pinfo, mycolor);
                        pinfo.obj.setAttribute("color",mycolor);
                    }
                }else{
                    pinfo.obj.setAttribute("visible",false);
                }
            })
        }else{
            this.pobj.forEach((pinfo) => {
                if( pinfo.start <= this.data.frame){                    
                    pinfo.obj.object3D.position.y = pinfo.height*.9+0.4;
                    pinfo.obj.setAttribute("visible",true);
                    obj.setAttribute("color","#00eeee");// 色でモードを表現したい！（本当は　inspect されていない時間を表現したい)

                }else{
                    pinfo.obj.setAttribute("visible",false);
                }
            })
        }

// pallet track の表示
        if (this.data.mode == "None"){ // とりあえず、通常モードのみ

            const frm = this.data.frame%4500; // 11:00 は 36000から　（とりあえずループでごまかす）

            if (this.ptrack.hasOwnProperty(frm)){
                const scene = document.querySelector("a-scene");

                const frame_info = this.ptrack[frm];

                frame_info.forEach((pinfo) => {
                    if (this.ptobj.hasOwnProperty(pinfo.track_id)){// すでにある
                        const xy = conv_global_to_local_xy(pinfo.bbox[0]+pinfo.bbox[2]/2,pinfo.bbox[1]+pinfo.bbox[3]/2);
                        obj = this.ptobj[pinfo.track_id];
                        obj.setAttribute("position",`${xy[0]} 0.4 ${xy[1]}`);
                        obj.setAttribute("visible",true);
                        this.ptstate[pinfo.track_id] = frm; // 表示したフレームを記録

                        track_obj = this.ptrack[pinfo.track_id] 


                    }else{// 無いので作る
                        var obj = document.createElement("a-box");
                        const xy = conv_global_to_local_xy(pinfo.bbox[0]+pinfo.bbox[2]/2,pinfo.bbox[1]+pinfo.bbox[3]/2);
                        obj.setAttribute("position",`${xy[0]} 0.4 ${xy[1]}`);
                        obj.setAttribute("width",1);
                        obj.setAttribute("height",0.8);
                        obj.setAttribute("depth",1);
                        obj.setAttribute("color","#eeee00");
                        obj.setAttribute("opacity",0.6);
                        obj.setAttribute("visible",true);
                        scene.appendChild(obj);
                        this.ptobj[pinfo.track_id] = obj;
                        this.ptstate[pinfo.track_id] = frm; // 表示したフレームを記録//
 //                       console.log("New PalletMove",pinfo.track_id, xy);

                        // 移動経路も表示
                        const track_obj = document.createElement("a-entity");                        
                        track_obj.setAttribute("ribbon",{path: this.pallet_trace[pinfo.track_id].points, color: "#ff0000", width: 0.1});
                        scene.appendChild(track_obj);
                        this.ptrace[pinfo.track_id] = track_obj;

                    }

                })
            }// frame 情報がある。
            
            // 更新されてないobject を消す必要がある。
            this.ptobj.forEach((obj, idx) => {
                if( this.ptstate[idx] != frm){
                    obj.setAttribute("visible",false);
                    // 本当はobj も消していいかも
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

