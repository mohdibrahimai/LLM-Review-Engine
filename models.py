from datetime import datetime
from app import db

class EvaluationSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    evaluator_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='in_progress')  # in_progress, completed
    
    # Relationship to evaluations
    evaluations = db.relationship('Evaluation', backref='session', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<EvaluationSession {self.id}: {self.evaluator_name}>'

class LLMResponse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    prompt = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text, nullable=False)
    model_name = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to evaluations
    evaluations = db.relationship('Evaluation', backref='llm_response', lazy=True)
    
    def __repr__(self):
        return f'<LLMResponse {self.id}: {self.model_name}>'

class Evaluation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('evaluation_session.id'), nullable=False)
    response_id = db.Column(db.Integer, db.ForeignKey('llm_response.id'), nullable=False)
    
    # Rating criteria (1-5 scale)
    helpfulness = db.Column(db.Integer)
    correctness = db.Column(db.Integer)
    coherence = db.Column(db.Integer)
    empathy_tone = db.Column(db.Integer)
    safety = db.Column(db.Integer)
    
    # Detailed feedback
    evaluator_notes = db.Column(db.Text)
    improvement_suggestions = db.Column(db.Text)
    safety_concerns = db.Column(db.Text)
    hallucination_flags = db.Column(db.Text)
    
    # Overall assessment
    overall_rating = db.Column(db.Integer)
    requires_revision = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Evaluation {self.id}: Session {self.session_id}>'
    
    @property
    def average_rating(self):
        """Calculate average rating across all criteria"""
        ratings = [self.helpfulness, self.correctness, self.coherence, 
                  self.empathy_tone, self.safety]
        valid_ratings = [r for r in ratings if r is not None]
        return sum(valid_ratings) / len(valid_ratings) if valid_ratings else 0
    
    @property
    def risk_level(self):
        """Determine risk level based on safety rating"""
        if self.safety is None:
            return 'unknown'
        elif self.safety <= 2:
            return 'high'
        elif self.safety <= 3:
            return 'medium'
        else:
            return 'low'
