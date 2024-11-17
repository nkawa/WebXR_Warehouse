
"use client";

import * as React from 'react'
//import 'aframe';

import Head from 'next/head';
import Script from 'next/script';
import Controller from './controller.js';

import { load_workers } from './load_worker_stat.js';

//import '../../vendor/button-wasd-controls.css';
import WorkerTaskStates from "../../components/WorkerTaskStates";
import PalletInfoDisp from '../../components/PalletInfoDisp';


export default function Page() {

    const [disp_mode, set_disp_mode] = React.useState("None")
    const [frame_step, set_frame_step] = React.useState(1)
    const [interval_time, set_interval_time] = React.useState(60); // インターバル時刻
    const [min_mode, set_min_mode] = React.useState(true); // チェックで　11:00- 外すと7:00-
    const [label_mode, set_label_mode] = React.useState(true);
    const [task_label, set_task_label] = React.useState(false);
    const [worker_mode, set_worker_mode] = React.useState(true);
    const [worker_disp, set_worker_disp] = React.useState(false);//作業者の統計パネルを出すか出さないか
    const [worker_stat, set_worker_stat] = React.useState([]); // 作業者の統計情報
    const [pallet_disp, set_pallet_disp] = React.useState(true); // パレットを表示するかどうか
    const [ptrace_mode, set_ptrace_mode] = React.useState(false);
    const [pinfo_disp, set_pinfo_disp] = React.useState(false); // パレット個別情報を表示するか
    const [pallet_info, set_pallet_info] = React.useState([]); // パレット毎の情報
    const [pstat_disp, set_pstat_disp] = React.useState(false); // パレットの統計情報を表示するか
    const [pallet_stat, set_pallet_stat] = React.useState([]); // パレットの統計情報

    const [min_frame, set_min_frame] = React.useState(9000 * 4); // 11:00-
    const [cur_frame, set_cur_frame] = React.useState(9000 * 4); // 11:00-
    const [max_frame, set_max_frame] = React.useState(9000 * 5);//(5hour)
    const [interval_id, set_interval_id] = React.useState(0);
    const [select_id, set_select_id] = React.useState(-1);
    const [select_pid, set_select_pid] = React.useState(-1);
    const [task_info, set_task_info] = React.useState([]); // ワーカー毎のタスク情報の表示
    const [use_video, set_use_video] = React.useState(false); // ビデオを再生するかどうか

    const [small_panel, set_small_panel] = React.useState(false); // 表示最小化


    const pstatRef = React.useRef(null);
    const workerRef = React.useRef(null);


    const add_image = () => {
        const img = document.createElement("a-image");
        img.setAttribute("src", "#FloorImage");
        img.setAttribute("width", "39.32");
        img.setAttribute("height", "23.12");
        img.setAttribute("rotation", "-90 0 0");
        img.setAttribute("position", "0 0 0");
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
        set_frame_step((fsp) => {
            set_cur_frame((f) => {
                const next = (f < 45000) ? f + fsp : 0;
                // worker stat などもここで更新！
                // update_worker_state(next);
                return next;
            });
            return fsp;
        });
    }

    React.useEffect(()=>{
        // インターバル時間が変更された場合の対応
        // 現在のinterval を止めて、新しいのを始める
        set_interval_id((iid) => {
            if (iid == 0) {// 停止中なので関係なし
                return iid;
            } else {
                clearInterval(iid);
                const inter_id = setInterval(tick, interval_time)
                return inter_id;
            }
        })
    },[interval_time])


    const play_button_listener = (ev) => {
        set_interval_id((iid) => {
            //            console.log("Interval_id",iid,ev);
            if (iid == 0) {
                const inter_id = setInterval(tick, interval_time)
                //                    console.log("Set Interval",inter_id);
                //                    console.log("Button",ev.srcElement);
                ev.srcElement.innerText = "II";
                return inter_id;
            } else {
                //  console.log("x");
                ev.srcElement.innerText = "▶";
                clearInterval(iid);
                return 0;
            }
        })
    }

    const set_control_buttons = () => {
        const playButton = document.getElementById("play");
        //        const evts = getEventListeners(playButton); // ブラウザでは使えないｗ
        if (!playButton.addEvl) {
            playButton.addEventListener("click", play_button_listener);
            playButton.addEvl = true;

            const doButton = document.getElementById("hoshi");

            const cam = document.getElementById("camera");
            const orbitcontrol = cam.components['orbit-controls'];
            const tcam =  cam.getObject3D('camera')

            doButton.addEventListener("click", () => {
                tcam.position.set(0, 10, 1);
                tcam.rotation.set(Math.PI / -2, 0, 0);
                orbitcontrol.target.set(0,0,0);
            });
            const maruButton = document.getElementById("maru");
            maruButton.addEventListener("click", () => {
                // 視点を上空からにしたい
                tcam.position.set(0, 3, 5);
                tcam.rotation.set(0, 0, 0);
//                tcam.quartanion.set(0,0,0,1);
                orbitcontrol.target.set(0,0,0);
                // targetもリセットしたい
            });
            const shikakuButton = document.getElementById("shikaku");
            shikakuButton.addEventListener("click", () => {
                tcam.position.set(0, 3, 10);
                tcam.rotation.set(Math.PI*-40/360, 0,0);
                orbitcontrol.target.set(0,0,0);
            });

            const turnButton = document.getElementById("turn");
            turnButton.addEventListener("click", () => {
                if (orbitcontrol.controls.autoRotate ){
                    orbitcontrol.controls.autoRotate = false;
                }else{
                    orbitcontrol.controls.autoRotate = true;
                }
            });

            const vplayButton = document.getElementById("vplay");
            vplayButton.addEventListener("click", () => {
                const vid = document.getElementById('FloorVideo');
                set_use_video((v)=>{
                    if (v){
                        if (vid.paused){
                            vid.play();                    
                        }else{
                            vid.pause();
                        }
                    }
                    return v;
                });

            });


        }
    }
    const handlePstatEvent = (e) => {
        //        console.log("Got Pstat Event!", e.detail.length);
        set_pallet_stat(e.detail);
    }

    const handlePalletInfo = (e) => {
//        console.log("Got PalletInfo", e.detail.length, e.detail);
        set_pallet_info(e.detail);
    }    

    const handleWorkerEvent = (e) => {
//        console.log("Got Worker Event!", e.detail.length);
        set_task_info(e.detail);
    }

    React.useEffect(()=>{
        if (min_mode){
            set_min_frame(9000*4); // 11:00
            if (cur_frame < 9000*4){
                set_cur_frame(9000*4);
            }             
        }else{
            set_min_frame(0);
        }
    },[min_mode])

    React.useEffect(()=>{
        const vid = document.getElementById('FloorVideo');
        if(use_video && vid.pause){
            const current_sec = (cur_frame%9000)/30; 
            vid.currentTime = current_sec;
        }
    },[cur_frame]);

    const setOrbitControl_Key = () => {
        const cam = document.getElementById("camera");
        if (cam) {
            //            console.log("Camera: for orbit",cam);
            const oc = cam.components['orbit-controls'];
            if (oc) {
                //              console.log("OrbitControl",oc);
                oc.controls.listenToKeyEvents(window);
            } else {
                console.log("No orbit!", oc)
            }
        }
        set_control_buttons();

    }

    // 初回のみ実行
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            // pstatRef を使って、boxObjects からパレットの統計情報を取得する
            const pstatEl = pstatRef.current;
//            console.log("PstatEl",pstatEl);
            if (pstatEl) {
                pstatEl.addEventListener("pallet_stats", handlePstatEvent);
                pstatEl.addEventListener("pallet_info", handlePalletInfo);
            }
            const workerEl = workerRef.current;
            if (workerEl) {
                console.log("Set worker events");
                workerEl.addEventListener("worker_task",handleWorkerEvent);
            }

            require("aframe");// <-結局、A-Frameは動的なインポートをするのが重要！
            require('aframe-troika-text');
            require('aframe-orbit-controls');
            require('../../components/aframe-gui');
            require('../../vendor/button-wasd-controls');
            require('../../components/updown-key-controls');
            require('./boxObjects.js'); // A-Frame pallets
            require('./workerObjects.js'); // A-Frame workers
            //            require('../../components/camera-move-notify');// カメラ移動通知
            //            require('./load_worker_stat');// データ読み込み


            console.log("Load worker stat")
            const stat_data = load_workers();
            //            console.log("Stat data",stat_data);
            stat_data.then((data) => {
                //                console.log("promised data",stat_data);
                set_worker_stat(data);
            });

            // add key event listener to OrbitControl
            setTimeout(setOrbitControl_Key, 500);

            return () => {
                // パレット状態を boxObjects と交換するためのイベントリスナ
                if (pstatEl) {
                    pstatEl.removeEventListener("pallet_stat", handlePstatEvent);
                }
            }
        }
        //        checkGLsize();
    }, []);


    // フレーム情報が変化した場合に実行



    React.useEffect(() => {
        const wor = document.getElementById("workers_el");
        wor.setAttribute("workers", { frame: cur_frame, mode: disp_mode, label: label_mode, task: task_label, worker: worker_mode, select_id: select_id });
    }, [cur_frame, disp_mode, label_mode, worker_mode, task_label, select_id]);

    React.useEffect(() => {
        const wor = document.getElementById("pallets_el");
        wor.setAttribute("pallets", { 
            frame: cur_frame, 
            mode: disp_mode, 
            pallet_disp: pallet_disp,
            pstat_disp: pstat_disp,
            pinfo_disp: pinfo_disp, 
            ptrace: ptrace_mode, 
            select_pid: select_pid 
        });
    }, [cur_frame, disp_mode, select_pid,pinfo_disp,pallet_disp]);


    const controllerProps = {
        cur_frame, set_cur_frame, max_frame, set_max_frame,
        min_frame, task_label, set_task_label,
        disp_mode, set_disp_mode, frame_step, set_frame_step,
        ptrace_mode, set_ptrace_mode, pstat_disp, set_pstat_disp,
        label_mode, set_label_mode, worker_mode, set_worker_mode, pallet_stat,
        worker_disp, set_worker_disp, worker_stat, set_worker_stat, select_id, set_select_id,
        select_pid, set_select_pid,
        min_mode, set_min_mode, set_interval_time,
        pinfo_disp, set_pinfo_disp,pallet_info, set_pallet_info,
        set_use_video, use_video,
        pallet_disp, set_pallet_disp, small_panel, set_small_panel

    }

    const vis_style ={
        visibility : small_panel?"hidden":"visible"
    }

    return (
        <>
            {/* for react dev-tool   <Script src="http://localhost:8097" /> */}
            <a-scene xr-mode-ui="enabled: true"

            >
                {/*
                                cursor__mouse="rayOrigin: mouse"
                cursor__touch="rayOrigin: touch"
                */}
                <a-assets>
                    <a-asset-item id="iconfontsolid" src="fonts/fa-solid-900.ttf"></a-asset-item>
                    <a-asset-item id="iconfontbrand" src="fonts/fa-brands-400.ttf"></a-asset-item>
                    <a-asset-item id="BIZfont" src="fonts/BIZUDPGothic-Bold.ttf"></a-asset-item>

                    <img id="FloorImage" src="stitched_20241106105031.jpg"></img>
                    <video id="FloorVideo" src="video/new_small_overlap_1100_1200_ts_2x_nkawa1934.mp4"></video>
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
                {
                (use_video)?
                <a-video src="#FloorVideo" width="39.32" height="23.12" rotation="-90 0 0" position="0 0 0" ></a-video>
                 :
                 <a-image src="#FloorImage" width="39.32" height="23.12" rotation="-90 0 0" position="0 0 0" ></a-image>
                }
            
                {/* 柱 *
                <a-box width="1" height="4" depth="1" position="9.2 2 0.52" color="#999999" opacity="0.5"></a-box>            
                <a-box width="1" height="4" depth="1" position="-1.05 2 0.52" color="#999999" opacity="0.5"></a-box>
                <a-box width="1" height="4" depth="1" position="9.2 2 -9.48" color="#999999" opacity="0.5"></a-box>
                <a-box width="1" height="4" depth="1" position="-1.05 2 -9.48" color="#999999" opacity="0.5"></a-box>
                <a-entity id="mouseCursor" cursor="rayOrigin: mouse" raycaster="objects: [gui-interactable]"></a-entity>
                */}

                <a-sky color="#444466"></a-sky>



                <a-entity id="pallets_el" pallets={"frame:" + cur_frame} ref={pstatRef}>  </a-entity>

                <a-entity id="workers_el" workers={"frame:" + cur_frame} ref={workerRef}>  </a-entity>

                {/* Mouse cursor so we can click on the scene with mouse or touch. 
                <a-entity id="leftHand" laser-controls="hand: left" raycaster="objects: [gui-interactable]"></a-entity>
                <a-entity id="rightHand" laser-controls="hand: right" raycaster="objects: [gui-interactable]"></a-entity>
                wasd-controls="fly:true"
                  */}

                {/*	 Camera + cursor. -->
                button-wasd-controls
                     updown-key-controls wasd-controls="enabled: true"
            
                */}
                <a-entity id="cameraRig" position="0 0 0"  >
                    <a-camera id="camera" look-controls="enabled: true"
                        orbit-controls="initialPosition: 0 3 5; rotateSpeed: 0.9; pan-speed: 8; maxPolarAngle: 180;"
                        wasd-controls="enabled: false"
                    >
                    </a-camera>


                </a-entity>
            </a-scene>
            <PalletInfoDisp pallet_info={pallet_info} pinfo_disp={pinfo_disp}></PalletInfoDisp>
            <WorkerTaskStates task_info={task_info} task_label={task_label}></WorkerTaskStates>
            <div id="hud" className="hudOverlay"></div>
            {/*
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
            
            */}
            
            <div className="actions">
                <div className="buttonUI">
                    <button id="maru" type="button" className="button" style={vis_style}>●</button>
                    <br />
                    <button id="play" type="button" className="button" style={vis_style}>▶</button>
                </div>
                <div className="buttonUI">
                    <button id="hoshi" type="button" className="button" style={vis_style}>☆</button>
                    <br />
                    <button id="shikaku" type="button" className="button" style={vis_style}>◆</button>
                </div>
                <div className="buttonUI">
                    <button id="turn" type="button" className="button" style={vis_style}>◎</button>
                    <br />
                    <button id="vplay" type="button" className="button" style={vis_style}>▣</button>
                </div>
            </div>
            <Controller {...controllerProps} />

        </>
    )
}
