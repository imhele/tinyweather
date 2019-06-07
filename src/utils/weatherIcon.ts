import iconMap from '@/assets/icon/map';

export const WeatherColor: { [K in keyof typeof iconMap]: string } = {
  blizard: '#215ff7',
  cloudy: '#d49013',
  'cloudy-sunny': '#fab524',
  'cloudy-sunny-night': '#ad6e07',
  dust: '#f92299',
  fog: '#722ed1',
  haze: '#391085',
  rain: '#2299f9',
  'rain-heavy': '#1377d4',
  'rain-light': '#4db5ff',
  'rain-storm': '#0757ad',
  sandstorm: '#d41383',
  shower: '#2299f9',
  'shower-night': '#0757ad',
  sleet: '#215ff7',
  snow: '#215ff7',
  'snow-heavy': '#1141d1',
  'snow-light': '#4a83ff',
  'snow-shower': '#215ff7',
  'snow-shower-night': '#0529ab',
  sunny: '#3cdcb3',
  'sunny-night': '#188f79',
  'thund-shower-hail': '#3d6ee4',
  'thunder-shower': '#3d6ee4',
};

export const WeatherIcon: { [K: string]: keyof typeof iconMap } = {
  '0': 'sunny',
  '1': 'cloudy-sunny',
  '2': 'cloudy',
  '3': 'shower',
  '4': 'thunder-shower',
  '5': 'blizard',
  '6': 'sleet',
  '7': 'rain-light',
  '8': 'rain',
  '9': 'rain-heavy',
  '10': 'rain-storm',
  '13': 'snow-shower',
  '14': 'snow-light',
  '15': 'snow',
  '16': 'snow-heavy',
  '17': 'snow-heavy',
  '18': 'fog',
  '19': 'blizard',
  '20': 'sandstorm',
  '29': 'dust',
  '30': 'sunny-night',
  '31': 'cloudy-sunny-night',
  '32': 'fog',
  '33': 'shower-night',
  '34': 'snow-shower-night',
  '35': 'dust',
  '36': 'sandstorm',
  '45': 'haze',
  '46': 'haze',
};
