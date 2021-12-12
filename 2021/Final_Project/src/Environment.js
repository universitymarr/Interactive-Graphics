import * as THREE from '../libs/three_js/three.module.js';
import { GLTFLoader } from '../libs/loaders/GLTFLoader.js';
import { Utils } from './Utils.js'

const utils = new Utils();

class Environment{
    
    constructor(){
        this.gltfLoader = null;
        this.data_loaded = null;
        this.scene = null;

        this.floor = null;
        this.ceiling = null;

        this.wall_nord = null;
        this.wall_est = null;
        this.wall_west = null;

        this.base_dx = null;
        this.base_sx = null;

        this.chair = null;
        this.table_base = null;
        this.table_top = null;

        this.light_1 = null;
        this.light_2 = null;

        this.platform_light_1 = null;
        this.platform_base_1 = null;
        this.platform_top_1 = null;

        this.platform_light_2 = null;
        this.platform_base_2 = null;
        this.platform_top_2 = null;

        this.platform_light_3 = null;
        this.platform_base_3 = null;
        this.platform_top_3 = null;

        this.platform_light_4 = null;
        this.platform_base_4 = null;
        this.platform_top_4 = null;

        this.object_to_move = null;
    }

    async load(model_path){
        this.gltfLoader = new GLTFLoader();
        this.data_loaded = await this.gltfLoader.loadAsync(model_path);
        
        this.scene = this.data_loaded.scene; 
        this.scene.scale.set(100, 100, 100);
    }


    init(main_scene, walk_animation){
        this._init_parts();
        this._init_lights(main_scene);
        this._init_poster(main_scene)
        this._init_carpet(main_scene);

        this._setup_walk_space(walk_animation);

        main_scene.add(this.scene)
    }

