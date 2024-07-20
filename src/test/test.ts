// Constantes e condições iniciais
const G = 6.674 * Math.pow(10, -11);   // Constante gravitacional em m^3 kg^-1 s^-2
const M = 5.972 * Math.pow(10, 24);    // Massa do corpo central (planeta) em kg (ex: Terra)
const m = 1.0 * Math.pow(10, 6);       // Massa do corpo em órbita em kg
const R = [0, 0, 0];                   // Posição do corpo central [x, y, z]
const dt = 200;                         // Intervalo de tempo em segundos


// Função para calcular a magnitude de um vetor
function magnitude(vec) {
  return Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
}

// Função para subtrair dois vetores
function subtractVectors(vec1, vec2) {
  return vec1.map((val, index) => val - vec2[index]);
}

// Função para adicionar dois vetores
function addVectors(vec1, vec2) {
  return vec1.map((val, index) => val + vec2[index]);
}

// Função para multiplicar vetor por um escalar
function multiplyVectorByScalar(vec, scalar) {
  return vec.map(val => val * scalar);
}

// Função para normalizar um vetor
function normalize(vec) {
  const mag = magnitude(vec);
  return mag === 0 ? vec : multiplyVectorByScalar(vec, 1 / mag);
}

// Função de simulação numérica
export function calculatePositions(r, v) {

  // Calcular o vetor de força gravitacional
  let r_vec = subtractVectors(r, R);
  let r_mag = magnitude(r_vec);

  // Calcular a força gravitacional
  let F_g = G * M * m / Math.pow(r_mag, 2);

  // Calcular a aceleração na direção oposta ao vetor de posição
  let a = multiplyVectorByScalar(normalize(r_vec), -F_g / m);

  // Atualizar velocidade e posição
  v = addVectors(v, multiplyVectorByScalar(a, dt));
  r = addVectors(r, multiplyVectorByScalar(v, dt));

  return { 
    x: r[0], 
    y: r[1], 
    z: r[2],
    vx: v[0], 
    vy: v[1], 
    vz: v[2],
  };
}

