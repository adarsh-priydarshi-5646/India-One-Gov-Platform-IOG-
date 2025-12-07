# 📘 MODULE 2: MICROSERVICES ARCHITECTURE (Continued)

## Services 6-11: Remaining Microservices

---

## 6. Fraud AI Service

### 6.1 Purpose

AI-powered fraud detection and analytics:
- Real-time transaction fraud detection
- Anomaly detection in complaints and reports
- Risk scoring for all submissions
- Pattern recognition for fraud schemes
- Model training and deployment pipeline

### 6.2 Technology Stack

- **Runtime**: Python 3.10+ + FastAPI
- **ML Framework**: TensorFlow, scikit-learn, XGBoost
- **Database**: PostgreSQL (training data), Redis (inference cache)
- **Model Management**: MLflow
- **Feature Store**: Feast

### 6.3 ML Models

#### 6.3.1 Fraud Detection Model

**Model Type**: XGBoost Classifier

**Features** (42 total):
```python
features = [
    # User behavior
    'user_account_age_days',
    'user_previous_reports_count',
    'user_resolution_success_rate',
    
    # Transaction patterns
    'monetary_value',
    'time_of_day',
    'day_of_week',
    'submission_speed_seconds',
    
    # Content analysis
    'description_length',
    'description_sentiment_score',
    'description_readability_score',
    'contains_urgency_keywords',
    'contains_suspicious_patterns',
    
    # Location
    'location_consistency',
    'location_high_fraud_area',
    
    # Evidence
    'evidence_count',
    'evidence_total_size_mb',
    'evidence_image_to_document_ratio',
    
    # Historical
    '7day_similar_reports_count',
    '30day_same_user_reports',
    'historic_fraud_rate_in_area'
]
```

**Training Pipeline**:
```python
class FraudDetectionPipeline:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.feature_selector = SelectKBest(k=35)
    
    def train(self, X_train, y_train):
        # Feature engineering
        X_features = self.engineer_features(X_train)
        
        # Feature scaling
        X_scaled = self.scaler.fit_transform(X_features)
        
        # Feature selection
        X_selected = self.feature_selector.fit_transform(X_scaled, y_train)
        
        # Model training with hyperparameter tuning
        param_grid = {
            'max_depth': [3, 5, 7, 9],
            'learning_rate': [0.01, 0.1, 0.3],
            'n_estimators': [100, 200, 300],
            'min_child_weight': [1, 3, 5]
        }
        
        self.model = XGBClassifier(
            objective='binary:logistic',
            eval_metric='auc'
        )
        
        grid_search = GridSearchCV(
            self.model, 
            param_grid, 
            cv=5, 
            scoring='roc_auc',
            n_jobs=-1
        )
        
        grid_search.fit(X_selected, y_train)
        self.model = grid_search.best_estimator_
        
        # Log model to MLflow
        mlflow.xgboost.log_model(self.model, "fraud_detection_model")
        
    def predict(self, X):
        X_features = self.engineer_features(X)
        X_scaled = self.scaler.transform(X_features)
        X_selected = self.feature_selector.transform(X_scaled)
        
        probabilities = self.model.predict_proba(X_selected)[:, 1]
        predictions = probabilities > 0.5
        
        return predictions, probabilities
```

### 6.4 API Endpoints

#### 6.4.1 POST /api/fraud/analyze
**Description**: Analyze submission for fraud

**Request Body**:
```json
{
  "type": "complaint",  // or "fir", "corruption_report"
  "userId": "uuid",
  "data": {
    "description": "...",
    "monetaryValue": 50000,
    "location": {"lat": 19.0760, "lng": 72.8777},
    "evidenceCount": 3,
    "evidenceTotalSize": 5242880
  }
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "fraudProbability": 0.12,
    "riskScore": 0.15,
    "riskLevel": "LOW",  // LOW, MEDIUM, HIGH, CRITICAL
    "flaggedReasons": [],
    "recommendation": "APPROVE",  // APPROVE, REVIEW, REJECT
    "confidence": 0.94
  }
}
```

---

#### 6.4.2 POST /api/fraud/sentiment
**Description**: Analyze text sentiment and urgency

