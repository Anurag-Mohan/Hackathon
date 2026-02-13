import sys
import json
import cv2
import time
import os
from ultralytics import YOLO

# Models path relative to this script
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../../model/best.pt')
SNAPSHOT_DIR = os.path.join(os.path.dirname(__file__), '../uploads/snapshots')

# Ensure snapshot directory exists
os.makedirs(SNAPSHOT_DIR, exist_ok=True)

def analyze_video(video_path):
    if not os.path.exists(MODEL_PATH):
        return {"error": f"Model not found at {MODEL_PATH}"}
    
    try:
        model = YOLO(MODEL_PATH)
    except Exception as e:
        return {"error": f"Failed to load model: {str(e)}"}

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return {"error": "Could not open video file"}

    violations = []
    frame_count = 0
    # Process every 30th frame (approx every 1 second)
    sample_rate = 30
    
    start_time = time.time()
    max_duration = 600 # Run for max 10 minutes to simulate continuous monitoring
    loop_count = 0
    # No max_loops limit - continuous looping for CCTV simulation

    while True:
        ret, frame = cap.read()
        if not ret:
            # End of video, loop back to simulate continuous CCTV feed
            loop_count += 1
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue
            
        frame_count += 1
        if frame_count % sample_rate != 0:
            continue

        # Check timeout
        if time.time() - start_time > max_duration:
            break

        # Run inference
        results = model(frame, verbose=False)
        
        for r in results:
            for box in r.boxes:
                # Get class and confidence
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                label = model.names[cls]
                
                # Check confidence threshold (adjust as needed)
                if conf > 0.25:
                    # Found a violation! Save snapshot.
                    timestamp = int(time.time() * 1000)
                    filename = f"violation_{timestamp}_{frame_count}.jpg"
                    filepath = os.path.join(SNAPSHOT_DIR, filename)
                    
                    # Draw bounding box on frame for the snapshot
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                    cv2.putText(frame, f"{label} {conf:.2f}", (x1, y1 - 10), 
                                cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)
                    
                    cv2.imwrite(filepath, frame)
                    
                    # Map generic labels to specific violation types if needed
                    violation_type = label.replace('_', ' ').title()
                    
                    violations.append({
                        "violation": True,
                        "type": violation_type,
                        "severity": "High" if conf > 0.7 else "Medium",
                        "snapshot": f"/uploads/snapshots/{filename}"
                    })
                    
                    # Limit to one violation per frame to avoid duplicates
                    # Return immediately after finding violations to update DB quickly
                    if len(violations) >= 10: # Return after finding 10 violations per cycle
                        cap.release()
                        return violations

    cap.release()
    return violations

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No video path provided"}))
        sys.exit(1)
        
    video_path = sys.argv[1]
    
    # Run analysis
    try:
        results = analyze_video(video_path)
        # Ensure we return a list, even if empty or single dict error
        if isinstance(results, dict) and "error" in results:
             print(json.dumps(results))
        else:
             print(json.dumps(results))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
