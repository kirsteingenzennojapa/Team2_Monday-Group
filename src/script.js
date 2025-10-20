import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import gsap from 'gsap'
import * as dat from 'lil-gui'

/**
 * Base
 */


/**
 * Texture with Loading Manager
 */
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
  console.log(`🔄 Started loading: ${url} (${itemsLoaded}/${itemsTotal})`)
}
loadingManager.onLoad = () => {
  console.log('✅ All resources loaded successfully')
}
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  console.log(`⏳ Loading file: ${url} (${itemsLoaded}/${itemsTotal})`)
}
loadingManager.onError = (url) => {
  console.log(`❌ Error loading: ${url}`)
}

// ✅ Use the manager with TextureLoader
const textureLoader = new THREE.TextureLoader(loadingManager)

// Example matcap texture
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')


/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl')

/**
 * Scene
 */
const scene = new THREE.Scene()


/**
 * Objects: all geometries
 */
const cubes = []

function addGeometry(geometry, x, y, z, color = 0x88ff88) {
  const material = new THREE.MeshPhongMaterial({
    color,
    emissive: 0x222222,
    shininess: 120
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x, y, z)
  scene.add(mesh)
  cubes.push(mesh) 
}

addGeometry(new THREE.BoxGeometry(1, 1, 1), -10, 5, 0, 0x66ff66)
addGeometry(new THREE.PlaneGeometry(1.5, 1.5), -7, 5, 0, 0x99ccff)
addGeometry(new THREE.CircleGeometry(0.7, 32), -4, 5, 0, 0xff9999)
addGeometry(new THREE.ConeGeometry(0.7, 1.2, 32), -1, 5, 0, 0xffff99)
addGeometry(new THREE.CylinderGeometry(0.6, 0.6, 1.2, 32), 2, 5, 0, 0xccffcc)
addGeometry(new THREE.RingGeometry(0.4, 0.8, 32), 5, 5, 0, 0xffcc99)
addGeometry(new THREE.TorusGeometry(0.6, 0.2, 16, 100), 8, 5, 0, 0x99ffff)
addGeometry(new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16), 11, 5, 0, 0xff99ff)
addGeometry(new THREE.DodecahedronGeometry(0.8), -10, 2, 0, 0xffccff)
addGeometry(new THREE.OctahedronGeometry(0.8), -7, 2, 0, 0xccccff)
addGeometry(new THREE.IcosahedronGeometry(0.8), -4, 2, 0, 0xccff99)
addGeometry(new THREE.SphereGeometry(0.8, 32, 32), -1, 2, 0, 0xff9966)

// ShapeGeometry (heart)
const shape = new THREE.Shape()
shape.moveTo(0, 0)
shape.bezierCurveTo(0, 0.5, -0.5, 0.5, -0.5, 0)
shape.bezierCurveTo(-0.5, -0.5, 0, -0.5, 0, -0.2)
shape.bezierCurveTo(0, -0.5, 0.5, -0.5, 0.5, 0)
shape.bezierCurveTo(0.5, 0.5, 0, 0.5, 0, 0)
addGeometry(new THREE.ShapeGeometry(shape), 2, 2, 0, 0xff6666)

// TubeGeometry (spiral)
const path = new THREE.Curve()
path.getPoint = (t) => {
  const a = 2 * Math.PI * t
  return new THREE.Vector3(Math.sin(a), Math.cos(a), t * 2 - 1)
}
addGeometry(new THREE.TubeGeometry(path, 64, 0.2, 8, false), 5, 2, 0, 0x66ffff)

// ExtrudeGeometry (star)
const star = new THREE.Shape()
star.moveTo(0, 0.5)
for (let i = 1; i <= 5; i++) {
  const angle = (i * 4 * Math.PI) / 5
  star.lineTo(Math.sin(angle) * 0.5, Math.cos(angle) * 0.5)
}
addGeometry(new THREE.ExtrudeGeometry(star, { depth: 0.2, bevelEnabled: true }), 8, 2, 0, 0xffff66)

// LatheGeometry
const points = []
for (let i = 0; i < 10; i++) {
  points.push(new THREE.Vector2(Math.sin(i * 0.2) * 0.3 + 0.5, (i - 5) * 0.2))
}
addGeometry(new THREE.LatheGeometry(points, 32), 11, 2, 0, 0x66ffcc)


/**
 * Donuts (many scattered)
 */
const donuts = []
const donutGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100)
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

