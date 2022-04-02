let chess = document.getElementById("chess")
let context = chess.getContext('2d')
let over = false


// 画棋盘
context.strokeStyle = '#bfbfbf'

const drawChess = () => {
    for(let i = 0; i < 15; i++){
        context.moveTo(15 + i*30,15)
        context.lineTo(15 + i*30,435)
        context.stroke()
        context.moveTo(15,15 + i*30)
        context.lineTo(435,15 + i*30)
        context.stroke()
    }
}

// 加水印
let logo = new Image()
logo.src = "./image/logo.png"
logo.onload = () => {
    context.drawImage(logo, 35, 150, 380, 120)
    drawChess()
}

// 画棋子
let go = (i, j, me) => {
    context.beginPath()
    context.arc(15 + i*30, 15 + j*30, 13, 0, 2 * Math.PI)
    context.closePath()
    let gradient = context.createRadialGradient(15 + i*30 + 2, 15 + j*30 -2, 13, 15 + i*30 + 2, 15 + j*30 -2, 0)
    if (me) {
        gradient.addColorStop(0, '#0a0a0a')
        gradient.addColorStop(1, '#636766')
    } else {
        gradient.addColorStop(0, '#d1d1d1')
        gradient.addColorStop(1, '#f9f9f9')
    }
    context.fillStyle = gradient
    context.fill()
}


let me = true
//二维数组对应棋盘各点索引
let chessBoard = []
for (let i = 0; i < 15; i++){
    chessBoard[i] = []
    for (let j = 0; j < 15; j++){
        chessBoard[i][j] = 0
    }
}

// 赢法数组（三维）
let wins = []
let type = 0
    // 初始化
for (let i = 0; i < 15; i++) {
    wins[i] = []
    for (let j = 0; j < 15; j++) {
        wins[i][j] = []
    }
}
    //横线赢法
for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 11; j++) {
        for (let k = 0; k < 5; k++) {
            wins[i][j+k][type] = true            
        }
        type++
    } 
}
    //竖线赢法
for (let i = 0; i < 11; i++) {
    for (let j = 0; j < 15; j++) {
        for (let k = 0; k < 5; k++) {
            wins[i+k][j][type] = true            
        }
        type++
    } 
}
    //斜线赢法
for (let i = 0; i < 11; i++) {
    for (let j = 0; j < 11; j++) {
        for (let k = 0; k < 5; k++) {
            wins[i+k][j+k][type] = true            
        }
        type++
    } 
}
    //反斜线赢法
for (let i = 0; i < 11; i++) {
    for (let j = 14; j > 3; j-- ) {
        for (let k = 0; k < 5; k++) {
            wins[i+k][j-k][type] = true            
        }
        type++
    } 
}

//初始化对弈双方赢法
myWin = []
youWin = []
for (let i = 0; i < type; i++) {
    myWin[i] = 0
    youWin[i] = 0
}

// 落子
chess.onclick = (e) => {
    if(over || !me) return
    let x = e.offsetX
    let y = e.offsetY
    let i = Math.floor(x / 30)
    let j = Math.floor(y / 30)
    // 当前位置无子才能下
    if (chessBoard[i][j] === 0){
        go(i, j, me)
        chessBoard[i][j] = 1 //下黑子的地方标记为1
    }
    for (let k = 0; k < type; k++) {
        if(wins[i][j][k]){
            myWin[k]++
            youWin[k] = NaN
            if(myWin[k] === 5){
                window.alert('你赢了')
                over = true
            }
        }        
    }
    if(!over){
        me = !me
        computerAI()
    }
}

// AI下棋
const computerAI = () => {
    // 初始化每个位置双方得分
    let myScore = []
    let AIScore = []
    let max = 0
    let u = 0
    let v = 0
    for (let i = 0; i < 15; i++) {
        myScore[i] = []
        AIScore[i] = []
        for (let j = 0; j < 15; j++) {
            myScore[i][j] = 0
            AIScore[i][j] = 0
        }
    }
    //计算白棋落子的价值得分
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            if(chessBoard[i][j] === 0) {
                for (let k = 0; k < type; k++) {
                    if(wins[i][j][k]){
                        if(myWin[k] == 1){
                            myScore[i][j] += 200
                        } else if(myWin[k] == 2){
                            myScore[i][j] += 400
                        } else if(myWin[k] == 3){
                            myScore[i][j] += 1000
                        } else if(myWin[k] == 4){
                            myScore[i][j] += 5000
                        } 
                        if(youWin[k] == 1){
                            AIScore[i][j] += 220
                        } else if(youWin[k] == 2){
                            AIScore[i][j] += 420
                        } else if(youWin[k] == 3){
                            AIScore[i][j] += 1100
                        } else if(youWin[k] == 4){
                            AIScore[i][j] += 10000
                        }
                    }
                }
                //找到最佳位置
                if(myScore[i][j] > max){
                    max = myScore[i][j]
                    u = i
                    v = j
                } else if (myScore[i][j] == max){
                    if(AIScore[i][j] > AIScore[u][v]){
                        u = i
                        v = j
                    }
                }
                if(AIScore[i][j] > max){
                    max = AIScore[i][j]
                    u = i
                    v = j
                } else if (AIScore[i][j] == max){
                    if(myScore[i][j] > myScore[u][v]){
                        u = i
                        v = j
                    }
                }
            }
        }
    }
    go(u,v,false)
    chessBoard[u][v] = 2
    //AI落子后更新赢法统计
    for (let k = 0; k < type; k++) {
        if(wins[u][v][k]){
            youWin[k]++
            myWin[k] = NaN
            if(youWin[k] === 5){
                window.alert('AI赢了')
                over = true
            }
        }        
    }
    if(!over){
        me = !me
    }
}