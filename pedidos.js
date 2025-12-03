// elementos DOM
const ordersGrid = document.getElementById('ordersGrid');
const searchOrders = document.getElementById('searchOrders');
const tabs = Array.from(document.querySelectorAll('.tab'));
const sumTotal = document.getElementById('sumTotal');
const sumPending = document.getElementById('sumPending');
const sumDone = document.getElementById('sumDone');
const sumIncome = document.getElementById('sumIncome');

const btnNewOrder = document.getElementById('btnNewOrder');
const modalOrder = document.getElementById('modalOrder');
const orderCancel = document.getElementById('orderCancel');
const orderSave = document.getElementById('orderSave');

// datos de ejemplo
let orders = [
  { id: 1254, code:'#ORD-2023-1254', table:5, time:'14:30', client:'Juan Pérez', items:['Paella Valenciana x1','Ensalada Mixta x1','Agua Mineral x2'], total:32.50, state:'pendiente' },
  { id: 1253, code:'#ORD-2023-1253', table:3, time:'14:15', client:'María López', items:['Solomillo al Whisky x2','Patatas Bravas x1','Vino Tinto x1'], total:58.75, state:'preparacion' },
  { id: 1252, code:'#ORD-2023-1252', table:8, time:'14:00', client:'Carlos Ruiz', items:['Pasta Carbonara x1','Tiramisú x1','Refresco x1'], total:24.50, state:'listo' },
  { id: 1251, code:'#ORD-2023-1251', table:2, time:'13:45', client:'Ana Martínez', items:['Ensalada x1','Agua x1'], total:18.00, state:'entregado' },
  { id: 1250, code:'#ORD-2023-1250', table:7, time:'13:30', client:'Pedro Gómez', items:['Sopa x1','Filete x1'], total:22.30, state:'cancelado' }
];