for (let i = 0; i < 100; i++) {
  const donutMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffaa88,
    emissive: 0x442222,
    shininess: 120
  })
  const donut = new THREE.Mesh(donutGeometry, donutMaterial)

  donut.position.x = (Math.random() - 0.5) * 20
  donut.position.y = (Math.random() - 0.5) * 20
  donut.position.z = (Math.random() - 0.5) * 20

  donut.rotation.x = Math.random() * Math.PI
  donut.rotation.y = Math.random() * Math.PI

  const scale = Math.random() * 0.5 + 0.2
  donut.scale.set(scale, scale, scale)

  scene.add(donut)
  donuts.push(donut)
}


/**
 * Fonts + Text
 */
const texts = []
const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

const fontLoader = new FontLoader()
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
  const names = [
    'Markjohn Bongcayao',
    'Ralph Jhon Badaran',
    'Kirstein Genzen Nojapa'
  ]

  names.forEach((name, index) => {
    const textGeometry = new TextGeometry(name, {
      font: font,
      size: 0.6,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.01,
      bevelSegments: 3
    })
    textGeometry.center()

    const textMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffff99,
      emissive: 0x444422,
      shininess: 120
    })

    const textMesh = new THREE.Mesh(textGeometry, textMaterial)
    textMesh.position.set(0, 3 - index * 1.5, 0)

    scene.add(textMesh)
    texts.push(textMesh)
  })
})



/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 3)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 2)
pointLight.position.set(5, 5, 5)
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 2, 15)
scene.add(camera)

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Debug GUI
 */
const gui = new dat.GUI()

// ✅ Cubes controller
const cubeParams = {
  color: cubes[0].material.color.getHex(),
  spin: () => cubes.forEach(c => gsap.to(c.rotation, { y: c.rotation.y + Math.PI * 2, duration: 1 }))
}
const cubeFolder = gui.addFolder('Cubes')
cubeFolder.add(cubes[0].position, 'x', -5, 5, 0.01).name('Position X').onChange(val => cubes.forEach(c => c.position.x = val))
cubeFolder.add(cubes[0].position, 'y', -5, 5, 0.01).name('Position Y').onChange(val => cubes.forEach(c => c.position.y = val))
cubeFolder.add(cubes[0].position, 'z', -5, 5, 0.01).name('Position Z').onChange(val => cubes.forEach(c => c.position.z = val))
cubeFolder.addColor(cubeParams, 'color').onChange(val => cubes.forEach(c => c.material.color.set(val)))
cubeFolder.add(cubeParams, 'spin').name('Spin All')

// ✅ Donuts controller
const donutParams = {
  color: donuts[0].material.color.getHex(),
  spin: () => donuts.forEach(d => gsap.to(d.rotation, { y: d.rotation.y + Math.PI * 2, duration: 1 }))
}
const donutFolder = gui.addFolder('Donuts')
donutFolder.add(donuts[0].position, 'x', -5, 5, 0.01).name('Position X').onChange(val => donuts.forEach(d => d.position.x = val))
donutFolder.add(donuts[0].position, 'y', -5, 5, 0.01).name('Position Y').onChange(val => donuts.forEach(d => d.position.y = val))
donutFolder.add(donuts[0].position, 'z', -5, 5, 0.01).name('Position Z').onChange(val => donuts.forEach(d => d.position.z = val))
donutFolder.addColor(donutParams, 'color').onChange(val => donuts.forEach(d => d.material.color.set(val)))
donutFolder.add(donutParams, 'spin').name('Spin All')

// ✅ Texts controller
const textParams = {
  color: 0xffff99,
  spin: () => texts.forEach(t => gsap.to(t.rotation, { y: t.rotation.y + Math.PI * 2, duration: 1 }))
}
const textFolder = gui.addFolder('Texts')
textFolder.add(texts, 'length').name('Texts Count').listen()
textFolder.addColor(textParams, 'color').onChange(val => texts.forEach(t => t.material.color.set(val)))
textFolder.add(textParams, 'spin').name('Spin All')
textFolder.add({ x: 0 }, 'x', -5, 5, 0.01).name('Position X').onChange(val => texts.forEach(t => t.position.x = val))
textFolder.add({ y: 0 }, 'y', -5, 5, 0.01).name('Position Y').onChange(val => texts.forEach(t => t.position.y = val))
textFolder.add({ z: 0 }, 'z', -5, 5, 0.01).name('Position Z').onChange(val => texts.forEach(t => t.position.z = val))

// ✅ Global wireframe
const globalSettings = { wireframe: false }
gui.add(globalSettings, 'wireframe').name('Wireframe (All)').onChange((val) => {
  [...cubes, ...donuts, ...texts].forEach(obj => {
    if (obj.material) obj.material.wireframe = val
  })
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  cubes.forEach(cube => {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
  })

  donuts.forEach(donut => {
    donut.rotation.x += 0.01
    donut.rotation.y += 0.01
  })

  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()
