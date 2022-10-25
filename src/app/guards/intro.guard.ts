import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { Observable } from 'rxjs';

export const INTRO_KEY = 'intro-seen';

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {
  canLoad2(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  constructor(private router: Router) { }

  async canLoad(): Promise<boolean> {
      const hasSeenIntro = await Storage.get({key: INTRO_KEY});
      if (hasSeenIntro && (hasSeenIntro.value === 'true')) {
        return true;
      } else {
        this.router.navigateByUrl('/intro', { replaceUrl:true });
        return false;
      }
  }

}
