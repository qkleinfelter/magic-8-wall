import { HttpClient } from '@angular/common/http';
import { Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected client = inject(HttpClient);

  // user input
  protected prompt = model('');

  // pastel colors for sticky notes
  private colors = ['#FFFB7D', '#FFD1DC', '#B0E0E6', '#BDECB6', '#FFDEAD'];

  // track 20 notes
  protected notes = Array.from({ length: 50 }, () => {
    const rotation = Math.random() * 20 - 10; // -10 to 10 degrees
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    const offsetX = Math.random() * 20 - 10; // -10px to 10px horizontal offset
    const offsetY = Math.random() * 20 - 10; // -10px to 10px vertical offset
    return signal<{ flipped: boolean; answer: string; rotation: number; color: string; offsetX: number; offsetY: number }>({ flipped: false,
      answer: '',
      rotation,
      color,
      offsetX,
      offsetY })});

   // currently flipped note index
  private flippedIndex: number | null = null;

  async ask() {
        // reset previously flipped note
    if (this.flippedIndex !== null) {
      const prev = this.notes[this.flippedIndex]();
      this.notes[this.flippedIndex].set({ ...prev, flipped: false, answer: '' });
    }
    // pick a random note
    const index = Math.floor(Math.random() * this.notes.length);
    this.flippedIndex = index;

    // random rotation between -10 and 10 degrees
    const rotation = Math.random() * 20 - 10;

    // call the API for an answer
    const response = await this.query();

    // set the answer and flip the note
    const note = this.notes[index]();
    this.notes[index].set({ ...note, flipped: true, answer: response.answer, rotation });
  }

  async query() {
    const res = await firstValueFrom(
      this.client.get<{ answer: string }>("https://magic-8-wall.qkleinfelter.workers.dev/")
    );
    return res;
  }
}
