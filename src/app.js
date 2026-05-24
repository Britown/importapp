import { curatedData } from './data.js';
import { generateAnalysis } from './generator.js';
import { costData } from './costData.js';

// Exchange rate setting: 1 USD = 950 CLP (Stable commercial estimate)
const USD_TO_CLP = 950;

// DOM Elements
const landingScreen = document.getElementById('landing-screen');
const loaderScreen = document.getElementById('loader-screen');
const dashboardScreen = document.getElementById('dashboard-screen');

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const backSearchBtn = document.getElementById('back-search-btn');

// Stats Elements
const statAvgMargin = document.getElementById('stat-avg-margin');
const statCompetition = document.getElementById('stat-competition');
const statDifficulty = document.getElementById('stat-difficulty');

// Products Container
const productsContainer = document.getElementById('products-container');

// Simulator Elements
const simProductSelect = document.getElementById('sim-product-select');
const simUnitCost = document.getElementById('sim-unit-cost');
const labelUnitCost = document.getElementById('label-unit-cost');
const simQty = document.getElementById('sim-qty');
const labelQty = document.getElementById('label-qty');
const simShippingType = document.getElementById('sim-shipping-type');
const simResalePrice = document.getElementById('sim-resale-price');
const labelResalePrice = document.getElementById('label-resale-price');

// Simulator Outputs
const resTotalFob = document.getElementById('res-total-fob');
const resFreight = document.getElementById('res-freight');
const resAdvalorem = document.getElementById('res-advalorem');
const resIva = document.getElementById('res-iva');
const resUnitLanded = document.getElementById('res-unit-landed');
const resTotalInvestment = document.getElementById('res-total-investment');
const resNetMargin = document.getElementById('res-net-margin');

// Summary Elements
const summaryBestName = document.getElementById('summary-best-name');
const summaryBestDesc = document.getElementById('summary-best-desc');
const summarySafeName = document.getElementById('summary-safe-name');
const summarySafeDesc = document.getElementById('summary-safe-desc');

// Active state report data
let activeReport = null;

// ==========================================
// ADVANCED COSTS PLANILLA ELEMENTS & STATE
// ==========================================
const tabSourcingBtn = document.getElementById('tab-sourcing-btn');
const tabCostsBtn = document.getElementById('tab-costs-btn');
const sourcingTabContent = document.getElementById('sourcing-tab-content');
const costsTabContent = document.getElementById('costs-tab-content');

const shipBtnAereo = document.getElementById('ship-btn-aereo');
const shipBtnMaritimo = document.getElementById('ship-btn-maritimo');

const costExchangeRate = document.getElementById('cost-exchange-rate');
const costDivisor = document.getElementById('cost-divisor');
const costRefExwork = document.getElementById('cost-ref-exwork');
const costRefFreight = document.getElementById('cost-ref-freight');
const costRefSeguro = document.getElementById('cost-ref-seguro');
const costAutoCalc = document.getElementById('cost-auto-calc');

const localExpensesList = document.getElementById('local-expenses-list');
const addExpenseBtn = document.getElementById('add-expense-btn');

const costStatTotalClp = document.getElementById('cost-stat-total-clp');
const costStatTotalUnits = document.getElementById('cost-stat-total-units');
const costStatTotalCif = document.getElementById('cost-stat-total-cif');

const addProductRowBtn = document.getElementById('add-product-row-btn');
const resetCostDataBtn = document.getElementById('reset-cost-data-btn');
const exportCsvBtn = document.getElementById('export-csv-btn');
const spreadsheetTbody = document.getElementById('spreadsheet-tbody');

// Table Row Totals Elements
const totalRowUnits = document.getElementById('total-row-units');
const totalRowFob = document.getElementById('total-row-fob');
const totalRowFreight = document.getElementById('total-row-freight');
const totalRowSeguro = document.getElementById('total-row-seguro');
const totalRowCif = document.getElementById('total-row-cif');
const totalRowIva = document.getElementById('total-row-iva');
const totalRowLocal = document.getElementById('total-row-local');
const totalRowDapBruto = document.getElementById('total-row-dap-bruto');
const totalRowDapBrutoClp = document.getElementById('total-row-dap-bruto-clp');
const totalRowDapNet = document.getElementById('total-row-dap-net');
const totalRowDapNetClp = document.getElementById('total-row-dap-net-clp');
const totalRowAvgNetClp = document.getElementById('total-row-avg-net-clp');
const totalRowAvgVentaClp = document.getElementById('total-row-avg-venta-clp');

let currentCostMethod = 'aereo'; // 'aereo' or 'maritimo'
let costState = {
  aereo: {
    usd_clp: 704,
    divisor: 18,
    ref_exwork: 350,
    ref_freight: 780,
    ref_seguro: 0,
    auto_calc: false,
    services: [
      { name: "Servicio DHL", value: 100 }
    ],
    products: []
  },
  maritimo: {
    usd_clp: 704,
    divisor: 18,
    ref_exwork: 7290,
    ref_freight: 2800,
    ref_seguro: 50,
    auto_calc: false,
    services: [
      { name: "Gastos portuarios", value: 250 },
      { name: "Honorarios AG ADUANA", value: 223 },
      { name: "Apertura de Manifiesto", value: 63.92 }
    ],
    products: []
  }
};

