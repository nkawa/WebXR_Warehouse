
"use client";

import * as React from 'react'
//import 'aframe';

import Head from 'next/head';
import Script from 'next/script';
import Controller from './controller.js';

import { load_workers } from './load_worker_stat.js';

//import '../../vendor/button-wasd-controls.css';


export default function Page() {

    const [c_pos_x,set_c_pos_x] = React.useState(0)
    const [c_pos_y,set_c_pos_y] = React.useState(0.5)
    const [c_pos_z,set_c_pos_z] = React.useState(1.0)
    const [c_deg_x,set_c_deg_x] = React.useState(0)
    const [c_deg_y,set_c_deg_y] = React.useState(0)
    const [c_deg_z,set_c_deg_z] = React.useState(0)

    const [disp_mode,set_disp_mode] = React.useState("None")
    const [frame_step,set_frame_step] = React.useState(10)
    const [ptrace_mode,set_ptrace_mode] = React.useState(false);
    const [label_mode, set_label_mode] = React.useState(true);
    const [worker_mode, set_worker_mode] = React.useState(true);
    const [worker_disp, set_worker_disp] = React.useState(true);
    const [worker_stat, set_worker_stat] = React.useState([]);

    const [cur_frame, set_cur_frame] = React.useState(0);
    const [max_frame, set_max_frame] = React.useState(9000*5);//(5hour)
    const [interval_id, set_interval_id] = React.useState(null);

    const [select_id, set_select_id] = React.useState(-1);
    
    const add_image = () => {
        const img = document.createElement("a-image");
        img.setAttribute("src","#FloorImage");
        img.setAttribute("width","39.32");
        img.setAttribute("height","23.12");
        img.setAttribute("rotation","-90 0 0");
        img.setAttribute("position","0 0 0");
        const scene = document.querySelector("a-scene");
        scene.appendChild(img);
    }

    const checkGLsize = () => {
        const canvas = document.createElement("canvas");

        const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
        if (gl) {
            const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            console.log("最大テクスチャサイズ:", maxTextureSize);
        } else {
            console.log("WebGLはサポートされていません。");
        }
    }

    const update_worker_state = (fnum) => {
// ワーカの状態を更新したい

    }

    const tick = () => {
        set_frame_step((fsp)=>{
            set_cur_frame((f)=>{
                const next = (f < 45000)?f+fsp:0;
                // worker stat などもここで更新！
                // update_worker_state(next);
                return next;
            });
            return fsp;
        });
    }

    const play_button_listener = (ev) =>{
        set_interval_id((iid)=>{
//            console.log("Interval_id",iid,ev);
            if (iid == null){
                    const inter_id = setInterval(tick, 100)
//                    console.log("Set Interval",inter_id);
//                    console.log("Button",ev.srcElement);
                    ev.srcElement.innerText="II";
                    return inter_id;
            }else{
                ev.srcElement.innerText="▶";
                clearInterval(iid);
                    return null;
            }
        })
    }

    const set_control_buttons = () => {
        const doButton  = document.getElementById("hoshi");
        const cam = document.getElementById("cameraRig");
        doButton.addEventListener("click", () => {
            const camel = document.getElementById("cameraRig");
            // 視点を上空からにしたい
            cam.setAttribute("position","0 13 0");
//            cam.setAttribute("rotation",{x:-90,y:0,z:0}); 
            cam.object3D.rotation.set(-Math.PI/2, 0, 0);
//            cam.object3D.updateMatrixWorld();
//            console.log(cam.object3D.rotation);
        });
        const maruButton  = document.getElementById("maru");
        maruButton.addEventListener("click", () => {
            // 視点を上空からにしたい
            const camel = document.getElementById("camera");
            camel.setAttribute("position","0 1.6 0");
            camel.setAttribute("rotation","0 0 0"); 
            console.log("Camera",camel.object3D.rotation);
            cam.setAttribute("position","0 0 0");
            cam.setAttribute("rotation","0 0 0"); 
            console.log("Maru", cam.object3D.rotation);
            
        });
        const shikakuButton  = document.getElementById("shikaku");
        shikakuButton.addEventListener("click", () => {
            // 視点を斜め上空からにしたい
            cam.setAttribute("position","0 3 10");
            cam.setAttribute("rotation","-45 0 0"); 
        });
        const playButton = document.getElementById("play");
        playButton.addEventListener("click", play_button_listener);

    }
    
    // 初回のみ実行
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            require("aframe");// <-結局、A-Frameは動的なインポートをするのが重要！
            require('aframe-troika-text');
            require('../../components/aframe-gui');
            require('../../vendor/button-wasd-controls');
            require('../../components/updown-key-controls');
            require('./boxObjects.js'); // A-Frame pallets
            require('./workerObjects.js'); // A-Frame workers
            require('../../components/camera-move-notify');// カメラ移動通知
//            require('./load_worker_stat');// データ読み込み
            
            console.log("Load worker stat")
            const stat_data = load_workers();
            console.log("Stat data",stat_data);
            stat_data.then((data)=>{
                console.log("promised data",stat_data);
                set_worker_stat(data);
            });
    /*
            const scene = document.querySelector("a-scene");
            const palcomp = document.createElement("a-entity");
            palcomp.setAttribute("pallets", {frame:cur_frame});
            scene.appendChild(palcomp);
*/  

            set_control_buttons();
        }
