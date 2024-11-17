// パレット毎のデータ
import React ,  { useState } from "react";

const colors=['cyan','lightgreen','rgb(255,178,218)',]


const PalletLabel = ({ id, pos, metadata,state }) => {
    const color = colors[state]

    const labelStyle = {
        position: 'absolute',
        color: color,
        padding: '2px 2px',
        fontSize: '14px',
        whiteSpace: 'nowrap',
        fontFamily: 'monospace',
        transform: 'translate(0, -100%)', // ラベルを上に配置
        display: 'inline-block',
        backgroundColor: 'rgba(100, 100, 100, 0.7)',
        borderRadius: "4px"
//        borderBottom: `1px solid ${color}`, // アンダーラインを直接要素に追加
      };
    
      const containerStyle = {
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        display: 'inline-block',
      };
    

      return (
        <div style={containerStyle}>
          <div style={labelStyle}>
            {metadata}
          </div>
        </div>
      );
}


const PalletInfoDisp = ({pallet_info,pinfo_disp}) =>{
//    console.log("pinfoDisp",pinfo_disp, pallet_info.length);
        return(
            <>
            {
                pinfo_disp?
                pallet_info.map((info)=>(
                        <PalletLabel 
                            key={info.id}
                            id={info.id}
                            pos={info.pos}
                            state={info.state}
                            metadata={info.txt}></PalletLabel>
                    )) :<div></div>
            }
            </>
        )
}
    
export default PalletInfoDisp;
    