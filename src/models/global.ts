export interface GlobalState {
  wingBlank: number;
}

const global = {
  state: {
    wingBlank: 12,
  } as GlobalState,
  reducers: {},
};

export default global;
