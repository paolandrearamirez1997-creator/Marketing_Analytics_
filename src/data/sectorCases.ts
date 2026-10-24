/**
 * Casos Prácticos Sectoriales con Matrices de Confusión, Costos y Ejercicios
 */

import { SectorCase } from '../types';

export const SECTOR_CASES: SectorCase[] = [
  {
    id: 'finanzas-fraude',
    sector: 'Finanzas',
    title: 'Detección de Fraude en Transacciones con Tarjetas',
    subtitle: 'Banca Digital y Pasarelas de Pago',
    context:
      'Un banco procesa 50,000 transacciones diarias. El fraude representa el 0.8% de las operaciones (400 transacciones fraudulentas). El banco implementó un modelo de Gradient Boosting para clasificar transacciones sospechosas.',
    positiveClassLabel: 'Transacción Fraudulenta (Fraude)',
    negativeClassLabel: 'Transacción Legítima (Normal)',
    initialMatrix: {
      tp: 340,
      fn: 60,
      fp: 950,
      tn: 48650,
    },
    costConfig: {
      costFP: 15, // Costo de atención de soporte al cliente y fricción comercial
      costFN: 450, // Pérdida promedio no recuperable por fraude consumado
      benefitTP: 450, // Dinero salvado por detección temprana
      benefitTN: 0,
    },
    fpConsequence:
      'Un falso positivo bloquea temporalmente la tarjeta de un cliente legítimo. Provoca fricción, llamadas al centro de soporte y posible abandono del cliente a favor de otro banco si ocurre repetidamente.',
    fnConsequence:
      'Un falso negativo permite que una transacción fraudulenta se ejecute con éxito. El banco asume la pérdida monetaria directa bajo la política de protección contra fraude al usuario, además de incurrir en multas de la red emisora.',
    resolvedInsight:
      'A pesar de que el modelo comete 950 falsos positivos, la prevención de 340 fraudes (Recall = 85.0%) salva $153,000 en pérdidas directas frente a un costo operativo de $14,250 en fricción de FP. El balance neto es sumamente favorable para la institución.',
    recommendedDecision:
      'Mantener un umbral de decisión agresivo que priorice el Recall (Sensibilidad). Implementar verificación en dos pasos (SMS/Push en app móvil) en lugar de bloqueo automático directo para reducir el impacto del FP a menos de $3 por evento.',
    exercise: {
      question:
        'Si el banco decide subir el umbral de clasificación para reducir drásticamente las quejas de clientes legítimos por tarjetas bloqueadas (reduciendo FP a 200 pero aumentando FN a 180), ¿qué métrica se ve severamente castigada y cuál es la consecuencia de negocio?',
      options: [
        {
          text: 'Se castiga la Precisión, aumentando los costos de atención al cliente.',
          isCorrect: false,
          feedback: 'Incorrecto. Al reducir los falsos positivos, la precisión en realidad aumenta, no disminuye.',
        },
        {
          text: 'Se castiga el Recall (Sensibilidad), dejando escapar 120 fraudes adicionales que le costarán $54,000 extra al banco.',
          isCorrect: true,
          feedback:
            '¡Correcto! Al subir el umbral, el modelo deja escapar más fraudes reales (el Recall baja del 85% al 55%). El costo de esos fraudes no detectados ($54,000) supera con creces el ahorro en soporte.',
        },
        {
          text: 'Se castiga la Especificidad, afectando a las transacciones de bajo valor.',
          isCorrect: false,
          feedback: 'Incorrecto. La especificidad en realidad sube porque hay menos falsas alarmas sobre legítimos.',
        },
      ],
      targetMetric: 'Recall (Sensibilidad)',
    },
  },
  {
    id: 'salud-oncologia',
    sector: 'Salud',
    title: 'Tamizaje y Triaje de Nódulos Pulmonares',
    subtitle: 'Detección Temprana Asistida por IA',
    context:
      'Un centro de radiología utiliza un modelo convolucional para analizar 2,000 tomografías computarizadas anuales. La prevalencia de nódulos malignos en la población de riesgo atendida es del 5% (100 casos malignos).',
    positiveClassLabel: 'Lesión Maligna (Cáncer)',
    negativeClassLabel: 'Tejido Benigno / Sano',
    initialMatrix: {
      tp: 94,
      fn: 6,
      fp: 180,
      tn: 1720,
    },
    costConfig: {
      costFP: 250, // Costo psicológico y estudio confirmatorio no invasivo
      costFN: 15000, // Diagnóstico tardío, metástasis y pérdida potencial de expectativa de vida
      benefitTP: 15000,
      benefitTN: 0,
    },
    fpConsequence:
      'Un falso positivo clasifica un nódulo benigno como sospechoso de malignidad. El paciente sufre estrés emocional y debe someterse a una tomografía de contraste de seguimiento o biopsia.',
    fnConsequence:
      'Un falso negativo clasifica un tumor maligno activo como tejido sano. El paciente es enviado a su casa sin tratamiento oportuno; el cáncer progresa durante meses hasta presentar síntomas graves con pronóstico reservado.',
    resolvedInsight:
      'El modelo logra un Recall del 94.0% con un F1 de 0.502. Aunque la precisión es aparentemente baja (34.3%), en medicina diagnóstica de tamizaje este comportamiento es clínico y éticamente deseable: se prefiere evaluar 180 pacientes sanos con estudios secundarios antes que permitir que 6 tumores pasen desapercibidos.',
    recommendedDecision:
      'Utilizar el modelo exclusivamente como herramienta de soporte al radiólogo (Second Reader). Los 6 casos de FN deben ser minimizados explorando un umbral de decisión más permisivo o combinando con factores de riesgo clínico del historial del paciente.',
    disclaimer:
      'AVISO EDUCATIVO: Este caso es una simulación estrictamente pedagógica para ilustrar el compromiso entre sensibilidad y especificidad en analítica de datos. No constituye una recomendación médica ni sustituye el criterio diagnóstico de un profesional de la salud certificado.',
    exercise: {
      question:
        'Un directivo del hospital propone rechazar el modelo porque "su precisión es solo del 34.3% y falla dos de cada tres veces que da una alerta". ¿Cuál es el argumento técnico y clínico correcto para refutar su objeción?',
      options: [
        {
          text: 'En tamizaje preventivo, la prioridad médica absoluta es maximizar el Recall para no perder vidas; una precisión moderada es un costo éticamente aceptable para capturar el 94% de tumores.',
          isCorrect: true,
          feedback:
            '¡Exacto! En pruebas de cribado o tamizaje, el costo de un falso negativo es infinitamente mayor que el de un falso positivo. La precisión baja es consecuencia directa de la baja prevalencia (5%) y no de una falla del clasificador.',
        },
        {
          text: 'El directivo tiene razón; ningún modelo con precisión menor al 80% debe utilizarse en un entorno hospitalario.',
          isCorrect: false,
          feedback: 'Falso. Si exigiéramos 80% de precisión en enfermedades raras, el umbral se volvería tan estricto que dejaría escapar a la mayoría de los enfermos reales.',
        },
        {
          text: 'La precisión del 34.3% se debe a que la matriz no fue normalizada por columnas.',
          isCorrect: false,
          feedback: 'Falso. La normalización es solo una forma de visualización; no altera la métrica matemática subyacente.',
        },
      ],
      targetMetric: 'Precision vs Recall en Salud',
    },
  },
  {
    id: 'telecom-churn',
    sector: 'Telecomunicaciones',
    title: 'Predicción de Abandono de Clientes (Churn)',
    subtitle: 'Fidelización y Campañas de Retención',
    context:
      'Una compañía de telecomunicaciones con 10,000 clientes corporativos registra una tasa histórica de abandono del 12% trimestral (1,200 clientes en riesgo de migrar a la competencia). Se evalúa un modelo de retención para ofrecer descuentos y equipos gratis.',
    positiveClassLabel: 'Cliente en Fuga (Churn = Sí)',
    negativeClassLabel: 'Cliente Fiel (Permanece = No)',
    initialMatrix: {
      tp: 820,
      fn: 380,
      fp: 650,
      tn: 8150,
    },
    costConfig: {
      costFP: 60, // Costo del subsidio o descuento ofrecido a un cliente que no pensaba irse
      costFN: 400, // Margen de contribución neto perdido por el cliente que se marcha
      benefitTP: 340, // $400 recuperados menos $60 de incentivo
      benefitTN: 0,
    },
    fpConsequence:
      'Un falso positivo otorga una promoción comercial con descuento a un cliente fiel que no tenía ninguna intención de marcharse. Representa canibalización de margen y gasto publicitario superfluo.',
    fnConsequence:
      'Un falso negativo ignora a un cliente insatisfecho que cancela su suscripción al término del mes. Se pierde su ciclo de vida de cliente (LTV) y capturar un reemplazo en el mercado cuesta 5 veces más.',
    resolvedInsight:
      'El modelo logra un Recall del 68.3% y una Precisión del 55.8%. El beneficio neto acumulado por rescatar a 820 clientes ($278,800) supera holgadamente el costo de los 650 descuentos innecesarios ($39,000).',
    recommendedDecision:
      'Segmentar las acciones de retención según el puntaje de probabilidad: a probabilidades muy altas (>0.80) ofrecer retención premium con ejecutivo de cuenta; a probabilidades moderadas (0.50-0.79) ofrecer incentivos no monetarios como mejoras de velocidad de datos sin reducir la tarifa.',
    exercise: {
      question:
        'Si el departamento de finanzas recorta el presupuesto y el costo de incentivo sube a $180 por cliente contactado, ¿qué ajuste técnico debe hacerse sobre el clasificador?',
      options: [
        {
          text: 'Elevar el umbral de decisión para aumentar la Precisión y reducir la cantidad de Falsos Positivos, dirigiendo los incentivos solo a los clientes con mayor certidumbre de fuga.',
          isCorrect: true,
          feedback:
            '¡Brillante! Al encarecerse el costo del Falso Positivo (el incentivo cuesta más), la regla de decisión óptima exige elevar el umbral, aumentando la precisión para evitar desperdiciar presupuesto en clientes estables.',
        },
        {
          text: 'Bajar el umbral de decisión para asegurar un Recall del 100%.',
          isCorrect: false,
          feedback: 'Incorrecto. Si bajas el umbral, aumentan los falsos positivos y el presupuesto se agotará rápidamente en subsidios innecesarios.',
        },
        {
          text: 'Cambiar a una métrica de Balanced Accuracy sin modificar el clasificador.',
          isCorrect: false,
          feedback: 'Incorrecto. Cambiar la métrica que miras no altera las predicciones ni los costos reales de la campaña.',
        },
      ],
      targetMetric: 'Umbral y Costo Asimétrico',
    },
  },
  {
    id: 'comercio-leads',
    sector: 'Comercio',
    title: 'Calificación de Prospectos Comerciales (Lead Scoring B2B)',
    subtitle: 'Ventas Consultivas de Alto Valor',
    context:
      'Una empresa de software empresarial genera 4,000 registros de contacto mensuales. El equipo comercial solo dispone de tiempo para atender 800 llamadas en profundidad. La tasa real de conversión histórica es del 15% (600 leads calificados).',
    positiveClassLabel: 'Lead Calificado (Comprará)',
    negativeClassLabel: 'Lead No Calificado (Curioso)',
    initialMatrix: {
      tp: 420,
      fn: 180,
      fp: 310,
      tn: 3090,
    },
    costConfig: {
      costFP: 80, // Horas hombre de un ejecutivo comercial persiguiendo un lead sin interés
      costFN: 1200, // Comisión y valor de contrato perdido
      benefitTP: 2500, // Margen de cierre
      benefitTN: 0,
    },
    fpConsequence:
      'Un falso positivo asigna un vendedor senior a un prospecto sin presupuesto ni autoridad de compra. Genera frustración en el equipo de ventas y satura el pipeline.',
    fnConsequence:
      'Un falso negativo archiva a una empresa interesada en la bandeja de correos automatizados fríos, permitiendo que la competencia los contacte primero y cierre el negocio.',
    resolvedInsight:
      'El clasificador presenta una Precisión de 57.5% y un Recall de 70.0%. El equipo comercial solo atiende 730 prospectos (420 TP + 310 FP), perfectamente dentro de su capacidad operativa de 800 llamadas mensuales.',
    recommendedDecision:
      'Configurar un sistema F-beta con β = 0.8 para dar una leve ventaja a la Precisión y asegurar que los vendedores no se desgasten en prospectos no calificados, manteniendo la saturación de agenda por debajo del 85%.',
    exercise: {
      question:
        '¿Por qué el F-beta score con β = 0.5 es más apropiado que el F1 estándar en este contexto de ventas?',
      options: [
        {
          text: 'Porque el tiempo de los vendedores es escaso y costoso, por lo que se prioriza la Precisión para que cada llamada tenga alta probabilidad de éxito.',
          isCorrect: true,
          feedback:
            '¡Exacto! El F0.5 pondera la precisión con el doble de peso que el recall, ideal cuando la capacidad operativa es limitada y el costo de una falsa alarma es alto.',
        },
        {
          text: 'Porque el F-beta con β=0.5 penaliza a la clase mayoritaria.',
          isCorrect: false,
          feedback: 'Incorrecto. La beta pondera la importancia entre precisión y recall; no afecta directamente la proporción de clases.',
        },
        {
          text: 'Porque garantiza que el MCC sea exactamente 1.0.',
          isCorrect: false,
          feedback: 'Falso. El MCC y el F-beta son métricas independientes con fundamentos algebraicos diferentes.',
        },
      ],
      targetMetric: 'F-Beta Score (β = 0.5)',
    },
  },
  {
    id: 'manufactura-calidad',
    sector: 'Manufactura',
    title: 'Inspección Óptica de Microfisuras en Palas de Turbinas',
    subtitle: 'Industria Aeroespacial y Generación Térmica',
    context:
      'Una planta de fundición produce 5,000 componentes de alta resistencia mecánicos por lote. La tasa de defectos de microfisura es del 2% (100 componentes defectuosos). Se implementa visión artificial con luz ultravioleta.',
    positiveClassLabel: 'Pieza Defectuosa (Descarte / Retrabajo)',
    negativeClassLabel: 'Pieza Conforme (Aprobada para Ensamble)',
    initialMatrix: {
      tp: 98,
      fn: 2,
      fp: 75,
      tn: 4825,
    },
    costConfig: {
      costFP: 120, // Costo de inspección manual secundaria con ultrasonido
      costFN: 80000, // Falla catastrófica de turbina en servicio, garantía y riesgo civil
      benefitTP: 80000,
      benefitTN: 0,
    },
    fpConsequence:
      'Una pieza en perfecto estado es retenida para reinspección manual y ensayo destructivo o ultrasónico. Genera un retraso temporal y costo de $120.',
    fnConsequence:
      'Una pieza agrietada se despacha a la línea de ensamblaje final. Puede fracturarse en vuelo o en operación a 12,000 RPM, causando una falla motriz catastrófica.',
    resolvedInsight:
      'Con un Recall del 98.0%, el sistema detecta 98 de cada 100 defectos. Sin embargo, los 2 falsos negativos son inaceptables en estándares de aeronáutica civil (Six Sigma / Cero Defectos).',
    recommendedDecision:
      'Reducir aún más el umbral de decisión hasta que el Recall sea del 100% (FN = 0), asumiendo el aumento de falsos positivos como un costo de seguro operativo necesario.',
    exercise: {
      question:
        'En componentes de misión crítica aeroespacial, ¿qué métrica debe vigilarse como tolerancia cero antes de certificar el lote para despacho?',
      options: [
        {
          text: 'La Tasa de Falsos Negativos (FNR / Miss Rate), que debe ser estrictamente 0% para impedir que una pieza agrietada llegue a un motor en vuelo.',
          isCorrect: true,
          feedback:
            '¡Correcto! En seguridad crítica (aeroespacial, nuclear, médica), un FNR > 0 implica riesgo catastrófico. No se puede admitir ni un solo falso negativo.',
        },
        {
          text: 'La Exactitud (Accuracy), que debe superar el 99.9%.',
          isCorrect: false,
          feedback: 'Engañoso. Un modelo con 98% de exactitud en este caso podría tener un FNR del 100% si ignora todas las piezas defectuosas.',
        },
        {
          text: 'La Tasa de Falsos Positivos (FPR), para evitar gastos de ultrasonido.',
          isCorrect: false,
          feedback: 'Peligroso. Cuidar el presupuesto de ultrasonido sacrificando vidas o piezas críticas es una falla grave de gobernanza de riesgos.',
        },
      ],
      targetMetric: 'Tasa de Falsos Negativos (FNR)',
    },
  },
  {
    id: 'rrhh-rotacion',
    sector: 'Recursos Humanos',
    title: 'Simulación Educativa de Predicción de Deserción y Rotación Laboral',
    subtitle: 'Analítica de Personas (People Analytics)',
    context:
      'Un departamento de People Analytics modela la probabilidad de que empleados clave renuncien en los próximos 6 meses dentro de una plantilla de 3,000 colaboradores. Se identifican 300 renuncias proyectadas (10%).',
    positiveClassLabel: 'Empleado en Riesgo de Renuncia',
    negativeClassLabel: 'Empleado Estable / Satisfecho',
    initialMatrix: {
      tp: 210,
      fn: 90,
      fp: 320,
      tn: 2380,
    },
    costConfig: {
      costFP: 50, // Costo de conversación de carrera y tiempo de gestión
      costFN: 4500, // Reclutamiento, curva de aprendizaje y pérdida de conocimiento clave
      benefitTP: 3500,
      benefitTN: 0,
    },
    fpConsequence:
      'El modelo predice falsamente que un empleado leal planea marcharse. Si el liderazgo actúa con sesgo, podría excluirlo preventivamente de proyectos estratégicos o asignarle roles de menor impacto, creando una profecía autocumplida.',
    fnConsequence:
      'Un empleado clave renuncia sin que la organización haya tenido señales de alerta ni oportunidad de negociar una contraoferta oportuna.',
    resolvedInsight:
      'El modelo logra un Recall del 70.0% y una Precisión de 39.6%. Sin embargo, en RRHH el mayor peligro no es cuantitativo sino ético y legal: los falsos positivos pueden desencadenar discriminación laboral involuntaria.',
    recommendedDecision:
      'Prohibir el uso de predicciones individuales directas para decisiones de despido o retención. Utilizar el modelo de forma agregada a nivel de departamentos para detectar líderes tóxicos, falta de equidad salarial o sobrecarga de trabajo.',
    disclaimer:
      'CONSIDERACIÓN ÉTICA Y LEGAL: El uso de modelos de predicción de personas en recursos humanos conlleva serios riesgos de sesgo algorítmico, vulneración de privacidad y discriminación protegida por normativas como GDPR y directivas de IA de la UE. Los modelos deben ser auditables y complementados con retroalimentación humana transparente.',
    exercise: {
      question:
        '¿Cuál es el mayor riesgo no financiero de un clasificador de rotación con alta tasa de falsos positivos en una empresa?',
      options: [
        {
          text: 'Que los directivos desarrollen sesgo hacia los colaboradores alertados como "en fuga", reduciendo sus oportunidades de ascenso y provocando inadvertidamente su renuncia.',
          isCorrect: true,
          feedback:
            '¡Excelente reflexión! Este fenómeno se conoce como profecía autocumplida inducida por el algoritmo. La analítica de personas exige una gobernanza ética estricta para evitar estigmatizar a trabajadores inocuos.',
        },
        {
          text: 'Que el cálculo del F1-Score arroje un valor superior a 0.85.',
          isCorrect: false,
          feedback: 'Irrelevante. El valor numérico del F1 no causa problemas éticos por sí mismo.',
        },
        {
          text: 'Que el servidor de base de datos se sature por cálculos de matrices de correlación.',
          isCorrect: false,
          feedback: 'Incorrecto. El riesgo principal radica en las personas y en la equidad laboral.',
        },
      ],
      targetMetric: 'Gobernanza Ética de Modelos',
    },
  },
];
