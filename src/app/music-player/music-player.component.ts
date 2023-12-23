import { Component, NgZone } from '@angular/core';
import { AudioService } from '../../service/audio.service';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrl: './music-player.component.css'
})
export class MusicPlayerComponent {

  constructor(private audioService: AudioService) {}

  handleFileInput(event: any): void {
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      // Check if the first file is a directory
      if (files[0].type === '') {
        // Handle directory selection
        this.processDirectory(files[0]);
      } else {
        // Handle regular file selection
        this.processFiles(files);
      }
    }
  }

  processFiles(files: FileList): void {
    for (let i = 0; i < files.length; i++) {
      const file: File = files[i];
      // Process each file (e.g., play the music using the AudioService)
      this.audioService.playMusic(file);
    }
  }

  processDirectory(directory: any): void {
    // Handle directory selection (you might need to adjust this based on your requirements)
    console.log('Directory selected:', directory);
  }
}
