import { Component, OnInit, Renderer2 } from '@angular/core';
import { LayoutComponent } from '../layout/layout.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LoginComponent } from '../login/login.component';
import { use } from 'echarts';
import { ConfigDataService } from '../config-data.service';
import { ThemeService } from '../theme_service/theme.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterModule, ToastrModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit{
  currentTheme: string = 'dark';
  username!:string;
  constructor (private layout:LayoutComponent, private router:Router, private toastr:ToastrService, private renderer:Renderer2, private route: ActivatedRoute, private user:ConfigDataService, private themeservice:ThemeService){}
  isPageSelected(page: string): boolean {
    return this.layout.page === page;
  }
    onPageChange(name:String){
      
      // this.router.navigate(['/base', name]);
      // this.route.paramMap.subscribe(params => {
      //   this.layout.page = params.get('page') || name;
      // });
      if(name === 'Dashboard'){
        this.toastr.warning('Please Select the station to view Live Data', 'Warning!');
        
      }else{
        this.layout.page = name;
        // this.layout.page = name;
        // this.router.navigate(['/base', name]);
         if(this.layout.page === 'logout'){
    this.router.navigate(['/login']);
        } else if(this.layout.page == 'Home'){
          this.layout.page = name;
          // this.router.navigate(['/base', name]);
            window.location.reload(); // Forces a full-page reload
          
        }
      }
      
      
    }
  ngOnInit(): void {
    this.username = localStorage.getItem('username') ?? "";
    this.renderer.setAttribute(document.body, 'data-theme', this.currentTheme);
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = (event: MediaQueryListEvent) => {
      if (event.matches) {
        this.currentTheme = 'dark';
        this.renderer.setAttribute(document.body, 'data-theme', this.currentTheme);

      } else {
        this.currentTheme = 'light';
        this.renderer.setAttribute(document.body, 'data-theme', this.currentTheme);
      }
    };
  
    // Log initial mode
    if (darkModeMediaQuery.matches) {
      this.currentTheme = 'dark';
        this.renderer.setAttribute(document.body, 'data-theme', this.currentTheme);
    } else {
      this.currentTheme = 'light';
      this.renderer.setAttribute(document.body, 'data-theme', this.currentTheme);
    }
  
    // Add listener for changes
    darkModeMediaQuery.addEventListener('change', updateTheme);
  
  }

  toggleTheme(theme:string): void {
    this.currentTheme = theme;
    // this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.renderer.setAttribute(document.body, 'data-theme', this.currentTheme);
    this.themeservice.changeTheme(this.currentTheme);
  }
}
