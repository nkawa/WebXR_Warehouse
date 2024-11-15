


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
