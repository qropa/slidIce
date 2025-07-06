// ゲームモード設定
export const GAME_MODES = {
    normal: {
        gridSize: 7,
        centerStart: 2,
        centerEnd: 4,
        blockCount: 9
    },
    hard: {
        gridSize: 8,
        centerStart: 2,
        centerEnd: 5,
        blockCount: 16
    }
};

// デフォルト値（後方互換性のため）
export const GRID_SIZE = 7;
export const CENTER_START = 2;
export const CENTER_END = 4;
export const BLOCK_COUNT = 9;

export function createInitialState(mode = 'normal') {
    const config = GAME_MODES[mode];
    const blocks = [];
    let id = 0;
    
    for (let row = config.centerStart; row <= config.centerEnd; row++) {
        for (let col = config.centerStart; col <= config.centerEnd; col++) {
            blocks.push({
                id: id++,
                row,
                col
            });
        }
    }
    
    return {
        blocks,
        moveCount: 0,
        retryCount: 0,
        startTime: Date.now(),
        isAnimating: false,
        gameStatus: 'playing', // 'playing', 'won', 'lost'
        mode
    };
}

export function isBlockAt(blocks, row, col) {
    return blocks.some(block => block.row === row && block.col === col);
}

export function getBlockAt(blocks, row, col) {
    return blocks.find(block => block.row === row && block.col === col);
}

export function isInCenter(row, col, mode = 'normal') {
    const config = GAME_MODES[mode];
    return row >= config.centerStart && row <= config.centerEnd && 
           col >= config.centerStart && col <= config.centerEnd;
}

export function checkWinCondition(blocks, mode = 'normal') {
    return blocks.every(block => isInCenter(block.row, block.col, mode));
}

export function checkLoseCondition(blocks, mode = 'normal') {
    const config = GAME_MODES[mode];
    return blocks.some(block => 
        block.row < 0 || block.row >= config.gridSize || 
        block.col < 0 || block.col >= config.gridSize
    );
}

export function getConnectedBlocks(blocks, startRow, startCol, direction) {
    const connected = [];
    const [dRow, dCol] = direction;
    
    let currentRow = startRow;
    let currentCol = startCol;
    
    while (true) {
        const block = getBlockAt(blocks, currentRow, currentCol);
        if (!block) break;
        
        connected.push(block);
        currentRow += dRow;
        currentCol += dCol;
    }
    
    return connected;
}

export function moveBlocks(blocks, blocksToMove, direction, mode = 'normal') {
    const config = GAME_MODES[mode];
    const [dRow, dCol] = direction;
    
    // 移動するブロックをソート（移動方向に応じて）
    const sortedBlocksToMove = [...blocksToMove].sort((a, b) => {
        if (dRow > 0) return b.row - a.row; // 下方向：下から順に
        if (dRow < 0) return a.row - b.row; // 上方向：上から順に
        if (dCol > 0) return b.col - a.col; // 右方向：右から順に
        if (dCol < 0) return a.col - b.col; // 左方向：左から順に
        return 0;
    });
    
    // 移動しないブロックのセット
    const stationaryBlocks = blocks.filter(b => !blocksToMove.includes(b));
    
    // 各ブロックの新しい位置を計算
    const newPositions = new Map();
    
    sortedBlocksToMove.forEach(block => {
        let newRow = block.row;
        let newCol = block.col;
        
        while (true) {
            const nextRow = newRow + dRow;
            const nextCol = newCol + dCol;
            
            // 盤面外チェック
            if (nextRow < -1 || nextRow > config.gridSize || 
                nextCol < -1 || nextCol > config.gridSize) {
                break;
            }
            
            // 他のブロックとの衝突チェック
            // 1. 動かないブロックとの衝突
            const hitStationaryBlock = stationaryBlocks.some(b => 
                b.row === nextRow && b.col === nextCol
            );
            
            // 2. 既に移動位置が決まったブロックとの衝突
            const hitMovedBlock = Array.from(newPositions.values()).some(pos => 
                pos.row === nextRow && pos.col === nextCol
            );
            
            if (hitStationaryBlock || hitMovedBlock) break;
            
            newRow = nextRow;
            newCol = nextCol;
        }
        
        newPositions.set(block.id, { row: newRow, col: newCol });
    });
    
    // 結果を構築
    const result = blocks.map(block => {
        if (blocksToMove.includes(block)) {
            const newPos = newPositions.get(block.id);
            return { ...block, ...newPos };
        }
        return block;
    });
    
    // 盤面外のブロックを除外
    return result.filter(block => 
        block.row >= -1 && block.row <= config.gridSize && 
        block.col >= -1 && block.col <= config.gridSize
    );
}

export function getDirectionFromClick(clickRow, clickCol, mode = 'normal') {
    const config = GAME_MODES[mode];
    if (clickRow === -1) return [1, 0];  // top edge, move down
    if (clickRow === config.gridSize) return [-1, 0];  // bottom edge, move up
    if (clickCol === -1) return [0, 1];  // left edge, move right
    if (clickCol === config.gridSize) return [0, -1];  // right edge, move left
    return null;
}

export function getStartPositionForClick(clickRow, clickCol, mode = 'normal') {
    const config = GAME_MODES[mode];
    if (clickRow === -1) return [0, clickCol];  // top edge
    if (clickRow === config.gridSize) return [config.gridSize - 1, clickCol];  // bottom edge
    if (clickCol === -1) return [clickRow, 0];  // left edge
    if (clickCol === config.gridSize) return [clickRow, config.gridSize - 1];  // right edge
    return null;
}