// Vite-specific imports
declare module "*.css";
declare module "*.vue" {
  import { DefineComponent } from "vue";

  const component: DefineComponent<{}, {}, any>;

  export default component;
}
