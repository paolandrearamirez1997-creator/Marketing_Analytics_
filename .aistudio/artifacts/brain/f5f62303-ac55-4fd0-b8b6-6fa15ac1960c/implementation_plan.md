# MatrizLab - Plataforma Interactiva y Gamificada de Matrices de Confusión

Plataforma educativa y analítica de alto rigor técnico diseñada para enseñar a interpretar matrices de confusión, evaluar el desempeño de modelos de clasificación y tomar decisiones de negocio fundamentadas mediante simulaciones dinámicas, casos sectoriales reales y gamificación progresiva.

---

> [!IMPORTANT]
> **Aprobación de Fase 1 (Definición Funcional y Alcance):**
> Este documento formaliza la **Fase 1**. Define la arquitectura general, el mapa de módulos, el alcance del MVP, los flujos de usuario y las bases metodológicas y estadísticas según la literatura técnica (scikit-learn, Bishop, Fawcett, Powers).
> Al aprobar este plan, avanzaremos a la **Fase 2 (Diseño de Experiencia y Prototipado Visual)** y **Fase 3 (Desarrollo Funcional Completo)**.

---

## 1. Visión General y Alcance del MVP

### 1.1 Objetivo del Producto
Transformar un concepto crucial y frecuentemente malinterpretado de la ciencia de datos (la matriz de confusión y sus métricas derivadas) en una experiencia de aprendizaje interactiva, visualmente clara y con impacto directo en la toma de decisiones empresariales, mitigando errores comunes como la paradoja de la exactitud (*Accuracy Paradox*) o la ignorancia del costo asimétrico de los errores.

### 1.2 Perfiles de Usuario y Recorridos Clave (User Journeys)
1. **Iniciante / Estudiante de ML o Estadística**:
   - *Objetivo*: Comprender qué es TP, TN, FP, FN y por qué la exactitud falla en datos desbalanceados.
   - *Recorrido*: Guía conceptual del Módulo 1 $\to$ Explorador de 2x2 en tiempo real $\to$ Retos formativos para ganar la primera insignia ("Descubridor de Sesgos").
2. **Científico de Datos / Analista de Modelos**:
   - *Objetivo*: Analizar curvas de umbral, comparar modelos A vs B, calcular MCC y F-beta, y diagnosticar datos propios mediante CSV.
   - *Recorrido*: Laboratorio con dataset propio o simulador de umbrales $\to$ Ajuste de $\beta$ en F-beta $\to$ Comparativa de trade-offs Precision vs Recall.
3. **Líder de Negocio / Profesional de Riesgos / Finanzas / Salud**:
   - *Objetivo*: Evaluar el costo financiero y humano de los falsos positivos frente a los falsos negativos en su industria.
   - *Recorrido*: Biblioteca de Casos Prácticos Sectoriales $\to$ Simulación de costos/beneficios $\to$ Reto de decisión ejecutiva con justificación.

---

## 2. Mapa de Navegación y Estructura Modular

La plataforma se organiza en una navegación lateral unificada con 9 módulos interactivos:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          MATRIZLAB - ARQUITECTURA GENERAL                       │
└─────────────────────────────────────────────────────────────────────────────────┘
                                         │
    ┌────────────────┬───────────────────┼───────────────────┬────────────────┐
    │                │                   │                   │                │
┌───▼────────┐ ┌─────▼──────────┐ ┌──────▼───────────┐ ┌─────▼──────────┐ ┌───▼────────────┐
│ M1: Aprende│ │ M2: Explorador │ │ M3: Calculadora  │ │ M4: Simulador  │ │ M5: Casos      │
│ Desde Cero │ │ Interactivo    │ │ de Métricas      │ │ de Decisiones  │ │ Sectoriales    │
│ - Fundam.  │ │ - 2x2 dinámico │ │ - 11 métricas    │ │ - Modelo A vs B│ │ - Finanzas     │
│ - Paradoja │ │ - Normalizac.  │ │ - Fórmulas paso a│ │ - Umbrales     │ │ - Salud/Telco  │
│ - Umbrales │ │ - Diagnóstico  │ │   paso & límites │ │ - Matriz coste │ │ - Retail/Manuf │
└───┬────────┘ └─────┬──────────┘ └──────┬───────────┘ └─────┬──────────┘ └─────┬──────────┘
    │                │                   │                   │                  │
    └────────────────┴───────────────────┼───────────────────┴──────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
              ┌─────▼──────────┐   ┌─────▼──────────┐   ┌─────▼──────────┐
              │ M6: Laboratorio│   │ M7: Gamificación│  │ M8/M9: Progreso│
              │ Datos Propios  │   │ y Desafíos     │   │ & Glosario     │
              │ - Carga CSV    │   │ - XP, Insignias│   │ - Certificado  │
              │ - Multiclase   │   │ - Quiz & Casos │   │ - Citas scikit/│
              │ - Filtro clase │   │ - Misiones     │   │   Fawcett/Bish │
              └────────────────┘   └────────────────┘   └────────────────┘