**Request Body**:
```json
{
  "text": "Urgent! No water for 3 days! People suffering!",
  "language": "en"  // en, hi, mr, ta, etc.
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "sentiment": -0.65,  // -1 to 1 scale
    "sentimentLabel": "NEGATIVE",
    "urgency": 0.85,  // 0 to 1 scale
    "urgencyLabel": "HIGH",
    "emotions": {
      "anger": 0.3,
      "frustration": 0.5,
      "fear": 0.2
    },
    "keywords": ["urgent", "suffering"]
  }
}
```

---

#### 6.4.3 POST /api/fraud/corruption/analyze
**Description**: Analyze corruption report for patterns

**Request Body**:
```json
{
  "description": "...",
  "accusedDepartment": "Building Permission",
  "monetaryValue": 50000,
  "location": {"state": "Maharashtra", "district": "Mumbai"}
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "riskScore": 0.78,
    "matchedPatternId": "pattern-uuid",
    "patternDescription": "Systematic bribery in building permissions",
    "similarCasesCount": 45,
    "recommendations": [
      "Assign to specialized anti-corruption team",
      "Cross-reference with other reports in same department",
      "Prioritize for immediate investigation"
    ]
  }
}
```

---

#### 6.4.4 POST /api/fraud/train
**Description**: Trigger model retraining (Admin only)

**Request Body**:
```json
{
  "modelName": "fraud_detection",
  "trainingDataFrom": "2024-01-01",
  "trainingDataTo": "2025-12-31"
}
```

**Response (202 Accepted)**:
```json
{
  "success": true,
  "message": "Training job queued",
  "data": {
    "jobId": "training-job-uuid",
    "estimatedCompletionTime": "2025-12-07T22:00:00Z"
  }
}
```

---

### 6.5 Crime Hotspot Prediction

**Model Type**: DBSCAN + LSTM

```python
class CrimeHotspotPredictor:
    def __init__(self):
        self.dbscan = DBSCAN(eps=0.5, min_samples=3)
        self.lstm_model = self.build_lstm_model()
    
    def build_lstm_model(self):
        model = Sequential([
            LSTM(128, return_sequences=True, input_shape=(30, 10)),
            Dropout(0.2),
            LSTM(64, return_sequences=False),
            Dropout(0.2),
            Dense(32, activation='relu'),
            Dense(1, activation='sigmoid')
        ])
        model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
        return model
    
    def predict_hotspots(self, historical_crimes, forecast_days=7):
        # Step 1: Current hotspot clustering
        coordinates = [[c['lat'], c['lng']] for c in historical_crimes]
        clusters = self.dbscan.fit_predict(coordinates)
        
        # Step 2: Time series prediction for each cluster
        hotspots = []
        for cluster_id in set(clusters):
            if cluster_id == -1:  # Noise
                continue
            
            cluster_crimes = [c for i, c in enumerate(historical_crimes) if clusters[i] == cluster_id]
            
            # Prepare time series data
            time_series = self.create_time_series(cluster_crimes)
            
            # Predict future crime probability
            future_prob = self.lstm_model.predict(time_series)
            
            hotspots.append({
                'location': self.calculate_centroid(cluster_crimes),
                'current_intensity': len(cluster_crimes) / len(historical_crimes),
                'predicted_intensity': future_prob[0][0],
                'trend': 'INCREASING' if future_prob[0][0] > len(cluster_crimes) / len(historical_crimes) else 'DECREASING'
            })
        
        return hotspots
```

### 6.6 Skill-Job Matching Engine

**Model Type**: Sentence Transformers (BERT-based)

