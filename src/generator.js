// Intelligent fallback generator for dynamic search queries.
// It parses the search term and generates custom, commercially-logical B2B Alibaba evaluations
// tailored to Chilean customs (SEC, ISP, Subtel, SAG) and e-commerce realities.

export function generateAnalysis(query) {
  const q = query.toLowerCase().trim();
  const title = query.charAt(0).toUpperCase() + query.slice(1);
  
  // Categorize based on keywords
  let category = "general";
  if (/\b(battery|led|electric|smart|drone|camera|headset|wireless|massage|hair|chopper|plug|charger|speaker|watch|phone|light|lamp)\b/.test(q)) {
    category = "electronics";
  } else if (/\b(cream|shampoo|soap|makeup|skin|serum|vitamins|protein|supplement|cosmetic|oil|mask|gel)\b/.test(q)) {
    category = "cosmetics_health";
  } else if (/\b(food|cup|bottle|plate|lunch|kitchen|knife|chopper|pan|pot|silicone)\b/.test(q)) {
    category = "food_contact";
  } else if (/\b(wood|plant|flower|seeds|bamboo|pet|dog|cat|leather|wool)\b/.test(q)) {
    category = "agricultural";
  }

  const products = [];
  let summary = {};

  if (category === "electronics") {
    const isWireless = /\b(wireless|wifi|bluetooth|drone|remote)\b/.test(q);
    
    summary = {
      "best_opportunity": `${title} Inteligente USB-C`,
      "best_reason": `El modelo alimentado por USB-C evita la homologación obligatoria SEC en Chile (que aplica a enchufes de pared). Ofrece un margen superior al 60% y permite posicionamiento tecnológico moderno sin sobrecostos aduaneros.`,
      "safest_product": `${title} Versión Compacta USB`,
      "safest_reason": `Al ser compacto y recargable, su peso volumétrico mantiene el flete aéreo económico. No requiere certificaciones especiales en aduanas.`
    };

    products.push({
      id: "elec_premium",
      name: `${title} Pro Inteligente (Edición Premium)`,
      thumbnail: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop",
      alibaba_link: `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(query + ' pro')}`,
      supplier_verified: true,
      supplier_years: 7,
      unit_cost_usd: 16.80,
      estimated_resale_clp: 49990,
      estimated_margin_percent: 58,
      competition_chile: "Medium",
      import_difficulty: "Moderate",
      weight_kg: 1.2,
      volume_cbm: 0.003,
      selling_angle: `Dispositivo ${title} premium con pantalla digital inteligente y control de potencia avanzado.`,
      success_reason: "Excelente valor percibido y demanda estable de entusiastas tecnológicos en Chile.",
      risks: "Si el proveedor incluye cargador de 220V convencional en la caja, requerirá trámite y homologación ante la SEC chilena.",
      score: 4.1
    });

    products.push({
      id: "elec_usb",
      name: `${title} Compacto USB-C (Batería Integrada)`,
      thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop",
      alibaba_link: `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(query + ' mini usb')}`,
      supplier_verified: true,
      supplier_years: 5,
      unit_cost_usd: 6.20,
      estimated_resale_clp: 29990,
      estimated_margin_percent: 72,
      competition_chile: "Low",
      import_difficulty: "Easy",
      weight_kg: 0.45,
      volume_cbm: 0.001,
      selling_angle: `Modelo de viaje ultra-portátil recargable vía USB-C. Sin cables molestos.`,
      success_reason: "Cumple las reglas ideales de importación: liviano, sin barrera SEC, margen alto y precio de venta ideal (CLP $29.990).",
      risks: "Las baterías de litio de alta densidad a veces sufren restricciones en flete aéreo rápido (requieren declaración MSDS).",
      score: 4.7
    });

    products.push({
      id: "elec_basic",
      name: `${title} Standard de Red Eléctrica (220V AC)`,
      thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop",
      alibaba_link: `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(query + ' 220v')}`,
      supplier_verified: true,
      supplier_years: 4,
      unit_cost_usd: 12.00,
      estimated_resale_clp: 34990,
      estimated_margin_percent: 32,
      competition_chile: "High",
      import_difficulty: "Difficult",
      weight_kg: 1.6,
      volume_cbm: 0.005,
      selling_angle: `Dispositivo tradicional para uso continuo en el hogar conectado directamente a la corriente.`,
      success_reason: "Fácil de vender en retail tradicional, pero con poco valor añadido.",
      risks: "**HOMOLOGACIÓN SEC CRÍTICA:** Al tener enchufe directo de 220V, aduanas exige certificación oficial. Vender sin sello SEC expone al negocio a multas graves.",
      score: 2.8
    });

  } else if (category === "cosmetics_health") {
    summary = {
      "best_opportunity": `${title} de Base Botánica Natural (Fórmula Orgánica)`,
      "best_reason": `El mercado de belleza y cuidado personal en Chile prefiere productos orgánicos con empaques premium. A pesar de la alta exigencia regulatoria, sus márgenes superan el 75%.`,
      "safest_product": `Ninguno (Riesgo Sanitario Alto)`,
      "safest_reason": `Los productos de aplicación cutánea o ingesta requieren registro del ISP (Instituto de Salud Pública). El riesgo de retención y destrucción en aduana es altísimo para principiantes.`
    };

    products.push({
      id: "cosm_premium",
      name: `${title} Suave Hidratante (Fórmula Vegana)`,
      thumbnail: "https://images.unsplash.com/photo-1608248597481-496100c80836?w=600&auto=format&fit=crop",
      alibaba_link: `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(query + ' organic vegan')}`,
      supplier_verified: true,
      supplier_years: 6,
      unit_cost_usd: 2.50,
      estimated_resale_clp: 19990,
      estimated_margin_percent: 82,
      competition_chile: "Low",
      import_difficulty: "Difficult",
      weight_kg: 0.2,
      volume_cbm: 0.0003,
      selling_angle: "Cuidado de la piel de rápida absorción con ingredientes certificados de origen vegetal.",
      "success_reason": "Baja competencia en Chile para marcas independientes importadas de forma formal con registro sanitario.",
      risks: "**EXIGENCIA ISP OBLIGATORIA:** Requiere habilitación de bodega cosmética autorizada por el ISP y análisis de laboratorio local.",
      score: 3.5
    });

    products.push({
      id: "cosm_set",
      name: `Kit de Aplicadores y Accesorios para ${title}`,
      thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop",
      alibaba_link: `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(query + ' tools accessories')}`,
      supplier_verified: true,
      supplier_years: 5,
      unit_cost_usd: 3.80,
      estimated_resale_clp: 24990,
      estimated_margin_percent: 78,
      competition_chile: "Medium",
      import_difficulty: "Easy",
      weight_kg: 0.35,
      volume_cbm: 0.0008,
      selling_angle: `Conjunto ergonómico de pinceles, aplicadores y organizadores profesionales para ${title}.`,
      "success_reason": "Al ser accesorios de aplicación (y no la fórmula líquida/polvo en sí), **NO requiere registro ISP**. Excelente alternativa de importación fácil.",
      "risks": "La competencia en diseño y calidad visual es intensa. Requiere un empaque vistoso para justificar el precio.",
      score: 4.6
    });

    products.push({
      id: "cosm_basic",
      name: `${title} Corporal Nutritivo (Sourcing Estándar)`,
      thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop",
      alibaba_link: `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(query + ' mass market')}`,
      supplier_verified: true,
      supplier_years: 4,
      unit_cost_usd: 1.20,
      estimated_resale_clp: 8990,
      estimated_margin_percent: 30,
      competition_chile: "High",
      import_difficulty: "Difficult",
      weight_kg: 0.25,
      volume_cbm: 0.0004,
      selling_angle: `Formulación masiva para uso regular y familiar.`,
      "success_reason": "Bajo costo unitario en Alibaba, pero difícil competir contra marcas establecidas de supermercado (Nivea, Dove, etc.).",
      "risks": "Alto riesgo de ser bloqueado por SEREMI de Salud o ISP en internación aduanera si se importa de forma simplificada por Courier.",
      score: 2.1
    });

  } else if (category === "food_contact") {
    summary = {
      "best_opportunity": `${title} de Silicona de Grado Alimentario (Plegable)`,
      "best_reason": `El nicho de cocina en Chile valora mucho el diseño moderno y el ahorro de espacio. Al ser de silicona platino, es fácil obtener la certificación libre de BPA y su peso ligero abarata el flete.`,
      "safest_product": `${title} Organizador o Utensilio Seco`,
      "safest_reason": `Los productos que no tocan directamente alimentos húmedos o calientes tienen menor escrutinio de Seremi de Salud en aduanas.`
    };

    products.push({
      id: "food_silicone",
      name: `${title} de Silicona Premium (BPA-Free / Plegable)`,
      thumbnail: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop",
      alibaba_link: `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(query + ' silicone bpa free')}`,
      supplier_verified: true,
      supplier_years: 8,
      unit_cost_usd: 2.80,
      estimated_resale_clp: 18990,
      estimated_margin_percent: 79,
      competition_chile: "Low",
      import_difficulty: "Easy",
      weight_kg: 0.2,
      volume_cbm: 0.0004,
      selling_angle: `Utensilio de cocina premium de silicona platino, resistente al calor hasta 220°C y libre de BPA.`,
      "success_reason": "Alta demanda hogareña y de repostería. Los proveedores serios de Alibaba te proveen el certificado FDA de inmediato.",
      risks: "En aduana chilena, la Seremi de Salud podría fiscalizar al azar para constatar que el plástico cumple la norma sanitaria de inocuidad.",
      score: 4.8
    });

    products.push({
      id: "food_electric",
      name: `${title} Eléctrico Recargable USB (Express)`,
      thumbnail: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&auto=format&fit=crop",
      alibaba_link: `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(query + ' electric usb')}`,
      supplier_verified: true,
      supplier_years: 5,
      unit_cost_usd: 6.90,
      estimated_resale_clp: 29990,
      estimated_margin_percent: 63,
      competition_chile: "Medium",
      import_difficulty: "Easy",
      weight_kg: 0.5,
      volume_cbm: 0.0015,
      selling_angle: `Dispositivo recargable inalámbrico para facilitar la preparación culinaria.`,
      "success_reason": "Valor percibido alto debido a la automatización de tareas en la cocina. Carga USB evita la SEC.",
      "risks": "La mezcla de electrónica con agua en el lavado aumenta las tasas de falla. Requiere manual en español.",
      score: 4.3
    });

    products.push({
      id: "food_steel",
      name: `${title} Metálico Tradicional (Acero Inoxidable)`,
      thumbnail: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop",
      alibaba_link: `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(query + ' stainless steel')}`,
      supplier_verified: true,
      supplier_years: 9,
      unit_cost_usd: 4.50,
      estimated_resale_clp: 16990,
      estimated_margin_percent: 45,
      competition_chile: "High",
      import_difficulty: "Easy",
      weight_kg: 0.8,
      volume_cbm: 0.002,
      selling_angle: `Estructura clásica de acero inoxidable quirúrgico ultra resistente.`,
      "success_reason": "Duradero y confiable, pero con fuerte competencia local de marcas grandes de retail (Tramontina, Magefesa).",
      "risks": "El peso del acero aumenta el costo del flete marítimo consolidado por kilogramo, reduciendo el margen real.",
      score: 3.5
    });

  } else if (category === "agricultural") {
    summary = {
      "best_opportunity": `${title} Ergonómico / Diseño Textil Premium`,
      "best_reason": `Al orientarse a la comodidad o diseño premium de mascotas u hogar, se esquivan las regulaciones agrícolas duras. Excelente nicho de compra emocional.`,
      "safest_product": `${title} en base a Polímeros Sintéticos`,
      "safest_reason": `Las fibras plásticas y metales procesados evitan las inspecciones de aduana biológica (SAG), a diferencia de la madera cruda o el cuero vegetal.`
    };

    products.push({
      id: "agri_processed",
      name: `${title} Premium de Fibra Sintética Reforzada`,
      thumbnail: "https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?w=600&auto=format&fit=crop",
      alibaba_link: `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(query + ' premium oxford plastic')}`,
      supplier_verified: true,
      supplier_years: 6,
      unit_cost_usd: 4.80,
      estimated_resale_clp: 24990,
      estimated_margin_percent: 72,
      competition_chile: "Medium",
      import_difficulty: "Easy",
      weight_kg: 0.5,
      volume_cbm: 0.0018,
      selling_angle: `Diseño ergonómico lavable confeccionado con poliéster Oxford de alta densidad.`,
      "success_reason": "Al ser 100% sintético, **NO requiere inspección del SAG**. Ideal para venta masiva en Mercado Libre.",
      "risks": "Muchos competidores informales de baja gama. Necesitas destacar las costuras reforzadas y cierres premium.",
      score: 4.5
    });

    products.push({
      id: "agri_wood",
      name: `${title} Rústico de Madera de Bamboo Natural`,
      thumbnail: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=600&auto=format&fit=crop",
      alibaba_link: `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(query + ' bamboo wooden')}`,
      supplier_verified: true,
      supplier_years: 7,
      unit_cost_usd: 5.20,
      estimated_resale_clp: 29990,
      estimated_margin_percent: 65,
      competition_chile: "Low",
      import_difficulty: "Moderate",
      weight_kg: 0.9,
      volume_cbm: 0.0035,
      selling_angle: `Estructura ecológica de bamboo procesado, antibacterial y biodegradable.`,
      "success_reason": "Excelente estética verde muy valorada por el consumidor milenial en Chile.",
      "risks": "**ALERTA SAG:** Productos que incorporen madera o fibras vegetales sin tratar pueden ser retenidos por el SAG para certificar la ausencia de plagas.",
      score: 4.0
    });

    products.push({
      id: "agri_basic",
      name: `${title} Standard Económico (Importación Masiva)`,
      thumbnail: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop",
      alibaba_link: `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(query + ' basic')}`,
      supplier_verified: true,
      supplier_years: 3,
      unit_cost_usd: 1.90,
      estimated_resale_clp: 9990,
      estimated_margin_percent: 54,
      competition_chile: "High",
      import_difficulty: "Easy",
      weight_kg: 0.25,
      volume_cbm: 0.0006,
      selling_angle: `Modelo clásico y funcional para tareas básicas diarias.`,
      "success_reason": "Costo bajísimo, pero difícil de diferenciar ante la competencia en ferias y persas locales.",
      "risks": "La calidad de los materiales plásticos puede degradarse rápidamente bajo el sol, aumentando reclamos post-venta.",
      score: 3.4
    });

  } else {
    // General / Textile / Non-electronic physical products
    summary = {
      "best_opportunity": `${title} de Diseño Ergonómico / Organizador`,
      "best_reason": `Los productos de uso diario o almacenamiento que no tienen baterías, madera cruda o contacto directo húmedo con alimentos, son de internación express. El éxito comercial radica en resolver la desorganización hogareña o laboral.`,
      "safest_product": `${title} Clásico de Poliéster / Plástico Rígido`,
      "safest_reason": `Producto físico simple sin ninguna restricción regulatoria chilena (no requiere SEC, ISP, SAG, ni Subtel). Excelente para importar vía Courier express en cajas pequeñas.`
    };

    products.push({
      id: "gen_premium",
      name: `${title} Modular Organizador (Edición Reforzada)`,
      thumbnail: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop",
      alibaba_link: `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(query + ' organizer organizer premium')}`,
      supplier_verified: true,
      supplier_years: 6,
      unit_cost_usd: 5.80,
      estimated_resale_clp: 29990,
      estimated_margin_percent: 71,
      competition_chile: "Low",
      import_difficulty: "Easy",
      weight_kg: 0.6,
      volume_cbm: 0.002,
      selling_angle: `Estructura inteligente para maximizar espacios y ordenar ${title} de forma modular.`,
      "success_reason": "Tendencia en crecimiento por espacios más reducidos en departamentos chilenos.",
      "risks": "Fácilmente imitable por grandes importadoras de plástico si el producto escala en ventas.",
      score: 4.6
    });

    products.push({
      id: "gen_compact",
      name: `${title} Ultra-Compacto de Viaje`,
      thumbnail: "https://images.unsplash.com/photo-1527786419736-22bf135e69bf?w=600&auto=format&fit=crop",
      alibaba_link: `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(query + ' travel compact')}`,
      supplier_verified: true,
      supplier_years: 5,
      unit_cost_usd: 2.20,
      estimated_resale_clp: 14990,
      estimated_margin_percent: 81,
      competition_chile: "Medium",
      import_difficulty: "Easy",
      weight_kg: 0.22,
      volume_cbm: 0.0006,
      selling_angle: `Versión plegable ultra-liviana diseñada para llevar cómodamente de viaje o en la mochila.`,
      "success_reason": "Excelente como producto de compra cruzada u obsequio. Flete unitario prácticamente despreciable.",
      "risks": "Margen total en pesos es más bajo por el bajo precio final; se necesita vender en combos o packs de 2 o 3 unidades.",
      score: 4.8
    });

    products.push({
      id: "gen_standard",
      name: `${title} Clásico de Lona / Acrílico`,
      thumbnail: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop",
      alibaba_link: `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(query + ' basic acrylic classic')}`,
      supplier_verified: true,
      supplier_years: 4,
      unit_cost_usd: 4.10,
      estimated_resale_clp: 19990,
      estimated_margin_percent: 54,
      competition_chile: "High",
      import_difficulty: "Easy",
      weight_kg: 0.8,
      volume_cbm: 0.003,
      selling_angle: `Modelo tradicional ideal para reposición y almacenamiento estándar.`,
      "success_reason": "Mercado estable de oficinas y hogares, aunque saturado de importaciones chinas de bajo costo en el barrio Meiggs y retail.",
      "risks": "Competencia agresiva por precio. Rentabilidad ajustada tras costos logísticos de volumen.",
      score: 3.5
    });
  }

  return {
    title,
    summary,
    products
  };
}
