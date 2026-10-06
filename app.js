const tools = [
  {id:"porcentajes", name:"Calculadora de porcentajes", icon:"%", category:"Calculadoras", description:"Calcula porcentajes de cualquier cantidad de forma rápida.", keywords:"porcentaje tanto por ciento calculadora", color:"#a7ff5a"},
  {id:"descuentos", name:"Calculadora de descuentos", icon:"↘", category:"Dinero", description:"Calcula el precio final y cuánto ahorras con un descuento.", keywords:"descuento rebaja precio oferta", color:"#6ee7ff"},
  {id:"iva", name:"Calculadora de IVA", icon:"€", category:"Dinero", description:"Añade o descuenta IVA de una cantidad en segundos.", keywords:"iva impuesto precio neto bruto", color:"#c6a7ff"},
  {id:"edad", name:"Calculadora de edad", icon:"◷", category:"Calculadoras", description:"Descubre tu edad exacta a partir de tu fecha de nacimiento.", keywords:"edad cumpleaños fecha nacimiento años", color:"#ffcf70"},
  {id:"media", name:"Calculadora de media", icon:"∑", category:"Estudios", description:"Calcula la media aritmética de varias notas o números.", keywords:"media promedio notas estudios", color:"#ff8bbd"},
  {id:"regla3", name:"Regla de tres", icon:"⅓", category:"Calculadoras", description:"Resuelve reglas de tres simples directa e inversa.", keywords:"regla de tres proporcionalidad", color:"#83f2d2"},
  {id:"propinas", name:"Calculadora de propinas", icon:"☕", category:"Dinero", description:"Calcula la propina y divide la cuenta entre varias personas.", keywords:"propina restaurante cuenta dividir", color:"#ff9f68"},
  {id:"tiempo", name:"Conversor de tiempo", icon:"◴", category:"Utilidades", description:"Convierte segundos, minutos, horas y días fácilmente.", keywords:"tiempo segundos minutos horas días", color:"#8db7ff"},
  {id:"palabras", name:"Contador de palabras", icon:"Aa", category:"Utilidades", description:"Cuenta palabras, caracteres y caracteres sin espacios.", keywords:"contador palabras texto caracteres", color:"#d4ff6e"},
  {id:"caracteres", name:"Contador de caracteres", icon:"⌘", category:"Utilidades", description:"Cuenta caracteres y obtén estadísticas de tu texto.", keywords:"contador caracteres letras texto", color:"#7fe9ff"},
  {id:"qr", name:"Generador de código QR", icon:"▦", category:"Tecnología", description:"Crea un código QR a partir de un texto o enlace.", keywords:"qr código enlace url generador", color:"#b79cff"},
  {id:"password", name:"Generador de contraseñas", icon:"⌁", category:"Tecnología", description:"Genera contraseñas aleatorias y personalizables.", keywords:"contraseña password segura clave", color:"#a7ff5a"},
  {id:"ahorro", name:"Calculadora de ahorro", icon:"◎", category:"Dinero", description:"Calcula cuánto acumularás con un ahorro periódico.", keywords:"ahorro dinero mensual objetivo", color:"#70e8a1"},
  {id:"unidades", name:"Conversor de unidades", icon:"⇄", category:"Utilidades", description:"Convierte longitud, peso, temperatura y más.", keywords:"unidades convertir metros kilos celsius", color:"#70c7ff"},
  {id:"sueldo", name:"Calculadora de sueldo", icon:"▣", category:"Dinero", description:"Estima tu sueldo neto a partir del bruto y tus porcentajes.", keywords:"sueldo salario bruto neto irpf", color:"#ff9a9a"}
];

const categoryIcons = {
  "Calculadoras":"⌗", "Dinero":"€", "Estudios":"∑", "Tecnología":"⌘", "Utilidades":"↔"
};

const grid = document.getElementById("toolsGrid");
const categoryGrid = document.getElementById("categoryGrid");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const overlay = document.getElementById("toolOverlay");
const modalContent = document.getElementById("toolModalContent");

