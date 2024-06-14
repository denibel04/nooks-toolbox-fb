import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, lastValueFrom, tap } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

/**
 * Function to create a TranslateHttpLoader instance for ngx-translate.
 * @param http The HttpClient instance to use for loading translation files.
 */
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@Injectable({
  providedIn: 'root'
})
export class CustomTranslateService {

  private _language: BehaviorSubject<string> = new BehaviorSubject<string>('es');
  public language$ = this._language.asObservable();

  private supportedLangs = ['en', 'es'];

  constructor(
    private translate: TranslateService
  ) {
    this.init();
  }

  /**
   * Initializes the TranslateService with supported languages and sets the default language.
   * Default language is set based on the current value of _language BehaviorSubject.
   */
  private async init() {
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang(this._language.value);
  }

  /**
  * Sets the active language for translations and updates the _language BehaviorSubject.
  * @param language The language code (ex. 'en' for English, 'es' for Spanish).
  */
  use(language: string) {
    lastValueFrom(this.translate.use(language)).then(_ => {
      this._language.next(language);
    }).catch(err => {
      console.error(err);
    });
  }

  /**
    * Retrieves the translated string for a given key.
    * @param key The translation key.
    * @returns {Observable<string>}
    */
  get(key: string): Observable<string> {
    return this.translate.get(key);
  }

  /**
    * Detects and returns the browser's language preference.
    * If the detected language is not in the supported languages list, defaults to 'es' (Spanish).
    */
  getBrowserLang() {
    let browserLang = this.translate.getBrowserLang();
    browserLang = (browserLang && this.supportedLangs.includes(browserLang)) ? browserLang : 'es';
    return browserLang;
  }
}