function init() {
  // Initialize spreadsheet cost state values from costData.js
  initCostState();
  loadCostStateIntoInputs();

  // Search Form Submit
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      triggerAnalysis(query);
    }
  });

  // Suggestion Tags click
  document.querySelectorAll('.suggestion-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const query = tag.getAttribute('data-query');
      searchInput.value = query;
      triggerAnalysis(query);
    });
  });

  // Back to Search
  backSearchBtn.addEventListener('click', () => {
    showScreen(landingScreen);
    searchInput.value = '';
    searchInput.focus();
  });

  // Simulator Inputs
  simProductSelect.addEventListener('change', () => {
    const selectedId = simProductSelect.value;
    const product = activeReport.products.find(p => p.id === selectedId);
    if (product) {
      populateSimulator(product);
    }
  });

  simUnitCost.addEventListener('input', () => {
    labelUnitCost.textContent = `$${parseFloat(simUnitCost.value).toFixed(2)} USD`;
    calculateSimulation();
  });

  simQty.addEventListener('input', () => {
    labelQty.textContent = parseInt(simQty.value).toLocaleString('es-CL');
    calculateSimulation();
  });

  simShippingType.addEventListener('change', calculateSimulation);
  
  simResalePrice.addEventListener('input', () => {
    // Format resale price as user types
    const rawVal = simResalePrice.value.replace(/\D/g, '');
    const numVal = parseInt(rawVal) || 0;
    simResalePrice.value = numVal.toLocaleString('es-CL');
    labelResalePrice.textContent = `$${numVal.toLocaleString('es-CL')} CLP`;
    calculateSimulation();
  });

  // Cost Planner Navigation Tabs
  tabSourcingBtn.addEventListener('click', () => {
    tabSourcingBtn.classList.add('active');
    tabCostsBtn.classList.remove('active');
    sourcingTabContent.style.display = 'block';
    costsTabContent.style.display = 'none';
  });

  tabCostsBtn.addEventListener('click', () => {
    tabCostsBtn.classList.add('active');
    tabSourcingBtn.classList.remove('active');
    costsTabContent.style.display = 'block';
    sourcingTabContent.style.display = 'none';
    renderCostsTab();
  });

  // Bind cost tab controls
  bindCostsControls();
}

// Check readyState to prevent module race condition
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Screen State Router
function showScreen(screenToShow) {
  [landingScreen, loaderScreen, dashboardScreen].forEach(screen => {
    screen.style.display = 'none';
  });
  
  if (screenToShow === loaderScreen) {
    screenToShow.style.display = 'flex';
  } else {
    screenToShow.style.display = 'block';
  }
}

// Sourcing Process Flow Timeline triggers
function triggerAnalysis(query) {
  showScreen(loaderScreen);
  
  const steps = [
    { id: 'step-sourcing', delay: 700 },
    { id: 'step-market', delay: 800 },
    { id: 'step-logistics', delay: 800 },
    { id: 'step-regulations', delay: 900 },
    { id: 'step-margin', delay: 800 }
  ];

  // Reset steps classes
  steps.forEach(s => {
    const el = document.getElementById(s.id);
    el.className = 'step-item';
  });

  let currentStepIndex = 0;

  function runNextStep() {
    if (currentStepIndex > 0) {
      const prevStep = document.getElementById(steps[currentStepIndex - 1].id);
      prevStep.classList.remove('active');
      prevStep.classList.add('completed');
    }
    
    if (currentStepIndex < steps.length) {
      const currentStep = document.getElementById(steps[currentStepIndex].id);
      currentStep.classList.add('active');
      
      setTimeout(() => {
        currentStepIndex++;
        runNextStep();
      }, steps[currentStepIndex].delay);
    } else {
      // Completed all steps, render dashboard
      finishAnalysis(query);
    }
  }

  runNextStep();
}

