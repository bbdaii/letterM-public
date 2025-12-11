import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import gsap from 'gsap'
import { NORMAL_SPEED, HOVER_SPEED } from './config.js'

export default class Three {
    constructor(canvas) {
        this.canvas = canvas
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
            pixelRatio: Math.min(window.devicePixelRatio, 2)
        }

        this.letterM = {}
        this.mouse = new THREE.Vector2()
        this.rotationZSpeed = 0.001 // 預設旋轉速度
        this.isHovering = false
        this.isSwitching = false

        this.setupScene()
        this.setupCamera()
        this.setupRaycaster()
        this.setupRenderer()
        this.init()
        this.resize()
        this.tick()
        this.setupEvents()
    }

    async init() {
        await this.loadEnvironment()
        await this.loadTextures()
        await this.setLoader()
        this.setupMesh()
    }



    /**
     * Scene
    */
    setupScene() {
        this.scene = new THREE.Scene()
        this.setupCamera()
        this.setupLight()
    }

    /**
     * Camera
    */
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.camera.position.set(0, 0, 8 * 2)
        this.scene.add(this.camera)

        // Controls
        this.controls = new OrbitControls(this.camera, this.canvas)
        this.controls.enableDamping = true
        this.controls.enablePan = false
        this.controls.enableZoom = false
        this.controls.enabled = false
    }


    /**
     * Light
     */
    setupLight() {
        this.directionalLight = new THREE.DirectionalLight('#ffffff', 3)
        this.directionalLight.position.set(0.25, 3, 2.25)
        this.hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        this.scene.add(this.directionalLight)
        this.scene.add(this.hemisphereLight)

        this.mouseLight = new THREE.PointLight('#ffffff', 20, 20) // 顏色、強度、距離
        this.mouseLight.position.set(0, 0, 2) // 初始位置
        this.scene.add(this.mouseLight)
    }

    /**
     * Raycaster
     */
    setupRaycaster() {
        this.raycaster = new THREE.Raycaster()
    }



    /**
     * Renderer
    */
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        })

        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(this.sizes.pixelRatio)
        // this.renderer.setClearAlpha(0)
        this.renderer.setClearColor('#dedede')
    }

    /**
     * Resize
     */
    resize() {
        // Update sizes
        this.sizes.width = window.innerWidth
        this.sizes.height = window.innerHeight
        this.sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

        // Update camera
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()

        // Update renderer
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(this.sizes.pixelRatio)


    }

    /**
    * Events
    */
    setupEvents() {
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1
            this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1
        })

        window.addEventListener('resize', () => {
            this.resize()
        })

        // 滑鼠滾輪事件
        window.addEventListener('wheel', (event) => {
            event.preventDefault()
            this.onWheel(event)
        }, { passive: false })

        // 滑鼠點擊事件
        window.addEventListener('click', (event) => {
            if (!this.letterM.mesh) return

            this.raycaster.setFromCamera(this.mouse, this.camera)
            const intersects = this.raycaster.intersectObject(this.letterM.mesh)

            if (intersects.length > 0) {
                this.onClick(event, intersects[0])
            }
        })
    }


    /**
     * Textures
     */
    async loadTextures() {
        const textureLoader = new THREE.TextureLoader()

        try {
            this.noiseTexture = await textureLoader.loadAsync('/texture/noise.webp')
            this.noiseTexture.wrapS = THREE.RepeatWrapping
            this.noiseTexture.wrapT = THREE.RepeatWrapping
            this.noiseTexture.colorSpace = THREE.SRGBColorSpace
            this.noiseTexture.repeat.set(20, 20)
            this.noiseLightTexture = await textureLoader.loadAsync('/texture/noise-light.webp')
            this.steelNormalTexture = await textureLoader.loadAsync('/texture/steel-normal.webp')
            this.frostedNormalTexture = await textureLoader.loadAsync('/texture/frosted-normal.webp')
            this.frostedGlassNormalTexture = await textureLoader.loadAsync('/texture/frosted-glass-normal.webp')
            this.marbleTexture = await textureLoader.loadAsync('/texture/marble.webp')

            console.log('紋理載入完成')
        } catch (error) {
            console.warn('紋理載入失敗', error)
        }
    }

    /**
     * Environment
     */
    async loadEnvironment() {
        const rgbeLoader = new RGBELoader()

        try {
            const environmentMap = await rgbeLoader.loadAsync('/warehouse.hdr')
            environmentMap.mapping = THREE.EquirectangularReflectionMapping

            this.scene.environment = environmentMap
            // this.scene.background = environmentMap
            this.environmentMap = environmentMap

            console.log('環境貼圖載入成功')
        } catch (error) {
            console.warn('環境貼圖載入失敗，使用預設環境', error)
        }
    }

    /**
     * Model
     */
    async setLoader() {
        this.loader = new GLTFLoader();
        this.dracoLoader = new DRACOLoader();
        this.dracoLoader.setDecoderPath('/draco/');
        this.loader.setDRACOLoader(this.dracoLoader);
        const gltf = await this.loader.loadAsync('/letter_m1.glb');

        if (gltf.scene?.children?.length > 0) {
            this.letterM.geometry = gltf.scene.children[0].geometry;

            this.letterM.materials = [
                // Material 01
                new THREE.MeshPhysicalMaterial({
                    color: 0x222222,
                    roughness: 0.1,
                    clearcoat: 1,
                    clearcoatRoughness: 0.1,
                    metalness: 1.0,
                    transmission: 1,
                    thickness: 0.5,
                    envMap: this.environmentMap,
                    envMapIntensity: 1,
                }),
                // Material 02
                new THREE.MeshPhysicalMaterial({
                    // color: 0xffffff,
                    roughness: 0.,
                    metalness: 0.,
                    transmission: 1,
                    thickness: 0.5,
                    envMap: this.environmentMap,
                    envMapIntensity: 1
                }),
                // Material 03
                new THREE.MeshStandardMaterial({
                    color: 0xbbbbbb,
                    roughness: 1.0,
                    metalness: 0.2,
                    envMap: this.environmentMap,
                    envMapIntensity: 0.5,
                    normalMap: this.frostedGlassNormalTexture,
                    normalScale: new THREE.Vector2(3.0, 3.0),
                    bumpMap: this.frostedGlassNormalTexture,
                    bumpScale: 5.0,
                    map: this.noiseTexture,
                    metalnessMap: this.noiseTexture,

                })
            ];

            this.letterM.currentMaterialIndex = 0;
        }
    }



    tick() {
        // Update controls
        this.controls.update()

        this.animate()

        // Update mouse light position
        if (this.mouseLight) {
            const vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5)
            vector.unproject(this.camera)
            vector.sub(this.camera.position).normalize()
            const distance = (0 - this.camera.position.z) / vector.z
            const pos = this.camera.position.clone().add(vector.multiplyScalar(distance))

            this.mouseLight.position.copy(pos)
            this.mouseLight.position.z = 3
        }
        // Render normal scene
        this.renderer.render(this.scene, this.camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(this.tick.bind(this))

        // Raycaster 
        if (this.letterM.mesh) {
            this.raycaster.setFromCamera(this.mouse, this.camera)
            const intersects = this.raycaster.intersectObject(this.letterM.mesh)

            if (intersects.length > 0) {
                if (!this.isHovering) {
                    this.isHovering = true
                    this.onEnter()
                }
            } else {
                if (this.isHovering) {
                    this.isHovering = false
                    this.onLeave()
                }
            }
        }

    }


    /**
    * Mesh
    */
    setupMesh() {
        this.letterM.mesh = new THREE.Mesh(
            this.letterM.geometry,
            this.letterM.materials[this.letterM.currentMaterialIndex]
        )
        this.letterM.mesh.position.set(0, 0, 0)
        this.letterM.mesh.scale.set(12, 12, 12)
        this.letterM.mesh.castShadow = true
        this.letterM.mesh.receiveShadow = true
        this.letterM.mesh.rotation.set(-Math.PI * 0.5, 0, -Math.PI * 0.5)
        this.scene.add(this.letterM.mesh)
    }

    animate() {
        if (!this.letterM.mesh) return
        this.letterM.mesh.rotation.z += this.rotationZSpeed
        const offsetStrength = 0.2
        this.letterM.mesh.position.x = -this.mouse.x * offsetStrength
        this.letterM.mesh.position.y = -this.mouse.y * offsetStrength
    }

    onEnter() {
        gsap.to(this, {
            rotationZSpeed: HOVER_SPEED,
            duration: 0.8,
            ease: 'power2.out'
        })
        // Cursor 變大
        const cursor = document.querySelector('.custom-cursor')
        if (cursor) cursor.classList.add('hover')
    }

    onLeave() {
        gsap.to(this, {
            rotationZSpeed: NORMAL_SPEED,
            duration: 0.8,
            ease: 'power2.out'
        })
        // Cursor 變回原本大小
        const cursor = document.querySelector('.custom-cursor')
        if (cursor) cursor.classList.remove('hover')
    }

    onWheel(event) {
        console.log('滑鼠在 Letter M 上滾動', {
            deltaY: event.deltaY,
            deltaX: event.deltaX,
            direction: event.deltaY > 0 ? '向下' : '向上'
        })
        this.switchAnimation()
    }

    onClick(event, intersect) {
        console.log('點擊 Letter M')
        this.switchAnimation()
    }

    /**
    * Material
    */
    switchMaterial() {
        if (!this.letterM.mesh || !this.letterM.materials) return
        this.letterM.currentMaterialIndex = (this.letterM.currentMaterialIndex + 1) % this.letterM.materials.length
        this.letterM.mesh.material = this.letterM.materials[this.letterM.currentMaterialIndex]

        console.log(`切換到材質 ${this.letterM.currentMaterialIndex + 1}/${this.letterM.materials.length}`)
    }

    switchAnimation() {
        if (!this.letterM.mesh || this.isSwitching) return

        const targetRotation = this.letterM.mesh.rotation.x + Math.PI * 2.0
        this.isSwitching = true

        const tl = gsap.timeline()
        tl
            .to(this.letterM.mesh.rotation, {
                x: targetRotation,
                duration: 0.5,
                ease: 'power2.out',
                onStart: () => {
                    this.switchMaterial()
                },
                onComplete: () => {
                    this.isSwitching = false
                }
            })
            .fromTo(this.letterM.mesh.position, {
                z: -10,
            }, {
                z: 0,
                duration: 0.5,
                ease: 'power2.inOut',
                overwrite: 'auto'
            }, "<")
    }

}