function renderTools(list = tools) {
  grid.innerHTML = list.map(t => `
    <button class="tool-card" style="--card-accent:${t.color}" data-tool="${t.id}">
      <span class="tool-icon">${t.icon}</span>
      <h3>${t.name}</h3>
      <p>${t.description}</p>
      <div class="tool-meta"><span>${t.category}</span><span class="tool-arrow">→</span></div>
    </button>`).join("");
  resultCount.textContent = `${list.length} ${list.length === 1 ? "herramienta" : "herramientas"}`;
  emptyState.classList.toggle("hidden", list.length !== 0);
}

function renderCategories() {
  const counts = {};
  tools.forEach(t => counts[t.category] = (counts[t.category] || 0) + 1);
  categoryGrid.innerHTML = Object.entries(counts).map(([name, count]) => `
    <button class="category-card" data-category="${name}">
      <span class="cat-icon">${categoryIcons[name] || "✦"}</span>
      <strong>${name}</strong>
      <span>${count} herramientas</span>
    </button>`).join("");
}

function search(value) {
  const q = value.trim().toLowerCase();
  const filtered = q ? tools.filter(t => `${t.name} ${t.description} ${t.category} ${t.keywords}`.toLowerCase().includes(q)) : tools;
  renderTools(filtered);
}

searchInput.addEventListener("input", e => search(e.target.value));
document.addEventListener("keydown", e => {
  if (e.key === "/" && document.activeElement !== searchInput) { e.preventDefault(); searchInput.focus(); }
  if (e.key === "Escape") closeModal();
});

document.addEventListener("click", e => {
  const card = e.target.closest("[data-tool]");
  if (card) openTool(card.dataset.tool);

  const cat = e.target.closest("[data-category]");
  if (cat) {
    searchInput.value = cat.dataset.category;
    search(cat.dataset.category);
    document.getElementById("herramientas").scrollIntoView({behavior:"smooth"});
  }

  const popular = e.target.closest("[data-search]");
  if (popular) {
    searchInput.value = popular.dataset.search;
    search(popular.dataset.search);
    document.getElementById("herramientas").scrollIntoView({behavior:"smooth"});
  }
});

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("mobileNav");
mobileMenuBtn.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("open");
  mobileMenuBtn.setAttribute("aria-expanded", String(open));
});
mobileNav.addEventListener("click", () => mobileNav.classList.remove("open"));

document.getElementById("modalClose").addEventListener("click", closeModal);
overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });

function openTool(id) {
  const t = tools.find(x => x.id === id);
  if (!t) return;
  modalContent.innerHTML = toolTemplate(id, t);
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  bindTool(id);
  setTimeout(() => modalContent.querySelector("input, textarea, select, button")?.focus(), 30);
}

function closeModal() {
  overlay.classList.add("hidden");
  document.body.style.overflow = "";
}

