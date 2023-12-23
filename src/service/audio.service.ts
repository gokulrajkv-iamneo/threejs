import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private audio!: THREE.Audio;
  private analyser!: THREE.AudioAnalyser;
  private particleSystem!: THREE.Points;

  constructor() {
    this.initScene();
  }

  private initScene(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.audio = new THREE.Audio(new THREE.AudioListener());
    this.analyser = new THREE.AudioAnalyser(this.audio, 32);

    this.camera.position.z = 1000;

    // Create a particle system
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;

      vertices.push(x, y, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({ size: 5, color: 0x00ff00 });
    this.particleSystem = new THREE.Points(geometry, material);

    this.scene.add(this.particleSystem);
  }

  playMusic(file: File): void {
    const audioLoader = new THREE.AudioLoader();

    audioLoader.load(URL.createObjectURL(file), (buffer) => {
      this.audio.setBuffer(buffer);
      this.audio.setLoop(false);
      this.audio.setVolume(1);
      this.audio.play();

      // Trigger the particle explosion effect when the music starts playing
      this.explodeParticles();

      this.animate(); // Start animation loop after audio starts playing
    });
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    // React to the audio beats and update the particle system accordingly
    this.updateParticles();

    this.renderer.render(this.scene, this.camera);
  }

  private explodeParticles(): void {
    // Modify the particle system for an explosion effect
    const positions = this.particleSystem.geometry.getAttribute('position') as THREE.BufferAttribute;

    for (let i = 0; i < positions.array.length; i += 3) {
      positions.array[i] *= 2; // Increase the x-coordinate to create an explosion effect
      positions.array[i + 1] *= 2; // Increase the y-coordinate to create an explosion effect
      positions.array[i + 2] *= 2; // Increase the z-coordinate to create an explosion effect
    }

    // Flag to update the buffer geometry
    positions.needsUpdate = true;
  }

  private updateParticles(): void {
    // Modify the particle system based on the audio beats
    // You can use the audio analyser to get information about the audio frequency
    // and adjust the particles accordingly
    const data = this.analyser.getFrequencyData();

    // Update particle positions based on the audio data
    const positions = this.particleSystem.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < positions.array.length; i += 3) {
      positions.array[i + 2] += data[i / 3] * 0.1; // Adjust the particle positions based on the audio data
    }

    // Flag to update the buffer geometry
    positions.needsUpdate = true;
  }
}
