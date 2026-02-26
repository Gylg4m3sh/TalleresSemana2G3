using UnityEngine;
using UnityEngine.UI;

public class CameraProjectionToggle : MonoBehaviour
{
    public Camera cam;
    public Text buttonText;

    void Start()
    {
        if (cam == null)
            cam = Camera.main;

        UpdateButtonText();
    }

    public void ToggleProjection()
    {
        cam.orthographic = !cam.orthographic;

        if (cam.orthographic)
        {
            cam.orthographicSize = 5f; // Ajusta tamaño en ortográfica
        }

        Debug.Log("Matriz de Proyección:\n" + cam.projectionMatrix);

        UpdateButtonText();
    }

    void UpdateButtonText()
    {
        if (cam.orthographic)
            buttonText.text = "Modo: Ortográfica";
        else
            buttonText.text = "Modo: Perspectiva";
    }
}