function toolTemplate(id, t) {
  const head = `<div><span class="eyebrow">${t.category}</span><h2>${t.name}</h2><p class="modal-description">${t.description}</p></div>`;
  const forms = {
    porcentajes: `${head}<form class="tool-form" id="toolForm"><div class="form-row"><div class="field"><label>Porcentaje (%)</label><input id="a" type="number" step="any" placeholder="20"></div><div class="field"><label>Cantidad</label><input id="b" type="number" step="any" placeholder="150"></div></div><button class="primary-btn">Calcular</button><div id="result"></div></form>`,
    descuentos: `${head}<form class="tool-form" id="toolForm"><div class="form-row"><div class="field"><label>Precio (€)</label><input id="a" type="number" step="any" placeholder="100"></div><div class="field"><label>Descuento (%)</label><input id="b" type="number" step="any" placeholder="20"></div></div><button class="primary-btn">Calcular precio final</button><div id="result"></div></form>`,
    iva: `${head}<form class="tool-form" id="toolForm"><div class="form-row"><div class="field"><label>Importe (€)</label><input id="a" type="number" step="any" placeholder="100"></div><div class="field"><label>IVA (%)</label><input id="b" type="number" step="any" value="21"></div></div><div class="field"><label>Operación</label><select id="mode"><option value="add">Añadir IVA</option><option value="remove">Desglosar IVA incluido</option></select></div><button class="primary-btn">Calcular</button><div id="result"></div></form>`,
    edad: `${head}<form class="tool-form" id="toolForm"><div class="field"><label>Fecha de nacimiento</label><input id="a" type="date"></div><button class="primary-btn">Calcular edad</button><div id="result"></div></form>`,
    media: `${head}<form class="tool-form" id="toolForm"><div class="field"><label>Números separados por comas</label><input id="a" type="text" placeholder="7, 8.5, 9, 6"></div><button class="primary-btn">Calcular media</button><div id="result"></div></form>`,
    regla3: `${head}<form class="tool-form" id="toolForm"><div class="form-row"><div class="field"><label>A</label><input id="a" type="number" step="any" placeholder="2"></div><div class="field"><label>B</label><input id="b" type="number" step="any" placeholder="5"></div></div><div class="field"><label>C</label><input id="c" type="number" step="any" placeholder="4"></div><button class="primary-btn">Calcular X (A/B = C/X)</button><div id="result"></div></form>`,
    propinas: `${head}<form class="tool-form" id="toolForm"><div class="form-row"><div class="field"><label>Cuenta (€)</label><input id="a" type="number" step="any" placeholder="60"></div><div class="field"><label>Propina (%)</label><input id="b" type="number" step="any" value="10"></div></div><div class="field"><label>Personas</label><input id="c" type="number" min="1" step="1" value="1"></div><button class="primary-btn">Calcular</button><div id="result"></div></form>`,
    tiempo: `${head}<form class="tool-form" id="toolForm"><div class="form-row"><div class="field"><label>Cantidad</label><input id="a" type="number" step="any" placeholder="90"></div><div class="field"><label>Desde</label><select id="b"><option>segundos</option><option>minutos</option><option>horas</option><option>días</option></select></div></div><div class="field"><label>Convertir a</label><select id="c"><option>segundos</option><option>minutos</option><option>horas</option><option>días</option></select></div><button class="primary-btn">Convertir</button><div id="result"></div></form>`,
    palabras: `${head}<form class="tool-form" id="toolForm"><div class="field"><label>Tu texto</label><textarea id="a" rows="8" placeholder="Escribe o pega aquí tu texto..."></textarea></div><button class="primary-btn">Contar</button><div id="result"></div></form>`,
    caracteres: `${head}<form class="tool-form" id="toolForm"><div class="field"><label>Tu texto</label><textarea id="a" rows="8" placeholder="Escribe o pega aquí tu texto..."></textarea></div><button class="primary-btn">Contar caracteres</button><div id="result"></div></form>`,
    qr: `${head}<form class="tool-form" id="toolForm"><div class="field"><label>Texto o enlace</label><input id="a" type="text" placeholder="https://ejemplo.com"></div><button class="primary-btn">Generar código QR</button><div id="result"></div></form>`,
    password: `${head}<form class="tool-form" id="toolForm"><div class="form-row"><div class="field"><label>Longitud</label><input id="a" type="number" min="4" max="64" value="16"></div><div class="field"><label>Tipo</label><select id="b"><option value="all">Letras + números + símbolos</option><option value="letters">Solo letras y números</option><option value="numbers">Solo números</option></select></div></div><button class="primary-btn">Generar contraseña</button><div id="result"></div></form>`,
    ahorro: `${head}<form class="tool-form" id="toolForm"><div class="form-row"><div class="field"><label>Ahorro inicial (€)</label><input id="a" type="number" step="any" value="0"></div><div class="field"><label>Ahorro mensual (€)</label><input id="b" type="number" step="any" placeholder="200"></div></div><div class="field"><label>Meses</label><input id="c" type="number" min="1" step="1" placeholder="12"></div><button class="primary-btn">Calcular ahorro</button><div id="result"></div></form>`,
    unidades: `${head}<form class="tool-form" id="toolForm"><div class="form-row"><div class="field"><label>Cantidad</label><input id="a" type="number" step="any" placeholder="10"></div><div class="field"><label>Tipo</label><select id="b"><option value="length">Longitud</option><option value="weight">Peso</option><option value="temp">Temperatura</option></select></div></div><div class="field"><label>Conversión</label><select id="c"></select></div><button class="primary-btn">Convertir</button><div id="result"></div></form>`,
    sueldo: `${head}<form class="tool-form" id="toolForm"><div class="form-row"><div class="field"><label>Sueldo bruto mensual (€)</label><input id="a" type="number" step="any" placeholder="2500"></div><div class="field"><label>Retención IRPF (%)</label><input id="b" type="number" step="any" value="15"></div></div><div class="field"><label>Seguridad Social estimada (%)</label><input id="c" type="number" step="any" value="6.5"></div><button class="primary-btn">Estimar sueldo neto</button><div id="result"></div><p class="result-sub">Estimación orientativa. El sueldo neto real depende de tu situación laboral y fiscal.</p></form>`
  };
  return forms[id];
}

