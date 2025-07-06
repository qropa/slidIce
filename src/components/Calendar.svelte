<script>
  let { selectedDate = new Date(), onDateSelect = () => {} } = $props();
  
  let currentMonth = $state(new Date(selectedDate.getFullYear(), selectedDate.getMonth()));
  
  function getDaysInMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // 前月の空白日
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // 今月の日付
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  }
  
  function previousMonth() {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
  }
  
  function nextMonth() {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
  }
  
  function selectDate(date) {
    if (date && date <= new Date()) {
      selectedDate = date;
      onDateSelect(date);
    }
  }
  
  function isToday(date) {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }
  
  function isSelected(date) {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  }
  
  function isFutureDate(date) {
    if (!date) return false;
    return date > new Date();
  }
  
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];
</script>

<div class="calendar">
  <div class="calendar-header">
    <button on:click={previousMonth} class="nav-button">
      ◀
    </button>
    <h3>
      {currentMonth.getFullYear()}年 {monthNames[currentMonth.getMonth()]}
    </h3>
    <button on:click={nextMonth} class="nav-button">
      ▶
    </button>
  </div>
  
  <div class="calendar-grid">
    {#each weekdays as weekday}
      <div class="weekday-header">{weekday}</div>
    {/each}
    
    {#each getDaysInMonth(currentMonth) as date}
      <button
        class="day-cell"
        class:today={isToday(date)}
        class:selected={isSelected(date)}
        class:future={isFutureDate(date)}
        class:empty={!date}
        disabled={!date || isFutureDate(date)}
        on:click={() => selectDate(date)}
      >
        {date ? date.getDate() : ''}
      </button>
    {/each}
  </div>
</div>

<style>
  .calendar {
    max-width: 350px;
    margin: 0 auto;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #2196f3;
    color: white;
  }
  
  .calendar-header h3 {
    margin: 0;
    font-size: 1.2rem;
  }
  
  .nav-button {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s;
  }
  
  .nav-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background: #e0e0e0;
  }
  
  .weekday-header {
    background: #f5f5f5;
    padding: 0.5rem;
    text-align: center;
    font-weight: bold;
    font-size: 0.9rem;
    color: #666;
  }
  
  .day-cell {
    background: white;
    border: none;
    padding: 0.8rem 0.2rem;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.2s;
    min-height: 40px;
    font-size: 0.9rem;
  }
  
  .day-cell:not(.empty):not(.future):hover {
    background: #e3f2fd;
  }
  
  .day-cell.today {
    background: #ffeb3b;
    font-weight: bold;
  }
  
  .day-cell.selected {
    background: #2196f3;
    color: white;
    font-weight: bold;
  }
  
  .day-cell.future {
    color: #ccc;
    cursor: not-allowed;
  }
  
  .day-cell.empty {
    cursor: default;
  }
  
  .day-cell:disabled {
    cursor: not-allowed;
  }
</style>