// Loading ends, populate and show dashboard
function finishAnalysis(query) {
  // Fetch from data or fallback generator
  const cleanQuery = query.toLowerCase().trim();
  let data = curatedData[cleanQuery];
  
  if (!data) {
    // Generate intelligent dynamic mock report
    data = generateAnalysis(query);
  }
  
  activeReport = data;
  
  // Update UI Elements
  document.getElementById('result-query-title').textContent = `Reporte de Importación: "${data.title || query}"`;
  
  // Populate Stats Cards
  const avgMarginVal = Math.round(data.products.reduce((acc, p) => acc + p.estimated_margin_percent, 0) / data.products.length);
  statAvgMargin.textContent = `${avgMarginVal}%`;
  
  // Set overall competition indicator based on product values
  const hasHighComp = data.products.some(p => p.competition_chile === 'High');
  const hasLowComp = data.products.some(p => p.competition_chile === 'Low');
  statCompetition.textContent = hasHighComp && hasLowComp ? 'Media' : (hasLowComp ? 'Baja' : 'Alta');
  
  // Set overall difficulty
  const hasDifficult = data.products.some(p => p.import_difficulty === 'Difficult');
  const hasModerate = data.products.some(p => p.import_difficulty === 'Moderate');
  statDifficulty.textContent = hasDifficult ? 'Alta (ISP/SEC)' : (hasModerate ? 'Moderada' : 'Fácil');

  // Render Products Grid Cards
  renderProductCards(data.products);
  
  // Setup simulator product select dropdown
  simProductSelect.innerHTML = '';
  data.products.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    simProductSelect.appendChild(opt);
  });
  
  // Populate simulator with first product in list
  populateSimulator(data.products[0]);

  // Executive summary
  summaryBestName.textContent = data.summary.best_opportunity;
  summaryBestDesc.textContent = data.summary.best_reason;
  summarySafeName.textContent = data.summary.safest_product;
  summarySafeDesc.textContent = data.summary.safest_reason;

  showScreen(dashboardScreen);
}

// Rendering Card Layout in Grid
function renderProductCards(products) {
  productsContainer.innerHTML = '';
  
  products.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product-card glass-card';
    
    // Generate Stars HTML
    let starsHtml = '';
    const roundedStars = Math.round(p.score);
    for (let i = 1; i <= 5; i++) {
      starsHtml += i <= roundedStars ? '★' : '☆';
    }
    
    card.innerHTML = `
      <div class="score-badge" style="top: 1.25rem; right: 1.25rem; z-index: 10;">
        <span>${starsHtml}</span>
        <span>${p.score.toFixed(1)}</span>
      </div>
      ${p.thumbnail ? `
      <div class="product-image-container" style="position: relative; width: 100%; height: 180px; overflow: hidden; border-radius: 12px 12px 0 0; border-bottom: 1px solid var(--glass-border);">
        <img src="${p.thumbnail}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.05)';" onmouseout="this.style.transform='scale(1)';" />
      </div>
      ` : ''}
      <div class="product-content" style="${p.thumbnail ? 'padding: 1.25rem;' : 'padding-top: 2rem;'}">
        <h4 class="product-title" style="padding-right: 6rem;">${p.name}</h4>
        <div class="supplier-meta">
          <span>💼 Alibaba B2B</span>
          <span>📅 ${p.supplier_years} años activo</span>
        </div>
        
        <div class="badges-row">
          <span class="tag-badge verified" style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #10b981;">✓ Verified Supplier</span>
          <span class="tag-badge ${p.competition_chile.toLowerCase()}">📊 Competencia: ${p.competition_chile}</span>
          <span class="tag-badge ${p.import_difficulty.toLowerCase()}">🚚 Importación: ${p.import_difficulty}</span>
        </div>

        <a href="https://listado.mercadolibre.cl/${encodeURIComponent(p.name)}" target="_blank" class="mercadolibre-link" style="color: #fbbf24; font-size: 0.8rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem; margin-top: -0.5rem; margin-bottom: 1.25rem; font-weight: 600; padding: 0.25rem 0.5rem; border-radius: 6px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.2); width: fit-content; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(245, 158, 11, 0.15)'; this.style.borderColor='rgba(245, 158, 11, 0.4)';" onmouseout="this.style.background='rgba(245, 158, 11, 0.08)'; this.style.borderColor='rgba(245, 158, 11, 0.2)';">
          🔍 Ver competencia en Mercado Libre Chile ↗
        </a>

        <div class="financial-grid">
          <div class="fin-item">
            <span class="fin-label">Costo FOB Unitario</span>
            <span class="fin-val">$${p.unit_cost_usd.toFixed(2)} USD</span>
          </div>
          <div class="fin-item">
            <span class="fin-label">Resale Estimado Chile</span>
            <span class="fin-val">$${p.estimated_resale_clp.toLocaleString('es-CL')} CLP</span>
          </div>
          <div class="fin-item">
            <span class="fin-label">Margen Neto Teórico</span>
            <span class="fin-val highlight">${p.estimated_margin_percent}%</span>
          </div>
          <div class="fin-item">
            <span class="fin-label">Peso Promedio</span>
            <span class="fin-val">${p.weight_kg} kg</span>
          </div>
        </div>

        <div class="text-panel">
          <h5>📈 Ángulo de Ventas:</h5>
          <p>${p.selling_angle}</p>
        </div>

        <div class="text-panel">
          <h5>💡 Viabilidad en Chile:</h5>
          <p>${p.success_reason}</p>
        </div>

        <div class="warning-box">
          <strong>⚠️ Alerta/Restricción:</strong> ${p.risks}
        </div>

        <a href="${p.alibaba_link}" target="_blank" class="alibaba-action-btn">
          Ver Proveedor en Alibaba <span>↗</span>
        </a>
      </div>
    `;
    
    productsContainer.appendChild(card);
  });
}

