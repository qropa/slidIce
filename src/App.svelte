<script>
  import GameBoard from './components/GameBoard.svelte';
  import Calendar from './components/Calendar.svelte';
  import ModeSelector from './components/ModeSelector.svelte';
  import HelpModal from './components/HelpModal.svelte';
  import { generatePuzzle } from './utils/puzzleGenerator.js';
  import { 
    getDirectionFromClick,
    getStartPositionForClick,
    getConnectedBlocks,
    moveBlocks,
    checkWinCondition,
    checkLoseCondition
  } from './stores/gameStore.js';
  
  let currentScreen = $state('mode'); // 'mode', 'calendar', or 'game'
  let selectedMode = $state('normal');
  let selectedDate = $state(new Date());
  let blocks = $state([]);
  let moveCount = $state(0);
  let retryCount = $state(0);
  let startTime = $state(Date.now());
  let isAnimating = $state(false);
  let gameStatus = $state('playing');
  let showHelp = $state(false);
  
  function handleCellClick(row, col) {
    if (isAnimating || gameStatus !== 'playing') return;
    
    const direction = getDirectionFromClick(row, col, selectedMode);
    const startPos = getStartPositionForClick(row, col, selectedMode);
    
    if (!direction || !startPos) return;
    
    const [startRow, startCol] = startPos;
    const blocksToMove = getConnectedBlocks(blocks, startRow, startCol, direction);
    
    if (blocksToMove.length === 0) return;
    
    console.log('Moving blocks:', blocksToMove.length, 'blocks in direction', direction);
    
    isAnimating = true;
    moveCount++;
    
    try {
      blocks = moveBlocks(blocks, blocksToMove, direction, selectedMode);
      console.log('After move:', blocks.length, 'blocks remaining');
    } catch (error) {
      console.error('Error moving blocks:', error);
      isAnimating = false;
      return;
    }
    
    setTimeout(() => {
      isAnimating = false;
      
      if (checkLoseCondition(blocks, selectedMode)) {
        gameStatus = 'lost';
      } else if (checkWinCondition(blocks, selectedMode)) {
        gameStatus = 'won';
      }
    }, 400);
  }
  
  function selectMode(mode) {
    selectedMode = mode;
    currentScreen = 'calendar';
  }
  
  function startGame(date) {
    selectedDate = date;
    blocks = generatePuzzle(null, date, selectedMode);
    moveCount = 0;
    retryCount = 0;
    startTime = Date.now();
    gameStatus = 'playing';
    isAnimating = false;
    currentScreen = 'game';
  }
  
  function retry() {
    blocks = generatePuzzle(null, selectedDate, selectedMode);
    moveCount = 0;
    retryCount++;
    gameStatus = 'playing';
    isAnimating = false;
    // 時間を引き継ぐため、startTimeを再調整
    startTime = Date.now() - elapsedTime;
  }
  
  function playAgain() {
    blocks = generatePuzzle(null, selectedDate, selectedMode);
    moveCount = 0;
    retryCount = 0;
    gameStatus = 'playing';
    isAnimating = false;
    startTime = Date.now();
  }
  
  function backToCalendar() {
    currentScreen = 'calendar';
    gameStatus = 'playing'; // ゲームステータスをリセット
  }
  
  function backToMode() {
    currentScreen = 'mode';
    gameStatus = 'playing'; // ゲームステータスをリセット
  }
  
  function openHelp() {
    showHelp = true;
  }
  
  function closeHelp() {
    showHelp = false;
  }
  
  function shareToTwitter() {
    const dateText = selectedDate.toLocaleDateString('en-CA'); // YYYY-MM-DD format
    const timeText = formatTime(elapsedTime);
    
    const text = `⬜⬜🟦⬜ #SlidIce ${dateText}
⬜🟦🟪⬜ https://qropa.github.io/slidice/
🟦🟪🟦⬜ time: ${timeText}
⬜⬜⬜⬜ moves: ${moveCount} retries: ${retryCount}`;
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  }
  
  function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
  
  let elapsedTime = $state(0);
  
  $effect(() => {
    const interval = setInterval(() => {
      if (gameStatus === 'playing') {
        elapsedTime = Date.now() - startTime;
      }
    }, 100);
    
    return () => clearInterval(interval);
  });
</script>

