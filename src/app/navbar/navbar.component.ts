import { Component, OnInit } from '@angular/core';
import {
  faHome,
  faUser,
  faChartBar,
  faAngleDoubleRight,
  faAngleDoubleLeft,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  readonly faHome = faHome;
  readonly faUser = faUser;
  readonly faChartBar = faChartBar;
  readonly faAngleDoubleRight = faAngleDoubleRight;
  readonly faAngleDoubleLeft = faAngleDoubleLeft;
  readonly faSignOutAlt = faSignOutAlt;

  toggleMinMenu: boolean = false;

  nav = [
    {
      title: 'My profile',
      icon: this.faUser,
      link: '/profile',
    },
    {
      title: 'Dashboard',
      icon: this.faHome,
      link: '/dashboard',
    },
    {
      title: 'Statistics',
      icon: this.faChartBar,
      link: '/statistics',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  toggleMenuWidth() {
    this.toggleMinMenu = !this.toggleMinMenu;
  }
}
