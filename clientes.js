const reservationsGrid = document.getElementById('reservationsGrid');
const searchClients = document.getElementById('searchClients');
const clientState = document.getElementById('clientState');
const clientTable = document.getElementById('clientTable');
const clientSort = document.getElementById('clientSort');

const btnNewRes = document.getElementById('btnNewRes');
const modalRes = document.getElementById('modalRes');
const resCancel = document.getElementById('resCancel');
const resSave = document.getElementById('resSave');

let reservations = [
  {id:1,name:'Carlos Rodríguez', email:'carlos.rodriguez@email.com', datetime:'2025-12-03T19:30', people:4, table:3, note:'Celebración de cumpleaños', state:'confirmada'},
  {id:2,name:'María González', email:'maria.gonzalez@email.com', datetime:'2025-12-04T13:00', people:2, table:1, note:'Almuerzo de negocios', state:'pendiente'},
  {id:3,name:'Juan Pérez', email:'juan.perez@email.com', datetime:'2025-12-02T20:15', people:6, table:5, note:'Cena familiar', state:'completada'},
  {id:4,name:'Ana Martínez', email:'ana.martinez@email.com', datetime:'2025-12-03T14:30', people:3, table:2, note:'Evento privado', state:'cancelada'},
  {id:5,name:'Luis Sánchez', email:'luis.sanchez@email.com', datetime:'2025-12-04T21:00', people:5, table:4, note:'Aniversario', state:'confirmada'}
];

function renderReservations(list){
  reservationsGrid.innerHTML = '';
  if(!list.length){ reservationsGrid.innerHTML = '<div class="muted">No hay reservaciones</div>'; return; }
  list.forEach(r=>{
    const el = document.createElement('div'); el.className='card';
    const stateBadge = r.state==='confirmada' ? '<span class="badge confirm">Confirmada</span>' : (r.state==='pendiente' ? '<span class="badge pending">Pendiente</span>' : '<span class="badge cancel">Cancelada</span>');
    el.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:start">
        <div>
          <h4>${r.name}</h4>
          <div class="meta">${r.email}</div>
        </div>
        <div class="actions">${stateBadge}</div>
      </div>
      <div class="row"><span class="iconSmall">📅</span> ${formatDatetime(r.datetime)}</div>
      <div class="row"><span class="iconSmall">👥</span> ${r.people} personas</div>
      <div class="row"><span class="iconSmall">📞</span> +34 6XX XXX XXX</div>
      <div class="row"><span class="iconSmall">📝</span> ${r.note}</div>
      <div style="margin-top:10px;display:flex;gap:8px;align-items:center">
        <div class="pill">Mesa ${r.table}</div>
        <div style="flex:1"></div>
        <button class="btn small" data-id="${r.id}" onclick="editReservation(${r.id})">✎</button>
        <button class="btn secondary small" data-id="${r.id}" onclick="removeReservation(${r.id})">✕</button>
      </div>
    `;
    reservationsGrid.appendChild(el);
  });
}

function formatDatetime(s){
  const d = new Date(s);
  if(isNaN(d)) return s;
  const opts = {weekday:'short', hour:'2-digit', minute:'2-digit', day:'2-digit', month:'short'};
  return d.toLocaleString('es-ES', opts);
}

// filters
function applyClientFilters(){
  const q = (searchClients.value||'').toLowerCase();
  let list = reservations.slice();
  const st = clientState.value;
  if(st!=='all') list = list.filter(r=> r.state===st);
  const tb = clientTable.value;
  if(tb!=='all') list = list.filter(r=> String(r.table)===tb);
  if(q) list = list.filter(r=> (r.name + r.email + r.note).toLowerCase().includes(q) );
  if(clientSort.value==='nombre') list.sort((a,b)=> a.name.localeCompare(b.name));
  if(clientSort.value==='fecha') list.sort((a,b)=> new Date(a.datetime)-new Date(b.datetime));
  renderReservations(list);
}

// CRUD from modal
btnNewRes.onclick = ()=>{ modalRes.classList.remove('hidden'); modalRes.setAttribute('aria-hidden','false'); };
resCancel.onclick = ()=>{ modalRes.classList.add('hidden'); modalRes.setAttribute('aria-hidden','true'); };
resSave.onclick = ()=>{
  const n = document.getElementById('r_name').value.trim();
  const em = document.getElementById('r_email').value.trim();
  const dt = document.getElementById('r_datetime').value;
  const ppl = Number(document.getElementById('r_people').value) || 1;
  const tb = document.getElementById('r_table').value;
  if(!n || !em || !dt){ alert('Completa todos los campos'); return; }
  const id = reservations.length? Math.max(...reservations.map(r=>r.id))+1 : 1;
  reservations.unshift({id,name:n,email:em,datetime:dt,people:ppl,table:tb,note:'',state:'pendiente'});
  modalRes.classList.add('hidden'); applyClientFilters();
};

// remove/edit
function removeReservation(id){
  if(!confirm('Eliminar reservación?')) return;
  reservations = reservations.filter(r=> r.id!==id);
  applyClientFilters();
}

function editReservation(id){
  const r = reservations.find(x=>x.id===id);
  if(!r) return;
  // quick prompt edit for demo
  const newState = prompt('Estado (confirmada/pendiente/cancelada):', r.state) || r.state;
  r.state = newState;
  applyClientFilters();
}

// events
searchClients.oninput = applyClientFilters;
clientState.onchange = applyClientFilters;
clientTable.onchange = applyClientFilters;
clientSort.onchange = applyClientFilters;

// initial
applyClientFilters();
