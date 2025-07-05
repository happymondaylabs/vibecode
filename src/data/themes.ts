import { Theme } from '../types';

export const themes: Theme[] = [
  {
    id: 'male-model-commercial',
    title: 'MALE MODEL COMMERCIAL',
    description: 'A shirtless male hunk delivers your birthday message like it\'s a billion-dollar body wash ad.',
    image: '/image1.png',
    category: 'Commercial',
    code: '1/5',
    color: '#3B82F6' // Light blue
  },
  {
    id: 'female-model-commercial',
    title: 'FEMALE MODEL COMMERCIAL',
    description: 'A female goddess says happy birthday like she\'s in love, like the classic burger commercial.',
    image: '/image2.png',
    category: 'Commercial',
    code: '2/5',
    color: '#EAB308' // Yellow
  },
  {
    id: 'bigfoot-vlog',
    title: 'BIGFOOT VLOG',
    description: 'A hairy influencer emerges from the woods to wish you a weirdly wholesome birthday.',
    image: '/image4.png',
    category: 'Adventure',
    code: '3/5',
    color: '#22C55E' // Green
  },
  {
    id: 'breaking-news',
    title: 'BREAKING NEWS',
    description: 'A dramatic anchor interrupts regular programming to report: somebody is old.',
    image: '/image3.png',
    category: 'News',
    code: '4/5',
    color: '#EF4444' // Red
  },
  {
    id: 'fake-infomercial',
    title: 'FAKE INFOMERCIAL',
    description: 'A narrated ad selling random products for people turning this age, like pills for old people',
    image: '/Image8.png',
    category: 'Retro',
    code: '5/5',
    color: '#F97316' // Orange (default)
  }
];