function num(id) { return parseFloat(document.getElementById(id)?.value); }
function money(n) { return `${n.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`; }
function show(html) { document.getElementById("result").innerHTML = `<div class="result-box">${html}</div>`; }

function bindTool(id) {
  const form = document.getElementById("toolForm");
  if (!form) return;

  if (id === "unidades") {
    const type = document.getElementById("b"), select = document.getElementById("c");
    const options = {
      length: ["metros → kilómetros","kilómetros → metros","centímetros → metros","metros → centímetros"],
      weight: ["kilogramos → gramos","gramos → kilogramos","libras → kilogramos","kilogramos → libras"],
      temp: ["Celsius → Fahrenheit","Fahrenheit → Celsius","Celsius → Kelvin","Kelvin → Celsius"]
    };
    function fill(){ select.innerHTML = options[type.value].map(x=>`<option>${x}</option>`).join(""); }
    type.addEventListener("change", fill); fill();
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    try {
      if (id === "porcentajes") { const r=num("a")*num("b")/100; show(`<div class="result-label">Resultado</div><div class="result-value">${r.toLocaleString("es-ES",{maximumFractionDigits:6})}</div>`); }
      if (id === "descuentos") { const price=num("a"), d=num("b"), save=price*d/100; show(`<div class="result-label">Precio final</div><div class="result-value">${money(price-save)}</div><div class="result-sub">Ahorras ${money(save)}.</div>`); }
      if (id === "iva") { const x=num("a"), rate=num("b"), mode=document.getElementById("mode").value; const base=mode==="add"?x:x/(1+rate/100); const iva=mode==="add"?x*rate/100:x-base; const total=mode==="add"?x+iva:x; show(`<div class="result-label">${mode==="add"?"Total con IVA":"Base imponible"}</div><div class="result-value">${money(total)}</div><div class="result-sub">IVA: ${money(iva)}.</div>`); }
      if (id === "edad") { const d=new Date(document.getElementById("a").value+"T00:00:00"); if(isNaN(d)) throw new Error(); const now=new Date(); let years=now.getFullYear()-d.getFullYear(); const before=now.getMonth()<d.getMonth() || (now.getMonth()===d.getMonth() && now.getDate()<d.getDate()); if(before) years--; show(`<div class="result-label">Tu edad</div><div class="result-value">${years} años</div>`); }
      if (id === "media") { const vals=document.getElementById("a").value.split(",").map(v=>parseFloat(v.trim())).filter(Number.isFinite); if(!vals.length) throw new Error(); const avg=vals.reduce((a,b)=>a+b,0)/vals.length; show(`<div class="result-label">Media aritmética</div><div class="result-value">${avg.toLocaleString("es-ES",{maximumFractionDigits:2})}</div><div class="result-sub">${vals.length} valores.</div>`); }
      if (id === "regla3") { const a=num("a"),b=num("b"),c=num("c"); if(!a) throw new Error(); show(`<div class="result-label">X</div><div class="result-value">${(b*c/a).toLocaleString("es-ES",{maximumFractionDigits:6})}</div>`); }
      if (id === "propinas") { const total=num("a"), p=num("b"), people=Math.max(1,num("c")); const tip=total*p/100, final=total+tip; show(`<div class="result-label">Total</div><div class="result-value">${money(final)}</div><div class="result-sub">Propina: ${money(tip)} · ${money(final/people)} por persona.</div>`); }
      if (id === "tiempo") { const x=num("a"), from=document.getElementById("b").value, to=document.getElementById("c").value; const units={segundos:1,minutos:60,horas:3600,días:86400}; const out=x*units[from]/units[to]; show(`<div class="result-label">Resultado</div><div class="result-value">${out.toLocaleString("es-ES",{maximumFractionDigits:6})} ${to}</div>`); }
      if (id === "palabras") { const text=document.getElementById("a").value; const words=text.trim()?text.trim().split(/\s+/).length:0; const chars=[...text].length; const noSpace=[...text.replace(/\s/g,"")].length; show(`<div class="result-label">Estadísticas</div><div class="result-value">${words} palabras</div><div class="result-sub">${chars} caracteres · ${noSpace} sin espacios.</div>`); }
      if (id === "caracteres") { const text=document.getElementById("a").value; const chars=[...text].length, noSpace=[...text.replace(/\s/g,"")].length, lines=text?text.split(/\r?\n/).length:0; show(`<div class="result-label">Caracteres</div><div class="result-value">${chars}</div><div class="result-sub">${noSpace} sin espacios · ${lines} líneas.</div>`); }
      if (id === "qr") { const value=document.getElementById("a").value.trim(); if(!value) throw new Error(); show(`<div class="result-label">Código QR</div><div class="qr-wrap" id="qrCanvas"></div>`); const target=document.getElementById("qrCanvas"); if(window.QRCode){ new QRCode(target,{text:value,width:220,height:220,colorDark:"#000000",colorLight:"#ffffff"}); } else { target.innerHTML="<p style='color:#111'>No se pudo cargar el generador QR. Comprueba tu conexión a internet.</p>"; } }
      if (id === "password") { const length=Math.min(64,Math.max(4,num("a")||16)); const type=document.getElementById("b").value; let chars=type==="numbers"?"0123456789":type==="letters"?"ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789":"ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*_-+="; let out=""; const arr=new Uint32Array(length); crypto.getRandomValues(arr); arr.forEach(n=>out+=chars[n%chars.length]); show(`<div class="result-label">Contraseña generada</div><div class="result-value password-result">${out}</div><div class="copy-row"><button type="button" class="secondary-btn" id="copyPass">Copiar</button></div>`); document.getElementById("copyPass").onclick=()=>navigator.clipboard?.writeText(out); }
      if (id === "ahorro") { const initial=num("a")||0, monthly=num("b"), months=num("c"); const total=initial+monthly*months; show(`<div class="result-label">Ahorro acumulado</div><div class="result-value">${money(total)}</div><div class="result-sub">Aportando ${money(monthly)} al mes durante ${months} meses.</div>`); }
      if (id === "unidades") { const x=num("a"), type=document.getElementById("b").value, c=document.getElementById("c").value; let out, label; const map={length:[["metros → kilómetros",x/1000,"km"],["kilómetros → metros",x*1000,"m"],["centímetros → metros",x/100,"m"],["metros → centímetros",x*100,"cm"]],weight:[["kilogramos → gramos",x*1000,"g"],["gramos → kilogramos",x/1000,"kg"],["libras → kilogramos",x*0.45359237,"kg"],["kilogramos → libras",x/0.45359237,"lb"]],temp:[["Celsius → Fahrenheit",x*9/5+32,"°F"],["Fahrenheit → Celsius",(x-32)*5/9,"°C"],["Celsius → Kelvin",x+273.15,"K"],["Kelvin → Celsius",x-273.15,"°C"]]}; const found=map[type].find(r=>r[0]===c); out=found[1]; label=found[2]; show(`<div class="result-label">Resultado</div><div class="result-value">${out.toLocaleString("es-ES",{maximumFractionDigits:6})} ${label}</div>`); }
      if (id === "sueldo") { const gross=num("a"), irpf=num("b"), ss=num("c"); const net=gross*(1-irpf/100-ss/100); show(`<div class="result-label">Neto mensual estimado</div><div class="result-value">${money(net)}</div><div class="result-sub">Retenciones estimadas: ${money(gross-net)}.</div>`); }
    } catch { show(`<div class="result-label">Revisa los datos</div><div class="result-value">Introduce valores válidos.</div>`); }
  });
}

renderTools();
renderCategories();
document.getElementById("year").textContent = new Date().getFullYear();