// render
function renderOrders(list){
  ordersGrid.innerHTML = '';
  if(!list.length){ ordersGrid.innerHTML = '<div class="muted">No hay pedidos</div>'; return; }
  list.forEach(o=>{
    const card = document.createElement('div');
    card.className = 'card';
    const badgeClass = stateToBadge(o.state);
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div class="meta small">${o.code}</div>
          <h4>Mesa ${o.table}</h4>
          <div class="meta">Hora: ${o.time}<br>Cliente: ${o.client}</div>
        </div>
        <div class="actions">
          <div class="badge ${badgeClass}">${humanState(o.state)}</div>
        </div>
      </div>

      <div class="items"><strong>Artículos:</strong>
        <ul>${o.items.map(it=>`<li>${it}</li>`).join('')}</ul>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between">
        <div><strong>Total: $${o.total.toFixed(2)}</strong></div>
        <div style="display:flex;gap:6px;align-items:center">
          <button class="smallBtn edit" data-id="${o.id}" title="Editar">✎</button>
          <button class="smallBtn view" data-id="${o.id}" title="Ver">🔍</button>
        </div>
      </div>
    `;
    ordersGrid.appendChild(card);
  });

  // listeners
  document.querySelectorAll('.smallBtn.edit').forEach(b=>{
    b.onclick = ()=> openEdit(Number(b.dataset.id));
  });
  document.querySelectorAll('.smallBtn.view').forEach(b=>{
    b.onclick = ()=> alert('Ver pedido: ' + b.dataset.id);
  });
}

function stateToBadge(s){
  if(s==='pendiente') return 'pend';
  if(s==='preparacion') return 'prep';
  if(s==='listo') return 'listo';
  if(s==='entregado') return 'ent';
  if(s==='cancelado') return 'cancel';
  return '';
}
function humanState(s){
  if(s==='pendiente') return 'Pendiente';
  if(s==='preparacion') return 'En preparación';
  if(s==='listo') return 'Listo';
  if(s==='entregado') return 'Entregado';
  if(s==='cancelado') return 'Cancelado';
  return s;
}

// filtros
let activeTab = 'all';
function applyFilters(){
  const q = (searchOrders.value||'').toLowerCase().trim();
  let list = orders.slice();
  if(activeTab !== 'all'){
    if(activeTab==='pendiente') list = list.filter(x=>x.state==='pendiente');
    if(activeTab==='preparacion') list = list.filter(x=>x.state==='preparacion');
    if(activeTab==='listo') list = list.filter(x=>x.state==='listo');
    if(activeTab==='entregado') list = list.filter(x=>x.state==='entregado');
    if(activeTab==='cancelado') list = list.filter(x=>x.state==='cancelado');
  }
  if(q){
    list = list.filter(x=> (x.code + x.client + x.items.join(' ') + x.table).toString().toLowerCase().includes(q) );
  }
  renderOrders(list);
  updateSummary();
}

// pestañas
tabs.forEach(t=>{
  t.addEventListener('click', ()=>{
    tabs.forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    activeTab = t.dataset.tab;
    applyFilters();
  });
});

// resumen lateral
function updateSummary(){
  sumTotal.textContent = orders.length;
  sumPending.textContent = orders.filter(o=>o.state==='pendiente').length;
  sumDone.textContent = orders.filter(o=>o.state==='entregado').length;
  const income = orders.reduce((s,o)=>s + (Number(o.total)||0),0);
  sumIncome.textContent = '$' + income.toFixed(2);
}

// CRUD modal
btnNewOrder.onclick = ()=>{ openModalNew(); };
orderCancel.onclick = ()=> closeModal();
orderSave.onclick = ()=> saveOrder();

function openModalNew(){
  modalOrder.classList.remove('hidden'); modalOrder.setAttribute('aria-hidden','false');
  document.getElementById('o_client').value=''; document.getElementById('o_table').value=''; document.getElementById('o_time').value=''; document.getElementById('o_items').value=''; document.getElementById('o_total').value='';
  document.getElementById('o_state').value='pendiente';
  modalOrder.dataset.editId = '';
}

function closeModal(){ modalOrder.classList.add('hidden'); modalOrder.setAttribute('aria-hidden','true'); modalOrder.dataset.editId = ''; }

function saveOrder(){
  const c = document.getElementById('o_client').value.trim();
  const table = document.getElementById('o_table').value.trim();
  const time = document.getElementById('o_time').value || '00:00';
  const itemsRaw = document.getElementById('o_items').value.trim();
  const total = parseFloat(document.getElementById('o_total').value) || 0;
  const state = document.getElementById('o_state').value;
  if(!c || !table || !itemsRaw){ alert('Completa cliente, mesa y artículos'); return; }
  const items = itemsRaw.split('\n').map(s=>s.trim()).filter(Boolean);
  if(modalOrder.dataset.editId){
    // edit
    const id = Number(modalOrder.dataset.editId);
    const ord = orders.find(x=>x.id===id);
    if(ord){
      ord.client = c; ord.table = table; ord.time = time; ord.items = items; ord.total = total; ord.state = state;
    }
  } else {
    const nextId = orders.length? Math.max(...orders.map(o=>o.id))+1 : 1000;
    orders.unshift({id: nextId, code: '#ORD-2023-' + nextId, table: table, time: time, client: c, items: items, total: total, state: state});
  }
  closeModal();
  applyFilters();
}

// editar rapido
function openEdit(id){
  const ord = orders.find(x=>x.id===id);
  if(!ord) return;
  modalOrder.classList.remove('hidden'); modalOrder.setAttribute('aria-hidden','false');
  document.getElementById('o_client').value = ord.client;
  document.getElementById('o_table').value = ord.table;
  document.getElementById('o_time').value = ord.time;
  document.getElementById('o_items').value = ord.items.join('\n');
  document.getElementById('o_total').value = ord.total;
  document.getElementById('o_state').value = ord.state;
  modalOrder.dataset.editId = id;
}

// search & initial
searchOrders.oninput = () => applyFilters();
applyFilters();
