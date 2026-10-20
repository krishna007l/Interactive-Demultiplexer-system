(() => {
  const typeSelect = document.getElementById('demux-type');
  const switchHost = document.getElementById('select-switches');
  const errorBox = document.getElementById('error-message');
  const selectCounts = { '1-to-2': 1, '1-to-4': 2, '1-to-8': 3 };
  let dataValue = 1;
  let debounceTimer;

  function currentBits() {
    return [...switchHost.querySelectorAll('input')].map(input => Number(input.checked));
  }

  function buildSwitches(type) {
    const count = selectCounts[type];
    switchHost.replaceChildren();
    for (let index = count - 1; index >= 0; index -= 1) {
      const label = document.createElement('label');
      label.className = 'switch-control';
      label.innerHTML = `<span>S${index}</span><input type="checkbox" aria-label="Select line S${index}" data-line="${index}"><span class="switch-track"><span class="switch-thumb"></span></span><span class="switch-value">0</span>`;
      switchHost.append(label);
    }
  }

  function updateSwitchLabels() {
    switchHost.querySelectorAll('input').forEach(input => {
      input.nextElementSibling.nextElementSibling.textContent = input.checked ? '1' : '0';
    });
  }

  function renderOutputs(result) {
    const list = document.getElementById('output-list');
    list.replaceChildren();
    result.outputs.forEach((value, index) => {
      const chip = document.createElement('div');
      chip.className = `output-chip${value ? ' active' : ''}`;
      chip.innerHTML = `<b>Y${index}</b><span class="${value ? 'high' : 'low'}">${value ? '1 · HIGH' : '0 · LOW'}</span>`;
      list.append(chip);
    });
  }

  function renderCircuit(result) {
    const circuit = document.getElementById('circuit');
    const outputs = result.outputs.map((value, index) => `<div class="circuit-output${value ? ' active' : ''}"><i class="wire"></i><span>Y${index}</span><b>${value}</b></div>`).join('');
    circuit.innerHTML = `<div class="circuit-input">D <span class="logic-pill ${result.data ? 'high' : 'low'}">${result.data}</span></div><i class="circuit-line ${result.data ? 'active' : ''}"></i><div class="circuit-box"><strong>DEMUX</strong><small>${result.type}</small><span class="select-label">${result.select_bits.join('')}</span></div><div class="circuit-outputs">${outputs}</div>`;
    circuit.setAttribute('aria-label', `${result.type} circuit, input ${result.data}, select ${result.select_bits.join('')}, outputs ${result.outputs.join(', ')}`);
  }

  function renderTable(result) {
    const table = document.getElementById('truth-table');
    const columns = ['D', ...result.truth_table.select_names, ...result.truth_table.output_names];
    table.querySelector('thead').innerHTML = `<tr>${columns.map(column => `<th scope="col">${column}</th>`).join('')}</tr>`;
    table.querySelector('tbody').innerHTML = result.truth_table.rows.map(row => {
      const isCurrent = row.D === result.data && result.truth_table.select_names.every(name => row[name] === result.select_bits[Number(name.slice(1))]);
      return `<tr class="${isCurrent ? 'truth-current' : ''}">${columns.map(column => `<td class="${column.startsWith('Y') && row[column] ? 'truth-active' : ''}">${row[column]}</td>`).join('')}</tr>`;
    }).join('');
    document.getElementById('truth-caption').textContent = `${result.truth_table.rows.length} input combinations for the ${result.type} DEMUX.`;
  }

  async function update() {
    updateSwitchLabels();
    errorBox.hidden = true;
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: typeSelect.value, data: dataValue, select_bits: currentBits() })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not calculate this result.');
      document.getElementById('type-badge').textContent = `${result.type} DEMUX`;
      document.getElementById('input-summary').innerHTML = `D = ${result.data} <span class="logic-pill ${result.data ? 'high' : 'low'}">${result.data ? 'HIGH' : 'LOW'}</span>`;
      document.getElementById('select-summary').textContent = `Select: ${result.select_bits.join('')}`;
      document.getElementById('explanation').textContent = result.explanation;
      renderCircuit(result);
      renderOutputs(result);
      renderTable(result);
    } catch (error) {
      errorBox.textContent = error.message;
      errorBox.hidden = false;
    }
  }

  function scheduleUpdate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(update, 100);
  }

  document.querySelectorAll('[data-data]').forEach(button => button.addEventListener('click', () => {
    dataValue = Number(button.dataset.data);
    document.querySelectorAll('[data-data]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    update();
  }));
  typeSelect.addEventListener('change', () => { buildSwitches(typeSelect.value); update(); });
  switchHost.addEventListener('change', scheduleUpdate);
  document.getElementById('reset-button').addEventListener('click', () => {
    typeSelect.value = '1-to-4';
    dataValue = 1;
    document.querySelectorAll('[data-data]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.data === '1')));
    buildSwitches(typeSelect.value);
    update();
  });
  buildSwitches(typeSelect.value);
  update();
})();