```python
from sentence_transformers import SentenceTransformer, util

class SkillJobMatcher:
    def __init__(self):
        self.model = SentenceTransformer('paraphrase-multilingual-mpnet-base-v2')
        self.job_embeddings_cache = {}
    
    def encode_job(self, job):
        # Combine job title, description, and required skills
        text = f"{job['title']}. {job['description']}. Required: {', '.join(job['skills'])}"
        return self.model.encode(text, convert_to_tensor=True)
    
    def encode_candidate(self, candidate):
        # Combine skills, experience, education
        text = f"Skills: {', '.join(candidate['skills'])}. Experience: {candidate['experience_years']} years in {candidate['domain']}. Education: {candidate['education']}"
        return self.model.encode(text, convert_to_tensor=True)
    
    def find_matches(self, candidate, jobs, top_k=10):
        # Encode candidate
        candidate_embedding = self.encode_candidate(candidate)
        
        # Encode jobs (use cache if available)
        job_embeddings = []
        for job in jobs:
            if job['id'] not in self.job_embeddings_cache:
                self.job_embeddings_cache[job['id']] = self.encode_job(job)
            job_embeddings.append(self.job_embeddings_cache[job['id']])
        
        # Calculate cosine similarity
        similarities = util.cos_sim(candidate_embedding, torch.stack(job_embeddings))[0]
        
        # Get top matches
        top_indices = torch.topk(similarities, k=min(top_k, len(jobs))).indices
        
        matches = []
        for idx in top_indices:
            matches.append({
                'job': jobs[idx],
                'matchScore': float(similarities[idx]),
                'matchPercentage': float(similarities[idx]) * 100,
                'matchReason': self.explain_match(candidate, jobs[idx])
            })
        
        return matches
    
    def explain_match(self, candidate, job):
        common_skills = set(candidate['skills']) & set(job['skills'])
        return {
            'commonSkills': list(common_skills),
            'skillMatch': len(common_skills) / len(job['skills']),
            'experienceMatch': candidate['experience_years'] >= job['min_experience']
        }
```

---

## 7. Employment Service

### 7.1 Purpose

Job matching and skill development:
- Job posting and search
- AI-powered skill-job matching
- Online skill assessments
- Training recommendations
- Employment statistics

### 7.2 Data Models

#### 7.2.1 Job Model (PostgreSQL)

```sql
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_number VARCHAR(30) UNIQUE NOT NULL,
    employer_id UUID REFERENCES users(id),
    employer_name VARCHAR(255) NOT NULL,
    employer_type VARCHAR(50),  -- Government, Private, NGO
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    job_type VARCHAR(50) NOT NULL,  -- Full-time, Part-time, Contract, Internship
    category VARCHAR(100),  -- IT, Healthcare, Manufacturing, etc.
    required_skills TEXT[],
    min_experience_years INTEGER DEFAULT 0,
    max_experience_years INTEGER,
    education_required VARCHAR(100),
    salary_min DECIMAL(10, 2),
    salary_max DECIMAL(10, 2),
    salary_currency VARCHAR(3) DEFAULT 'INR',
    location_type VARCHAR(50),  -- On-site, Remote, Hybrid
    work_location_state VARCHAR(100),
    work_location_district VARCHAR(100),
    work_location_address TEXT,
    vacancies INTEGER DEFAULT 1,
    application_deadline DATE,
    job_status VARCHAR(50) DEFAULT 'ACTIVE',  -- ACTIVE, CLOSED, FILLED
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_jobs_status ON jobs(job_status);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_location ON jobs(work_location_district);
```

#### 7.2.2 User Skills Model (PostgreSQL)

```sql
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    skill_name VARCHAR(100) NOT NULL,
    proficiency_level VARCHAR(50),  -- Beginner, Intermediate, Advanced, Expert
    years_of_experience INTEGER,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by VARCHAR(100),  -- Assessment name or certificate source
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_skills_user ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill ON user_skills(skill_name);
```

#### 7.2.3 Job Applications (PostgreSQL)

```sql
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id),
    applicant_id UUID NOT NULL REFERENCES users(id),
    match_score DECIMAL(3, 2),  -- AI-generated match score
    resume_url VARCHAR(500),
    cover_letter TEXT,
    application_status VARCHAR(50) DEFAULT 'SUBMITTED',  -- SUBMITTED, REVIEWED, SHORTLISTED, REJECTED, ACCEPTED
    applied_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    status_updated_at TIMESTAMP
);

CREATE INDEX idx_applications_job ON job_applications(job_id);
CREATE INDEX idx_applications_applicant ON job_applications(applicant_id);
CREATE INDEX idx_applications_status ON job_applications(application_status);
```

### 7.3 API Endpoints

#### 7.3.1 POST /api/jobs
**Description**: Post a new job (Employers only)