    _init_parts(){
        //utils.print_dump_object(this.scene);
        this.floor = this.scene.getObjectByName('Floor');
        this.floor.material = new THREE.MeshPhongMaterial({color: 0xF0F8FF, specular:0xF0F8FF, shininess:1});
    
        this.ceiling = this.scene.getObjectByName('Ceiling');
        this.ceiling.material = new THREE.MeshPhongMaterial({color: 0x1E90FF}); 



        this.wall_nord = this.scene.getObjectByName('Wall_nord');
        this.wall_nord.material = new THREE.MeshPhongMaterial({color: 0x1E90FF}); 

        this.wall_est = this.scene.getObjectByName('Wall_est');
        this.wall_est.material = new THREE.MeshPhongMaterial({color: 0x1E90FF}); 

        this.wall_west = this.scene.getObjectByName('Wall_west');
        this.wall_west.material = new THREE.MeshPhongMaterial({color: 0x1E90FF}); 



        this.base_dx = this.scene.getObjectByName('Base_dx');
        this.base_dx.material = new THREE.MeshPhongMaterial({color: 0xFFFAF0, specular:0xFFFAF0, shininess:40}); 

        this.base_sx = this.scene.getObjectByName('Base_sx');
        this.base_sx.material = new THREE.MeshPhongMaterial({color: 0xFFFAF0, specular:0xFFFAF0, shininess:40}); 



        this.chair = this.scene.getObjectByName('Chair');
        this.chair.material = new THREE.MeshPhongMaterial({color: 0x2F4F4F, specular:0x2F4F4F, shininess:30}); 



        this.table_base = this.scene.getObjectByName('Table_base');
        this.table_base.material = new THREE.MeshPhongMaterial({color: 0x2F4F4F, specular:0x2F4F4F, shininess:40}); 

        this.table_top = this.scene.getObjectByName('Table_top');
        this.table_top.material = new THREE.MeshPhongMaterial({color: 0x2F4F4F, specular:0x2F4F4F, shininess:40}); 



        this.light_1 = this.scene.getObjectByName('Light_1');
        this.light_1.material = new THREE.MeshPhongMaterial({emissive: 0xFFFAF0}); 

        this.light_2 = this.scene.getObjectByName('Light_2');
        this.light_2.material = new THREE.MeshPhongMaterial({emissive: 0xFFFAF0}); 



        this.platform_light_1 = this.scene.getObjectByName('Platform_light_1');
        this.platform_light_1.material = new THREE.MeshPhongMaterial({emissive: 0xFFFAF0}); 

        this.platform_base_1 = this.scene.getObjectByName('Platform_base_1');
        this.platform_base_1.material = new THREE.MeshPhongMaterial({color: 0x333333, specular:0x333333, shininess:30}); 

        this.platform_top_1 = this.scene.getObjectByName('Platform_top_1');
        this.platform_top_1.material = new THREE.MeshPhongMaterial({color: 0x333333, specular:0x333333, shininess:30}); 
        

        this.platform_light_2 = this.scene.getObjectByName('Platform_light_2');
        this.platform_light_2.material = new THREE.MeshPhongMaterial({emissive: 0xFFFAF0}); 
        
        this.platform_base_2 = this.scene.getObjectByName('Platform_base_2');
        this.platform_base_2.material = new THREE.MeshPhongMaterial({color: 0x333333, specular:0x333333, shininess:30}); 
        
        this.platform_top_2 = this.scene.getObjectByName('Platform_top_2');
        this.platform_top_2.material = new THREE.MeshPhongMaterial({color: 0x333333, specular:0x333333, shininess:30}); 


        this.platform_light_3 = this.scene.getObjectByName('Platform_light_3');
        this.platform_light_3.material = new THREE.MeshPhongMaterial({emissive: 0xFFFAF0}); 

        this.platform_base_3 = this.scene.getObjectByName('Platform_base_3');
        this.platform_base_3.material = new THREE.MeshPhongMaterial({color: 0x333333, specular:0x333333, shininess:30}); 

        this.platform_top_3 = this.scene.getObjectByName('Platform_top_3');
        this.platform_top_3.material = new THREE.MeshPhongMaterial({color: 0x333333, specular:0x333333, shininess:30}); 


        this.platform_light_4 = this.scene.getObjectByName('Platform_light_4');
        this.platform_light_4.material = new THREE.MeshPhongMaterial({emissive: 0xFFFAF0}); 

        this.platform_base_4 = this.scene.getObjectByName('Platform_base_4');
        this.platform_base_4.material = new THREE.MeshPhongMaterial({color: 0x333333, specular:0x333333, shininess:30}); 

        this.platform_top_4 = this.scene.getObjectByName('Platform_top_4');
        this.platform_top_4.material = new THREE.MeshPhongMaterial({color: 0x333333, specular:0x333333, shininess:30}); 



        this.object_to_move = this.scene.getObjectByName('Sphere');
        this.object_to_move.material = new THREE.MeshPhongMaterial({color: 0xDC143C, specular:0xDC143C, shininess:5}); 

    
        //utils.print_dump_object(this.scene);
    }



