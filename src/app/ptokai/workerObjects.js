// a-scene 全体で１つのみとする（とりあえず）
// ワーカーの情報を表示する

const conv_global_to_local = (x, y) => {
  const CENTER_X = 1966 + 3885;
  const CENTER_Y = 1156 + 812;
  //        const BASE_X = 3885.356;
  //        const BASE_Y = 812.703;

  const local_x = (x - CENTER_X) / 100;
  const local_y = (y - CENTER_Y) / 100;
  return `${local_x} 0.01 ${local_y}`;
};

const conv_global_to_local_xy = (x, y) => {
  const CENTER_X = 1966 + 3885;
  const CENTER_Y = 1156 + 812;

  const local_x = (x - CENTER_X) / 100;
  const local_y = (y - CENTER_Y) / 100;
  return [local_x, local_y];
};

const worker_colors = [
  "#C7132D", //0
  "#0F56B8", //1
  "#B6D605", //2
  "#D62514", //3
  "#459E23", //4
  "#DFDFDF", //5
  "#A94F71", // 6 pink
  "#70A4CE", // 7 cyan
  "#6241A0", // 8 purple
  "#1A2E61", // 9 darkblue
  "#422E6D", // 10 darkpurple
  "#013E34", // 11 darkgreen
  "#954150", // 12 darkpink
  "#483A5C", // 13 darkpurple
  "#A4A4A4", // 14 gray (not used)
  "#D6A14D", // 15 darkyellow(not used)
  "#954B02", // 16 darkorange
  "#052D29", // 17 darkgreen
  "#D6D6D6", // 18 gray
  "#012824", // 19 darkgreen
  "#99405C", // 20 darkpink
  "#456682", // 21 darkcyan
  "#D6D6D6", // 22 gray
  "#552C5E", // 23 darkpurple
  "#05423B", // 24 darkgreen
  "#8D4F64", // 25 darkpink
  "#D6D6D6", // 26 gray
  "#5F94BC", // 27 lightblue
  "#D6D6D6", // 28 gray
  "#D6D6D6", // 29 gray
  "#D6D6D6", // 30 gray
  "#D6D6D6", // 31 gray
  "#085045", // 32 darkgreen
  "#9C8500", // 33 darkyellow
  "#B64E74", // 34 pink
  "#4C8CBE", // 35 blue
  "#4D3082", // 36 darkpurple
  "#AB5A01", // 37 darkorange
  "#5E2C29", // 38 darkred
];

const task_labels = ["検品中", "搬送中", "仕分け中"];

