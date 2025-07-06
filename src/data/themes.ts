import { Theme } from '../types';

export const themes: Theme[] = [
  {
    id: 'male-model-commercial',
    title: 'MALE MODEL COMMERCIAL',
    description: 'A shirtless male hunk delivers your birthday message like it\'s a billion-dollar body wash ad.',
    image: '/image1.png',
    category: 'Commercial',
    code: '1/8',
    color: '#3B82F6' // Light blue
  },
  {
    id: 'female-model-commercial',
    title: 'FEMALE MODEL COMMERCIAL',
    description: 'A female goddess says happy birthday like she\'s in love, like the classic burger commercial.',
    image: '/image2.png',
    category: 'Commercial',
    code: '2/8',
    color: '#EAB308' // Yellow
  },
  {
    id: 'bigfoot-vlog',
    title: 'BIGFOOT VLOG',
    description: 'A hairy influencer emerges from the woods to wish you a weirdly wholesome birthday.',
    image: '/image4.png',
    category: 'Adventure',
    code: '3/8',
    color: '#22C55E' // Green
  },
  {
    id: 'breaking-news',
    title: 'BREAKING NEWS',
    description: 'A dramatic anchor interrupts regular programming to report: somebody is old.',
    image: '/image3.png',
    category: 'News',
    code: '4/8',
    color: '#EF4444' // Red
  },
  {
    id: 'fake-infomercial',
    title: 'FAKE INFOMERCIAL',
    description: 'A narrated ad selling random products for people turning this age, like pills for old people',
    image: '/Image8.png',
    category: 'Retro',
    code: '5/8',
    color: '#F97316' // Orange (default)
  },
  {
    id: 'jesus-of-nazareth',
    title: 'JESUS OF NAZARETH',
    description: 'Jesus of Nazareth steps out of a bustling 30 AD market to deliver a divine birthday blessing—with just the right amount of holy confusion.',
    image: '/image1.png', // Using placeholder image for now
    category: 'Religious',
    code: '6/8',
    color: '#F0EAD6' // Parchment tone
  },
  {
    id: 'fast-food-manager',
    title: 'FAST FOOD MANAGER',
    description: 'An off-the-rails restaurant manager snaps into reality-TV mode and serves up some hard truths instead of fries.',
    image: '/imageangry-manager.png',
    category: 'Reality TV',
    code: '7/8',
    color: '#EAB308' // Yellow
  },
  {
    id: 'swamp-man',
    title: 'SWAMP MAN',
    description: 'A mullet-rocking swamp dweller reels in your birthday with croc-wrangling bravado and a big "senior living" grin.',
    image: '/imageswamp.png',
    category: 'Reality TV',
    code: '8/8',
    color: '#556B2F' // Deep olive-green swamp vibe
  }
];