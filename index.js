const decreaseBtn = document.getElementById('decreaseBtn');
const resetBtn = document.getElementById('ResetBtn');
const increaseBtn = document.getElementById('IncreaseBtn');
const countLabel = document.getElementById('countLabel');
let count = 0;

function updateDisplay() {
    countLabel.textContent = count;
    updateBackground(count);
    countLabel.classList.add('bump');
    setTimeout(() => countLabel.classList.remove('bump'), 150);
}


increaseBtn.onclick = function () {
    count++;
    updateDisplay();
    uniforms.u_count.value = count;
}

decreaseBtn.onclick = function () {
    count--;
    updateDisplay();
    uniforms.u_count.value = count;
}

resetBtn.onclick = function () {
    count = 0;
    updateDisplay();
    uniforms.u_count.value = count;
}

function updateBackground(value) {
    const hue = (value * 15) % 360;
    document.body.style.setProperty('--blobHue', hue);
    document.body.style.setProperty('--blobX', Math.sin(value * 0.1) * 10);
    document.body.style.setProperty('--blobY', Math.cos(value * 0.1) * 10);
}




// Setup scene
const scene = new THREE.Scene();
const camera = new THREE.Camera();
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bgCanvas'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Geometry and shader material
const geometry = new THREE.PlaneGeometry(2, 2);
const uniforms = {
    u_time: { value: 0.0 },
    u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    u_count: { value: 0.0 }
};

const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    fragmentShader: `
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform float u_count;

        void main() {
            vec2 st = gl_FragCoord.xy / u_resolution.xy;
            vec3 color = vec3(0.0);

            float wave = sin(st.x * 10.0 + u_time * 0.5 + u_count * 0.1) * 0.1;
            float wave2 = sin(st.y * 15.0 - u_time * 0.3 + u_count * 0.05) * 0.1;
            float pattern = wave + wave2;

            // Count affects color blend subtly
            color = mix(vec3(0.0, 0.2, 0.5), vec3(0.9, 0.3, 0.6), st.y + pattern + sin(u_count * 0.1) * 0.2);

            gl_FragColor = vec4(color, 0.6);
        }

    `,
    transparent: true
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    uniforms.u_time.value += 0.02;
    renderer.render(scene, camera);
}
animate();

// Resize handling
window.addEventListener('resize', () => {
    uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    renderer.setSize(window.innerWidth, window.innerHeight);
});