//        checkGLsize();
    }, [window]);


    // フレーム情報が変化した場合に実行
    React.useEffect(()=>{
        const wor = document.getElementById("workers_el");
        wor.setAttribute("workers", {frame:cur_frame, mode:disp_mode});
    },[cur_frame]);

    React.useEffect(()=>{
        const palcomp = document.getElementById("pallets_el");
        palcomp.setAttribute("pallets", {frame:cur_frame, mode:disp_mode});
        const wor = document.getElementById("workers_el");
        wor.setAttribute("workers", {frame:cur_frame, mode:disp_mode, label:label_mode});
    },[disp_mode]);

    React.useEffect(()=>{
        const wor = document.getElementById("workers_el");
        wor.setAttribute("workers", {frame:cur_frame, mode:disp_mode, label:label_mode, worker:worker_mode});
    },[label_mode, worker_mode]);

    const controllerProps = {
        cur_frame,set_cur_frame,max_frame,set_max_frame,
        c_pos_x,set_c_pos_x,c_pos_y,set_c_pos_y,c_pos_z,set_c_pos_z,
        c_deg_x,set_c_deg_x,c_deg_y,set_c_deg_y,c_deg_z,set_c_deg_z,
        disp_mode,set_disp_mode, frame_step, set_frame_step,
        ptrace_mode,set_ptrace_mode,
        label_mode, set_label_mode, worker_mode,set_worker_mode,
        worker_disp, set_worker_disp,worker_stat, set_worker_stat, select_id, set_select_id
    }

    return (
        <>
            {/* for react dev-tool   <Script src="http://localhost:8097" /> */}
            <a-scene xr-mode-ui="enabled: true"
                cursor__mouse="rayOrigin: mouse"
                cursor__touch="rayOrigin: touch"
            >
                <a-assets>
                    <a-asset-item id="iconfontsolid" src="fonts/fa-solid-900.ttf"></a-asset-item>
                    <a-asset-item id="iconfontbrand" src="fonts/fa-brands-400.ttf"></a-asset-item>
                    <a-asset-item id="BIZfont" src="fonts/BIZUDPGothic-Bold.ttf"></a-asset-item>

                    <img id="FloorImage" src="stitched_20241106105031.jpg"></img>
                </a-assets>

                {/*　ここで倉庫の床面を記述したい  サイズは */}
                {/* base shift BASE_X = 3885.356　BASE_Y = 812.703　
                    画像サイズは 3932x2312 = 39.3m x 23.1 m 
                    画像の中心は 1966, 1156 -> 1966+3885 , 1156+812 = 5851, 1968
                    <a-plane src="#warehouse" width="39.32" height="23.12" rotation="-90 0 0" position="0 0 0" color="#333333"></a-plane>

                    柱は  51, 52 の間  "x": 6665,        "y": 2020,
                    6890-6665 = 225 なので、柱の間隔は 225/2 = 112.5
                    6665+112 = 6777 -5851 = 925
                    2020-1968 =             52
                                "num": 52,        "x": 6890,    "y": 2020,

                
                */}
                <a-image src="#FloorImage" width="39.32" height="23.12" rotation="-90 0 0" position="0 0 0" ></a-image>

                {/* 柱 *
                <a-box width="1" height="4" depth="1" position="9.2 2 0.52" color="#999999" opacity="0.5"></a-box>            
                <a-box width="1" height="4" depth="1" position="-1.05 2 0.52" color="#999999" opacity="0.5"></a-box>
                <a-box width="1" height="4" depth="1" position="9.2 2 -9.48" color="#999999" opacity="0.5"></a-box>
                <a-box width="1" height="4" depth="1" position="-1.05 2 -9.48" color="#999999" opacity="0.5"></a-box>
                */}

                <a-sky color="#444466"></a-sky>

                <a-entity id="mouseCursor" cursor="rayOrigin: mouse" raycaster="objects: [gui-interactable]"></a-entity>
                

                <a-entity id="pallets_el" pallets={"frame:"+cur_frame}>  </a-entity>

                <a-entity id="workers_el" workers={"frame:"+cur_frame}>  </a-entity>

                {/* Mouse cursor so we can click on the scene with mouse or touch. 
                <a-entity id="leftHand" laser-controls="hand: left" raycaster="objects: [gui-interactable]"></a-entity>
                <a-entity id="rightHand" laser-controls="hand: right" raycaster="objects: [gui-interactable]"></a-entity>
                  */}
               
                {/*	 Camera + cursor. -->*/}
                <a-entity id="cameraRig" position="0 0 0"  button-wasd-controls updown-key-controls>
                    <a-camera id="camera" position="0 1.6 0" wasd-controls="fly:true" >  </a-camera>
                </a-entity>
            </a-scene>
            <div id="hud" className="hudOverlay"></div>

            <div className="actions">
                <div className="buttonUI">
                    <button id="maru" type="button" className="button">●</button>
                    <br />
                    <button id="play" type="button" className="button">▶</button>
                </div>   
                <div className="buttonUI">
                    <button id="leftBtn" type="button" className="button">←</button>
                </div>
                <div className="buttonUI">
                    <button id="upBtn" type="button" className="button">↑</button>    
                    <br />  
                    <button id="downBtn" type="button" className="button">↓</button>
                </div>
                <div className="buttonUI">
                    <button id="rightBtn" type="button" className="button">→</button>
                </div>   
                <div className="buttonUI">
                    <button id="hoshi" type="button" className="button">☆</button>
                    <br />
                    <button id="shikaku" type="button" className="button">◆</button>
                </div>   
            </div>
            <Controller {...controllerProps}/>

        </>
    )

}