```

### Detalle de Módulos:
- **Módulo 1: Aprende desde Cero**: Glosario visual, anatomía de la matriz (Real vs Predicho), diagramas interactivos para TP/TN/FP/FN, la paradoja de la exactitud con ejemplos numéricos claros y el papel fundamental del umbral de decisión.
- **Módulo 2: Explorador Interactivo 2×2**: Sliders numéricos y campos directos con validaciones estrictas ($n \ge 0$, no NaN, alertas de denominadores nulos). Selector de normalización: Absoluta, Por Fila (Recall de clase), Por Columna (Precision de clase) y Total. Interpretación automática contextual.
- **Módulo 3: Calculadora de 11 Métricas de Clasificación**:
  1. *Accuracy*
  2. *Precision (PPV)*
  3. *Recall / Sensibilidad (TPR)*
  4. *Especificidad (TNR)*
  5. *F1-Score*
  6. *Falsos Positivos (FPR)*
  7. *Falsos Negativos (FNR)*
  8. *Valor Predictivo Negativo (NPV)*
  9. *Balanced Accuracy*
  10. *F-Beta Score* (con control interactivo de $\beta$)
  11. *Matthews Correlation Coefficient (MCC)*.
  *Tratamiento de indeterminaciones*: Detección rigurosa de división por cero con explicaciones conceptuales según recomendaciones de scikit-learn.
- **Módulo 4: Simulador de Decisiones & Trade-offs**:
  - Comparador A/B: Visualización lado a lado de dos modelos con matriz de costos configurable ($\text{Costo Total} = FP \times C_{FP} + FN \times C_{FN} + TP \times G_{TP} + TN \times G_{TN}$).
  - Explorador dinámico de umbral sobre un conjunto de datos calibrado con probabilidades reales.
- **Módulo 5: Biblioteca de Casos Prácticos Sectoriales**:
  - Finanzas: Detección de fraude (costo FN crítico) vs Mora crediticia.
  - Telecomunicaciones: Abandono de clientes (Churn) y saturación comercial.
  - Salud: Triaje preventivo oncológico (FN inaceptable vs biopsias invasivas).
  - Comercio & Marketing: Conversión de leads B2B y campañas de alta fidelidad.
  - Manufactura: Inspección de fallas críticas en componentes mecánicos.
  - Recursos Humanos: Predicción ética de rotación (análisis de sesgo y privacidad).
  *Cada sector incluye caso resuelto y ejercicio interactivo evaluado*.
- **Módulo 6: Laboratorio con Datos Propios (CSV/Excel)**:
  - Carga segura en memoria del navegador (privacidad total, sin subir datos a servidores).
  - Selector dinámico de columnas (Real, Predicción, Probabilidad opcional).
  - Selector explícito de clase positiva (no asume "1" por defecto).
  - Matriz multiclase $N \times N$ automática con métricas Macro, Micro y Weighted.
  - Exportación de reporte de diagnóstico.
- **Módulo 7: Gamificación & Retos**:
  - 4 Niveles de maestría: Principiante $\to$ Explorador $\to$ Analista de Riesgos $\to$ Experto en Evaluación.
  - Sistema de XP (puntos de experiencia), rachas y 8 insignias descriptivas.
  - Desafío final integrador con evaluación justificativa y generación de constancia de finalización interactiva.
- **Módulo 8: Panel de Progreso & Analytics de Aprendizaje**:
  - Radar de competencias (Comprensión conceptual, Cálculo de métricas, Análisis de costos, Manejo de desbalance).
  - Registro de errores frecuentes y recomendaciones personalizadas de repaso.
  - Persistencia segura en `localStorage` con opción de exportar/importar progreso.
- **Módulo 9: Glosario Técnico & Fuentes**:
  - Citas formales a scikit-learn, Bishop (2006), Powers (2011), Fawcett (2006) y referencias metodológicas a Müller, Géron y Hastie.

---

## 3. Decisiones Tecnológicas y Arquitectura

```
┌────────────────────────────────────────────────────────────────────────┐
│                        STACK TÉCNICO Y ARQUITECTURA                    │
├────────────────────────────────────────────────────────────────────────┤
│ • UI Framework:       React 19 + TypeScript (Strict Mode)              │
│ • Estilos & Layout:   Tailwind CSS (Zero-Pill, tipografía editorial,   │
│                       paleta neutra 60-30-10 para entorno educativo)  │
│ • Componentes Iconos: Lucide React (semánticos, sin adornos vanos)     │
│ • Animaciones:        Motion (transiciones fluidas <= 200ms)           │
│ • Motor Estadístico:  Módulo matemático desacoplado y 100% puro        │
│                       (/src/utils/metrics.ts) probado con casos patrón │
│ • Procesador CSV:     Parser local con soporte de encoding UTF-8,      │
│                       detección de tipos y tolerancia a nulos          │
│ • Persistencia:       Local State + LocalStorage sincronizado          │
│ • Responsividad:      Desktop amplio (1440px) y móviles (>40px targets)│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Criterios de Aceptación para la Fase 1

- [x] Arquitectura modular y funcional delimitada para los 9 módulos.
- [x] Rigor estadístico formal con las 11 métricas y gestión de casos extremos documentada.
- [x] Especificación de biblioteca sectorial con 6 industrias clave y análisis de asimetría de costos.
- [x] Motor matemático desacoplado de la vista para verificación formal.
- [x] Esquema de gamificación formativa y pedagógica centrado en el razonamiento crítico.

---

## 5. Próximos Pasos (Fase 2 y Fase 3)
Una vez aprobada esta definición funcional:
1. **Fase 2**: Estructura de pantallas, sistema de diseño visual, codificación dual (color + texto accesible) y navegación.
2. **Fase 3**: Implementación del motor estadístico, visualizaciones interactivas de matrices, simulador de costos, laboratorio CSV y sistema de gamificación con persistencia local.
