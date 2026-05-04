import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from './services/api';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  courts: any[] = [];
  bookings: any[] = [];

  email: string = '';
  password: string = '';
  loginMessage: string = '';
  bookingDate: string = '';
bookingTime: string = '';
selectedCourtId: string = '';
registerName: string = '';
registerEmail: string = '';
registerPassword: string = '';
registerMessage: string = '';

  constructor(private api: Api) {}

  ngOnInit(): void {
    this.loadCourts();
  }

  loadCourts(): void {
    this.api.getCourts().subscribe({
      next: (response) => {
        this.courts = response.courts;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  register(): void {
  const registerData = {
    name: this.registerName,
    email: this.registerEmail,
    password: this.registerPassword
  };

 fetch('https://sports-court-booking-final-project.onrender.com/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(registerData)
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        this.registerMessage = 'Registration successful!';
        alert('Registration successful!');
        this.loadBookings();
      } else {
        this.registerMessage = data.message || 'Registration failed';
        alert(this.registerMessage);
      }
    })
    .catch((err) => {
      console.log(err);
      alert('Something went wrong');
    });
}

  login(): void {
    const loginData = {
      email: this.email,
      password: this.password
    };

   fetch('https://sports-court-booking-final-project.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          this.loginMessage = 'Login successful!';
          alert('Login successful!');
          this.loadBookings();
        } else {
          this.loginMessage = data.message || 'Login failed';
          alert(this.loginMessage);
        }
      })
      .catch((err) => {
        console.log(err);
        alert('Something went wrong');
      });
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.bookings = [];
    this.loginMessage = '';
    alert('Logged out successfully');
  }
  openBooking(courtId: string) {
  this.selectedCourtId = courtId;
}

  bookCourt(courtId: string): void {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login first.');
      return;
    }
    if (!this.selectedCourtId || !this.bookingDate || !this.bookingTime) {
  alert('Please select court, date and time.');
  return;
}

   const bookingData = {
  court: this.selectedCourtId,
  bookingDate: this.bookingDate,
  bookingTime: this.bookingTime
};

    fetch('https://sports-court-booking-final-project.onrender.com/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(bookingData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Booking created successfully') {
          alert('Booking successful!');
          this.loadBookings();
        } else {
          alert(data.message || 'Booking failed');
        }
      })
      .catch((err) => {
        console.log(err);
        alert('Something went wrong');
      });
  }

  loadBookings(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login first.');
      return;
    }

    fetch('https://sports-court-booking-final-project.onrender.com/bookings', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then((res) => res.json())
      .then((data) => {
        this.bookings = data.bookings;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  deleteBooking(bookingId: string): void {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login first.');
      return;
    }

    fetch('https://sports-court-booking-final-project.onrender.com/bookings/' + bookingId, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'Booking deleted successfully') {
          alert('Booking deleted successfully!');
          this.loadBookings();
        } else {
          alert(data.message || 'Delete failed');
        }
      })
      .catch((err) => {
        console.log(err);
        alert('Something went wrong');
      });
  }
  
  
  
}
