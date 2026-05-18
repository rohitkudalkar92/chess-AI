import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BORDER_RADIUS } from '../../../shared/constants';

@Component({
  selector: 'app-inquiry',
  imports: [FormsModule],
  templateUrl: './inquiry.html',
})
export class Inquiry {
  radius = BORDER_RADIUS;
  submitted = signal(false);

  form = {
    name: '',
    email: '',
    subject: '',
    type: 'inquiry',
    message: '',
  };

  onSubmit() {
    this.submitted.set(true);
    this.form = { name: '', email: '', subject: '', type: 'inquiry', message: '' };
  }
}
