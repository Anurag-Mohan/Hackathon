import sys
import json
import cv2
import os
from ultralytics import YOLO

# Models path relative to this script
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../../model/best.pt')

def analyze_image(image_path):
    if not os.path.exists(MODEL_PATH):
        return {"error": f"Model not found at {MODEL_PATH}"}
    
    try:
        model = YOLO(MODEL_PATH)
    except Exception as e:
        return {"error": f"Failed to load model: {str(e)}"}

    if not os.path.exists(image_path):
        return {"error": f"Image not found at {image_path}"}

    try:
        # Run inference with stricter NMS
        results = model(image_path, verbose=False, agnostic_nms=True, iou=0.5)
        
        violations = []
        raw_boxes = []

        for r in results:
            for box in r.boxes:
                # Get class and confidence
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                label = model.names[cls]
                
                # Check confidence threshold (increased to 0.40)
                if conf > 0.40:
                    xyxy = [int(x) for x in box.xyxy[0].tolist()]
                    
                    # Manual Duplicate Check (based on center distance)
                    center_x = (xyxy[0] + xyxy[2]) / 2
                    center_y = (xyxy[1] + xyxy[3]) / 2
                    
                    is_duplicate = False
                    for existing in raw_boxes:
                        ex_cx = (existing[0] + existing[2]) / 2
                        ex_cy = (existing[1] + existing[3]) / 2
                        
                        # Calculate distance between centers
                        dist = ((center_x - ex_cx)**2 + (center_y - ex_cy)**2)**0.5
                        
                        # If centers are very close (< 50 pixels), consider it a duplicate
                        if dist < 50: 
                            is_duplicate = True
                            break
                    
                    if not is_duplicate:
                        raw_boxes.append(xyxy)
                        violations.append({
                            "violation": True,
                            "type": label.replace('_', ' ').title(),
                            "confidence": round(conf, 2),
                            "box": xyxy
                        })
        
        return violations

    except Exception as e:
        return {"error": f"Analysis failed: {str(e)}"}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        sys.exit(1)
        
    image_path = sys.argv[1]
    
    # Run analysis
    try:
        results = analyze_image(image_path)
        print(json.dumps(results))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
