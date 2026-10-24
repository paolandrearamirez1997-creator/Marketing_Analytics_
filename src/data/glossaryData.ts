/**
 * Glosario Estadístico, Preguntas Frecuentes y Bibliografía Primaria
 */

import { GlossaryItem } from '../types';

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    term: 'Matriz de Confusión (Confusion Matrix)',
    definition:
      'Tabla de contingencia que enfrenta las etiquetas verdaderas de una muestra contra las predicciones producidas por un modelo clasificador. Permite visualizar detalladamente aciertos y desglosar errores por categoría.',
    relatedTerms: ['TP', 'TN', 'FP', 'FN', 'Exactitud'],
    reference: 'scikit-learn Documentation & Fawcett (2006)',
  },
  {
    term: 'Verdadero Positivo (TP - True Positive)',
    definition:
      'Resultado en el que el clasificador predice correctamente la clase positiva cuando la realidad pertenecía a dicha clase.',
    formula: 'TP ∈ ℕ₀',
    relatedTerms: ['Recall', 'Precisión', 'Sensibilidad'],
    reference: 'Powers (2011)',
  },
  {
    term: 'Verdadero Negativo (TN - True Negative)',
    definition:
      'Resultado en el que el clasificador predice correctamente la clase negativa cuando la realidad correspondía a dicha clase.',
    formula: 'TN ∈ ℕ₀',
    relatedTerms: ['Especificidad', 'FPR', 'Accuracy'],
    reference: 'Powers (2011)',
  },
  {
    term: 'Falso Positivo (FP - False Positive / Error Tipo I)',
    definition:
      'Alarma espuria. El modelo clasifica la muestra como positiva, pero en realidad correspondía a la clase negativa.',
    formula: 'FP ∈ ℕ₀',
    relatedTerms: ['FPR', 'Precisión', 'Error Tipo I'],
    reference: 'Bishop (2006), Pattern Recognition and Machine Learning',
  },
  {
    term: 'Falso Negativo (FN - False Negative / Error Tipo II)',
    definition:
      'Omisión o ceguera del modelo. El fenómeno positivo ocurrió en la realidad, pero el modelo dictaminó erróneamente negativo.',
    formula: 'FN ∈ ℕ₀',
    relatedTerms: ['FNR', 'Recall', 'Sensibilidad', 'Error Tipo II'],
    reference: 'Bishop (2006)',
  },
  {
    term: 'Exactitud (Accuracy)',
    definition:
      'Fracción total de predicciones que el modelo acertó sobre el total de muestras evaluadas.',
    formula: 'Accuracy = (TP + TN) / (TP + TN + FP + FN)',
    relatedTerms: ['Balanced Accuracy', 'Paradoja de la Exactitud'],
    reference: 'Google Developers Machine Learning Crash Course',
  },
  {
    term: 'Precisión (Precision / Positive Predictive Value - PPV)',
    definition:
      'De todas las instancias clasificadas como positivas por el modelo, ¿qué porcentaje es verdaderamente positivo?',
    formula: 'Precision = TP / (TP + FP)',
    relatedTerms: ['F1-Score', 'Falsos Positivos'],
    reference: 'scikit-learn user guide',
  },
  {
    term: 'Sensibilidad / Recall (True Positive Rate - TPR)',
    definition:
      'De todas las instancias positivas existentes en la realidad, ¿qué porcentaje fue detectado con éxito por el modelo?',
    formula: 'Recall = TP / (TP + FN)',
    relatedTerms: ['Sensibilidad', 'FNR', 'Curva ROC'],
    reference: 'Powers (2011)',
  },
  {
    term: 'Especificidad (Specificity / True Negative Rate - TNR)',
    definition:
      'Proporción de instancias negativas reales que fueron clasificadas adecuadamente como negativas.',
    formula: 'Especificidad = TN / (TN + FP)',
    relatedTerms: ['FPR', 'Balanced Accuracy'],
    reference: 'Fawcett (2006)',
  },
  {
    term: 'Puntaje F1 (F1-Score)',
    definition:
      'Media armónica entre precisión y recall. Penaliza los valores extremos, asegurando que un modelo no infle su calificación sacrificando completamente una de las dos métricas.',
    formula: 'F1 = 2 × (Precision × Recall) / (Precision + Recall)',
    relatedTerms: ['F-Beta', 'Precision', 'Recall'],
    reference: 'Powers (2011)',
  },
  {
    term: 'Puntaje F-Beta (F-β Score)',
    definition:
      'Generalización del F1 que permite asignar un peso relativo β a la importancia del Recall respecto a la Precisión. Si β = 2, el recall pesa el doble que la precisión; si β = 0.5, la precisión pesa el doble.',
    formula: 'F_β = (1 + β²) × (Precision × Recall) / (β² × Precision + Recall)',
    relatedTerms: ['F1-Score', 'Recall', 'Precisión'],
    reference: 'scikit-learn classification_report',
  },
  {
    term: 'Coeficiente de Correlación de Matthews (MCC)',
    definition:
      'Métrica de correlación para clasificación binaria que utiliza simultáneamente los cuatro cuadrantes de la matriz. Varía entre -1 (desacuerdo total), 0 (equivalente al azar) y +1 (predicción perfecta). Permanece robusta incluso con distribuciones sumamente desbalanceadas.',
    formula: 'MCC = (TP×TN - FP×FN) / √((TP+FP)(TP+FN)(TN+FP)(TN+FN))',
    relatedTerms: ['F1-Score', 'Desbalance de Clases'],
    reference: 'Powers (2011); Chicco & Jurman (2020)',
  },
  {
    term: 'Paradoja de la Exactitud (Accuracy Paradox)',
    definition:
      'Fenómeno contraintuitivo por el cual un clasificador predictivo con alta exactitud (ej. 99%) puede ser absolutamente inoperante si se enfrenta a un desbalance masivo de clases, simplemente prediciendo la clase dominante.',
    relatedTerms: ['Desbalance', 'Recall', 'MCC'],
    reference: 'Géron (2022), Hands-On Machine Learning',
  },
  {
    term: 'Umbral de Clasificación (Decision Threshold - τ)',
    definition:
      'Punto de corte probabilístico a partir del cual un clasificador asigna la etiqueta positiva (ŷ = 1 si P(y=1|X) ≥ τ). Modificar este parámetro permite navegar el compromiso entre precisión y recall.',
    formula: 'ŷ = 1  si  P(Y=1|X) ≥ τ,  0  en caso contrario',
    relatedTerms: ['Curva ROC', 'Trade-off Precision-Recall'],
    reference: 'Fawcett (2006), ROC Analysis',
  },
];

