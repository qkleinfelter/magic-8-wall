import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, inject, model, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected client = inject(HttpClient);
  protected readonly prompt = model();
  protected readonly answer = signal('');


  async ask() {
    const response = await this.query();
    this.answer.set(response.answer);
  }

  async query() {
    const res = await firstValueFrom(this.client.get<{answer: string}>("https://magic-8-wall.qkleinfelter.workers.dev/"));
    return res;
  }
}
