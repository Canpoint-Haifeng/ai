import cv2
import numpy as np
import urllib.request
import tempfile

def preprocess_image(image):
    """Preprocess the image for digit recognition"""
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Apply Gaussian blur
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    # Apply threshold to get binary image
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    return thresh

def find_digit_contour(preprocessed_image):
    """Find the largest contour in the image (assumed to be the digit)"""
    contours, _ = cv2.findContours(preprocessed_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not contours:
        return None
    return max(contours, key=cv2.contourArea)

def recognize_digit(image_url):
    """Download and process image from URL to recognize digit"""
    try:
        # Download image from URL
        with tempfile.NamedTemporaryFile(delete=True) as tmp_file:
            urllib.request.urlretrieve(image_url, tmp_file.name)
            image = cv2.imread(tmp_file.name)
            
        if image is None:
            return None
            
        # Preprocess image
        preprocessed = preprocess_image(image)
        
        # Find digit contour
        digit_contour = find_digit_contour(preprocessed)
        if digit_contour is None:
            return None
            
        # Get bounding box
        x, y, w, h = cv2.boundingRect(digit_contour)
        
        # Extract digit region
        digit_region = preprocessed[y:y+h, x:x+w]
        
        # Resize to standard size (28x28 for MNIST-like recognition)
        digit_region = cv2.resize(digit_region, (28, 28))
        
        # TODO: Add actual digit recognition model here
        # For now, we'll return a placeholder
        return "Detected digit region successfully"
        
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return None
