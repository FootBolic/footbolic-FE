export interface RouteInterface {
    [index: string]: any;
    path: string;
    element: () => JSX.Element;
}