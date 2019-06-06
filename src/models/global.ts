import { PX } from '@/config';

export interface GlobalState {
  wingBlank: number;
}

const global = {
  state: {
    wingBlank: PX(24),
  } as GlobalState,
  reducers: {},
};

export default global;
