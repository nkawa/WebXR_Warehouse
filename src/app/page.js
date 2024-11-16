
"use client";

import * as React from 'react'

import Head from 'next/head';
import Script from 'next/script';

export default function Page() {
    const [menu_item, set_menu_item] = React.useState([]);

    const workButtonAction = (e, id) => {
      console.log('workButtonAction', id, e);
      if (id == "0") {
          window.location.replace('/ptokai'); // goto second!
      } else if (id == '2') {
          window.location.replace('/ptokai1112'); // goto second!
      } else if (id == '3') {
          window.location.replace('/virtual'); // goto third!
      }
    }

    React.useEffect(() => {
      if (typeof window !== "undefined") {
        require("aframe");// <-結局、A-Frameは動的なインポートをするのが重要！
        require('../components/aframe-gui');
        require('aframe-troika-text');

        window.workButtonAction = workButtonAction;
        console.log("Window Action", window.workButtonAction);
  
      }
      const data = [
        { "title": "プラネット東海", "datetime": "2024年10月03日 7時-12時" },
        { "title": "プラネット東海", "datetime": "2024年10月03日 11時-12時" },
        { "title": "P東海上空視点", "datetime": "" },
        { "title": "仮想倉庫", "datetime": "" },
        { "title": "統計データ", "datetime": "" }
      ]

      for (let i = 0; i < data.length; i++) {
          data[i].id = i;
      }
      //        console.log("data", data);
      set_menu_item(data);
    }, []);


    return (
        <>
            <a-scene xr-mode-ui="enabled: true"
                cursor__mouse="rayOrigin: mouse"
                cursor__touch="rayOrigin: touch"
            >
                <a-assets>
                    <a-asset-item id="iconfontsolid" src="fonts/fa-solid-900.ttf"></a-asset-item>
                    <a-asset-item id="iconfontbrand" src="fonts/fa-brands-400.ttf"></a-asset-item>
                    <a-asset-item id="BIZfont" src="fonts/BIZUDPGothic-Bold.ttf"></a-asset-item>
                </a-assets>

                <a-gui-flex-container id="topflex"
                    flex-direction="column" justify-content="center" align-items="normal" item-padding="0.05"
                    opacity="0.5" width="5.3" height="5.3" panel-color="#221222" panel-rounded="0.2"
                    position="0 1.5 -6" rotation="0 0 0" is-top-container="true"
                >
                    <a-gui-label
                        width="4.8" height="0.75"
                        value="仮想物流倉庫"
                        background-color="#7777ee"
                        font-family="fonts/BIZUDPGothic-Bold.ttf"
                        font-size="0.35"
                        line-height="0.8"
                        letter-spacing="0"
                        margin="0 0 0.05 0"
                        key="99"
                    >
                    </a-gui-label>
                    {
                        menu_item.map((item) =>
                        (
                            <a-gui-button value={item.title + "   :   " + item.datetime} 
                                 click-arg={item.id} key={item.id} click-func="workButtonAction"
                                width="4.5" height="0.75">
                            </a-gui-button>
                        )
                        )
                    }

                </a-gui-flex-container>

                <a-gui-flex-container id="workmenu" flex-direction="row" align-items="center" justifyContent="flexStart"
                    opacity="0.5" width="6.5" height="1.2" item-padding="0.08"
                    position="0 -2 -6"
                    panel-color="#221222" panel-rounded="0.2"
                >

                    <a-gui-icon-label-button
                        width="1.6" height="0.7"
                        icon="f015"
                        value="ホーム"
                        icon-font="fonts/fa-solid-900.ttf"
                        font-family="fonts/BIZUDPGothic-Bold.ttf"
                        margin="0 0 0 0.7"
                        onclick="workButtonAction" click-arg="home"
                    >
                    </a-gui-icon-label-button>
                    <a-gui-icon-label-button
                        width="1.5" height="0.7"
                        icon="f013"
                        value="設定"
                        icon-font="fonts/fa-solid-900.ttf"
                        font-family="fonts/BIZUDPGothic-Bold.ttf"
                        depth="0.3"
                        margin="0.2 0 0.05 0"
                        onclick="workButtonAction" click-arg="setting"
                    >
                    </a-gui-icon-label-button>

                    <a-gui-icon-label-button
                        width="1.95" height="0.7"
                        icon="f2b9"
                        icon-font="fonts/fa-solid-900.ttf"
                        value="パーソナル設定"
                        font-family="fonts/BIZUDPGothic-Bold.ttf"
                        font-size="0.16"
                        margin="0.2 0 0.05 0"
                        onclick="workButtonAction" click-arg="personal"
                    >
                    </a-gui-icon-label-button>
                </a-gui-flex-container>

                <a-sky color="#444466"></a-sky>

                {/* Mouse cursor so we can click on the scene with mouse or touch. */}
                <a-entity id="mouseCursor" cursor="rayOrigin: mouse" raycaster="objects: [gui-interactable]"></a-entity>
                <a-entity id="leftHand" laser-controls="hand: left" raycaster="objects: [gui-interactable]"></a-entity>
                <a-entity id="rightHand" laser-controls="hand: right" raycaster="objects: [gui-interactable]"></a-entity>

                {/*	 Camera + cursor. -->*/}
                <a-entity id="cameraRig" position="0 0 0">
                    <a-camera look-controls wasd-controls position="0 0 0">
                    </a-camera>
                </a-entity>


            </a-scene>
        </>
    )

}