// Populate Cost Simulator UI Fields
function populateSimulator(product) {
  simUnitCost.value = product.unit_cost_usd;
  labelUnitCost.textContent = `$${product.unit_cost_usd.toFixed(2)} USD`;
  
  simQty.value = 100;
  labelQty.textContent = '100';
  
  simShippingType.value = product.import_difficulty === 'Difficult' || product.weight_kg > 1.0 ? 'sea' : 'air';
  
  simResalePrice.value = product.estimated_resale_clp.toLocaleString('es-CL');
  labelResalePrice.textContent = `$${product.estimated_resale_clp.toLocaleString('es-CL')} CLP`;
  
  calculateSimulation();
}

// Recalculate Landing Costs, Customs Taxes and ROI margins
function calculateSimulation() {
  const selectedId = simProductSelect.value;
  const product = activeReport.products.find(p => p.id === selectedId);
  if (!product) return;

  const unitCostUsd = parseFloat(simUnitCost.value);
  const qty = parseInt(simQty.value);
  const shippingType = simShippingType.value;
  const resalePriceClp = parseInt(simResalePrice.value.replace(/\D/g, '')) || 0;

  // 1. Calculate FOB Value
  const totalFobUsd = unitCostUsd * qty;

  // 2. Shipping Cost Estimates (based on average weights/dimensions)
  // Air Express: $10 USD per kg / Sea Freight LCL: $3.5 USD per kg (with base volume clearance shares)
  const freightPerKg = shippingType === 'air' ? 10.0 : 3.5;
  const totalWeight = product.weight_kg * qty;
  const totalFreightUsd = totalWeight * freightPerKg;

  // 3. CIF Value (FOB + Freight) - Customs tax base
  const cifValueUsd = totalFobUsd + totalFreightUsd;

  // 4. Chilean Customs Duties
  // Ad-Valorem: 6% of CIF
  const adValoremUsd = cifValueUsd * 0.06;
  // IVA: 19% of (CIF + Ad-Valorem)
  const ivaUsd = (cifValueUsd + adValoremUsd) * 0.19;
  
  // 5. Fixed logistics / Customs clearing broker fees (prorated estimate)
  // Sea freight has higher port/handling fixed fees (approx $150 USD); Air has less ($30 USD)
  const customsBrokerFeeUsd = shippingType === 'sea' ? 150.0 : 30.0;

  // 6. Total Landed Cost (Landed) in USD and CLP
  const totalLandedCostUsd = cifValueUsd + adValoremUsd + ivaUsd + customsBrokerFeeUsd;
  const totalLandedCostClp = totalLandedCostUsd * USD_TO_CLP;
  const unitLandedCostClp = Math.round(totalLandedCostClp / qty);

  // 7. Net Margin and Profit
  const unitRevenueClp = resalePriceClp;
  const unitProfitClp = unitRevenueClp - unitLandedCostClp;
  const netMarginPercent = unitRevenueClp > 0 ? Math.round((unitProfitClp / unitRevenueClp) * 100) : 0;

  // Update simulator view text elements
  resTotalFob.textContent = `$${totalFobUsd.toFixed(2)} USD`;
  resFreight.textContent = `$${totalFreightUsd.toFixed(2)} USD`;
  resAdvalorem.textContent = `$${adValoremUsd.toFixed(2)} USD`;
  resIva.textContent = `$${ivaUsd.toFixed(2)} USD`;
  
  resUnitLanded.textContent = `$${unitLandedCostClp.toLocaleString('es-CL')} CLP`;
  resTotalInvestment.textContent = `$${Math.round(totalLandedCostClp).toLocaleString('es-CL')} CLP`;
  
  resNetMargin.textContent = `${netMarginPercent}%`;
  
  // Styling margin indicator based on percentage profit bounds
  const resultsContainer = resNetMargin.parentElement;
  if (netMarginPercent >= 60) {
    resNetMargin.style.color = '#10b981'; // green
    resultsContainer.style.borderColor = 'rgba(16, 185, 129, 0.2)';
    resultsContainer.style.background = 'rgba(16, 185, 129, 0.05)';
  } else if (netMarginPercent >= 40) {
    resNetMargin.style.color = '#f59e0b'; // orange
    resultsContainer.style.borderColor = 'rgba(245, 158, 11, 0.2)';
    resultsContainer.style.background = 'rgba(245, 158, 11, 0.05)';
  } else {
    resNetMargin.style.color = '#ef4444'; // red
    resultsContainer.style.borderColor = 'rgba(239, 68, 68, 0.2)';
    resultsContainer.style.background = 'rgba(239, 68, 68, 0.05)';
  }
}

// ==========================================================================
// ADVANCED PLANILLA SPREADSHEET IMPLEMENTATION FUNCTIONS
// ==========================================================================

