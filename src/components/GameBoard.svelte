<script>
    import Block from './Block.svelte';
    import { GRID_SIZE, CENTER_START, CENTER_END, GAME_MODES } from '../stores/gameStore.js';
    
    let { blocks = [], onCellClick = () => {}, isAnimating = false, mode = 'normal' } = $props();
    
    let config = $derived(GAME_MODES[mode]);
    
    const CELL_SIZE = 50;
    let BOARD_SIZE = $derived(CELL_SIZE * (config.gridSize + 2));
    
    function isCorner(row, col) {
        return (row === -1 || row === config.gridSize) && (col === -1 || col === config.gridSize);
    }
    
    function isOperableCell(row, col) {
        if (isCorner(row, col)) return false;
        return row === -1 || row === config.gridSize || col === -1 || col === config.gridSize;
    }
    
    function isCenterCell(row, col) {
        return row >= config.centerStart && row <= config.centerEnd && 
               col >= config.centerStart && col <= config.centerEnd;
    }
    
    function canMoveFromCell(clickRow, clickCol) {
        if (!isOperableCell(clickRow, clickCol)) return false;
        
        // クリック位置から移動方向と開始位置を取得
        let startRow, startCol, dRow, dCol;
        
        if (clickRow === -1) {
            // 上端：下方向に移動
            startRow = 0;
            startCol = clickCol;
            dRow = 1;
            dCol = 0;
        } else if (clickRow === config.gridSize) {
            // 下端：上方向に移動
            startRow = config.gridSize - 1;
            startCol = clickCol;
            dRow = -1;
            dCol = 0;
        } else if (clickCol === -1) {
            // 左端：右方向に移動
            startRow = clickRow;
            startCol = 0;
            dRow = 0;
            dCol = 1;
        } else if (clickCol === config.gridSize) {
            // 右端：左方向に移動
            startRow = clickRow;
            startCol = config.gridSize - 1;
            dRow = 0;
            dCol = -1;
        } else {
            return false;
        }
        
        // その位置にブロックがあるかチェック
        return blocks.some(block => block.row === startRow && block.col === startCol);
    }
</script>

<svg 
    width={BOARD_SIZE} 
    height={BOARD_SIZE} 
    viewBox="0 0 {BOARD_SIZE} {BOARD_SIZE}"
    style="max-width: 100%; height: auto;"
>
    <!-- Grid background -->
    {#each Array(config.gridSize + 2) as _, row}
        {#each Array(config.gridSize + 2) as _, col}
            {#if !isCorner(row - 1, col - 1)}
                <rect
                    x={(col) * CELL_SIZE}
                    y={(row) * CELL_SIZE}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    fill={isCenterCell(row - 1, col - 1) ? '#e3f2fd' : 
                          canMoveFromCell(row - 1, col - 1) ? '#bbdefb' : 
                          isOperableCell(row - 1, col - 1) ? '#f5f5f5' : '#ffffff'}
                    stroke="#90caf9"
                    stroke-width="1"
                    class:operable={isOperableCell(row - 1, col - 1)}
                    class:movable={canMoveFromCell(row - 1, col - 1)}
                    class:clickable={!isAnimating && isOperableCell(row - 1, col - 1)}
                    on:click={() => !isAnimating && isOperableCell(row - 1, col - 1) && onCellClick(row - 1, col - 1)}
                />
            {/if}
        {/each}
    {/each}
    
    <!-- Center area highlight -->
    <rect
        x={(config.centerStart + 1) * CELL_SIZE}
        y={(config.centerStart + 1) * CELL_SIZE}
        width={(config.centerEnd - config.centerStart + 1) * CELL_SIZE}
        height={(config.centerEnd - config.centerStart + 1) * CELL_SIZE}
        fill="none"
        stroke="#2196f3"
        stroke-width="3"
        pointer-events="none"
    />
    
    <!-- Blocks -->
    {#each blocks as block (block.id)}
        <Block 
            x={(block.col + 1) * CELL_SIZE + CELL_SIZE / 2}
            y={(block.row + 1) * CELL_SIZE + CELL_SIZE / 2}
            size={CELL_SIZE * 0.8}
        />
    {/each}
</svg>

<style>
    .operable {
        cursor: pointer;
    }
    
    .movable {
        cursor: pointer;
    }
    
    .movable:hover {
        fill: #64b5f6 !important;
    }
    
    .clickable:not(.movable):hover {
        fill: #e0e0e0 !important;
    }
</style>