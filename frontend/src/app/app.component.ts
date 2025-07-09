import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  formData = {
    site: '',
    date: '',
    user: '',
    values: ''
  };

  constructor(private http: HttpClient) {}

  submitForm() {
    this.http.post('/api/forms', this.formData).subscribe(() => {
      alert('Form submitted');
      this.formData = { site: '', date: '', user: '', values: '' };
    });
  }
}
