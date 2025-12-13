export default defineNuxtRouteMiddleware((to, from) => {
  const appStore = useAppStore();
  const { onGetterDisplayLogin: displayLogin, onGetterUserData: userData } =
    appStore;

  const nuxtApp = useNuxtApp();
  const localePath = nuxtApp.$localePath;

  const isNotLoggedIn =
    typeof userData.value === "object" &&
    !Object.values(userData.value || {}).length;

  if (isNotLoggedIn) {
    displayLogin.value = true;
    return navigateTo(
      localePath(`/?redirect=${removeLocalePrefixStrict(to.fullPath)}`)
    );
  }
});