**Request Body**:
```json
{
  "title": "Full Stack Developer",
  "description": "We are looking for...",
  "jobType": "Full-time",
  "category": "IT",
  "requiredSkills": ["JavaScript", "React", "Node.js", "MongoDB"],
  "minExperience": 2,
  "maxExperience": 5,
  "educationRequired": "Bachelor's in Computer Science",
  "salaryMin": 600000,
  "salaryMax": 1200000,
  "locationType": "Hybrid",
  "workLocation": {
    "state": "Maharashtra",
    "district": "Pune",
    "address": "Hinjewadi Phase 1"
  },
  "vacancies": 5,
  "applicationDeadline": "2026-01-31"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "jobNumber": "IOG-JOB-2025-00001",
    "status": "ACTIVE"
  }
}
```

---

#### 7.3.2 GET /api/jobs/search
**Description**: Search jobs

**Query Parameters**:
```
?q=developer&category=IT&location=Pune&minSalary=500000&maxSalary=1500000&jobType=Full-time
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "uuid",
        "jobNumber": "IOG-JOB-2025-00001",
        "title": "Full Stack Developer",
        "employerName": "Tech Company",
        "category": "IT",
        "location": "Pune, Maharashtra",
        "salaryRange": "₹6-12 LPA",
        "jobType": "Full-time",
        "postedAt": "2025-12-01T00:00:00Z"
      }
    ],
    "totalResults": 125,
    "page": 1,
    "totalPages": 7
  }
}
```

---

#### 7.3.3 GET /api/jobs/matches
**Description**: Get AI-matched jobs for user

**Request Headers**:
```
Authorization: Bearer {accessToken}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "job": {
          "id": "uuid",
          "title": "Full Stack Developer",
          "employerName": "Tech Company",
          "location": "Pune"
        },
        "matchScore": 0.92,
        "matchPercentage": 92,
        "matchReason": {
          "commonSkills": ["JavaScript", "React", "Node.js"],
          "skillMatchRate": 0.85,
          "experienceMatch": true,
          "locationMatch": true
        }
      }
    ]
  }
}
```

---

#### 7.3.4 POST /api/jobs/:id/apply
**Description**: Apply for a job

**Request Body**:
```json
{
  "resumeUrl": "https://...",
  "coverLetter": "I am excited to apply..."
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "applicationId": "uuid",
    "matchScore": 0.87,
    "status": "SUBMITTED"
  }
}
```

---

#### 7.3.5 POST /api/skills/assess
**Description**: Take skill assessment test

**Request Body**:
```json
{
  "skillName": "JavaScript",
  "assessmentType": "MCQ",  // MCQ, Coding, Practical
  "answers": [
    {"questionId": 1, "answer": "A"},
    {"questionId": 2, "answer": "C"}
  ]
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "score": 85,
    "percentile": 78,
    "proficiencyLevel": "Advanced",
    "certificate": {
      "id": "uuid",
      "issueDate": "2025-12-07",
      "validUntil": "2026-12-07",
      "certificateUrl": "https://..."
    }
  }
}
```

---

## 8. Politician Service

### 8.1 Purpose

Politician transparency and accountability:
- Constituency dashboard
- Project tracking
- Fund utilization transparency
- Performance metrics
- Citizen engagement

### 8.2 Data Models

#### 8.2.1 Politician Profile (PostgreSQL)

```sql
CREATE TABLE politician_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    designation VARCHAR(100) NOT NULL,  -- MP, MLA, Corporator, etc.
    constituency_name VARCHAR(255) NOT NULL,
    constituency_type VARCHAR(50),  -- Lok Sabha, Vidhan Sabha, Municipal
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    party_name VARCHAR(255),
    term_start_date DATE NOT NULL,
    term_end_date DATE NOT NULL,
    total_funds_allocated DECIMAL(15, 2) DEFAULT 0,
    total_funds_utilized DECIMAL(15, 2) DEFAULT 0,
    photo_url VARCHAR(500),
    bio TEXT,
    election_promises JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 8.2.2 Government Projects (PostgreSQL)

```sql
CREATE TABLE government_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name VARCHAR(255) NOT NULL,
    project_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100),  -- Infrastructure, Healthcare, Education, etc.
    politician_id UUID REFERENCES politician_profiles(id),
    constituency VARCHAR(255),
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    budget_allocated DECIMAL(15, 2) NOT NULL,
    budget_utilized DECIMAL(15, 2) DEFAULT 0,
    start_date DATE NOT NULL,
    expected_completion_date DATE NOT NULL,
    actual_completion_date DATE,
    project_status VARCHAR(50) DEFAULT 'PLANNED',  -- PLANNED, IN_PROGRESS, COMPLETED, DELAYED, CANCELLED
    completion_percentage INTEGER DEFAULT 0,
    contractor_name VARCHAR(255),
    beneficiaries_count INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 8.2.3 Fund Allocations (PostgreSQL)

