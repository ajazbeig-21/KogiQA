import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'kogi-demo' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('kogi-demo');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, kogi-demo');
  });

  describe('Theme Toggle Tests', () => {
    let fixture: any;
    let component: AppComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
      document.documentElement.classList.remove('dark');
    });

    it('should initialize isDarkMode as false', () => {
      expect(component.isDarkMode).toBeFalse();
    });

    it('should toggle isDarkMode when toggleTheme is called', () => {
      const initialState = component.isDarkMode;
      component.toggleTheme();
      expect(component.isDarkMode).toBe(!initialState);
    });

    it('should add dark class to html element when toggling to dark mode', () => {
      component.isDarkMode = false;
      component.toggleTheme();
      expect(document.documentElement.classList.contains('dark')).toBeTrue();
    });

    it('should remove dark class from html element when toggling to light mode', () => {
      document.documentElement.classList.add('dark');
      component.isDarkMode = true;
      component.toggleTheme();
      expect(document.documentElement.classList.contains('dark')).toBeFalse();
    });

    it('should save theme preference to localStorage when toggling to dark', () => {
      component.isDarkMode = false;
      component.toggleTheme();
      expect(localStorage.getItem('theme')).toEqual('dark');
    });

    it('should save theme preference to localStorage when toggling to light', () => {
      component.isDarkMode = true;
      component.toggleTheme();
      expect(localStorage.getItem('theme')).toEqual('light');
    });

    it('should restore dark mode from localStorage on init', () => {
      localStorage.setItem('theme', 'dark');
      component.ngOnInit();
      expect(component.isDarkMode).toBeTrue();
      expect(document.documentElement.classList.contains('dark')).toBeTrue();
    });

    it('should restore light mode from localStorage on init', () => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'light');
      component.ngOnInit();
      expect(component.isDarkMode).toBeFalse();
      expect(document.documentElement.classList.contains('dark')).toBeFalse();
    });

    it('should default to light mode when no theme is saved', () => {
      component.ngOnInit();
      expect(component.isDarkMode).toBeFalse();
    });

    it('should render theme toggle button', () => {
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button');
      expect(button).toBeTruthy();
    });

    it('should display moon emoji when in light mode', () => {
      component.isDarkMode = false;
      fixture.detectChanges();
      const moonSpan = fixture.nativeElement.querySelector('span');
      expect(moonSpan?.textContent).toContain('🌙');
    });

    it('should display sun emoji when in dark mode', () => {
      component.isDarkMode = true;
      fixture.detectChanges();
      const spans = fixture.nativeElement.querySelectorAll('span');
      const sunSpan = Array.from(spans).find((span: any) => span.textContent.includes('☀️'));
      expect(sunSpan).toBeTruthy();
    });

    it('should call toggleTheme when button is clicked', () => {
      spyOn(component, 'toggleTheme');
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button');
      button.click();
      expect(component.toggleTheme).toHaveBeenCalled();
    });

    it('should update title attribute based on isDarkMode state', () => {
      fixture.detectChanges();
      const button = fixture.nativeElement.querySelector('button');
      expect(button.getAttribute('title')).toContain('Switch to Dark Mode');
      
      component.isDarkMode = true;
      fixture.detectChanges();
      expect(button.getAttribute('title')).toContain('Switch to Light Mode');
    });

    it('should persist multiple toggle actions', () => {
      component.toggleTheme(); // switch to dark
      expect(localStorage.getItem('theme')).toEqual('dark');
      
      component.toggleTheme(); // switch to light
      expect(localStorage.getItem('theme')).toEqual('light');
      
      component.toggleTheme(); // switch to dark again
      expect(localStorage.getItem('theme')).toEqual('dark');
    });
  });

  describe('E2E User Flow Tests (Equivalent to KogiQA Test)', () => {
    let fixture: any;
    let component: AppComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('should render the login page with all form elements', () => {
      const email = fixture.nativeElement.querySelector('input[type="email"]');
      const password = fixture.nativeElement.querySelector('input[type="password"]');
      const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]');
      const loginButton = fixture.nativeElement.querySelector('button[type="submit"]');

      expect(email).toBeTruthy();
      expect(password).toBeTruthy();
      expect(checkbox).toBeTruthy();
      expect(loginButton).toBeTruthy();
    });

    it('should allow user to enter email address', () => {
      const emailInput = fixture.nativeElement.querySelector('input[type="email"]') as HTMLInputElement;
      emailInput.value = 'ajazbeig@gmail.com';
      emailInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(emailInput.value).toBe('ajazbeig@gmail.com');
    });

    it('should allow user to enter password', () => {
      const passwordInput = fixture.nativeElement.querySelector('input[type="password"]') as HTMLInputElement;
      passwordInput.value = 'Password@123';
      passwordInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(passwordInput.value).toBe('Password@123');
    });

    it('should allow user to check remember me checkbox', () => {
      const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(checkbox.checked).toBeTrue();
    });

    it('should complete full login flow: email -> tab -> password -> remember -> click login', () => {
      // Step 1: Navigate (implicit in test creation)
      expect(fixture.componentInstance).toBeTruthy();

      // Step 2: Get form elements
      const emailInput = fixture.nativeElement.querySelector('input[type="email"]') as HTMLInputElement;
      const passwordInput = fixture.nativeElement.querySelector('input[type="password"]') as HTMLInputElement;
      const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
      const loginButton = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;

      // Step 3: Click email field and enter email
      emailInput.focus();
      emailInput.value = 'ajazbeig@gmail.com';
      emailInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(emailInput.value).toBe('ajazbeig@gmail.com');

      // Step 4: Press Tab to move to password field
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      emailInput.dispatchEvent(tabEvent);
      passwordInput.focus();
      fixture.detectChanges();

      // Step 5: Type password
      passwordInput.value = 'Password@123';
      passwordInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(passwordInput.value).toBe('Password@123');

      // Step 6: Click "Remember me" checkbox
      checkbox.click();
      fixture.detectChanges();

      expect(checkbox.checked).toBeTrue();

      // Step 7: Click Login button
      loginButton.click();
      fixture.detectChanges();

      // Verify form state after submission
      expect(emailInput.value).toBe('ajazbeig@gmail.com');
      expect(passwordInput.value).toBe('Password@123');
      expect(checkbox.checked).toBeTrue();
    });

    it('should have correct placeholder text for email field', () => {
      const emailInput = fixture.nativeElement.querySelector('input[type="email"]') as HTMLInputElement;
      expect(emailInput.placeholder).toContain('Enter your email');
    });

    it('should have correct placeholder text for password field', () => {
      const passwordInput = fixture.nativeElement.querySelector('input[type="password"]') as HTMLInputElement;
      expect(passwordInput.placeholder).toContain('Enter your password');
    });

    it('should have email input as required field', () => {
      const emailInput = fixture.nativeElement.querySelector('input[type="email"]') as HTMLInputElement;
      expect(emailInput.required).toBeTrue();
    });

    it('should have password input as required field', () => {
      const passwordInput = fixture.nativeElement.querySelector('input[type="password"]') as HTMLInputElement;
      expect(passwordInput.required).toBeTrue();
    });

    it('should display login form with proper labels', () => {
      const labels = fixture.nativeElement.querySelectorAll('label');
      const labelTexts = Array.from(labels).map((label: any) => label.textContent);

      expect(labelTexts.some((text: any) => text.includes('Email Address'))).toBeTrue();
      expect(labelTexts.some((text: any) => text.includes('Password'))).toBeTrue();
      expect(labelTexts.some((text: any) => text.includes('Remember me'))).toBeTrue();
    });

    it('should have login button with correct label', () => {
      const loginButton = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
      expect(loginButton.textContent).toContain('Login');
    });

    it('should have theme toggle button in header', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      const themeButton = Array.from(buttons).find((btn: any) => btn.textContent.includes('🌙') || btn.textContent.includes('☀️'));
      expect(themeButton).toBeTruthy();
    });

    it('should simulate complete user interaction sequence', async () => {
      const emailInput = fixture.nativeElement.querySelector('input[type="email"]') as HTMLInputElement;
      const passwordInput = fixture.nativeElement.querySelector('input[type="password"]') as HTMLInputElement;
      const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
      const loginButton = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;

      // Simulate user interactions
      emailInput.click();
      emailInput.value = 'ajazbeig@gmail.com';
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();

      // Press tab
      const tabKeyEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        code: 'Tab',
        bubbles: true
      });
      emailInput.dispatchEvent(tabKeyEvent);
      
      passwordInput.value = 'Password@123';
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();

      checkbox.click();
      fixture.detectChanges();

      loginButton.click();
      fixture.detectChanges();

      // Verify final state
      expect(emailInput.value).toBe('ajazbeig@gmail.com');
      expect(passwordInput.value).toBe('Password@123');
      expect(checkbox.checked).toBeTrue();
    });

    it('should clear form on page reload/refresh', () => {
      const emailInput = fixture.nativeElement.querySelector('input[type="email"]') as HTMLInputElement;
      const passwordInput = fixture.nativeElement.querySelector('input[type="password"]') as HTMLInputElement;

      emailInput.value = 'test@example.com';
      passwordInput.value = 'test123';

      // Simulate new fixture (page refresh)
      fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();

      const newEmailInput = fixture.nativeElement.querySelector('input[type="email"]') as HTMLInputElement;
      const newPasswordInput = fixture.nativeElement.querySelector('input[type="password"]') as HTMLInputElement;

      expect(newEmailInput.value).toBe('');
      expect(newPasswordInput.value).toBe('');
    });
  });
});
