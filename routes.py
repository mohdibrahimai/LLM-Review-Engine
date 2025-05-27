from flask import render_template, request, redirect, url_for, flash, jsonify, make_response
from datetime import datetime
import json
from app import app, db
from models import EvaluationSession, LLMResponse, Evaluation
from forms import EvaluationForm, SessionForm

@app.route('/')
def index():
    """Homepage with overview and navigation"""
    recent_sessions = EvaluationSession.query.order_by(EvaluationSession.created_at.desc()).limit(5).all()
    total_sessions = EvaluationSession.query.count()
    total_evaluations = Evaluation.query.count()
    
    return render_template('index.html', 
                         recent_sessions=recent_sessions,
                         total_sessions=total_sessions,
                         total_evaluations=total_evaluations)

@app.route('/dashboard')
def dashboard():
    """Dashboard showing all evaluation sessions"""
    sessions = EvaluationSession.query.order_by(EvaluationSession.created_at.desc()).all()
    return render_template('dashboard.html', sessions=sessions)

@app.route('/session/<int:session_id>')
def session_detail(session_id):
    """View details of a specific evaluation session"""
    session = EvaluationSession.query.get_or_404(session_id)
    evaluations = Evaluation.query.filter_by(session_id=session_id).all()
    
    # Calculate session statistics
    total_evaluations = len(evaluations)
    avg_rating = sum([e.average_rating for e in evaluations]) / total_evaluations if evaluations else 0
    high_risk_count = sum([1 for e in evaluations if e.risk_level == 'high'])
    
    return render_template('session_detail.html', 
                         session=session, 
                         evaluations=evaluations,
                         total_evaluations=total_evaluations,
                         avg_rating=avg_rating,
                         high_risk_count=high_risk_count)

@app.route('/start_session', methods=['GET', 'POST'])
def start_session():
    """Start a new evaluation session"""
    form = SessionForm()
    
    if form.validate_on_submit():
        session = EvaluationSession(
            evaluator_name=form.evaluator_name.data
        )
        db.session.add(session)
        db.session.commit()
        
        flash(f'Evaluation session started for {form.evaluator_name.data}', 'success')
        return redirect(url_for('evaluate', session_id=session.id))
    
    return render_template('evaluate.html', form=form, session=None)

@app.route('/evaluate/<int:session_id>')
def evaluate(session_id):
    """Main evaluation interface"""
    session = EvaluationSession.query.get_or_404(session_id)
    
    # Get a random LLM response that hasn't been evaluated in this session yet
    evaluated_response_ids = [e.response_id for e in session.evaluations]
    
    if evaluated_response_ids:
        response = LLMResponse.query.filter(~LLMResponse.id.in_(evaluated_response_ids)).first()
    else:
        response = LLMResponse.query.first()
    
    if not response:
        flash('No more responses to evaluate in this session.', 'info')
        return redirect(url_for('session_detail', session_id=session_id))
    
    form = EvaluationForm()
    
    return render_template('evaluate.html', 
                         form=form, 
                         session=session, 
                         response=response)

@app.route('/submit_evaluation', methods=['POST'])
def submit_evaluation():
    """Submit an evaluation for an LLM response"""
    form = EvaluationForm()
    
    if form.validate_on_submit():
        evaluation = Evaluation(
            session_id=form.session_id.data,
            response_id=form.response_id.data,
            helpfulness=form.helpfulness.data,
            correctness=form.correctness.data,
            coherence=form.coherence.data,
            empathy_tone=form.empathy_tone.data,
            safety=form.safety.data,
            evaluator_notes=form.evaluator_notes.data,
            improvement_suggestions=form.improvement_suggestions.data,
            safety_concerns=form.safety_concerns.data,
            hallucination_flags=form.hallucination_flags.data,
            overall_rating=form.overall_rating.data,
            requires_revision=form.requires_revision.data
        )
        
        db.session.add(evaluation)
        db.session.commit()
        
        flash('Evaluation submitted successfully!', 'success')
        return redirect(url_for('evaluate', session_id=form.session_id.data))
    
    # If form validation fails, redirect back with errors
    session = EvaluationSession.query.get(form.session_id.data)
    response = LLMResponse.query.get(form.response_id.data)
    
    for field, errors in form.errors.items():
        for error in errors:
            flash(f'{field}: {error}', 'error')
    
    return render_template('evaluate.html', form=form, session=session, response=response)