```sql
CREATE TABLE fund_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    politician_id UUID NOT NULL REFERENCES politician_profiles(id),
    fund_type VARCHAR(100),  -- MPLAD, State Fund, Municipal Fund
    fiscal_year VARCHAR(10) NOT NULL,
    allocated_amount DECIMAL(15, 2) NOT NULL,
    utilized_amount DECIMAL(15, 2) DEFAULT 0,
    allocation_date DATE NOT NULL,
    purpose TEXT,
    project_id UUID REFERENCES government_projects(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 8.3 API Endpoints

#### 8.3.1 GET /api/politician/:id/profile
**Description**: Get politician public profile

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Politician Name",
    "designation": "Member of Parliament",
    "constituency": "Mumbai North",
    "party": "Party Name",
    "termPeriod": "2019-2024",
    "photo": "https://...",
    "bio": "...",
    "performanceScore": 78,  // AI-calculated
    "totalProjects": 45,
    "completedProjects": 32,
    "fundsAllocated": 5000000000,
    "fundsUtilized": 4200000000,
    "utilizationRate": 84
  }
}
```

---

#### 8.3.2 GET /api/politician/:id/projects
**Description**: Get politician's projects

**Query Parameters**:
```
?status=IN_PROGRESS&category=Infrastructure
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "uuid",
        "name": "New Bridge Construction",
        "code": "MH-MUM-2024-001",
        "category": "Infrastructure",
        "budget": 100000000,
        "utilized": 75000000,
        "status": "IN_PROGRESS",
        "completionPercentage": 75,
        "expectedCompletion": "2026-06-30",
        "beneficiaries": 50000
      }
    ]
  }
}
```

---

#### 8.3.3 GET /api/politician/:id/funds
**Description**: Get fund allocation and utilization

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "totalAllocated": 5000000000,
    "totalUtilized": 4200000000,
    "utilizationRate": 84,
    "byFiscalYear": [
      {
        "year": "2024-25",
        "allocated": 500000000,
        "utilized": 420000000,
        "utilizationRate": 84
      }
    ],
    "byCategory": [
      {
        "category": "Infrastructure",
        "allocated": 2000000000,
        "utilized": 1800000000
      }
    ]
  }
}
```

---

#### 8.3.4 GET /api/politician/:id/performance
**Description**: Get performance metrics

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "overallScore": 78,
    "metrics": {
      "projectCompletionRate": 71,
      "fundsUtilizationRate": 84,
      "citizenSatisfactionScore": 72,
      "complaintResolutionRate": 68,
      "promiseFulfillmentRate": 65
    },
    "ranking": {
      "nationalRank": 45,
      "stateRank": 5,
      "totalPoliticians": 543
    },
    "trend": "IMPROVING"
  }
}
```

---

## 9. Admin Service

### 9.1 Purpose

Multi-level governance analytics and administration:
- District/State/National dashboards
- Corruption heatmaps
- Performance rankings
- Resource optimization
- Report generation

### 9.2 API Endpoints

#### 9.2.1 GET /api/admin/dashboard
**Description**: Get comprehensive dashboard data

**Query Parameters**:
```
?level=NATIONAL&state=Maharashtra&district=Mumbai&from=2025-01-01&to=2025-12-31
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "level": "NATIONAL",
    "period": "2025-01-01 to 2025-12-31",
    "summary": {
      "totalComplaints": 1250000,
      "resolvedComplaints": 980000,
      "resolutionRate": 78.4,
      "avgResolutionTime": 12.5,  // days
      "totalFIRs": 450000,
      "totalCorruptionReports": 12500,
      "totalJobs": 2500000,
      "jobPlacements": 1250000
    },
    "trends": {
      "complaintsGrowth": -12.5,  // % change
      "crimeRate": -8.3,
      "employmentRate": 15.7
    }
  }
}
```

---

