<script>
  let { isOpen = false, onClose = () => {}, mode = 'normal' } = $props();
  
  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }
</script>

{#if isOpen}
  <div class="modal-overlay" on:click={handleOverlayClick}>
    <div class="modal-content">
      <div class="modal-header">
        <h2>🎮 遊び方</h2>
        <button class="close-button" on:click={onClose}>×</button>
      </div>
      
      <div class="help-content">
        <div class="section">
          <h3>🎯 ゲームの目標</h3>
          <p>
            {#if mode === 'normal'}
              <strong>7×7のグリッド</strong>で、<strong>中央の3×3エリア</strong>に<strong>9個のブロック</strong>をすべて集めよう！
            {:else}
              <strong>8×8のグリッド</strong>で、<strong>中央の4×4エリア</strong>に<strong>16個のブロック</strong>をすべて集めよう！
            {/if}
          </p>
        </div>

        <div class="section">
          <h3>🖱️ 操作方法</h3>
          <div class="instruction">
            <div class="instruction-step">
              <span class="step-number">1</span>
              <div class="step-content">
                <strong>外周の青いマス</strong>をクリック<br>
                <small>※ブロックが隣接している外周マスのみ操作可能</small>
              </div>
            </div>
            <div class="instruction-step">
              <span class="step-number">2</span>
              <div class="step-content">
                <strong>ブロックが滑って移動</strong><br>
                <small>※他のブロックにぶつかるまで直進します</small>
              </div>
            </div>
            <div class="instruction-step">
              <span class="step-number">3</span>
              <div class="step-content">
                <strong>連続したブロックは一緒に移動</strong><br>
                <small>※隣接するブロックの塊全体が動きます</small>
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>⚠️ 失敗条件</h3>
          <p>ブロックが<strong>盤面外に滑り落ちる</strong>とゲームオーバーです。</p>
        </div>

        <div class="section">
          <h3>💡 コツ</h3>
          <ul>
            <li>ブロックを外周に押し出さないよう注意</li>
            <li>連続したブロックは一緒に動くことを利用</li>
            <li>中央に集める順序を考えて操作</li>
            <li>失敗を恐れずリトライしよう</li>
          </ul>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="primary-button" on:click={onClose}>
          わかった！
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
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
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    animation: slideIn 0.3s ease-out;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 2rem 1rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .modal-header h2 {
    margin: 0;
    color: #2196f3;
    font-size: 1.5rem;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 2rem;
    color: #666;
    cursor: pointer;
    padding: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
  }

  .close-button:hover {
    background-color: #f0f0f0;
  }

  .help-content {
    padding: 1.5rem 2rem;
  }

  .section {
    margin-bottom: 2rem;
  }

  .section:last-child {
    margin-bottom: 0;
  }

  .section h3 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.2rem;
  }

  .section p {
    margin: 0;
    line-height: 1.6;
    color: #555;
  }

  .instruction {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .instruction-step {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }

  .step-number {
    background: #2196f3;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
  }

  .step-content {
    flex: 1;
  }

  .step-content small {
    color: #777;
    font-size: 0.9rem;
  }

  ul {
    margin: 0;
    padding-left: 1.5rem;
    line-height: 1.8;
    color: #555;
  }

  .modal-footer {
    padding: 1rem 2rem 2rem;
    text-align: center;
    border-top: 1px solid #e0e0e0;
  }

  .primary-button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .primary-button:hover {
    background-color: #45a049;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
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
    .modal-content {
      width: 95%;
      margin: 1rem;
    }

    .modal-header,
    .help-content,
    .modal-footer {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    .instruction-step {
      gap: 0.5rem;
    }

    .step-number {
      width: 25px;
      height: 25px;
      font-size: 0.9rem;
    }
  }
</style>