AFRAME.registerComponent("workers", {
  schema: {
    frame: { type: "int", default: 0 },
    mode: { type: "string", default: "None" },
    worker: { type: "boolean", default: true },
    label: { type: "boolean", default: true },  // 通常ラベル
    task: { type: "boolean", default: true },   // タスクラベル
    select_id: {type: 'int', default: -1},
  },

  init: async function () {
    // To keep track of the pressed keys.
    console.log("Initialize Workers!!", this.data.frame);
    this.previousPosition = new THREE.Vector3();
    this.previousRotation = new THREE.Euler();
    
    try{// ワーカの配列で、タスクの start/end が記載
      const res = await fetch("http://localhost:3000/worker_task_eachframe_20241003_11.json");
      this.w_task = await res.json();
      console.log("Load worker task info",this.w_task.length);
    } catch (err) {
      console.log("worker task frame error", err);
    }

    try {
      const res = await fetch("http://localhost:3000/frame_based_worker_1110.json");
      this.workers = await res.json();
      console.log("Load workers ", this.workers.length);
      const scene = document.querySelector("a-scene");

      const hud = document.getElementById("hud");
      //            console.log("HUD",hud);
      // worker object 毎に初期設定

      this.wobj = [];
      this.task_objs = []; // タスク情報（これもテキスト）
      this.textObjs = [];
      // 今回は　39ワーカ固定で。
      for (let i = 0; i < 39; i++) {
        const obj = document.createElement("a-cylinder");
        obj.setAttribute("radius", 0.3);
        obj.setAttribute("height", 1.6);
        //                console.log("Set Color",i,worker_colors[i]);
        obj.setAttribute("color", worker_colors[i]);
        //                obj.setAttribute("color", "#FF0000");
        obj.setAttribute("opacity", 0.6);
        obj.setAttribute("visible", false);
        scene.appendChild(obj);
        this.wobj.push({ obj: obj, id: i });

        
        const textObj = document.createElement("div");
        textObj.setAttribute("id", `worker${i}`);
        textObj.setAttribute(
          "style",
          "position: absolute; color: white; font-size: 16px; font-family: sans-serif; pointer-events: none; z-index: 1000;"
        );
        textObj.setAttribute("visible", true);
        hud.appendChild(textObj);
        this.textObjs.push(textObj);

        // タスク表示用のオブジェクト（本当はグループ化したほうが簡単？）
        // 結局、Labelと同じで CSS で表示したほうがよさそう
//        const tobj = <ModelLabel key={i} metadata={i+":検品"} position={{x:100,y:100}}></ModelLabel>
//        console.log("TOBJ",tobj)
//        this.task_objs.append(tobj)
//        hud.appendChild(tobj);


      }

      this.selected_id = -1;
      this.update_wokers();
      console.log("Worker Object Added", this.wobj.length);
    } catch (err) {
      console.log("worker fetch error", err);
    }

    this.camera = document.querySelector("a-camera");
    this.threeCamera = this.camera.getObject3D("camera");
    //        console.log("Got Cameras",this.camera, this.threeCamera);
  },

  updateLabels: function () {
    // CSSで文字表示
    if (this.wobj === undefined) return;
    if (this.threeCamera === undefined) return;

    const frm = this.data.frame % 4500; // 11:00 は 36000から
    const width = window.innerWidth;
    const height = window.innerHeight;

    const frame_info = this.workers[frm].tracks;
    const view_obj = Array(39).fill(false);


    const wtask_info=[];
    
    if (this.data.label) {
      frame_info.forEach((winfo, idx) => {
        const wid = winfo.track_id;
        const object3D = this.wobj[wid].obj.object3D;
        const worldPosition = object3D.getWorldPosition(new THREE.Vector3());
        worldPosition.y += 1; //　ラベル表示位置を 1m 上空に 高さを調整
        // スクリーン座標を取得する
        const projection = worldPosition.project(this.threeCamera);
        if (projection.z > 1.0) return; // カメラの後ろにある場合は表示しない
        const sx = (width / 2) * (+projection.x + 1.0) - 4 - (wid > 9 ? 5 : 0);
        const sy = (height / 2) * (-projection.y + 1.0) - 5;
        if (sx < 0 || sx > width || sy < 0 || sy > height) return; // 画面外の場合は表示しない
        //                    console.log("Draw text",wid, sx,sy);

        if(this.data.task){
          const wk =  this.w_task[wid];
//          console.log("Task of",idx, wk);
          const tfrm = this.data.frame %9000; // タスクはとりあえず１時間分入ってる
          const tf = wk.some((info)=>{ // 見つかるまでのループ
//            console.log("task info",info)
            if( info.start <= tfrm  && info.end >= tfrm){
              const frmdiff = tfrm-info.start;
              const sec = frmdiff/2.5
              const min = Math.floor(sec /60).toString().padStart(2,'0');
              const secstr = Math.floor(sec %60).toString().padStart(2,'0');
              wtask_info.push({
                id: wid,
                pos: {x:sx+90,y:sy-74},
                txt: task_labels[info.label]+'('+min+":"+secstr+')',
                label: info.label,
              });
              return true;
            }
          });
//          console.log("Found",tfrm , idx, tf);
        }
        const tf = this.textObjs[wid];
        view_obj[wid] = true;
        tf.innerHTML = `${wid}`;
        tf.style.transform = `translate(${sx}px, ${sy}px)`;
      });
    }

    view_obj.forEach((v, idx) => {
      if (!v || !this.data.label) {
        this.textObjs[idx].innerHTML = "";
      }
    });

    if(this.data.task){
      const wkEvent = new CustomEvent("worker_task", {detail: wtask_info});
      this.el.dispatchEvent(wkEvent);
    }

  },

  update_wokers: function (){
    const frm = this.data.frame % 4500; // 11:00 は 36000から
    const frame_info = this.workers[frm].tracks;
    //                console.log("Tracks len",this.data.frame,  frame_info.length);
    const view_obj = Array(39).fill(false);
    frame_info.forEach((winfo, idx) => {
      const wid = winfo.track_id;
      view_obj[wid] = true;
      //                    console.log("Worker",wid);
      const xy = winfo.bbox;
      const xy2 = conv_global_to_local_xy(
        xy[0] + xy[2] / 2,
        xy[1] + xy[3] / 2
      );
      this.wobj[wid].obj.setAttribute("position", xy2[0] + " 0.8 " + xy2[1]);
      this.wobj[wid].obj.setAttribute("visible", true);

    });
    this.updateLabels();
    // 表示されなかったオブジェクトを消す
    view_obj.forEach((v, idx) => {
      if (!v || !this.data.worker) {
        this.wobj[idx].obj.setAttribute("visible", false);
      }
    });

  },

  tick: function (time, delta) {
    // カメラが動いたかを検知したい
    if (this.camera === undefined) return;
    const currentPosition = this.threeCamera.position;
    const currentRotation = this.threeCamera.rotation;
    const moved = !currentPosition.equals(this.previousPosition);
    const rotated = !currentRotation.equals(this.previousRotation);

    // カメラの位置が変化したかチェック
    if (moved) {
      //          console.log('カメラが移動しました:', currentPosition);
      this.previousPosition.copy(currentPosition);
    }
//    console.log("Pos",currentPosition)

    // カメラの回転が変化したかチェック
    if (rotated) {
      //        console.log('カメラが回転しました:', currentRotation);
      this.previousRotation.copy(currentRotation);
    }

    if (moved || rotated) {
      // css 変更
      this.updateLabels();
    }
  },

  update: function (oldData) {
    if (this.wobj === undefined) return;
    //        console.log("Pllet", this.data.mode);

    if (this.data.select_id != this.selected_id){// 変化があった場合
      if (this.selected_id != -1){
          this.wobj[this.selected_id].obj.setAttribute("color", worker_colors[this.selected_id]);
          this.wobj[this.selected_id].obj.setAttribute("height", 1.6);
          this.wobj[this.selected_id].obj.setAttribute("radius", 0.3);
      }
      if (this.data.select_pid != -1){
//                console.log("Select",this.data.select_pid, typeof this.data.select_pid, this.box_obj);
        if (typeof this.wobj[this.data.select_id] !== "undefined"){
          this.wobj[this.data.select_id].obj.setAttribute("color", "#FF0000");
          this.wobj[this.data.select_id].obj.setAttribute("height", 3);
          this.wobj[this.data.select_id].obj.setAttribute("radius", 0.5);
        }
      }
      this.selected_id = this.data.select_id;
  }


    if (this.data.mode == "None") {
      const frm = this.data.frame % 4500; // 11:00 は 36000から
      const frame_info = this.workers[frm].tracks;
      //                console.log("Tracks len",this.data.frame,  frame_info.length);
      const view_obj = Array(39).fill(false);
      frame_info.forEach((winfo, idx) => {
        const wid = winfo.track_id;
        view_obj[wid] = true;
        //                    console.log("Worker",wid);
        const xy = winfo.bbox;
        const xy2 = conv_global_to_local_xy(
          xy[0] + xy[2] / 2,
          xy[1] + xy[3] / 2
        );
        this.wobj[wid].obj.setAttribute("position", xy2[0] + " 0.8 " + xy2[1]);
        this.wobj[wid].obj.setAttribute("visible", true);
      });
      this.updateLabels();
      // 表示されなかったオブジェクトを消す
      view_obj.forEach((v, idx) => {
        if (!v || !this.data.worker) {
          this.wobj[idx].obj.setAttribute("visible", false);
        }
      });
    }
  },

  remove: function () {},

  play: function () {},

  pause: function () {},
});
