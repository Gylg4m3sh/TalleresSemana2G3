"""Captura imágenes del patrón de ajedrez con la webcam."""
import cv2
import os

os.makedirs('../calibration_images', exist_ok=True)
cap = cv2.VideoCapture(0)
count = 0

print("Presiona ESPACIO para capturar, Q para salir")
print(f"Captura al menos 10 imágenes desde diferentes ángulos")

while True:
    ret, frame = cap.read()
    if not ret:
        break
    
    cv2.putText(frame, f'Capturas: {count} | ESPACIO=capturar Q=salir',
                (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    cv2.imshow('Calibración - Muestra el patrón de ajedrez', frame)
    
    key = cv2.waitKey(1) & 0xFF
    if key == ord(' '):
        fname = f'../calibration_images/calib_{count:03d}.jpg'
        cv2.imwrite(fname, frame)
        print(f"Guardado: {fname}")
        count += 1
    elif key == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
print(f"Total capturas: {count}")