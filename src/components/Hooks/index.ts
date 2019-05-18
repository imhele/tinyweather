interface Hook {
  /**
   * @param cbk
   * Add call back to this hooks.
   * Return `true` will not delete this call back after call
   */
  (...cbk: ((...args: any[]) => boolean | void)[]): number;
  queue: ((...args: any[]) => boolean | void)[];
}

const Hooks: { [key: string]: Hook } = {};

export const registerHook = (name: string): boolean => {
  if (Hooks[name]) {
    if (__DEV__) {
      console.error(`[Hooks] Hook named '${name}' has already registered.`);
    }
    return false;
  }
  const hook: Hook = (...args) => Hooks[name].queue.push(...args);
  hook.queue = [] as ((...args: any[]) => boolean | void)[];
  Hooks[name] = hook;
  return true;
};

export const registerHooks = (...nameList: string[]) => nameList.map(registerHook);

export const callHook = (name: string, ...args: any[]): boolean => {
  if (!Hooks[name]) {
    if (__DEV__) {
      // tslint:disable-next-line no-console
      console.warn(`[Hooks] Hook named '${name}' has not registered yet.`);
    }
    return false;
  }
  Hooks[name].queue = Hooks[name].queue.filter(cbk => cbk(...args));
  return true;
};

export default Hooks;
