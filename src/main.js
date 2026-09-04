import * as THREE from 'three';
import './style.css';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function initHeroScene() {
  const stage = document.querySelector('[data-hero-scene]');
  const canvas = document.querySelector('#hero-canvas');
  if (!stage || !canvas) return;

  stage.tabIndex = 0;
  try {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.65));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
    camera.position.set(0, .2, 11.5);
    scene.add(new THREE.HemisphereLight(0xf2efe6, 0x151812, 2.1));
    const hotLight = new THREE.PointLight(0xff6534, 55, 20, 1.7);
    hotLight.position.set(-3.5, 3.4, 5.5);
    scene.add(hotLight);
    const leafLight = new THREE.PointLight(0xb7d548, 35, 18, 1.8);
    leafLight.position.set(4.5, -2.5, 4);
    scene.add(leafLight);

    const system = new THREE.Group();
    system.rotation.set(-.13, -.35, .03);
    scene.add(system);

    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x444b42, metalness: .82, roughness: .24 });
    const railGeometry = new THREE.BoxGeometry(.13, .13, 4.6);
    const postGeometry = new THREE.BoxGeometry(.13, 4.6, .13);
    [-1.65, 1.65].forEach((x) => {
      [-1.85, 1.85].forEach((y) => {
        const rail = new THREE.Mesh(railGeometry, frameMaterial);
        rail.position.set(x, y, 0);
        system.add(rail);
      });
      [-2.2, 2.2].forEach((z) => {
        const post = new THREE.Mesh(postGeometry, frameMaterial);
        post.position.set(x, 0, z);
        system.add(post);
      });
    });
    [-1.85, 1.85].forEach((y) => [-2.2, 2.2].forEach((z) => {
      const cross = new THREE.Mesh(new THREE.BoxGeometry(3.45, .13, .13), frameMaterial);
      cross.position.set(0, y, z);
      system.add(cross);
    }));

    const chamber = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 3.75, 4.5),
      new THREE.MeshPhysicalMaterial({ color: 0x222820, transparent: true, opacity: .2, metalness: .5, roughness: .25, transmission: .16, side: THREE.DoubleSide }),
    );
    system.add(chamber);
    const chamberEdges = new THREE.LineSegments(new THREE.EdgesGeometry(chamber.geometry), new THREE.LineBasicMaterial({ color: 0xf2efe6, transparent: true, opacity: .42 }));
    system.add(chamberEdges);

    const trays = new THREE.Group();
    for (let index = 0; index < 5; index += 1) {
      const tray = new THREE.Mesh(new THREE.BoxGeometry(2.75, .035, 3.6), new THREE.MeshStandardMaterial({ color: 0x7a8177, metalness: .8, roughness: .35, wireframe: true }));
      tray.position.y = -1.35 + index * .67;
      trays.add(tray);
    }
    system.add(trays);

    const fan = new THREE.Group();
    const fanRing = new THREE.Mesh(new THREE.TorusGeometry(.68, .045, 8, 72), new THREE.MeshBasicMaterial({ color: 0xff6534 }));
    fanRing.rotation.y = Math.PI / 2;
    fan.add(fanRing);
    for (let index = 0; index < 6; index += 1) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(.05, .55, .22), new THREE.MeshStandardMaterial({ color: 0xff6534, emissive: 0x5b1505, emissiveIntensity: 1 }));
      blade.position.y = .34;
      blade.rotation.z = index * Math.PI / 3;
      fan.add(blade);
    }
    fan.position.set(-1.72, 0, 0);
    fan.rotation.y = Math.PI / 2;
    system.add(fan);

    const fresh = new THREE.Group();
    const tomatoMaterial = new THREE.MeshStandardMaterial({ color: 0xe9431d, roughness: .64, metalness: .02 });
    const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x92b32e, roughness: .75 });
    for (let index = 0; index < 7; index += 1) {
      const tomato = new THREE.Mesh(new THREE.SphereGeometry(.32 + Math.random() * .08, 18, 14), tomatoMaterial);
      const angle = index * 2.4;
      tomato.scale.y = .86;
      tomato.position.set(Math.cos(angle) * .65, (index - 3) * .28, Math.sin(angle) * .52);
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(.15, .25, 5), leafMaterial);
      leaf.position.copy(tomato.position).add(new THREE.Vector3(0, .31, 0));
      leaf.rotation.z = Math.PI;
      fresh.add(tomato, leaf);
    }
    fresh.position.set(-3.5, 0, 0);
    system.add(fresh);

    const dried = new THREE.Group();
    const driedMaterial = new THREE.MeshStandardMaterial({ color: 0x9d2d10, roughness: .85, metalness: .02 });
    for (let index = 0; index < 22; index += 1) {
      const fragment = new THREE.Mesh(new THREE.IcosahedronGeometry(.12 + Math.random() * .13, 1), driedMaterial);
      fragment.scale.set(1.5, .48, 1);
      fragment.position.set((Math.random() - .5) * 1.4, (Math.random() - .5) * 2, (Math.random() - .5) * 1.2);
      fragment.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      dried.add(fragment);
    }
    dried.position.set(3.4, 0, 0);
    system.add(dried);

    const flowCount = innerWidth < 700 ? 220 : 520;
    const flowPositions = new Float32Array(flowCount * 3);
    for (let index = 0; index < flowCount; index += 1) {
      flowPositions[index * 3] = (Math.random() - .5) * 7.8;
      flowPositions[index * 3 + 1] = (Math.random() - .5) * 3.6;
      flowPositions[index * 3 + 2] = (Math.random() - .5) * 3.8;
    }
    const flowGeometry = new THREE.BufferGeometry();
    flowGeometry.setAttribute('position', new THREE.BufferAttribute(flowPositions, 3));
    const flow = new THREE.Points(flowGeometry, new THREE.PointsMaterial({ color: 0xff6534, size: .035, transparent: true, opacity: .72, blending: THREE.AdditiveBlending, depthWrite: false }));
    system.add(flow);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const drag = { active: false, x: 0, y: 0, rx: -.13, ry: -.35 };
    let processMix = .42;
    stage.addEventListener('pointermove', (event) => {
      const rect = stage.getBoundingClientRect();
      pointer.tx = ((event.clientX - rect.left) / rect.width - .5) * 2;
      pointer.ty = ((event.clientY - rect.top) / rect.height - .5) * 2;
      processMix = clamp((event.clientX - rect.left) / rect.width);
      if (drag.active) {
        drag.ry += (event.clientX - drag.x) * .008;
        drag.rx = clamp(drag.rx + (event.clientY - drag.y) * .008, -1.1, .7);
        drag.x = event.clientX;
        drag.y = event.clientY;
      }
    });
    stage.addEventListener('pointerdown', (event) => {
      drag.active = true;
      drag.x = event.clientX;
      drag.y = event.clientY;
      stage.classList.add('is-dragging');
      stage.setPointerCapture(event.pointerId);
    });
    const stopDrag = (event) => {
      drag.active = false;
      stage.classList.remove('is-dragging');
      if (event?.pointerId != null && stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    };
    stage.addEventListener('pointerup', stopDrag);
    stage.addEventListener('pointercancel', stopDrag);
    stage.addEventListener('pointerleave', () => { if (!drag.active) { pointer.tx = 0; pointer.ty = 0; } });
    stage.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') drag.ry -= .12;
      if (event.key === 'ArrowRight') drag.ry += .12;
      if (event.key === 'ArrowUp') drag.rx -= .12;
      if (event.key === 'ArrowDown') drag.rx += .12;
    });

    const resize = () => {
      const { width, height } = stage.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    new ResizeObserver(resize).observe(stage);
    resize();
    canvas.addEventListener('webglcontextlost', (event) => { event.preventDefault(); stage.classList.add('is-fallback'); });

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      pointer.x += (pointer.tx - pointer.x) * .055;
      pointer.y += (pointer.ty - pointer.y) * .055;
      const spin = reducedMotion ? 0 : elapsed * .07;
      system.rotation.y += ((drag.ry + spin + pointer.x * .12) - system.rotation.y) * .07;
      system.rotation.x += ((drag.rx - pointer.y * .1) - system.rotation.x) * .07;
      camera.position.x += (pointer.x * .55 - camera.position.x) * .04;
      camera.position.y += (-pointer.y * .38 + .2 - camera.position.y) * .04;
      camera.lookAt(0, 0, 0);
      fresh.position.x = -3.5 + processMix * 2.3;
      fresh.scale.setScalar(1 - processMix * .18);
      dried.position.x = 2.4 + processMix * 1.2;
      dried.scale.setScalar(.7 + processMix * .35);
      if (!reducedMotion) {
        fan.rotation.x += .035;
        const positions = flow.geometry.attributes.position.array;
        for (let index = 0; index < flowCount; index += 1) {
          positions[index * 3] += .014 + processMix * .018;
          if (positions[index * 3] > 4) positions[index * 3] = -4;
        }
        flow.geometry.attributes.position.needsUpdate = true;
        dried.rotation.y -= .002;
        hotLight.intensity = 50 + Math.sin(elapsed * 2) * 6;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    stage.classList.add('is-webgl');
    animate();
  } catch (error) {
    console.error('WebGL scene could not start.', error);
    stage.classList.add('is-fallback');
  }
}

