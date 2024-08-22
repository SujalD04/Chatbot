import cv2
import os

def check(word):
    valid_words = {"good", "bad", "ok", "need replacement", "low", "yes", "no"}
    
    

    if word.lower() in valid_words:
        # Create the 'images' directory if it doesn't exist
        image_folder = "images"
        if not os.path.exists(image_folder):
            os.makedirs(image_folder)
        
        # Open the device's camera
        cap = cv2.VideoCapture(0)
        
        if not cap.isOpened():
            print("Error: Could not open camera.")
            return
        
        print("Camera is now open. Press 's' to save an image or 'q' to quit without saving.")
        
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Failed to grab frame.")
                break
            
            cv2.imshow("Camera", frame)
            
            key = cv2.waitKey(1) & 0xFF
            if key == ord('s'):
                # Save the image in the 'images' folder
                image_path = os.path.join(image_folder, "captured_image.png")
                cv2.imwrite(image_path, frame)
                print(f"Image saved at {image_path}")
            elif key == ord('q'):
                break
        
        cap.release()
        cv2.destroyAllWindows()
    else:
        print(f"'{word}' is not a valid word.")
    
    return "How are you?"