#### 9.2.2 GET /api/admin/analytics/corruption
**Description**: Corruption analytics and heatmap

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "totalReports": 12500,
    "heatmapData": [
      {
        "state": "Maharashtra",
        "district": "Mumbai",
        "count": 320,
        "totalValue": 45000000,
        "intensity": 0.85
      }
    ],
    "topDepartments": [
      {
        "department": "Building Permission",
        "reportsCount": 1250,
        "totalValue": 125000000
      }
    ],
    "trendByMonth": [
      {
        "month": "2025-01",
        "count": 950
      }
    ]
  }
}
```

---

#### 9.2.3 GET /api/admin/performance/ranking
**Description**: Performance ranking of officers/politicians/departments

**Query Parameters**:
```
?type=POLITICIAN&topN=50
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "rankings": [
      {
        "rank": 1,
        "entity": {
          "id": "uuid",
          "name": "Politician A",
          "designation": "MP",
          "constituency": "Mumbai North"
        },
        "score": 95.5,
        "metrics": {
          "projectCompletion": 98,
          "fundUtilization": 96,
          "citizenSatisfaction": 92
        }
      }
    ]
  }
}
```

---

## 10. Notification Service

### 10.1 Purpose

Multi-channel notification delivery:
- Email notifications
- SMS alerts
- Push notifications
- In-app notifications
- Notification preferences

### 10.2 Technology Stack

- **Runtime**: Node.js + Express
- **Queue**: Bull (Redis-backed)
- **Email**: AWS SES or SendGrid
- **SMS**: MSG91 or Twilio
- **Push**: Firebase Cloud Messaging (FCM)

### 10.3 Data Models

#### 10.3.1 Notification Model (PostgreSQL)

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL,  -- COMPLAINT_UPDATE, FIR_STATUS, JOB_MATCH, etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    channels TEXT[],  -- ['EMAIL', 'SMS', 'PUSH']
    priority VARCHAR(20) DEFAULT 'MEDIUM',  -- LOW, MEDIUM, HIGH, URGENT
    status VARCHAR(50) DEFAULT 'PENDING',  -- PENDING, SENT, DELIVERED, FAILED
    email_status VARCHAR(20),
    sms_status VARCHAR(20),
    push_status VARCHAR(20),
    metadata JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
```

### 10.4 API Endpoints

#### 10.4.1 POST /api/notifications/send
**Description**: Send notification (Internal service call)

**Request Body**:
```json
{
  "userId": "uuid",
  "type": "COMPLAINT_UPDATE",
  "title": "Complaint Status Updated",
  "message": "Your complaint IOG-CMP-2025-00001 has been resolved",
  "channels": ["EMAIL", "SMS", "PUSH"],
  "priority": "HIGH",
  "metadata": {
    "complaintId": "uuid",
    "complaintNumber": "IOG-CMP-2025-00001"
  }
}
```

**Response (202 Accepted)**:
```json
{
  "success": true,
  "message": "Notification queued",
  "data": {
    "notificationId": "uuid"
  }
}
```

---

#### 10.4.2 GET /api/notifications
**Description**: Get user notifications

**Query Parameters**:
```
?page=1&limit=20&unreadOnly=true
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "COMPLAINT_UPDATE",
        "title": "Complaint Resolved",
        "message": "Your complaint has been resolved",
        "priority": "HIGH",
        "isRead": false,
        "createdAt": "2025-12-07T20:00:00Z"
      }
    ],
    "unreadCount": 5
  }
}
```

---

## 11. API Gateway

### 11.1 Technology

**Kong API Gateway** with plugins:
- JWT authentication
- Rate limiting
- Request/response transformation
- CORS
- Logging
- Monitoring

### 11.2 Configuration

```yaml
services:
  - name: auth-service
    url: http://auth-service:3001
    routes:
      - name: auth-route
        paths:
          - /api/auth
        methods:
          - GET
          - POST
        plugins:
          - name: rate-limiting
            config:
              minute: 60
              hour: 1000

  - name: complaint-service
    url: http://complaint-service:3002
    routes:
      - name: complaint-route
        paths:
          - /api/complaints
        plugins:
          - name: jwt
            config:
              key_claim_name: userId
          - name: rate-limiting
            config:
              minute: 100
```

---

**End of Module 2 - Microservices Architecture**