const storyData = [
  ['Fresh tomato', 'Produce begins with its natural moisture intact.'],
  ['Loading the chamber', 'The batch is arranged for air to move across exposed surfaces.'],
  ['Temperature + humidity control', 'Process settings are selected for the material and required outcome.'],
  ['Moisture removal', 'Controlled heat and airflow carry moisture away from the product.'],
  ['Dehydrated tomato', 'The physical result is a lighter, lower-moisture ingredient.'],
  ['Food application', 'The dried ingredient can become flakes, powder, mixes, or other food formats.'],
];

function initStory() {
  const section = document.querySelector('[data-story]');
  if (!section || reducedMotion) return;
  const title = section.querySelector('[data-story-title]');
  const copy = section.querySelector('[data-story-copy]');
  const count = section.querySelector('[data-story-current]');
  const bar = section.querySelector('[data-story-bar]');
  const fresh = section.querySelector('.produce.fresh');
  const dried = section.querySelector('.produce.dried');
  const jar = section.querySelector('.product-jar');
  const chamber = section.querySelector('.chamber');
  const steps = [...section.querySelectorAll('.story-steps li')];
  let lastStep = -1;

  const update = () => {
    const rect = section.getBoundingClientRect();
    const distance = section.offsetHeight - innerHeight;
    const progress = clamp(-rect.top / distance);
    const step = Math.min(5, Math.floor(progress * 6));
    if (step !== lastStep) {
      [title, copy].forEach((element) => element.animate([{ opacity: .3, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 320, easing: 'ease-out' }));
      title.textContent = storyData[step][0];
      copy.textContent = storyData[step][1];
      count.textContent = String(step + 1).padStart(2, '0');
      steps.forEach((item, index) => item.classList.toggle('is-active', index === step));
      lastStep = step;
    }
    bar.style.width = `${progress * 100}%`;
    const freshProgress = clamp(progress / .5);
    fresh.style.transform = `translateX(${freshProgress * 410}%) scale(${1 - freshProgress * .32}) rotate(${freshProgress * 25}deg)`;
    fresh.style.filter = `saturate(${1 - freshProgress * .52}) brightness(${1 - freshProgress * .18})`;
    fresh.style.opacity = String(1 - clamp((progress - .55) / .12));
    chamber.style.boxShadow = `inset 0 0 0 1.2rem #c8c4b8, inset 0 0 ${progress * 65}px rgba(255,101,52,.72)`;
    dried.style.opacity = String(clamp((progress - .55) / .12) * (1 - clamp((progress - .84) / .1)));
    dried.style.transform = `translateX(${(1 - clamp((progress - .55) / .28)) * -170}%) scale(${.75 + progress * .25})`;
    const jarProgress = clamp((progress - .84) / .12);
    jar.style.opacity = String(jarProgress);
    jar.style.transform = `translateY(${(1 - jarProgress) * 3}rem)`;
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
}

function initSelector() {
  const form = document.querySelector('[data-selector]');
  if (!form) return;
  const range = form.querySelector('#capacity');
  const output = form.querySelector('[data-capacity-output]');
  const result = form.querySelector('[data-recommendation]');
  const copy = form.querySelector('[data-recommendation-copy]');
  const capacities = [100, 300, 500, 1200];
  const update = () => {
    const batch = Number(range.value);
    const material = new FormData(form).get('material');
    const match = capacities.find((capacity) => capacity >= batch) ?? 1200;
    output.value = `${batch} kg`;
    result.textContent = `${match} KG`;
    copy.textContent = `For an estimated ${batch} kg ${String(material).toLowerCase()} batch${batch > 1200 ? '; contact CES for review' : '.'}`;
    range.style.setProperty('--range-progress', `${((batch - 50) / 1150) * 100}%`);
  };
  form.addEventListener('input', update);
  update();
}

function initFilters() {
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-category]')];
  buttons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    buttons.forEach((item) => { item.classList.toggle('is-active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
    cards.forEach((card) => card.classList.toggle('is-hidden', filter !== 'all' && !card.dataset.category.split(' ').includes(filter)));
  }));
}

function initNavigation() {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  const close = () => { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); document.body.classList.remove('menu-open'); };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
  addEventListener('scroll', () => header.classList.toggle('is-scrolled', scrollY > 24), { passive: true });
}

function initReveals() {
  if (reducedMotion) return;
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
  }), { threshold: .11 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

initHeroScene();
initStory();
initSelector();
initFilters();
initNavigation();
initReveals();
document.querySelector('#year').textContent = new Date().getFullYear();
