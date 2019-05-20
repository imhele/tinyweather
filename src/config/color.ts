const Theme = [
  '#fff7e6',
  '#ffe7ba',
  '#ffd591',
  '#ffc069',
  '#ffa940',
  '#fa8c16',
  '#d46b08',
  '#ad4e00',
  '#873800',
  '#612500',
];

const Primary = Theme[5];
const Opacity = [0.85, 0.65, 0.45, 0.25, 0.15, 0.09, 0.04, 0.02];

export default {
  Opacity,
  Primary,
  Theme,
  TabBar: {
    active: Primary,
    inactive: '#666666',
    border: '#e3e3e3',
    normal: '#373737',
  },
  B0: `rgba(0, 0, 0, ${Opacity[0]})`,
  B1: `rgba(0, 0, 0, ${Opacity[1]})`,
  B2: `rgba(0, 0, 0, ${Opacity[2]})`,
  B3: `rgba(0, 0, 0, ${Opacity[3]})`,
  B4: `rgba(0, 0, 0, ${Opacity[4]})`,
  B5: `rgba(0, 0, 0, ${Opacity[5]})`,
  B6: `rgba(0, 0, 0, ${Opacity[6]})`,
  B7: `rgba(0, 0, 0, ${Opacity[7]})`,
  W0: 'rgba(255, 255, 255, 1)',
  W1: `rgba(255, 255, 255, ${Opacity[0]})`,
  W2: `rgba(255, 255, 255, ${Opacity[1]})`,
  W3: `rgba(255, 255, 255, ${Opacity[2]})`,
  W4: `rgba(255, 255, 255, ${Opacity[3]})`,
  W5: `rgba(255, 255, 255, ${Opacity[4]})`,
  W6: `rgba(255, 255, 255, ${Opacity[5]})`,
  W7: `rgba(255, 255, 255, ${Opacity[6]})`,
};