<main>
  <h1>SlidIce</h1>
  
  {#if currentScreen === 'mode'}
    <div class="mode-screen">
      <ModeSelector 
        {selectedMode}
        onModeSelect={selectMode}
      />
    </div>
  {/if}
  
  {#if currentScreen === 'calendar'}
    <div class="calendar-screen">
      <div class="screen-header">
        <button on:click={backToMode} class="back-button">
          ← モード選択に戻る
        </button>
        <h2>{selectedMode === 'normal' ? 'Normal' : 'Hard'} モード - 日付を選択</h2>
      </div>
      <Calendar 
        {selectedDate}
        onDateSelect={startGame}
      />
      <p class="calendar-help">
        過去の日付を選択して、その日のパズルをプレイできます。<br>
        未来の日付は選択できません。
      </p>
    </div>
  {/if}
  
  {#if currentScreen === 'game'}
    <div class="game-screen">
      <div class="game-header">
        <div class="header-left">
          <button on:click={backToCalendar} class="back-button">
            ← カレンダーに戻る
          </button>
        </div>
        <div class="info">
          <div>モード: {selectedMode === 'normal' ? 'Normal' : 'Hard'}</div>
          <div>日付: {selectedDate.toLocaleDateString('ja-JP')}</div>
          <div>手数: {moveCount}</div>
          <div>リトライ: {retryCount}</div>
          <div>時間: {formatTime(elapsedTime)}</div>
        </div>
        <div class="header-right">
          <button on:click={openHelp} class="help-button">
            ❓ 遊び方
          </button>
        </div>
      </div>
      
      <div class="game-container">
        <GameBoard 
          {blocks} 
          onCellClick={handleCellClick}
          {isAnimating}
          mode={selectedMode}
        />
      </div>
      
      {#if gameStatus === 'playing'}
        <button on:click={retry}>リトライ</button>
      {/if}
    </div>
  {/if}
</main>

<!-- モーダル表示 -->
{#if gameStatus === 'won'}
  <div class="modal-overlay" on:click={() => {}}>
    <div class="modal-content success">
      <h2>🎉 CLEAR! 🎉</h2>
      <div class="result-stats">
        <div class="stat">
          <span class="stat-label">手数</span>
          <span class="stat-value">{moveCount}</span>
        </div>
        <div class="stat">
          <span class="stat-label">リトライ</span>
          <span class="stat-value">{retryCount}</span>
        </div>
        <div class="stat">
          <span class="stat-label">時間</span>
          <span class="stat-value">{formatTime(elapsedTime)}</span>
        </div>
      </div>
      <div class="result-buttons">
        <button on:click={shareToTwitter} class="twitter-button">
          🐦 Xでシェア
        </button>
        <button on:click={playAgain} class="primary-button">もう一度</button>
        <button on:click={backToCalendar} class="secondary-button">他の日付を選ぶ</button>
      </div>
    </div>
  </div>
{/if}

{#if gameStatus === 'lost'}
  <div class="modal-overlay" on:click={() => {}}>
    <div class="modal-content failure">
      <h2>😢 FAILED... 😢</h2>
      <p>ブロックが盤面外に落ちてしまいました</p>
      <div class="result-buttons">
        <button on:click={retry} class="primary-button">リトライ</button>
        <button on:click={backToCalendar} class="secondary-button">他の日付を選ぶ</button>
      </div>
    </div>
  </div>
{/if}

<!-- ヘルプモーダル -->
<HelpModal 
  isOpen={showHelp}
  onClose={closeHelp}
  mode={selectedMode}
/>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }
  
  h1 {
    color: #2196f3;
    margin-bottom: 1rem;
  }
  
  .mode-screen {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .calendar-screen {
    max-width: 400px;
    margin: 0 auto;
  }
  
  .screen-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .screen-header h2 {
    color: #333;
    margin: 0;
    text-align: center;
  }
  
  .calendar-help {
    margin-top: 1.5rem;
    color: #666;
    font-size: 0.9rem;
    line-height: 1.5;
  }
  
  .game-screen {
    width: 100%;
  }
  
  .game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;
  }
  
  .header-left,
  .header-right {
    flex: 0 0 auto;
  }
  
  .back-button {
    background-color: #666;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .back-button:hover {
    background-color: #555;
  }
  
  .help-button {
    background-color: #2196f3;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-weight: bold;
  }
  
  .help-button:hover {
    background-color: #1976d2;
  }
  
  .info {
    display: flex;
    gap: 2rem;
    font-size: 1rem;
    flex-wrap: wrap;
  }
  
  .game-container {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }
  
  /* モーダルスタイル */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;
  }
  
  .modal-content {
    background: white;
    padding: 3rem 2rem;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    text-align: center;
    max-width: 400px;
    width: 90%;
    animation: slideIn 0.3s ease-out;
  }
  
  .modal-content h2 {
    margin: 0 0 2rem 0;
    font-size: 2rem;
  }
  
  .modal-content.success {
    border-top: 6px solid #4caf50;
  }
  
  .modal-content.success h2 {
    color: #2e7d32;
  }
  
  .modal-content.failure {
    border-top: 6px solid #f44336;
  }
  
  .modal-content.failure h2 {
    color: #c62828;
  }
  
  .result-stats {
    display: flex;
    justify-content: space-around;
    margin: 2rem 0;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
  }
  
  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  
  .stat-label {
    font-size: 0.9rem;
    color: #666;
    font-weight: 500;
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
  }
  
  .result-buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 2rem;
    flex-wrap: wrap;
  }
  
  button {
    background-color: #2196f3;
    color: white;
    border: none;
    padding: 0.5rem 2rem;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #1976d2;
  }
  
  .primary-button {
    background-color: #4caf50;
    font-weight: bold;
    padding: 1rem 2rem;
  }
  
  .primary-button:hover {
    background-color: #45a049;
  }
  
  .secondary-button {
    background-color: #757575;
    padding: 1rem 2rem;
  }
  
  .secondary-button:hover {
    background-color: #616161;
  }
  
  .twitter-button {
    background-color: #1da1f2;
    color: white;
    font-weight: bold;
    padding: 1rem 2rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .twitter-button:hover {
    background-color: #0d8bd9;
  }
  
  /* アニメーション */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-30px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  @media (max-width: 600px) {
    main {
      padding: 1rem;
    }
    
    .game-header {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }
    
    .header-left,
    .header-right {
      display: flex;
      justify-content: center;
    }
    
    .info {
      justify-content: center;
      gap: 1rem;
      font-size: 0.9rem;
      flex-wrap: wrap;
    }
  }
</style>