function initCostState() {
  costState.aereo.products = JSON.parse(JSON.stringify(costData.aereo.products));
  costState.maritimo.products = JSON.parse(JSON.stringify(costData.maritimo.products));
}

function loadCostStateIntoInputs() {
  const state = costState[currentCostMethod];
  costExchangeRate.value = state.usd_clp;
  costDivisor.value = state.divisor;
  costRefExwork.value = state.ref_exwork.toFixed(2);
  costRefFreight.value = state.ref_freight.toFixed(2);
  costRefSeguro.value = state.ref_seguro.toFixed(2);
  costAutoCalc.checked = state.auto_calc;
  
  costDivisor.disabled = state.auto_calc;
  costRefExwork.disabled = state.auto_calc;
}

function bindCostsControls() {
  // Ship type toggle switchers
  shipBtnAereo.addEventListener('click', () => {
    currentCostMethod = 'aereo';
    shipBtnAereo.classList.add('active');
    shipBtnMaritimo.classList.remove('active');
    loadCostStateIntoInputs();
    renderCostsTab();
  });
  
  shipBtnMaritimo.addEventListener('click', () => {
    currentCostMethod = 'maritimo';
    shipBtnMaritimo.classList.add('active');
    shipBtnAereo.classList.remove('active');
    loadCostStateIntoInputs();
    renderCostsTab();
  });
  
  // Global parameter listeners
  costExchangeRate.addEventListener('input', () => {
    costState[currentCostMethod].usd_clp = parseFloat(costExchangeRate.value) || 0;
    recalculateCosts();
  });
  
  costDivisor.addEventListener('input', () => {
    costState[currentCostMethod].divisor = parseFloat(costDivisor.value) || 1;
    recalculateCosts();
  });
  
  costRefExwork.addEventListener('input', () => {
    costState[currentCostMethod].ref_exwork = parseFloat(costRefExwork.value) || 0;
    recalculateCosts();
  });
  
  costRefFreight.addEventListener('input', () => {
    costState[currentCostMethod].ref_freight = parseFloat(costRefFreight.value) || 0;
    recalculateCosts();
  });
  
  costRefSeguro.addEventListener('input', () => {
    costState[currentCostMethod].ref_seguro = parseFloat(costRefSeguro.value) || 0;
    recalculateCosts();
  });
  
  costAutoCalc.addEventListener('change', () => {
    const isChecked = costAutoCalc.checked;
    costState[currentCostMethod].auto_calc = isChecked;
    costDivisor.disabled = isChecked;
    costRefExwork.disabled = isChecked;
    recalculateCosts();
  });
  
  // Reset Excel data
  resetCostDataBtn.addEventListener('click', () => {
    if (confirm("¿Estás seguro de restablecer los productos y costos a los valores originales de la planilla Excel?")) {
      initCostState();
      loadCostStateIntoInputs();
      renderCostsTab();
    }
  });
  
  // Add customized local expense row
  addExpenseBtn.addEventListener('click', () => {
    costState[currentCostMethod].services.push({ name: "Gasto Local Nuevo", value: 0 });
    renderLocalExpenses();
    recalculateCosts();
  });
  
  // Add new product row
  addProductRowBtn.addEventListener('click', () => {
    costState[currentCostMethod].products.push({
      name: "Producto Nuevo",
      units: 10,
      unit_cost: 5.0
    });
    renderSpreadsheetBody();
    recalculateCosts();
  });
  
  // Export CSV download
  exportCsvBtn.addEventListener('click', exportToCsv);
}

function renderLocalExpenses() {
  localExpensesList.innerHTML = '';
  const expenses = costState[currentCostMethod].services;
  
  expenses.forEach((exp, idx) => {
    const row = document.createElement('div');
    row.className = 'expense-item-row';
    
    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.className = 'expense-label-input';
    labelInput.value = exp.name;
    labelInput.addEventListener('input', () => {
      exp.name = labelInput.value;
    });
    
    const valInput = document.createElement('input');
    valInput.type = 'number';
    valInput.className = 'expense-value-input';
    valInput.value = exp.value;
    valInput.step = '0.01';
    valInput.addEventListener('input', () => {
      exp.value = parseFloat(valInput.value) || 0;
      recalculateCosts();
    });
    
    const delBtn = document.createElement('button');
    delBtn.className = 'expense-delete-btn';
    delBtn.innerHTML = '🗑️';
    delBtn.title = 'Eliminar gasto';
    delBtn.addEventListener('click', () => {
      expenses.splice(idx, 1);
      renderLocalExpenses();
      recalculateCosts();
    });
    
    row.appendChild(labelInput);
    row.appendChild(valInput);
    row.appendChild(delBtn);
    localExpensesList.appendChild(row);
  });
}

