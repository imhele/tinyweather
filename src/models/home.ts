export interface HomeState {}

const refresh = () => {
  return new Promise(resolver => setTimeout(resolver, 2000));
};

const home = {
  state: {} as HomeState,
  reducers: {
    refresh,
  },
};

export default home;
