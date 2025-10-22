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

  // track 20 notes
  protected notes = Array.from({ length: 50 }, () => signal<{ flipped: boolean, answer: string, rotation: number }>({ flipped: false, answer: '', rotation: 0 }));

   // currently flipped note index
  private flippedIndex: number | null = null;

  async ask() {
        // reset previously flipped note
    if (this.flippedIndex !== null) {
      this.notes[this.flippedIndex].set({ flipped: false, answer: '', rotation: 0 });
    }
    // pick a random note
    const index = Math.floor(Math.random() * this.notes.length);
    this.flippedIndex = index;
    const note = this.notes[index];

    // random rotation between -10 and 10 degrees
    const rotation = Math.random() * 20 - 10;

    // call the API for an answer
    const response = await this.query();

    // set the answer and flip the note
    note.set({ flipped: true, answer: response.answer, rotation: rotation });
  }

  async query() {
    const res = await firstValueFrom(
      this.client.get<{ answer: string }>("https://magic-8-wall.qkleinfelter.workers.dev/")
    );
    return res;
  }
}
