import Provider from '@ant-design/react-native/es/provider';
import { ReloadContainer } from '@/components/reload';
import { WrappedContainer } from '@/layouts/Routes';
import React from 'react';
import { Text } from 'react-native';

export default () => (
  <ReloadContainer>
    <Provider>
      <Text>HHH</Text>
    </Provider>
  </ReloadContainer>
);
