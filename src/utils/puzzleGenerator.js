import { 
    GRID_SIZE, 
    CENTER_START, 
    CENTER_END, 
    GAME_MODES,
    getBlockAt,
    isBlockAt
} from '../stores/gameStore.js';

function seedRandom(seed) {
    let state = seed;
    return function() {
        state = (state * 1664525 + 1013904223) % 4294967296;
        return state / 4294967296;
    };
}

function getDateSeed(date = null) {
    const targetDate = date || new Date();
    const dateStr = `${targetDate.getFullYear()}${String(targetDate.getMonth() + 1).padStart(2, '0')}${String(targetDate.getDate()).padStart(2, '0')}`;
    return parseInt(dateStr);
}

function hasAdjacentBlock(blocks, block) {
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    return directions.some(([dRow, dCol]) => {
        return blocks.some(other => 
            other !== block &&
            other.row === block.row + dRow &&
            other.col === block.col + dCol
        );
    });
}

function getAdjacentBlocks(blocks, block, direction) {
    const [dRow, dCol] = direction;
    const adjacent = [];
    let currentRow = block.row + dRow;
    let currentCol = block.col + dCol;
    
    // 隣接方向にあるブロックを全て取得
    while (isBlockAt(blocks, currentRow, currentCol)) {
        adjacent.push(getBlockAt(blocks, currentRow, currentCol));
        currentRow += dRow;
        currentCol += dCol;
    }
    
    return adjacent;
}

function canPerformReverseOperation(blocks, block, direction, mode = 'normal') {
    const config = GAME_MODES[mode];
    const [dRow, dCol] = direction;
    const adjacentBlocks = getAdjacentBlocks(blocks, block, direction);
    
    // 隣接ブロックがない場合は移動不可
    if (adjacentBlocks.length === 0) return false;
    
    // 隣接ブロックから外周までの間に、隣接していないブロックが存在しないかチェック
    let checkRow = adjacentBlocks[adjacentBlocks.length - 1].row + dRow;
    let checkCol = adjacentBlocks[adjacentBlocks.length - 1].col + dCol;
    
    // 外周までの間をチェック
    while (checkRow >= 0 && checkRow < config.gridSize && 
           checkCol >= 0 && checkCol < config.gridSize) {
        if (isBlockAt(blocks, checkRow, checkCol)) {
            // 隣接していないブロックが存在
            return false;
        }
        checkRow += dRow;
        checkCol += dCol;
    }
    
    return true;
}

export function generatePuzzle(seed = null, date = null, mode = 'normal') {
    const config = GAME_MODES[mode];
    const random = seedRandom(seed || getDateSeed(date));
    
    // 完成形からスタート
    let blocks = [];
    let id = 0;
    for (let row = config.centerStart; row <= config.centerEnd; row++) {
        for (let col = config.centerStart; col <= config.centerEnd; col++) {
            blocks.push({ id: id++, row, col });
        }
    }
    
    const reverseOperationCount = mode === 'hard' ? 
        25 + Math.floor(random() * 20) :  // Hard: 25-44回
        15 + Math.floor(random() * 15);   // Normal: 15-29回
    let operationsPerformed = 0;
    let attempts = 0;
    const maxAttempts = 2000;
    
    while (operationsPerformed < reverseOperationCount && attempts < maxAttempts) {
        attempts++;
        
        // 隣接ブロックを持つブロックのみ選択対象
        const candidateBlocks = blocks.filter(block => hasAdjacentBlock(blocks, block));
        if (candidateBlocks.length === 0) break;
        
        // ランダムにブロックを選択
        const block = candidateBlocks[Math.floor(random() * candidateBlocks.length)];
        
        // 4方向をチェック
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        const validDirections = directions.filter(dir => 
            canPerformReverseOperation(blocks, block, dir, mode)
        );
        
        if (validDirections.length === 0) continue;
        
        // ランダムに方向を選択
        const direction = validDirections[Math.floor(random() * validDirections.length)];
        const adjacentBlocks = getAdjacentBlocks(blocks, block, direction);
        
        // 隣接ブロックを外周に接するように移動
        const [dRow, dCol] = direction;
        let targetRow, targetCol;
        
        if (dRow !== 0) {
            // 縦方向の移動
            targetRow = dRow > 0 ? config.gridSize - 1 : 0;
            targetCol = adjacentBlocks[0].col;
        } else {
            // 横方向の移動
            targetRow = adjacentBlocks[0].row;
            targetCol = dCol > 0 ? config.gridSize - 1 : 0;
        }
        
        // 移動量を計算
        const moveDistance = dRow !== 0 ? 
            targetRow - adjacentBlocks[adjacentBlocks.length - 1].row :
            targetCol - adjacentBlocks[adjacentBlocks.length - 1].col;
        
        // ブロックを移動
        blocks = blocks.map(b => {
            if (adjacentBlocks.includes(b)) {
                return {
                    ...b,
                    row: b.row + (dRow !== 0 ? moveDistance : 0),
                    col: b.col + (dCol !== 0 ? moveDistance : 0)
                };
            }
            return b;
        });
        
        operationsPerformed++;
    }
    
    console.log(`Generated ${mode} puzzle with ${operationsPerformed} reverse operations`);
    return blocks;
}