/**
 * Contenido pedagógico riguroso para Módulo 1 (Aprende desde Cero)
 */

export interface LessonTopic {
  id: string;
  title: string;
  category: string;
  description: string;
  keyTakeaways: string[];
  exampleContent: {
    title: string;
    description: string;
    data?: any;
  };
}

export const EDUCATIONAL_LESSONS: LessonTopic[] = [
  {
    id: 'intro-confusion-matrix',
    title: '1. ¿Qué es una Matriz de Confusión y para qué sirve?',
    category: 'Fundamentos',
    description:
      'Una matriz de confusión es una tabla estructurada de contingencia que enfrenta los valores reales observados en el mundo frente a las predicciones emitidas por un modelo de Machine Learning.',
    keyTakeaways: [
      'No resume el rendimiento en un solo número engañoso, sino que desglosa detalladamente dónde acierta y dónde se equivoca el modelo.',
      'Permite distinguir entre diferentes tipos de errores (decir "sí" cuando era "no" vs. decir "no" cuando era "sí").',
      'Constituye la base matemática absoluta de la que derivan métricas como Precisión, Recall, F1, Curvas ROC y MCC.',
    ],
    exampleContent: {
      title: 'Convención estándar adoptada',
      description:
        'En la literatura moderna de ciencia de datos (scikit-learn, Fawcett, Bishop):\n• Las Filas representan la Clase Real o Verdadera del fenómeno.\n• Las Columnas representan la Clase Predicha por el algoritmo.\n• La diagonal principal (arriba-izq y abajo-der) agrupa las predicciones correctas (aciertos).',
    },
  },
  {
    id: 'quadrants-meaning',
    title: '2. Anatomía de los 4 Cuadrantes: TP, TN, FP y FN',
    category: 'Anatomía',
    description:
      'Cada celda de una matriz binaria 2×2 representa una combinación entre la realidad y la hipótesis del clasificador.',
    keyTakeaways: [
      'Verdadero Positivo (TP / VP): El evento ocurrió en la realidad y el modelo lo detectó correctamente (ej. Paciente enfermo clasificado como enfermo).',
      'Verdadero Negativo (TN / VN): El evento no ocurrió y el modelo dictaminó correctamente que no ocurría (ej. Paciente sano clasificado como sano).',
      'Falso Positivo (FP) - Error Tipo I: El modelo dio una falsa alarma; predijo positivo pero la realidad era negativa (ej. Paciente sano alertado erróneamente como enfermo).',
      'Falso Negativo (FN) - Error Tipo II: El modelo fue ciego al evento; predijo negativo cuando en realidad era positivo (ej. Paciente enfermo clasificado como sano y enviado a casa).',
    ],
    exampleContent: {
      title: 'Mnemotecnia visual de aciertos vs errores',
      description:
        'Verdadero/Falso indica si el modelo ACERTÓ o FALLÓ en su predicción.\nPositivo/Negativo indica la ETIQUETA que el modelo emitió.',
    },
  },
  {
    id: 'accuracy-paradox',
    title: '3. La Paradoja de la Exactitud (Accuracy Paradox)',
    category: 'Peligros Estadísticos',
    description:
      'La exactitud (Accuracy) es la métrica más intuitiva pero también la más peligrosa en ciencia de datos cuando existe un fuerte desbalance de clases.',
    keyTakeaways: [
      'Si el 99% de las transacciones son legítimas y solo el 1% es fraude, un modelo "tonto" que prediga SIEMPRE legítimo obtendrá 99% de exactitud.',
      'A pesar del 99% de exactitud, el modelo detectó CERO fraudes (Recall = 0%), siendo completamente inútil para la seguridad financiera.',
      'Nunca confíes en un modelo de clasificación evaluado únicamente por su exactitud sin inspeccionar antes la distribución de clases y el F1/Recall.',
    ],
    exampleContent: {
      title: 'Demostración con 10,000 muestras',
      description:
        'Realidad: 9,900 sanos y 100 enfermos.\nModelo ingenuo (predice siempre sano): TP=0, TN=9,900, FP=0, FN=100.\nExactitud = 99.0%, Sensibilidad/Recall = 0.0%, F1 = 0.0%.',
    },
  },
  {
    id: 'decision-threshold',
    title: '4. El Umbral de Decisión (Classification Threshold)',
    category: 'Ajuste de Modelos',
    description:
      'Los modelos de clasificación comúnmente no predicen directamente 0 o 1, sino una probabilidad continua P(Positivo | Datos). Para convertir esa probabilidad en una decisión binaria, se requiere un umbral τ (por defecto 0.50).',
    keyTakeaways: [
      'Si bajamos el umbral (ej. τ = 0.20): El modelo se vuelve más sensible y alarmista. Captura más positivos reales (aumenta el Recall), pero a costa de generar más falsas alarmas (baja la Precisión).',
      'Si subimos el umbral (ej. τ = 0.80): El modelo se vuelve muy conservador. Solo alerta cuando está extremadamente seguro. La Precisión se dispara, pero deja escapar casos positivos reales (cae el Recall).',
      'No existe un umbral "mágico": el umbral óptimo siempre depende del costo del Falso Positivo versus el costo del Falso Negativo.',
    ],
    exampleContent: {
      title: 'El compromiso inevitable (Trade-off)',
      description:
        'Subir Recall casi siempre penaliza Precisión, y viceversa. La curva Precision-Recall y la curva ROC trazan este comportamiento para cada valor de umbral entre 0.0 y 1.0.',
    },
  },
  {
    id: 'business-vs-model',
    title: '5. Perspectiva del Modelo vs. Perspectiva del Negocio',
    category: 'Aplicación Práctica',
    description:
      'Para un algoritmo, un error numérico es simétrico. Para una empresa o una institución médica, los errores tienen costos radicalmente dispares.',
    keyTakeaways: [
      'En medicina oncológica, un Falso Negativo (enviar a casa a alguien con cáncer) es potencialmente mortal. El Falso Positivo (una biopsia confirmatoria innecesaria) genera ansiedad y costo, pero salva vidas.',
      'En ciberseguridad o bloqueo de cuentas, un Falso Positivo (bloquear a un cliente VIP en plena compra) genera rabia y pérdida de clientes.',
      'Diseñar un sistema de ML requiere dialogar con los responsables del negocio para definir la matriz de costos y beneficios antes de elegir la métrica objetivo.',
    ],
    exampleContent: {
      title: 'Ecuación de Valor Neto del Negocio',
      description:
        'Valor = (TP × Beneficio_TP) + (TN × Beneficio_TN) - (FP × Costo_FP) - (FN × Costo_FN).\nEl modelo con mayor F1 no siempre es el que genera mayor valor neto.',
    },
  },
];
