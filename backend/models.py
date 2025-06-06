from datetime import datetime, timedelta
from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGO_URI)
db = client.github_monitor
events_collection = db.events

class Event:
    @staticmethod
    def create_event(request_id, author, action, from_branch=None, to_branch=None, timestamp=None):
        """Create a new event document"""
        if timestamp is None:
            timestamp = datetime.utcnow()
        
        timestamp_str = timestamp.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
        
        event_doc = {
            'request_id': request_id,
            'author': author,
            'action': action,
            'from_branch': from_branch,
            'to_branch': to_branch,
            'timestamp': timestamp_str
        }
        
        result = events_collection.insert_one(event_doc)
        return str(result.inserted_id)
    
    @staticmethod
    def get_all_events(limit=50):
        """Get all events sorted by timestamp (most recent first)"""
        events = events_collection.find().sort('timestamp', -1).limit(limit)
        event_list = []
        for event in events:
            event['_id'] = str(event['_id'])
            event_list.append(event)
        return event_list
    
    @staticmethod
    def get_recent_events(minutes=60):
        """Get events from the last N minutes"""
        cutoff_time = datetime.utcnow() - timedelta(minutes=minutes)
        cutoff_time_str = cutoff_time.strftime('%Y-%m-%dT%H:%M:%S.%fZ')
        
        events = events_collection.find({
            'timestamp': {'$gte': cutoff_time_str}
        }).sort('timestamp', -1)
        
        event_list = []
        for event in events:
            event['_id'] = str(event['_id'])
            event_list.append(event)
        return event_list