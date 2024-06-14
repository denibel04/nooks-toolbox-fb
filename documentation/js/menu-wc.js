'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">nooks-toolbox documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AboutPageModule.html" data-type="entity-link" >AboutPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AboutPageModule-e19251096368bb92dfbab1e34f47f5c899c9fdb7bb58d74458079f021818f77a8dd37f62c4946ede93c4b455fc2a08d8c5217f29cb375408ddf1f8c4e0839b29"' : 'data-bs-target="#xs-components-links-module-AboutPageModule-e19251096368bb92dfbab1e34f47f5c899c9fdb7bb58d74458079f021818f77a8dd37f62c4946ede93c4b455fc2a08d8c5217f29cb375408ddf1f8c4e0839b29"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AboutPageModule-e19251096368bb92dfbab1e34f47f5c899c9fdb7bb58d74458079f021818f77a8dd37f62c4946ede93c4b455fc2a08d8c5217f29cb375408ddf1f8c4e0839b29"' :
                                            'id="xs-components-links-module-AboutPageModule-e19251096368bb92dfbab1e34f47f5c899c9fdb7bb58d74458079f021818f77a8dd37f62c4946ede93c4b455fc2a08d8c5217f29cb375408ddf1f8c4e0839b29"' }>
                                            <li class="link">
                                                <a href="components/AboutPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AboutPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AboutPageRoutingModule.html" data-type="entity-link" >AboutPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminPageModule.html" data-type="entity-link" >AdminPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AdminPageModule-7e257fd27cb874f12b99372eb803c96fe7f273b61a1436ffdcd0019fae7422bf22d1e080ca87af5828698d09bfa1d55149a1a2adf5543e69fff8c0f788028ee0"' : 'data-bs-target="#xs-components-links-module-AdminPageModule-7e257fd27cb874f12b99372eb803c96fe7f273b61a1436ffdcd0019fae7422bf22d1e080ca87af5828698d09bfa1d55149a1a2adf5543e69fff8c0f788028ee0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminPageModule-7e257fd27cb874f12b99372eb803c96fe7f273b61a1436ffdcd0019fae7422bf22d1e080ca87af5828698d09bfa1d55149a1a2adf5543e69fff8c0f788028ee0"' :
                                            'id="xs-components-links-module-AdminPageModule-7e257fd27cb874f12b99372eb803c96fe7f273b61a1436ffdcd0019fae7422bf22d1e080ca87af5828698d09bfa1d55149a1a2adf5543e69fff8c0f788028ee0"' }>
                                            <li class="link">
                                                <a href="components/AdminPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminPageRoutingModule.html" data-type="entity-link" >AdminPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-6b5ee2e1e7897b39ed8b40aeb26f36a4a1eb550c60dfbcc8efaeb7f0eb0636ad88d9a945fbe17d08a05be9ce992dfc235aec8e418fe0cebbbf9fdef7946f5aa0"' : 'data-bs-target="#xs-components-links-module-AppModule-6b5ee2e1e7897b39ed8b40aeb26f36a4a1eb550c60dfbcc8efaeb7f0eb0636ad88d9a945fbe17d08a05be9ce992dfc235aec8e418fe0cebbbf9fdef7946f5aa0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-6b5ee2e1e7897b39ed8b40aeb26f36a4a1eb550c60dfbcc8efaeb7f0eb0636ad88d9a945fbe17d08a05be9ce992dfc235aec8e418fe0cebbbf9fdef7946f5aa0"' :
                                            'id="xs-components-links-module-AppModule-6b5ee2e1e7897b39ed8b40aeb26f36a4a1eb550c60dfbcc8efaeb7f0eb0636ad88d9a945fbe17d08a05be9ce992dfc235aec8e418fe0cebbbf9fdef7946f5aa0"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HomePageModule.html" data-type="entity-link" >HomePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-HomePageModule-9fe2036d6ad52777a5eb6f945dd6015142fd412fc93eeceb005e964f3f0e00e3f345958f6b395a12f48dc3c906d84d834f506682c85b0bfdcf9d283b7e31df0c"' : 'data-bs-target="#xs-components-links-module-HomePageModule-9fe2036d6ad52777a5eb6f945dd6015142fd412fc93eeceb005e964f3f0e00e3f345958f6b395a12f48dc3c906d84d834f506682c85b0bfdcf9d283b7e31df0c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HomePageModule-9fe2036d6ad52777a5eb6f945dd6015142fd412fc93eeceb005e964f3f0e00e3f345958f6b395a12f48dc3c906d84d834f506682c85b0bfdcf9d283b7e31df0c"' :
                                            'id="xs-components-links-module-HomePageModule-9fe2036d6ad52777a5eb6f945dd6015142fd412fc93eeceb005e964f3f0e00e3f345958f6b395a12f48dc3c906d84d834f506682c85b0bfdcf9d283b7e31df0c"' }>
                                            <li class="link">
                                                <a href="components/HomePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomePageRoutingModule.html" data-type="entity-link" >HomePageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LoansPageModule.html" data-type="entity-link" >LoansPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-LoansPageModule-b3087e88de015dcd206716b68fc6ccd45ab5726e97d776f618dc180430b286a3f2241076617d14054d6ef3698a62d15dcdb0ee36e5da9a48e5785c8202124495"' : 'data-bs-target="#xs-components-links-module-LoansPageModule-b3087e88de015dcd206716b68fc6ccd45ab5726e97d776f618dc180430b286a3f2241076617d14054d6ef3698a62d15dcdb0ee36e5da9a48e5785c8202124495"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LoansPageModule-b3087e88de015dcd206716b68fc6ccd45ab5726e97d776f618dc180430b286a3f2241076617d14054d6ef3698a62d15dcdb0ee36e5da9a48e5785c8202124495"' :
                                            'id="xs-components-links-module-LoansPageModule-b3087e88de015dcd206716b68fc6ccd45ab5726e97d776f618dc180430b286a3f2241076617d14054d6ef3698a62d15dcdb0ee36e5da9a48e5785c8202124495"' }>
                                            <li class="link">
                                                <a href="components/LoansPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoansPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoansPageRoutingModule.html" data-type="entity-link" >LoansPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LoginPageModule.html" data-type="entity-link" >LoginPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-LoginPageModule-554ade4728ed50d2288c2d6811be3c5b43bac289e9eafe204b0f8b64e4e7af93119451c3a8e7390e5384cac3b71dcc78a0828c75e5dd08141c3e94b675870e0f"' : 'data-bs-target="#xs-components-links-module-LoginPageModule-554ade4728ed50d2288c2d6811be3c5b43bac289e9eafe204b0f8b64e4e7af93119451c3a8e7390e5384cac3b71dcc78a0828c75e5dd08141c3e94b675870e0f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LoginPageModule-554ade4728ed50d2288c2d6811be3c5b43bac289e9eafe204b0f8b64e4e7af93119451c3a8e7390e5384cac3b71dcc78a0828c75e5dd08141c3e94b675870e0f"' :
                                            'id="xs-components-links-module-LoginPageModule-554ade4728ed50d2288c2d6811be3c5b43bac289e9eafe204b0f8b64e4e7af93119451c3a8e7390e5384cac3b71dcc78a0828c75e5dd08141c3e94b675870e0f"' }>
                                            <li class="link">
                                                <a href="components/LoginPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoginPageRoutingModule.html" data-type="entity-link" >LoginPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ProfilePageModule.html" data-type="entity-link" >ProfilePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-ProfilePageModule-03d42888d24c6d386ab0f5c261b8107748ecdc7d7d992196e82fb20892c4b8d3124964a83f585cbdce900d1c7fe6ef58c0982c0aa971d1983035c952cb325d09"' : 'data-bs-target="#xs-components-links-module-ProfilePageModule-03d42888d24c6d386ab0f5c261b8107748ecdc7d7d992196e82fb20892c4b8d3124964a83f585cbdce900d1c7fe6ef58c0982c0aa971d1983035c952cb325d09"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ProfilePageModule-03d42888d24c6d386ab0f5c261b8107748ecdc7d7d992196e82fb20892c4b8d3124964a83f585cbdce900d1c7fe6ef58c0982c0aa971d1983035c952cb325d09"' :
                                            'id="xs-components-links-module-ProfilePageModule-03d42888d24c6d386ab0f5c261b8107748ecdc7d7d992196e82fb20892c4b8d3124964a83f585cbdce900d1c7fe6ef58c0982c0aa971d1983035c952cb325d09"' }>
                                            <li class="link">
                                                <a href="components/ProfilePage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfilePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfilePageRoutingModule.html" data-type="entity-link" >ProfilePageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RegisterPageModule.html" data-type="entity-link" >RegisterPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-RegisterPageModule-d63ba6751c98d031fa213c125b6127a252b6eac6914c694128c4966f4081e6e7965791337b65b6e827539cc8eef760069d37ab5e6fc648f58fc6b73a7f98f210"' : 'data-bs-target="#xs-components-links-module-RegisterPageModule-d63ba6751c98d031fa213c125b6127a252b6eac6914c694128c4966f4081e6e7965791337b65b6e827539cc8eef760069d37ab5e6fc648f58fc6b73a7f98f210"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RegisterPageModule-d63ba6751c98d031fa213c125b6127a252b6eac6914c694128c4966f4081e6e7965791337b65b6e827539cc8eef760069d37ab5e6fc648f58fc6b73a7f98f210"' :
                                            'id="xs-components-links-module-RegisterPageModule-d63ba6751c98d031fa213c125b6127a252b6eac6914c694128c4966f4081e6e7965791337b65b6e827539cc8eef760069d37ab5e6fc648f58fc6b73a7f98f210"' }>
                                            <li class="link">
                                                <a href="components/RegisterPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RegisterPageRoutingModule.html" data-type="entity-link" >RegisterPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-SharedModule-bea7ebbac351fba6b771160d702ae0cfcdd4061004340c7c88ea3e2c984cf7c7dba8ad46953bf5f127b13e5492e5e5f96367ef4f17b2900ec9ef6338e74c65fa"' : 'data-bs-target="#xs-components-links-module-SharedModule-bea7ebbac351fba6b771160d702ae0cfcdd4061004340c7c88ea3e2c984cf7c7dba8ad46953bf5f127b13e5492e5e5f96367ef4f17b2900ec9ef6338e74c65fa"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-bea7ebbac351fba6b771160d702ae0cfcdd4061004340c7c88ea3e2c984cf7c7dba8ad46953bf5f127b13e5492e5e5f96367ef4f17b2900ec9ef6338e74c65fa"' :
                                            'id="xs-components-links-module-SharedModule-bea7ebbac351fba6b771160d702ae0cfcdd4061004340c7c88ea3e2c984cf7c7dba8ad46953bf5f127b13e5492e5e5f96367ef4f17b2900ec9ef6338e74c65fa"' }>
                                            <li class="link">
                                                <a href="components/IslandComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IslandComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/IslandFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IslandFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoanComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoanComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoanFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoanFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoanItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoanItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PictureSelectableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PictureSelectableComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RegisterFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserCardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserCardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserFormComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VillagerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VillagerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VillagerItemComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VillagerItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VillagerSelectableComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VillagerSelectableComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#directives-links-module-SharedModule-bea7ebbac351fba6b771160d702ae0cfcdd4061004340c7c88ea3e2c984cf7c7dba8ad46953bf5f127b13e5492e5e5f96367ef4f17b2900ec9ef6338e74c65fa"' : 'data-bs-target="#xs-directives-links-module-SharedModule-bea7ebbac351fba6b771160d702ae0cfcdd4061004340c7c88ea3e2c984cf7c7dba8ad46953bf5f127b13e5492e5e5f96367ef4f17b2900ec9ef6338e74c65fa"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-SharedModule-bea7ebbac351fba6b771160d702ae0cfcdd4061004340c7c88ea3e2c984cf7c7dba8ad46953bf5f127b13e5492e5e5f96367ef4f17b2900ec9ef6338e74c65fa"' :
                                        'id="xs-directives-links-module-SharedModule-bea7ebbac351fba6b771160d702ae0cfcdd4061004340c7c88ea3e2c984cf7c7dba8ad46953bf5f127b13e5492e5e5f96367ef4f17b2900ec9ef6338e74c65fa"' }>
                                        <li class="link">
                                            <a href="directives/BackgroundBlurDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BackgroundBlurDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/ProgressDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProgressDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#pipes-links-module-SharedModule-bea7ebbac351fba6b771160d702ae0cfcdd4061004340c7c88ea3e2c984cf7c7dba8ad46953bf5f127b13e5492e5e5f96367ef4f17b2900ec9ef6338e74c65fa"' : 'data-bs-target="#xs-pipes-links-module-SharedModule-bea7ebbac351fba6b771160d702ae0cfcdd4061004340c7c88ea3e2c984cf7c7dba8ad46953bf5f127b13e5492e5e5f96367ef4f17b2900ec9ef6338e74c65fa"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SharedModule-bea7ebbac351fba6b771160d702ae0cfcdd4061004340c7c88ea3e2c984cf7c7dba8ad46953bf5f127b13e5492e5e5f96367ef4f17b2900ec9ef6338e74c65fa"' :
                                            'id="xs-pipes-links-module-SharedModule-bea7ebbac351fba6b771160d702ae0cfcdd4061004340c7c88ea3e2c984cf7c7dba8ad46953bf5f127b13e5492e5e5f96367ef4f17b2900ec9ef6338e74c65fa"' }>
                                            <li class="link">
                                                <a href="pipes/LatestThreePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LatestThreePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/LoanCompletedPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoanCompletedPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/VillagersPageModule.html" data-type="entity-link" >VillagersPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-VillagersPageModule-e812d6d45f8804a14506f9107a20514353823d527c7ac39f5d81d7e471fb58911d7938ca72b85b3e95d233152561dcbc635be605340ac5c2a6121d176fb0e9f4"' : 'data-bs-target="#xs-components-links-module-VillagersPageModule-e812d6d45f8804a14506f9107a20514353823d527c7ac39f5d81d7e471fb58911d7938ca72b85b3e95d233152561dcbc635be605340ac5c2a6121d176fb0e9f4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VillagersPageModule-e812d6d45f8804a14506f9107a20514353823d527c7ac39f5d81d7e471fb58911d7938ca72b85b3e95d233152561dcbc635be605340ac5c2a6121d176fb0e9f4"' :
                                            'id="xs-components-links-module-VillagersPageModule-e812d6d45f8804a14506f9107a20514353823d527c7ac39f5d81d7e471fb58911d7938ca72b85b3e95d233152561dcbc635be605340ac5c2a6121d176fb0e9f4"' }>
                                            <li class="link">
                                                <a href="components/VillagersPage.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VillagersPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/VillagersPageRoutingModule.html" data-type="entity-link" >VillagersPageRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/FirebaseDataService.html" data-type="entity-link" >FirebaseDataService</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpClientWebProvider.html" data-type="entity-link" >HttpClientWebProvider</a>
                            </li>
                            <li class="link">
                                <a href="classes/numericValidator.html" data-type="entity-link" >numericValidator</a>
                            </li>
                            <li class="link">
                                <a href="classes/PasswordValidation.html" data-type="entity-link" >PasswordValidation</a>
                            </li>
                            <li class="link">
                                <a href="classes/StrapiDataService.html" data-type="entity-link" >StrapiDataService</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ApiService.html" data-type="entity-link" >ApiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService-1.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthStrapiService.html" data-type="entity-link" >AuthStrapiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CustomTranslateService.html" data-type="entity-link" >CustomTranslateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DataService.html" data-type="entity-link" >DataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FirebaseAuthService.html" data-type="entity-link" >FirebaseAuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FirebaseService.html" data-type="entity-link" >FirebaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HttpClientProvider.html" data-type="entity-link" >HttpClientProvider</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IslandService.html" data-type="entity-link" >IslandService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtService.html" data-type="entity-link" >JwtService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoanService.html" data-type="entity-link" >LoanService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VillagerService.html" data-type="entity-link" >VillagerService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AdminGuard.html" data-type="entity-link" >AdminGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ButtonConfig.html" data-type="entity-link" >ButtonConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FirebaseDocument.html" data-type="entity-link" >FirebaseDocument</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FirebaseStorageFile.html" data-type="entity-link" >FirebaseStorageFile</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FirebaseUserCredential.html" data-type="entity-link" >FirebaseUserCredential</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Formats.html" data-type="entity-link" >Formats</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Island.html" data-type="entity-link" >Island</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Item.html" data-type="entity-link" >Item</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Large.html" data-type="entity-link" >Large</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Loan.html" data-type="entity-link" >Loan</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Medium.html" data-type="entity-link" >Medium</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PaginatedData.html" data-type="entity-link" >PaginatedData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Pagination.html" data-type="entity-link" >Pagination</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProviderMetadata.html" data-type="entity-link" >ProviderMetadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Small.html" data-type="entity-link" >Small</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StrapiArrayResponse.html" data-type="entity-link" >StrapiArrayResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StrapiData.html" data-type="entity-link" >StrapiData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StrapiExtendedUser.html" data-type="entity-link" >StrapiExtendedUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StrapiLoginPayload.html" data-type="entity-link" >StrapiLoginPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StrapiLoginResponse.html" data-type="entity-link" >StrapiLoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StrapiMedia.html" data-type="entity-link" >StrapiMedia</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StrapiRegisterPayload.html" data-type="entity-link" >StrapiRegisterPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StrapiResponse.html" data-type="entity-link" >StrapiResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StrapiUser.html" data-type="entity-link" >StrapiUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Thumbnail.html" data-type="entity-link" >Thumbnail</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserCredentials.html" data-type="entity-link" >UserCredentials</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserRegisterInfo.html" data-type="entity-link" >UserRegisterInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Villager.html" data-type="entity-link" >Villager</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});