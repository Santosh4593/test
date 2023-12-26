
import cv2
import csv
import collections
import numpy as np
from tracker import *
import os

# Initialize Tracker
tracker = EuclideanDistTracker()

def find_center(x, y, w, h):
    x1=int(w/2)
    y1=int(h/2)
    cx = x+x1
    cy=y+y1
    return cx, cy
    
# List for store vehicle count information
temp_up_list = []
temp_down_list = []
up_list = [0, 0, 0, 0]
down_list = [0, 0, 0, 0]





def count_vehicle(box_id, img):

    x, y, w, h, id, index = box_id

    # Find the center of the rectangle for detection
    center = find_center(x, y, w, h)
    ix, iy = center
    
    # Find the current position of the vehicle
    if (iy > up_line_position) and (iy < middle_line_position):

        if id not in temp_up_list:
            temp_up_list.append(id)

    elif iy < down_line_position and iy > middle_line_position:
        if id not in temp_down_list:
            temp_down_list.append(id)
            
    elif iy < up_line_position:
        if id in temp_down_list:
            temp_down_list.remove(id)
            up_list[index] = up_list[index]+1

    elif iy > down_line_position:
        if id in temp_up_list:
            temp_up_list.remove(id)
            down_list[index] = down_list[index] + 1

    # Draw circle in the middle of the rectangle
    cv2.circle(img, center, 2, (0, 0, 255), -1)  # end here
    # print(up_list, down_list)



def postProcess(outputs,img):
    global detected_classNames 
    height, width = img.shape[:2]
    boxes = []
    classIds = []
    confidence_scores = []
    detection = []
    for output in outputs:
        for det in output:
            scores = det[5:]
            classId = np.argmax(scores)
            confidence = scores[classId]
            if classId in required_class_index:
                if confidence > confThreshold:
                    # print(classId)
                    w,h = int(det[2]*width) , int(det[3]*height)
                    x,y = int((det[0]*width)-w/2) , int((det[1]*height)-h/2)
                    boxes.append([x,y,w,h])
                    classIds.append(classId)
                    confidence_scores.append(float(confidence))

    # Apply Non-Max Suppression
    indices = cv2.dnn.NMSBoxes(boxes, confidence_scores, confThreshold, nmsThreshold)
    # print(classIds)
    for i in indices.flatten():
        x, y, w, h = boxes[i][0], boxes[i][1], boxes[i][2], boxes[i][3]
        # print(x,y,w,h)

        color = [int(c) for c in colors[classIds[i]]]
        name = classNames[classIds[i]]
        detected_classNames.append(name)
        # Draw classname and confidence score 
        cv2.putText(img,f'{name.upper()} {int(confidence_scores[i]*100)}%',
                  (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)

        # Draw bounding rectangle
        cv2.rectangle(img, (x, y), (x + w, y + h), color, 1)
        detection.append([x, y, w, h, required_class_index.index(classIds[i])])

    # Update the tracker for each object
    boxes_ids = tracker.update(detection)
    for box_id in boxes_ids:
        count_vehicle(box_id, img)




def count(path):

    video_path = os.path.abspath(path)

    if not os.path.exists(video_path):
        print(f"Error: Video file '{video_path}' does not exist.")
    else:
    # Continue with video capture initialization
        cap = cv2.VideoCapture(video_path)

    input_size = 320

    # Detection confidence threshold
    confThreshold =0.2
    nmsThreshold= 0.2

    font_color = (0, 0, 255)
    font_size = 0.5
    font_thickness = 2

    # Middle cross line position
    middle_line_position = 225   
    up_line_position = middle_line_position - 15
    down_line_position = middle_line_position + 15


    # Store Coco Names in a list
    classesFile = "coco.names"
    classNames = open(classesFile).read().strip().split('\n')
    print(classNames)
    print(len(classNames))

    # class index for our required detection classes
    required_class_index = [2, 3, 5, 7]

    detected_classNames = []

    ## Model Files
    modelConfiguration = 'yolov3-320.cfg'
    modelWeigheights = 'yolov3-320.weights'

    # configure the network model
    net = cv2.dnn.readNetFromDarknet(modelConfiguration, modelWeigheights)

    # Configure the network backend

    net.setPreferableBackend(cv2.dnn.DNN_BACKEND_CUDA)
    net.setPreferableTarget(cv2.dnn.DNN_TARGET_CUDA)

    # Define random colour for each class
    np.random.seed(42)
    colors = np.random.randint(0, 255, size=(len(classNames), 3), dtype='uint8')

    postProcess(outputs,img)
    
