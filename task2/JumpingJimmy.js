function jumpingJimmy(tower, jumpHeight) {
    // neefikasen nachin :D
    // let towerCopy = tower.slice();
    // return towerCopy.reduce((acc, curr) => {
    //     if (curr > jumpHeight) {
    //         towerCopy.splice(1);
    //         return acc;
    //     } else return acc + curr;
    // }, 0);
    
    let acc = 0;
    for (let height of tower) {
        if (height > jumpHeight) {
                break;
        } else {
            acc += height;
        }
    }
    return acc;
}

