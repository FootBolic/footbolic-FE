import { AccessTokenStateInterface } from "./AccessTokenStateInterface";
import { AuthErrorStateInterface } from "./AuthErrorStateInterface";
import { CsrfTokenStateInterface } from "./CsrfTokenStateInterface";
import { MobileMenuStateInterface } from "./MobileMenuStateInterface";
import { PlatformStateInterface } from "./PlatformStateInterface";

export interface RootStateInterface {
    platform: PlatformStateInterface;
    mobileMenu: MobileMenuStateInterface;
    csrfToken: CsrfTokenStateInterface;
    accessToken: AccessTokenStateInterface;
    authError: AuthErrorStateInterface;
}