function renderSpreadsheetBody() {
  spreadsheetTbody.innerHTML = '';
  const products = costState[currentCostMethod].products;
  
  products.forEach((prod, idx) => {
    const tr = document.createElement('tr');
    tr.id = `row-prod-${idx}`;
    
    // Column 1: Name
    const tdName = document.createElement('td');
    tdName.style.position = 'sticky';
    tdName.style.left = '0';
    tdName.style.background = '#080d1a';
    tdName.style.zIndex = '5';
    tdName.style.borderRight = '1px solid var(--glass-border)';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'grid-input-text';
    nameInput.value = prod.name;
    nameInput.addEventListener('input', () => {
      prod.name = nameInput.value;
    });
    tdName.appendChild(nameInput);
    tr.appendChild(tdName);
    
    // Column 2: Units
    const tdUnits = document.createElement('td');
    const unitsInput = document.createElement('input');
    unitsInput.type = 'number';
    unitsInput.className = 'grid-input-number';
    unitsInput.value = prod.units;
    unitsInput.step = '1';
    unitsInput.addEventListener('input', () => {
      prod.units = parseInt(unitsInput.value) || 0;
      recalculateCosts();
    });
    tdUnits.appendChild(unitsInput);
    tr.appendChild(tdUnits);
    
    // Column 3: Unit FOB (USD)
    const tdUnitCost = document.createElement('td');
    const costInput = document.createElement('input');
    costInput.type = 'number';
    costInput.className = 'grid-input-number';
    costInput.value = prod.unit_cost;
    costInput.step = '0.01';
    costInput.addEventListener('input', () => {
      prod.unit_cost = parseFloat(costInput.value) || 0;
      recalculateCosts();
    });
    tdUnitCost.appendChild(costInput);
    tr.appendChild(tdUnitCost);
    
    // Output Columns (Calculated, read-only)
    // 4. FOB Total
    const tdFobTotal = document.createElement('td');
    tdFobTotal.id = `calc-fob-${idx}`;
    tdFobTotal.textContent = '$0.00';
    tr.appendChild(tdFobTotal);
    
    // 5. Flete Pror
    const tdFreight = document.createElement('td');
    tdFreight.id = `calc-freight-${idx}`;
    tdFreight.textContent = '$0.00';
    tr.appendChild(tdFreight);
    
    // 6. Seguro Pror
    const tdSeguro = document.createElement('td');
    tdSeguro.id = `calc-seguro-${idx}`;
    tdSeguro.textContent = '$0.00';
    tr.appendChild(tdSeguro);
    
    // 7. CIF Total
    const tdCif = document.createElement('td');
    tdCif.id = `calc-cif-${idx}`;
    tdCif.textContent = '$0.00';
    tr.appendChild(tdCif);
    
    // 8. IVA Importacion
    const tdIva = document.createElement('td');
    tdIva.id = `calc-iva-${idx}`;
    tdIva.textContent = '$0.00';
    tr.appendChild(tdIva);
    
    // 9. Gastos Locales
    const tdLocal = document.createElement('td');
    tdLocal.id = `calc-local-${idx}`;
    tdLocal.textContent = '$0.00';
    tr.appendChild(tdLocal);
    
    // 10. DAP Bruto USD
    const tdDapBruto = document.createElement('td');
    tdDapBruto.id = `calc-dap-bruto-${idx}`;
    tdDapBruto.textContent = '$0.00';
    tr.appendChild(tdDapBruto);
    
    // 11. DAP Bruto CLP
    const tdDapBrutoClp = document.createElement('td');
    tdDapBrutoClp.id = `calc-dap-bruto-clp-${idx}`;
    tdDapBrutoClp.textContent = '$0';
    tr.appendChild(tdDapBrutoClp);
    
    // 12. DAP Neto USD
    const tdDapNet = document.createElement('td');
    tdDapNet.id = `calc-dap-net-${idx}`;
    tdDapNet.className = 'col-highlight';
    tdDapNet.style.color = '#60a5fa';
    tdDapNet.style.background = 'rgba(59,130,246,0.02)';
    tdDapNet.textContent = '$0.00';
    tr.appendChild(tdDapNet);
    
    // 13. DAP Neto CLP
    const tdDapNetClp = document.createElement('td');
    tdDapNetClp.id = `calc-dap-net-clp-${idx}`;
    tdDapNetClp.className = 'col-highlight';
    tdDapNetClp.style.color = '#10b981';
    tdDapNetClp.style.background = 'rgba(16,185,129,0.02)';
    tdDapNetClp.textContent = '$0';
    tr.appendChild(tdDapNetClp);
    
    // 14. Unitario Neto CLP
    const tdUnitNetClp = document.createElement('td');
    tdUnitNetClp.id = `calc-unit-net-clp-${idx}`;
    tdUnitNetClp.className = 'col-highlight';
    tdUnitNetClp.style.color = '#fbbf24';
    tdUnitNetClp.style.background = 'rgba(245,158,11,0.02)';
    tdUnitNetClp.textContent = '$0';
    tr.appendChild(tdUnitNetClp);
    
    // 15. Venta Costo+19% CLP
    const tdVentaClp = document.createElement('td');
    tdVentaClp.id = `calc-venta-clp-${idx}`;
    tdVentaClp.className = 'col-highlight';
    tdVentaClp.style.color = '#a78bfa';
    tdVentaClp.style.background = 'rgba(167,139,250,0.02)';
    tdVentaClp.textContent = '$0';
    tr.appendChild(tdVentaClp);
    
    // Column 16: Action Delete
    const tdDel = document.createElement('td');
    tdDel.style.textAlign = 'center';
    const delBtn = document.createElement('button');
    delBtn.className = 'col-btn-del';
    delBtn.innerHTML = '🗑️';
    delBtn.title = 'Eliminar fila';
    delBtn.addEventListener('click', () => {
      products.splice(idx, 1);
      renderSpreadsheetBody();
      recalculateCosts();
    });
    tdDel.appendChild(delBtn);
    tr.appendChild(tdDel);
    
    spreadsheetTbody.appendChild(tr);
  });
}

