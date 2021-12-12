import * as THREE from '../build/three.module.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';


class Environment{
    
    constructor(){
        this.gltfLoader = null;
        this.data_loaded = null;
        this.model_room = null;
        this.scene_room = null;

        this.scene = null;
        this.light = null;
    }

    async load(model_path){
        this.gltfLoader = new GLTFLoader();
        this.data_loaded = await this.gltfLoader.loadAsync(model_path);
        this.scene_room = this.data_loaded.scene;  
        this.model_room = this.scene_room.getObjectByName('Cube');

        this.scene = new THREE.Object3D();
        this.scene_room.scale.set(70, 70, 70);
        this.scene.add(this.scene_room);
    }

    init(){
        const color = 0xFFFFFF;
        const intensity = 0.5;

        this.light = new THREE.PointLight(color, intensity);
        this.light.position.set(0, 500, 0);
    
        const size = 10;
        this.light_helper = new THREE.PointLightHelper(this.light, size);

        this.scene.add(this.light);
        this.scene.add(this.light_helper);
    }
}

export { Environment };