export const FAQ_ITEMS = [
  {
    q: '¿Cuándo debo priorizar la Precisión por encima del Recall?',
    a: 'Debes priorizar la Precisión cuando el costo o la molestia de un Falso Positivo (falsa alarma) es muy elevado. Ejemplos clásicos: filtros de Spam (no quieres que un correo de tu jefe vaya a la basura), sugerencias automáticas de compra en comercio electrónico o bloqueos automáticos de cuentas de clientes.',
  },
  {
    q: '¿Cuándo debo priorizar el Recall por encima de la Precisión?',
    a: 'Debes priorizar el Recall cuando el costo de omitir un positivo real (Falso Negativo) es catastrófico o irreversible. Ejemplos: detección de células cancerígenas, detección de fallas en trenes o aviones de pasajeros, y detección de fraude bancario de alto monto.',
  },
  {
    q: '¿Por qué el F1-Score usa la media armónica y no la media aritmética simple?',
    a: 'Porque la media aritmética promedia linealmente los valores: si un modelo tiene Precision = 1.0 (100%) y Recall = 0.0 (0%), su media aritmética sería 0.50 (50%), sugiriendo falsamente un modelo "a mitad de camino". La media armónica penaliza drásticamente la cercanía al cero, arrojando F1 = 0.0 para un modelo ciego.',
  },
  {
    q: '¿Qué hago si mi conjunto de datos tiene un desbalance de 99 a 1?',
    a: 'Evita reportar Accuracy como criterio de éxito. Utiliza métricas inmunes al desbalance como Balanced Accuracy, F1-Score sobre la clase minoritaria, Curva PR (Precision-Recall AUC) y el Coeficiente de Matthews (MCC). Asimismo, ajusta el umbral de decisión τ según la asimetría de costos del negocio.',
  },
  {
    q: '¿Cómo elijo el umbral de corte τ en un problema empresarial?',
    a: 'No te limites al 0.50 por defecto. Construye una matriz de costos y beneficios monetarios con los líderes del área: asígnales valor a FP ($_FP) y FN ($_FN). Evalúa el beneficio neto total generado para una rejilla de umbrales entre 0.05 y 0.95 y selecciona aquel que maximice el valor económico esperado.',
  },
];

export const BIBLIOGRAPHY_REFERENCES = [
  {
    author: 'scikit-learn Developers',
    title: 'Model Evaluation: Quantifying the Quality of Predictions',
    source: 'scikit-learn official documentation (v1.5+)',
    topics: 'confusion_matrix, balanced_accuracy_score, matthews_corrcoef, precision_recall_fscore_support',
  },
  {
    author: 'Google Developers',
    title: 'Machine Learning Crash Course: Classification, Precision, Recall, and Thresholds',
    source: 'Google for Developers Education Guide',
    topics: 'Accuracy Paradox, Decision Thresholds, Multi-class Confusion Matrices',
  },
  {
    author: 'Christopher M. Bishop',
    title: 'Pattern Recognition and Machine Learning',
    source: 'Springer (2006), Chapter 1 & 4',
    topics: 'Decision Theory, Loss Functions, Minimizing Expected Loss in Classification',
  },
  {
    author: 'David M. W. Powers',
    title: 'Evaluation: From Precision, Recall and F-Measure to ROC, Informedness, Markedness & Correlation',
    source: 'Journal of Machine Learning Technologies, 2(1), 37-63 (2011)',
    topics: 'Mathematical properties of MCC, Geometric vs Harmonic means, Boundary condition indeterminacies',
  },
  {
    author: 'Tom Fawcett',
    title: 'An Introduction to ROC Analysis',
    source: 'Pattern Recognition Letters, 27(8), 861-874 (2006)',
    topics: 'ROC spaces, threshold trade-offs, cost-sensitive classification',
  },
  {
    author: 'Aurélien Géron',
    title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow (3rd Edition)',
    source: "O'Reilly Media (2022), Chapter 3: Classification",
    topics: 'Precision/Recall Tradeoff, F1 limitations, Multilabel & Multiclass performance',
  },
  {
    author: 'Trevor Hastie, Robert Tibshirani, Jerome Friedman',
    title: 'The Elements of Statistical Learning: Data Mining, Inference, and Prediction',
    source: 'Springer Series in Statistics (2nd Edition, 2009)',
    topics: 'Statistical Foundations of Loss Matrices, Risk Minimization, Cross-Entropy',
  },
  {
    author: 'Andreas C. Müller & Sarah Guido',
    title: 'Introduction to Machine Learning with Python',
    source: "O'Reilly Media (2016), Chapter 5: Model Evaluation and Improvement",
    topics: 'Evaluation Metrics for Imbalanced Classes, Confusion Matrices in Practice',
  },
];
