import { UserData, Theme } from '../types';

// Generate prompt based on theme and user data
export function generatePrompt(userData: UserData, theme: Theme): string {
  const { name, age } = userData;
  
  const prompts = {
    'hot-fireman': `Ultra-realistic video of a muscular firefighter at a fire scene, in the style of a calendar photoshoot. Fire truck and flames in the background. The firefighter is holding a fire hose confidently with a heroic look on his face. Wearing firefighter pants, suspenders, red helmet, and no shirt showing muscular chest. The firefighter says to the camera, "Did someone call about a fire? Because things are about to get hot!" Then sprays water from the hose and says "Happy Birthday ${name}, hope your ${age}th is smokin'!" Include dramatic lighting from the fire, and a heroic, action-movie tone.`,
    
    'bigfoot-vlog': `Ultra-realistic video of Bigfoot walking fast in the woods, holding a camera in selfie mode. Natural outdoor lighting, tree's, and a mountains in the background. Bigfoot is running through the woods with a concerned expression. He says to the camera, "The worst part about getting older, is number two really creeps up on you fast!" Bigfoot chuckles, then glances to the camera and says "Happy Birthday ${name}" Include shaky handheld motion, and a humorous, lighthearted tone.`,
    
    'fake-infomercial': `A fake infomercial in the style of a Life Alert commercial. It opens with a wide shot of an elderly man lying at the bottom of a flight of stairs, looking distressed. A somber, authoritative male narrator's voice says, "Now that you're officially a senior citizen, time to look into Life Alert." The scene then transitions to the same elderly man, neatly dressed, sitting comfortably in an armchair, smiling warmly at the camera. He says directly to the camera, "Happy Birthday ${name}."`,
    
    'female-model-commercial': `Ultra-realistic video of a beautiful 21 year old female model washing her car, in the style of an Carls Jr commercial. White Jeep in the background. The model is holding an sponge with a seductive look on her face. Wearing a swimsuit, and a blonde hair. The model says to the camera, "I could use a little help birthday boy..." Then pours water on herself with a sponge and says "Happy Birthday ${name}". Include shaky handheld motion, and a humorous, lighthearted tone.`,
    
    'male-model-commercial': `Ultra-realistic video of a muscular man in a beautiful beach, in the style of an Old Spice commercial. Paradise sunshine, blue ocean and white sand beach in the background. The man is riding confidently on a brown horse with a seductive look on his face. Wearing no shirt, swim trunks, and long brown hair. The man says to the camera, "Damn, ${age} never looked so good." Then the man runs his hands through his hair, and says "Happy Birthday ${name}". Include shaky handheld motion, and a humorous, lighthearted tone.`,
    
    'breaking-news': `A young female news anchor, dressed professionally, reports live from a news desk. She looks directly at the camera with a serious but engaging expression. She says, "In tonight's headline story, the retirement home has a new Bingo champion, and it's also their birthday. Happy Birthday ${name}."`
    ,
    
    'jesus-of-nazareth': `Ultra-realistic video of Jesus in Nazareth, in the style of a youtube vlog. Time period is 30 AD, city market, city of Nazareth in the background. Jesus is holding a bible with a confused look on his face. Wearing a white gown, and long brown hair. Jesus says to the camera, "Behold, another birthday" Then throws his bible over his shoulder and says, "I usually have a bible verse when you turn ${age}, not this time, sorry aunt ${name}". Include shaky handheld motion, and a humorous, lighthearted tone.`,
    
    'fast-food-manager': `Ultra-realistic video of a angry, overweight black woman in a fast food restaurant, in the style of an Atlanta reality tv show. Restaurant kitchen in the background. The woman is standing at the front counter angry with a mad look on her face. Wearing a black shirt, small yellow cheeseburger logo, and a black hat. The woman says to the camera, "Look I don't know who you think you're talkin' to" Then grabs a cheeseburger from the counter, throws it on the ground, and says "Forget your ${age}th birthday ${name}, make your own damn cheeseburger!!!". Include shaky handheld motion, and a humorous, lighthearted tone.`,
    
    'swamp-man': `Ultra-realistic video of a chubby man in a Florida swamp, in the style of a Swamp People tv show. Brown water, bushes, and swamp in the background. The man is standing in the water confidently with a confused look on his face. Wearing no shirt, tattoos, and a mullet haircut. The man says to the camera, "Happy Birthday ${name} and lookin' good for ${age}!!!" Then goes underwater and comes out with a large crocodile in a headlock, and says "Now this is senior living". Include shaky handheld motion, and a humorous, lighthearted tone.`
  };

  return prompts[theme.id as keyof typeof prompts] || prompts['male-model-commercial'];
}

// Legacy exports for backward compatibility
export interface VideoGenerationRequest {
  userData: UserData;
  theme: Theme;
}

export interface VideoGenerationResponse {
  video_url: string;
  status: 'completed' | 'processing' | 'failed' | 'pending';
  request_id?: string;
}

// Note: These functions are now deprecated in favor of direct Netlify Function calls
// They remain here for backward compatibility but should not be used in new code
export async function generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
  console.warn('⚠️ generateVideo() is deprecated. Use Netlify Functions directly.');
  throw new Error('This function has been moved to Netlify Functions for better security');
}

export async function checkVideoStatus(requestId: string): Promise<VideoGenerationResponse> {
  console.warn('⚠️ checkVideoStatus() is deprecated. Use Netlify Functions directly.');
  throw new Error('This function has been moved to Netlify Functions for better security');
}