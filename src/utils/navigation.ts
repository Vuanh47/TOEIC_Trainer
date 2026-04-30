import { router } from "expo-router";

export function pushRoute(path: string) {
  router.push(path as never);
}

export function replaceRoute(path: string) {
  router.replace(path as never);
}
