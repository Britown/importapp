import { curatedData } from './data.js';
import { generateAnalysis } from './generator.js';

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

// Initialize Event Listeners
document.addEventListener('DOMContentLoaded', () => {
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
});

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
      <div class="score-badge">
        <span>${starsHtml}</span>
        <span>${p.score.toFixed(1)}</span>
      </div>
      <div class="product-img-wrapper">
        <img src="${p.thumbnail}" alt="${p.name}" class="product-img" loading="lazy">
        <span class="supplier-ribbon verified">✓ Verified Supplier</span>
      </div>
      <div class="product-content">
        <h4 class="product-title">${p.name}</h4>
        <div class="supplier-meta">
          <span>💼 Alibaba B2B</span>
          <span>📅 ${p.supplier_years} años activo</span>
        </div>
        
        <div class="badges-row">
          <span class="tag-badge ${p.competition_chile.toLowerCase()}">📊 Competencia: ${p.competition_chile}</span>
          <span class="tag-badge ${p.import_difficulty.toLowerCase()}">🚚 Importación: ${p.import_difficulty}</span>
        </div>

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
