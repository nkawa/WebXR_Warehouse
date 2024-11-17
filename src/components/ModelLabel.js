import React from 'react';

// ラベル毎に色を変えたい

const colors=['cyan','red','green']

const ModelLabel = ({ id, position, metadata,label }) => {
    const color = colors[label];
  const labelStyle = {
    position: 'absolute',
    color: color,
    padding: '2px 2px',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    fontFamily: 'monospace',
    transform: 'translate(0, -100%)', // ラベルを上に配置
    display: 'inline-block',
    borderBottom: `1px solid ${color}`, // アンダーラインを直接要素に追加
  };

  const containerStyle = {
    position: 'absolute',
    left: position.x,
    top: position.y,
    display: 'inline-block',
  };

  const lineStyle = {
    position: 'absolute',
    width: '100px',
    height: '1px',
    background: color,
    transform: 'rotate(135deg)', // 角度を135度に変更（左下方向）
    transformOrigin: 'left top',
    left: '0',
    top: '0',
  };

  return (
    <div style={containerStyle}>
      <div style={labelStyle}>
        {metadata}
      </div>
      {/* 線コンテナを吹き出しの直下に配置 */}
      <div style={lineStyle} />
    </div>
  );
};


export default ModelLabel;
