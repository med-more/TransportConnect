import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader"
import { MercatorCoordinate } from "maplibre-gl"

const GLB_URL = "/models/tracker.glb"
const MODEL_SCALE = 1.2
const MODEL_ROTATE_X = Math.PI / 2

/**
 * Creates a MapLibre custom layer that renders a 3D GLB model at lng/lat.
 * Uses Three.js with the map's WebGL context.
 * @param {Object} options
 * @param {[number, number]} options.position - [lng, lat]
 * @param {number} options.bearing - rotation in degrees (0 = North)
 * @param {maplibregl.Map} options.map
 * @returns {Object} CustomLayerInterface implementation
 */
export function createThreeMarkerLayer({ position, bearing = 0, map }) {
  const id = "three-marker-" + Math.random().toString(36).slice(2)
  let scene, camera, renderer, model, loader, mapRef
  let currentPosition = position ? [...position] : null
  let currentBearing = bearing

  const updatePosition = (lng, lat) => {
    currentPosition = lng != null && lat != null ? [lng, lat] : currentPosition
  }
  const updateBearing = (b) => {
    currentBearing = b
  }

  const customLayer = {
    id,
    type: "custom",
    renderingMode: "3d",

    onAdd(mapInstance, gl) {
      mapRef = mapInstance
      camera = new THREE.Camera()
      scene = new THREE.Scene()

      const light1 = new THREE.DirectionalLight(0xffffff, 1)
      light1.position.set(0, -1, 1).normalize()
      scene.add(light1)

      const light2 = new THREE.DirectionalLight(0xffffff, 0.8)
      light2.position.set(0, 1, 1).normalize()
      scene.add(light2)

      loader = new GLTFLoader()
      loader.load(
        GLB_URL,
        (gltf) => {
          model = gltf.scene
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true
              child.receiveShadow = true
            }
          })
          scene.add(model)
        },
        undefined,
        (err) => {
          console.warn("ThreeMarker: Failed to load GLB:", err)
        }
      )

      renderer = new THREE.WebGLRenderer({
        canvas: mapInstance.getCanvas(),
        context: gl,
        antialias: true,
      })
      renderer.autoClear = false
    },

    render(gl, matrix, options) {
      if (!currentPosition || !renderer || !scene) return

      const [lng, lat] = currentPosition
      const modelAltitude = 0

      const mc = MercatorCoordinate.fromLngLat([lng, lat], modelAltitude)
      const mercatorX = mc.x
      const mercatorY = mc.y
      const mercatorZ = mc.z
      const meterInMercator = mc.meterInMercatorCoordinateUnits()

      const bearingRad = (currentBearing * Math.PI) / 180

      const rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), MODEL_ROTATE_X)
      const rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), -bearingRad)
      const scale = meterInMercator * MODEL_SCALE

      const translation = new THREE.Matrix4().makeTranslation(mercatorX, mercatorY, mercatorZ)
      const scaleM = new THREE.Matrix4().makeScale(scale, -scale, scale)

      const modelMatrix = new THREE.Matrix4()
        .copy(translation)
        .multiply(scaleM)
        .multiply(rotationX)
        .multiply(rotationY)

      const mvp = options?.modelViewProjectionMatrix ?? matrix
      const m = new THREE.Matrix4().fromArray(mvp)
      const finalMatrix = new THREE.Matrix4().copy(m).multiply(modelMatrix)

      camera.projectionMatrix.copy(finalMatrix)
      renderer.resetState()
      renderer.render(scene, camera)
      if (mapRef) mapRef.triggerRepaint()
    },

    onRemove() {
      if (loader) loader.manager?.dispose?.()
      if (scene) {
        scene.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose()
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
            else obj.material.dispose()
          }
        })
      }
      scene = null
      camera = null
      renderer = null
      model = null
    },

    _updatePosition: updatePosition,
    _updateBearing: updateBearing,
  }

  return customLayer
}
