import { Component } from '@angular/core';

@Component({
    selector: 'header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    items = [
        {
          title: 'Profile',
          expanded: true,
          children: [
            {
              title: 'Change Password',
              link: [], // goes into angular `routerLink`
            },
            {
              title: 'Privacy Policy',
              ulr: '#', // goes directly into `href` attribute
            },
            {
              title: 'Logout',
              link: [],
            },
          ],
        },
        {
          title: 'Shopping Bag',
          link: [],
        },
        {
          title: 'Orders',
          link: [],
        },
      ];
}