    _setup_walk_space(walk_animation){
        let boxes = [];
    
        let box_1 = walk_animation.get_box_template();
        
        box_1.right_bottom.x = -469;
        box_1.right_bottom.z = -318;
        
        box_1.left_up.x = 489;
        box_1.left_up.z = -244;
        
        
        let box_2 = walk_animation.get_box_template();
        
        box_2.right_bottom.x = -469;
        box_2.right_bottom.z = 574;
        
        box_2.left_up.x = 489;
        box_2.left_up.z = 705;
    
    
        let box_3 = walk_animation.get_box_template();
        
        box_3.right_bottom.x = -469;
        box_3.right_bottom.z = 55;
        
        box_3.left_up.x = -200;
        box_3.left_up.z = 274;
    
    
        let box_4 = walk_animation.get_box_template();
        
        box_4.right_bottom.x = 200;
        box_4.right_bottom.z = 55;
        
        box_4.left_up.x = 489;
        box_4.left_up.z = 274;
    
    
        let box_5 = walk_animation.get_box_template();
        
        box_5.right_bottom.x = -360;
        box_5.right_bottom.z = -300;
        
        box_5.left_up.x = 360;
        box_5.left_up.z = -87;
    
    
        let box_6 = walk_animation.get_box_template();
        
        box_6.right_bottom.x = -200;
        box_6.right_bottom.z = 352;
        
        box_6.left_up.x = 360;
        box_6.left_up.z = 600;
    
    
        let box_7 = walk_animation.get_box_template();
        
        box_7.right_bottom.x = -360;
        box_7.right_bottom.z = -100;
        
        box_7.left_up.x = -139;
        box_7.left_up.z = 574;
    
    
        let box_8 = walk_animation.get_box_template();
    
        box_8.right_bottom.x = 139;
        box_8.right_bottom.z = -100;
        
        box_8.left_up.x = 360;
        box_8.left_up.z = 574;
    
    
    
        boxes.push(box_1);
        boxes.push(box_2);
        boxes.push(box_3);
        boxes.push(box_4);
        boxes.push(box_5);
        boxes.push(box_6);
        boxes.push(box_7);
        boxes.push(box_8);
    
        walk_animation.init(boxes);
    }

  
    _init_lights(main_scene){
        let scene = main_scene;
        // AMBIENT LIGHT ------------------------------------------------------------------------------
        const AMBIENT_LIGHT_COLOR = 0xFFFFFF;
        const AMBIENT_LIGHT_INTENSITY = 0.5;
        
        const ambient_light = new THREE.AmbientLight(AMBIENT_LIGHT_COLOR, AMBIENT_LIGHT_INTENSITY);
        scene.add(ambient_light)
        // ---------------------------------------------------------------------------------------------
    
        // CEILING LIGHTS ------------------------------------------------------------------------------
        const CEILING_LIGHT_COLOR = 0xFFFFFF;
        const CEILING_LIGHT_INTENSITY = 0.3;
    
        let ceiling_light_1 = new THREE.PointLight(CEILING_LIGHT_COLOR, CEILING_LIGHT_INTENSITY);
        this.light_1.getWorldPosition(ceiling_light_1.position); // set position of ceiling_light_1
        scene.add(ceiling_light_1);
    
        let ceiling_light_2 = new THREE.PointLight(CEILING_LIGHT_COLOR, CEILING_LIGHT_INTENSITY);
        this.light_2.getWorldPosition(ceiling_light_2.position); // set position of ceiling_light_2
        scene.add(ceiling_light_2);
        // ---------------------------------------------------------------------------------------
        
    
        // PLATFORM'S LIGHTS ------------------------------------------------------------------------------
        const PLATFORMS_LIGHT_COLOR = 0xffffff;
        const PLATFORMS_LIGHT_INTENSITY = 2.0;
        const PLATFORMS_LIGHT_DISTANCE = 800;
        const PLATFORMS_LIGHT_ANGLE = 0.2;
    
        const platform_light_1 = new THREE.SpotLight(PLATFORMS_LIGHT_COLOR, PLATFORMS_LIGHT_INTENSITY);
        platform_light_1.distance = PLATFORMS_LIGHT_DISTANCE;
        platform_light_1.angle = PLATFORMS_LIGHT_ANGLE;
        this.platform_light_1.getWorldPosition(platform_light_1.position);
        this.platform_light_1.getWorldPosition(platform_light_1.target.position);
        platform_light_1.target.position.y=0;
        scene.add(platform_light_1)
        scene.add(platform_light_1.target)
    
        const platform_light_2 = new THREE.SpotLight(PLATFORMS_LIGHT_COLOR, PLATFORMS_LIGHT_INTENSITY);
        platform_light_2.distance = PLATFORMS_LIGHT_DISTANCE;
        platform_light_2.angle = PLATFORMS_LIGHT_ANGLE;
        this.platform_light_2.getWorldPosition(platform_light_2.position);
        this.platform_light_2.getWorldPosition(platform_light_2.target.position);
        platform_light_2.target.position.y=0;
        scene.add(platform_light_2)
        scene.add(platform_light_2.target)
    
        const platform_light_3 = new THREE.SpotLight(PLATFORMS_LIGHT_COLOR, PLATFORMS_LIGHT_INTENSITY);
        platform_light_3.distance = PLATFORMS_LIGHT_DISTANCE;
        platform_light_3.angle = PLATFORMS_LIGHT_ANGLE;
        this.platform_light_3.getWorldPosition(platform_light_3.position);
        this.platform_light_3.getWorldPosition(platform_light_3.target.position);
        platform_light_3.target.position.y=0;
        scene.add(platform_light_3)
        scene.add(platform_light_3.target)
    
        const platform_light_4 = new THREE.SpotLight(PLATFORMS_LIGHT_COLOR, PLATFORMS_LIGHT_INTENSITY);
        platform_light_4.distance = PLATFORMS_LIGHT_DISTANCE;
        platform_light_4.angle = PLATFORMS_LIGHT_ANGLE;
        this.platform_light_4.getWorldPosition(platform_light_4.position);
        this.platform_light_4.getWorldPosition(platform_light_4.target.position);
        platform_light_4.target.position.y=0;
        scene.add(platform_light_4)
        scene.add(platform_light_4.target)
        // ---------------------------------------------------------------------------------------------------
    
    }

