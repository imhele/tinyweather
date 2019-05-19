export interface GlobalState {
  wingBlank: number;
}

const global = {
  state: {
    wingBlank: 16,
  } as GlobalState,
  reducers: {},
};

export default global;
