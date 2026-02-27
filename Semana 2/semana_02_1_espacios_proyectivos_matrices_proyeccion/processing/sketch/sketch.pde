// ============================================================
//  Controles:
//    'p' → Proyección en Perspectiva
//    'o' → Proyección Ortográfica
// ============================================================

boolean usePerspective = true;
float   t              = 0;

void setup() {
  size(900, 600, P3D);
  colorMode(RGB, 255);
  textFont(createFont("SansSerif", 14, true));
}

void draw() {
  background(20, 20, 40);
  t += 0.01;

  // proyeccion
  applyProjection();

  // camara centrada en la escena
  camera(0, -100, 600,  
         0,    0,   0,  
         0,    1,   0);

  // luces
  ambientLight(60, 60, 90);
  directionalLight(255, 240, 200, -1, -1, -2);

  // objetos
  drawGroundGrid();
  drawCube();
  drawSphere();
  drawCone();

  drawHUD();
}

//  proyeccion
void applyProjection() {
  if (usePerspective) {
    float fov    = PI / 3.0;
    float aspect = float(width) / float(height);
    perspective(fov, aspect, 1, 5000);
  } else {
    float s = 2.8;
    ortho(-width / s, width / s,
          -height / s, height / s,
          1, 5000);
  }
}

//  objeto 1 cubo
void drawCube() {
  pushMatrix();
    translate(-200, 20, 0);
    rotateX(t * 0.7);
    rotateY(t * 1.0);
    fill(70, 130, 200);
    noStroke();
    box(100);
  popMatrix();
}

//  objeto 2 esfera
void drawSphere() {
  pushMatrix();
    translate(0, 0, 80);
    rotateY(t * 0.5);
    rotateZ(t * 0.3);
    fill(220, 80, 80);
    noStroke();
    sphere(75);
  popMatrix();
}

//  objeto 3 cono
void drawCone() {
  pushMatrix();
    translate(200, 30, -60);
    rotateX(t * 0.4 + PI);
    rotateZ(t * 0.6);
    fill(80, 200, 120);
    noStroke();
    drawConeShape(55, 150, 36);
  popMatrix();
}

void drawConeShape(float r, float h, int sides) {
  float step = TWO_PI / sides;

  // base
  beginShape(TRIANGLE_FAN);
    vertex(0, h / 2, 0);
    for (int i = 0; i <= sides; i++) {
      float a = i * step;
      vertex(cos(a) * r, h / 2, sin(a) * r);
    }
  endShape();

  // cara lateral
  beginShape(TRIANGLE_FAN);
    vertex(0, -h / 2, 0);
    for (int i = 0; i <= sides; i++) {
      float a = i * step;
      vertex(cos(a) * r, h / 2, sin(a) * r);
    }
  endShape();
}


void drawGroundGrid() {
  pushMatrix();
    translate(0, 150, 0);
    rotateX(HALF_PI);
    stroke(70, 70, 110);
    strokeWeight(1);
    noFill();
    int  cells    = 14;
    int  cellSize = 60;
    int  half     = cells / 2 * cellSize;
    for (int i = -cells / 2; i <= cells / 2; i++) {
      line(i * cellSize, -half, i * cellSize,  half);
      line(-half, i * cellSize,  half, i * cellSize);
    }
  popMatrix();
}

void drawHUD() {
  hint(DISABLE_DEPTH_TEST);

  // cambiar a proyección y cámara 2D
  ortho(0, width, 0, height, -1, 1);
  camera();
  noLights();

  fill(255, 220);
  noStroke();
  rect(10, 10, 275, 75, 8);

  fill(20);
  textSize(14);
  text("Proyección: " + (usePerspective ? "PERSPECTIVA (P3D)" : "ORTOGRÁFICA"), 22, 34);
  text("Tecla  'p'  →  Perspectiva", 22, 56);
  text("Tecla  'o'  →  Ortográfica", 22, 74);

  hint(ENABLE_DEPTH_TEST);
}

// teclado
void keyPressed() {
  if (key == 'p' || key == 'P') {
    usePerspective = true;
    println("Proyección: PERSPECTIVA");
  } else if (key == 'o' || key == 'O') {
    usePerspective = false;
    println("Proyección: ORTOGRÁFICA");
  }
}
