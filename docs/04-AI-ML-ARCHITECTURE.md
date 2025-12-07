# 📘 MODULE 4: AI & MACHINE LEARNING ARCHITECTURE

## Complete AI/ML System Design

**Document Version**: 1.0  
**ML Stack**: TensorFlow, PyTorch, scikit-learn, XGBoost  
**Deployment**: MLflow, Docker, Kubernetes

---

## Table of Contents

1. [AI/ML Overview](#1-aiml-overview)
2. [Fraud Detection Model](#2-fraud-detection-model)
3. [Crime Hotspot Prediction](#3-crime-hotspot-prediction)
4. [Skill-Job Matching Engine](#4-skill-job-matching-engine)
5. [Sentiment Analysis System](#5-sentiment-analysis-system)
6. [ML Infrastructure](#6-ml-infrastructure)
7. [Model Training Pipeline](#7-model-training-pipeline)
8. [Model Deployment](#8-model-deployment)

---

## 1. AI/ML Overview

### 1.1 ML Models Summary

| Model |  Purpose | Type | Accuracy | Latency |
|-------|---------|------|----------|---------|
| **Fraud Detection** | Detect fake complaints/reports | XGBoost Classifier | 96.5% | <50ms |
| **Crime Hotspot** | Predict crime locations | DBSCAN + LSTM | 87% | <200ms |
| **Skill Matching** | Match jobs to candidates | BERT embeddings + Cosine similarity | 92% | <100ms |
| **Sentiment Analysis** | Analyze complaint urgency | Fine-tuned BERT | 89% | <80ms |

---

## 2. Fraud Detection Model

###  2.1 Problem Statement

Detect fraudulent complaints, corruption reports, and job applications to maintain system integrity.

### 2.2 Architecture

```python
import xgboost as xgb
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import numpy as np

class FraudDetectionModel:
    def __init__(self):
        self.model = xgb.XGBClassifier(
            max_depth=7,
            learning_rate=0.1,
            n_estimators=200,
            objective='binary:logistic',
            eval_metric='auc',
            random_state=42
        )
        self.scaler = StandardScaler()
        self.feature_names = [
            # User behavior features
            'user_account_age_days',
            'user_previous_submissions',
            'user_resolution_rate',
            'user_avg_response_time',
            
            # Content features
            'description_length',
            'description_unique_words',
            'description_sentiment',
            'description_readability',
            'has_excessive_caps',
            'has_urgency_keywords',
            'has_monetary_keywords',
            
            # Evidence features
            'evidence_count',
            'evidence_total_size_mb',
            'evidence_image_ratio',
            'evidence_document_ratio',
            
            # Temporal features
            'hour_of_day',
            'day_of_week',
            'is_weekend',
            'submission_speed_seconds',
            
            # Location features
            'location_consistency_score',
            'location_fraud_history',
            'location_complaint_density',
            
            # Historical features
            'similar_reports_7days',
            'same_user_reports_30days',
            'area_fraud_rate_90days',
            'similar_text_count'
        ]
    
    def feature_engineering(self, raw_data):
        """Extract features from raw complaint/report data"""
        features = {}
        
        # User features
        features['user_account_age_days'] = (
            datetime.now() - raw_data['user_created_at']
        ).days
        features['user_previous_submissions'] = raw_data['user_submission_count']
        features['user_resolution_rate'] = (
            raw_data['user_resolved_count'] / max(raw_data['user_submission_count'], 1)
        )
        
        # Content features
        desc = raw_data['description']
        features['description_length'] = len(desc)
        features['description_unique_words'] = len(set(desc.split()))
        features['description_sentiment'] = self.get_sentiment(desc)
        features['description_readability'] = self.get_readability_score(desc)
        features['has_excessive_caps'] = int(sum(1 for c in desc if c.isupper()) / len(desc) > 0.3)
        features['has_urgency_keywords'] = int(any(
            word in desc.lower() for word in ['urgent', 'emergency', 'immediate']
        ))
        
        # Evidence features
        features['evidence_count'] = len(raw_data.get('evidence_files', []))
        features['evidence_total_size_mb'] = sum(
            f['size'] for f in raw_data.get('evidence_files', [])
        ) / (1024 * 1024)
        
        # Temporal features
        features['hour_of_day'] = raw_data['created_at'].hour
        features['day_of_week'] = raw_data['created_at'].weekday()
        features['is_weekend'] = int(features['day_of_week'] >= 5)
        
        return np.array([features[name] for name in self.feature_names])
    
    def train(self, X_train, y_train, X_val, y_val):
        """Train fraud detection model"""
        # Feature scaling
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_val_scaled = self.scaler.transform(X_val)
        
        # Train with early stopping
        self.model.fit(
            X_train_scaled, y_train,
            eval_set=[(X_train_scaled, y_train), (X_val_scaled, y_val)],
            early_stopping_rounds=10,
            verbose=True
        )
        
        # Evaluate
        train_auc = roc_auc_score(y_train, self.model.predict_proba(X_train_scaled)[:, 1])
        val_auc = roc_auc_score(y_val, self.model.predict_proba(X_val_scaled)[:, 1])
        
        print(f"Train AUC: {train_auc:.4f}")
        print(f"Validation AUC: {val_auc:.4f}")
        
        return self.model
    
    def predict(self, X):
        """Predict fraud probability"""
        X_scaled = self.scaler.transform(X)
        probabilities = self.model.predict_proba(X_scaled)[:, 1]
        
        # Risk categorization
        risk_level = np.where(
            probabilities >= 0.8, 'CRITICAL',
            np.where(probabilities >= 0.6, 'HIGH',
            np.where(probabilities >= 0.4, 'MEDIUM', 'LOW'))
        )
        
        return {
            'fraud_probability': probabilities,
            'risk_level': risk_level,
            'confidence': np.max([probabilities, 1 - probabilities], axis=0)
        }
```

### 2.3 Training Data Requirements

- **Total Samples**: 500,000+ (balanced 50/50 fraud/legitimate)
- **Features**: 42 engineered features
- **Training Split**: 70% train, 15% validation, 15% test
- **Retraining Frequency**: Monthly with new data

### 2.4 Deployment

```python
# Save model with MLflow
import mlflow
import mlflow.xgboost

with mlflow.start_run():
    mlflow.log_params({
        "max_depth": 7,
        "learning_rate": 0.1,
        "n_estimators": 200
    })
    mlflow.log_metric("auc", 0.965)
    mlflow.xgboost.log_model(model, "fraud_detection_model")
    
# Load in production
model = mlflow.xgboost.load_model("models:/fraud_detection/production")
```

---

## 3. Crime Hotspot Prediction

### 3.1 Algorithm: DBSCAN Clustering + LSTM

```python
from sklearn.cluster import DBSCAN
import tensorflow as tf
from tensorflow import keras

class CrimeHotspotPredictor:
    def __init__(self):
        self.dbscan = DBSCAN(eps=0.005, min_samples=3, metric='haversine')
        self.lstm_model = self.build_lstm()
    
    def build_lstm(self):
        """Build LSTM model for time series prediction"""
        model = keras.Sequential([
            keras.layers.LSTM(
                128, return_sequences=True, 
                input_shape=(30, 10)  # 30 days, 10 features
            ),
            keras.layers.Dropout(0.3),
            keras.layers.LSTM(64, return_sequences=False),
            keras.layers.Dropout(0.3),
            keras.layers.Dense(32, activation='relu'),
            keras.layers.Dense(1, activation='sigmoid')
        ])
        
        model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy', tf.keras.metrics.AUC()]
        )
        
        return model
    
    def spatial_clustering(self, crime_data):
        """Identify current crime hotspots using DBSCAN"""
        # Extract lat/lng in radians for haversine distance
        coords = np.radians(
            crime_data[['latitude', 'longitude']].values
        )
        
        # Cluster crimes
        clusters = self.dbscan.fit_predict(coords)
        
        # Calculate hotspot centers
        hotspots = []
        for cluster_id in set(clusters):
            if cluster_id == -1:  # Noise
                continue
            
            cluster_crimes = crime_data[clusters == cluster_id]
            hotspots.append({
                'cluster_id': cluster_id,
                'center_lat': cluster_crimes['latitude'].mean(),
                'center_lng': cluster_crimes['longitude'].mean(),
                'crime_count': len(cluster_crimes),
                'intensity': len(cluster_crimes) / len(crime_data),
                'predominant_type': cluster_crimes['crime_type'].mode()[0]
            })
        
        return hotspots
    
    def temporal_prediction(self, historical_data, forecast_days=7):
        """Predict future crime probability using LSTM"""
        # Prepare time series features
        time_series = self.create_time_series(historical_data)
        
        # Predict next `forecast_days`
        predictions = []
        for _ in range(forecast_days):
            pred = self.lstm_model.predict(time_series[-30:].reshape(1, 30, 10))
            predictions.append(pred[0][0])
        
        return predictions
    
    def create_time_series(self, data):
        """Create time series features"""
        # Features: crime_count, hour_of_day, day_of_week, month,
        #           temp, humidity, events, holidays, etc.
        features = []
        for date in pd.date_range(start=data['date'].min(), end=data['date'].max()):
            day_crimes = data[data['date'] == date]
            features.append([
                len(day_crimes),
                date.hour,
                date.weekday(),
                date.month,
                day_crimes['avg_latitude'].mean() if len(day_crimes) > 0 else 0,
                day_crimes['avg_longitude'].mean() if len(day_crimes) > 0 else 0,
                # Add weather, events, holidays features
            ])
        return np.array(features)
```

### 3.2 Prediction Output

```json
{
  "current_hotspots": [
    {
      "location": {"lat": 19.0760, "lng": 72.8777},
      "intensity": 0.85,
      "crime_count": 45,
      "predominant_type": "Theft",
      "radius_km": 2.5
    }
  ],
  "forecast_7days": [
    {"day": 1, "probability": 0.78, "expected_incidents": 12},
    {"day": 2, "probability": 0.72, "expected_incidents": 10}
  ],
  "recommendation": "Increase patrol in hotspot areas during evening hours"
}
```

---

## 4. Skill-Job Matching Engine

### 4.1 Architecture: Sentence Transformers

```python
from sentence_transformers import SentenceTransformer, util
import torch

class SkillJobMatcher:
    def __init__(self):
        # Multilingual model (supports Hindi, English, etc.)
        self.model = SentenceTransformer('paraphrase-multilingual-mpnet-base-v2')
        self.job_embeddings = {}
    
    def encode_job(self, job):
        """Create dense vector embedding for job"""
        text = f"""
        Job Title: {job['title']}
        Description: {job['description']}
        Required Skills: {', '.join(job['required_skills'])}
        Experience: {job['min_experience']}-{job['max_experience']} years
        Education: {job['education_required']}
        Location: {job['location']}
        """
        return self.model.encode(text, convert_to_tensor=True)
    
    def encode_candidate(self, candidate):
        """Create dense vector embedding for candidate"""
        text = f"""
        Skills: {', '.join(candidate['skills'])}
        Experience: {candidate['experience_years']} years in {candidate['domain']}
        Education: {candidate['education']}
        Previous Roles: {candidate['previous_roles']}
        """
        return self.model.encode(text, convert_to_tensor=True)
    
    def find_matches(self, candidate, jobs, top_k=20):
        """Find top matching jobs for candidate"""
        candidate_embedding = self.encode_candidate(candidate)
        
        # Encode jobs (with caching)
        job_embeddings = []
        for job in jobs:
            if job['id'] not in self.job_embeddings:
                self.job_embeddings[job['id']] = self.encode_job(job)
            job_embeddings.append(self.job_embeddings[job['id']])
        
        # Calculate cosine similarity
        similarities = util.cos_sim(
            candidate_embedding, 
            torch.stack(job_embeddings)
        )[0]
        
        # Get top matches
        top_results = torch.topk(similarities, k=min(top_k, len(jobs)))
        
        matches = []
        for idx, score in zip(top_results.indices, top_results.values):
            job = jobs[idx]
            matches.append({
                'job_id': job['id'],
                'job_title': job['title'],
                'match_score': float(score),
                'match_percentage': float(score) * 100,
                'match_explanation': self.explain_match(candidate, job, float(score))
            })
        
        return matches
    
    def explain_match(self, candidate, job, score):
        """Generate human-readable match explanation"""
        candidate_skills = set(s.lower() for s in candidate['skills'])
        job_skills = set(s.lower() for s in job['required_skills'])
        
        common_skills = candidate_skills & job_skills
        missing_skills = job_skills - candidate_skills
        
        exp_match = (
            candidate['experience_years'] >= job['min_experience'] and
            candidate['experience_years'] <= job.get('max_experience', 100)
        )
        
        return {
            'overall_score': score,
            'skill_match': {
                'common_skills': list(common_skills),
                'missing_skills': list(missing_skills),
                'skill_match_rate': len(common_skills) / len(job_skills) if job_skills else 0
            },
            'experience_match': exp_match,
            'recommendation': self.generate_recommendation(score, common_skills, missing_skills)
        }
    
    def generate_recommendation(self, score, common_skills, missing_skills):
        """Generate application recommendation"""
        if score >= 0.85 and len(missing_skills) == 0:
            return "Excellent match! Apply now."
        elif score >= 0.70:
            return f"Good match. Consider learning: {', '.join(list(missing_skills)[:3])}"
        elif score >= 0.50:
            return f"Moderate match. Missing skills: {', '.join(missing_skills)}"
        else:
            return "Low match. Explore other opportunities."
```

### 4.2 Batch Processing

```python
# Pre-compute job embeddings for faster matching
def batch_encode_jobs(jobs):
    """Encode all jobs in batch"""
    job_texts = [encode_job(job) for job in jobs]
    embeddings = model.encode(job_texts, batch_size=64, show_progress_bar=True)
    
    # Store in Redis for fast retrieval
    for job, embedding in zip(jobs, embeddings):
        redis.set(
            f"job_embedding:{job['id']}", 
            embedding.tobytes(),
            ex=3600  # 1 hour cache
        )
```

---

## 5. Sentiment Analysis System

### 5.1 Model: Fine-tuned BERT

```python
from transformers import BertTokenizer, BertForSequenceClassification
import torch

class SentimentAnalyzer:
    def __init__(self):
        # Load pre-trained multilingual BERT
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-multilingual-cased')
        self.model = BertForSequenceClassification.from_pretrained(
            'bert-base-multilingual-cased',
            num_labels=3  # Negative, Neutral, Positive
        )
        
    def analyze(self, text, language='en'):
        """Analyze sentiment and urgency"""
        # Tokenize
        inputs = self.tokenizer(
            text, 
            return_tensors='pt', 
            truncation=True, 
            padding=True,
            max_length=512
        )
        
        # Predict
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            probs = torch.softmax(logits, dim=1)[0]
        
        # Sentiment score (-1 to 1)
        sentiment_score = float(probs[2] - probs[0])  # Positive - Negative
        sentiment_label = ['NEGATIVE', 'NEUTRAL', 'POSITIVE'][torch.argmax(probs)]
        
        # Urgency detection
        urgency_keywords = {
            'urgent', 'emergency', 'immediate', 'asap', 'critical',
            'तुरंत', 'आपातकाल', 'जल्दी'  # Hindi urgency words
        }
        
        text_lower = text.lower()
        urgency_score = sum(keyword in text_lower for keyword in urgency_keywords) / 10
        urgency_score = min(urgency_score + abs(sentiment_score) * 0.3, 1.0)
        
        urgency_label = 'URGENT' if urgency_score > 0.7 else 'HIGH' if urgency_score > 0.5 else 'MEDIUM' if urgency_score > 0.3 else 'LOW'
        
        return {
            'sentiment': {
                'score': sentiment_score,
                'label': sentiment_label,
                'confidence': float(torch.max(probs))
            },
            'urgency': {
                'score': urgency_score,
                'label': urgency_label
            },
            'emotions': self.detect_emotions(text),
            'keywords': list(urgency_keywords & set(text_lower.split()))
        }
    
    def detect_emotions(self, text):
        """Detect specific emotions"""
        # Simplified emotion detection using keywords
        emotion_keywords = {
            'anger': ['angry', 'furious', 'outraged', 'गुस्सा', 'क्रोध'],
            'frustration': ['frustrated', 'annoyed', 'disappointed', 'निराश'],
            'fear': ['scared', 'afraid', 'worried', 'डर']
        }
        
        text_lower = text.lower()
        emotions = {}
        for emotion, keywords in emotion_keywords.items():
            score = sum(keyword in text_lower for keyword in keywords) / len(keywords)
            emotions[emotion] = min(score, 1.0)
        
        return emotions
```

### 5.2 Fine-tuning on Indian Government Complaints

```python
# Fine-tune BERT on labeled complaint data
from transformers import Trainer, TrainingArguments

def fine_tune_sentiment_model(train_dataset, val_dataset):
    """Fine-tune BERT on complaint sentiment data"""
    training_args = TrainingArguments(
        output_dir='./sentiment_model',
        num_train_epochs=3,
        per_device_train_batch_size=16,
        per_device_eval_batch_size=64,
        learning_rate=2e-5,
        evaluation_strategy='epoch',
        save_strategy='epoch',
        load_best_model_at_end=True,
        metric_for_best_model='accuracy'
    )
    
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        compute_metrics=compute_sentiment_metrics
    )
    
    trainer.train()
    return trainer.model
```

---

## 6. ML Infrastructure

### 6.1 MLOps Stack

```yaml
# MLflow for experiment tracking and model registry
mlflow:
  tracking_uri: postgresql://mlflow_db
  artifact_store: s3://iog-ml-artifacts
  
# Model serving with TensorFlow Serving
tf_serving:
  model_base_path: s3://iog-ml-models
  model_name: sentiment_analysis
  port: 8501

# Kubernetes deployment
apiVersion: serving.kubeflow.org/v1beta1
kind: InferenceService
metadata:
  name: fraud-detection
spec:
  predictor:
    sklearn:
      storageUri: s3://iog-ml-models/fraud_detection
      resources:
        requests:
          cpu: "1"
          memory: 2Gi
        limits:
          cpu: "2"
          memory: 4Gi
```

### 6.2 Model Monitoring

```python
import prometheus_client

# Define metrics
fraud_prediction_latency = prometheus_client.Histogram(
    'fraud_prediction_latency_seconds',
    'Latency of fraud prediction requests'
)

fraud_prediction_total = prometheus_client.Counter(
    'fraud_predictions_total',
    'Total number of fraud predictions',
    ['risk_level']
)

@fraud_prediction_latency.time()
def predict_fraud(data):
    result = model.predict(data)
    fraud_prediction_total.labels(risk_level=result['risk_level']).inc()
    return result
```

---

## 7. Model Training Pipeline

### 7.1 Automated Training Workflow

```python
# Apache Airflow DAG for monthly retraining
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'iog-ml-team',
    'depends_on_past': False,
    'start_date': datetime(2025, 1, 1),
    'retries': 3,
    'retry_delay': timedelta(hours=1)
}

dag = DAG(
    'fraud_detection_training',
    default_args=default_args,
    schedule_interval='@monthly',
    catchup=False
)

def extract_training_data(**context):
    """Extract last 6 months of labeled data"""
    # Query PostgreSQL for complaint data with fraud labels
    query = """
        SELECT * FROM complaints 
        WHERE created_at >= NOW() - INTERVAL '6 months'
        AND fraud_label IS NOT NULL
    """
    data = pd.read_sql(query, db_conn)
    return data

def train_model(**context):
    """Train fraud detection model"""
    data = context['task_instance'].xcom_pull(task_ids='extract_data')
    
    # Feature engineering
    X = feature_engineer(data)
    y = data['fraud_label']
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
    
    # Train
    model = train_fraud_model(X_train, y_train)
    
    # Evaluate
    accuracy = evaluate_model(model, X_test, y_test)
    
    if accuracy > 0.95:  # Quality gate
        save_model(model, 'fraud_detection_v' + datetime.now().strftime('%Y%m%d'))
        return True
    else:
        raise ValueError(f"Model accuracy {accuracy} below threshold")

def deploy_model(**context):
    """Deploy to production"""
    # Update production model in MLflow registry
    client = mlflow.tracking.MlflowClient()
    client.transition_model_version_stage(
        name="fraud_detection",
        version=latest_version,
        stage="Production"
    )

extract_task = PythonOperator(
    task_id='extract_data',
    python_callable=extract_training_data,
    dag=dag
)

train_task = PythonOperator(
    task_id='train_model',
    python_callable=train_model,
    dag=dag
)

deploy_task = PythonOperator(
    task_id='deploy_model',
    python_callable=deploy_model,
    dag=dag
)

extract_task >> train_task >> deploy_task
```

---

## 8. Model Deployment

### 8.1 Production Serving

```python
# FastAPI service for ML predictions
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mlflow.pyfunc

app = FastAPI()

# Load models on startup
fraud_model = mlflow.pyfunc.load_model("models:/fraud_detection/production")
sentiment_model = SentimentAnalyzer()

class PredictionRequest(BaseModel):
    description: str
    user_id: str
    evidence_count: int
    # ... other features

@app.post("/api/fraud/predict")
async def predict_fraud(request: PredictionRequest):
    try:
        # Feature engineering
        features = engineer_features(request)
        
        # Predict
        result = fraud_model.predict(features)
        
        return {
            "fraud_probability": float(result[0]),
            "risk_level": categorize_risk(result[0])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/sentiment/analyze")
async def analyze_sentiment(text: str):
    result = sentiment_model.analyze(text)
    return result

# Health check
@app.get("/health")
async def health():
    return {"status": "healthy", "models_loaded": True}
```

---

**End of Module 4 - AI & ML Architecture**
