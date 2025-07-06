<script>
  import { GAME_MODES } from '../stores/gameStore.js';
  
  let { selectedMode = 'normal', onModeSelect = () => {} } = $props();
</script>

<div class="mode-selector">
  <h2>ゲームモードを選択</h2>
  
  <div class="mode-cards">
    <button 
      class="mode-card"
      class:selected={selectedMode === 'normal'}
      on:click={() => onModeSelect('normal')}
    >
      <div class="mode-title">Normal</div>
      <div class="mode-description">
        <div class="grid-size">7×7 グリッド</div>
        <div class="target">中央 3×3 に 9個</div>
        <div class="difficulty">★★☆☆☆</div>
      </div>
    </button>
    
    <button 
      class="mode-card"
      class:selected={selectedMode === 'hard'}
      on:click={() => onModeSelect('hard')}
    >
      <div class="mode-title">Hard</div>
      <div class="mode-description">
        <div class="grid-size">8×8 グリッド</div>
        <div class="target">中央 4×4 に 16個</div>
        <div class="difficulty">★★★☆☆</div>
      </div>
    </button>
  </div>
</div>

<style>
  .mode-selector {
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
  }
  
  .mode-selector h2 {
    color: #333;
    margin-bottom: 2rem;
    font-size: 1.5rem;
  }
  
  .mode-cards {
    display: flex;
    gap: 2rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .mode-card {
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    padding: 2rem;
    min-width: 200px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .mode-card:hover {
    border-color: #2196f3;
    box-shadow: 0 4px 16px rgba(33, 150, 243, 0.2);
    transform: translateY(-2px);
  }
  
  .mode-card.selected {
    border-color: #2196f3;
    background: #e3f2fd;
    box-shadow: 0 4px 16px rgba(33, 150, 243, 0.3);
  }
  
  .mode-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2196f3;
    margin-bottom: 1rem;
  }
  
  .mode-description {
    color: #666;
    line-height: 1.6;
  }
  
  .grid-size {
    font-weight: bold;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  .target {
    margin-bottom: 0.5rem;
  }
  
  .difficulty {
    color: #ff9800;
    font-weight: bold;
    font-size: 1.2rem;
  }
  
  @media (max-width: 600px) {
    .mode-cards {
      flex-direction: column;
      align-items: center;
    }
    
    .mode-card {
      width: 100%;
      max-width: 250px;
    }
  }
</style>