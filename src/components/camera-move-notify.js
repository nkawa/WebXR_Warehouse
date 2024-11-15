

AFRAME.registerComponent('camera-move-notify', {
    schema: {},

    init: function () {
        // 前回のカメラ位置の記録
        this.previousPosition = new THREE.Vector3();
        this.previousPosition.copy(this.el.object3D.position);
    },

    tick: function () {
        const currentPosition = this.el.object3D.position;

        // 前回の位置と比較して移動しているか確認
        if (!currentPosition.equals(this.previousPosition)) {
            // カスタムイベントを発行
            this.el.emit('camera-moved', {position: currentPosition.clone()});
            this.previousPosition.copy(currentPosition);
        }
    }
});