

// UUIDを生成する関数
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const getIpAddr = async () => {
    let data;
    try {
        const response = await fetch('/api/ipaddr', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        data = await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
    }
    return data.ip;
};


// ローカルストレージまたはクッキーからIDを取得する関数
export const getDeviceID = () => {
    // ローカルストレージから取得
    let deviceID = localStorage.getItem('deviceID');

    // ローカルストレージに無い場合はクッキーから取得
    if (!deviceID) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith('deviceID=')) {
                deviceID = cookie.substring('deviceID='.length);
                break;
            }
        }
    }

    // どちらにも無い場合は新規生成
    if (!deviceID) {
        deviceID = generateUUID();
        // ローカルストレージに保存
        localStorage.setItem('deviceID', deviceID);
        // クッキーにも保存（オプション）
        document.cookie = `deviceID=${deviceID}; path=/; max-age=31536000`; // 1年間有効
    }
    console.log("GetDeviceID:", deviceID);
    return deviceID;
}

export default getDeviceID;
