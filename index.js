

// const b2event = () => {
//     document.getElementById('text1').textContent = inputOutfiles[0];
//     cargiInfoDelete();
// }


$botton1 = document.getElementById('b1');
//$botton1.addEventListener('click', b1event.bind(null,10));
$botton1.addEventListener('click', sampleInput.bind());

$botton2 = document.getElementById('b2');
$botton2.addEventListener('click', transparentChange.bind());

$botton3 = document.getElementById('b3');
$botton3.addEventListener('click', targetSelectChange.bind());

$botton4 = document.getElementById('b4');
$botton4.addEventListener('click', () => {console.log("no func")});


function sampleInput() {
    document.getElementById("input").value = "4 1120 680 30 1200\n355 360 285 3 Y Y\n155 210 120 1 Y Y\n510 820 380 1 Y N\n370 710 330 1 Y Y\n"
                                            + "01234\naaaa\nbbbb\ncccc\ndddd\n";
    document.getElementById("output").value = "1820\n0 3 30 0 0\n0 3 765 365 0\n0 3 30 0 360\n1 1 965 155 0\n2 2 385 0 0\n3 2 30 285 0\n";
    updateOutput();
}

// ボタンでの変更
function transparentChange() {
    config.conTrans++;
    if (config.conTrans == 3) config.conTrans = 0;
    transForm.value = config.conTrans;
    configUpdata();
}
// formでの変更
function chengeTransform(arg) {
    config.conTrans = arg;
    configUpdata();
}

// ボタンでの変更
function targetSelectChange() {
    config.conTarget++;
    if (config.conTarget == 5) config.conTarget = 0;
    targetForm.value = config.conTarget;
    chengeFileTarget();
    
}
// formでの変更
function chengeTargetForm(arg) {
    config.conTarget = arg;
    chengeFileTarget();
}

function chengeFileTarget() {
    filesInfo = [];
    for (let i = 0; i < inputOutfiles.length; i++) {
        let outStArray = splitOrigin(inputOutfiles[i]);

        if (config.conTarget == 0) {        // 全結果表示
            if (Number(outStArray[0]) < 2200) {
                filesInfo.push(i);
            } else if (Number(outStArray[0]) < 1000000) {
                filesInfo.push(i);
            } else {
                filesInfo.push(i);
            }                            
        } else if (config.conTarget == 1) { // 積込みOKのみ
            if (Number(outStArray[0]) < 2200) {
                filesInfo.push(i);
            } else if (Number(outStArray[0]) < 1000000) {
                filesInfo.push(i);
            } else {
            }     
        } else if (config.conTarget == 2) { // 積込みNGのみ
            if (Number(outStArray[0]) < 2200) {
            } else if (Number(outStArray[0]) < 1000000) {
            } else {
                filesInfo.push(i);
            }     
        } else if (config.conTarget == 3) { // 積込みOK順序OKのみ
            if (Number(outStArray[0]) < 2200) {
                filesInfo.push(i);
            } else if (Number(outStArray[0]) < 1000000) {
            } else {
            }     
        } else if (config.conTarget == 4) { // 積込みOK順序NGのみ
            if (Number(outStArray[0]) < 2200) {
            } else if (Number(outStArray[0]) < 1000000) {
                filesInfo.push(i);
            } else {
            }     
        }
    }
    console.log(filesInfo);
}


////////////////////////////////////////

const cargo = class {
    constructor(x,y,z,px,py,pz,no) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.px = px;
        this.py = py;
        this.pz = pz;
        this.no = no;
    }
};

const inCargo = class {
    constructor(x,y,z,num,up,rotate) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.num = num;
        this.up = up;
        this.rotate = rotate;
    }
};

const xyzr = class {
    constructor(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
};


function splitOrigin(arg) {
    let sub = arg.split(/\r\n|\n|\s/);
    let re = [];
    for (let i = 0; i < sub.length; i++) {
        if (sub[i] == "") continue;
        re.push(sub[i]);
    }
    return re;
}

function rotate(x,y,z,r) {
    let rx,ry,rz;
    if (r == 0) {rx = x; ry = y; rz = z;}
    if (r == 1) {rx = y; ry = x; rz = z;}
    if (r == 2) {rx = z; ry = y; rz = x;}
    if (r == 3) {rx = y; ry = z; rz = x;}
    if (r == 4) {rx = z; ry = x; rz = y;}
    if (r == 5) {rx = x; ry = z; rz = y;}
    let sub = new xyzr(rx,ry,rz);
    return sub;
}

function getCargoCount() {
    const input = document.getElementById("input").value;
    let inStArray = splitOrigin(input);
    let cargoCount = 0;
    for(let i = 0; i < inStArray[0]; i++) {
        cargoCount += Number(inStArray[8+i*6]);
    }
    return cargoCount;
}

function getCargoIdCount() {
    const input = document.getElementById("input").value;
    let inStArray = splitOrigin(input);
    return inStArray[0];
}

function getCargoInfomation() {
    const input = document.getElementById("input").value;
    let inStArray = splitOrigin(input);
    let infoArray = [];
    for(let i = 5+6*inStArray[0]; i < inStArray.length; i++) {
        infoArray.push(inStArray[i]);
    }
    return infoArray;
}

function getScore() {
    const output = document.getElementById("output").value;
    let outStArray = splitOrigin(output);
    if (Number(outStArray[0]) < 2200) return 0;     // 積込みOK 順序OK
    if (Number(outStArray[0]) < 1000000) return 1;  // 積込みOK 順序NG
    return 2;                                       // 積込みNG
}


function make() {
    const input = document.getElementById("input").value;
    const output = document.getElementById("output").value;

    let inStArray = splitOrigin(input);
    let outStArray = splitOrigin(output);
    let cargoCount = 0;

    outStArray.shift(); // 先頭削除

    var anser = {};
    var inputCargo = {};

    let boxX = inStArray[1];
    let boxY = inStArray[2];
    let boxH = inStArray[4];
    let boxB = inStArray[3];

    anser[0] = new cargo(boxB,boxB,boxH,boxB/2,boxB/2,boxH/2,-1);
    anser[1] = new cargo(boxB,boxB,boxH,boxX-boxB+boxB/2,boxB/2,boxH/2,-1);
    anser[2] = new cargo(boxB,boxB,boxH,boxB/2,boxY-boxB+boxB/2,boxH/2,-1);
    anser[3] = new cargo(boxB,boxB,boxH,boxX-boxB+boxB/2,boxY-boxB+boxB/2,boxH/2,-1);

    for(let i = 0; i < inStArray[0]; i++) {
        inputCargo[i] = new inCargo(inStArray[6+i*6], inStArray[5+i*6], inStArray[7+i*6], inStArray[8+i*6], inStArray[9+i*6], inStArray[10+i*6]);
        cargoCount += Number(inStArray[8+i*6]);
    }

    for(let i = 0; i < cargoCount; i++) {
        let no = outStArray[5*i];
        let r = outStArray[5*i+1];
        let px = outStArray[5*i+2];
        let py = outStArray[5*i+3];
        let pz = outStArray[5*i+4];

        let x = inputCargo[no].x;
        let y = inputCargo[no].y;
        let z = inputCargo[no].z;
        let xyz = rotate(x,y,z,r);

        let sub;
        sub = Number(Number(xyz.x)/2+Number(px)); px = sub;
        sub = Number(Number(xyz.y)/2+Number(py)); py = sub;
        sub = Number(Number(xyz.z)/2+Number(pz)); pz = sub;
        anser[4+i] = new cargo(xyz.x,xyz.y,xyz.z,px,py,pz,no);
    }

    return anser;
}