    _init_poster(main_scene){
        let scene = main_scene;

        const loader = new THREE.TextureLoader();
        
        const boxWidth = 1966*0.2;
        const boxHeight = 500*0.2;
        const boxDepth = 10;
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
       
        const materials = [
            new THREE.MeshPhongMaterial({color: 0xF0F8FF}),
    
            new THREE.MeshPhongMaterial({color: 0xF0F8FF}),
    
            new THREE.MeshPhongMaterial({color: 0xF0F8FF}),
    
            new THREE.MeshPhongMaterial({color: 0xF0F8FF}),
            // source gear https://www.subpng.com/png-2onktf/download.html
            new THREE.MeshPhongMaterial({map: loader.load('src/textures/logo.png')}),
    
            new THREE.MeshPhongMaterial({color: 0xF0F8FF}),
        ];
        const poster = new THREE.Mesh(geometry, materials);
        poster.position.set(0, 300, -380)
        scene.add(poster);
    }

    _init_carpet(main_scene){
        const loader = new THREE.TextureLoader();
    
        const base_color_map = loader.load('src/textures/carpet/Fabric_Knitted_004_basecolor.jpg')
        this._set_repeat_texture(base_color_map)
    
        const normal_map = loader.load('src/textures/carpet/Fabric_Knitted_004_normal.jpg')
        this._set_repeat_texture(normal_map)
    
        const height_map = loader.load('src/textures/carpet/Fabric_Knitted_004_height.png')
        this._set_repeat_texture(height_map)
    
        const roughness_map = loader.load('src/textures/carpet/Fabric_Knitted_004_roughness.jpg')
        this._set_repeat_texture(roughness_map)
    
    
        const ambent_occlusion = loader.load('src/textures/carpet/Fabric_Knitted_004_ambientOcclusion.jpg')
        this._set_repeat_texture(ambent_occlusion)
    
        
    
        const geometry =  new THREE.PlaneGeometry( 600, 900 );
       
        const materials = new THREE.MeshStandardMaterial(
            {
                map: base_color_map,
                normalMap: normal_map,
                displacementMap: height_map,
                //displacementScale:10,
                roughnessMap: roughness_map,
                //roughness:1,
                aoMap: ambent_occlusion
    
            });
        const carpet = new THREE.Mesh(geometry, materials);
        carpet.rotation.x = -Math.PI/2;
        carpet.position.set(0, 1, 150)
        main_scene.add(carpet);
    }

    _set_repeat_texture(texture){
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(3,3);
    }
}

export { Environment };