@app.route('/complete_session/<int:session_id>')
def complete_session(session_id):
    """Mark a session as completed"""
    session = EvaluationSession.query.get_or_404(session_id)
    session.status = 'completed'
    session.completed_at = datetime.utcnow()
    db.session.commit()
    
    flash('Evaluation session completed!', 'success')
    return redirect(url_for('session_detail', session_id=session_id))

@app.route('/export_session/<int:session_id>')
def export_session(session_id):
    """Export session data as JSON"""
    session = EvaluationSession.query.get_or_404(session_id)
    evaluations = Evaluation.query.filter_by(session_id=session_id).all()
    
    # Prepare export data
    export_data = {
        'session': {
            'id': session.id,
            'evaluator_name': session.evaluator_name,
            'created_at': session.created_at.isoformat(),
            'completed_at': session.completed_at.isoformat() if session.completed_at else None,
            'status': session.status
        },
        'evaluations': []
    }
    
    for eval in evaluations:
        eval_data = {
            'id': eval.id,
            'response': {
                'prompt': eval.llm_response.prompt,
                'response': eval.llm_response.response,
                'model_name': eval.llm_response.model_name
            },
            'ratings': {
                'helpfulness': eval.helpfulness,
                'correctness': eval.correctness,
                'coherence': eval.coherence,
                'empathy_tone': eval.empathy_tone,
                'safety': eval.safety,
                'overall_rating': eval.overall_rating
            },
            'feedback': {
                'evaluator_notes': eval.evaluator_notes,
                'improvement_suggestions': eval.improvement_suggestions,
                'safety_concerns': eval.safety_concerns,
                'hallucination_flags': eval.hallucination_flags,
                'requires_revision': eval.requires_revision
            },
            'metrics': {
                'average_rating': eval.average_rating,
                'risk_level': eval.risk_level
            },
            'created_at': eval.created_at.isoformat()
        }
        export_data['evaluations'].append(eval_data)
    
    # Create response
    response = make_response(json.dumps(export_data, indent=2))
    response.headers['Content-Type'] = 'application/json'
    response.headers['Content-Disposition'] = f'attachment; filename=evaluation_session_{session_id}.json'
    
    return response

@app.route('/api/session_stats/<int:session_id>')
def session_stats(session_id):
    """API endpoint for session statistics"""
    evaluations = Evaluation.query.filter_by(session_id=session_id).all()
    
    if not evaluations:
        return jsonify({'error': 'No evaluations found'})
    
    stats = {
        'total_evaluations': len(evaluations),
        'average_ratings': {
            'helpfulness': sum([e.helpfulness for e in evaluations if e.helpfulness]) / len([e for e in evaluations if e.helpfulness]),
            'correctness': sum([e.correctness for e in evaluations if e.correctness]) / len([e for e in evaluations if e.correctness]),
            'coherence': sum([e.coherence for e in evaluations if e.coherence]) / len([e for e in evaluations if e.coherence]),
            'empathy_tone': sum([e.empathy_tone for e in evaluations if e.empathy_tone]) / len([e for e in evaluations if e.empathy_tone]),
            'safety': sum([e.safety for e in evaluations if e.safety]) / len([e for e in evaluations if e.safety]),
            'overall': sum([e.overall_rating for e in evaluations if e.overall_rating]) / len([e for e in evaluations if e.overall_rating])
        },
        'risk_distribution': {
            'high': len([e for e in evaluations if e.risk_level == 'high']),
            'medium': len([e for e in evaluations if e.risk_level == 'medium']),
            'low': len([e for e in evaluations if e.risk_level == 'low'])
        },
        'requires_revision': len([e for e in evaluations if e.requires_revision])
    }
    
    return jsonify(stats)
