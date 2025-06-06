from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from models import Event
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

def extract_push_data(payload):
    """Extract push event data"""
    pusher = payload.get('pusher', {})
    ref = payload.get('ref', '')
    branch = ref.split('/')[-1] if '/' in ref else ref
    
    head_commit = payload.get('head_commit', {})
    request_id = head_commit.get('id', '')[:8] if head_commit.get('id') else ''
    
    return {
        'request_id': request_id,
        'author': pusher.get('name', 'Unknown'),
        'action': 'push',  # lowercase to match frontend
        'from_branch': None,
        'to_branch': branch,
    }

def extract_pull_request_data(payload):
    """Extract pull request event data"""
    action = payload.get('action', '')
    pr = payload.get('pull_request', {})
    
    # Map to frontend-expected actions
    if action == 'opened':
        mapped_action = 'pull_request'
    elif action == 'closed' and pr.get('merged', False):
        mapped_action = 'merge'
    else:
        mapped_action = 'pull_request'
    
    return {
        'request_id': str(pr.get('number', '')),
        'author': pr.get('user', {}).get('login', 'Unknown'),
        'action': mapped_action,  # lowercase to match frontend
        'from_branch': pr.get('head', {}).get('ref', ''),
        'to_branch': pr.get('base', {}).get('ref', ''),
    }

@app.route('/webhook', methods=['POST'])
def webhook():
    """Handle GitHub webhook events"""
    try:
        event_type = request.headers.get('X-GitHub-Event')
        payload = request.get_json()
        
        if not payload:
            return jsonify({'error': 'No payload received'}), 400
        
        event_data = None
        
        if event_type == 'push':
            event_data = extract_push_data(payload)
        elif event_type == 'pull_request':
            event_data = extract_pull_request_data(payload)
        else:
            # Skip unsupported events
            return jsonify({'status': 'skipped', 'event_type': event_type}), 200
        
        if not event_data:
            return jsonify({'error': 'Could not process event data'}), 400
        
        # Store event in database
        event_id = Event.create_event(
            request_id=event_data['request_id'],
            author=event_data['author'],
            action=event_data['action'],
            from_branch=event_data['from_branch'],
            to_branch=event_data['to_branch'],
            timestamp=datetime.utcnow()
        )
        
        return jsonify({
            'status': 'success',
            'event_id': event_id,
            'event_type': event_type
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/events', methods=['GET'])
def get_events():
    """Get all stored events"""
    try:
        limit = request.args.get('limit', 50, type=int)
        events = Event.get_all_events(limit=limit)
        
        return jsonify({
            'status': 'success',
            'events': events,
            'count': len(events)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/events/recent', methods=['GET'])
def get_recent_events():
    """Get recent events"""
    try:
        minutes = request.args.get('minutes', 60, type=int)
        events = Event.get_recent_events(minutes=minutes)
        
        return jsonify({
            'status': 'success',
            'events': events,
            'count': len(events)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'service': 'GitHub Webhook Monitor'
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)