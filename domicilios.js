// DOM elements
const ordersList = document.getElementById('ordersList');
const staffList = document.getElementById('staffList');
const statTotal = document.getElementById('statTotal');
const statTransit = document.getElementById('statTransit');
const progressFill = document.getElementById('progressFill');
const activeCount = document.getElementById('activeCount');
const filterStatus = document.getElementById('filterStatus');
const searchInput = document.getElementById('search');

const modal = document.getElementById('modal');
const btnNew = document.getElementById('btnNew');
const modalCancel = document.getElementById('modalCancel');
const modalSave = document.getElementById('modalSave');

// sample data
let orders = [
  {id:4582, title:'Pedido #4582', address:'Calle 7 #12-45', driver:'Carlos M.', time:10, status:'transito'},
  {id:4581, title:'Pedido #4581', address:'Carrera 9 #8-24', driver:'Juan P.', time:15, status:'transito'},
  {id:4580, title:'Pedido #4580', address:'Avenida Las Palmas #23-12', driver:'Pendiente', time:5, status:'preparando'},
  {id:4579, title:'Pedido #4579', address:'Calle 15 #5-32', driver:'Maria L.', time:8, status:'transito'}
];

let staff = [
  {id:1, name:'Carlos Mendoza', status:'Activo', deliveries:2, satisfaction:98},
  {id:2, name:'María López', status:'Activo', deliveries:1, satisfaction:97},
  {id:3, name:'Ana Ramirez', status:'Descanso', deliveries:0, satisfaction:96},
  {id:4, name:'Juan Pérez', status:'Activo', deliveries:1, satisfaction:95},
  {id:5, name:'Pedro Sánchez', status:'Activo', deliveries:1, satisfaction:92}
];

// render functions
function renderOrders(list){
  ordersList.innerHTML = '';
  if(!list.length){ ordersList.innerHTML = '<div class="muted small">No hay domicilios</div>'; return; }
  list.forEach(o=>{
    const el = document.createElement('div'); el.className='order';
    el.innerHTML = `
      <div class="left">🚚</div>
      <div class="meta">
        <div class="title">${o.title} <span class="badge ${o.status==='preparando'?'prep':''} ${o.status==='pendiente'?'pend':''}">${statusLabel(o.status)}</span></div>
        <small>${o.address} · Repartidor: ${o.driver}</small>
      </div>
      <div class="time">
        <div>${o.time} min</div>
        <div style="margin-top:8px">
          <select data-id="${o.id}" class="changeStatus">
            <option value="transito" ${o.status==='transito'?'selected':''}>En tránsito</option>
            <option value="preparando" ${o.status==='preparando'?'selected':''}>Preparando</option>
            <option value="pendiente" ${o.status==='pendiente'?'selected':''}>Pendiente</option>
          </select>
        </div>
      </div>
    `;
    ordersList.appendChild(el);
  });
  // attach change listeners
  document.querySelectorAll('.changeStatus').forEach(s=>{
    s.onchange = (e)=>{
      const id = Number(e.target.dataset.id);
      const st = e.target.value;
      const item = orders.find(x=>x.id===id);
      if(item){ item.status = st; updateAll(); }
    };
  });
}

function renderStaff(){
  staffList.innerHTML = '';
  staff.forEach(s=>{
    const el = document.createElement('div'); el.className='person';
    el.innerHTML = `
      <div class="avatar-sm">${initials(s.name)}</div>
      <div style="flex:1"><div class="name">${s.name}</div><div class="muted small">${s.deliveries} entregas · ${s.satisfaction}% satisfacción</div></div>
      <div class="small"><span class="badge" style="background:#e8fff1;color:#047a2f">${s.status}</span></div>
    `;
    staffList.appendChild(el);
  });
}

function statusLabel(s){
  if(s==='transito') return 'En tránsito';
  if(s==='preparando') return 'Preparando';
  if(s==='pendiente') return 'Pendiente';
  return s;
}

function initials(name){
  return name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();
}

function updateStats(){
  statTotal.textContent = orders.length;
  const transit = orders.filter(o=>o.status==='transito').length;
  statTransit.textContent = transit;
  const pct = Math.round((transit/orders.length || 0)*100);
  progressFill.style.width = Math.max(6,pct)+'%';
  activeCount.textContent = `${orders.length} en curso`;
}

// filters & search
function applyFilters(){
  const st = filterStatus.value;
  const q = searchInput.value.trim().toLowerCase();
  let filtered = orders.slice();
  if(st!=='all') filtered = filtered.filter(o=>o.status===st);
  if(q) filtered = filtered.filter(o=> (o.title+o.address+o.driver).toLowerCase().includes(q));
  renderOrders(filtered);
}

// add new via modal
btnNew.onclick = ()=>{ modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false'); };
modalCancel.onclick = ()=>{ modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); };
modalSave.onclick = ()=>{
  const addr = document.getElementById('m_address').value.trim();
  const client = document.getElementById('m_client').value.trim();
  const driver = document.getElementById('m_driver').value.trim() || 'Pendiente';
  const status = document.getElementById('m_status').value;
  if(!addr || !client){ alert('Completa dirección y cliente'); return; }
  const nextId = orders.length? Math.max(...orders.map(o=>o.id))+1 : 1000;
  orders.unshift({id:nextId, title:`Pedido #${nextId}`, address: addr, driver: driver, time:5, status});
  document.getElementById('m_address').value=''; document.getElementById('m_client').value=''; document.getElementById('m_driver').value='';
  modal.classList.add('hidden');
  updateAll();
};

// events
filterStatus.onchange = applyFilters;
searchInput.oninput = applyFilters;

// initial render
function updateAll(){ renderOrders(orders); renderStaff(); updateStats(); }
updateAll();