function recalculateCosts() {
  const state = costState[currentCostMethod];
  
  let divisor = state.divisor;
  let totalFob = 0;
  
  if (state.auto_calc) {
    let sumUnits = 0;
    state.products.forEach(p => {
      sumUnits += p.units;
      totalFob += p.units * p.unit_cost;
    });
    
    divisor = sumUnits || 1;
    state.divisor = divisor;
    state.ref_exwork = totalFob;
    
    costDivisor.value = divisor;
    costRefExwork.value = totalFob.toFixed(2);
  } else {
    divisor = state.divisor || 1;
  }
  
  const totalServices = state.services.reduce((acc, s) => acc + s.value, 0);
  
  let sumUnits = 0;
  let sumFob = 0;
  let sumFreight = 0;
  let sumSeguro = 0;
  let sumCif = 0;
  let sumIva = 0;
  let sumLocal = 0;
  let sumDapBruto = 0;
  let sumDapBrutoClp = 0;
  let sumDapNet = 0;
  let sumDapNetClp = 0;
  
  state.products.forEach((p, idx) => {
    const fobTotal = p.units * p.unit_cost;
    const freightPror = (state.ref_freight / divisor) * p.units;
    const seguroPror = (state.ref_seguro / divisor) * p.units;
    const cifTotal = fobTotal + freightPror + seguroPror;
    
    const advalorem = 0;
    const customsValue = cifTotal + advalorem;
    const iva = customsValue * 0.19;
    
    const localPror = (totalServices / divisor) * p.units;
    
    const dapBruto = customsValue + iva + localPror;
    const dapBrutoClp = dapBruto * state.usd_clp;
    
    const dapNet = customsValue + localPror;
    const dapNetClp = dapNet * state.usd_clp;
    
    const unitNetClp = p.units > 0 ? Math.round(dapNetClp / p.units) : 0;
    const unitIvaVenta = unitNetClp * 0.19;
    const unitVentaClp = Math.round(unitNetClp + unitIvaVenta);
    
    // Update individual row cell texts
    const elFob = document.getElementById(`calc-fob-${idx}`);
    if (elFob) elFob.textContent = `$${fobTotal.toFixed(2)}`;
    
    const elFreight = document.getElementById(`calc-freight-${idx}`);
    if (elFreight) elFreight.textContent = `$${freightPror.toFixed(2)}`;
    
    const elSeguro = document.getElementById(`calc-seguro-${idx}`);
    if (elSeguro) elSeguro.textContent = `$${seguroPror.toFixed(2)}`;
    
    const elCif = document.getElementById(`calc-cif-${idx}`);
    if (elCif) elCif.textContent = `$${cifTotal.toFixed(2)}`;
    
    const elIva = document.getElementById(`calc-iva-${idx}`);
    if (elIva) elIva.textContent = `$${iva.toFixed(2)}`;
    
    const elLocal = document.getElementById(`calc-local-${idx}`);
    if (elLocal) elLocal.textContent = `$${localPror.toFixed(2)}`;
    
    const elDapBruto = document.getElementById(`calc-dap-bruto-${idx}`);
    if (elDapBruto) elDapBruto.textContent = `$${dapBruto.toFixed(2)}`;
    
    const elDapBrutoClp = document.getElementById(`calc-dap-bruto-clp-${idx}`);
    if (elDapBrutoClp) elDapBrutoClp.textContent = `$${Math.round(dapBrutoClp).toLocaleString('es-CL')}`;
    
    const elDapNet = document.getElementById(`calc-dap-net-${idx}`);
    if (elDapNet) elDapNet.textContent = `$${dapNet.toFixed(2)}`;
    
    const elDapNetClp = document.getElementById(`calc-dap-net-clp-${idx}`);
    if (elDapNetClp) elDapNetClp.textContent = `$${Math.round(dapNetClp).toLocaleString('es-CL')}`;
    
    const elUnitNet = document.getElementById(`calc-unit-net-clp-${idx}`);
    if (elUnitNet) elUnitNet.textContent = `$${unitNetClp.toLocaleString('es-CL')}`;
    
    const elVenta = document.getElementById(`calc-venta-clp-${idx}`);
    if (elVenta) elVenta.textContent = `$${unitVentaClp.toLocaleString('es-CL')}`;
    
    // Accumulate
    sumUnits += p.units;
    sumFob += fobTotal;
    sumFreight += freightPror;
    sumSeguro += seguroPror;
    sumCif += cifTotal;
    sumIva += iva;
    sumLocal += localPror;
    sumDapBruto += dapBruto;
    sumDapBrutoClp += dapBrutoClp;
    sumDapNet += dapNet;
    sumDapNetClp += dapNetClp;
  });
  
  // Update totals row
  totalRowUnits.textContent = sumUnits.toLocaleString('es-CL');
  totalRowFob.textContent = `$${sumFob.toFixed(2)}`;
  totalRowFreight.textContent = `$${sumFreight.toFixed(2)}`;
  totalRowSeguro.textContent = `$${sumSeguro.toFixed(2)}`;
  totalRowCif.textContent = `$${sumCif.toFixed(2)}`;
  totalRowIva.textContent = `$${sumIva.toFixed(2)}`;
  totalRowLocal.textContent = `$${sumLocal.toFixed(2)}`;
  totalRowDapBruto.textContent = `$${sumDapBruto.toFixed(2)}`;
  totalRowDapBrutoClp.textContent = `$${Math.round(sumDapBrutoClp).toLocaleString('es-CL')}`;
  totalRowDapNet.textContent = `$${sumDapNet.toFixed(2)}`;
  totalRowDapNetClp.textContent = `$${Math.round(sumDapNetClp).toLocaleString('es-CL')}`;
  
  const avgNetClp = sumUnits > 0 ? Math.round(sumDapNetClp / sumUnits) : 0;
  totalRowAvgNetClp.textContent = `$${avgNetClp.toLocaleString('es-CL')}`;
  
  const totalIvaVenta = sumDapNetClp * 0.19;
  const avgVentaClp = sumUnits > 0 ? Math.round((sumDapNetClp + totalIvaVenta) / sumUnits) : 0;
  totalRowAvgVentaClp.textContent = `$${avgVentaClp.toLocaleString('es-CL')}`;
  
  // Update overall metrics banner
  costStatTotalClp.textContent = `CLP $${Math.round(sumDapBrutoClp).toLocaleString('es-CL')}`;
  costStatTotalUnits.textContent = `${sumUnits.toLocaleString('es-CL')} u`;
  costStatTotalCif.textContent = `USD $${sumCif.toFixed(2)}`;
}

