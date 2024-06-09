import { AccessTokenStateInterface } from "./AccessTokenStateInterface";
import { AuthErrorStateInterface } from "./AuthErrorStateInterface";
import { CsrfTokenStateInterface } from "./CsrfTokenStateInterface";
import { MenuStateInterface } from "./MenuStateInterface";
import { PlatformStateInterface } from "./PlatformStateInterface";

export interface RootStateInterface {
    platform: PlatformStateInterface;
    menu: MenuStateInterface;
    csrfToken: CsrfTokenStateInterface;
    accessToken: AccessTokenStateInterface;
    authError: AuthErrorStateInterface;
}