import sys
import json
import random

# Mocking YOLOv8 logic for now since we don't have the model file yet.
# In production, this would load 'best.pt' and process frame.

def analyze_frame(video_path):
    # Simulate processing
    # Randomly decide if there is a violation
    is_violation = random.choice([True, False, False, False]) # 25% chance
    
    if is_violation:
        violation_types = ["No Mask", "No Gloves", "Dirty Floor", "Pest Detected"]
        severity_levels = ["Low", "Medium", "High"]
        
        return {
            "violation": True,
            "type": random.choice(violation_types),
            "severity": random.choice(severity_levels),
            "snapshot": f"/uploads/snapshots/mock_{random.randint(1000,9999)}.jpg" # Placeholder path
        }
    else:
        return {"violation": False}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No video path provided"}))
        sys.exit(1)
        
    video_path = sys.argv[1]
    result = analyze_frame(video_path)
    print(json.dumps(result))