function exportToCsv() {
  const state = costState[currentCostMethod];
  let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Include BOM for Spanish accents in Excel
  
  // CSV Headers
  csvContent += "Producto,Unidades,Unit FOB (USD),FOB Total (USD),Flete Pror. (USD),Seguro Pror. (USD),CIF Total (USD),IVA Imp. (USD),Gasto Local (USD),DAP Bruto (USD),DAP Bruto (CLP),DAP Neto (USD),DAP Neto (CLP),Unitario Neto (CLP),Precio Venta Costo+19% (CLP)\n";
  
  const totalServices = state.services.reduce((acc, s) => acc + s.value, 0);
  const divisor = state.divisor || 1;
  
  state.products.forEach(p => {
    const fobTotal = p.units * p.unit_cost;
    const freightPror = (state.ref_freight / divisor) * p.units;
    const seguroPror = (state.ref_seguro / divisor) * p.units;
    const cifTotal = fobTotal + freightPror + seguroPror;
    const iva = cifTotal * 0.19;
    const localPror = (totalServices / divisor) * p.units;
    const dapBruto = cifTotal + iva + localPror;
    const dapBrutoClp = dapBruto * state.usd_clp;
    const dapNet = cifTotal + localPror;
    const dapNetClp = dapNet * state.usd_clp;
    const unitNetClp = p.units > 0 ? Math.round(dapNetClp / p.units) : 0;
    const unitVentaClp = Math.round(unitNetClp * 1.19);
    
    const row = [
      `"${p.name.replace(/"/g, '""')}"`,
      p.units,
      p.unit_cost.toFixed(2),
      fobTotal.toFixed(2),
      freightPror.toFixed(2),
      seguroPror.toFixed(2),
      cifTotal.toFixed(2),
      iva.toFixed(2),
      localPror.toFixed(2),
      dapBruto.toFixed(2),
      Math.round(dapBrutoClp),
      dapNet.toFixed(2),
      Math.round(dapNetClp),
      unitNetClp,
      unitVentaClp
    ];
    
    csvContent += row.join(",") + "\n";
  });
  
  // Download link trigger
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Planilla_Costos_${currentCostMethod}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function renderCostsTab() {
  renderLocalExpenses();
  renderSpreadsheetBody();
  recalculateCosts();
}

